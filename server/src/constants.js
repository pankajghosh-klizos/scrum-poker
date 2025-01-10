export const DB_NAME = "scrum-poker";

export const RoomEventEnum = Object.freeze({
  SOCKET_ERROR_EVENT: "socketError",
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_ROOM_EVENT: "joinRoom",
  PARTICIPANTS_UPDATE_EVENT: "participants_update_event",
});

export const CookieOptions = {
  httpOnly: true, // prevents client-side JavaScript from accessing the cookie
  secure: process.env.NODE_ENV == "production", // the cookie is only sent over HTTPS (true)
  sameSite: "None", // allows cross-site usage (required for third-party contexts)
  domain: process.env.COOKIE_DOMAIN, // the domain for which the cookie is valid
  path: "/", // the cookie will be accessible for the entire domain
};
