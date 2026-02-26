import type { Request, Response, NextFunction } from 'express';

const sanitizeString = (value: string): string => {
    return value
        .replace(/[\t\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => sanitizeObject(item));
    }

    if (obj !== null && typeof obj === 'object') {
        // Modificar las propiedades del objeto existente en lugar de reemplazarlo
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj[key] = sanitizeObject(obj[key]);
            }
        }
        return obj;
    }

    return obj;
};

export const sanitizeInputMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.body) {
        sanitizeObject(req.body);
    }

    if (req.query) {
        sanitizeObject(req.query);
    }

    if (req.params) {
        sanitizeObject(req.params);
    }

    next();
};
