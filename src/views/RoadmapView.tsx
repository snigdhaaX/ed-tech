import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { RoadmapTask } from '../types';
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
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { roadmap, currentRole, completeRoadmapTask } = useApp();
  const [selectedTask, setSelectedTask] = useState<RoadmapTask | null>(null);

  // AI Tutor chat state inside task modal
  const [tutorMessages, setTutorMessages] = useState<Array<{ role: 'user' | 'tutor'; text: string }>>([
    {
      role: 'tutor',
      text: "Hello! I am your SkillProof Learning Assistant. Ask me to break down concepts, give you progressive hints, or explain architectural trade-offs without giving away direct answers.",
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleOpenTask = (task: RoadmapTask) => {
    setSelectedTask(task);
    setTutorMessages([
      {
        role: 'tutor',
        text: `Welcome to **${task.title}**. What concept would you like to unpack first, or would you like a progressive hint for the task prompt?`,
      },
    ]);
  };

  const handleSendTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    setTutorMessages(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput('');
    setIsTyping(true);

    // Dynamic AI tutor response (progressive coaching)
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
    }, 600);
  };

  return (
    <div className="pt-20 pb-28 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>Adaptive Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            {currentRole.title} Learning Roadmap
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Progressive modules with hands-on coding tasks and an interactive AI tutor.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-zinc-100 text-xs font-medium text-zinc-700">
          Role Track: <strong className="text-zinc-900">{currentRole.title}</strong>
        </div>
      </div>

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
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-xs sm:text-sm text-zinc-900">
                              {task.title}
                            </h3>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                              {task.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span className="text-xs text-zinc-600 font-mono">
                          ~{task.estimatedHours}h
                        </span>
                        {!isLocked && (
                          <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                            <span>Open</span>
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

      {/* Task Detail & AI Tutor Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto space-y-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Modal Bar */}
            <div className="flex items-start justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                  Task Specification
                </span>
                <h2 className="text-lg font-bold text-zinc-950 mt-0.5">
                  {selectedTask.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-zinc-400 hover:text-zinc-700 text-base"
              >
                ✕
              </button>
            </div>

            {/* Objective & Prompt */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-xs text-zinc-900 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Learning Objective</span>
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  {selectedTask.learningObjective}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-zinc-900 mb-1 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coding Exercise Prompt</span>
                </h4>
                <p className="text-xs text-zinc-100 font-mono bg-zinc-950 p-3.5 rounded-xl leading-relaxed border border-zinc-800">
                  {selectedTask.taskPrompt}
                </p>
              </div>

              {/* Curated Resources */}
              {selectedTask.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-xs text-zinc-900 mb-1">
                    Curated Documentation
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

            {/* Interactive AI Tutor Section */}
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
              <div className="max-h-48 overflow-y-auto space-y-2 text-xs">
                {tutorMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl max-w-[85%] ${
                      msg.role === 'tutor'
                        ? 'bg-white border border-zinc-200 text-zinc-800 self-start shadow-sm'
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
                  placeholder="Ask for a progressive hint or explain an error..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>

            {/* Complete Task CTA */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                Completing tasks unlocks advanced modules & boosts role readiness.
              </span>

              {selectedTask.status !== 'completed' ? (
                <button
                  onClick={() => {
                    completeRoadmapTask(selectedTask.id);
                    setSelectedTask(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Completed & Elevate Skill</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Complete</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
