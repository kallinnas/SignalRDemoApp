import { Component, Input } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { map, Observable } from 'rxjs';
import { GameStatus, Pending, Drawn, Won, Disconnect } from './rsp-game.model';
import { RspGameService } from './rsp-game.service';
import { AppService } from '../../services/app.service';

interface Output { line1: string; line2?: string; scores?: string; }

@Component({
  selector: 'app-rsp-game',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './rsp-game.component.html',
  styleUrl: './rsp-game.component.scss'
})
export class RspGameComponent {

  @Input() game!: GameStatus;
  output$: Observable<Output>;

  opponent: any = 'opponent';
  user: any = 'user';

  statTitles = ['Wins', 'Loses', 'Draws', 'Wins', 'Loses', 'Draws'];
  chosenIcon!: string;

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
          // case 'disconnect': return this.processReconnection(outcome.value as Disconnect);
          default: throw ('Unexpected result');
        }
      }));

      console.log(rspGameService.waitingUser());
      
  }

  ngOnInit(): void {
    this.opponent = this.game.player1 === this.game.thisPlayer ? this.game.player2 : this.game.player1;
  }

  private processPending(pending: Pending): Output {
    return {
      line1: pending.waitingFor == this.game.thisPlayer ?
        'Your opponent has chosen ...' : `Waiting for ${pending.waitingFor}`
    };
  }

  private processReconnection(disconnect: Disconnect) {
    alert('Connection with player was lost.');
    this.appService.router.navigate(['game-manager']);
    // return {
    //   line1: disconnect.waitingFor == this.game.thisPlayer ?
    //     'Your opponent has chosen ...' : `Waiting for ${disconnect.waitingFor}`
    // };
  }

  private processDrawn(drawn: Drawn): Output {
    this.currentThrow = '';

    return { line1: 'Draw', line2: drawn.explanation, scores: drawn.scores };
  }

  private processWon(won: Won): Output {
    this.currentThrow = '';

    return { line1: won.winner == this.game.thisPlayer ? 'You won!' : `${won.winner} won.`, line2: won.explanation, scores: won.scores };
  }

  throw(selection: 'Rock' | 'Paper' | 'Scissors', chosenIcon: string): void {
    this.chosenIcon = chosenIcon;
    this.currentThrow = selection;
    this.rspGameService.throw(this.game.group!, selection);
  }

}

