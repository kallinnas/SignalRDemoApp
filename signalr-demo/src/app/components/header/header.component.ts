import { Component, computed, EventEmitter, Output } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { AppService } from '../../services/app.service';
import { LogoutService } from '../../services/auth/logout.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [GeneralModule, RouterLink],
  templateUrl: './header.component.html', styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() sidenavToggle = new EventEmitter<void>();

  isRegisterMode = computed(() => this.appService.isRegisterMode());
  isAuthenticated = computed(() => this.appService.isAuthenticated());

  connBtn: string = 'User Connection State';
  rspBtn: string = 'Rock-Scissors-Paper'
  accountBtn: string = 'Account'

  constructor(
    public appService: AppService,
    private logoutService: LogoutService,
  ) { }

  onAccessMode() { this.appService.isRegisterMode.set(!this.isRegisterMode()); }

  onToggleSidenav() { this.sidenavToggle.emit(); }

  onLogout() { this.logoutService.logout(); }
}
