import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '');
}

export function authenticateUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export function requireAuth(allowedRoles?: string[]) {
  return (request: NextRequest) => {
    const user = authenticateUser(request);
    
    if (!user) {
      throw new Error('Authentication required');
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }

    return user;
  };
}
