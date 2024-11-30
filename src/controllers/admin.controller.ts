import httpStatus from "http-status";

import { catchAsync } from "../utils/catchAsync.util.js";

export const sendMessage = catchAsync(async (_req, res) => {
	return res.status(httpStatus.OK).send({
		success: true,
		message: "Only Admin can access this route."
	});
});
