import { JwtPayload } from "jsonwebtoken";

declare module "jsonwebtoken" {
	interface JwtPayload {
		id: string;
		username: string;
		email: string;
		role: string;
	}
}
