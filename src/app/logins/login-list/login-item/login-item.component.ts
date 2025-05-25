import { Component, OnInit, Input } from '@angular/core';

import { Login } from '../../login.model';

@Component({
    selector: 'app-login-item',
    templateUrl: './login-item.component.html',
    styleUrls: ['./login-item.component.css'],
    standalone: false
})
export class LoginItemComponent implements OnInit {
  @Input() login: Login;
  @Input() index: number;

  ngOnInit() {
  }
}
