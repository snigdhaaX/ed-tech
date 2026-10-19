import React, { useState } from 'react';
import { HelpCircle, ChevronRight, CheckCircle2, Shield } from 'lucide-react';

interface ReadinessGaugeProps {
  score: number;
  skillScore: number;
  projectScore: number;
  assessmentScore: number;
  roleTitle: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  skillScore,
  projectScore,
  assessmentScore,
  roleTitle,
  size = 'md',
}) => {
  const [showModal, setShowModal] = useState(false);

  // SVG parameters
  const strokeWidth = size === 'lg' ? 9 : size === 'md' ? 7 : 5;
  const radius = size === 'lg' ? 62 : size === 'md' ? 48 : 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getTier = (s: number) => {
    if (s >= 85) return { label: 'High Readiness', color: 'text-emerald-600', ring: 'stroke-emerald-500' };
    if (s >= 65) return { label: 'Competitive', color: 'text-blue-600', ring: 'stroke-blue-500' };
    if (s >= 40) return { label: 'In Development', color: 'text-amber-600', ring: 'stroke-amber-500' };
    return { label: 'Foundational', color: 'text-zinc-500', ring: 'stroke-zinc-400' };
  };

  const tier = getTier(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
        >
          {/* Background circle */}
          <circle
            className="text-zinc-100 stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
          {/* Animated score circle */}
          <circle
            className={`${tier.ring} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-semibold tracking-tight ${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-base'} text-zinc-900`}>
            {score}%
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-semibold text-zinc-600 tracking-wider">
              Ready
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-center">
        <span className={`text-xs font-semibold ${tier.color}`}>
          {tier.label}
        </span>
        <button
          onClick={() => setShowModal(true)}
          className="text-zinc-600 hover:text-zinc-600 transition-colors cursor-pointer"
          aria-label="View calculation methodology"
          title="How is this score computed?"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Methodology Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 text-left relative animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-zinc-900">Role-Readiness Formula</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-600 hover:text-zinc-700 text-sm p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 mt-3 leading-relaxed">
              SkillProof never uses arbitrary numbers or self-claimed badges. Your readiness for <strong className="text-zinc-900">{roleTitle}</strong> is mathematically computed from three verifiable pillars:
            </p>

            <div className="space-y-3 mt-4">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex justify-between items-center text-xs font-medium text-zinc-800">
                  <span>1. Required Skill Evidence (40% weight)</span>
                  <span className="font-semibold text-indigo-600">{skillScore}/100</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Evaluated across core role skills with weighted evidence: Claimed (0.15x), Tested (0.5x), Project-Verified (0.75x), Mentor-Verified (1.0x).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex justify-between items-center text-xs font-medium text-zinc-800">
                  <span>2. Production Project Proof (40% weight)</span>
                  <span className="font-semibold text-indigo-600">{projectScore}/100</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Full-stack repos evaluated against multi-layer rubrics for code architecture, error resilience, and deployment. Target: 2+ verified projects.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex justify-between items-center text-xs font-medium text-zinc-800">
                  <span>3. Assessments & Mock Interviews (20% weight)</span>
                  <span className="font-semibold text-indigo-600">{assessmentScore}/100</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Coding challenge suites and project defense mock interview scores.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
