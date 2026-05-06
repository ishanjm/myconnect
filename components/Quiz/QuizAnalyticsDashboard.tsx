"use client";

import React, { useEffect, useState } from "react";
import { quizzesService, QuizStats, QuizItem } from "@/services/quizzesService";

interface QuizAnalyticsDashboardProps {
  quizzes: QuizItem[];
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function ScoreRing({ value, size = 80 }: { value: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "#10b981" : value >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={8}
        fill="none"
        className="text-[var(--color-border)]"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={8}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

export default function QuizAnalyticsDashboard({ quizzes }: QuizAnalyticsDashboardProps) {
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(
    quizzes.length > 0 ? quizzes[0].id : null
  );
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quizzes.length > 0 && !selectedQuizId) {
      setSelectedQuizId(quizzes[0].id);
    }
  }, [quizzes, selectedQuizId]);

  useEffect(() => {
    if (!selectedQuizId) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setStats(null);
    quizzesService
      .fetchQuizStats(selectedQuizId)
      .then((data) => { if (isMounted) setStats(data); })
      .catch(() => { if (isMounted) setError("Failed to load analytics for this quiz."); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [selectedQuizId]);

  if (quizzes.length === 0) {
    return (
      <div
        id="quiz-analytics-empty"
        className="rounded-xl border border-[var(--color-border)] p-8 text-center"
      >
        <p className="text-sm text-[var(--color-fg)] opacity-70">
          Create a quiz first to see analytics here.
        </p>
      </div>
    );
  }

  return (
    <div id="quiz-analytics-dashboard" className="space-y-6 animate-in fade-in duration-300">
      {/* Quiz Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-fg)] opacity-50 shrink-0">
          Select Quiz
        </label>
        <select
          id="quiz-analytics-selector"
          value={selectedQuizId ?? ""}
          onChange={(e) => setSelectedQuizId(Number(e.target.value))}
          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--color-fg)] outline-none focus:border-accent cursor-pointer"
        >
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 opacity-50">
          <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]">
            Loading analytics...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-semibold text-center">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && !isLoading && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              id="analytics-total-attempts"
              label="Total Attempts"
              value={String(stats.totalAttempts)}
              sub="students attempted"
              color="text-accent"
            />
            <StatCard
              id="analytics-pass-rate"
              label="Pass Rate"
              value={`${stats.passRate}%`}
              sub={`${stats.passCount} passed / ${stats.failCount} failed`}
              color={stats.passRate >= 50 ? "text-emerald-500" : "text-red-500"}
            />
            <StatCard
              id="analytics-avg-score"
              label="Avg Score"
              value={`${stats.averageScore}%`}
              sub="class average"
              color="text-amber-500"
            />
            <StatCard
              id="analytics-top-score"
              label="Top Score"
              value={`${stats.highestScore}%`}
              sub={`Lowest: ${stats.lowestScore}%`}
              color="text-purple-500"
            />
          </div>

          {/* Pass / Fail Visual Bar */}
          {stats.totalAttempts > 0 && (
            <div
              id="quiz-analytics-pass-fail-bar"
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[var(--color-fg)] opacity-50">
                <span>Pass / Fail Distribution</span>
                <span>{stats.totalAttempts} total</span>
              </div>
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${stats.passRate}%` }}
                />
                <div
                  className="h-full bg-red-500 transition-all duration-700"
                  style={{ width: `${100 - stats.passRate}%` }}
                />
              </div>
              <div className="flex items-center gap-6 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[var(--color-fg)] opacity-70">
                    Passed ({stats.passCount})
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-[var(--color-fg)] opacity-70">
                    Failed ({stats.failCount})
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Student Rankings */}
          <div
            id="quiz-analytics-student-rankings"
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--color-fg)]">
                Student Rankings
              </h3>
              <span className="text-xs text-[var(--color-fg)] opacity-40 font-semibold">
                Sorted by score
              </span>
            </div>

            {stats.rankedStudents.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[var(--color-fg)] opacity-50">
                No students have attempted this quiz yet.
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {stats.rankedStudents.map((student) => {
                  const fullName = `${student.firstName} ${student.lastName}`.trim() || "Unknown";
                  const avatarSrc =
                    student.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff&size=64`;
                  const date = student.attemptDate
                    ? new Date(student.attemptDate).toLocaleDateString()
                    : "";

                  return (
                    <div
                      key={student.rank}
                      id={`quiz-analytics-student-${student.userId}`}
                      className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--color-bg)] ${
                        student.rank <= 3 ? "bg-accent/[0.03]" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-8 shrink-0 text-center">
                        {student.rank === 1 ? (
                          <span className="text-xl">🥇</span>
                        ) : student.rank === 2 ? (
                          <span className="text-xl">🥈</span>
                        ) : student.rank === 3 ? (
                          <span className="text-xl">🥉</span>
                        ) : (
                          <span className="text-xs font-black text-[var(--color-fg)] opacity-30">
                            #{student.rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <img
                        src={avatarSrc}
                        alt={fullName}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--color-surface)] shrink-0"
                      />

                      {/* Name & date */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--color-fg)] truncate">
                          {fullName}
                        </p>
                        {date && (
                          <p className="text-[10px] text-[var(--color-fg)] opacity-40 font-semibold mt-0.5">
                            {date}
                          </p>
                        )}
                      </div>

                      {/* Correct / Total */}
                      <div className="hidden sm:flex flex-col items-center shrink-0">
                        <span className="text-xs font-bold text-[var(--color-fg)]">
                          {student.correctAnswers}/{student.totalQuestions}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-[var(--color-fg)] opacity-40">
                          Correct
                        </span>
                      </div>

                      {/* Time */}
                      <div className="hidden md:flex flex-col items-center shrink-0">
                        <span className="text-xs font-bold text-[var(--color-fg)]">
                          {formatTime(student.timeTakenSeconds)}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-[var(--color-fg)] opacity-40">
                          Time
                        </span>
                      </div>

                      {/* Score ring */}
                      <div className="relative shrink-0 flex items-center justify-center">
                        <ScoreRing value={student.score} size={52} />
                        <span
                          className={`absolute text-[10px] font-black ${
                            student.passed ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {Math.round(student.score)}%
                        </span>
                      </div>

                      {/* Pass/Fail badge */}
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          student.passed
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {student.passed ? "Pass" : "Fail"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  id,
  label,
  value,
  sub,
  color,
}: {
  id: string;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      id={id}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-1"
    >
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-fg)] opacity-40">
        {label}
      </p>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-[10px] text-[var(--color-fg)] opacity-50 font-medium">{sub}</p>
    </div>
  );
}
