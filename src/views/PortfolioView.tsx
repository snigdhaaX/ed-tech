import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import {
  UserCheck,
  Share2,
  ExternalLink,
  QrCode,
  Sparkles,
  GitBranch,
  Save,
  Check,
  Award,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { profile, updateProfile, submissions, skills, currentRole, setActiveRoute, triggerCelebration } = useApp();

  const [bio, setBio] = useState(profile.bio);
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl);
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl);
  const [isPublished, setIsPublished] = useState(profile.portfolioPublished);
  const [showQrModal, setShowQrModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const publicUrl = `${window.location.origin}/portfolio/${profile.username}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      bio,
      githubUrl,
      linkedinUrl,
      portfolioPublished: isPublished,
    });
    setSavedSuccess(true);
    triggerCelebration();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    alert('Public portfolio link copied to clipboard!');
  };

  return (
    <div className="pt-20 pb-28 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Verifiable Portfolio Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Your Recruiter-Ready Portfolio
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Showcases your evidence-backed skills, verified projects, and architectural case studies.
          </p>
        </div>

        {/* Public Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveRoute(`/portfolio/${profile.username}`)}
            className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span>Public Preview</span>
          </button>
          <button
            onClick={copyPublicUrl}
            className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
            title="Generate Portfolio QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <SpotlightCard className="p-6 sm:p-8 bg-white border-zinc-200 shadow-xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-4">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-200"
              />
              <div>
                <h3 className="font-bold text-sm text-zinc-900">{profile.name}</h3>
                <p className="text-xs text-zinc-500">{currentRole.title} • {profile.institution}</p>
                <div className="text-[11px] font-mono text-indigo-600 mt-0.5">
                  skillproof.dev/portfolio/{profile.username}
                </div>
              </div>
            </div>

            {/* Public Visibility Toggle */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs self-start sm:self-auto">
              <span className="text-zinc-600 px-2 font-medium">Public Status:</span>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  isPublished
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {isPublished ? 'Live & Published' : 'Private Draft'}
              </button>
            </div>
          </div>

          {/* Bio input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Professional Engineering Summary & Focus
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900 resize-none leading-relaxed"
              placeholder="Briefly describe your systems or web engineering interests..."
            />
          </div>

          {/* Social / Repo links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Featured Verified Projects Preview */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-zinc-700">
                Featured Case Studies & Verified Projects ({submissions.length})
              </label>
              <span className="text-[11px] text-zinc-400">
                Only verified projects appear on your public page
              </span>
            </div>

            <div className="space-y-3">
              {submissions.map(sub => (
                <div key={sub.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-900">{sub.projectTitle}</span>
                      <EvidenceBadge level="Project-Verified" size="sm" />
                    </div>
                    <span className="text-xs font-bold text-emerald-700">{sub.overallScore}/100</span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2">{sub.description}</p>
                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-mono text-[10px]">{sub.repositoryUrl}</span>
                    <span className="text-emerald-600 font-medium text-[11px]">✓ Passed multi-layer audit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Changes reflect immediately on your public URL.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved & Synced!' : 'Save Portfolio Settings'}</span>
            </button>
          </div>
        </form>
      </SpotlightCard>

      {/* QR Code Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto">
              <QrCode className="w-5 h-5 text-cyan-300" />
            </div>
            <h3 className="font-bold text-base text-zinc-900">
              Recruiter Scan QR Code
            </h3>
            <p className="text-xs text-zinc-500">
              Scan with any mobile camera to view {profile.name}’s verified skill portfolio.
            </p>

            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 inline-block">
              {/* Simulated high-fidelity SVG QR Code */}
              <svg width="160" height="160" viewBox="0 0 100 100" className="mx-auto">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="10" y="10" width="25" height="25" fill="#18181b" />
                <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="18" width="9" height="9" fill="#18181b" />

                <rect x="65" y="10" width="25" height="25" fill="#18181b" />
                <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="73" y="18" width="9" height="9" fill="#18181b" />

                <rect x="10" y="65" width="25" height="25" fill="#18181b" />
                <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="73" width="9" height="9" fill="#18181b" />

                <rect x="45" y="15" width="8" height="8" fill="#18181b" />
                <rect x="45" y="45" width="10" height="10" fill="#6366f1" />
                <rect x="65" y="45" width="8" height="8" fill="#18181b" />
                <rect x="45" y="75" width="8" height="8" fill="#18181b" />
                <rect x="75" y="75" width="12" height="12" fill="#18181b" />
              </svg>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 break-all px-2">
              {publicUrl}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-xl bg-zinc-900 text-white text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
