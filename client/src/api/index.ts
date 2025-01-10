import axios, { AxiosError } from "axios";
import localforage from "localforage";
import config from "../config";

const apiClient = axios.create({
  baseURL: config.backendUrl,
  withCredentials: true,
  timeout: 120000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await localforage.getItem<string>("accessToken");

      if (typeof token === "string" && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from localforage:", error);
      return Promise.reject(new Error("Failed to fetch access token."));
    }

    return config;
  },
  (error) =>
    Promise.reject(new Error(error?.message || "Request interceptor error"))
);

const handleApiError = (error: unknown) => {
  let errorMessage = "An unexpected error occurred.";

  if (error instanceof AxiosError && error.response) {
    console.error("API Error Response:", error.response.data);
    errorMessage = error.response.data?.message || errorMessage;
  } else if (error instanceof Error) {
    console.error("Error in API request setup:", error.message);
    errorMessage = error.message;
  } else {
    console.error("Unknown error type:", error);
  }

  return Promise.reject(new Error(errorMessage));
};

const createRoom = async (data: {
  displayName: string;
  gameName: string;
  votingSystem: string;
}) => {
  try {
    const response = await apiClient.post("/api/v1/room/create", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const closeRoom = async () => {
  try {
    const response = await apiClient.put("/api/v1/room/close");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const getRoom = async () => {
  try {
    const response = await apiClient.get("/api/v1/room/get-room");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const joinRoom = async (
  roomId: string | undefined,
  data: {
    displayName: string;
  }
) => {
  try {
    const response = await apiClient.put(`/api/v1/room/${roomId}/join`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const leaveRoom = async () => {
  try {
    const response = await apiClient.delete(`/api/v1/room/leave`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const selectCard = async (data: { card: string }) => {
  try {
    const response = await apiClient.put(`/api/v1/room/select`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export { createRoom, closeRoom, getRoom, joinRoom, leaveRoom, selectCard };
