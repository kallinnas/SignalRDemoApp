import { Component, computed, effect, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GeneralModule } from './modules/general.model';
import { LoginService } from './services/signalr/login.service';
import { AppService } from './services/app.service';
import { LogoutService } from './services/signalr/logout.service';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule, RouterLink, SidenavComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'signalr-demo';
  isAuthenticated = computed(() => this.appService.isAuthenticated());

  constructor(
    public logoutService: LogoutService,
    private loginService: LoginService,
    public appService: AppService,
  ) {
  }

  ngOnInit(): void {
    this.loginService.checkAuthentication();
  }
}
