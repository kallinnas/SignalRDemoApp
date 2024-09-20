import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalrService } from './services/signalr.service';
import { GeneralModule } from './modules/general.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'signalr-demo';

  constructor(
    public signalrService: SignalrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.checkAuthentication();
  }


}
