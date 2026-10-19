import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { ProjectTemplate } from '../types';
import {
  FolderGit2,
  ArrowRight,
  GitBranch,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Layers,
  Sparkles,
  Send,
  AlertCircle,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projectTemplates, submissions, submitProjectForEvaluation, setActiveRoute } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(projectTemplates[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form submission state
  const [repoUrl, setRepoUrl] = useState('https://github.com/aryansharma-dev/distributed-task-worker');
  const [demoUrl, setDemoUrl] = useState('https://task-worker-demo.railway.app');
  const [desc, setDesc] = useState(
    'Asynchronous background worker pool handling high-throughput jobs with exponential backoff and dead-letter queue routing.'
  );
  const [architecture, setArchitecture] = useState(
    'Structured into an API gateway controller, a Redis Lua atomicity engine, and isolated worker processes. Used Docker compose for multi-container orchestration.'
  );
  const [tradeoffs, setTradeoffs] = useState(
    'Opted for Redis sorted sets over full Kafka cluster to minimize resource overhead while retaining sub-5ms job leasing latency.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !repoUrl) return;

    setIsSubmitting(true);
    try {
      await submitProjectForEvaluation({
        projectId: selectedTemplate.id,
        repositoryUrl: repoUrl,
        demoUrl,
        description: desc,
        architecturalDecisions: architecture,
        tradeoffsAndChallenges: tradeoffs,
      });
      setIsSubmitting(false);
      setActiveRoute('/submissions');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-28 px-4 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Project Studio & Verification Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Build & Verify Real-World Production Projects
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Never submit generic tutorial clones. Build differentiated systems with architectural depth.
          </p>
        </div>

        <button
          onClick={() => setActiveRoute('/submissions')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View Past Rubric Evaluations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Catalog Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projectTemplates.map(tmpl => {
          const isSelected = selectedTemplate?.id === tmpl.id;
          const isVerified = submissions.some(s => s.projectId === tmpl.id && s.status === 'Verified');

          return (
            <SpotlightCard
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl)}
              className={`p-5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-zinc-950 ring-1 ring-zinc-950 bg-zinc-50/50'
                  : 'bg-white hover:border-zinc-300'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-semibold uppercase text-zinc-600 tracking-wider">
                  {tmpl.category}
                </span>
                {isVerified && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-zinc-900 mt-2">{tmpl.title}</h3>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                {tmpl.problemStatement}
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                <span>⏱ {tmpl.duration}</span>
                <span className="font-medium text-zinc-700">{tmpl.difficulty}</span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Selected Project Workspace */}
      {selectedTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Brief Specifications (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <SpotlightCard className="p-6 bg-white space-y-4">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Active Project Brief
                </span>
                <h2 className="text-lg font-bold text-zinc-950 mt-1">
                  {selectedTemplate.title}
                </h2>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-zinc-900 mb-1">
                  The Problem Statement
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  {selectedTemplate.problemStatement}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-zinc-900 mb-1">
                  Real-World Industry Relevance
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {selectedTemplate.realWorldRelevance}
                </p>
              </div>

              {/* Functional Requirements */}
              <div>
                <h4 className="font-semibold text-xs text-zinc-900 mb-2">
                  Functional Requirements
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-600">
                  {selectedTemplate.functionalRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rubric Categories */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                <h4 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider">
                  Evaluation Rubric Dimensions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedTemplate.rubricCategories.map((r, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white border border-zinc-100">
                      <div className="flex justify-between font-medium text-zinc-800">
                        <span>{r.name}</span>
                        <span className="text-indigo-600 font-semibold">{r.weight}%</span>
                      </div>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Submission Form (1 Col) */}
          <div>
            <SpotlightCard className="p-6 bg-white space-y-4">
              <div className="pb-2 border-b border-zinc-100">
                <h3 className="font-bold text-sm text-zinc-900">
                  Submit for Multi-Layer Verification
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Automated checks + AI rubric audit + credential issuance.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Live Demo / Deployment URL
                  </label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={e => setDemoUrl(e.target.value)}
                    placeholder="https://my-demo-app.vercel.app"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Architectural Decisions & Trade-offs
                  </label>
                  <textarea
                    rows={3}
                    value={architecture}
                    onChange={e => setArchitecture(e.target.value)}
                    placeholder="Why did you choose this architecture over alternatives?"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900 resize-none leading-relaxed"
                  />
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                  <div className="flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Evidence-First Guarantee</span>
                  </div>
                  <p className="text-[10px] text-indigo-800">
                    A repository alone does not verify a skill. Submissions are audited against code structure, tests, and documentation rigor.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{isSubmitting ? 'Running Multi-Layer Rubric...' : 'Run Project Evaluation'}</span>
                </button>
              </form>
            </SpotlightCard>
          </div>
        </div>
      )}
    </div>
  );
};
