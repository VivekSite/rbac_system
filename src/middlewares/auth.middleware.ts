import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import {
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken
} from "../services/token.service.js";
import { catchAsync } from "../utils/catchAsync.util.js";

export const authMiddleware = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.cookies.accessToken;
		const refreshToken = req.cookies.refreshToken;

		if (accessToken) {
			const payload = await verifyAccessToken(accessToken);
			if (!payload) {
				return res.status(httpStatus.FORBIDDEN).json({
					success: false,
					message: "Invalid Auth"
				});
			}

			req.auth = payload;
			next();
			return;
		} else if (refreshToken) {
			const payload = await verifyRefreshToken(refreshToken);
			if (!payload) {
				return res.status(httpStatus.FORBIDDEN).json({
					success: false,
					message: "Authorization Required"
				});
			}

			const oldPayload = {
				id: payload.id,
				username: payload.username,
				email: payload.email,
				role: payload.role,
				mobile: payload.mobile,
				profileImage: payload.profileImage
			};
			const newAccessToken = await signAccessToken(payload.email, oldPayload);
			const newRefreshToken = await signRefreshToken(payload.email, oldPayload);

			if (!newAccessToken || !newRefreshToken) {
				return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
					success: false,
					message: "Token generation failed!"
				});
			}

			res.cookie("accessToken", newAccessToken, {
				httpOnly: true,
				path: "/",
				secure: true,
				sameSite: "none",
				maxAge: 60 * 60 * 100
			});
			res.cookie("refreshToken", newRefreshToken, {
				httpOnly: true,
				path: "/",
				secure: true,
				sameSite: "none",
				maxAge: 30 * 24 * 60 * 60 * 100
			});

			req.auth = payload;
			next();
			return;
		}

		return res.status(httpStatus.FORBIDDEN).json({
			success: false,
			message: "Authorization Required"
		});
	}
);
