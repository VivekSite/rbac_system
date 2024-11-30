import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { ZodError } from "zod";
import dotenv from "dotenv";

import { envSchema } from "../validations/env.validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFilePath = join(__dirname, "./../../.env");
dotenv.config({ path: envFilePath });

let Vars = null;
try {
	Vars = envSchema.parse(process.env);
} catch (error: any) {
	if (error instanceof ZodError) {
		const errorMessage = error.errors.map((err) => err.message).join(", ");
		throw new Error(`env error: ${errorMessage}`);
	}
	throw new Error(error.message);
}

const AppConfig = {
	NODE_ENV: Vars.NODE_ENV || "development",
	PORT: Vars.PORT || 8080,
	MONGO_URI: Vars.MONGO_URI,
	ALLOWED_ORIGINS: Vars.ALLOWED_ORIGINS.split(","),
	AUTH: {
		ACCESS_TOKEN_SECRET: Vars.ACCESS_TOKEN_SECRET,
		REFRESH_TOKEN_SECRET: Vars.REFRESH_TOKEN_SECRET,
		HASH_SECRET: Vars.HASH_SECRET,
		OTP_SECRET: Vars.OTP_SECRET
	},
	EMAIL: {
		SENDER: Vars.EMAIL_SENDER,
		PASS_KEY: Vars.EMAIL_PASS_KEY
	}
};

export { AppConfig };
