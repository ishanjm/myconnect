import { User, UserAttributes } from '@/model/User';
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary';

export const userServerService = {
  updateProfileImage: async (userId: number, imageBuffer: Buffer) => {
    // 1. Find the user
    const user = (await User.findByPk(userId)) as unknown as UserAttributes | null;
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Upload new image to Cloudinary
    const profileImageUrl = await uploadToCloudinary(
      imageBuffer,
      'myconnect/profiles',
      'image',
      [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ]
    );

    // 3. Delete old image from Cloudinary if it exists
    if (user.profileImage) {
      try {
        await deleteFromCloudinary(user.profileImage);
      } catch (error) {
        console.warn('Failed to delete old profile image from Cloudinary:', error);
        // We continue anyway even if deletion fails to ensure the new image is saved
      }
    }

    // 4. Update user in database
    await User.update(
      { profileImage: profileImageUrl },
      { where: { id: userId } }
    );

    return profileImageUrl;
  },
};
