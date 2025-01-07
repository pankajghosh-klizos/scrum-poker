import { configureStore } from "@reduxjs/toolkit";
import roomReducers from "./slices/room.slice.ts";
import participantReducers from "./slices/participant.slice.ts";

const store = configureStore({
  reducer: {
    room: roomReducers,
    participant: participantReducers,
  },
});

export default store;
