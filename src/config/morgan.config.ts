import morgan from "morgan";
import { Request, Response } from "express";

import { Logger } from "./logger.config.js";
import { AppConfig } from "./env.config.js";

morgan.token(
	"message",
	(_req: Request, res: Response) => res.locals.errorMessage || ""
);

const getIpFormat = () =>
	AppConfig.NODE_ENV === "production" ? ":remote-addr - " : "";
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
	skip: (_req: Request, res: Response) => res.statusCode >= 400,
	stream: { write: (message: string) => Logger.info(message.trim()) }
});

const errorHandler = morgan(errorResponseFormat, {
	skip: (_req: Request, res: Response) => res.statusCode < 400,
	stream: { write: (message: string) => Logger.error(message.trim()) }
});

export default { successHandler, errorHandler };
