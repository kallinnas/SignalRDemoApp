import { Component, inject } from '@angular/core';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  signalrService = inject(SignalrService);

}
