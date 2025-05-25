import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, tap, take } from 'rxjs/operators';

import { Login } from '../logins/login.model';
import { LoginService } from '../logins/login.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  dbName: string = '';
  projectName: string = '';

  constructor(private configService: ConfigService, private http: HttpClient, private loginService: LoginService, private authService: AuthService) {
    this.dbName = this.configService.getConfig('dbName');
    this.projectName = this.configService.getConfig('projectName');
    console.log('db: ' + this.dbName + ' project: ' + this.projectName);
  }

  storeLogins() {
    const logins = this.loginService.getLogins();
    this.http
      .put(
        'https://' + this.projectName + '-default-rtdb.firebaseio.com/' + this.dbName + '.json',
        logins
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchLogins() {
    return this.http.get<Login[]>(
      'https://' + this.projectName + '-default-rtdb.firebaseio.com/' + this.dbName + '.json',
    )
    .pipe(
      tap(logins => {
        this.loginService.setLogins(logins);
      })
    );
  }
}
