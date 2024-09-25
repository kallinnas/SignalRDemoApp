import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AppService } from "./app.service";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private appService: AppService) { }

  canActivate(): boolean {
    const isAuthenticated = this.appService.isAuthenticated();

    if (!isAuthenticated) {
      this.appService.router.navigate(['auth']);
      return false;
    } return true;
  }
}