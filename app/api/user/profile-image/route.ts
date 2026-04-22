import { NextResponse } from 'next/server';
import { validateToken } from '@/common/apiAuth';
import { userServerService } from '@/services/userServerService';

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const decoded = await validateToken(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (decoded as any).id;

    // 2. Parse multipart form data
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // 3. Process image upload
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const profileImageUrl = await userServerService.updateProfileImage(userId, buffer);

    return NextResponse.json({ 
      success: true, 
      profileImage: profileImageUrl 
    });

  } catch (error: any) {
    console.error('Profile image update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile image' }, 
      { status: 500 }
    );
  }
}
