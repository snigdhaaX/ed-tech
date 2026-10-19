import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { RoadmapTask, TaskSubmissionReview } from '../types';
import {
  MapPin,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  Bot,
  Send,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  Award,
  RefreshCw,
  FileCheck2,
  Key,
  ShieldCheck,
  AlertCircle,
  Terminal,
} from 'lucide-react';
import { ApiKeyModal } from '../components/navigation/ApiKeyModal';
import {
  evaluateTaskSubmissionWithGemini,
  hasConfiguredGeminiApiKey,
} from '../services/geminiService';

export const RoadmapView: React.FC = () => {
  const {
    roadmap,
    currentRole,
    roles,
    setTargetRole,
    saveTaskReview,
    triggerCelebration,
  } = useApp();

  const [selectedTask, setSelectedTask] = useState<RoadmapTask | null>(null);
  const [modalTab, setModalTab] = useState<'spec' | 'solution' | 'review' | 'tutor'>('solution');

  // Solution state
  const [submittedCode, setSubmittedCode] = useState('');
  const [explanationNotes, setExplanationNotes] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewStage, setReviewStage] = useState('Initializing review engine...');
  const [activeReview, setActiveReview] = useState<TaskSubmissionReview | null>(null);

  // Gemini Key state
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(() => hasConfiguredGeminiApiKey());

  // AI Tutor chat state inside task modal
  const [tutorMessages, setTutorMessages] = useState<Array<{ role: 'user' | 'tutor'; text: string }>>([
    {
      role: 'tutor',
      text: "Hello! I am your SkillProof Learning Assistant. Ask me to break down concepts, give you progressive hints, or explain architectural trade-offs without giving away direct answers.",
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Sync selected task code and existing review when task is opened
  const handleOpenTask = (task: RoadmapTask) => {
    setSelectedTask(task);
    setSubmittedCode(task.submission?.submittedCode || task.starterCode || '');
    setExplanationNotes(task.submission?.explanationNotes || '');
    setActiveReview(task.submission || null);
    setShowHint(false);

    // If task already has a review, start on review tab, otherwise solution tab
    if (task.submission) {
      setModalTab('review');
    } else {
      setModalTab('solution');
    }

    setTutorMessages([
      {
        role: 'tutor',
        text: `Welcome to **${task.title}**.\n\nYou can implement your solution in the code editor, submit it to the **Gemini AI Explanation Engine** for evaluation, and earn verified skill proof upon passing!`,
      },
    ]);
  };

  const handleResetStarter = () => {
    if (selectedTask?.starterCode) {
      setSubmittedCode(selectedTask.starterCode);
    }
  };

  const handleRunEvaluation = async () => {
    if (!selectedTask || !submittedCode.trim()) return;

    setIsReviewing(true);
    setModalTab('review');
    setReviewStage('Parsing code structure and AST...');

    const stageTimer1 = setTimeout(() => {
      setReviewStage('Evaluating against role rubric criteria...');
    }, 450);

    const stageTimer2 = setTimeout(() => {
      setReviewStage('Checking concurrency, edge cases & trade-offs...');
    }, 900);

    try {
      const reviewResult = await evaluateTaskSubmissionWithGemini({
        task: selectedTask,
        submittedCode,
        explanationNotes,
        targetRoleTitle: currentRole.title,
      });

      setActiveReview(reviewResult);
      setIsReviewing(false);

      if (reviewResult.passed) {
        saveTaskReview(selectedTask.id, reviewResult);
        triggerCelebration();
      }
    } catch (err) {
      console.error('Task evaluation error:', err);
      setIsReviewing(false);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
    }
  };

  const handleSendTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    setTutorMessages(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      let tutorReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('hint') || lower.includes('stuck') || lower.includes('help')) {
        tutorReply = selectedTask?.solutionHint
          ? `💡 **Guiding Hint**: ${selectedTask.solutionHint}\n\nNotice how separating concerns prevents premature race conditions. What happens if you inspect the execution plan first?`
          : `💡 Look at the input constraints first. Try writing out the types in pseudo-code before implementing the runtime logic.`;
      } else if (lower.includes('explain') || lower.includes('what is') || lower.includes('how')) {
        tutorReply = `Great question. In modern systems, **${selectedTask?.skillsCovered[0] || 'this concept'}** operates by decoupling the synchronization boundary. Rather than executing sequentially, we isolate state mutations and verify invariants before committing.`;
      } else {
        tutorReply = `That is a solid approach. Keep in mind: how will your solution handle boundary edge cases or sudden concurrency bursts? Test that constraint and you'll be ready to mark this task complete!`;
      }

      setTutorMessages(prev => [...prev, { role: 'tutor', text: tutorReply }]);
      setIsTyping(false);
    }, 500);
  };

  // Metrics
  const allTasks = roadmap.flatMap(m => m.tasks);
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const progressPct = Math.round((completedTasks.length / Math.max(1, allTasks.length)) * 100);

  return (
    <div className="pt-20 pb-28 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>Role-Adaptive Learning Path</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            {currentRole.title} Track
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
            Hands-on code challenges evaluated by the Gemini AI Explanation Engine. Solve tasks, submit solutions, and elevate your verifiable proof.
          </p>
        </div>

        {/* Role Switcher & Gemini Key Pill */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <select
            value={currentRole.id}
            onChange={e => setTargetRole(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-xs font-semibold text-zinc-900 outline-none cursor-pointer transition-colors"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                Track: {r.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setApiKeyModalOpen(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              hasApiKey
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200/70'
            }`}
            title="Configure Gemini API Key"
          >
            <Sparkles className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-600' : 'text-indigo-600'}`} />
            <span>{hasApiKey ? 'Gemini 2.5 Flash' : 'Set Gemini Key'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Milestone Bar */}
      <SpotlightCard className="p-5 bg-white border border-zinc-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Track Completion Status
            </span>
            <div className="text-sm font-semibold text-zinc-900 mt-0.5">
              {completedTasks.length} of {allTasks.length} milestones certified ({progressPct}%)
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Passing AI review elevates skill evidence to &quot;Tested&quot;</span>
          </div>
        </div>

        <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </SpotlightCard>

      {/* Modules List */}
      <div className="space-y-8">
        {roadmap.map((module, mIdx) => (
          <div key={module.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                {mIdx + 1}
              </span>
              <h2 className="font-bold text-sm sm:text-base text-zinc-900">
                {module.title}
              </h2>
            </div>
            <p className="text-xs text-zinc-500 ml-8 max-w-2xl">
              {module.description}
            </p>

            <div className="ml-0 sm:ml-8 space-y-3 mt-3">
              {module.tasks.map(task => {
                const isCompleted = task.status === 'completed';
                const isInProgress = task.status === 'in_progress';
                const isLocked = task.status === 'locked';

                return (
                  <SpotlightCard
                    key={task.id}
                    onClick={() => !isLocked && handleOpenTask(task)}
                    className={`p-4 sm:p-5 transition-all ${
                      isLocked
                        ? 'opacity-60 bg-zinc-50 cursor-not-allowed'
                        : 'bg-white cursor-pointer hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isInProgress ? (
                            <Clock className="w-4 h-4 text-amber-500" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4 text-zinc-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-xs sm:text-sm text-zinc-900">
                              {task.title}
                            </h3>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                              {task.difficulty}
                            </span>
                            {task.submission && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                task.submission.passed
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                Review: {task.submission.score}/100 ({task.submission.verdict})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {task.skillsCovered.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-mono"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span className="text-xs text-zinc-500 font-mono">
                          ~{task.estimatedHours}h
                        </span>
                        {!isLocked && (
                          <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                            <span>{isCompleted ? 'Review Solution' : 'Open Workspace'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Task Workspace & Explanation Engine Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-4xl w-full p-6 sm:p-8 text-left max-h-[92vh] overflow-y-auto space-y-6 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-3 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    Task Workspace
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                    {selectedTask.difficulty}
                  </span>
                  {selectedTask.status === 'completed' && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Certified Complete</span>
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-950 mt-1">
                  {selectedTask.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-zinc-400 hover:text-zinc-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-2xl border border-zinc-200 self-start text-xs font-semibold">
              <button
                onClick={() => setModalTab('solution')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  modalTab === 'solution'
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Code Solution</span>
              </button>

              <button
                onClick={() => setModalTab('review')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  modalTab === 'review'
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Explanation & Review</span>
                {activeReview && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-800">
                    {activeReview.score}/100
                  </span>
                )}
              </button>

              <button
                onClick={() => setModalTab('spec')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  modalTab === 'spec'
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Task Spec & Docs</span>
              </button>

              <button
                onClick={() => setModalTab('tutor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  modalTab === 'tutor'
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-cyan-600" />
                <span>AI Tutor Coach</span>
              </button>
            </div>

            {/* TAB 1: CODE SOLUTION & SUBMISSION WORKSPACE */}
            {modalTab === 'solution' && (
              <div className="space-y-4">
                {/* Prompt Recap Pill */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-start gap-2.5">
                  <Terminal className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-900 block mb-0.5">Coding Prompt:</span>
                    <p className="leading-relaxed">{selectedTask.taskPrompt}</p>
                  </div>
                </div>

                {/* Code Editor Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-emerald-600" />
                      <span>Your Implementation</span>
                    </span>
                    <span className="text-[11px] text-zinc-400">• TypeScript / SQL / Shell</span>
                  </div>

                  {selectedTask.starterCode && (
                    <button
                      onClick={handleResetStarter}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Starter Code</span>
                    </button>
                  )}
                </div>

                {/* Monospace Code Editor */}
                <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950 shadow-inner">
                  <div className="px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-mono">solution.ts</span>
                    <span>Write clean code with explicit types & error handling</span>
                  </div>
                  <textarea
                    rows={12}
                    value={submittedCode}
                    onChange={e => setSubmittedCode(e.target.value)}
                    placeholder="// Write your solution here..."
                    className="w-full p-4 bg-zinc-950 text-zinc-100 font-mono text-xs leading-relaxed outline-none resize-none border-none selection:bg-indigo-900"
                    spellCheck={false}
                  />
                </div>

                {/* Architectural Explanation Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-800 flex items-center justify-between">
                    <span>Architectural Notes & Trade-off Explanation (Optional but Recommended)</span>
                    <span className="text-[11px] font-normal text-zinc-500">Improves rubric review score</span>
                  </label>
                  <textarea
                    rows={3}
                    value={explanationNotes}
                    onChange={e => setExplanationNotes(e.target.value)}
                    placeholder="Describe your design choices: why this approach, how you handled edge cases, and memory/performance trade-offs..."
                    className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Submit CTA Bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {hasApiKey ? 'Live Gemini 2.5 Flash Review' : 'Smart Evaluator Active (Add Gemini key anytime)'}
                    </span>
                  </div>

                  <button
                    onClick={handleRunEvaluation}
                    disabled={isReviewing || !submittedCode.trim()}
                    className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>{isReviewing ? 'Analyzing...' : 'Submit Solution for AI Review'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: AI EXPLANATION & REVIEW REPORT */}
            {modalTab === 'review' && (
              <div className="space-y-5">
                {isReviewing ? (
                  /* Loading State */
                  <div className="p-12 text-center rounded-3xl bg-zinc-50 border border-zinc-200/80 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto animate-pulse">
                      <Sparkles className="w-6 h-6 animate-spin" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">Gemini Explanation Engine in Progress</h4>
                      <p className="text-xs text-zinc-500 mt-1">{reviewStage}</p>
                    </div>
                    <div className="w-48 bg-zinc-200 rounded-full h-1.5 mx-auto overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse w-3/4" />
                    </div>
                  </div>
                ) : activeReview ? (
                  /* Evaluation Outcome Report */
                  <div className="space-y-5">
                    {/* Score Hero Banner */}
                    <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      activeReview.passed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            activeReview.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {activeReview.verdict}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">
                            Model: {activeReview.modelUsed}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold">
                          {activeReview.passed
                            ? 'Congratulations! Solution Verified'
                            : 'Needs Revision Before Certification'}
                        </h3>
                        <p className="text-xs opacity-80">
                          {activeReview.passed
                            ? 'Your solution meets production engineering standards. Skill proof has been elevated.'
                            : 'Review the areas for improvement below, refine your code in the editor, and re-submit.'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                          Review Score
                        </span>
                        <div className={`text-3xl font-extrabold ${
                          activeReview.passed ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {activeReview.score}/100
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Concept Mastery */}
                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                        <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Concept Mastery Evaluation</span>
                        </h4>
                        <p className="text-zinc-600 leading-relaxed">
                          {activeReview.conceptMastery}
                        </p>
                      </div>

                      {/* Code Quality */}
                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                        <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Code Quality & Architecture</span>
                        </h4>
                        <p className="text-zinc-600 leading-relaxed">
                          {activeReview.codeQuality}
                        </p>
                      </div>

                      {/* Edge Cases */}
                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                        <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Edge Cases & Resilience</span>
                        </h4>
                        <ul className="text-zinc-600 space-y-1.5">
                          {activeReview.edgeCases.map((ec, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-500">•</span>
                              <span>{ec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Suggested Improvements */}
                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                        <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Suggested Improvements</span>
                        </h4>
                        <p className="text-zinc-600 whitespace-pre-line leading-relaxed">
                          {activeReview.suggestedImprovements}
                        </p>
                      </div>
                    </div>

                    {/* Model Solution / Pro Tip Snippet */}
                    {activeReview.modelSolutionSnippet && (
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Production Pattern Reference</span>
                        </span>
                        <pre className="text-xs font-mono text-zinc-200 overflow-x-auto p-2 bg-zinc-900 rounded-xl leading-relaxed">
                          {activeReview.modelSolutionSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <button
                        onClick={() => setModalTab('solution')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        ← Edit Solution & Re-evaluate
                      </button>

                      {activeReview.passed ? (
                        <button
                          onClick={() => {
                            setSelectedTask(null);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Milestone Verified & Saved</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setModalTab('solution')}
                          className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer"
                        >
                          Revise Code Now →
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Empty state */
                  <div className="p-8 text-center rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-500 text-xs space-y-2">
                    <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
                    <p>No review has been run yet for this task.</p>
                    <button
                      onClick={() => setModalTab('solution')}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Go to Code Editor & Submit Solution
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SPEC & RESOURCES */}
            {modalTab === 'spec' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-xs text-zinc-900 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Learning Objective</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    {selectedTask.learningObjective}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-zinc-900 mb-1 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Challenge Prompt</span>
                  </h4>
                  <p className="text-zinc-100 font-mono bg-zinc-950 p-3.5 rounded-xl leading-relaxed border border-zinc-800">
                    {selectedTask.taskPrompt}
                  </p>
                </div>

                {/* Rubric Criteria */}
                {selectedTask.evaluationCriteria && selectedTask.evaluationCriteria.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-900 mb-1.5 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>AI Evaluator Rubric Criteria</span>
                    </h4>
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
                      {selectedTask.evaluationCriteria.map((crit, i) => (
                        <div key={i} className="flex items-center gap-2 text-zinc-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{crit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progressive Hint Drawer */}
                {selectedTask.solutionHint && (
                  <div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer hover:bg-amber-100/70"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>{showHint ? 'Hide Hint' : 'Need a Progressive Hint?'}</span>
                    </button>
                    {showHint && (
                      <p className="mt-2 p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-900 text-xs leading-relaxed animate-in fade-in">
                        💡 {selectedTask.solutionHint}
                      </p>
                    )}
                  </div>
                )}

                {/* Documentation */}
                {selectedTask.resources.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-900 mb-1.5">
                      Curated Documentation & References
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:underline flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100"
                        >
                          <span>{res.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: AI TUTOR COACH */}
            {modalTab === 'tutor' && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">SkillProof AI Learning Coach</h4>
                    <span className="text-[10px] text-zinc-500">Ask for progressive hints or code debugging advice</span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="max-h-56 overflow-y-auto space-y-2 text-xs">
                  {tutorMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl max-w-[85%] ${
                        msg.role === 'tutor'
                          ? 'bg-white border border-zinc-200 text-zinc-800 self-start shadow-xs'
                          : 'bg-zinc-900 text-white ml-auto'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-400 text-xs w-20 flex gap-1 items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-200" />
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendTutor} className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder="Ask for an architectural clue or error explanation..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => {
          setApiKeyModalOpen(false);
          setHasApiKey(hasConfiguredGeminiApiKey());
        }}
        onKeyUpdated={() => setHasApiKey(hasConfiguredGeminiApiKey())}
      />
    </div>
  );
};
