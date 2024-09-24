import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GeneralModule } from './modules/general.model';
import { LoginService } from './services/signalr/login.service';
import { AppService } from './services/app.service';
import { LogoutService } from './services/signalr/logout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'signalr-demo';

  constructor(
    public logoutService: LogoutService,
    private loginService: LoginService,
    public appService: AppService,
  ) { }

  ngOnInit(): void {
    this.loginService.checkAuthentication();
  }
}
