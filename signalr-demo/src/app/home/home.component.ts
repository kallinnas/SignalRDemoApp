import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralModule } from '../modules/general.model';
import { UserSignalrDto } from '../models/user.model';
import { SignalrService } from '../services/signalr/signalr.service';
import { AppService } from '../services/app.service';
import { LogoutService } from '../services/signalr/logout.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  usersOnline = new Array<UserSignalrDto>();

  constructor(
    private signalrService: SignalrService,
    public logoutService: LogoutService,
    public appService: AppService
  ) { }

  ngOnDestroy(): void {
    this.signalrService.offConnection(this.logoutService.successCommand);
  }

  ngOnInit(): void {
    this.userOnline();
    this.userOffline();
    this.getOnlineUsers();

    if (this.signalrService.hasConnection()) {
      this.getOnlineUsersInv();
    }

    else {
      this.signalrService.signalrSubject$.subscribe((response: any) => {
        if (response.type == "HubConnectionStarted") {
          this.getOnlineUsersInv();
        }
      });
    }
  }

  userOnline(): void {
    try {
      this.signalrService.hubConnection.on('User_Online', (user: UserSignalrDto) => {
        this.usersOnline.push(user);
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  userOffline(): void {
    try {
      this.signalrService.hubConnection.on('User_Offline', (userId: string) => {
        this.usersOnline = this.usersOnline.filter(u => u.id != userId);
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  getOnlineUsersInv(): void {
    this.signalrService.hubConnection.invoke('GetOnlineUsers')
      .catch(err => console.error(err));
  }

  getOnlineUsers(): void {
    this.signalrService.hubConnection.on('GetOnlineUsers_Response', (onlineUsers: Array<UserSignalrDto>) => {
      this.usersOnline = [...onlineUsers];
    });
  }
}
