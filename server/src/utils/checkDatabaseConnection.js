import mongoose from "mongoose";

const checkDatabaseConnection = async () => {
  try {
    const state = mongoose.connection.readyState;

    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      status: states[state] || "unknown",
      isHealthy: state === 1,
    };
  } catch (error) {
    console.error("Mongo db connection check failed:", error);
    return {
      status: "error",
      isHealthy: false,
    };
  }
};

export { checkDatabaseConnection };
