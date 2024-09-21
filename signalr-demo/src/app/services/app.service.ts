import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserSignalrDto } from '../models/user.model';

@Injectable({  providedIn: 'root'})
export class AppService {

  userData!: UserSignalrDto;
  isAuthenticated: boolean = false;

  constructor(
    public router: Router,
    public toastr: ToastrService,
  ) { }
}
