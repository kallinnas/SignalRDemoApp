import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { map, Observable } from 'rxjs';
import { GameStatus, Drawn, Won, Signs, Sign, GameResult } from './rsp-game.model';
import { RspGameService } from './rsp-game.service';
import { AppService } from '../../services/app.service';
import { UserRspPlayerDto } from '../../models/user.model';


@Component({
  selector: 'app-rsp-game',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './rsp-game.component.html',
  styleUrl: './rsp-game.component.scss'
})
export class RspGameComponent implements OnChanges {

  Sign = Signs;
  signs = Signs.getAll();

  player1Stats = signal<UserRspPlayerDto | null>(null);
  player2Stats = signal<UserRspPlayerDto | null>(null);

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game'] && this.game) {
      this.player1Stats.set(this.game.player1 ?? null);
      this.player2Stats.set(this.game.player2 ?? null);
    }
  }

  private processDrawn(drawn: Drawn): GameResult {
    this.resetGameScreen();

    const player1 = this.player1Stats();
    if (player1) {
      this.player1Stats.set({ ...player1, rspDraws: player1.rspDraws + 1 });
    }
    
    const player2 = this.player2Stats();
    if (player2) {
      this.player2Stats.set({ ...player2, rspDraws: player2.rspDraws + 1 });
    }

    return { displayIcons: drawn.explanation, winnerState: 'Draw' };
  }

  private processWon(won: Won): GameResult {
    this.isOpponentMadeMove.set(true);
    this.game.winner = won.winner;

    if (won.player2 && won.player1) { // updates players statistics and state
      if (won.player1.name == this.getPlayerName()) {
        this.player1Stats.set(won.player1);
        this.player2Stats.set(won.player2);
      }

      else {
        this.player1Stats.set(won.player2);
        this.player2Stats.set(won.player1);
      }

      // sets opponents sign icon according to the winner state
      this.opponentChosenIcon = won.winner == this.rspGameService.playerName ?
        this.Sign.getByValue(this.rspGameService.isFirstPlayer ? +won.player2?.sign : +won.player1?.sign) :
        this.Sign.getByValue(this.rspGameService.isFirstPlayer ? +won.player2?.sign : +won.player1?.sign);
    }

    this.resetGameScreen();

    return {
      displayIcons: won.winner == this.rspGameService.playerName ? 'Loses' : 'Wins',
      winnerState: won.winner == this.rspGameService.playerName ? 'You won!' : `${won.winner} won.`,
    };
  }

  throw(selection: number): void {
    this.playerChosenIcon = this.Sign.getByValue(selection);
    this.currentThrow = this.playerChosenIcon.sign;
    this.rspGameService.throw(this.game.group!, this.currentThrow);
    this.disableButtons = true;
  }

  // DISPLAY TABLE DATA [START]
  private isOpponent(): boolean { return this.player1Stats()?.name !== this.appService.userData.name; }
  getPlayerName() { return !this.isOpponent() ? this.player1Stats()?.name : this.player2Stats()?.name; }
  getOpponentName() { return this.isOpponent() ? this.player1Stats()?.name : this.player2Stats()?.name; }
  // if isForOpponent=true returns opponets statistics, false - players statistics
  getPlayerWins(isForOpponent: boolean) { return this.isOpponent() == isForOpponent ? this.player1Stats()?.rspWins : this.player2Stats()?.rspWins; }
  getPlayerDraws(isForOpponent: boolean) { return this.isOpponent() == isForOpponent ? this.player1Stats()?.rspDraws : this.player2Stats()?.rspDraws; }
  getPlayerLoses(isForOpponent: boolean) {
    return this.isOpponent() == isForOpponent ?
      (this.player1Stats()?.rspGames ?? 0) - (this.player1Stats()?.rspWins ?? 0) : (this.player2Stats()?.rspGames ?? 0) - (this.player2Stats()?.rspWins ?? 0);
  }
  // DISPLAY TABLE DATA [END]

  isWinnerOpponent(): boolean { return this.game?.winner != this.appService.userData.name; }

  private setOpponent() { this.opponent = this.game.player1?.name === this.rspGameService.playerName ? this.game.player2 : this.game.player1; }

  // ANIMATION ICON SIGNS [START]
  cyclingIcons!: any;
  currentOpponentIcon: Sign = this.signs[0];

  private startIconAnimation() {
    let index = 0;
    this.cyclingIcons = setInterval(() => {
      this.currentOpponentIcon = this.signs[index];
      index = (index + 1) % this.signs.length;
    }, 330);
  }

  private stopIconAnimation() { clearInterval(this.cyclingIcons); }

  private resetGameScreen() {
    this.stopIconAnimation();

    setTimeout(() => {
      this.currentThrow = '';
      this.isOpponentMadeMove.set(false);
      this.playerChosenIcon = undefined;
      this.opponentChosenIcon = undefined;
      this.game.winner = undefined;
      this.disableButtons = false;
      this.startIconAnimation();
    }, 5000);
  }
  // ANIMATION ICON SIGNS [END]
}

