// Allow self-signed certificates (corporate proxy / dev only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * @param buffer - The file as a Buffer
 * @param folder - The Cloudinary folder to upload into
 * @param resourceType - The resource type (image, raw, auto)
 * @param transformation - Optional transformations
 * @returns The secure URL of the uploaded asset
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'myconnect/profiles',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image',
  transformation: any[] = []
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation: transformation,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      )
      .end(buffer);
  });
}

export default cloudinary;
