import axios from "axios";
import localforage from "localforage";
import config from "../config";

const apiClient = axios.create({
  baseURL: config.backendUrl,
  withCredentials: true,
  timeout: 120000,
});

apiClient.interceptors.request.use(
  async function (config) {
    const token = await localforage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const createRoom = (data: {
  displayName: string;
  gameName: string;
  votingSystem: string;
}) => {
  return apiClient.post("/api/v1/room/create", data);
};

const closeRoom = () => {
  return apiClient.post("/api/v1/room/close");
};

const getRoom = () => {
  return apiClient.get("/api/v1/room/get-room");
};

const joinRoom = (
  roomId: string | undefined,
  data: {
    displayName: string;
  }
) => {
  return apiClient.put(`/api/v1/room/${roomId}/join`, data);
};

export { createRoom, closeRoom, getRoom, joinRoom };
