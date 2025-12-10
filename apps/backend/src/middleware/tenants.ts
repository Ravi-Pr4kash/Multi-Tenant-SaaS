import { NextFunction, Request, Response } from "express";

export default function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
    const tenantHeader = req.header("tenantId")

    if(tenantHeader) {
        (req as any).tenant = { id: tenantHeader }
    } else {
        (req as any).tenant = { id: "public" }
    }

    next()
}