import { Component, computed, EventEmitter, Output } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { LogoutService } from '../../services/signalr/logout.service';
import { AppService } from '../../services/app.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [GeneralModule, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  @Output() closeSidenav = new EventEmitter<void>();

  isRegisterMode = computed(() => this.appService.isRegisterMode());
  isAuthenticated = computed(() => this.appService.isAuthenticated());

  connBtn: string = 'User Connection State';
  rspBtn: string = 'Rock-Scissors-Paper'

  constructor(
    public appService: AppService,
    private logoutService: LogoutService,
  ) { }

  onAccessMode() { this.appService.isRegisterMode.set(!this.isRegisterMode()); }

  onCloseSidenav() { this.closeSidenav.emit(); }

  onLogout() {
    this.onCloseSidenav();
    this.logoutService.logout();
  }
}
