import { Server } from "node:http";

import app from "./app.js";
import { AppConfig } from "./config/env.config.js";
import { Logger } from "./config/logger.config.js";
import { ConnectDB } from "./utils/db.util.js";

let server: Server;
const port = AppConfig.PORT;

ConnectDB(AppConfig.MONGO_URI).then(() => {
	server = app.listen(port, () => {
		Logger.info(`Listening on port ${port}`);
	});
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			Logger.info("Terminated Express Server");
			process.exit(1);
		});
	} else {
		Logger.error("Server didn't start properly");
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: Error) => {
	Logger.error(error);
	exitHandler();
};

process.on("SIGINT", () => {
	exitHandler();
});
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
