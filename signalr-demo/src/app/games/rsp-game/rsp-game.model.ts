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

export class Sign {
  constructor(public value: number, public icon: string, public sign: string, public styles: any) { }
}

export class Signs {
  private static readonly commonStyles = { width: '80px', height: '80px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '80%', };

  static readonly Rock = new Sign(0, 'fa-regular fa-hand-back-fist fa-4x', 'Rock', { ...Signs.commonStyles, backgroundColor: '#f44336' });
  static readonly Paper = new Sign(1, 'fa-regular fa-hand fa-4x', 'Paper', { ...Signs.commonStyles, backgroundColor: '#2196F3' });
  static readonly Scissors = new Sign(2, 'fa-regular fa-hand-scissors fa-4x', 'Scissors', { ...Signs.commonStyles, backgroundColor: '#6fb20c' });

  static getByValue(value: number) { return Object.values(Signs).find(sign => sign.value === value); }
  static getAll(): Sign[] { return [this.Rock, this.Paper, this.Scissors]; }
}
