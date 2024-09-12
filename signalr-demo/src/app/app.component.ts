import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalrService } from './services/signalr.service';
import { GeneralModule } from './modules/general.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'signalr-demo';
  
  signalrService = inject(SignalrService);
  
  ngOnInit(): void {
    this.signalrService.startConnection();
  }
  
  ngOnDestroy(): void {
    this.signalrService.offConnection("ngOnDestroy in app");
  }

}
