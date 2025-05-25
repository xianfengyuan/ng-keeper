import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    return this.http.get('/assets/config.json').toPromise().then(config => {
      this.config = config;
    })
  }

  getConfig(key: string): any {
    return this.config?.[key];
  }
}
