import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, merge, startWith, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GameStatus, Drawn, Won } from './rsp-game.model';
import { SignalrClient, SignalrConnection } from 'ngx-signalr-websocket';
import { AppService } from '../../services/app.service';
import { UserRspPlayerDto } from '../../models/user.model';

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
        tap(() => {
          console.log('onWaitingForPlayer');
          this.isFirstPlayer = true;
        }));

    let gameStarted$ = connection.on<[UserRspPlayerDto, UserRspPlayerDto, string]>('GameStarted')
      .pipe(
        map(([player1, player2, group]) => ({
          status: 'playing', player: this.playerName,
          player1, player2, group
        } as GameStatus)),
        tap(() => console.log('onGameStarted')));

    this.status$ = merge(waitingForPlayer$.pipe(
      startWith({ status: 'waiting' } as GameStatus)), gameStarted$);
  }

  private setupOutcomePipe(connection: SignalrConnection): void {
    console.log('#2 setupOutcomePipe: Drawn / Won = outcome$');

    let drawn$ = connection.on<[string, UserRspPlayerDto, UserRspPlayerDto]>('Drawn')
      .pipe(map(([explanation, player1, player2]) => ({ explanation, player1, player2 } as Drawn)));

    let won$ = connection.on<[string, string, UserRspPlayerDto, UserRspPlayerDto]>('Won')
      .pipe(map(([winner, explanation, player1, player2]) => ({ winner, explanation, player1, player2 } as Won)));

    this.outcome$ = merge(
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
