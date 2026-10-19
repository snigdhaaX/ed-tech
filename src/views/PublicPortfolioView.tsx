import React from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import {
  ShieldCheck,
  Award,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export const PublicPortfolioView: React.FC = () => {
  const { profile, submissions, skills, credentials, currentRole, setActiveRoute } = useApp();

  if (!profile.portfolioPublished) {
    return (
      <div className="pt-32 pb-28 px-4 max-w-lg mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-500">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">This Portfolio is Currently Private</h2>
        <p className="text-xs text-zinc-500 leading-relaxed">
          The candidate has configured this portfolio to private mode while completing practical project verifications.
        </p>
        <button
          onClick={() => setActiveRoute('/portfolio')}
          className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold cursor-pointer"
        >
          Return to Workspace
        </button>
      </div>
    );
  }

  // Verified skills only
  const verifiedSkills = skills.filter(s => s.evidenceLevel !== 'Claimed');

  return (
    <div className="pt-20 pb-28 px-4 max-w-4xl mx-auto space-y-10">
      {/* Top Bar for Reviewers */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <button
          onClick={() => setActiveRoute('/dashboard')}
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>SkillProof Platform</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Candidate Record</span>
          </span>
        </div>
      </div>

      {/* Candidate Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-zinc-200 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">{profile.name}</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
                {currentRole.title}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {profile.degree} in {profile.branch} • {profile.institution} (Class of {profile.graduationYear})
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-600">
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-900 underline flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
              </a>
              <span>•</span>
              <span className="text-zinc-500">{profile.preferredLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio / Summary */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
          Engineering Focus & Background
        </h2>
        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50/80 p-4 rounded-2xl border border-zinc-100">
          {profile.bio}
        </p>
      </div>

      {/* Verified Skills Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Verified Competencies ({verifiedSkills.length})
          </h2>
          <span className="text-[11px] text-zinc-600">
            Backed by evaluated code and peer audits
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {verifiedSkills.map(skill => (
            <div
              key={skill.id}
              className="p-3 rounded-xl bg-white border border-zinc-200/90 shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-xs text-zinc-900">{skill.name}</span>
                <span className="text-[10px] font-bold text-indigo-600">{skill.score}/100</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <EvidenceBadge level={skill.evidenceLevel} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Case Studies / Projects */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
          Verified Project Case Studies ({submissions.length})
        </h2>

        <div className="space-y-6">
          {submissions.map(sub => (
            <SpotlightCard key={sub.id} className="p-6 sm:p-8 bg-white border-zinc-200/90 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-950">{sub.projectTitle}</h3>
                    <EvidenceBadge level="Project-Verified" size="sm" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{sub.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-emerald-700">{sub.overallScore}/100</span>
                  <div className="text-[10px] text-zinc-600">Rubric Score</div>
                </div>
              </div>

              {/* Technical Decisions */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-zinc-900 block">Architectural Decisions:</span>
                  <p className="text-zinc-600 mt-0.5 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    {sub.architecturalDecisions}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-zinc-900 block">Trade-offs & Concurrency Challenges:</span>
                  <p className="text-zinc-600 mt-0.5 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    {sub.tradeoffsAndChallenges}
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <a
                    href={sub.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>View Repository & Commits</span>
                  </a>
                  {sub.demoUrl && (
                    <a
                      href={sub.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-700 hover:text-zinc-950 font-medium flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Deployed Demo</span>
                    </a>
                  )}
                </div>

                <span className="text-[11px] text-zinc-600">
                  Evaluated: {new Date(sub.evaluatedAt || '').toLocaleDateString()}
                </span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Verifiable Credentials List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
          Cryptographically Verifiable Credentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {credentials.map(cred => (
            <div
              key={cred.id}
              onClick={() => setActiveRoute(cred.verificationUrl)}
              className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:bg-zinc-100/70 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-zinc-900">{cred.title}</span>
                <EvidenceBadge level={cred.evidenceLevel} size="sm" />
              </div>
              <div className="text-[10px] font-mono text-zinc-600">{cred.credentialId}</div>
              <div className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                <span>Verify Credential Authenticity →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
