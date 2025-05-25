import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { ConfigService } from "../shared/config.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    standalone: false
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  apiKey: string = '';
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(private configService: ConfigService, private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.apiKey = this.configService.getConfig('apiKey');
    console.log('API key:', this.apiKey);
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password, this.apiKey);
    } else {
      authObs = this.authService.signup(email, password, this.apiKey);
    }
    
    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/logins'])
      },
      errorMsg => {
        console.log(errorMsg);
        this.error = errorMsg;
        this.showErrorAlert(errorMsg);
        this.isLoading = false;
      }
    );  
    form.reset();
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    const alertFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }
}
