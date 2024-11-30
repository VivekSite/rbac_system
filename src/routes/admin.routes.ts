import { Router } from "express";

import { sendMessage } from "../controllers/admin.controller.js";

const app = Router({
	mergeParams: true
});

app.post("/sendmail", sendMessage);

export default app;
