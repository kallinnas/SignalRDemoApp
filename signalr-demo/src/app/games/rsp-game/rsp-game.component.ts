import { Component, Input, signal } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { map, Observable } from 'rxjs';
import { GameStatus, Pending, Drawn, Won, Signs } from './rsp-game.model';
import { RspGameService } from './rsp-game.service';
import { AppService } from '../../services/app.service';
import { UserRspPlayerDto } from '../../models/user.model';

interface Output { line1: string; line2?: string; scores?: string; }
interface Output1 { result: string; sign1?: string; sign2?: string; }

@Component({
  selector: 'app-rsp-game',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './rsp-game.component.html',
  styleUrl: './rsp-game.component.scss'
})
export class RspGameComponent {

  sign = Signs;

  @Input() game!: GameStatus;
  output$: Observable<Output>;

  opponent!: UserRspPlayerDto | undefined;
  isOpponentMadeMove = signal<boolean>(false);

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
    console.log(this.opponent);
    
  }

  private processPending(pending: Pending): Output {
    return {
      line1: pending.waitingFor == this.game.player ?
        'Your opponent has chosen ...' : `Waiting for ${pending.waitingFor}`
    };
  }

  private processDrawn(drawn: Drawn): Output {
    this.currentThrow = '';

    return { line1: 'Draw', line2: drawn.explanation, scores: drawn.scores };
  }

  // private processWon(won: Won): Output {
  //   this.currentThrow = '';

  //   return { line1: won.winner == this.game.thisPlayer ? 'You won!' : `${won.winner} won.`, line2: won.explanation, scores: won.scores };
  // }

  private processWon(won: Won): Output {
    this.currentThrow = '';
    this.isOpponentMadeMove.set(true);
    this.game.winner = won.winner;
console.log(won);

    if (won.winner == this.game.player) {
      // this.playerChosenIcon = this.sign.getByValue(+won.player1Sign);
      this.opponentChosenIcon = this.sign.getByValue(+won.player2Sign);
    }

    else {
      // this.playerChosenIcon = this.sign.getByValue(+won.player2Sign);
      this.opponentChosenIcon = this.sign.getByValue(+won.player1Sign);
    }

    return {
      line1: won.winner == this.game.player ? 'You won!' : `${won.winner} won.`,
      line2: won.player1Sign,
      scores: won.player2Sign
    };
  }

  throw(selection: number): void {
    this.playerChosenIcon = this.sign.getByValue(selection);
    this.currentThrow = this.playerChosenIcon.sign;
    this.rspGameService.throw(this.game.group!, this.currentThrow);
  }

  getPlayerName() { return this.game.player1?.name === this.appService.userData.name ? this.game.player1?.name : this.game.player2?.name; }

  getOpponentName() { return this.game.player1?.name !== this.getPlayerName() ? this.game.player1?.name : this.game.player2?.name; }

  isWinnerOpponent(): boolean { return this.game?.winner != this.appService.userData.name; }

  private setOpponent() { this.opponent = this.game.player1 === this.game.player ? this.game.player2 : this.game.player1; }
}

