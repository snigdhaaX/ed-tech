
import ast
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

import fitz
import pandas as pd
from docx import Document
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "data" / "job_dataset.csv"
MAX_FILE_SIZE = 8 * 1024 * 1024

app = FastAPI(
    title="Career Skill Analysis API",
    description="Resume parsing, job recommendations and readiness analysis.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ---------- Text and dataset utilities ----------

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", str(text).lower()).strip()


def parse_list(value: Any) -> list[str]:
    """Read list-like CSV cells, including JSON/Python list strings."""
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]

    if pd.isna(value):
        return []

    text = str(value).strip()
    if not text:
        return []

    try:
        parsed = ast.literal_eval(text)
        if isinstance(parsed, list):
            return [
                str(item).strip()
                for item in parsed
                if str(item).strip()
            ]
    except (ValueError, SyntaxError):
        pass

    return [item.strip() for item in text.split(";") if item.strip()]


def unique_strings(values: list[str]) -> list[str]:
    """Deduplicate case-insensitively while preserving display names."""
    result = []
    seen = set()

    for value in values:
        value = str(value).strip()
        key = normalize(value)

        if key and key not in seen:
            seen.add(key)
            result.append(value)

    return result


@lru_cache(maxsize=1)
def load_job_index():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}. "
            "Place job_dataset.csv in ml-service/data/."
        )

    jobs = pd.read_csv(DATASET_PATH)

    required_columns = {
        "Title",
        "ExperienceLevel",
        "YearsOfExperience",
        "Skills",
        "Responsibilities",
        "Keywords",
    }

    missing_columns = required_columns - set(jobs.columns)

    if missing_columns:
        raise ValueError(
            f"Dataset is missing columns: {sorted(missing_columns)}"
        )

    jobs = jobs.fillna("")

    # Convert CSV list strings into actual Python lists.
    for column in ("Skills", "Responsibilities", "Keywords"):
        jobs[column] = jobs[column].apply(parse_list)

    jobs = jobs[jobs["Title"].astype(str).str.strip() != ""].copy()

    jobs["job_text"] = jobs.apply(
        lambda row: " ".join([
            str(row["Title"]),
            str(row["ExperienceLevel"]),
            " ".join(row["Skills"]),
            " ".join(row["Responsibilities"]),
            " ".join(row["Keywords"]),
        ]),
        axis=1,
    )

    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2),
        sublinear_tf=True,
        max_features=50000,
    )

    job_matrix = vectorizer.fit_transform(jobs["job_text"])

    # A dataset-derived vocabulary for resume skill extraction.
    skill_vocabulary = unique_strings([
        skill
        for items in jobs["Skills"]
        for skill in items
    ] + [
        keyword
        for items in jobs["Keywords"]
        for keyword in items
    ])

    # Match longer phrases first to reduce partial matches.
    skill_patterns = []

    for skill in sorted(skill_vocabulary, key=len, reverse=True):
        escaped = re.escape(skill).replace(r"\ ", r"\s+")
        pattern = re.compile(
            rf"(?<![A-Za-z0-9]){escaped}(?![A-Za-z0-9])",
            re.IGNORECASE,
        )
        skill_patterns.append((skill, pattern))

    return jobs, vectorizer, job_matrix, skill_patterns


# ---------- Resume parsing ----------

def extract_pdf_text(content: bytes) -> str:
    try:
        with fitz.open(stream=content, filetype="pdf") as pdf:
            return "\n".join(page.get_text() for page in pdf)
    except Exception as exc:
        raise ValueError("The PDF could not be read.") from exc


def extract_docx_text(content: bytes) -> str:
    from io import BytesIO

    try:
        document = Document(BytesIO(content))

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        table_text = [
            cell.text
            for table in document.tables
            for row in table.rows
            for cell in row.cells
            if cell.text.strip()
        ]

        return "\n".join(paragraphs + table_text)
    except Exception as exc:
        raise ValueError("The DOCX file could not be read.") from exc


def extract_resume_text(filename: str, content: bytes) -> str:
    extension = Path(filename).suffix.lower()

    if extension == ".pdf":
        text = extract_pdf_text(content)
    elif extension == ".docx":
        text = extract_docx_text(content)
    else:
        raise ValueError("Upload a PDF or DOCX resume.")

    text = text.strip()

    if len(text) < 40:
        raise ValueError(
            "Very little text was extracted. "
            "The PDF may be scanned or image-based."
        )

    return text


def extract_resume_skills(
    resume_text: str,
    skill_patterns: list,
) -> list[str]:
    found = []

    for display_name, pattern in skill_patterns:
        if pattern.search(resume_text):
            found.append(display_name)

    return unique_strings(found)


def extract_resume_sections(resume_text: str) -> dict:
    """
    Lightweight section detection.
    This is a heuristic, not a trained resume-section classifier.
    """
    headings = {
        "projects": (
            r"projects?|personal projects|academic projects|"
            r"project experience"
        ),
        "experience": (
            r"experience|work experience|professional experience|"
            r"internships?|employment history"
        ),
        "education": r"education|academic background|qualifications",
    }

    detected = {}

    for section, alternatives in headings.items():
        detected[section] = bool(
            re.search(
                rf"(?im)^\s*(?:{alternatives})\s*:?\s*$",
                resume_text,
            )
        )

    return detected


# ---------- Recommendation and readiness ----------

def recommend_jobs(
    resume_text: str,
    resume_skills: list[str],
    jobs: pd.DataFrame,
    vectorizer: TfidfVectorizer,
    job_matrix,
    top_k: int = 5,
) -> list[dict]:
    resume_vector = vectorizer.transform([resume_text])
    similarities = cosine_similarity(
        resume_vector,
        job_matrix,
    ).ravel()

    skill_set = {normalize(skill) for skill in resume_skills}

    scored_jobs = jobs.copy()
    scored_jobs["similarity"] = similarities

    # Collapse duplicate descriptions into distinct job profiles.
    grouped = {}

    for index, row in scored_jobs.iterrows():
        title = str(row["Title"]).strip()
        experience = str(row["ExperienceLevel"]).strip()
        group_key = (normalize(title), normalize(experience))

        row_skills = unique_strings(
            row["Skills"] + row["Keywords"]
        )

        matched = [
            skill for skill in row_skills
            if normalize(skill) in skill_set
        ]

        if row_skills:
            overlap = len({
                normalize(skill) for skill in row_skills
            } & skill_set) / len({
                normalize(skill) for skill in row_skills
            })
        else:
            overlap = 0.0

        # Content similarity + explicit skill overlap.
        match_score = (
            0.60 * float(row["similarity"])
            + 0.40 * overlap
        ) * 100

        candidate = {
            "job_id": str(row.get("JobID", index)),
            "title": title,
            "experience_level": experience,
            "years_of_experience": str(row["YearsOfExperience"]),
            "match_score": round(match_score, 1),
            "similarity_score": round(
                float(row["similarity"]) * 100, 1
            ),
            "matched_skills": matched,
            "required_skills": row_skills,
            "responsibilities": row["Responsibilities"][:5],
            "keywords": row["Keywords"],
        }

        existing = grouped.get(group_key)

        if existing is None:
            grouped[group_key] = candidate
        else:
            # Union requirements across similar descriptions.
            existing["required_skills"] = unique_strings(
                existing["required_skills"] + row_skills
            )

            existing["matched_skills"] = [
                skill for skill in existing["required_skills"]
                if normalize(skill) in skill_set
            ]

            if candidate["match_score"] > existing["match_score"]:
                candidate["required_skills"] = existing["required_skills"]
                candidate["matched_skills"] = existing["matched_skills"]
                grouped[group_key] = candidate

    recommendations = []

    for job in grouped.values():
        required = {
            normalize(skill) for skill in job["required_skills"]
        }
        matched = {
            normalize(skill) for skill in job["matched_skills"]
        }

        job["missing_skills"] = [
            skill for skill in job["required_skills"]
            if normalize(skill) not in matched
        ]

        job["skill_coverage"] = round(
            100 * len(required & matched) / len(required), 1
        ) if required else 0.0

        recommendations.append(job)

    recommendations.sort(
        key=lambda item: item["match_score"],
        reverse=True,
    )

    return recommendations[:max(1, min(top_k, 10))]


def calculate_initial_readiness(
    resume_text: str,
    recommendation: dict,
    sections: dict,
) -> dict:
    """
    Provisional resume-based estimate, NOT a hiring probability.
    Skill evidence from a resume is unverified.
    """
    skill_coverage = recommendation["skill_coverage"]

    project_evidence = (
        100 if sections["projects"] else
        40 if re.search(r"\bproject\b", resume_text, re.I) else
        0
    )

    experience_evidence = (
        100 if sections["experience"] else
        40 if re.search(
            r"\b(intern|internship|professional experience|employment)\b",
            resume_text,
            re.I,
        ) else
        0
    )

    score = round(
        0.70 * skill_coverage
        + 0.20 * project_evidence
        + 0.10 * experience_evidence
    )

    return {
        "score": score,
        "label": "Provisional resume-based estimate",
        "breakdown": {
            "skill_coverage": round(skill_coverage, 1),
            "project_evidence": project_evidence,
            "experience_evidence": experience_evidence,
        },
        "limitations": [
            "Resume claims have not been independently verified.",
            "Project quality has not been evaluated.",
            "The score is not a probability of getting hired.",
        ],
    }


# ---------- API endpoints ----------

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "dataset_exists": DATASET_PATH.exists(),
    }


@app.post("/api/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    top_k: int = 5,
):
    if not file.filename:
        raise HTTPException(400, "Please select a resume file.")

    if Path(file.filename).suffix.lower() not in {".pdf", ".docx"}:
        raise HTTPException(400, "Only PDF and DOCX resumes are supported.")

    content = await file.read(MAX_FILE_SIZE + 1)
    await file.close()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "Resume must be 8 MB or smaller.")

    try:
        resume_text = extract_resume_text(file.filename, content)
        jobs, vectorizer, job_matrix, skill_patterns = load_job_index()

        resume_skills = extract_resume_skills(
            resume_text,
            skill_patterns,
        )

        sections = extract_resume_sections(resume_text)

        recommendations = recommend_jobs(
            resume_text,
            resume_skills,
            jobs,
            vectorizer,
            job_matrix,
            top_k,
        )

        if not recommendations:
            raise HTTPException(
                422,
                "No suitable job profiles were found in the dataset.",
            )

        best_match = recommendations[0]

        readiness = calculate_initial_readiness(
            resume_text,
            best_match,
            sections,
        )

        return {
            "filename": Path(file.filename).name,
            "extracted_profile": {
                "skills": resume_skills,
                "sections_detected": sections,
                "text_characters": len(resume_text),
            },
            "recommended_role": best_match,
            "recommendations": recommendations,
            "readiness": readiness,
            "next_step": {
                "action": "review_recommendation",
                "message": (
                    "Review the recommended job profiles and select "
                    "your target role before generating a learning roadmap."
                ),
            },
        }

    except HTTPException:
        raise
    except FileNotFoundError as exc:
        raise HTTPException(503, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            500,
            "Resume analysis failed. Check the backend logs.",
        ) from exc


class JobDescriptionAnalysisRequest(BaseModel):
    jd_text: str
    user_skills: list[str] = []


@app.post("/api/analyze-jd")
def analyze_job_description(request: JobDescriptionAnalysisRequest):
    jd_text = request.jd_text.strip()
    if not jd_text:
        raise HTTPException(400, "Please provide job description text.")

    try:
        jobs, vectorizer, job_matrix, skill_patterns = load_job_index()
        extracted = extract_resume_skills(jd_text, skill_patterns)

        jd_vector = vectorizer.transform([jd_text])
        similarities = cosine_similarity(jd_vector, job_matrix).ravel()
        best_idx = int(similarities.argmax())
        best_match_job = jobs.iloc[best_idx]

        user_skill_set = {normalize(s) for s in request.user_skills}

        matched = []
        missing = []
        for sk in extracted:
            if normalize(sk) in user_skill_set:
                matched.append(sk)
            else:
                missing.append(sk)

        total = len(extracted) or 1
        alignment = round((len(matched) / total) * 100)

        recommended_focus = missing[0] if missing else (extracted[0] if extracted else "System Architecture")

        return {
            "alignment": alignment,
            "extracted_count": len(extracted),
            "extracted_skills": extracted,
            "matched": matched,
            "missing": missing,
            "recommended_focus": recommended_focus,
            "top_matching_job": str(best_match_job["Title"]),
            "top_match_similarity": round(float(similarities[best_idx]) * 100, 1),
        }
    except Exception as exc:
        raise HTTPException(500, f"JD analysis failed: {str(exc)}") from exc

