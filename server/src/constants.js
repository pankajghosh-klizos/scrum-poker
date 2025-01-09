export const DB_NAME = "scrum-poker";

export const RoomEventEnum = Object.freeze({
  SOCKET_ERROR_EVENT: "socketError",
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_ROOM_EVENT: "joinRoom",
  PARTICIPANTS_UPDATE_EVENT: "participants_update_event",
});

export const CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  partitioned: true,
};
