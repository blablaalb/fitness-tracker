import { Subject } from "rxjs";

import { User } from './user.model';
import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TrainingService } from "../training/training.service";


@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService) {
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(true);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData): void {
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
    }).catch(error => {
      console.log(error);
    });
  }

  login(authData: AuthData): void {
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  }

  logout(): void {
    this.afAuth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

}
