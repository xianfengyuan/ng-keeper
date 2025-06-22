import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { Login } from '../logins/login.model';
import { LoginService } from '../logins/login.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  dbName: string = '';
  projectName: string = '';
  dbUrl: string = '';

  constructor(private configService: ConfigService, private http: HttpClient, private loginService: LoginService, private authService: AuthService) {
    this.dbName = this.configService.getConfig('dbName');
    this.projectName = this.configService.getConfig('projectName');
    this.dbUrl = 'https://' + this.projectName + '-default-rtdb.firebaseio.com/' + this.dbName + '/';
    console.log('dbUrl ' + this.dbUrl);
  }

  storeLogins() {
    const logins = this.loginService.getLogins();
    const uid = this.authService.uid;
    if (!uid) throw new Error('User not authenticated');

    this.http
      .put(
        this.dbUrl + uid + '.json',
        logins
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchLogins() {
    const uid = this.authService.uid;
    if (!uid) throw new Error('User not authenticated');

    return this.http.get<Login[]>(
      this.dbUrl + uid + '.json',
    )
    .pipe(
      tap(logins => {
        this.loginService.setLogins(logins);
      })
    );
  }
}
