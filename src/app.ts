import express from "express";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

import {
	errorConverter,
	errorHandler
} from "./middlewares/error.middleware.js";
import { ApiError } from "./utils/apiError.util.js";
import { AppConfig } from "./config/env.config.js";
import morganConfig from "./config/morgan.config.js";
import appRoutes from "./routes/index.js";

const app = express();

app.use(morganConfig.errorHandler);
app.use(morganConfig.successHandler);

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// sanitize request data
app.use(ExpressMongoSanitize());

// enable cors
const corsOptions:
	| cors.CorsOptionsDelegate<cors.CorsRequest>
	| cors.CorsOptions = (req, callback) => {
		const origin = req.headers.origin;

		if (origin && AppConfig.ALLOWED_ORIGINS.includes(origin)) {
			callback(null, {
				origin,
				methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
				allowedHeaders: ["Content-Type"],
				credentials: true
			});
		} else {
			callback(
				new ApiError(httpStatus.UNAUTHORIZED, "Request not allowed by CORS!")
			);
		}
	};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// set security HTTP headers
app.use(helmet());

// Enable trust proxy
app.set("trust proxy", 1);

// Register App Routes
app.use("/api/v1", appRoutes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
