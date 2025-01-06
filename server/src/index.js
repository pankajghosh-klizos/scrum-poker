import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { httpServer } from "./app.js";

dotenv.config({
  path: "../.env",
});

/**
 * Starting from Node.js v14 top-level await is available and it is only available in ES modules.
 * This means you can not use it with common js modules or Node version < 14.
 */

const majorNodeVersion = +process.env.NODE_VERSION.split(".")[0] || 0;
const port = process.env.PORT;

const startServer = () => {
  httpServer.listen(port, () => {
    console.info("⚙️  Server is running on port:", port);
  });
};

if (majorNodeVersion >= 14) {
  try {
    await connectDB();
    startServer();
  } catch (error) {
    console.error("Mongo db connect error: ", error);
  }
} else {
  connectDB()
    .then(() => {
      startServer();
    })
    .catch((error) => {
      console.error("Mongo db connect error: ", error);
    });
}
