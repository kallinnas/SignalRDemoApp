import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection;
  toastr: any;

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
      .then(() => {
        console.log('#1 Hub conn started!')
        this.askServerListener();
        this.askServer();
      })
      .catch(err => console.log('Error while srating conn: ' + err));
  }

  async askServer() {
    console.log('#3 askServer started!')

    await this.hubConnection.invoke('AskServer', 'Hey!')
      .then(() => console.log('#5 askServer than()'))
      .catch(err => console.log(err));

    console.log('#6 Final async promt');
  }

  askServerListener() {
    console.log('#2 askServerListener started!')
    this.hubConnection.on('AskServerResponse', (response) => {
      console.log('#4 AskServerResponse listener()');
      this.toastr.success(response);
    });
  }

  offConnection() {
    this.hubConnection.off('AskServerResponse');
  }

}
