import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, merge, startWith, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GameStatus, Pending, Drawn, Won } from './rsp-game.model';
import { SignalrClient, SignalrConnection } from 'ngx-signalr-websocket';
import { AppService } from '../../services/app.service';
import { UserRspPlayerDto } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class RspGameService {

  private connection?: SignalrConnection;
  private playerName = "";

  waitingUser = signal<UserRspPlayerDto | null>(null);

  status$?: Observable<GameStatus>;
  outcome$?: Observable<{ type: string, value: Pending | Drawn | Won }>;

  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
  ) {
    const client = SignalrClient.create(httpClient);

    client.connect(environment.rspGameHubURL).subscribe(
      connection => {
        this.connection = connection;
        console.log('#0 RSP Hub conn started!');
        this.register();
        this.setupStatusPipe(connection);
        this.setupOutcomePipe(connection);
      });
  }

  private setupStatusPipe(connection: SignalrConnection): void {
    console.log('#1 setupStatusPipe: WaitingForPlayer / GameStarted = mergeStatus$');

    let waitingForPlayer$ = connection.on<[]>('WaitingForPlayer')
      .pipe(
        map(() => ({ status: 'waiting' } as GameStatus)),
        tap(() => console.log('onWaitingForPlayer')));

    let gameStarted$ = connection.on<[UserRspPlayerDto, UserRspPlayerDto, string]>('GameStarted')
      .pipe(
        map(([player1, player2, group]) => ({
          status: 'playing', player: this.playerName,
          player1, player2, group
        } as GameStatus)),
        tap(() => console.log('onGameStarted')));

    let disconnect$ = connection.on<[string]>('PlayerDisconnected')
      .pipe(
        tap(() => this.register()),
        map(() => ({ status: 'waiting' } as GameStatus)));

    this.status$ = merge(waitingForPlayer$.pipe(
      startWith({ status: 'waiting' } as GameStatus)), gameStarted$, disconnect$);
  }

  private setupOutcomePipe(connection: SignalrConnection): void {
    console.log('#2 setupOutcomePipe: Pending / Drawn / Won = outcome$');

    let pending$ = connection.on<[string]>('Pending')
      .pipe(map(([waitingFor]) => ({ waitingFor } as Pending)));

    let drawn$ = connection.on<[string, string]>('Drawn')
      .pipe(map(([explanation, scores]) => ({ explanation, scores } as Drawn)));

    let won$ = connection.on<[string, string, string]>('Won')
      .pipe(map(([winner, player1Sign, player2Sign]) => ({ winner, player1Sign, player2Sign } as Won)));
      // .pipe(map(([winner, explanation, scores]) => ({ winner, explanation, scores } as Won)));

    this.outcome$ = merge(
      pending$.pipe(map(value => ({ type: 'pending', value }))),
      drawn$.pipe(map(value => ({ type: 'drawn', value }))),
      won$.pipe(map(value => ({ type: 'won', value }))));
  }

  register(): void {
    this.playerName = this.appService.userData.name;
    const userId: string = this.appService.userData.id;
    this.connection?.send('Register', userId);
  }

  throw(group: string, selection: string) {
    this.connection?.send('Throw', group, this.playerName, selection);
  }
}
