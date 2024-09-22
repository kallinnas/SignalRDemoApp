import { Component } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { RspGameComponent } from '../rsp-game/rsp-game.component';
import { Observable } from 'rxjs';
import { SignalrService } from '../../services/signalr/signalr.service';
import { GameStatus } from '../rsp-game/rsp-game.model';
import { RspGameService } from '../rsp-game/rsp-game.service';
import { RspWelcomeComponent } from '../rsp-game/rsp-welcome.component';

@Component({
  selector: 'app-game-manager',
  standalone: true,
  imports: [GeneralModule, RspGameComponent, RspWelcomeComponent],
  templateUrl: './game-manager.component.html',
  styleUrl: './game-manager.component.scss'
})
export class GameManagerComponent {
  
  get status$(): Observable<GameStatus> | undefined {
    return this.hub.status$;
  }

  constructor(public hub: RspGameService) { }
}
