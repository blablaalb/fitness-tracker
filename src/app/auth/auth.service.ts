import {Subject} from "rxjs";

import {User} from './user.model';
import {AuthData} from "./auth-data.model";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";


@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user!: User;

  constructor(private router: Router) {
  }

  registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccessfully();
  }

  login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccessfully();
  }

  logout(): void {
    this.user = null;
    this.authChange.next(true);
    this.router.navigate(['/login']);
  }

  getUser(): User {
    return {...this.user};
  }

  isAuth(): boolean {
    return this.user != null;
  }

  private authSuccessfully() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
