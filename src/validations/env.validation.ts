import z from "zod";

const requiredMessage = (variableName: string) => {
	return {
		required_error: `${variableName} is required!`
	}
}

export const envSchema = z.object({
	PORT: z.string().optional(),
	NODE_ENV: z.string().optional(),
	MONGO_URI: z.string(requiredMessage("MONGO_URI")),
	ALLOWED_ORIGINS: z.string(requiredMessage("ALLOWED_ORIGINS")),
	ACCESS_TOKEN_SECRET: z.string(requiredMessage("ACCESS_TOKEN_SECRET")),
	REFRESH_TOKEN_SECRET: z.string(requiredMessage("REFRESH_TOKEN_SECRET")),
	HASH_SECRET: z.string(requiredMessage("HASH_SECRET")),
	OTP_SECRET: z.string(requiredMessage("OTP_SECRET")),
	EMAIL_SENDER: z.string(requiredMessage("EMAIL_SENDER")),
	EMAIL_PASS_KEY: z.string(requiredMessage("EMAIL_PASS_KEY"))
});
