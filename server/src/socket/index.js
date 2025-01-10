const initializeSocketIO = (io) => {
  io.on("connection", async (socket) => {
    console.info("A user connected.");

    socket.join("scrum");

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected.");
    });
  });
};

export { initializeSocketIO };
