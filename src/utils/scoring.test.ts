import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoleReadiness, getEvidenceWeight, prioritizeSkillGaps, type UserSkill, type UserProject } from './scoring.ts';

test('getEvidenceWeight returns strictly ordered weights', () => {
  assert.equal(getEvidenceWeight('Mentor-Verified'), 1.0);
  assert.equal(getEvidenceWeight('Peer-Verified'), 0.85);
  assert.equal(getEvidenceWeight('Project-Verified'), 0.75);
  assert.equal(getEvidenceWeight('Tested'), 0.5);
  assert.equal(getEvidenceWeight('Claimed'), 0.15);
});

test('calculateRoleReadiness handles empty and perfect portfolios accurately', () => {
  const reqSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

  // Zero state
  const zeroResult = calculateRoleReadiness({
    skills: [],
    projects: [],
    requiredSkillNames: reqSkills,
  });
  assert.equal(zeroResult.skillScore, 0);
  assert.equal(zeroResult.projectScore, 0);
  assert.equal(zeroResult.missingSkills.length, 4);

  // Partial state
  const partialSkills: UserSkill[] = [
    { id: '1', name: 'React', category: 'framework', evidenceLevel: 'Project-Verified', score: 85 },
    { id: '2', name: 'TypeScript', category: 'language', evidenceLevel: 'Tested', score: 70 },
  ];
  const partialProjects: UserProject[] = [
    { id: 'p1', title: 'Task Manager', roleId: 'full-stack', status: 'Verified', score: 92 },
  ];

  const partialResult = calculateRoleReadiness({
    skills: partialSkills,
    projects: partialProjects,
    requiredSkillNames: reqSkills,
  });

  assert.ok(partialResult.overallScore > 0 && partialResult.overallScore < 100);
  assert.equal(partialResult.missingSkills.length, 2);
  assert.equal(partialResult.verifiedCount, 1);
});

test('prioritizeSkillGaps flags missing required skills as High Priority', () => {
  const skills: UserSkill[] = [
    { id: '1', name: 'React', category: 'framework', evidenceLevel: 'Project-Verified', score: 90 },
    { id: '2', name: 'TypeScript', category: 'language', evidenceLevel: 'Tested', score: 75 },
  ];

  const gaps = prioritizeSkillGaps(
    skills,
    ['React', 'TypeScript', 'Docker'],
    ['GraphQL', 'Kubernetes']
  );

  const dockerGap = gaps.find(g => g.name === 'Docker');
  assert.ok(dockerGap);
  assert.equal(dockerGap.priority, 'High Priority');

  const tsGap = gaps.find(g => g.name === 'TypeScript');
  assert.ok(tsGap);
  assert.equal(tsGap.priority, 'Medium Priority');

  const k8sGap = gaps.find(g => g.name === 'Kubernetes');
  assert.ok(k8sGap);
  assert.equal(k8sGap.priority, 'Low Priority');
});
