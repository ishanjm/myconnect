import React, { useEffect, useState } from "react";
import { quizzesService, QuizAttemptItem } from "@/services/quizzesService";

interface StudentQuizDashboardProps {
  onJoinNewQuiz: () => void;
}

export default function StudentQuizDashboard({ onJoinNewQuiz }: StudentQuizDashboardProps) {
  const [attempts, setAttempts] = useState<QuizAttemptItem[]>([]);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    quizzesService.fetchAttempts()
      .then((data) => {
        if (isMounted) {
          setAttempts(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError("Failed to load quiz history.");
      })
      .finally(() => {
        if (isMounted) setIsLoadingAttempts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-fg)]">My Quizzes</h2>
          <p className="text-sm text-[var(--color-fg)] opacity-60 mt-1">View your past attempts or join a new quiz.</p>
        </div>
        <button
          onClick={onJoinNewQuiz}
          className="px-5 py-2 bg-accent text-white rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
        >
          Join New Quiz
        </button>
      </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 text-center font-bold">
            {error}
          </div>
        )}

        {isLoadingAttempts ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-50">
            <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-fg">Loading...</p>
          </div>
        ) : attempts.length === 0 && !error ? (
          <div className="rounded-xl border border-border p-8 text-center bg-[var(--color-bg)]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-2">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-fg mt-4">No Quiz Attempts Yet</h2>
            <p className="text-sm text-fg opacity-60 mt-1">You haven't taken any quizzes. Click "Join New Quiz" to start!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attempts.map((attempt) => {
              const date = attempt.createdAt ? new Date(attempt.createdAt).toLocaleDateString() : "Unknown Date";
              const isPass = attempt.score >= 50;
              return (
                <div key={attempt.id} className="rounded-xl border border-border p-4 bg-[var(--color-bg)] flex flex-col justify-between space-y-3 hover:border-accent/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-fg opacity-40">{date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isPass ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {isPass ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-fg line-clamp-2" title={attempt.quizTitle}>{attempt.quizTitle}</h3>
                  </div>
                  
                  <div className="flex items-end justify-between pt-3 border-t border-border">
                    <div>
                      <p className={`text-xl font-black ${isPass ? 'text-emerald-500' : 'text-red-500'}`}>{attempt.score}%</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-fg opacity-40 mt-0.5">{attempt.correctAnswers}/{attempt.totalQuestions} Correct</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}
