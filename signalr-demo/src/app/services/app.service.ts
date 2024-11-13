import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserSignalrDto } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AppService {

  userData!: UserSignalrDto;
  isAuthenticated = signal<boolean>(false);
  isRegisterMode = signal<boolean>(false);

  constructor(
    public router: Router,
    private snackbar: MatSnackBar
  ) { }

  isAdminUser(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role'] === '1';
    }

    else return false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  showSnackbar(message: string) {
    this.snackbar.open(message, 'Close', { duration: 3000 });
  }
}
