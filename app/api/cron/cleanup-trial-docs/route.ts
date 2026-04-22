import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { Document, IDocument } from "@/model/Document";
import { User, UserAttributes } from "@/model/User";
import { deleteFromCloudinary } from "@/utils/cloudinary";
import { SUBSCRIPTIONS } from "@/common/auth.constants";

export const runtime = "nodejs";

const TRIAL_DOC_RETENTION_DAYS = 7;

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown deletion error";
}

function isAuthorizedCronRequest(req: Request): boolean {
  const configuredSecret = process.env.CRON_SECRET;

  // If no secret is configured, allow execution to avoid silently breaking cleanup jobs.
  if (!configuredSecret) {
    return true;
  }

  const headerSecret = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  return headerSecret === configuredSecret || bearerToken === configuredSecret;
}

/**
 * GET /api/cron/cleanup-trial-docs
 * Deletes documents older than 7 days for users on the trial subscription.
 */
export async function GET(req: Request) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized cron request" },
      { status: 401 },
    );
  }

  const cutoffDate = new Date(
    Date.now() - TRIAL_DOC_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );

  try {
    const trialUsers = (await User.findAll({
      attributes: ["id"],
      where: { subscription: SUBSCRIPTIONS.TRIAL },
    })) as unknown as Array<Pick<UserAttributes, "id">>;

    const trialUserIds = trialUsers.map((user) => user.id);

    if (trialUserIds.length === 0) {
      return NextResponse.json({
        message: "No trial users found",
        deletedCount: 0,
        failedCount: 0,
      });
    }

    const expiredDocs = (await Document.findAll({
      where: {
        userId: { [Op.in]: trialUserIds },
        createdAt: { [Op.lt]: cutoffDate },
      },
    })) as unknown as Array<IDocument & { destroy: () => Promise<void> }>;

    if (expiredDocs.length === 0) {
      return NextResponse.json({
        message: "No expired trial documents found",
        deletedCount: 0,
        failedCount: 0,
      });
    }

    let deletedCount = 0;
    let failedCount = 0;
    const failures: Array<{ documentId: number; reason: string }> = [];

    for (const doc of expiredDocs) {
      try {
        await deleteFromCloudinary(doc.downloadUrl);
        await doc.destroy();
        deletedCount += 1;
      } catch (error: unknown) {
        failedCount += 1;
        failures.push({
          documentId: doc.id,
          reason: toErrorMessage(error),
        });
      }
    }

    return NextResponse.json({
      message: "Trial document cleanup completed",
      cutoffDate: cutoffDate.toISOString(),
      totalCandidates: expiredDocs.length,
      deletedCount,
      failedCount,
      failures,
    });
  } catch (error: unknown) {
    console.error("Trial document cleanup failed:", error);
    return NextResponse.json(
      { error: toErrorMessage(error) || "Failed to cleanup trial documents" },
      { status: 500 },
    );
  }
}
