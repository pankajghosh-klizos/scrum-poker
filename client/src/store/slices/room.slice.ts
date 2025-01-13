import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParticipantData, RoomData } from "../../interfaces";

const initialState: { room: RoomData } = {
  room: {
    roomId: "",
    gameName: "",
    votingSystem: "",
    maxParticipants: 0,
    participants: [],
    status: "",
    average: 0,
    roundCount: 0,
    isCardRevealed: false,
  },
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    // Action to set room details
    setRoomDetails: (state, action: PayloadAction<Partial<RoomData>>) => {
      const {
        roomId,
        gameName,
        votingSystem,
        maxParticipants,
        participants,
        average,
        isCardRevealed,
      } = action.payload;
      if (roomId !== undefined) state.room.roomId = roomId;
      if (gameName !== undefined) state.room.gameName = gameName;
      if (votingSystem !== undefined) state.room.votingSystem = votingSystem;
      if (maxParticipants !== undefined)
        state.room.maxParticipants = maxParticipants;
      if (participants !== undefined) state.room.participants = participants;
      if (average !== undefined) state.room.average = average;
      if (isCardRevealed !== undefined)
        state.room.isCardRevealed = isCardRevealed;
    },

    // Action to update room status
    updateRoomStatus: (state, action: PayloadAction<string>) => {
      state.room.status = action.payload;
    },

    // Action to add a participant
    addParticipant: (state, action: PayloadAction<ParticipantData>) => {
      state.room.participants.push(action.payload);
    },

    // Action to remove a participant by ID
    removeParticipant: (state, action: PayloadAction<string>) => {
      state.room.participants = state.room.participants.filter(
        (participant) => participant._id !== action.payload
      );
    },

    // Action to update average score
    setAverageScore: (state, action: PayloadAction<number>) => {
      state.room.average = action.payload;
    },

    // Action to increment the round count
    incrementRoundCount: (state) => {
      state.room.roundCount += 1;
    },

    // Action to reset the round count
    resetRoundCount: (state) => {
      state.room.roundCount = 0;
    },

    // Action to toggle card reveal
    toggleCardReveal: (state) => {
      state.room.isCardRevealed = !state.room.isCardRevealed;
    },

    // Action to reset the entire room state
    resetRoomState: () => initialState,
  },
});

export const {
  setRoomDetails,
  updateRoomStatus,
  addParticipant,
  removeParticipant,
  setAverageScore,
  incrementRoundCount,
  resetRoundCount,
  toggleCardReveal,
  resetRoomState,
} = roomSlice.actions;

export default roomSlice.reducer;
