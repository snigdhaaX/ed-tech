import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import { ReadinessGauge } from '../components/ui/ReadinessGauge';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  GitBranch,
  Terminal,
  FileCheck,
  Award,
  Search,
  ExternalLink,
  ChevronDown,
  Layers,
  Code2,
  Cpu,
  BarChart3,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingView: React.FC = () => {
  const { setActiveRoute, roles, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState<'preview' | 'breakdown'>('preview');
  const [selectedRoleDemo, setSelectedRoleDemo] = useState(roles[0]);
  const [testCredId, setTestCredId] = useState('SKP-2026-FSTK-4921');
  const [credVerified, setCredVerified] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleTestVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (testCredId.trim()) {
      setActiveRoute(`/verify-credential/${testCredId.trim()}`);
    }
  };

  const faqs = [
    {
      q: 'How does SkillProof verify my technical skills?',
      a: 'SkillProof does not accept self-claimed certificates or passive video watching. Skills earn verification only when backed by reproducible GitHub repositories, passing test suites, architecture defense documentation, and multi-layer rubric evaluations.',
    },
    {
      q: 'What is the Evidence Hierarchy?',
      a: 'We rank skills across five strict tiers: Claimed (15% weight), Tested via interactive code challenge (50%), Project-Verified with deployed code (75%), Peer-Verified (85%), and Mentor-Verified by staff engineers (100%).',
    },
    {
      q: 'How is the Role-Readiness Score calculated?',
      a: 'It is a mathematical composite: 40% Required Skill Coverage & Evidence Quality + 40% Verified Project Production Depth + 20% Technical Assessments and Mock Interview Performance.',
    },
    {
      q: 'Can recruiters verify my portfolio without logging in?',
      a: 'Yes. Every student can publish a clean, public portfolio URL (e.g., /portfolio/aryansharma) and cryptographic credential links that can be verified anywhere without paywalls or login friction.',
    },
  ];

  return (
    <div className="relative pt-20 pb-28">
      {/* Hero Section */}
      <section className="relative px-4 max-w-5xl mx-auto text-center pt-8 sm:pt-14">
        {/* Subtle Pill Tag (ReactBits style) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200/90 text-xs font-medium text-zinc-700 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>Evidence-First Learning & Employability Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 leading-[1.12]"
        >
          Your Skills Deserve More Than a{' '}
          <span className="relative inline-block">
            <span className="relative z-10 underline underline-offset-8 decoration-indigo-300 decoration-wavy decoration-2">
              Line on Your Resume
            </span>
          </span>
          .
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed"
        >
          Build real projects, prove what you can do, and turn your engineering skills into career opportunities with AI-powered skill intelligence.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => setActiveRoute('/onboarding')}
            className="px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-semibold shadow-lg shadow-zinc-950/10 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
          >
            <span>Build My Skill Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveRoute('/dashboard')}
            className="px-6 py-3 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold border border-zinc-200/90 shadow-sm transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Live Dashboard</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </button>
        </motion.div>

        {/* Floating Interactive Product Preview Widget */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="mt-12 text-left"
        >
          <SpotlightCard className="p-6 sm:p-8 bg-white/95 border-zinc-200 shadow-2xl shadow-zinc-900/5">
            {/* Widget top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-zinc-900">SkillProof Live Evidence Engine</h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Active Demonstration
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">Autonomous evaluation, rubric scoring, and role readiness</p>
                </div>
              </div>

              {/* Role selector inside preview */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100/70 border border-zinc-200/70 text-xs">
                {roles.slice(0, 3).map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoleDemo(r)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      selectedRoleDemo.id === r.id
                        ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Widget Interactive Content Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Pillar 1: Readiness Score */}
              <div className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-100 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Role-Readiness Metric
                </span>
                <ReadinessGauge
                  score={86}
                  skillScore={88}
                  projectScore={85}
                  assessmentScore={82}
                  roleTitle={selectedRoleDemo.title}
                  size="md"
                />
                <p className="text-[11px] text-zinc-500 mt-3 max-w-[200px]">
                  Computed from verified skills + project rubric passes
                </p>
              </div>

              {/* Pillar 2: Verified Skills Matrix */}
              <div className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Core Skill Coverage
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    4/5 Verified
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedRoleDemo.requiredSkills.slice(0, 4).map((skill, idx) => (
                    <div key={skill} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-zinc-100">
                      <span className="font-medium text-zinc-800">{skill}</span>
                      <EvidenceBadge
                        level={idx === 0 ? 'Mentor-Verified' : idx === 1 ? 'Project-Verified' : 'Tested'}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 3: Project Verification Status */}
              <div className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Project Evidence
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Live Repo & Demo</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-zinc-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-900 truncate">
                      Realtime Task Engine
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      92/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <GitBranch className="w-3 h-3 text-zinc-400" />
                    <span>WebSocket optimistic queue</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-medium">✓ Passed 5/5 Rubrics</span>
                    <span className="font-mono text-zinc-400 text-[10px]">SKP-2026-FSTK</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveRoute('/projects')}
                  className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors text-center cursor-pointer"
                >
                  View Complete Project Catalog →
                </button>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <section className="mt-28 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            The Employability Gap
          </span>
          <h2 className="mt-2 text-3xl font-bold text-zinc-950 tracking-tight">
            Why Traditional Learning Fails Engineering Students
          </h2>
          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            Every year, thousands of students complete identical tutorial clones, obtain participation certificates, and send out identical resumes—yet recruiters cannot tell who can actually write production code.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Blind Learning Without Expectations',
              desc: 'Students study topics randomly without understanding what modern engineering teams in India and globally actually expect for internship entry.',
              icon: Search,
            },
            {
              title: 'Paper Certificates Prove Zero Code',
              desc: 'Certificates of completion only prove that video was streamed. They do not demonstrate debugging, architecture, or edge-case handling.',
              icon: FileCheck,
            },
            {
              title: 'Generic Tutorial Clones',
              desc: 'Building another generic To-Do or Netflix clone fails to differentiate candidates when hundreds of applicants submit the exact same code.',
              icon: Code2,
            },
            {
              title: 'Zero Actionable Feedback',
              desc: 'Students receive automated rejection emails with no explanation of missing required skills, architectural flaws, or roadmap gaps.',
              icon: BarChart3,
            },
            {
              title: 'Recruiter Verification Fatigue',
              desc: 'Hiring managers spend 6 seconds per resume. They lack the time to clone and run 200 random GitHub repositories manually.',
              icon: Users,
            },
            {
              title: 'The Evidence-First Solution',
              desc: 'SkillProof provides mathematical role readiness, automated project verification, and cryptographic credential proof recruiters trust.',
              icon: ShieldCheck,
              highlight: true,
            },
          ].map((item, idx) => (
            <SpotlightCard
              key={idx}
              className={`p-6 ${
                item.highlight ? 'bg-zinc-950 text-white border-zinc-900' : 'bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${
                  item.highlight ? 'bg-zinc-800 text-cyan-300' : 'bg-zinc-100 text-zinc-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <h3 className={`font-semibold text-sm ${item.highlight ? 'text-white' : 'text-zinc-900'}`}>
                {item.title}
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${item.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {item.desc}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 5-Step How It Works */}
      <section className="mt-28 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            The 5-Step Methodology
          </span>
          <h2 className="mt-2 text-3xl font-bold text-zinc-950 tracking-tight">
            How SkillProof Turns Learning into Proof
          </h2>
          <p className="mt-3 text-sm text-zinc-600">
            A structured, transparent pathway from career exploration to recruiter-ready verified evidence.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {[
            {
              step: '01',
              title: 'Discover Your Target Role & Benchmark Expectations',
              desc: 'Explore 10 curated engineering roles (Full-Stack, Backend, ML, DevOps). Understand exact required technologies, day-to-day responsibilities, and industry salary ranges.',
              action: 'Explore Career Roles',
              route: '/career-explorer',
            },
            {
              step: '02',
              title: 'Assess Existing Skills & Run Job Description Gap Intelligence',
              desc: 'Upload your resume or paste a specific job description. SkillProof isolates missing required vs preferred skills, categorizing gaps by priority and severity.',
              action: 'Run Skill Gap Analysis',
              route: '/skill-gap',
            },
            {
              step: '03',
              title: 'Follow an Adaptive, Milestone-Driven Roadmap',
              desc: 'Work through interactive tasks with clear learning objectives, curated technical documentation, progressive hints, and an AI tutor for debugging.',
              action: 'Open Interactive Roadmap',
              route: '/roadmap',
            },
            {
              step: '04',
              title: 'Build and Verify Production-Grade Projects',
              desc: 'Choose from non-trivial project templates (Distributed task queues, collaborative engines, RAG pipelines). Submit GitHub repos and live demos for multi-layer evaluation.',
              action: 'Browse Project Studio',
              route: '/projects',
            },
            {
              step: '05',
              title: 'Publish Verifiable Evidence & Land Opportunities',
              desc: 'Share your public portfolio URL with interactive case studies, cryptographic credential IDs, and apply directly to matching internships.',
              action: 'View Student Portfolio',
              route: '/portfolio',
            },
          ].map((s, idx) => (
            <SpotlightCard key={idx} className="p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="font-mono text-2xl font-bold text-zinc-300 shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">{s.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xl leading-relaxed">{s.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveRoute(s.route)}
                className="px-4 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-medium border border-zinc-200 transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
              >
                <span>{s.action}</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </button>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Interactive Credential Verification Sandbox */}
      <section className="mt-28 px-4 max-w-4xl mx-auto">
        <SpotlightCard className="p-8 sm:p-10 bg-zinc-950 text-white border-zinc-900">
          <div className="max-w-xl mx-auto text-center">
            <Award className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold tracking-tight">
              Test Public Credential Verification
            </h2>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Every credential issued by SkillProof carries an immutable identifier. Test the verification lookup right now:
            </p>

            <form onSubmit={handleTestVerify} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={testCredId}
                onChange={e => setTestCredId(e.target.value)}
                placeholder="Enter Credential ID (e.g. SKP-2026-FSTK-4921)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Live</span>
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-zinc-400">
              <span>Try sample IDs:</span>
              <button
                onClick={() => setTestCredId('SKP-2026-FSTK-4921')}
                className="underline hover:text-white font-mono"
              >
                SKP-2026-FSTK-4921
              </button>
              <span>•</span>
              <button
                onClick={() => setTestCredId('SKP-2026-TS-8841')}
                className="underline hover:text-white font-mono"
              >
                SKP-2026-TS-8841
              </button>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mt-28 px-4 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="mt-2 text-3xl font-bold text-zinc-950 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => (
            <SpotlightCard key={idx} className="p-5 bg-white cursor-pointer" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-zinc-900">{faq.q}</h3>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === idx && (
                <p className="mt-3 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                  {faq.a}
                </p>
              )}
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Final Conversion CTA */}
      <section className="mt-28 px-4 max-w-4xl mx-auto text-center">
        <SpotlightCard className="p-10 sm:p-14 bg-gradient-to-b from-white to-zinc-50/70 border-zinc-200">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Stop Guessing. Start Proving.
          </h2>
          <p className="text-sm text-zinc-600 mt-3 max-w-lg mx-auto">
            Join engineering students across India turning self-claimed skills into verified, recruiter-ready portfolios.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveRoute('/onboarding')}
              className="px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveRoute('/career-explorer')}
              className="px-7 py-3 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold border border-zinc-200 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              Explore 10 Tech Roles
            </button>
          </div>
        </SpotlightCard>
      </section>

      {/* Minimalist Footer */}
      <footer className="mt-28 border-t border-zinc-200/80 pt-10 text-xs text-zinc-500 max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center text-white">
            <ShieldCheck className="w-3 h-3 text-cyan-300" />
          </div>
          <span className="font-semibold text-zinc-800">SkillProof</span>
          <span>© 2026. Evidence-First Skill Verification.</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setActiveRoute('/')} className="hover:text-zinc-900">Privacy Policy</button>
          <button onClick={() => setActiveRoute('/')} className="hover:text-zinc-900">Verification Ethics</button>
          <button onClick={() => setActiveRoute('/')} className="hover:text-zinc-900">Security Disclaimers</button>
        </div>
      </footer>
    </div>
  );
};
