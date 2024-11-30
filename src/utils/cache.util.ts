import cache from "persistent-cache";

// store access tokens in persistent
export const accessTokenCache = cache({
	duration: 60 * 60 * 1000, // 1 hour
	base: ".cache",
	persist: true,
	name: "accessTokenCache"
});

// store refresh tokens in persistent
export const refreshTokenCache = cache({
	duration: 30 * 24 * 60 * 60 * 1000, // 30 days
	base: ".cache",
	persist: true,
	name: "refreshTokenCache"
});

// store otp tokens in persistent
export const otpCache = cache({
	duration: 10 * 60 * 1000, // 10 minutes
	base: ".cache",
	persist: true,
	name: "otpCache"
});
