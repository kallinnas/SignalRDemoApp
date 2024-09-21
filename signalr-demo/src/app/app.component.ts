import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeneralModule } from './modules/general.model';
import { LoginService } from './services/signalr/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'signalr-demo';

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.checkAuthentication();
  }
}
