import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection;

  constructor() { }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7217/customHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
        // , accessTokenFactory: () => localStorage.getItem('token')
      })
      .build();

    this.hubConnection.start()
      .then(() => console.log('Hub conn started!'))
      .catch(err => console.log('Error while srating conn: ' + err));
  }

  askServer() {
    this.hubConnection.invoke('AskServer', 'Hey!').catch(err => console.log(err));
  }

  askServerListener() {
    this.hubConnection.on('AskServerResponse', (response) => { console.log(response) });
  }

  offConnection() {
    this.hubConnection.off('AskServerResponse');
  }

}
