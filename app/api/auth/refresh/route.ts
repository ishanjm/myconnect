import { NextResponse } from "next/server";
import {
  PERSISTENT_SESSION_MAX_AGE_SECONDS,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "@/utils/jwt";

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully refreshed access token
 *       401:
 *         description: Invalid or expired refresh token
 */
export async function POST(req: Request) {
  try {
    const incomingRefreshToken =
      (req as any).cookies?.get("refresh_token")?.value ||
      req.headers
        .get("cookie")
        ?.split("; ")
        .find((c) => c.startsWith("refresh_token="))
        ?.split("=")[1];

    if (!incomingRefreshToken) {
      return NextResponse.json(
        { error: "Refresh token missing" },
        { status: 401 },
      );
    }

    const payload = await verifyToken(incomingRefreshToken);

    // Re-issue tokens and extend cookie lifetime for persistent sessions
    const accessToken = await signAccessToken({
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      subscription: payload.subscription,
      profileImage: payload.profileImage,
    });

    const refreshToken = await signRefreshToken({
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      subscription: payload.subscription,
      profileImage: payload.profileImage,
    });

    const response = NextResponse.json({
      token: accessToken,
      user: {
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        subscription: payload.subscription,
        profileImage: payload.profileImage,
      },
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: PERSISTENT_SESSION_MAX_AGE_SECONDS,
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: PERSISTENT_SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  }
}
