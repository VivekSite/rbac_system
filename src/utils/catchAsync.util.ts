import { Request, Response, NextFunction } from "express";

import { ApiError } from "./apiError.util.js";

type AsyncRequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<any> | void;

export const catchAsync =
	(fn: AsyncRequestHandler) =>
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch((err: ApiError | Error) =>
			next(err)
		);
	};
