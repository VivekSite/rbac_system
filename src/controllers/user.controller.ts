import httpStatus from "http-status";

import { catchAsync } from "../utils/catchAsync.util.js";
import userService from "../services/user.service.js";

export const getUserDetails = catchAsync(async (req, res) => {
	const { id } = req.params;
	const filter = { _id: id };
	const projection = {
		_id: 1,
		username: 1,
		email: 1,
		role: 1,
		profileImage: 1
	}
	const user = await userService.queryUsers(filter, projection);

	return res.status(httpStatus.OK).send({
		data: user[0]
	})
})
