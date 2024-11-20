import { Observable, map, merge, startWith, tap } from 'rxjs';
import { SignalrClient, SignalrConnection } from 'ngx-signalr-websocket';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { UserRspPlayerDto } from '../../models/user.model';
import { GameStatus, Drawn, Won, GameStatusEnum, GameResultEnum } from './rsp-game.model';
import { AppService } from '../../services/app.service';

@Injectable({ providedIn: 'root' })
export class RspGameService {

  private connection?: SignalrConnection;
  private _isConnected = signal<boolean>(false);
  playerName = "";
  isFirstPlayer: boolean = false;

  waitingUser = signal<UserRspPlayerDto | null>(null);

  status$?: Observable<GameStatus>;
  outcome$?: Observable<{ type: GameResultEnum, value: Drawn | Won }>;

  private waitingForOpponentCommand: string = 'WAITING_FOR_OPPONENT';
  private playerDisconnectedCommand: string = 'PLAYER_DISCONNECTED';
  private gameStartedCommand: string = 'GAME_STARTED';
  private startRspGameMethodName: string = 'StartRspGame';
  private throwMethodName: string = 'Throw';

  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
  ) { }


  get isConnected(): boolean {
    return this._isConnected();
  }

  initConnection(): void {
    const client = SignalrClient.create(this.httpClient);
    client.connect(environment.rspGameHubURL).subscribe({
      next: (connection) => {
        this.connection = connection;
        this._isConnected.set(true); 
        this.onStatusPipe();
        this.onResultPipe();
        this.onDisconnectPipe();
        this.startRspGame();
      },
      error: (err) => {
        console.error('Connection error:', err);
        this._isConnected.set(false);
      },
    });
  }

  disconnectConnection(): void {
    this.connection?.close();
    this._isConnected.set(false);
  }

  private startRspGame(): void {
    this.playerName = this.appService.userData.name;
    const userId: string = this.appService.userData.id;
    this.connection?.send(this.startRspGameMethodName, userId);
  }

  private onStatusPipe(): void {
    if (!this.connection) return;
    
    const waitingForOpponent$: Observable<GameStatus> = this.connection!.on<[]>(this.waitingForOpponentCommand)
      .pipe(
        map(() => ({ status: GameStatusEnum.Wait } as GameStatus)),
        tap(() => { this.isFirstPlayer = true; }));

    const gameStarted$: Observable<GameStatus> = this.connection!.on<[UserRspPlayerDto, UserRspPlayerDto, string]>(this.gameStartedCommand)
      .pipe(
        map(([player1, player2, group]) => ({
          status: GameStatusEnum.Play, player: this.playerName,
          player1, player2, group
        } as GameStatus)));

    this.status$ = merge(waitingForOpponent$.pipe(
      startWith({ status: GameStatusEnum.Wait } as GameStatus)), gameStarted$);
  }

  throw(group: string, selection: string) {
    this.connection?.send(this.throwMethodName, group, this.playerName, selection);
  }

  private onResultPipe(): void {
    let drawn$ = this.connection!.on<[string, UserRspPlayerDto, UserRspPlayerDto]>(GameResultEnum.Drawn)
      .pipe(map(([explanation, player1, player2]) => ({ explanation, player1, player2 } as Drawn)));

    let won$ = this.connection!.on<[string, string, UserRspPlayerDto, UserRspPlayerDto]>(GameResultEnum.Won)
      .pipe(map(([winner, explanation, player1, player2]) => ({ winner, explanation, player1, player2 } as Won)));

    this.outcome$ = merge(
      drawn$.pipe(map(value => ({ type: GameResultEnum.Drawn, value }))),
      won$.pipe(map(value => ({ type: GameResultEnum.Won, value }))));
  }

  private onDisconnectPipe(): void {
    this.connection!.on(this.playerDisconnectedCommand).subscribe(() => {
      this.appService.showSnackbar('Opponent has disconnected.');
      this.appService.router.navigate(['account']);
      this._isConnected.set(false);
    });
  }

}
