import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Login } from '../login.model';
import { LoginService } from '../login.service';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
    selector: 'app-login-detail',
    templateUrl: './login-detail.component.html',
    styleUrls: ['./login-detail.component.css'],
    standalone: false
})
export class LoginDetailComponent implements OnInit {
  login: Login;
  id: number;

  constructor(private loginService: LoginService,
              private dataStorageService: DataStorageService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.login = this.loginService.getLogin(this.id);
        }
      );
  }

  onEditLogin() {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteLogin() {
    this.loginService.deleteLogin(this.id);
    this.dataStorageService.storeLogins();
    this.router.navigate(['/logins']);
  }

}
