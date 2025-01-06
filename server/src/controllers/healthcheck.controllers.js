import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkDatabaseConnection } from "../utils/checkDatabaseConnection.js";

const healthcheck = asyncHandler(async (req, res) => {
  const dbCheck = await checkDatabaseConnection();

  return res.status(200).json(
    new ApiResponse(200, "OK", "Health check passed", {
      database: dbCheck.status,
      isDatabaseHealthy: dbCheck.isHealthy,
      timestamp: new Date().toISOString(),
    })
  );
});

export { healthcheck };
