import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import { verifyAccessToken } from "../services/token.service.js";
import { catchAsync } from "../utils/catchAsync.util.js";

export const authMiddleware = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.cookies.accessToken;
		if (accessToken) {
			const payload = await verifyAccessToken(accessToken);
			if (!payload) {
				return res.status(403).json({
					success: false,
					message: "Invalid Auth"
				});
			}

			req.auth = payload as jwt.JwtPayload;
			next();
			return;
		}

		return res.status(httpStatus.UNAUTHORIZED).json({
			success: false,
			message: "Authorization Required"
		});
	}
);
