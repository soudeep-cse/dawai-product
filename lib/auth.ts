import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcrypt';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
);

export interface AdminPayload {
  [key: string]: unknown;
  id: string;
  email?: string;
  username?: string;
  role: 'SUPER_ADMIN' | 'PHARMACIST' | 'OPERATOR';
  iat?: number;
  exp?: number;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create JWT token
export async function createToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as AdminPayload;
  } catch (error) {
    return null;
  }
}

// Generate password reset token (just a random string, expires in 1 hour)
export function generateResetToken(): {
  token: string;
  expiresAt: Date;
} {
  const token = require('crypto').randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return { token, expiresAt };
}

// Generate OTP for customer login
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check account lockout status
export function isAccountLocked(lockedUntil: Date | null): boolean {
  if (!lockedUntil) return false;
  return new Date() < lockedUntil;
}

// Calculate lockout time (exponential backoff: 15 min, 30 min, 1 hour, etc.)
export function getNextLockoutTime(failedAttempts: number): Date {
  const baseMinutes = 15;
  const exponent = Math.min(failedAttempts, 3); // Cap at 3 (1 hour)
  const lockoutMinutes = baseMinutes * Math.pow(2, exponent - 1);
  return new Date(Date.now() + lockoutMinutes * 60 * 1000);
}
