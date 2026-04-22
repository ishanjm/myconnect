import { NextResponse } from "next/server";
import { validateToken } from "@/common/apiAuth";
import { QuizAttempt } from "@/model/QuizAttempt";
import { ensureDbInitialized } from "@/utils/dbInit";
import { hasPermission } from "@/common/permissions";

/**
 * @swagger
 * /api/quiz-attempts:
 *   post:
 *     summary: Save a quiz attempt for the current user
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quizId, quizTitle, totalQuestions, correctAnswers, score, answers, timeTakenSeconds]
 *     responses:
 *       201:
 *         description: Attempt saved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
export async function POST(req: Request) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!hasPermission(payload.subscription, "take_quiz")) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { quizId, quizTitle, totalQuestions, correctAnswers, score, answers, timeTakenSeconds } = body;

    if (!quizId || !quizTitle || totalQuestions === undefined || correctAnswers === undefined || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const attempt = await QuizAttempt.create({
      quizId,
      quizTitle,
      userId: payload.id,
      totalQuestions,
      correctAnswers,
      score,
      answers: answers || [],
      timeTakenSeconds: timeTakenSeconds || 0,
    });

    return NextResponse.json({ attempt }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save quiz attempt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/quiz-attempts:
 *   get:
 *     summary: Get quiz attempt history for the current user
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: Attempt history
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: Request) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const attempts = await QuizAttempt.findAll({
      where: { userId: payload.id },
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({ attempts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch attempts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
