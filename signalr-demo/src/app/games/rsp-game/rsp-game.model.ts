import { UserRspPlayerDto } from "../../models/user.model";

export interface GameStatus {
  status: 'waiting' | 'playing';
  player?: string;
  winner?: string;
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
  // constructor(public winner: string, public icoplayer1Signn: string, public player2Sign: string) { }
  winner: string;
  // explanation: string;
  player1Sign: string;
  player2Sign: string;
  // scores: string;
}

interface Output {
  line1: string;
  line2?: string;
  scores?: string;
}

export class Sign { constructor(public value: number, public icon: string, public sign: string) { } }

export class Signs {
  static readonly Rock = new Sign(0, 'fa-regular fa-hand-back-fist fa-4x', 'Rock');
  static readonly Paper = new Sign(1, 'fa-regular fa-hand fa-4x', 'Paper');
  static readonly Scissors = new Sign(2, 'fa-regular fa-hand-scissors fa-4x', 'Scissors');

  static getByValue(value: number) {
    return Object.values(Signs).find(sign => sign.value === value);
  }
}

