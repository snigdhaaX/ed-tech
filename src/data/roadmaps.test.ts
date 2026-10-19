import test from 'node:test';
import assert from 'node:assert/strict';
import { ROLE_ROADMAPS, getRoadmapForRole } from './roadmaps.ts';

test('ROLE_ROADMAPS contains high-demand engineering career roles', () => {
  const roles = ['full-stack-dev', 'frontend-dev', 'backend-dev', 'aiml-engineer', 'data-scientist', 'devops-engineer'];
  
  for (const roleId of roles) {
    const modules = getRoadmapForRole(roleId);
    assert.ok(Array.isArray(modules) && modules.length > 0, `Expected modules for role ${roleId}`);
    
    for (const mod of modules) {
      assert.ok(mod.id && mod.title, `Module in ${roleId} must have id and title`);
      assert.ok(Array.isArray(mod.tasks) && mod.tasks.length > 0, `Module ${mod.id} must have tasks`);

      for (const task of mod.tasks) {
        assert.ok(task.id, 'Task must have an id');
        assert.ok(task.title, 'Task must have a title');
        assert.ok(task.taskPrompt, 'Task must have a taskPrompt');
        assert.ok(task.learningObjective, 'Task must have a learningObjective');
        assert.ok(Array.isArray(task.skillsCovered) && task.skillsCovered.length > 0, 'Task must list skillsCovered');
        assert.ok(task.estimatedHours > 0, 'Task must specify estimatedHours');
        assert.ok(['Beginner', 'Intermediate', 'Advanced'].includes(task.difficulty), 'Invalid difficulty');
        assert.ok(['locked', 'available', 'in_progress', 'completed'].includes(task.status), 'Invalid status');
      }
    }
  }
});

test('getRoadmapForRole falls back safely to full-stack-dev for unknown roles', () => {
  const fallbackModules = getRoadmapForRole('unknown-specialty-role');
  assert.ok(Array.isArray(fallbackModules) && fallbackModules.length > 0);
  assert.equal(fallbackModules[0].id, 'fs-mod-1');
});
