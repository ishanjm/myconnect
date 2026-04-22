import { NextResponse } from "next/server";
import { validateToken } from "@/common/apiAuth";
import { Quiz } from "@/model/Quiz";
import { ensureDbInitialized } from "@/utils/dbInit";
import { hasPermission } from "@/common/permissions";

/**
 * @swagger
 * /api/quizzes/join:
 *   get:
 *     summary: Fetch a quiz by access code (for students)
 *     tags: [Quiz]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Quiz found
 *       404:
 *         description: Quiz not found
 *       403:
 *         description: Permission denied
 */
export async function GET(req: Request) {
  await ensureDbInitialized();

  const payload = await validateToken(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!hasPermission(payload.subscription, 'take_quiz')) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code || code.length !== 4) {
      return NextResponse.json({ error: "Invalid access code" }, { status: 400 });
    }

    const quiz = await Quiz.findOne({ 
      where: { accessKey: code },
      attributes: { exclude: ['userId'] } // Hide creator ID for privacy
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to join quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
