import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class SignalrService {

  hubConnection!: signalR.HubConnection;
  
  private signalrSubject = new Subject<any>();
  signalrSubject$ = this.signalrSubject.asObservable();

  hasConnection = (): boolean => this.hubConnection?.state === signalR.HubConnectionState.Connected;

  startConnection = (): Promise<void> => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubURL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
        // , accessTokenFactory: () => localStorage.getItem('token')
      })
      .build();

    return this.hubConnection.start()
      .then(() => {
        console.log('#0 Hub conn started!');
        this.signalrSubject.next({ type: 'HubConnectionStarted' });
      })
      .catch(err => console.log('Error while srating conn: ' + err));
  }

  offConnection(text: string | string[]) {
    (Array.isArray(text) ? text : [text]).forEach(t => this.hubConnection.off(t));
  }

}
