import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  ArrowLeft,
  Calendar,
  Search,
  ExternalLink,
} from 'lucide-react';

interface VerifyCredentialViewProps {
  credentialIdParam?: string;
}

export const VerifyCredentialView: React.FC<VerifyCredentialViewProps> = ({ credentialIdParam }) => {
  const { credentials, profile, setActiveRoute, activeRoute } = useApp();

  // Extract ID from prop or activeRoute (e.g. /verify-credential/SKP-2026-FSTK-4921)
  const idFromRoute = activeRoute.split('/verify-credential/')[1] || credentialIdParam || 'SKP-2026-FSTK-4921';
  const [searchId, setSearchId] = useState(idFromRoute);

  const matchedCred = credentials.find(
    c => c.credentialId.toLowerCase() === searchId.toLowerCase().trim()
  );

  return (
    <div className="pt-20 pb-28 px-4 max-w-2xl mx-auto space-y-8">
      {/* Top back button */}
      <button
        onClick={() => setActiveRoute('/credentials')}
        className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Credentials</span>
      </button>

      {/* Search Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            placeholder="Search Credential ID (e.g. SKP-2026-FSTK-4921)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900 shadow-sm"
          />
        </div>
      </div>

      {/* Verification Card */}
      {matchedCred ? (
        <SpotlightCard className="p-8 sm:p-10 bg-white border-zinc-200 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-zinc-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified & Authenticated
                </span>
                <span className="text-xs font-mono text-zinc-400">{matchedCred.credentialId}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950 mt-1">
                {matchedCred.title}
              </h2>
            </div>
          </div>

          {/* Record Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-zinc-400 text-[10px] uppercase font-semibold block">Candidate</span>
              <span className="font-bold text-zinc-900 text-sm mt-0.5 block">{profile.name}</span>
              <span className="text-zinc-500 text-[11px]">{profile.institution}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-zinc-400 text-[10px] uppercase font-semibold block">Evidence Level Awarded</span>
              <div className="mt-1">
                <EvidenceBadge level={matchedCred.evidenceLevel} size="md" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-zinc-400 text-[10px] uppercase font-semibold block">Issuing Authority</span>
              <span className="font-medium text-zinc-900 mt-0.5 block">{matchedCred.issuer}</span>
              <span className="text-zinc-500 text-[11px]">Date: {matchedCred.issueDate}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-zinc-400 text-[10px] uppercase font-semibold block">Evaluation Score</span>
              <span className="text-lg font-extrabold text-emerald-600 mt-0.5 block">{matchedCred.score}/100</span>
              <span className="text-zinc-500 text-[11px]">Passed multi-layer rubric audit</span>
            </div>
          </div>

          {/* Proven Skills */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
              Verified Technical Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matchedCred.skillsVerified.map(s => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-xs font-medium border border-zinc-200"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Cryptographic Signature Trace */}
          <div className="p-3 rounded-xl bg-zinc-900 text-zinc-300 font-mono text-[10px] space-y-1">
            <div className="text-zinc-500 font-semibold uppercase">Verification Blockchain / Hash Signature</div>
            <div className="text-zinc-300 break-all">
              0x8f2d4e7a1b9c3f5e0d1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e
            </div>
            <div className="text-emerald-400">Status: IMMUTABLE • RECORD_ACTIVE</div>
          </div>

          {/* Action to view portfolio */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Issued for recruiter and hiring partner verification.
            </span>
            <button
              onClick={() => setActiveRoute(`/portfolio/${profile.username}`)}
              className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Candidate Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </SpotlightCard>
      ) : (
        <SpotlightCard className="p-10 bg-white border-zinc-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-zinc-950">
            Credential Record Not Found
          </h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            No credential matches identifier &quot;{searchId}&quot;. Please verify the identifier or try a valid sample ID like <strong>SKP-2026-FSTK-4921</strong>.
          </p>
          <button
            onClick={() => setSearchId('SKP-2026-FSTK-4921')}
            className="mt-3 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium"
          >
            Load Sample Valid Credential
          </button>
        </SpotlightCard>
      )}
    </div>
  );
};
