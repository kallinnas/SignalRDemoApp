import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, merge, startWith, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GameStatus, Pending, Drawn, Won } from './rsp-game.model';
import { SignalrClient, SignalrConnection } from 'ngx-signalr-websocket';
import { AppService } from '../../services/app.service';

@Injectable({ providedIn: 'root' })
export class RspGameService {

  private connection?: SignalrConnection;
  private playerName = "";

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
      }
    )
  }

  private setupOutcomePipe(connection: SignalrConnection): void {
    console.log('#3 setupOutcomePipe: Pending / Drawn / Won');

    let pending$ = connection.on<[string]>('Pending')
      .pipe(map(([waitingFor]) => ({ waitingFor } as Pending)));

    let drawn$ = connection.on<[string, string]>('Drawn')
      .pipe(map(([explanation, scores]) => ({ explanation, scores } as Drawn)));

    let won$ = connection.on<[string, string, string]>('Won')
      .pipe(map(([winner, explanation, scores]) => ({ winner, explanation, scores } as Won)));

    console.log('#4 set outcome$: pending/drawn/won');
    this.outcome$ = merge(
      pending$.pipe(map(value => ({ type: 'pending', value }))),
      drawn$.pipe(map(value => ({ type: 'drawn', value }))),
      won$.pipe(map(value => ({ type: 'won', value })))
    )
  }

  private setupStatusPipe(connection: SignalrConnection): void {
    console.log('#1 setupStatusPipe: WaitingForPlayer / GameStarted = mergeStatus$');

    let waitingForPlayer$ = connection.on<[]>('WaitingForPlayer')
      .pipe(
        map(() => ({ status: 'waiting' } as GameStatus)),
        tap(() => console.log('onWaitingForPlayer'))
      );

    let gameStarted$ = connection.on<[string, string, string]>('GameStarted')
      .pipe(
        map(([player1, player2, group]) => ({
          status: 'playing', thisPlayer: this.playerName,
          player1, player2, group
        } as GameStatus)),
        tap(() => console.log('onGameStarted')));

    this.status$ = merge(waitingForPlayer$.pipe(
      startWith({ status: 'waiting' } as GameStatus), tap(() => console.log('onMerge waitingForPlayer/gameStarted'))), gameStarted$);
  }

  register(): void {
    this.playerName = this.appService.userData.name;
    this.connection?.send('Register', this.playerName);
  }

  throw(group: string, selection: 'Rock' | 'Paper' | 'Scissors') {
    this.connection?.send('Throw', group, this.playerName, selection);
  }
}
