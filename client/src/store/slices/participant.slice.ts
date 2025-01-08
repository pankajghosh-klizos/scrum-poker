import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  participant: null,
};

const participantSlice = createSlice({
  name: "participant",
  initialState,
  reducers: {
    setParticipant: (state, action) => {
      state.participant = action.payload;
    },

    clearParticipant: () => initialState,
  },
});

export default participantSlice.reducer;
export const { setParticipant, clearParticipant } = participantSlice.actions;
