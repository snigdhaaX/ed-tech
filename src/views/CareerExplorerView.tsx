import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { CareerRole } from '../types';
import {
  Search,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  FolderGit2,
  BookOpen,
  Layers,
  ChevronRight,
  Star,
} from 'lucide-react';

export const CareerExplorerView: React.FC = () => {
  const { roles, currentRole, setTargetRole, skills, setActiveRoute } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<CareerRole | null>(null);

  const categories = ['All', 'Software Engineering', 'Web Engineering', 'Systems Engineering', 'Artificial Intelligence', 'Data Science', 'Infrastructure'];

  const filteredRoles = roles.filter(role => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || role.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-20 pb-28 px-4 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>Industry Career Explorer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          Explore 10 High-Demand Engineering Roles
        </h1>
        <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
          Understand exact technical competencies, typical campus placement requirements, recommended projects, and transparent salary insights.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search roles or skills (e.g. React, PostgreSQL, Docker)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900 shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-950 text-white'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRoles.map(role => {
          const isTarget = currentRole.id === role.id;
          // Calculate student's verified skill match for this role
          const matchedSkills = role.requiredSkills.filter(req =>
            skills.some(
              s =>
                s.name.toLowerCase() === req.toLowerCase() &&
                ['Project-Verified', 'Tested', 'Mentor-Verified'].includes(s.evidenceLevel)
            )
          );
          const matchPct = Math.round((matchedSkills.length / role.requiredSkills.length) * 100);

          return (
            <SpotlightCard
              key={role.id}
              className={`p-5 bg-white flex flex-col justify-between ${
                isTarget ? 'ring-2 ring-indigo-600/70 border-indigo-200' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider block">
                      {role.category}
                    </span>
                    <h3 className="font-bold text-sm text-zinc-900 mt-0.5">{role.title}</h3>
                  </div>
                  {isTarget ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                      Target Role
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 shrink-0">
                      {role.difficulty}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {role.overview}
                </p>

                {/* Skill Match Indicator */}
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Your Evidence Match:</span>
                    <span className="font-semibold text-indigo-600">{matchPct}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${matchPct}%` }}
                    />
                  </div>
                </div>

                {/* Required Skills Badges */}
                <div>
                  <span className="text-[10px] text-zinc-600 block mb-1 font-semibold uppercase">
                    Core Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.requiredSkills.map(s => {
                      const hasSkill = skills.some(
                        us => us.name.toLowerCase() === s.toLowerCase()
                      );
                      return (
                        <span
                          key={s}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                            hasSkill
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                          }`}
                        >
                          {s}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedRoleDetail(role)}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Details & Projects</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {!isTarget ? (
                  <button
                    onClick={() => setTargetRole(role.id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Set as Target
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                )}
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Role Details Modal */}
      {selectedRoleDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4"
          onClick={() => setSelectedRoleDetail(null)}
        >
          <div
            className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-zinc-100">
              <div>
                <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  {selectedRoleDetail.category}
                </span>
                <h2 className="text-xl font-bold text-zinc-950 mt-1">
                  {selectedRoleDetail.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRoleDetail(null)}
                className="text-zinc-400 hover:text-zinc-700 text-base"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              {selectedRoleDetail.overview}
            </p>

            {/* Responsibilities */}
            <div>
              <h3 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Day-to-Day Responsibilities</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-zinc-600">
                {selectedRoleDetail.responsibilities.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Projects */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <h3 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recommended Proof Projects</span>
              </h3>
              <div className="space-y-1.5">
                {selectedRoleDetail.recommendedProjects.map((proj, i) => (
                  <div key={i} className="text-xs font-medium text-zinc-800 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{proj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sourced Salary Context */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Salary & Market Context (India Tech)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {selectedRoleDetail.salaryContext}. (Note: SkillProof displays sourced illustrative bands based on verified campus placement & off-campus hiring trends, never invented guarantees).
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedRoleDetail(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTargetRole(selectedRoleDetail.id);
                  setSelectedRoleDetail(null);
                  setActiveRoute('/roadmap');
                }}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Adopt Role & View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
