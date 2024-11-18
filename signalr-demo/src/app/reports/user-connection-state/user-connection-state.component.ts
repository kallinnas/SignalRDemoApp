import { Component } from '@angular/core';
import { UserSignalrDto } from '../../models/user.model';
import { AppService } from '../../services/app.service';
import { LogoutService } from '../../services/auth/logout.service';
import { SignalrService } from '../../services/auth/signalr.service';
import { GeneralModule } from '../../modules/general.model';

@Component({
  selector: 'app-user-connection-state',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './user-connection-state.component.html', styleUrl: './user-connection-state.component.scss'
})
export class UserConnectionStateComponent {

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
