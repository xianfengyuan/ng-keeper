import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Login } from './login.model';
import { DataStorageService } from '../shared/data-storage.service';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class LoginsResolverService implements Resolve<Login[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private loginsService: LoginService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const logins = this.loginsService.getLogins();

    if (logins.length === 0) {
      return this.dataStorageService.fetchLogins();
    } else {
      return logins;
    }
  }
}
