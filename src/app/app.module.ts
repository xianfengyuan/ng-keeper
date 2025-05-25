import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginsComponent } from './logins/logins.component';
import { LoginListComponent } from './logins/login-list/login-list.component';
import { LoginDetailComponent } from './logins/login-detail/login-detail.component';
import { LoginItemComponent } from './logins/login-list/login-item/login-item.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { AppRoutingModule } from './app-routing.module';
import { LoginEditComponent } from './logins/login-edit/login-edit.component';
import { LoginService } from './logins/login.service';
import { AuthComponent } from './auth/auth.component';
import { LoadSpinnerComponent } from './shared/load-spinner/load-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AlertComponent } from './shared/alert/alert.component';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfigService } from './shared/config.service';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        LoginsComponent,
        LoginListComponent,
        LoginDetailComponent,
        LoginItemComponent,
        DropdownDirective,
        LoginEditComponent,
        AuthComponent,
        LoadSpinnerComponent,
        AlertComponent,
        PlaceholderDirective
    ],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
    ], 
    providers: [
        LoginService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }, provideAnimationsAsync(),
        provideAppInitializer(() => {
        const initializerFn = (loadConfig)(inject(ConfigService));
        return initializerFn();
      })
    ]
})
export class AppModule {}
export function loadConfig(configService: ConfigService) {
    return () => configService.loadConfig();
}
