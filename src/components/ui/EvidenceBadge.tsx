import React from 'react';
import { EvidenceLevel } from '../../types';
import { ShieldCheck, CheckCircle2, Award, UserCheck, HelpCircle } from 'lucide-react';

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ 
  level, 
  size = 'md',
  showIcon = true 
}) => {
  const config = {
    'Mentor-Verified': {
      bg: 'bg-amber-50/80 text-amber-800 border-amber-200/80',
      icon: Award,
      label: 'Mentor-Verified',
      tooltip: 'Audited and verified by industry staff engineers or authorized mentors (100% weight).',
    },
    'Peer-Verified': {
      bg: 'bg-purple-50/80 text-purple-800 border-purple-200/80',
      icon: UserCheck,
      label: 'Peer-Verified',
      tooltip: 'Reviewed through structured rubric checks by verified peers (85% weight).',
    },
    'Project-Verified': {
      bg: 'bg-emerald-50/80 text-emerald-800 border-emerald-200/80',
      icon: ShieldCheck,
      label: 'Project-Verified',
      tooltip: 'Proven with deployed code, architecture documentation, and automated tests (75% weight).',
    },
    'Tested': {
      bg: 'bg-blue-50/80 text-blue-800 border-blue-200/80',
      icon: CheckCircle2,
      label: 'Tested',
      tooltip: 'Validated via interactive coding challenges and concept assessments (50% weight).',
    },
    'Claimed': {
      bg: 'bg-zinc-100/80 text-zinc-600 border-zinc-200',
      icon: HelpCircle,
      label: 'Self-Claimed',
      tooltip: 'Self-reported on profile without verified artifacts yet (15% weight).',
    },
  }[level] || {
    bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    icon: HelpCircle,
    label: level,
    tooltip: '',
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span 
      title={config.tooltip}
      className={`inline-flex items-center rounded-full font-medium border transition-colors ${config.bg} ${sizeClasses}`}
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
