import test from 'node:test';
import assert from 'node:assert/strict';
import { CAREER_ROLES, INITIAL_STUDENT_PROFILE, INITIAL_USER_SKILLS } from './data/mockData.ts';
import { ROLE_ROADMAPS, getRoadmapForRole } from './data/roadmaps.ts';
import { calculateRoleReadiness, getEvidenceWeight, prioritizeSkillGaps } from './utils/scoring.ts';
import {
  generateSmartFallbackReview,
  hasConfiguredGeminiApiKey,
  getStoredGeminiApiKey,
} from './services/geminiService.ts';

test('SMOKE: Initial profile and roles integrity', () => {
  assert.ok(INITIAL_STUDENT_PROFILE.id, 'Profile must have an ID');
  assert.ok(INITIAL_STUDENT_PROFILE.name, 'Profile must have a name');
  assert.ok(CAREER_ROLES.length >= 6, 'Must have at least 6 high-demand career roles');
  
  CAREER_ROLES.forEach(role => {
    assert.ok(role.id, 'Role must have id');
    assert.ok(role.title, 'Role must have title');
    assert.ok(role.requiredSkills.length > 0, 'Role must have required skills');
  });
});

test('SMOKE: Learning paths for all career tracks are populated', () => {
  Object.keys(ROLE_ROADMAPS).forEach(roleId => {
    const modules = getRoadmapForRole(roleId);
    assert.ok(modules.length > 0, `Role ${roleId} must have at least 1 module`);
    
    modules.forEach(mod => {
      assert.ok(mod.title, 'Module must have title');
      assert.ok(mod.tasks.length > 0, 'Module must have tasks');
      mod.tasks.forEach(task => {
        assert.ok(task.title, 'Task must have title');
        assert.ok(task.taskPrompt, 'Task must have prompt');
        assert.ok(task.learningObjective, 'Task must have objective');
      });
    });
  });
});

test('SMOKE: Explanation Engine evaluates solutions and respects pass criteria', () => {
  const sampleTask = ROLE_ROADMAPS['full-stack-dev'][0].tasks[0];
  
  // 1. Incomplete code
  const poorReview = generateSmartFallbackReview({
    task: sampleTask,
    submittedCode: 'return null;',
    explanationNotes: '',
    targetRoleTitle: 'Full-Stack Developer',
  });
  assert.equal(poorReview.passed, false);
  assert.equal(poorReview.verdict, 'Needs Revision');

  // 2. Comprehensive code
  const goodReview = generateSmartFallbackReview({
    task: sampleTask,
    submittedCode: sampleTask.starterCode || 'export async function test() { return { ok: true, value: 1 }; }',
    explanationNotes: 'Explicit error handling with discriminated union.',
    targetRoleTitle: 'Full-Stack Developer',
  });
  assert.equal(goodReview.passed, true);
  assert.ok(['Passed', 'Exemplary'].includes(goodReview.verdict));
  assert.ok(goodReview.score >= 70);
  assert.ok(goodReview.edgeCases.length > 0);
});

test('SMOKE: Readiness scoring handles multiple evidence tiers accurately', () => {
  const readiness = calculateRoleReadiness({
    skills: INITIAL_USER_SKILLS,
    projects: [
      {
        id: 'proj-1',
        title: 'Realtime Task Engine',
        roleId: 'full-stack-dev',
        status: 'Verified',
        score: 92,
        demonstratedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      },
    ],
    requiredSkillNames: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design'],
  });

  assert.ok(readiness.overallScore > 40 && readiness.overallScore <= 100, 'Overall score should reflect verified project and skills');
  assert.ok(readiness.verifiedCount >= 1, 'Should reflect verified project');
});
