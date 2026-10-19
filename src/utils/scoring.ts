
export type EvidenceLevel =
  | 'Claimed'
  | 'Tested'
  | 'Project-Verified'
  | 'Peer-Verified'
  | 'Mentor-Verified';

export interface UserSkill {
  id: string;
  name: string;
  category:
    | 'language'
    | 'framework'
    | 'fundamentals'
    | 'database'
    | 'devops'
    | 'system_design';
  evidenceLevel: EvidenceLevel;
  score: number; // 0–100
  lastAssessed?: string;
  verifiedProjectId?: string;
}

export interface UserProject {
  id: string;
  title: string;
  roleId: string;
  status:
  | 'Not Started'
  | 'In Progress'
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Changes Requested'
  | 'Verified'
  | 'Rejected';

  // Skills demonstrated by this project, ideally evaluator-verified.
  demonstratedSkills?: string[];
}

export interface CalculateReadinessParams {
  skills: UserSkill[];
  projects: UserProject[];
  requiredSkillNames: string[];
  interviewScore?: number;
  assessmentScore?: number;

  // Optional role-specific importance: 1 = normal, 2 = twice as important.
  skillImportance?: Record<string, number>;
}

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

const normalize = (value: string): string =>
  value.trim().toLowerCase();

const isValidScore = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value) &&
  value >= 0 && value <= 100;

/**
 * Evidence reliability, not a direct measure of proficiency.
 */
export function getEvidenceWeight(level: EvidenceLevel): number {
  switch (level) {
    case 'Mentor-Verified':
      return 1.0;
    case 'Peer-Verified':
      return 0.85;
    case 'Project-Verified':
      return 0.75;
    case 'Tested':
      return 0.5;
    case 'Claimed':
    default:
      return 0.15;
  }
}

/**
 * Skill contribution combines proficiency and evidence reliability.
 * A claimed skill receives limited credit; a verified skill with low
 * proficiency does not receive a high score merely because it is verified.
 */
function calculateSkillContribution(skill: UserSkill): number {
  const proficiency = isValidScore(skill.score) ? skill.score : 0;
  const evidenceWeight = getEvidenceWeight(skill.evidenceLevel);

  return proficiency * evidenceWeight;
}

export function calculateRoleReadiness(params: CalculateReadinessParams): {
  overallScore: number;
  skillScore: number;
  projectScore: number;
  assessmentScore: number | null;
  missingSkills: string[];
  verifiedCount: number;
  evidenceCoverage: number;
  scoreStatus: 'provisional' | 'evidence-backed' | 'insufficient-evidence';
} {
  const {
    skills,
    projects,
    requiredSkillNames,
    interviewScore,
    assessmentScore: suppliedAssessmentScore,
    skillImportance = {},
  } = params;

  const uniqueRequiredSkills = [
    ...new Map(
      requiredSkillNames
        .map(name => name.trim())
        .filter(Boolean)
        .map(name => [normalize(name), name] as const)
    ).values(),
  ];

  if (uniqueRequiredSkills.length === 0) {
    return {
      overallScore: 0,
      skillScore: 0,
      projectScore: 0,
      assessmentScore: null,
      missingSkills: [],
      verifiedCount: 0,
      evidenceCoverage: 0,
      scoreStatus: 'insufficient-evidence',
    };
  }

  const skillsByName = new Map<string, UserSkill>();

  // If duplicates exist, prefer the record with the strongest evidence
  // and then the highest proficiency.
  for (const skill of skills) {
    const key = normalize(skill.name);
    const existing = skillsByName.get(key);

    if (
      !existing ||
      getEvidenceWeight(skill.evidenceLevel) >
        getEvidenceWeight(existing.evidenceLevel) ||
      (
        getEvidenceWeight(skill.evidenceLevel) ===
          getEvidenceWeight(existing.evidenceLevel) &&
        skill.score > existing.score
      )
    ) {
      skillsByName.set(key, skill);
    }
  }

  let weightedSkillPoints = 0;
  let totalImportance = 0;
  let evidencedImportance = 0;
  const missingSkills: string[] = [];
  let verifiedCount = 0;

  for (const name of uniqueRequiredSkills) {
    const key = normalize(name);
    const importanceValue = skillImportance[key] ??
      skillImportance[name] ?? 1;
    const importance = Number.isFinite(importanceValue)
      ? Math.max(0.1, importanceValue)
      : 1;

    totalImportance += importance;

    const found = skillsByName.get(key);

    if (!found) {
      missingSkills.push(name);
      continue;
    }

    weightedSkillPoints +=
      calculateSkillContribution(found) * importance;

    if (found.evidenceLevel !== 'Claimed') {
      evidencedImportance += importance;
    }

    if (
      ['Project-Verified', 'Peer-Verified', 'Mentor-Verified']
        .includes(found.evidenceLevel)
    ) {
      verifiedCount++;
    }
  }

  const skillScore = totalImportance > 0
    ? Math.round(weightedSkillPoints / totalImportance)
    : 0;

  const evidenceCoverage = totalImportance > 0
    ? Math.round((evidencedImportance / totalImportance) * 100)
    : 0;

  // Only verified projects with explicit role-skill overlap count as
  // relevant. A project without demonstratedSkills gets no relevance
  // credit until its relationship to the role can be established.
  const requiredKeys = new Set(uniqueRequiredSkills.map(normalize));

  const relevantVerifiedProjects = projects.filter(project => {
    if (project.status !== 'Verified') return false;

    const demonstrated = project.demonstratedSkills ?? [];
    const overlaps = demonstrated.some(skill =>
      requiredKeys.has(normalize(skill))
    );

    return overlaps && isValidScore(project.score);
  });

  // Project quality is based on verified project evaluation scores.
  // Two strong relevant projects can reach 100; unrelated projects cannot.
  const projectQuality = relevantVerifiedProjects.length > 0
    ? relevantVerifiedProjects.reduce(
        (sum, project) => sum + (project.score ?? 0), 0
      ) / relevantVerifiedProjects.length
    : 0;

  const projectQuantityFactor = Math.min(
    1,
    relevantVerifiedProjects.length / 2
  );

  const projectScore = Math.round(
    projectQuality * projectQuantityFactor
  );

  // Assessments are optional: do not invent a default interview result.
  const validAssessmentScores = [
    suppliedAssessmentScore,
    interviewScore,
  ].filter(isValidScore);

  const actualAssessmentScore = validAssessmentScores.length > 0
    ? validAssessmentScores.reduce((sum, score) => sum + score, 0) /
      validAssessmentScores.length
    : null;

  const assessmentResult = actualAssessmentScore === null
    ? null
    : Math.round(actualAssessmentScore);

  // Evidence-aware weighted average. Unavailable assessments are excluded
  // and the remaining component weights are normalized.
  const components = [
    { score: skillScore, weight: 0.5 },
    {
      score: projectScore,
      weight: 0.3,
      available: relevantVerifiedProjects.length > 0,
    },
    {
      score: assessmentResult ?? 0,
      weight: 0.2,
      available: assessmentResult !== null,
    },
  ];

  let weightedTotal = 0;
  let availableWeight = 0;

  for (const component of components) {
    const available =
      !('available' in component) || component.available;

    if (available) {
      weightedTotal += component.score * component.weight;
      availableWeight += component.weight;
    }
  }

  const overallScore = availableWeight > 0
    ? Math.round(weightedTotal / availableWeight)
    : 0;

  const hasVerifiedEvidence =
    verifiedCount > 0 ||
    relevantVerifiedProjects.length > 0 ||
    assessmentResult !== null;

  return {
    overallScore: clamp(overallScore),
    skillScore: clamp(skillScore),
    projectScore: clamp(projectScore),
    assessmentScore: assessmentResult,
    missingSkills,
    verifiedCount,
    evidenceCoverage,
    scoreStatus: !hasVerifiedEvidence
      ? 'insufficient-evidence'
      : assessmentResult === null ||
        relevantVerifiedProjects.length === 0
        ? 'provisional'
        : 'evidence-backed',
  };
}

/**
 * Prioritizes required gaps above preferred gaps.
 * Skills that are merely claimed or have weak proficiency are also surfaced.
 */
export function prioritizeSkillGaps(
  skills: UserSkill[],
  requiredSkillNames: string[],
  preferredSkillNames: string[]
): Array<{
  name: string;
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  currentLevel: EvidenceLevel;
  reason: string;
}> {
  const results: Array<{
    name: string;
    priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
    currentLevel: EvidenceLevel;
    reason: string;
  }> = [];

  const skillsByName = new Map(
    skills.map(skill => [normalize(skill.name), skill])
  );

  const seen = new Set<string>();

  for (const name of requiredSkillNames) {
    const key = normalize(name);
    if (seen.has(key)) continue;
    seen.add(key);

    const found = skillsByName.get(key);
    const level = found?.evidenceLevel ?? 'Claimed';

    if (!found || level === 'Claimed') {
      results.push({
        name,
        priority: 'High Priority',
        currentLevel: level,
        reason: 'Required skill has no reliable demonstrated evidence yet.',
      });
    } else if (
      found.score < 60 ||
      level === 'Tested'
    ) {
      results.push({
        name,
        priority: found.score < 40
          ? 'High Priority'
          : 'Medium Priority',
        currentLevel: level,
        reason: found.score < 60
          ? 'Current proficiency is below the target level.'
          : 'Tested skill would benefit from project-based evidence.',
      });
    } else if (
      level === 'Project-Verified' ||
      level === 'Peer-Verified'
    ) {
      // No gap is returned for sufficiently demonstrated skills.
      continue;
    }
  }

  for (const name of preferredSkillNames) {
    const key = normalize(name);
    if (seen.has(key)) continue;
    seen.add(key);

    const found = skillsByName.get(key);
    const level = found?.evidenceLevel ?? 'Claimed';

    if (!found || level === 'Claimed' || found.score < 60) {
      results.push({
        name,
        priority: 'Low Priority',
        currentLevel: level,
        reason: 'Preferred skill that can strengthen the role profile.',
      });
    }
  }

  return results;
}
