// const initializeSocketIO = (io) => {
//   io.on("connection", async (socket) => {
//     console.info("A user connected.");

//     socket.join("scrum");

//     socket.on("disconnect", () => {
//       console.log("user disconnected.");
//     });
//   });
// };

// const emitUpdatedRoom = (req, room) => {
//   req.app.get("io").in("scrum").emit("updated_room", room);
// };

// export { initializeSocketIO, emitUpdatedRoom };
