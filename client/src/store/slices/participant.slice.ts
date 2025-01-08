import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  room: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.room = action.payload;
    },
    clearRoom: () => initialState,
  },
});

export default roomSlice.reducer;
export const { setRoom, clearRoom } = roomSlice.actions;
