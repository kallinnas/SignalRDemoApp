import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { GeneralModule } from '../modules/general.model';
import { PersonSignalrDto } from '../models/person.model';
import { HubConnectionState } from '@microsoft/signalr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  persons = new Array<PersonSignalrDto>();

  constructor(
    private signalrService: SignalrService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.personOnList();
    this.personOffList();
    this.logOutList();
    this.getOnlinePersonsList();

    if (this.signalrService.hubConnection.state == HubConnectionState.Connected) {
      this.getOnlinePersonsInv();
    }

    else {
      this.signalrService.signalrSubject$.subscribe((response: any) => {
        if (response.type == "HubConnStarted") {
          this.getOnlinePersonsInv();
        }
      });
    }
  }

  logout() {
    this.signalrService.hubConnection.invoke('Logout', this.authService.personData.id).catch(err => console.log(err));
  }

  logOutList(): void {
    this.signalrService.hubConnection.on('logoutResponse', () => {
      localStorage.removeItem('personId');
      location.reload();
      // this.signalrService.hubConnection.stop();
    });
  }

  personOnList(): void {
    this.signalrService.hubConnection.on('personOn', (person: PersonSignalrDto) => {
      this.persons.push(person);
    });
  }

  personOffList(): void {
    this.signalrService.hubConnection.on('personOff', (personId: string) => {
      this.persons = this.persons.filter(p => p.id != personId);
    });
  }

  getOnlinePersonsInv(): void {
    this.signalrService.hubConnection.invoke('getOnlinePersons')
      .catch(err => console.error(err));
  }

  getOnlinePersonsList(): void {
    this.signalrService.hubConnection.on('getOnlinePersonsResponse', (onlinePersons: Array<PersonSignalrDto>) => {
      this.persons = [...onlinePersons];
    });
  }
}
