import { Component } from '@angular/core';
import { RspGameService } from './rsp-game.service';

@Component({
  selector: 'app-rsp-welcome',
  standalone: true,
  imports: [],
  templateUrl: './rsp-welcome.component.html'
})
export class RspWelcomeComponent {

  constructor(private hub: RspGameService) { }

  register(name: string): void{
    this.hub.register(name);
  }
}
