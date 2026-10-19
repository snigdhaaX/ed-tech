import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  GitBranch,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const SubmissionsView: React.FC = () => {
  const { submissions, setActiveRoute } = useApp();
  const [selectedSub, setSelectedSub] = useState(submissions[0]);

  return (
    <div className="pt-20 pb-28 px-4 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Layer Verification Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Project Submissions & Rubric Reports
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Transparent breakdown of automated validation, AI rubric scoring, and evidence awards.
          </p>
        </div>

        <button
          onClick={() => setActiveRoute('/projects')}
          className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Submit Another Project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {submissions.length === 0 ? (
        <SpotlightCard className="p-8 text-center bg-white">
          <p className="text-xs text-zinc-500">No project submissions yet. Start a project from the catalog!</p>
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission List (Left 1 Col) */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block">
              Evaluation History ({submissions.length})
            </span>
            {submissions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <SpotlightCard
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-zinc-950 ring-1 ring-zinc-950 bg-zinc-50/50'
                      : 'bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xs text-zinc-900 truncate max-w-[180px]">
                      {sub.projectTitle}
                    </h3>
                    <span className="text-xs font-bold text-emerald-600">
                      {sub.overallScore || 90}/100
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-600">
                    <EvidenceBadge level="Project-Verified" size="sm" />
                    <span>{sub.evaluatedAt ? new Date(sub.evaluatedAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Detailed Rubric Report (Right 2 Cols) */}
          {selectedSub && (
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Score Banner */}
              <SpotlightCard className="p-6 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-3">
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      Evaluation Outcome
                    </span>
                    <h2 className="text-lg font-bold text-zinc-950 mt-0.5">
                      {selectedSub.projectTitle}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-zinc-950">
                        {selectedSub.overallScore}/100
                      </div>
                      <div className="text-[10px] text-zinc-600 font-semibold uppercase">Verified Pass</div>
                    </div>
                    <EvidenceBadge level="Project-Verified" size="lg" />
                  </div>
                </div>

                {/* Layer 1: Automated Checks */}
                {selectedSub.evaluation && (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                    <h4 className="font-bold text-xs text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Layer 1: Automated Sanity & Repository Checks</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      {Object.entries(selectedSub.evaluation.layer1AutomatedChecks).map(([k, val]) => (
                        <div key={k} className="flex items-center gap-1.5">
                          {val ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          )}
                          <span className="capitalize text-zinc-700">{k.replace(/([A-Z])/g, ' $1')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Layer 2: Rubric Dimensions Breakdown */}
                {selectedSub.evaluation?.rubricScores && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                      Layer 2: AI Rubric Scoring Across 5 Dimensions
                    </h4>
                    <div className="space-y-2">
                      {selectedSub.evaluation.rubricScores.map((rubric, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-zinc-100 bg-white space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-zinc-900">{rubric.category}</span>
                            <span className="font-bold text-indigo-600">{rubric.score}/100</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed">{rubric.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                {selectedSub.evaluation && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Demonstrated Strengths</span>
                      </span>
                      <ul className="text-xs text-emerald-950 space-y-1">
                        {selectedSub.evaluation.strengths.map((s, i) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1.5">
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Recommended Improvements</span>
                      </span>
                      <ul className="text-xs text-amber-950 space-y-1">
                        {selectedSub.evaluation.recommendedFixes.map((f, i) => (
                          <li key={i}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Artifact Links */}
                <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <a
                      href={selectedSub.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>{selectedSub.repositoryUrl}</span>
                    </a>
                    {selectedSub.demoUrl && (
                      <a
                        href={selectedSub.demoUrl}
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
                    onClick={() => setActiveRoute('/credentials')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Issued Credential Badge →</span>
                  </button>
                </div>
              </SpotlightCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
