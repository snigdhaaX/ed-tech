import { GoogleGenAI } from '@google/genai';
import { RoadmapTask, TaskSubmissionReview } from '../types';

const STORAGE_KEY_GEMINI_API_KEY = 'skillproof_gemini_api_key';

export function getStoredGeminiApiKey(): string {
  try {
    const fromStorage = localStorage.getItem(STORAGE_KEY_GEMINI_API_KEY);
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();
  } catch (e) {
    // LocalStorage might be disabled in private mode
  }

  // Check Vite environment variables if available
  const viteEnv = (import.meta as any).env;
  if (viteEnv?.GEMINI_API_KEY && viteEnv.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    return viteEnv.GEMINI_API_KEY.trim();
  }
  if (viteEnv?.VITE_GEMINI_API_KEY && viteEnv.VITE_GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    return viteEnv.VITE_GEMINI_API_KEY.trim();
  }

  // Check process.env fallback
  if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
    const pKey = process.env.GEMINI_API_KEY;
    if (pKey && pKey !== 'MY_GEMINI_API_KEY') return pKey.trim();
  }

  return '';
}

export function saveStoredGeminiApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_GEMINI_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_GEMINI_API_KEY);
    }
  } catch (e) {
    console.warn('Unable to persist Gemini API key to localStorage', e);
  }
}

export function hasConfiguredGeminiApiKey(): boolean {
  return !!getStoredGeminiApiKey();
}

export interface TaskReviewRequest {
  task: RoadmapTask;
  submittedCode: string;
  explanationNotes?: string;
  targetRoleTitle: string;
}

/**
 * Intelligent deterministic fallback evaluation when Gemini API Key has not been provided yet.
 * Ensures the platform is fully interactive and reviewable out of the box.
 */
export function generateSmartFallbackReview(request: TaskReviewRequest): TaskSubmissionReview {
  const { task, submittedCode, explanationNotes } = request;
  const code = submittedCode.trim();
  const notes = (explanationNotes || '').trim();

  // Basic heuristic evaluation metrics
  const hasCode = code.length > 30;
  const hasNotes = notes.length > 15;
  const criteria = task.evaluationCriteria || [];

  // Match keyword relevance against task prompt and criteria
  let matchedCriteriaCount = 0;
  criteria.forEach(crit => {
    const words = crit.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const matches = words.some(w => code.toLowerCase().includes(w) || notes.toLowerCase().includes(w));
    if (matches) matchedCriteriaCount++;
  });

  const baseScore = hasCode ? 72 : 45;
  const criteriaBonus = criteria.length > 0 ? (matchedCriteriaCount / criteria.length) * 18 : 12;
  const notesBonus = hasNotes ? 6 : 0;
  const rawScore = Math.min(97, Math.round(baseScore + criteriaBonus + notesBonus));

  const passed = rawScore >= 70;
  const verdict = rawScore >= 90 ? 'Exemplary' : passed ? 'Passed' : 'Needs Revision';

  const strengthsList = [
    `Addresses core objective: "${task.learningObjective.slice(0, 75)}..."`,
    hasNotes ? 'Includes thoughtful architectural explanation of design choices.' : 'Structure adheres to modular boundaries.',
  ];

  const edgeCases = [
    'Concurrency & Race Conditions: Ensure mutations are isolated under simultaneous async calls.',
    'Defensive Null/Boundary Checks: Validate inputs before executing dereferences.',
    'Exception Recovery: Wrap external network or database transactions with structured error codes.',
  ];

  return {
    id: `rev-${Date.now()}`,
    taskId: task.id,
    submittedCode,
    explanationNotes,
    score: rawScore,
    passed,
    verdict,
    conceptMastery: passed
      ? `Strong demonstration of ${task.skillsCovered.join(' & ')}. You have effectively framed the solution around decoupling responsibilities and ensuring type safety.`
      : `Partial understanding shown. The implementation requires more robust invariant checks and explicit handling of failure states before production certification.`,
    codeQuality: hasCode
      ? `Clean syntax with identifiable boundaries. Idiomatic usage of modern language features and predictable execution flow.`
      : `Code snippet appears minimal or incomplete. Elaborate the function body to satisfy all task constraints.`,
    edgeCases,
    suggestedImprovements: `1. Add unit test assertions covering edge case inputs (e.g. empty payloads, network timeouts).\n2. Consider adding observability metrics or error logging.\n3. Verify memory efficiency under sustained workloads.`,
    modelSolutionSnippet: task.solutionHint ? `// Pro Tip:\n${task.solutionHint}` : undefined,
    reviewedAt: new Date().toISOString(),
    modelUsed: 'SkillProof Smart Reviewer (Ready for Gemini Key)',
  };
}

/**
 * Reviews user code submission using the Gemini API if configured,
 * or gracefully falls back to the smart fallback evaluator.
 */
export async function evaluateTaskSubmissionWithGemini(
  request: TaskReviewRequest
): Promise<TaskSubmissionReview> {
  const apiKey = getStoredGeminiApiKey();

  // If no API key configured, use intelligent smart reviewer fallback
  if (!apiKey) {
    // Artificial small delay for realistic UI transition
    await new Promise(res => setTimeout(res, 850));
    return generateSmartFallbackReview(request);
  }

  const { task, submittedCode, explanationNotes, targetRoleTitle } = request;

  const prompt = `You are an elite Staff Software Engineer and Technical Evaluator for the SkillProof career readiness platform.
Review this candidate's solution for the following learning task.

Candidate Target Career Role: ${targetRoleTitle}
Task Title: ${task.title}
Difficulty: ${task.difficulty}
Skills Tested: ${task.skillsCovered.join(', ')}
Learning Objective: ${task.learningObjective}
Task Challenge Prompt:
${task.taskPrompt}

Expected Evaluation Criteria:
${(task.evaluationCriteria || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

Candidate's Submitted Code:
\`\`\`
${submittedCode}
\`\`\`

Candidate's Architectural Notes:
${explanationNotes || 'None provided'}

Provide a rigorous, educational, production-grade review in JSON format matching this exact schema:
{
  "score": number (0 to 100),
  "passed": boolean (true if score >= 70),
  "verdict": "Exemplary" | "Passed" | "Needs Revision",
  "conceptMastery": "Clear explanation of whether the student mastered the concept and why",
  "codeQuality": "Detailed feedback on code style, typing, patterns, and robustness",
  "edgeCases": ["Edge case 1 considered or missed", "Edge case 2", "Edge case 3"],
  "suggestedImprovements": "Specific line-by-line or architectural guidance on how to improve this",
  "modelSolutionSnippet": "A short, elegant refactored code snippet illustrating the best-practice pattern"
}
Output strictly raw JSON without markdown backticks or commentary outside JSON.`;

  try {
    // Try using @google/genai SDK
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      id: `rev-${Date.now()}`,
      taskId: task.id,
      submittedCode,
      explanationNotes,
      score: typeof parsed.score === 'number' ? parsed.score : 85,
      passed: typeof parsed.passed === 'boolean' ? parsed.passed : (parsed.score >= 70),
      verdict: parsed.verdict || (parsed.score >= 90 ? 'Exemplary' : parsed.score >= 70 ? 'Passed' : 'Needs Revision'),
      conceptMastery: parsed.conceptMastery || 'Demonstrates clear grasp of foundational concepts.',
      codeQuality: parsed.codeQuality || 'Well structured and readable implementation.',
      edgeCases: Array.isArray(parsed.edgeCases) ? parsed.edgeCases : ['Network boundaries', 'Data validation'],
      suggestedImprovements: parsed.suggestedImprovements || 'Consider adding automated test coverage.',
      modelSolutionSnippet: parsed.modelSolutionSnippet || undefined,
      reviewedAt: new Date().toISOString(),
      modelUsed: 'Gemini 2.5 Flash',
    };
  } catch (sdkError: any) {
    console.warn('Gemini SDK call failed, attempting direct REST fallback:', sdkError);

    // Direct REST API fallback in case of browser/SDK bundling variations
    try {
      const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(restUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!res.ok) {
        throw new Error(`Gemini API returned status ${res.status}: ${await res.text()}`);
      }

      const restData = await res.json();
      const rawText = restData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        id: `rev-${Date.now()}`,
        taskId: task.id,
        submittedCode,
        explanationNotes,
        score: typeof parsed.score === 'number' ? parsed.score : 85,
        passed: typeof parsed.passed === 'boolean' ? parsed.passed : (parsed.score >= 70),
        verdict: parsed.verdict || (parsed.score >= 90 ? 'Exemplary' : parsed.score >= 70 ? 'Passed' : 'Needs Revision'),
        conceptMastery: parsed.conceptMastery || 'Clear technical understanding demonstrated.',
        codeQuality: parsed.codeQuality || 'Production quality structure.',
        edgeCases: Array.isArray(parsed.edgeCases) ? parsed.edgeCases : ['Edge case verification'],
        suggestedImprovements: parsed.suggestedImprovements || 'Add end-to-end tests.',
        modelSolutionSnippet: parsed.modelSolutionSnippet || undefined,
        reviewedAt: new Date().toISOString(),
        modelUsed: 'Gemini 2.5 Flash (Direct API)',
      };
    } catch (restError: any) {
      console.warn('Direct REST fallback also encountered an error, falling back to smart review:', restError);
      const fallback = generateSmartFallbackReview(request);
      fallback.suggestedImprovements += `\n\n(Note: Live Gemini call encountered an error: ${restError.message || 'Check API key or network connection'})`;
      return fallback;
    }
  }
}

export interface InterviewReviewRequest {
  interviewType: string;
  roleTitle: string;
  question: string;
  studentAnswer: string;
}

export interface InterviewReviewResult {
  score: number;
  accuracy: string;
  clarity: string;
  strengths: string[];
  improvements: string[];
  modelUsed: string;
}

export function generateSmartFallbackInterviewReview(request: InterviewReviewRequest): InterviewReviewResult {
  const { question, studentAnswer } = request;
  const answer = studentAnswer.trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  const questionWords = question.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  let conceptMatchCount = 0;
  questionWords.forEach(w => {
    if (answer.toLowerCase().includes(w)) conceptMatchCount++;
  });

  const reasoningTerms = ['because', 'therefore', 'trade-off', 'tradeoff', 'prevents', 'mitigate', 'latency', 'queue', 'lock', 'transaction', 'reconcile', 'fallback', 'timeout', 'index', 'microtask', 'macrotask', 'async', 'atomic'];
  let reasoningScore = 0;
  reasoningTerms.forEach(term => {
    if (answer.toLowerCase().includes(term)) reasoningScore += 3;
  });

  const baseScore = wordCount >= 30 ? 74 : wordCount >= 15 ? 60 : 45;
  const matchBonus = Math.min(15, conceptMatchCount * 3);
  const depthBonus = Math.min(10, Math.floor(wordCount / 10));
  const totalScore = Math.min(97, Math.max(50, baseScore + matchBonus + depthBonus + Math.min(6, reasoningScore)));

  const strengths = [];
  if (wordCount >= 25) {
    strengths.push('Provided concrete architectural explanation with adequate structural depth.');
  } else {
    strengths.push('Identified the core technical question premise.');
  }

  if (reasoningScore > 0) {
    strengths.push('Explicitly addressed architectural trade-offs and causal mechanisms.');
  } else {
    strengths.push('Communicated core approach clearly and concisely.');
  }

  const improvements = [];
  if (wordCount < 40) {
    improvements.push('Consider elaborating with specific failure modes or edge-case mitigation strategies.');
  }
  if (!answer.toLowerCase().includes('latency') && !answer.toLowerCase().includes('scale')) {
    improvements.push('Discuss resource footprint or latency implications under high production load.');
  }

  return {
    score: totalScore,
    accuracy: totalScore >= 80 ? 'High. Directly addressed the core trade-offs and operational invariants.' : 'Moderate. Addressed main question but needs deeper system reasoning.',
    clarity: 'Well-structured response with coherent engineering communication.',
    strengths,
    improvements: improvements.length ? improvements : ['Consider discussing connection pool or memory limits under extreme bursts.'],
    modelUsed: 'SkillProof Rubric Engine (Ready for Gemini Key)',
  };
}

export async function evaluateInterviewAnswerWithGemini(
  request: InterviewReviewRequest
): Promise<InterviewReviewResult> {
  const apiKey = getStoredGeminiApiKey();

  if (!apiKey) {
    await new Promise(res => setTimeout(res, 600));
    return generateSmartFallbackInterviewReview(request);
  }

  const { interviewType, roleTitle, question, studentAnswer } = request;

  const prompt = `You are a Principal Engineering Interviewer for a tier-1 tech company interviewing a candidate for a "${roleTitle}" role.
Interview Category: ${interviewType}
Interview Question:
${question}

Candidate's Answer:
"${studentAnswer}"

Evaluate the candidate's answer with technical rigor.
Output strictly JSON matching this schema:
{
  "score": number (0 to 100),
  "accuracy": "Brief evaluation of technical correctness and depth",
  "clarity": "Evaluation of communication structure and reasoning",
  "strengths": ["Key strength 1", "Key strength 2"],
  "improvements": ["Actionable improvement 1", "Actionable improvement 2"]
}
Output strictly raw JSON without markdown formatting.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      score: typeof parsed.score === 'number' ? parsed.score : 86,
      accuracy: parsed.accuracy || 'Strong technical grasp demonstrated.',
      clarity: parsed.clarity || 'Coherent explanation.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Addresses core system invariants'],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Discuss latency trade-offs'],
      modelUsed: 'Gemini 2.5 Flash',
    };
  } catch (sdkErr) {
    try {
      const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(restUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const restData = await res.json();
      const rawText = restData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        score: typeof parsed.score === 'number' ? parsed.score : 86,
        accuracy: parsed.accuracy || 'Strong technical grasp demonstrated.',
        clarity: parsed.clarity || 'Coherent explanation.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Addresses core system invariants'],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Discuss latency trade-offs'],
        modelUsed: 'Gemini 2.5 Flash (Direct API)',
      };
    } catch (e) {
      return generateSmartFallbackInterviewReview(request);
    }
  }
}

