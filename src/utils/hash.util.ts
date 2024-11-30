import crypto from "node:crypto";

export const generateMD5Hash = (input: string) => {
	const md5Hash = crypto.createHash("md5").update(input).digest("hex");
	return md5Hash;
};
