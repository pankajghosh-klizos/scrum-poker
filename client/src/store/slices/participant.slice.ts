import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  participant: {
    displayName: "",
    role: "",
    isCardSelected: false,
    selectedCard: null,
  },
};

const participantSlice = createSlice({
  name: "participant",
  initialState,
  reducers: {
    // Action to set participant details
    setParticipantDetails: (state, action) => {
      const { displayName, role, isCardSelected, selectedCard } =
        action.payload;
      if (displayName !== undefined)
        state.participant.displayName = displayName;
      if (role !== undefined) state.participant.role = role;
      if (isCardSelected !== undefined)
        state.participant.isCardSelected = isCardSelected;
      if (selectedCard !== undefined)
        state.participant.selectedCard = selectedCard;
    },

    // Action to toggle card selection
    toggleCardSelection: (state) => {
      state.participant.isCardSelected = !state.participant.isCardSelected;
    },

    // Action to set the selected card
    setSelectedCard: (state, action) => {
      state.participant.selectedCard = action.payload;
    },

    // Action to reset participant state to initial
    resetParticipantState: () => initialState,
  },
});

export const {
  setParticipantDetails,
  toggleCardSelection,
  setSelectedCard,
  resetParticipantState,
} = participantSlice.actions;

export default participantSlice.reducer;
