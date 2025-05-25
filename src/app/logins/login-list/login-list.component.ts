import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Login } from '../login.model';
import { LoginService } from '../login.service';

@Component({
    selector: 'app-login-list',
    templateUrl: './login-list.component.html',
    styleUrls: ['./login-list.component.css'],
    standalone: false
})
export class LoginListComponent implements OnInit, OnDestroy {
  logins: Login[];
  subscription: Subscription;
  searchText: string = '';
  filteredItems: { item: Login, index: number }[] = [];

  constructor(private loginService: LoginService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscription = this.loginService.loginsChanged
      .subscribe(
        (logins: Login[]) => {
          this.logins = logins;
          this.filteredItems = this.logins.map((item, index) => ({ item, index }));
        }
      );
    this.logins = this.loginService.getLogins();
    const searchTextLower = this.searchText.toLowerCase();
    this.filterItems();
  }

  onNewLogin() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterItems() {
    if (!this.searchText) {
      this.filteredItems = this.logins.map((item, index) => ({ item, index }));
    } else {
      const searchTextLower = this.searchText.toLowerCase();
      this.filteredItems = this.logins
        .map((item, index) => ({ item, index }))
        .filter(entry => entry.item.comments.toLowerCase().includes(searchTextLower)
      );
    }
  }
}
