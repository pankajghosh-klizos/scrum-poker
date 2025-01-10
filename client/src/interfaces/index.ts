export interface NewGameFormData {
  displayName: string;
  gameName: string;
  votingSystem: string;
}

export interface JoinGameFormData {
  displayName: string;
}

export interface ParticipantData {
  displayName: string;
  role: "admin" | "participant";
  isCardSelected: boolean;
  selectedCard: string | null;
  _id: string;
}
