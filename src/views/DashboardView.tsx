import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { ReadinessGauge } from '../components/ui/ReadinessGauge';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import {
  Compass,
  ArrowRight,
  Sparkles,
  GitBranch,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  Flame,
  Award,
  FileCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
  Target,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const {
    profile,
    currentRole,
    roles,
    setTargetRole,
    skills,
    roadmap,
    submissions,
    opportunities,
    readinessMetrics,
    setActiveRoute,
  } = useApp();

  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // Compute roadmap completion
  const allTasks = roadmap.flatMap(m => m.tasks);
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const roadmapPct = Math.round((completedTasks.length / Math.max(1, allTasks.length)) * 100);

  // Contextual Next Best Action
  const nextTask = allTasks.find(t => t.status === 'in_progress') || allTasks.find(t => t.status === 'available');

  const firstName = profile.name.split(' ')[0] || 'Aryan';

  return (
    <div className="pt-20 pb-28 px-4 max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Good morning, {firstName}.
            </h1>
            <span className="hidden sm:inline text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Student Edition
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Let’s turn your engineering progress into recruiter-ready proof.
          </p>
        </div>

        {/* Target Role Switcher Chip */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100/80 border border-zinc-200 text-xs">
            <span className="text-zinc-600">Target Role:</span>
            <span className="font-semibold text-zinc-900">{currentRole.title}</span>
          </div>
          <button
            onClick={() => setRoleModalOpen(true)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Role Readiness */}
        <SpotlightCard className="p-4 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Role-Readiness</span>
            <span className="text-xs text-indigo-600 font-medium">Overall</span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-950">{readinessMetrics.overallScore}%</span>
            <span className="text-xs font-medium text-emerald-600">+8% this week</span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${readinessMetrics.overallScore}%` }}
            />
          </div>
        </SpotlightCard>

        {/* Metric 2: Verified Skills */}
        <SpotlightCard className="p-4 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Verified Skills</span>
            <Award className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-950">{readinessMetrics.verifiedCount}</span>
            <span className="text-xs text-zinc-600">/ {currentRole.requiredSkills.length} core</span>
          </div>
          <p className="text-[11px] text-zinc-500 truncate">
            {skills.filter(s => s.evidenceLevel === 'Mentor-Verified').length} mentor, {skills.filter(s => s.evidenceLevel === 'Project-Verified').length} project
          </p>
        </SpotlightCard>

        {/* Metric 3: Project Submissions */}
        <SpotlightCard className="p-4 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Verified Projects</span>
            <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-950">
              {submissions.filter(s => s.status === 'Verified').length}
            </span>
            <span className="text-xs text-zinc-600">completed</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            Avg Score: 92/100
          </p>
        </SpotlightCard>

        {/* Metric 4: Learning Streak */}
        <SpotlightCard className="p-4 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-950">{profile.learningStreak}</span>
            <span className="text-xs text-zinc-600">days active</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Roadmap {roadmapPct}% finished
          </p>
        </SpotlightCard>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Next Best Action, Skill Matrix, Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Your Next Best Action */}
          {nextTask && (
            <SpotlightCard className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 to-zinc-950 text-white border-zinc-900">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>Your Next Best Action</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold mt-2">
                {nextTask.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {nextTask.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                  <span>⏱ ~{nextTask.estimatedHours} hours</span>
                  <span>•</span>
                  <span>Skills: {nextTask.skillsCovered.join(', ')}</span>
                </div>
                <button
                  onClick={() => setActiveRoute('/roadmap')}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Task & AI Tutor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightCard>
          )}

          {/* Section B: Skill Proficiency Matrix */}
          <SpotlightCard className="p-6 bg-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="font-semibold text-sm text-zinc-900">Skill Proficiency & Evidence Levels</h3>
                <p className="text-xs text-zinc-500">Skills categorized by evidence rigor (never represented as self-verified).</p>
              </div>
              <button
                onClick={() => setActiveRoute('/skill-gap')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Full Gap Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {skills.map(skill => {
                const isRequired = currentRole.requiredSkills.some(
                  r => r.toLowerCase() === skill.name.toLowerCase()
                );
                return (
                  <div
                    key={skill.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-zinc-50/60 hover:bg-zinc-50 border border-zinc-100 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-zinc-900">{skill.name}</span>
                          {isRequired && (
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-200/80 text-zinc-700">
                              Core Required
                            </span>
                          )}
                        </div>
                        {skill.verificationSource && (
                          <div className="text-[11px] text-zinc-600 truncate max-w-xs">
                            {skill.verificationSource}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-zinc-800">{skill.score}/100</div>
                        <div className="text-[10px] text-zinc-600">score</div>
                      </div>
                      <EvidenceBadge level={skill.evidenceLevel} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>

          {/* Section D: Recent Projects & Evidence */}
          <SpotlightCard className="p-6 bg-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="font-semibold text-sm text-zinc-900">Project Studio & Verifications</h3>
                <p className="text-xs text-zinc-500">Working implementations with multi-layer rubric reviews.</p>
              </div>
              <button
                onClick={() => setActiveRoute('/projects')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Browse Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {submissions.map(sub => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm text-zinc-900">{sub.projectTitle}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{sub.description}</p>
                    </div>
                    {sub.overallScore && (
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-zinc-900">{sub.overallScore}/100</div>
                        <div className="text-[10px] text-zinc-600">Rubric Score</div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 text-xs">
                    <div className="flex items-center gap-3">
                      {sub.repositoryUrl && (
                        <a
                          href={sub.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>Repository</span>
                        </a>
                      )}
                      {sub.demoUrl && (
                        <a
                          href={sub.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveRoute('/submissions')}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center gap-1"
                    >
                      <span>View Rubric Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Readiness Dial, Roadmap Widget, Opportunities */}
        <div className="space-y-6">
          {/* Readiness Dial Card */}
          <SpotlightCard className="p-6 bg-white text-center flex flex-col items-center">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Target Role Readiness
            </span>
            <ReadinessGauge
              score={readinessMetrics.overallScore}
              skillScore={readinessMetrics.skillScore}
              projectScore={readinessMetrics.projectScore}
              assessmentScore={readinessMetrics.assessmentScore}
              roleTitle={currentRole.title}
              size="lg"
            />
            <div className="mt-4 p-3 rounded-xl bg-zinc-50 border border-zinc-100 w-full text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Skills Coverage:</span>
                <span className="font-semibold text-zinc-800">{readinessMetrics.skillScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Project Depth:</span>
                <span className="font-semibold text-zinc-800">{readinessMetrics.projectScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Assessment / Mock:</span>
                <span className="font-semibold text-zinc-800">{readinessMetrics.assessmentScore}%</span>
              </div>
            </div>
            <button
              onClick={() => setActiveRoute('/portfolio')}
              className="mt-4 w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
            >
              Preview Recruiter Portfolio →
            </button>
          </SpotlightCard>

          {/* Learning Roadmap Widget */}
          <SpotlightCard className="p-5 bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-900">Roadmap Progress</span>
              <span className="text-xs font-bold text-indigo-600">{roadmapPct}%</span>
            </div>

            <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${roadmapPct}%` }}
              />
            </div>

            <div className="space-y-2 pt-2">
              {allTasks.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  onClick={() => setActiveRoute('/roadmap')}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate text-zinc-800 font-medium">{task.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 shrink-0">{task.estimatedHours}h</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveRoute('/roadmap')}
              className="w-full py-2 rounded-xl text-center text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              Open Full Roadmap View
            </button>
          </SpotlightCard>

          {/* Recommended Opportunities */}
          <SpotlightCard className="p-5 bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-900">Recommended Opportunities</span>
              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Verified Match
              </span>
            </div>

            <div className="space-y-2.5">
              {opportunities.slice(0, 2).map(opp => (
                <div
                  key={opp.id}
                  onClick={() => setActiveRoute('/opportunities')}
                  className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-xs text-zinc-900">{opp.roleTitle}</div>
                      <div className="text-[11px] text-zinc-500">{opp.company} • {opp.location}</div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {opp.stipendOrSalary}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-600">
                    Matches: {opp.requiredSkills.slice(0, 2).join(', ')}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveRoute('/opportunities')}
              className="w-full py-2 rounded-xl text-center text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              Browse All Opportunities →
            </button>
          </SpotlightCard>
        </div>
      </div>

      {/* Target Role Switcher Modal */}
      {roleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setRoleModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 text-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Switch Target Engineering Role</h3>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="text-zinc-600 hover:text-zinc-600 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Selecting a new target role immediately recalibrates your skill gap and required competencies:
            </p>

            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
              {roles.map(r => (
                <div
                  key={r.id}
                  onClick={() => {
                    setTargetRole(r.id);
                    setRoleModalOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    currentRole.id === r.id
                      ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-zinc-900">{r.title}</span>
                    <span className="text-[10px] text-zinc-600">{r.difficulty}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{r.overview}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
