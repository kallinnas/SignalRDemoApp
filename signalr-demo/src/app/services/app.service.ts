import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserSignalrDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AppService {

  userData!: UserSignalrDto;
  isAuthenticated = signal<boolean>(false);

  constructor(
    public router: Router,
    public toastr: ToastrService,
  ) { }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['role'];
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
