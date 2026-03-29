import { SignJWT, jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'fallback_default_secret_key_myconnect_2026';
  const salt = process.env.JWT_SALT || '-my-custom-salt';
  return new TextEncoder().encode(secret + salt);
};

export async function signToken(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload;
}
