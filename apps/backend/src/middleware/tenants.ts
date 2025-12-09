import { Request, Response, NextFunction } from 'express';

export default function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {

  const tenantHeader = req.header('tenantId');

  if (tenantHeader) {
    (req as any).tenant = { id: tenantHeader };
  } else {
    (req as any).tenant = { id: 'public' };
  }

  next();
}
