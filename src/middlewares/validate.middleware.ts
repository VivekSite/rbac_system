import httpStatus from "http-status";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/apiError.util.js";

export const validate = (
	schema: { 
		body?: z.ZodObject<any>,
		query?: z.ZodObject<any>,
		params?: z.ZodObject<any>,
	}) => (req: Request, _res: Response, next: NextFunction) => {
	try {
		if (schema.params)
			schema.params.parse(req.params);
		if (schema.query)
			schema.query.parse(req.query);
		if (schema.body)
			schema.body.parse(req.body);

		return next();
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessage = error.errors.map((err) => err.message).join(", ");
			return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
		}
		return next(error);
	}
};
