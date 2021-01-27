import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '../../../../../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  _: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT header is missing.', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: Number(sub),
    };

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
