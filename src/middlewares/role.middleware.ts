import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.util.js";

export const roleMiddleware = (role: string) =>
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		if (!req.auth || !req.auth.role) {
			return res.status(httpStatus.FORBIDDEN).send({
				success: false,
				message: "Forbidden: No role provided"
			});
		}

		if (req.auth.role === "Admin" || req.auth.role === role) next();
		return res.status(httpStatus.UNAUTHORIZED).send({
			success: false,
			message: httpStatus[httpStatus.UNAUTHORIZED]
		});
	});
