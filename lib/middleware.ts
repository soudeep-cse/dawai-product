import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export async function validateAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  return payload;
}

// Middleware function for protecting admin routes
export async function protectAdminRoute(request: NextRequest) {
  const payload = await validateAdminToken(request);

  if (!payload) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized - Admin token required',
      },
      { status: 401 }
    );
  }

  return payload;
}

// Check admin role (for role-based access control)
export async function requireAdminRole(
  request: NextRequest,
  requiredRole: 'SUPER_ADMIN' | 'PHARMACIST' | 'OPERATOR'
) {
  const payload = await validateAdminToken(request);

  if (!payload) {
    return {
      error: 'Unauthorized - Admin token required',
      authorized: false,
      status: 401,
    };
  }

  // Role hierarchy: SUPER_ADMIN > PHARMACIST > OPERATOR
  const roleHierarchy = {
    SUPER_ADMIN: 3,
    PHARMACIST: 2,
    OPERATOR: 1,
  };

  if (roleHierarchy[payload.role as keyof typeof roleHierarchy] < roleHierarchy[requiredRole]) {
    return {
      error: 'Forbidden - Insufficient permissions',
      authorized: false,
      status: 403,
    };
  }

  return {
    authorized: true,
    payload,
  };
}
