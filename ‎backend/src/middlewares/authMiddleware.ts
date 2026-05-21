import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthPayload {
  userId: string
}

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers['authorization']
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env['JWT_SECRET'] ?? '') as AuthPayload
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}
