import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import adminRoutes from "./admin.routes.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const app = Router({
	mergeParams: true
});

app.use("/auth", authRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/admin", authMiddleware, roleMiddleware("Admin"), adminRoutes);

export default app;
