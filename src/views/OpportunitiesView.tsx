import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { OpportunityItem } from '../types';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  ExternalLink,
  Bookmark,
  Send,
  Sparkles,
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, skills, updateOpportunityStatus, triggerCelebration } = useApp();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'applications'>('marketplace');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredOpportunities = opportunities.filter(
    opp => filterType === 'All' || opp.remoteStatus === filterType
  );

  const appliedList = opportunities.filter(o => o.applicationStatus && o.applicationStatus !== 'Saved');

  const handleApply = (opp: OpportunityItem) => {
    updateOpportunityStatus(opp.id, 'Applied');
    triggerCelebration();
    alert(`Application submitted to ${opp.company} with verified SkillProof credentials attached!`);
  };

  const stages: Array<OpportunityItem['applicationStatus']> = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer'];

  return (
    <div className="pt-20 pb-28 px-4 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-cyan-600" />
            <span>Opportunity Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Internships & Verified Hiring Challenges
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Jobs that explicitly hire based on verifiable code evidence and skill proof.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'marketplace'
                ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All Opportunities ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            My Pipeline ({appliedList.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Marketplace */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOpportunities.map(opp => {
              // Calculate overlap
              const matching = opp.requiredSkills.filter(req =>
                skills.some(
                  s =>
                    s.name.toLowerCase() === req.toLowerCase() &&
                    ['Project-Verified', 'Tested', 'Mentor-Verified'].includes(s.evidenceLevel)
                )
              );
              const missing = opp.requiredSkills.filter(
                req => !matching.includes(req)
              );
              const matchPct = Math.round((matching.length / opp.requiredSkills.length) * 100);

              return (
                <SpotlightCard
                  key={opp.id}
                  className="p-6 bg-white border-zinc-200 shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider block">
                          {opp.company}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-zinc-900 mt-0.5">
                          {opp.roleTitle}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                        {opp.stipendOrSalary}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{opp.location}</span>
                      </span>
                      <span>•</span>
                      <span>{opp.remoteStatus}</span>
                      <span>•</span>
                      <span>Deadline: {opp.deadline}</span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Skill Match Explanation */}
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-600 font-medium">Your Verified Skill Match:</span>
                        <span className="font-bold text-indigo-600">{matchPct}% Match</span>
                      </div>
                      <div className="text-[11px] text-zinc-600 flex flex-wrap gap-1">
                        <span className="text-emerald-700 font-medium">Verified:</span>
                        {matching.map(s => (
                          <span key={s} className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-medium border border-emerald-100">
                            ✓ {s}
                          </span>
                        ))}
                        {missing.length > 0 && (
                          <>
                            <span className="text-rose-600 font-medium ml-1">Missing:</span>
                            {missing.map(m => (
                              <span key={m} className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-medium border border-rose-100">
                                ✗ {m}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Status: {opp.applicationStatus || 'Available'}
                    </span>

                    {opp.applicationStatus === 'Applied' ? (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(opp)}
                        className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Apply with SkillProof</span>
                      </button>
                    )}
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Application Pipeline Tracker */}
      {activeTab === 'applications' && (
        <SpotlightCard className="p-6 bg-white space-y-6">
          <div className="pb-3 border-b border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-900">Your Active Opportunity Pipeline</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tracks the lifecycle of your applications from submission to interview rounds.
            </p>
          </div>

          <div className="space-y-4">
            {appliedList.map(opp => (
              <div
                key={opp.id}
                className="p-4 rounded-2xl border border-zinc-200/90 bg-white space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">{opp.roleTitle}</h4>
                    <span className="text-xs text-zinc-500">{opp.company} • {opp.stipendOrSalary}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full self-start sm:self-auto">
                    Current Stage: {opp.applicationStatus}
                  </span>
                </div>

                {/* Visual Pipeline Stages */}
                <div className="grid grid-cols-5 gap-1.5 pt-2">
                  {stages.map((stage, idx) => {
                    const currentIdx = stages.indexOf(opp.applicationStatus);
                    const isPassed = idx <= currentIdx;
                    return (
                      <div
                        key={stage}
                        onClick={() => updateOpportunityStatus(opp.id, stage)}
                        className={`p-2 rounded-xl text-center text-xs font-medium cursor-pointer transition-all ${
                          isPassed
                            ? 'bg-zinc-950 text-white shadow-sm'
                            : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                        }`}
                      >
                        {stage}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}
    </div>
  );
};
