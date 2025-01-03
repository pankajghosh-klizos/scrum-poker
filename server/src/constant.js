export const DB_NAME = "scrum-poker";

export const RoomEventEnum = {
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_GAME_EVENT: "joinGame",
  LEAVE_GAME_EVENT: "leaveGame",
  NEW_GAME_EVENT: "newGame",
  UPDATE_GAME_EVENT: "gameUpdated",
  GAME_DELETE_EVENT: "gameDeleted",
  SOCKET_ERROR_EVENT: "socketError",
};

export const AvailableRoomEventEnum = Object.keys(RoomEventEnum);
