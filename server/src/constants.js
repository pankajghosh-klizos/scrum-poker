export const DB_NAME = "scrum-poker";

export const RoomEventEnum = Object.freeze({
  SOCKET_ERROR_EVENT: "socketError",
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_ROOM_EVENT: "joinRoom",
  PARTICIPANTS_UPDATE_EVENT: "participants_update_event",
});

export const CookieOptions = {
  httpOnly: true, // Ensures the cookie is only accessible by the server
  secure: process.env.NODE_ENV === "production", // Use secure cookies only in production (HTTPS)
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' for cross-site cookies in production, 'lax' for local development
};
