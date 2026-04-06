import { verifyToken } from '@/utils/jwt';

/**
 * Standard utility to validate the JWT access token from request cookies.
 * Used across API routes to identify the authenticated user.
 * 
 * @param req - The Next.js Request object
 * @returns The decoded token payload (user ID, etc.) or null if invalid/missing
 */
export async function validateToken(req: Request) {
  const accessToken = req.headers.get('cookie')?.split('; ').find(c => c.startsWith('access_token='))?.split('=')[1];
  
  if (!accessToken) return null;
  
  try {
    return await verifyToken(accessToken);
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}
