import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL as string);
    console.log("Connected to DB");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await connectRedis()
  await startServer();
})();

//unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// uncaught exception
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// signal termination
process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Sigint

process.on("SIGINT", () => {
  console.log("SIGINT signal recieved... Server shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
