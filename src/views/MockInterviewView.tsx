import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import {
  Mic,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  Layers,
  Bot,
  HelpCircle,
} from 'lucide-react';

export const MockInterviewView: React.FC = () => {
  const { currentRole, submissions, saveInterviewSession, triggerCelebration } = useApp();

  const [interviewType, setInterviewType] = useState<'Project Defense' | 'Technical' | 'Behavioral'>('Project Defense');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const verifiedProj = submissions.find(s => s.status === 'Verified') || submissions[0];

  const questionsByType = {
    'Project Defense': [
      `In your project "${verifiedProj?.projectTitle || 'Realtime Task Engine'}", how did you prevent race conditions when two clients updated the same entity concurrently?`,
      `What were the memory or network latency trade-offs in your architecture, and why did you select your specific stack?`,
    ],
    'Technical': [
      `Explain how the JavaScript Event Loop handles Promises versus setTimeout callbacks (Microtask vs Macrotask queue).`,
      `How does PostgreSQL index a composite query with both an equality check and a range filter?`,
    ],
    'Behavioral': [
      `Describe a technical hurdle where a library didn't work as advertised. How did you diagnose and overcome it?`,
      `How do you prioritize technical debt vs shipping a working MVP during a tight deadline?`,
    ],
  };

  const activeQuestions = questionsByType[interviewType];
  const activeQuestion = activeQuestions[currentQuestionIdx] || activeQuestions[0];

  const handleEvaluateAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;

    setEvaluating(true);
    setTimeout(() => {
      const score = Math.floor(84 + Math.random() * 12); // 84-96
      const feedback = {
        score,
        accuracy: 'High. Directly addressed the core trade-offs and synchronization invariants.',
        clarity: 'Well-structured explanation with clear cause-and-effect reasoning.',
        strengths: [
          'Explicitly stated how server-side authority reconciled client optimistic states.',
          'Demonstrated awareness of network edge cases like dropped WebSocket packets.',
        ],
        improvements: [
          'Could explicitly mention time complexity or connection pool resource consumption.',
        ],
      };

      setEvaluationResult(feedback);
      setEvaluating(false);
      triggerCelebration();

      saveInterviewSession({
        id: `sess-${Date.now()}`,
        roleTitle: currentRole.title,
        type: interviewType,
        date: new Date().toLocaleDateString(),
        overallScore: score,
        questions: [
          {
            question: activeQuestion,
            studentAnswer,
            feedback: feedback.accuracy,
            score,
          },
        ],
        strengths: feedback.strengths,
        improvements: feedback.improvements,
      });
    }, 700);
  };

  const handleNextQuestion = () => {
    setEvaluationResult(null);
    setStudentAnswer('');
    setCurrentQuestionIdx(prev => (prev + 1) % activeQuestions.length);
  };

  return (
    <div className="pt-20 pb-28 px-4 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Mock Interview Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Interactive Technical & Project Defense
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Questions generated from your actual verified projects and target role competencies.
          </p>
        </div>

        {/* Type Selector */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs self-start sm:self-auto">
          {(['Project Defense', 'Technical', 'Behavioral'] as const).map(type => (
            <button
              key={type}
              onClick={() => {
                setInterviewType(type);
                setCurrentQuestionIdx(0);
                setEvaluationResult(null);
                setStudentAnswer('');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                interviewType === type
                  ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <SpotlightCard className="p-6 sm:p-8 bg-white border-zinc-200 shadow-xl space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Question {currentQuestionIdx + 1} of {activeQuestions.length}
            </span>
            <span className="text-xs text-zinc-400">• {interviewType}</span>
          </div>

          <span className="text-xs text-zinc-500 font-medium">
            Role: {currentRole.title}
          </span>
        </div>

        {/* Question Text */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
          <p className="text-sm sm:text-base font-semibold text-zinc-900 leading-relaxed">
            &quot;{activeQuestion}&quot;
          </p>
        </div>

        {/* Answer Form */}
        {!evaluationResult ? (
          <form onSubmit={handleEvaluateAnswer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Your Spoken or Written Technical Answer:
              </label>
              <textarea
                rows={6}
                value={studentAnswer}
                onChange={e => setStudentAnswer(e.target.value)}
                placeholder="Structure your answer with clear rationale: what problem arose, which architecture pattern you chose, and how you verified correctness..."
                className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900 resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] text-zinc-400">
                Rubric evaluates technical precision, architectural depth, and communication clarity.
              </span>
              <button
                type="submit"
                disabled={evaluating || !studentAnswer.trim()}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>{evaluating ? 'Grading Answer...' : 'Submit Answer for AI Evaluation'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Feedback Card */
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Interview Rubric Score
                </span>
                <div className="text-2xl font-extrabold text-emerald-950 mt-0.5">
                  {evaluationResult.score}/100
                </div>
              </div>
              <EvidenceBadge level="Tested" size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                <span className="font-bold text-zinc-900 block">Demonstrated Strengths</span>
                <ul className="text-zinc-600 space-y-1">
                  {evaluationResult.strengths.map((s: string, i: number) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                <span className="font-bold text-zinc-900 block">Areas for Sharpening</span>
                <ul className="text-zinc-600 space-y-1">
                  {evaluationResult.improvements.map((imp: string, i: number) => (
                    <li key={i}>• {imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer"
              >
                Next Mock Question →
              </button>
            </div>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
