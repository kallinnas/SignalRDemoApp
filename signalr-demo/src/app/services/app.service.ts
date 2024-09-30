import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserSignalrDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AppService {

  userData!: UserSignalrDto;
  isAuthenticated = signal<boolean>(false);
  isRegisterMode = signal<boolean>(false);

  constructor(
    public router: Router,
    public toastr: ToastrService,
  ) { }

  isAdminUser(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['role'] === '1';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
