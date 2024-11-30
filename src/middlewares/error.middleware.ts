import mongoose from "mongoose";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

import { AppConfig } from "../config/env.config.js";
import { Logger } from "../config/logger.config.js";
import { ApiError } from "../utils/apiError.util.js";

export const errorConverter = (
	err: Error,
	_req: Request,
	_res: Response,
	next: NextFunction
) => {
	let error = err;
	if (!(error instanceof ApiError)) {
		let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
		let message: string = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];

		if (error instanceof mongoose.Error) {
			statusCode = httpStatus.BAD_REQUEST;
			message = httpStatus[httpStatus.BAD_REQUEST];
		}
		error = new ApiError(statusCode, message, err.stack);
	}
	next(error);
};

export const errorHandler = (
	err: ApiError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	let { statusCode, message } = err;

	if (AppConfig.NODE_ENV === "production") {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}

	res.locals.errorMessage = err.message;
	const response = {
		success: false,
		statusCode,
		message,
		...(AppConfig.NODE_ENV === "development" && { stack: err.stack })
	};

	if (AppConfig.NODE_ENV === "development") {
		Logger.error(err);
	}

	res.status(statusCode).send(response);
};
