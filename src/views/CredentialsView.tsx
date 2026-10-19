import React from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  Calendar,
} from 'lucide-react';

export const CredentialsView: React.FC = () => {
  const { credentials, profile, setActiveRoute } = useApp();

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert(`Credential ID "${id}" copied!`);
  };

  return (
    <div className="pt-20 pb-28 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Verifiable Credentials Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          Your Cryptographic Proof Badges
        </h1>
        <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
          Every credential here is linked to an evaluated project, assessment pass, or mentor review. Share IDs or links with recruiters for instant verification.
        </p>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {credentials.map(cred => (
          <SpotlightCard key={cred.id} className="p-6 bg-white border-zinc-200 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                  {cred.category}
                </span>
                <EvidenceBadge level={cred.evidenceLevel} size="sm" />
              </div>

              <h3 className="font-bold text-sm sm:text-base text-zinc-950 leading-snug">
                {cred.title}
              </h3>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Credential ID:</span>
                  <div className="flex items-center gap-1.5 font-mono text-zinc-900 font-bold">
                    <span>{cred.credentialId}</span>
                    <button
                      onClick={() => handleCopyId(cred.credentialId)}
                      className="text-zinc-600 hover:text-zinc-700 p-0.5"
                      title="Copy ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Issued By:</span>
                  <span className="text-zinc-800 font-medium">{cred.issuer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Issue Date:</span>
                  <span className="text-zinc-800">{cred.issueDate}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-zinc-600 font-semibold uppercase block mb-1">
                  Skills Proven:
                </span>
                <div className="flex flex-wrap gap-1">
                  {cred.skillsVerified.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700">
                Score: {cred.score}/100
              </span>
              <button
                onClick={() => setActiveRoute(cred.verificationUrl)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Credential</span>
              </button>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};
