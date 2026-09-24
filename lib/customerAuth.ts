import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function getCustomerIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get('customer-token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return decoded.customerId;
  } catch {
    return null;
  }
}
