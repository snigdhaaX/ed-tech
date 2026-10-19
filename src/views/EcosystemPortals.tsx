import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import {
  GraduationCap,
  Building2,
  UserCheck2,
  Users,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Award,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

interface PortalProps {
  portalType: 'college' | 'recruiter' | 'mentor';
}

export const EcosystemPortalView: React.FC<PortalProps> = ({ portalType }) => {
  const { profile, roles, skills, submissions, setActiveRoute, triggerCelebration } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [mentorRubricScore, setMentorRubricScore] = useState(94);
  const [mentorFeedback, setMentorFeedback] = useState('Production-level WebSocket heartbeat logic. Highly recommend for SDE II internship.');
  const [mentorSubmitted, setMentorSubmitted] = useState(false);

  const mockStudents = [
    { name: 'Aryan Sharma', branch: 'CSE', year: '3rd Year', readiness: 86, verifiedSkills: 4, verifiedProjects: 1 },
    { name: 'Pooja Iyer', branch: 'ECE', year: '4th Year', readiness: 79, verifiedSkills: 3, verifiedProjects: 1 },
    { name: 'Rohan Verma', branch: 'IT', year: '3rd Year', readiness: 72, verifiedSkills: 2, verifiedProjects: 0 },
    { name: 'Ananya Deshmukh', branch: 'CSE', year: '4th Year', readiness: 91, verifiedSkills: 5, verifiedProjects: 2 },
  ];

  const handleMentorReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMentorSubmitted(true);
    triggerCelebration();
    setTimeout(() => setMentorSubmitted(false), 2500);
  };

  return (
    <div className="pt-20 pb-28 px-4 max-w-6xl mx-auto space-y-8">
      {/* College Portal */}
      {portalType === 'college' && (
        <div className="space-y-6">
          <div className="pb-4 border-b border-zinc-200/80">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Institutional Placement Cell Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              National Institute of Technology — Cohort Analytics
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Aggregate skill readiness, verification rates, and placement benchmarks across engineering batches.
            </p>
          </div>

          {/* Metric Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SpotlightCard className="p-4 bg-white">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase">Enrolled Students</span>
              <div className="text-2xl font-bold text-zinc-900 my-1">420</div>
              <span className="text-xs text-zinc-500">2027 & 2026 Batches</span>
            </SpotlightCard>
            <SpotlightCard className="p-4 bg-white">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase">Avg Role Readiness</span>
              <div className="text-2xl font-bold text-indigo-600 my-1">74.2%</div>
              <span className="text-xs text-emerald-600 font-medium">+11% vs last month</span>
            </SpotlightCard>
            <SpotlightCard className="p-4 bg-white">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase">Verified Projects</span>
              <div className="text-2xl font-bold text-emerald-600 my-1">318</div>
              <span className="text-xs text-zinc-500">Passed multi-layer rubrics</span>
            </SpotlightCard>
            <SpotlightCard className="p-4 bg-white">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase">Day 1 Ready</span>
              <div className="text-2xl font-bold text-amber-600 my-1">68%</div>
              <span className="text-xs text-zinc-500">Score &gt;= 80% threshold</span>
            </SpotlightCard>
          </div>

          {/* Student Roster */}
          <SpotlightCard className="p-6 bg-white space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Student Placement Cohort Roster</h3>
              <span className="text-xs text-zinc-500">Strictly authorized institution view</span>
            </div>

            <div className="divide-y divide-zinc-100 text-xs">
              {mockStudents.map((s, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-zinc-900 block">{s.name}</span>
                    <span className="text-zinc-500 text-[11px]">{s.branch} • {s.year}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="font-bold text-zinc-900">{s.readiness}%</span>
                      <div className="text-[10px] text-zinc-400">readiness</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600">{s.verifiedSkills}</span>
                      <div className="text-[10px] text-zinc-400">verified skills</div>
                    </div>
                    <button
                      onClick={() => setActiveRoute('/portfolio')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-[11px]"
                    >
                      Audit Proof
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* Recruiter Portal */}
      {portalType === 'recruiter' && (
        <div className="space-y-6">
          <div className="pb-4 border-b border-zinc-200/80">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
              <Building2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Recruiter Candidate Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Filter by Verified Code Evidence, Not Self-Claims
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Hire pre-screened engineering interns based on evaluated GitHub projects, test scores, and mentor audits.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Filter by technology (e.g. React, PostgreSQL, Docker)..."
              className="flex-1 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900 shadow-sm"
            />
          </div>

          {/* Candidate Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockStudents.map((cand, idx) => (
              <SpotlightCard key={idx} className="p-6 bg-white border-zinc-200 shadow-md space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-zinc-950">{cand.name}</h3>
                    <p className="text-xs text-zinc-500">Target: Full-Stack Developer • {cand.branch}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-indigo-600">{cand.readiness}%</span>
                    <div className="text-[10px] text-zinc-400">Verified Readiness</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Verified Projects:</span>
                    <span className="font-semibold text-zinc-900">{cand.verifiedProjects} production repos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Highest Evidence Tier:</span>
                    <EvidenceBadge level="Project-Verified" size="sm" />
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">Available Summer 2027</span>
                  <button
                    onClick={() => setActiveRoute('/portfolio')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    View Verified Portfolio
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* Mentor Portal */}
      {portalType === 'mentor' && (
        <div className="space-y-6">
          <div className="pb-4 border-b border-zinc-200/80">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
              <UserCheck2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Mentor Review Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Staff Engineer Project Review Queue
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Audit candidate architecture trade-offs and award Mentor-Verified (Tier 5) credentials.
            </p>
          </div>

          <SpotlightCard className="p-6 bg-white space-y-6">
            <div className="border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold text-amber-600 uppercase">Assigned Project Submission</span>
              <h3 className="text-base font-bold text-zinc-950 mt-1">
                Candidate: {profile.name} — Realtime Collaborative Task Engine
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Target Role: Full-Stack Developer • Repo: {profile.githubUrl}/realtime-task-engine
              </p>
            </div>

            <form onSubmit={handleMentorReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Overall Mentor Rubric Score (0 - 100)
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={mentorRubricScore}
                  onChange={e => setMentorRubricScore(Number(e.target.value))}
                  className="w-32 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Mentor Audit Notes & Production Readiness Feedback
                </label>
                <textarea
                  rows={4}
                  value={mentorFeedback}
                  onChange={e => setMentorFeedback(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900 resize-none leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Mentor Verification Impact:</span>
                <p className="text-[11px] text-amber-800">
                  Submitting this review elevates candidate JavaScript & Architecture skills to <strong>Mentor-Verified (100% weight)</strong> on the SkillProof registry.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{mentorSubmitted ? 'Mentor Verification Certified!' : 'Certify Mentor Verification'}</span>
              </button>
            </form>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};
