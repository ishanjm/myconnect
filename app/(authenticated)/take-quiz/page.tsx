"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { hasPermission } from "@/common/permissions";
import { useRouter } from "next/navigation";
import { quizzesService, QuizItem } from "@/services/quizzesService";
import { clearQuizStatus } from "@/store/slices/quizzes";

export default function TakeQuizPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizItem | null>(null);

  useEffect(() => {
    if (user && !hasPermission(user.subscription, 'take_quiz')) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    return () => {
      dispatch(clearQuizStatus());
    };
  }, [dispatch]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.length !== 4) {
      setError("Please enter a valid 4-digit code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await quizzesService.joinQuiz(accessCode);
      setQuiz(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Quiz not found. Please check the code.");
    } finally {
      setIsLoading(false);
    }
  };

  if (quiz) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-bg">
        <div className="w-full max-w-2xl bg-surface rounded-3xl border border-border p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-fg tracking-tight">{quiz.title}</h1>
            <p className="text-fg opacity-60 font-medium">Ready to start? There are {quiz.questions.length} questions in this quiz.</p>
          </div>

          <div className="flex flex-col gap-3">
             <button
              onClick={() => { /* Start logic would go here, or we redirect to a taking page */ }}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              Start Quiz
            </button>
            <button
              onClick={() => setQuiz(null)}
              className="w-full py-4 bg-surface border border-border text-fg opacity-60 rounded-2xl font-bold text-sm hover:opacity-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-bg">
      <div className="w-full max-w-md bg-surface rounded-3xl border border-border p-10 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-fg tracking-tight uppercase">Enter Quiz Code</h1>
          <p className="text-fg opacity-40 font-medium text-sm">Type the 4-digit access code provided by your instructor to begin.</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-6">
          <div className="space-y-4">
            <input
              id="quiz-access-code-input"
              type="text"
              maxLength={4}
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="0 0 0 0"
              className="w-full text-center text-4xl font-black tracking-[1em] py-6 bg-bg border-2 border-border rounded-2xl focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-fg uppercase placeholder:opacity-20"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm font-bold text-center animate-shake">{error}</p>
            )}
          </div>

          <button
            id="quiz-join-button"
            type="submit"
            disabled={isLoading || accessCode.length !== 4}
            className="w-full py-4 bg-accent text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Validating...
              </div>
            ) : "Join Quiz"}
          </button>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-fg opacity-20">
          MyConnect Educational Platform
        </p>
      </div>
    </div>
  );
}
