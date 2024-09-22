import { Component, Input } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { map, Observable } from 'rxjs';
import { GameStatus, Pending, Drawn, Won } from './rsp-game.model';
import { RspGameService } from './rsp-game.service';

interface Output {
  line1: string;
  line2?: string;
  scores?: string;
}

@Component({
  selector: 'app-rsp-game',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './rsp-game.component.html'
})
export class RspGameComponent {

  @Input() game!: GameStatus;
  output$: Observable<Output>; 

  opponent? = '';
  currentThrow = '';

  constructor(private hub: RspGameService) { 

    this.output$ = this.hub.outcome$!.pipe(
      map(outcome => {
        switch (outcome.type) {
          case 'pending': return this.processPending(outcome.value as Pending);
          case 'drawn': return this.processDrawn(outcome.value as Drawn);
          case 'won': return this.processWon(outcome.value as Won);
          default: throw ('Unexpected result');
        }
      })
    );
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

  private processDrawn(drawn: Drawn): Output {
    this.currentThrow = '';

    return { line1: 'Draw', line2: drawn.explanation, scores: drawn.scores };
  }

  private processWon(won: Won): Output {
    this.currentThrow = '';

    return { line1: won.winner == this.game.thisPlayer ? 'You won!' : `${won.winner} won.`, line2: won.explanation, scores: won.scores };
  }

  throw(selection: 'Rock' | 'Paper' | 'Scissors'): void {
    this.currentThrow = selection;
    this.hub.throw(this.game.group!, selection);
  }

}
