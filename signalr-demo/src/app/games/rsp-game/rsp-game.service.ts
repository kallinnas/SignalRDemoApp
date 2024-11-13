import { Observable, map, merge, startWith, tap } from 'rxjs';
import { SignalrClient, SignalrConnection } from 'ngx-signalr-websocket';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { UserRspPlayerDto } from '../../models/user.model';
import { GameStatus, Drawn, Won } from './rsp-game.model';
import { AppService } from '../../services/app.service';

@Injectable({ providedIn: 'root' })
export class RspGameService {

  private connection?: SignalrConnection;
  playerName = "";
  isFirstPlayer: boolean = false;

  waitingUser = signal<UserRspPlayerDto | null>(null);

  status$?: Observable<GameStatus>;
  outcome$?: Observable<{ type: string, value: Drawn | Won }>;

  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
  ) { }

  initConnection() {
    const client = SignalrClient.create(this.httpClient);
    client.connect(environment.rspGameHubURL).subscribe(
      connection => {
        this.connection = connection;
        this.onStatusPipe();
        this.onResultPipe();
        this.onDisconnectPipe();
        this.startRspGame();
      });
  }

  private startRspGame(): void {
    this.playerName = this.appService.userData.name;
    const userId: string = this.appService.userData.id;
    this.connection?.send('StartRspGame', userId);
  }

  private onStatusPipe(): void {
    let WaitingForOpponent$ = this.connection!.on<[]>('WaitingForOpponent')
      .pipe(
        map(() => ({ status: 'waiting' } as GameStatus)),
        tap(() => { this.isFirstPlayer = true; }));

    let gameStarted$ = this.connection!.on<[UserRspPlayerDto, UserRspPlayerDto, string]>('GameStarted')
      .pipe(
        map(([player1, player2, group]) => ({
          status: 'playing', player: this.playerName,
          player1, player2, group
        } as GameStatus)));

    this.status$ = merge(WaitingForOpponent$.pipe(
      startWith({ status: 'waiting' } as GameStatus)), gameStarted$);
  }

  throw(group: string, selection: string) {
    this.connection?.send('Throw', group, this.playerName, selection);
  }

  private onResultPipe(): void {
    let drawn$ = this.connection!.on<[string, UserRspPlayerDto, UserRspPlayerDto]>('Drawn')
      .pipe(map(([explanation, player1, player2]) => ({ explanation, player1, player2 } as Drawn)));

    let won$ = this.connection!.on<[string, string, UserRspPlayerDto, UserRspPlayerDto]>('Won')
      .pipe(map(([winner, explanation, player1, player2]) => ({ winner, explanation, player1, player2 } as Won)));

    this.outcome$ = merge(
      drawn$.pipe(map(value => ({ type: 'drawn', value }))),
      won$.pipe(map(value => ({ type: 'won', value }))));
  }

  private onDisconnectPipe(): void {
    this.connection!.on('PlayerDisconnected').subscribe(() => {
      this.appService.showSnackbar('Opponent has disconnected.');
      this.appService.router.navigate(['account']);
    });
  }

}
