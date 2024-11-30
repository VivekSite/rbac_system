import { userModel } from "../models/user.model.js";

const queryUsers = async (filter = {}, options = {}) => {
	return userModel.find(filter, options)
}

export default { queryUsers }