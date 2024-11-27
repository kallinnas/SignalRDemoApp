import { Component, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { GameStatus, Drawn, Won, Signs, Sign, GameResult, GameResultEnum } from './rsp-game.model';
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
export class RspGameComponent implements OnChanges, OnInit, OnDestroy {

  Sign = Signs;
  signs = Signs.getAll();

  player1Stats = signal<UserRspPlayerDto | null>(null);
  player2Stats = signal<UserRspPlayerDto | null>(null);

  @Input() game!: GameStatus;
  private outputSubject = new BehaviorSubject<GameResult>({ displayIcons: '', winnerState: '' });
  output$ = this.outputSubject.asObservable();
  private outcomeSubscription!: Subscription;

  isOpponentMadeMove = signal<boolean>(false);
  disableButtons = false;

  displayedColumns = ['Wins', 'Loses', 'Draws'];
  playerChosenIcon!: any;
  opponentChosenIcon!: any;

  constructor(
    public rspGameService: RspGameService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.startIconAnimation();
    this.subscribeOutcomeGameResults();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game'] && this.game) {
      this.player1Stats.set(this.game.player1 ?? null);
      this.player2Stats.set(this.game.player2 ?? null);
    }
  }

  ngOnDestroy(): void {
    if (this.outcomeSubscription) {
      this.outcomeSubscription.unsubscribe();
    }
  }

  private subscribeOutcomeGameResults(): void {
    try {
      this.outcomeSubscription = this.rspGameService.outcome$!.pipe(
        map(outcome => {
          switch (outcome.type) {
            case GameResultEnum.Drawn: return this.processDrawn(outcome.value as Drawn);
            case GameResultEnum.Won: return this.processWon(outcome.value as Won);
            default: throw ('Unexpected result');
          }
        }))
        .subscribe(result => { this.outputSubject.next(result); });
    }

    catch (err) {
      console.log(err);
    }
  }

  private processDrawn(drawn: Drawn): GameResult {
    this.isOpponentMadeMove.set(true);

    this.updatePlayersState(drawn);
    this.setOpponentsSignIcon(drawn);
    this.resetGameScreen();

    return { displayIcons: 'Equals', winnerState: 'Draw' };
  }

  private processWon(won: Won): GameResult {
    this.isOpponentMadeMove.set(true);
    this.game.winner = won.winner;

    this.updatePlayersState(won);
    this.setOpponentsSignIcon(won);
    this.resetGameScreen();

    return {
      displayIcons: won.winner == this.rspGameService.playerName ? 'Wins' : 'Loses',
      winnerState: won.winner == this.rspGameService.playerName ? 'You won!' : `${won.winner} won.`,
    };
  }

  private updatePlayersState(result: Won | Drawn) {
    if (result.player1.name == this.getPlayerName()) {
      this.player1Stats.set(result.player1);
      this.player2Stats.set(result.player2);
    }

    else {
      this.player1Stats.set(result.player2);
      this.player2Stats.set(result.player1);
    }
  }

  private setOpponentsSignIcon(result: Won | Drawn) {
    this.opponentChosenIcon = !('winner' in result) ?
      this.Sign.getByValue(this.rspGameService.isFirstPlayer ? +result.player2?.sign : +result.player1?.sign) :
      result.winner == this.rspGameService.playerName ?
        this.Sign.getByValue(this.rspGameService.isFirstPlayer ? +result.player2?.sign : +result.player1?.sign) :
        this.Sign.getByValue(this.rspGameService.isFirstPlayer ? +result.player2?.sign : +result.player1?.sign);
  }

  throw(selection: number): void {
    this.playerChosenIcon = this.Sign.getByValue(selection);
    this.rspGameService.throw(this.game.group!, this.playerChosenIcon.sign);
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
      (this.player1Stats()?.rspGames ?? 0) - (this.player1Stats()?.rspWins ?? 0) - (this.player1Stats()?.rspDraws ?? 0) :
      (this.player2Stats()?.rspGames ?? 0) - (this.player2Stats()?.rspWins ?? 0) - (this.player2Stats()?.rspDraws ?? 0);
  }
  // DISPLAY TABLE DATA [END]

  isWinnerOpponent(): boolean { return this.game?.winner != this.appService.userData.name; }

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
      this.isOpponentMadeMove.set(false);
      this.playerChosenIcon = undefined;
      this.opponentChosenIcon = undefined;
      this.game.winner = undefined;
      this.disableButtons = false;
      this.startIconAnimation();
      this.outputSubject.next({ displayIcons: '', winnerState: '' });
    }, 1500);
  }
  // ANIMATION ICON SIGNS [END]
}

