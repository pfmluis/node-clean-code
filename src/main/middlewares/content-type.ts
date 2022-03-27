import { Response, NextFunction } from 'express'

export const contentType = (_, res: Response, next: NextFunction): void => {
  res.type('json')
  next()
}