import { NextResponse } from "next/server";
import { validateToken } from "@/common/apiAuth";
import { Quiz, CreateQuizPayload } from "@/model/Quiz";
import { ensureDbInitialized } from "@/utils/dbInit";

function isValidQuizPayload(quiz: CreateQuizPayload): boolean {
  if (!quiz.title || quiz.title.trim().length === 0) return false;
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) return false;

  return quiz.questions.every((question) => {
    if (!question.prompt || question.prompt.trim().length === 0) return false;
    if (!Array.isArray(question.answers) || question.answers.length < 2) return false;

    const hasCorrectAnswer = question.answers.some((answer) => answer.isCorrect);
    if (!hasCorrectAnswer) return false;

    return question.answers.every((answer) => answer.text && answer.text.trim().length > 0);
  });
}
/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get a single quiz by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Quiz data
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const quizId = Number(id);

    const quiz = await Quiz.findOne({ where: { id: quizId, userId: payload.id } });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const quizId = Number(id);

    const quiz = await Quiz.findOne({ where: { id: quizId, userId: payload.id } });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found or access denied" }, { status: 404 });
    }

    const body = (await req.json()) as CreateQuizPayload;
    if (!isValidQuizPayload(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid quiz format. Ensure title, questions, answers, and one correct answer per question.",
        },
        { status: 400 },
      );
    }

    await quiz.update({
      title: body.title.trim(),
      questions: body.questions,
    });

    return NextResponse.json({ quiz });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const quizId = Number(id);

    const quiz = await Quiz.findOne({ where: { id: quizId, userId: payload.id } });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found or access denied" }, { status: 404 });
    }

    await quiz.destroy();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
