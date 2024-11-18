import { UserRspPlayerDto } from "../../models/user.model";

export enum GameStatusEnum { Waiting = 'waiting', Playing = 'playing' }
export enum GameResultEnum { Drawn = 'DRAW', Won = 'WON' }

export interface GameStatus {
  status: GameStatusEnum;
  winner?: string;
  player1?: UserRspPlayerDto;
  player2?: UserRspPlayerDto;
  group?: string;
}

export interface GameResult { displayIcons: string; winnerState: string; }

export interface Drawn { explanation: string; player1: UserRspPlayerDto; player2: UserRspPlayerDto; }
export interface Won { winner: string; explanation: string; player1: UserRspPlayerDto; player2: UserRspPlayerDto; }

export interface Sign { value: number; icon: string; sign: string; styles: any; }

export class Signs {
  private static readonly commonStyles = { width: '80px', height: '80px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '90%', };
  static readonly noStyles = { width: '70px', height: '70px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '90%', backgroundColor: 'black' };

  static readonly Rock: Sign = { value: 0, icon: 'fa-regular fa-hand-back-fist fa-4x', sign: 'Rock', styles: { ...Signs.commonStyles, backgroundColor: '#f44336' } };
  static readonly Paper: Sign = { value: 1, icon: 'fa-regular fa-hand fa-4x', sign: 'Paper', styles: { ...Signs.commonStyles, backgroundColor: '#2196F3' } };
  static readonly Scissors: Sign = { value: 2, icon: 'fa-regular fa-hand-scissors fa-4x', sign: 'Scissors', styles: { ...Signs.commonStyles, backgroundColor: '#6fb20c' } };

  static getByValue(value: number) { return Object.values(Signs).find(sign => sign.value === value); }
  static getAll(): Sign[] { return [this.Rock, this.Paper, this.Scissors]; }
}
