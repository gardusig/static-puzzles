import type { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  status?: number
  details?: unknown
}

export function createErrorHandler() {
  return (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500
    console.error(`[ERROR] ${status} - ${err.message}`)
    if (err.details) console.error(err.details)
    res.status(status).json({
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    })
  }
}
