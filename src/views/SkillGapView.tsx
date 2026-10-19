import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import { prioritizeSkillGaps } from '../utils/scoring';
import {
  Layers,
  ArrowRight,
  Sparkles,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Cpu,
  Database,
  Terminal,
  ShieldAlert,
  FolderGit2,
} from 'lucide-react';

export const SkillGapView: React.FC = () => {
  const { currentRole, skills, setActiveRoute, updateSkillLevel, triggerCelebration } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'jd_analyzer' | 'forecaster'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [targetedSkills, setTargetedSkills] = useState<{ [key: string]: boolean }>({});

  // Sample JD text for the analyzer
  const [jdText, setJdText] = useState(
    `We are seeking a Full-Stack Engineer Intern to build high-scale financial dashboards.
Required: Strong TypeScript, React, Node.js, and relational database experience (PostgreSQL).
Preferred: Familiarity with Redis caching, Docker containerization, and WebSocket live concurrency.
Candidate must demonstrate problem-solving through clean, well-tested production projects.`
  );
  const [analyzingJd, setAnalyzingJd] = useState(false);
  const [jdAnalysisResult, setJdAnalysisResult] = useState<{
    alignment: number;
    extractedCount: number;
    extractedSkills?: string[];
    matched: string[];
    missing: string[];
    recommendedFocus: string;
    topMatchingJob?: string;
  } | null>(null);

  // Compute prioritized gaps using our pure logic
  const prioritizedGaps = prioritizeSkillGaps(
    skills,
    currentRole.requiredSkills,
    currentRole.preferredSkills
  );

  const categories = ['All', 'language', 'framework', 'database', 'devops', 'system_design', 'fundamentals'];

  const filteredSkills = skills.filter(
    s => selectedCategory === 'All' || s.category === selectedCategory
  );

  const handleRunJdAnalysis = async () => {
    setAnalyzingJd(true);

    try {
      // Call live Python ML dataset analyzer via API proxy
      const response = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jd_text: jdText,
          user_skills: skills.map(s => s.name),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setJdAnalysisResult({
          alignment: data.alignment,
          extractedCount: data.extracted_count,
          extractedSkills: data.extracted_skills,
          matched: data.matched,
          missing: data.missing,
          recommendedFocus: data.recommended_focus,
          topMatchingJob: data.top_matching_job,
        });
        setAnalyzingJd(false);
        triggerCelebration();
        return;
      }
    } catch (apiErr) {
      console.warn('Live ML JD analysis endpoint unavailable, using local matching:', apiErr);
    }

    // Local real keyword extraction matching technical skills from the job description
    const KNOWN_VOCAB = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'PostgreSQL', 'SQL',
      'Redis', 'Docker', 'Kubernetes', 'WebSockets', 'GraphQL', 'System Design',
      'Tailwind CSS', 'Python', 'FastAPI', 'PyTorch', 'TensorFlow', 'Git',
      'Next.js', 'AWS', 'Linux', 'Go', 'Java', 'Data Structures & Algorithms',
      'CI/CD', 'REST', 'Microservices'
    ];

    const extracted = KNOWN_VOCAB.filter(sk => {
      const escaped = sk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, 'i');
      return pattern.test(jdText);
    });

    const userSkillNames = skills.map(s => s.name.toLowerCase());
    const matched: string[] = [];
    const missing: string[] = [];

    extracted.forEach(sk => {
      if (userSkillNames.includes(sk.toLowerCase())) {
        matched.push(sk);
      } else {
        missing.push(sk);
      }
    });

    const totalExtracted = extracted.length || 1;
    const rawAlignment = Math.round((matched.length / totalExtracted) * 100);
    const alignment = Math.max(15, Math.min(100, rawAlignment));
    const topMissing = missing[0] || 'System Architecture';

    setJdAnalysisResult({
      alignment,
      extractedCount: extracted.length,
      extractedSkills: extracted,
      matched,
      missing,
      recommendedFocus: topMissing,
      topMatchingJob: currentRole.title,
    });
    setAnalyzingJd(false);
    triggerCelebration();
  };

  // Verification score projection calculation
  const baseReady = 68;
  const targetBoost = Object.values(targetedSkills).filter(Boolean).length * 9;
  const projectedScore = Math.min(100, baseReady + targetBoost);

  return (
    <div className="pt-20 pb-28 px-4 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gap Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Skill-Gap Analysis & Evidence Hierarchy
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Auditing your current abilities against expectations for{' '}
            <strong className="text-zinc-900">{currentRole.title}</strong>.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs self-start sm:self-auto">
          {[
            { id: 'matrix', label: 'Skill Matrix & Gaps' },
            { id: 'jd_analyzer', label: 'Job Description Intelligence' },
            { id: 'forecaster', label: 'Evidence Impact Forecaster' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Skill Matrix & Categorized Gaps */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Prioritized Gaps Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prioritizedGaps.slice(0, 3).map((gap, i) => (
              <SpotlightCard
                key={i}
                className={`p-4 ${
                  gap.priority === 'High Priority'
                    ? 'border-rose-200/80 bg-rose-50/20'
                    : gap.priority === 'Medium Priority'
                    ? 'border-amber-200/80 bg-amber-50/20'
                    : 'border-zinc-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      gap.priority === 'High Priority'
                        ? 'bg-rose-100 text-rose-800'
                        : gap.priority === 'Medium Priority'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {gap.priority}
                  </span>
                  <EvidenceBadge level={gap.currentLevel} size="sm" />
                </div>
                <h4 className="font-bold text-sm text-zinc-900 mt-2">{gap.name}</h4>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">{gap.reason}</p>
                <button
                  onClick={() => setActiveRoute('/roadmap')}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Resolve in Roadmap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </SpotlightCard>
            ))}
          </div>

          {/* Full Skills Table with Category Filter */}
          <SpotlightCard className="p-6 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-3">
              <div>
                <h3 className="font-semibold text-sm text-zinc-900">Your Evidence Inventory</h3>
                <p className="text-xs text-zinc-500">
                  Every technical competency with its current verification grade.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                      selectedCategory === cat
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 divide-y divide-zinc-100">
              {filteredSkills.map(skill => {
                const isRequired = currentRole.requiredSkills.includes(skill.name);
                return (
                  <div key={skill.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-900">{skill.name}</span>
                        {isRequired && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                            Required by Role
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-400 capitalize">({skill.category})</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {skill.verificationSource || 'Self-claimed profile item'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs font-bold text-zinc-800">{skill.score}/100</span>
                      </div>
                      <EvidenceBadge level={skill.evidenceLevel} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* Tab 2: Job Description Intelligence */}
      {activeTab === 'jd_analyzer' && (
        <div className="space-y-6">
          <SpotlightCard className="p-6 bg-white">
            <h3 className="font-bold text-sm text-zinc-900 mb-1">
              Job Description Gap Intelligence
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Paste any job posting or internship description to benchmark your verified skills against their exact requirements.
            </p>

            <textarea
              rows={5}
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-mono outline-none focus:border-zinc-900 resize-none leading-relaxed"
              placeholder="Paste job description here..."
            />

            <div className="mt-4 flex justify-between items-center">
              <span className="text-[11px] text-zinc-400">
                AI extraction is advisory and benchmarks against your current verified evidence.
              </span>
              <button
                onClick={handleRunJdAnalysis}
                disabled={analyzingJd}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>{analyzingJd ? 'Analyzing Requirements...' : 'Run Gap Analysis'}</span>
              </button>
            </div>
          </SpotlightCard>

          {/* Analysis Results */}
          {jdAnalysisResult && (
            <SpotlightCard className="p-6 bg-white space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-sm text-zinc-900">Extracted Intelligence Report</h4>
                </div>
                <div className="flex items-center gap-2">
                  {jdAnalysisResult.topMatchingJob && (
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Matched Role Profile: <strong className="text-zinc-800">{jdAnalysisResult.topMatchingJob}</strong>
                    </span>
                  )}
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {jdAnalysisResult.alignment}% Alignment ({jdAnalysisResult.extractedCount} Skills Found)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Profile Strengths ({jdAnalysisResult.matched.length} Matched)</span>
                  </span>
                  {jdAnalysisResult.matched.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {jdAnalysisResult.matched.map((sk, idx) => {
                        const userSkill = skills.find(s => s.name.toLowerCase() === sk.toLowerCase());
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-900 border border-emerald-200"
                          >
                            <span>{sk}</span>
                            {userSkill && (
                              <span className="text-[9px] text-emerald-700 uppercase font-mono">
                                ({userSkill.evidenceLevel})
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">No overlapping competencies detected yet.</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Missing Competencies ({jdAnalysisResult.missing.length} Missing)</span>
                  </span>
                  {jdAnalysisResult.missing.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {jdAnalysisResult.missing.map((sk, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-100/80 text-rose-900 border border-rose-200"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-700 font-medium">All extracted competencies satisfied in your profile!</p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-xs font-bold text-zinc-900 block">
                  Recommended Action Plan:
                </span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Focus on building verified proof for <strong className="text-zinc-900">{jdAnalysisResult.recommendedFocus}</strong> to elevate your alignment with this position.
                </p>
                <button
                  onClick={() => setActiveRoute('/roadmap')}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Go to Verification Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightCard>
          )}
        </div>
      )}

      {/* Tab 3: Evidence Impact Forecaster */}
      {activeTab === 'forecaster' && (
        <SpotlightCard className="p-6 bg-white space-y-6">
          <div>
            <h3 className="font-bold text-sm text-zinc-900">Evidence Impact Forecaster & Projections</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Target unverified competencies to forecast how hands-on project verification elevates your role-readiness score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Interactive Checklist */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                Target Skills for Verification:
              </span>

              {[
                { name: 'Redis', task: 'Complete Lua Atomic Rate Limiter' },
                { name: 'Docker', task: 'Submit Multi-stage Dockerfile' },
                { name: 'System Design', task: 'Pass Mock Project Defense Interview' },
              ].map(item => {
                const checked = !!targetedSkills[item.name];
                return (
                  <div
                    key={item.name}
                    onClick={() => setTargetedSkills(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      checked
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">{item.name}</div>
                      <div className="text-[11px] text-zinc-500">{item.task}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                        checked ? 'bg-indigo-600 text-white' : 'border border-zinc-300'
                      }`}
                    >
                      {checked && '✓'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Projected Score Gauge */}
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Projected Role-Readiness
              </span>
              <div className="text-4xl font-extrabold text-indigo-600">
                {projectedScore}%
              </div>
              <div className="mt-1 text-xs font-semibold text-emerald-600">
                +{targetBoost}% verified evidence boost
              </div>
              <p className="text-[11px] text-zinc-500 mt-3 max-w-xs leading-relaxed">
                Elevating these competencies to Project-Verified demonstrates tangible code artifacts to engineering hiring managers.
              </p>
              <button
                onClick={() => setActiveRoute('/projects')}
                className="mt-4 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
              >
                Start Verification Project Now
              </button>
            </div>
          </div>
        </SpotlightCard>
      )}
    </div>
  );
};
