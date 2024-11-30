import { Router } from "express";

import {
	logoutHandler,
	signInHandler,
	signUpHandler,
	statusHandler,
	forgotPasswordHandler,
	resetPasswordHandler
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";
import authValidation from "../validations/auth.validation.js";

const app = Router({
	mergeParams: true
});

app.post(
	"/register",
	rateLimiter({ max: 20 }),
	validate(authValidation.register),
	signUpHandler
);
app.post(
	"/login",
	rateLimiter({ max: 20 }),
	validate(authValidation.login),
	signInHandler
);
app.post("/logout", rateLimiter({ max: 20 }), authMiddleware, logoutHandler);
app.get("/status", rateLimiter({}), authMiddleware, statusHandler);

app.post(
	"/forgot_password",
	rateLimiter({ max: 20 }),
	validate(authValidation.forgot_password),
	forgotPasswordHandler
);
app.patch(
	"/reset_password",
	rateLimiter({ max: 20 }),
	validate(authValidation.reset_password),
	resetPasswordHandler
);

export default app;
