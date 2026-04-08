import { NextResponse } from "next/server";
import { User, UserAttributes } from "@/model/User";
import {
  PERSISTENT_SESSION_MAX_AGE_SECONDS,
  signAccessToken,
  signRefreshToken,
} from "@/utils/jwt";
import { hashPassword } from "@/utils/password";
import { uploadToCloudinary } from "@/utils/cloudinary";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user with extended profile information and image upload
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - subscription
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               subscription:
 *                 type: string
 *                 enum: [trial, small, medium, large, custom]
 *               address:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Registration successful
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const subscription = formData.get("subscription") as any;
    const address = formData.get("address") as string;
    const mobileNumber = formData.get("mobileNumber") as string;
    const profileImageFile = formData.get("profileImage") as File | null;

    let profileImageUrl = "";

    if (profileImageFile && profileImageFile.size > 0) {
      const bytes = await profileImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      profileImageUrl = await uploadToCloudinary(
        buffer,
        "myconnect/profiles",
        "image",
        [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      );
    }

    // Check if user already exists
    const existingUser = (await User.findOne({
      where: { email },
    })) as unknown as UserAttributes | null;
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const userCount = await User.count();
    const role = userCount === 0 ? "super admin" : "member";
    const hashedPassword = await hashPassword(password);
    const name = `${firstName} ${lastName}`.trim();

    const user = (await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      subscription,
      address,
      mobileNumber,
      profileImage: profileImageUrl,
      name,
      role,
    })) as unknown as UserAttributes;

    const userPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      subscription: user.subscription,
      profileImage: user.profileImage,
    };

    const accessToken = await signAccessToken(userPayload);
    const refreshToken = await signRefreshToken(userPayload);

    const response = NextResponse.json({
      token: accessToken,
      user: userPayload,
    });

    // ... (rest of cookie logic remains same)

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
