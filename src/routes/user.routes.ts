import { Router } from "express";

import { getUserDetails } from "../controllers/user.controller.js";

const app = Router({
	mergeParams: true
});

app.get("/:id", getUserDetails);

export default app;
