import { ReactNode } from "react";
import io from "socket.io-client";

// FormData Interface

export interface NewGameFormData {
  displayName: string;
  gameName: string;
  votingSystem: string;
}

export interface JoinGameFormData {
  displayName: string;
}

// State Interface

export interface ParticipantData {
  displayName: string;
  role: "admin" | "participant";
  isCardSelected: boolean;
  selectedCard: string | null;
  _id: string;
}

export interface RoomData {
  roomId: string;
  gameName: string;
  votingSystem: string;
  maxParticipants: number;
  participants: ParticipantData[];
  status: string;
  average: number;
  roundCount: number;
  isCardRevealed: boolean;
}

// Components Interface

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface ParticipantProps {
  participant: ParticipantData;
}

export interface CardProps {
  value?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  checked?: boolean;
}

export interface SocketContextType {
  socket: ReturnType<typeof io> | null;
  error: string | null;
  isConnected: boolean;
}
