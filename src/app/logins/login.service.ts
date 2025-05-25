import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Login } from './login.model';

@Injectable()
export class LoginService {
  loginsChanged = new Subject<Login[]>();

  private logins: Login[] = [];

  setLogins(logins: Login[]) {
    this.logins = logins;
    this.loginsChanged.next(this.logins.slice());
  }

  getLogins() {
    return this.logins.slice();
  }

  getLogin(index: number) {
    return this.logins[index];
  }

  addLogin(login: Login) {
    this.logins.push(login);
    this.loginsChanged.next(this.logins.slice());
  }

  updateLogin(index: number, newLogin: Login) {
    this.logins[index] = newLogin;
    this.loginsChanged.next(this.logins.slice());
  }

  deleteLogin(index: number) {
    this.logins.splice(index, 1);
    this.loginsChanged.next(this.logins.slice());
  }
}
