import httpStatus from "http-status";
import bcrypt from "bcryptjs";

import { userModel } from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { 
	accessTokenCache, 
	otpCache, 
	refreshTokenCache 
} from "./../utils/cache.util.js";
import { 
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken
} from "../services/token.service.js";
import { compareOTP, generateOTP } from "../utils/otp.util.js";
import { sendGmail } from "../services/nodemailer.service.js";
import { generateMD5Hash } from "../utils/hash.util.js";

export const signUpHandler = catchAsync(async (req, res) => {
	const { fullname, email, password, role } = req.body;

	const existingUser = await userModel.findOne({ email });
	if (existingUser) {
		return res.status(httpStatus.CONFLICT).send({
			success: false,
			message: `User with email ${email} already exists`
		});
	}

	const hashedPassword = bcrypt.hashSync(password, 10);
	const user = await userModel.create({
		username: fullname,
		email,
		role,
		password: hashedPassword
	});

	const payload = {
		id: user._id,
		username: fullname,
		email,
		role,
		mobile: user.mobile,
		profileImage: user.profileImage
	};
	// Sign a token
	const accessToken = await signAccessToken(email, payload);
	const refreshToken = await signRefreshToken(email, payload);

	if (!accessToken || !refreshToken) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
			success: false,
			message: "Token generation failed!"
		})
	}

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		path: "/",
		secure: true,
		sameSite: "none",
		maxAge: 60 * 60 * 100
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		path: "/",
		secure: true,
		sameSite: "none",
		maxAge: 30 * 24 * 60 * 60 * 100
	});

	return res.status(httpStatus.OK).json({
		success: true,
		message: "User created successfully"
	});
});

export const signInHandler = catchAsync(async (req, res) => {
	const { email, password } = req.body;

	const existingUser = await userModel.findOne({ email: email });
	if (!existingUser) {
		return res.status(httpStatus.NOT_FOUND).send({
			success: false,
			message: `User with email ${email} not found`
		});
	}

	const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password as string);
	if (!isPasswordCorrect) {
		return res.status(httpStatus.UNAUTHORIZED).json({
			success: false,
			message: "Wrong password!"
		});
	}

	const payload = {
		id: existingUser._id,
		username: existingUser.username,
		email,
		role: existingUser.role,
		mobile: existingUser.mobile,
		profileImage: existingUser.profileImage
	};
	// Sign a token
	const accessToken = await signAccessToken(email, payload);
	const refreshToken = await signRefreshToken(email, payload);

	if (!accessToken || !refreshToken) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
			success: false,
			message: "Token generation failed!"
		})
	}

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		path: "/",
		secure: true,
		sameSite: "none",
		maxAge: 60 * 60 * 100
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		path: "/",
		secure: true,
		sameSite: "none",
		maxAge: 30 * 24 * 60 * 60 * 100
	});

	return res.status(httpStatus.OK).json({
		success: true,
		message: "Login successful"
	});
});

export const statusHandler = catchAsync(async (req, res) => {
	const auth = req.auth;
	if (auth) {
		return res.status(httpStatus.OK).send({
			success: true,
			message: "Auth Is Valid.",
			auth
		});
	}

	return res.status(httpStatus.FORBIDDEN).send({
		success: false,
		message: "Invalid Auth!"
	});
});

export const refreshTokenHandler = catchAsync(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return res.send({
			success: false,
			message: "Refresh token is required!"
		});
	}

	const payload = await verifyRefreshToken(refreshToken);
	if (!payload || !payload.email) {
		return res.send({
			success: false,
			message: "Invalid refresh token"
		});
	}

	const { email } = payload;
	const newPayload = {
		email,
		username: payload.name,
		id: payload.id,
		mobile: payload.mobile,
		profileImage: payload.profileImage
	};
	const newAccessToken = await signAccessToken(email, newPayload);
	const newRefreshToken = await signRefreshToken(email, newPayload);

	res.cookie("accessToken", newAccessToken, {
		httpOnly: true,
		secure: true,
		path: "/",
		sameSite: "none",
		expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
	});
	res.cookie("refreshToken", newRefreshToken, {
		httpOnly: true,
		secure: true,
		path: "/",
		sameSite: "none",
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
	});

	return res.send({
		success: true,
		message: "Token generated successfully",
		auth: payload
	});
});

export const logoutHandler = catchAsync(async (req, res) => {
	const { email } = req.auth;

	accessTokenCache.deleteSync(generateMD5Hash(`${email}_access_token`));
	refreshTokenCache.deleteSync(generateMD5Hash(`${email}_refresh_token`));
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");

	return res.status(httpStatus.OK).send({
		success: true,
		message: "Logged Out Successfully"
	});
});

export const forgotPasswordHandler = catchAsync(async (req, res) => {
	const { email } = req.body;

	const user = await userModel.findOne({ email });
	if (!user) {
		return res.status(httpStatus.NOT_FOUND).send({
			success: false,
			message: `No user found with email ${email}`
		});
	}

	const otp = await generateOTP(email);
	await sendGmail(
		email,
		"Received reset password request",
		`Use this OTP to reset your password: ${otp}`
	);

	return res.status(httpStatus.OK).send({
		success: true,
		message: "OTP is sent on registered email"
	});
});

export const resetPasswordHandler = catchAsync(async (req, res) => {
	const { otp, password, email } = req.body;

	const isCorrectOTP = await compareOTP(otp, email);
	if (!isCorrectOTP) {
		return res.status(httpStatus.UNAUTHORIZED).send({
			success: false,
			message: "Invalid OTP"
		});
	}

	const hashedPassword = bcrypt.hashSync(password, 10);
	await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
	otpCache.deleteSync(generateMD5Hash(`${email}_otp`));

	return res.status(httpStatus.OK).send({
		success: true,
		message: "Password updated successfully"
	});
});
