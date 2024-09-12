import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    if (!this.authService.isAuthenticated) {
      this.authService.router.navigate(['auth']);
      return false;
    } return true;
  }
}