import { NextResponse } from "next/server";
import { validateToken } from "@/common/apiAuth";
import { Quiz } from "@/model/Quiz";
import { QuizAttempt } from "@/model/QuizAttempt";
import { User } from "@/model/User";
import { ensureDbInitialized } from "@/utils/dbInit";

/**
 * GET /api/quizzes/[id]/stats
 * Returns analytics for a specific quiz owned by the requesting user.
 * Includes pass/fail breakdown, average score, and a ranked student list.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const quizId = Number(id);

    // Verify the quiz belongs to this user
    const quiz = await Quiz.findOne({ where: { id: quizId, userId: payload.id } });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found or access denied" }, { status: 404 });
    }

    const quizData = quiz.get() as import("@/model/Quiz").QuizAttributes;

    // Fetch all attempts for this quiz
    const attempts = await QuizAttempt.findAll({
      where: { quizId },
      order: [["score", "DESC"]],
    });

    const attemptRows = attempts.map((a) => a.get() as import("@/model/QuizAttempt").QuizAttemptAttributes);

    // Fetch user display names for each attempt
    const userIds = [...new Set(attemptRows.map((a) => a.userId))];
    const users = await User.findAll({ where: { id: userIds } });
    const userMap: Record<number, { firstName: string; lastName: string; profileImage: string | null }> = {};
    users.forEach((u) => {
      const d = u.get() as import("@/model/User").UserAttributes;
      userMap[d.id] = { firstName: d.firstName, lastName: d.lastName, profileImage: d.profileImage };
    });

    const totalAttempts = attemptRows.length;
    const passCount = attemptRows.filter((a) => a.score >= 50).length;
    const failCount = totalAttempts - passCount;
    const averageScore =
      totalAttempts > 0
        ? Math.round(attemptRows.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
        : 0;
    const highestScore = totalAttempts > 0 ? Math.max(...attemptRows.map((a) => a.score)) : 0;
    const lowestScore = totalAttempts > 0 ? Math.min(...attemptRows.map((a) => a.score)) : 0;

    const rankedStudents = attemptRows.map((a, idx) => ({
      rank: idx + 1,
      userId: a.userId,
      firstName: userMap[a.userId]?.firstName ?? "Unknown",
      lastName: userMap[a.userId]?.lastName ?? "",
      profileImage: userMap[a.userId]?.profileImage ?? null,
      score: a.score,
      correctAnswers: a.correctAnswers,
      totalQuestions: a.totalQuestions,
      timeTakenSeconds: a.timeTakenSeconds,
      passed: a.score >= 50,
      attemptDate: a.createdAt,
    }));

    return NextResponse.json({
      quizId,
      quizTitle: quizData.title,
      totalAttempts,
      passCount,
      failCount,
      passRate: totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0,
      averageScore,
      highestScore,
      lowestScore,
      rankedStudents,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch quiz stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
