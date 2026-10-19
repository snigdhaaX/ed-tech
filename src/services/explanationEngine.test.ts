import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSmartFallbackReview,
  generateSmartFallbackInterviewReview,
  getStoredGeminiApiKey,
  saveStoredGeminiApiKey,
  hasConfiguredGeminiApiKey,
} from './geminiService.ts';
import { RoadmapTask } from '../types';

test('generateSmartFallbackReview returns valid structured rubric review', () => {
  const dummyTask: RoadmapTask = {
    id: 'test-task-1',
    moduleId: 'mod-1',
    title: 'TypeScript Generics Wrapper',
    description: 'Implement a type-safe generic fetch wrapper',
    skillsCovered: ['TypeScript'],
    estimatedHours: 4,
    difficulty: 'Intermediate',
    status: 'available',
    prerequisites: [],
    learningObjective: 'Master generic constraints and type predicates',
    resources: [],
    taskPrompt: 'Create a typed fetchWithSchema utility returning Result<T, AppError>',
    evaluationCriteria: [
      'Uses TypeScript generics without unsafe any casting',
      'Handles both network rejection and parsing failure',
      'Returns a discriminated union type',
    ],
  };

  const code = `
    type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
    export async function fetchWithSchema<T>(url: string, validate: (d: unknown) => d is T): Promise<Result<T, Error>> {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (validate(data)) return { ok: true, value: data };
        return { ok: false, error: new Error('Validation failed') };
      } catch (err: any) {
        return { ok: false, error: err };
      }
    }
  `;

  const review = generateSmartFallbackReview({
    task: dummyTask,
    submittedCode: code,
    explanationNotes: 'Separated network rejection from schema format error.',
    targetRoleTitle: 'Full-Stack Developer',
  });

  assert.ok(review.id.startsWith('rev-'));
  assert.equal(review.taskId, 'test-task-1');
  assert.ok(review.score >= 0 && review.score <= 100);
  assert.equal(typeof review.passed, 'boolean');
  assert.ok(['Exemplary', 'Passed', 'Needs Revision'].includes(review.verdict));
  assert.ok(review.conceptMastery.length > 10);
  assert.ok(review.codeQuality.length > 10);
  assert.ok(Array.isArray(review.edgeCases) && review.edgeCases.length > 0);
  assert.ok(review.suggestedImprovements.length > 10);
});

test('generateSmartFallbackReview scores empty/minimal submissions lower', () => {
  const dummyTask: RoadmapTask = {
    id: 'test-task-2',
    moduleId: 'mod-1',
    title: 'Minimal Task',
    description: 'A task',
    skillsCovered: ['React'],
    estimatedHours: 2,
    difficulty: 'Beginner',
    status: 'available',
    prerequisites: [],
    learningObjective: 'Objective',
    resources: [],
    taskPrompt: 'Write code',
    evaluationCriteria: ['Criterion 1'],
  };

  const review = generateSmartFallbackReview({
    task: dummyTask,
    submittedCode: 'const x = 1;',
    explanationNotes: '',
    targetRoleTitle: 'Frontend Developer',
  });

  assert.ok(review.score < 70, `Expected score < 70 for incomplete code, got ${review.score}`);
  assert.equal(review.passed, false);
  assert.equal(review.verdict, 'Needs Revision');
});

test('generateSmartFallbackInterviewReview produces structured rubric evaluation without random numbers', () => {
  const result = generateSmartFallbackInterviewReview({
    interviewType: 'Project Defense',
    roleTitle: 'Full-Stack Developer',
    question: 'How did you prevent race conditions when two clients updated the same entity concurrently?',
    studentAnswer: 'We used Redis Lua atomic transactions to ensure decrement and check occurred in a single cycle without lock interleaving, therefore preventing race conditions and mitigating latency overhead.',
  });

  assert.ok(result.score >= 75 && result.score <= 100);
  assert.ok(result.accuracy.length > 5);
  assert.ok(result.clarity.length > 5);
  assert.ok(Array.isArray(result.strengths) && result.strengths.length > 0);
  assert.ok(Array.isArray(result.improvements));
  assert.ok(result.modelUsed.includes('SkillProof'));
});

