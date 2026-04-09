import { NextResponse } from "next/server";
import { validateToken } from "@/common/apiAuth";
import { Quiz, CreateQuizPayload } from "@/model/Quiz";
import { ensureDbInitialized } from "@/utils/dbInit";

function isValidQuizPayload(quiz: CreateQuizPayload): boolean {
  if (!quiz.title || quiz.title.trim().length === 0) return false;
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0)
    return false;

  return quiz.questions.every((question) => {
    if (!question.prompt || question.prompt.trim().length === 0) return false;
    if (!Array.isArray(question.answers) || question.answers.length < 2)
      return false;

    const hasCorrectAnswer = question.answers.some(
      (answer) => answer.isCorrect,
    );
    if (!hasCorrectAnswer) return false;

    return question.answers.every(
      (answer) => answer.text && answer.text.trim().length > 0,
    );
  });
}

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Save one or more quizzes for the current user
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quizzes]
 *             properties:
 *               quizzes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [title, questions]
 *     responses:
 *       201:
 *         description: Quizzes saved
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 */
export async function POST(req: Request) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as { quizzes?: CreateQuizPayload[] };
    const quizzes = body.quizzes;

    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      return NextResponse.json(
        { error: "At least one quiz is required" },
        { status: 400 },
      );
    }

    const invalidQuiz = quizzes.find((quiz) => !isValidQuizPayload(quiz));
    if (invalidQuiz) {
      return NextResponse.json(
        {
          error:
            "Invalid quiz format. Ensure title, questions, answers, and one correct answer per question.",
        },
        { status: 400 },
      );
    }

    const createdQuizzes = await Quiz.bulkCreate(
      quizzes.map((quiz) => ({
        title: quiz.title.trim(),
        questions: quiz.questions,
        userId: payload.id,
        accessKey: String(Math.floor(1000 + Math.random() * 9000)),
      })),
    );

    return NextResponse.json({ quizzes: createdQuizzes }, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save quizzes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes for the current user
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: Quiz list
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: Request) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const quizzes = await Quiz.findAll({
      where: { userId: payload.id },
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({ quizzes });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch quizzes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
