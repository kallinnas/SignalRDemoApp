import { UserRspPlayerDto } from "../../models/user.model";

export interface GameStatus {
  status: 'waiting' | 'playing';
  thisPlayer?: string;
  player1?: UserRspPlayerDto;
  player2?: UserRspPlayerDto;
  group?: string;
}

export interface Pending {
  waitingFor: string;
}

export interface Disconnect {
  waitingFor: string;
}

export interface Drawn {
  explanation: string;
  scores: string;
}

export interface Won {
  winner: string;
  explanation: string;
  scores: string;
}

interface Output {
  line1: string;
  line2?: string;
  scores?: string;
}
