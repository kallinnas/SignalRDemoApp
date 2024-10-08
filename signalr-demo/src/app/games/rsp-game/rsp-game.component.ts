import { Component, Input, signal } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { map, Observable } from 'rxjs';
import { GameStatus, Pending, Drawn, Won, Signs, Sign } from './rsp-game.model';
import { RspGameService } from './rsp-game.service';
import { AppService } from '../../services/app.service';
import { UserRspPlayerDto } from '../../models/user.model';

interface GameResult { line1: string; line2?: string; scores?: string; }
// interface GameResult { line1: string; line2?: string; scores?: string; }
interface Output1 { result: string; sign1?: string; sign2?: string; }

@Component({
  selector: 'app-rsp-game',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './rsp-game.component.html',
  styleUrl: './rsp-game.component.scss'
})
export class RspGameComponent {

  Sign = Signs;
  signs = Signs.getAll();

  @Input() game!: GameStatus;
  output$: Observable<GameResult>;

  opponent!: UserRspPlayerDto | undefined;
  isOpponentMadeMove = signal<boolean>(false);
  disableButtons = false;

  displayedColumns = ['Wins', 'Loses', 'Draws'];
  playerChosenIcon!: any;
  opponentChosenIcon!: any;

  currentThrow = '';

  constructor(
    public rspGameService: RspGameService,
    private appService: AppService
  ) {
    this.output$ = this.rspGameService.outcome$!.pipe(
      map(outcome => {
        switch (outcome.type) {
          case 'pending': return this.processPending(outcome.value as Pending);
          case 'drawn': return this.processDrawn(outcome.value as Drawn);
          case 'won': return this.processWon(outcome.value as Won);
          default: throw ('Unexpected result');
        }
      }));
  }

  ngOnInit(): void {
    this.setOpponent();
    this.startIconAnimation();
  }

  private processPending(pending: Pending): GameResult {
    return {
      line1: pending.opponentsName == this.rspGameService.playerName ?
        'Your opponent has chosen ...' : `Waiting for ${pending.opponentsName}`
    };
  }

  private processDrawn(drawn: Drawn): GameResult {
    this.currentThrow = '';
    this.resetAfter5Seconds();
    return { line1: 'Draw', line2: drawn.explanation, scores: drawn.scores };
  }

  private processWon(won: Won): GameResult {
    this.stopIconAnimation();
    this.currentThrow = '';
    this.isOpponentMadeMove.set(true);
    this.game.winner = won.winner;

    if (won.player2 && won.player1) {
      this.game.player1 = won.player1;
      this.game.player2 = won.player2;
      
      this.opponentChosenIcon = won.winner == this.rspGameService.playerName ?
        this.Sign.getByValue(this.rspGameService.isFirstPlayer ? +won.player2?.sign : +won.player1?.sign) :
        this.Sign.getByValue(this.rspGameService.isFirstPlayer ? +won.player2?.sign : +won.player1?.sign);
    }

    this.resetAfter5Seconds();

    return {
      line1: won.winner == this.rspGameService.playerName ? 'You won!' : `${won.winner} won.`,
      line2: won.player1?.sign.toString(),
      scores: won.player2?.sign.toString()
    };
  }

  throw(selection: number): void {
    this.playerChosenIcon = this.Sign.getByValue(selection);
    this.currentThrow = this.playerChosenIcon.sign;
    this.rspGameService.throw(this.game.group!, this.currentThrow);
    this.disableButtons = true;
  }

  getPlayerName() { return this.game.player1?.name === this.appService.userData.name ? this.game.player1?.name : this.game.player2?.name; }

  getOpponentName() { return this.game.player1?.name !== this.getPlayerName() ? this.game.player1?.name : this.game.player2?.name; }

  isWinnerOpponent(): boolean { return this.game?.winner != this.appService.userData.name; }

  private setOpponent() { this.opponent = this.game.player1?.name === this.rspGameService.playerName ? this.game.player2 : this.game.player1; }

  cyclingIcons!: any;
  currentOpponentIcon: Sign = this.signs[0];

  private startIconAnimation() {
    let index = 0;
    this.cyclingIcons = setInterval(() => {
      this.currentOpponentIcon = this.signs[index];
      index = (index + 1) % this.signs.length;
    }, 330);
  }

  private stopIconAnimation() {
    clearInterval(this.cyclingIcons);
  }

  private resetAfter5Seconds() {
    setTimeout(() => {
      this.isOpponentMadeMove.set(false);
      this.playerChosenIcon = undefined;
      this.opponentChosenIcon = undefined;
      this.game.winner = undefined;
      this.disableButtons = false;
      this.startIconAnimation();
    }, 5000);
  }

}

