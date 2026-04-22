"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { hasPermission } from "@/common/permissions";
import { useRouter } from "next/navigation";
import { quizzesService, QuizItem, QuizAttemptAnswer } from "@/services/quizzesService";
import { QuizQuestion } from "@/model/Quiz";

type Phase = "code" | "preview" | "taking" | "results";

/** Fisher–Yates shuffle (returns new array) */
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function TakeQuizPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  /* ── Shared state ──────────────────────────────────────────── */
  const [phase, setPhase] = useState<Phase>("code");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ── Code entry ────────────────────────────────────────────── */
  const [accessCode, setAccessCode] = useState("");

  /* ── Quiz data ─────────────────────────────────────────────── */
  const [quiz, setQuiz] = useState<QuizItem | null>(null);

  /* ── Taking state ──────────────────────────────────────────── */
  const [preparedQuestions, setPreparedQuestions] = useState<QuizQuestion[]>([]);
  const [answerMap, setAnswerMap] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  /* ── Results state ─────────────────────────────────────────── */
  const [resultScore, setResultScore] = useState(0);
  const [resultCorrect, setResultCorrect] = useState(0);
  const [resultTotal, setResultTotal] = useState(0);
  const [resultTimeSec, setResultTimeSec] = useState(0);
  const [resultAnswers, setResultAnswers] = useState<QuizAttemptAnswer[]>([]);
  const [isSavingResult, setIsSavingResult] = useState(false);

  /* ── Auth guard ────────────────────────────────────────────── */
  useEffect(() => {
    if (user && !hasPermission(user.subscription, "take_quiz")) {
      router.push("/");
    }
  }, [user, router]);

  /* ── Timer ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "taking") return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [phase, startTime]);

  /* ── Helpers ───────────────────────────────────────────────── */
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  /* ── Join Quiz ─────────────────────────────────────────────── */
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
      setPhase("preview");
    } catch (err: any) {
      setError(err.response?.data?.error || "Quiz not found. Please check the code.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Start Quiz ────────────────────────────────────────────── */
  const handleStart = useCallback(() => {
    if (!quiz) return;
    let questions: QuizQuestion[] = quiz.questions.map((q) => ({
      ...q,
      answers: quiz.shuffleAnswers ? shuffle(q.answers) : [...q.answers],
    }));
    if (quiz.shuffleQuestions) questions = shuffle(questions);
    setPreparedQuestions(questions);
    setAnswerMap({});
    setCurrentIdx(0);
    setStartTime(Date.now());
    setElapsed(0);
    setPhase("taking");
  }, [quiz]);

  /* ── Select Answer ─────────────────────────────────────────── */
  const selectAnswer = (qIdx: number, aIdx: number) => {
    setAnswerMap((prev) => ({ ...prev, [qIdx]: aIdx }));
  };

  /* ── Submit Quiz ───────────────────────────────────────────── */
  const handleSubmit = useCallback(async () => {
    if (!quiz) return;
    setIsSavingResult(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    let correct = 0;
    const answers: QuizAttemptAnswer[] = preparedQuestions.map((q, idx) => {
      const selectedIdx = answerMap[idx] ?? -1;
      const isCorrect = selectedIdx >= 0 && q.answers[selectedIdx]?.isCorrect === true;
      if (isCorrect) correct++;
      return { questionIndex: idx, selectedAnswerIndex: selectedIdx, isCorrect };
    });
    const total = preparedQuestions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    setResultCorrect(correct);
    setResultTotal(total);
    setResultScore(score);
    setResultTimeSec(timeTaken);
    setResultAnswers(answers);

    try {
      await quizzesService.saveAttempt({
        quizId: quiz.id,
        quizTitle: quiz.title,
        totalQuestions: total,
        correctAnswers: correct,
        score,
        answers,
        timeTakenSeconds: timeTaken,
      });
    } catch {
      // Silently fail save — results are still shown
    } finally {
      setIsSavingResult(false);
      setPhase("results");
    }
  }, [quiz, answerMap, preparedQuestions, startTime]);

  const answeredCount = useMemo(() => Object.keys(answerMap).length, [answerMap]);
  const currentQuestion = preparedQuestions[currentIdx];

  /* ───────────────────────── PHASE: CODE ────────────────────── */
  if (phase === "code") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-bg">
        <div className="w-full max-w-md bg-surface rounded-3xl border border-border p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 id="take-quiz-title" className="text-3xl font-black text-fg tracking-tight uppercase">Enter Quiz Code</h1>
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
              {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
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
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-fg opacity-20">MyConnect Educational Platform</p>
        </div>
      </div>
    );
  }

  /* ───────────────────── PHASE: PREVIEW ─────────────────────── */
  if (phase === "preview" && quiz) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-bg">
        <div id="take-quiz-preview" className="w-full max-w-2xl bg-surface rounded-3xl border border-border p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-fg tracking-tight">{quiz.title}</h1>
            <p className="text-fg opacity-60 font-medium">Ready to start? There are {quiz.questions.length} questions in this quiz.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg rounded-2xl p-4 border border-border text-center">
              <p className="text-3xl font-black text-accent">{quiz.questions.length}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-fg opacity-40 mt-1">Questions</p>
            </div>
            <div className="bg-bg rounded-2xl p-4 border border-border text-center">
              <p className="text-3xl font-black text-accent">{quiz.shuffleQuestions ? "Yes" : "No"}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-fg opacity-40 mt-1">Shuffle</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              id="quiz-start-button"
              onClick={handleStart}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              Start Quiz
            </button>
            <button
              onClick={() => { setQuiz(null); setPhase("code"); setAccessCode(""); }}
              className="w-full py-4 bg-surface border border-border text-fg opacity-60 rounded-2xl font-bold text-sm hover:opacity-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────────── PHASE: TAKING ──────────────────────── */
  if (phase === "taking" && quiz && currentQuestion) {
    return (
      <div className="min-h-[80vh] bg-bg p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top bar */}
          <div id="take-quiz-topbar" className="flex items-center justify-between bg-surface border border-border rounded-2xl px-6 py-4 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-fg opacity-40">Quiz</span>
              <h2 className="text-lg font-bold text-fg truncate max-w-[200px]">{quiz.title}</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-fg opacity-60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-bold tabular-nums">{formatTime(elapsed)}</span>
              </div>
              <span className="text-sm font-bold text-accent">{answeredCount}/{preparedQuestions.length}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIdx + 1) / preparedQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div id="take-quiz-question-card" className="bg-surface border border-border rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-accent">Question {currentIdx + 1} of {preparedQuestions.length}</p>
                <h3 className="text-xl font-bold text-fg leading-relaxed">{currentQuestion.prompt}</h3>
              </div>
            </div>

            <div className="space-y-3">
              {currentQuestion.answers.map((answer, aIdx) => {
                const isSelected = answerMap[currentIdx] === aIdx;
                return (
                  <button
                    key={aIdx}
                    id={`quiz-answer-${currentIdx}-${aIdx}`}
                    onClick={() => selectAnswer(currentIdx, aIdx)}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "border-accent bg-accent/10 text-fg shadow-md"
                        : "border-border bg-bg text-fg opacity-70 hover:opacity-100 hover:border-border hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm ${
                        isSelected ? "border-accent bg-accent text-white" : "border-border text-fg opacity-40"
                      }`}>
                        {String.fromCharCode(65 + aIdx)}
                      </div>
                      <span>{answer.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              id="quiz-prev-btn"
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="px-6 py-3 bg-surface border border-border text-fg rounded-2xl font-bold text-sm hover:bg-bg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Previous
            </button>

            {/* Question dots */}
            <div className="flex gap-1.5 flex-wrap justify-center">
              {preparedQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    idx === currentIdx
                      ? "bg-accent scale-125"
                      : answerMap[idx] !== undefined
                        ? "bg-emerald-500"
                        : "bg-border"
                  }`}
                />
              ))}
            </div>

            {currentIdx < preparedQuestions.length - 1 ? (
              <button
                id="quiz-next-btn"
                onClick={() => setCurrentIdx((i) => Math.min(preparedQuestions.length - 1, i + 1))}
                className="px-6 py-3 bg-accent text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
              >
                Next →
              </button>
            ) : (
              <button
                id="quiz-submit-btn"
                onClick={handleSubmit}
                disabled={answeredCount < preparedQuestions.length || isSavingResult}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                {isSavingResult ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>

          {/* Unanswered warning */}
          {answeredCount < preparedQuestions.length && currentIdx === preparedQuestions.length - 1 && (
            <p className="text-center text-amber-500 text-xs font-bold">
              Please answer all {preparedQuestions.length - answeredCount} remaining question(s) before submitting.
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ───────────────────── PHASE: RESULTS ─────────────────────── */
  if (phase === "results" && quiz) {
    const scoreColor = resultScore >= 80 ? "text-emerald-500" : resultScore >= 50 ? "text-amber-500" : "text-red-500";
    const scoreLabel = resultScore >= 80 ? "Excellent!" : resultScore >= 50 ? "Good Effort!" : "Keep Practicing!";
    const scoreBg = resultScore >= 80 ? "bg-emerald-500/10" : resultScore >= 50 ? "bg-amber-500/10" : "bg-red-500/10";

    return (
      <div className="min-h-[80vh] bg-bg p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Score card */}
          <div id="take-quiz-results" className={`${scoreBg} border border-border rounded-3xl p-10 text-center space-y-4`}>
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${scoreBg}`}>
              <span className={`text-5xl font-black ${scoreColor}`}>{resultScore}%</span>
            </div>
            <h1 className={`text-3xl font-black ${scoreColor}`}>{scoreLabel}</h1>
            <p className="text-fg opacity-60 font-medium">{quiz.title}</p>
            <div className="flex items-center justify-center gap-8 pt-2">
              <div className="text-center">
                <p className="text-2xl font-black text-fg">{resultCorrect}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-fg opacity-40">Correct</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-black text-fg">{resultTotal}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-fg opacity-40">Total</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-black text-fg">{formatTime(resultTimeSec)}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-fg opacity-40">Time</p>
              </div>
            </div>
          </div>

          {/* Answer review */}
          <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-black text-fg">Answer Review</h2>
            <div className="space-y-3">
              {preparedQuestions.map((q, idx) => {
                const attempt = resultAnswers[idx];
                const selectedIdx = attempt?.selectedAnswerIndex ?? -1;
                const isCorrect = attempt?.isCorrect ?? false;
                const correctIdx = q.answers.findIndex((a) => a.isCorrect);

                return (
                  <div
                    key={idx}
                    id={`quiz-result-question-${idx}`}
                    className={`rounded-2xl border p-5 space-y-3 ${
                      isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white ${
                        isCorrect ? "bg-emerald-500" : "bg-red-500"
                      }`}>
                        {isCorrect ? "✓" : "✗"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-fg">Q{idx + 1}: {q.prompt}</p>
                        <div className="mt-2 space-y-1">
                          {q.answers.map((a, aIdx) => {
                            let cls = "text-fg opacity-50";
                            if (aIdx === correctIdx) cls = "text-emerald-600 font-bold";
                            if (aIdx === selectedIdx && !isCorrect) cls = "text-red-500 line-through font-medium";
                            if (aIdx === selectedIdx && isCorrect) cls = "text-emerald-600 font-bold";
                            return (
                              <p key={aIdx} className={`text-sm ${cls}`}>
                                {String.fromCharCode(65 + aIdx)}. {a.text}
                                {aIdx === correctIdx && " ✓"}
                                {aIdx === selectedIdx && !isCorrect && " (Your answer)"}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              id="quiz-try-another-btn"
              onClick={() => {
                setPhase("code");
                setQuiz(null);
                setAccessCode("");
                setAnswerMap({});
                setPreparedQuestions([]);
              }}
              className="flex-1 py-4 bg-accent text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
            >
              Try Another Quiz
            </button>
            <button
              id="quiz-retake-btn"
              onClick={handleStart}
              className="flex-1 py-4 bg-surface border border-border text-fg rounded-2xl font-bold text-sm hover:bg-bg transition-all cursor-pointer"
            >
              Retake This Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
