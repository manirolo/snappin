import { env } from "@snappin/env";
import { logger } from "@snappin/lib/logger";
import mongoose from "mongoose";

const uri = env.mongodb.url!;

let connection: typeof mongoose | null = null;

export async function connectDB() {
  if (connection) return connection;

  if (!uri) {
    logger.error("DB_URL is not defined");
    throw new Error("DB_URL is not defined");
  }

  try {
    (await import("node:dns/promises")).setServers(["8.8.4.4", "8.8.8.8"])
    connection = await mongoose.connect(uri, { family: 4 });
    logger.info("DB Connected")
    return connection;
  }
  catch (err) {
    logger.error(`DB Connection failed ${err}`)
    throw err
  }
}
