import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginsComponent } from './logins/logins.component';
import { LoginDetailComponent } from './logins/login-detail/login-detail.component';
import { LoginEditComponent } from './logins/login-edit/login-edit.component';
import { LoginsResolverService } from './logins/logins-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '',
    redirectTo: '/logins',
    pathMatch: 'full' 
  },
  {
    path: 'logins',
    component: LoginsComponent,
    resolve: [LoginsResolverService],
    canActivate: [AuthGuard],
    children: [
      { path: 'new', 
        component: LoginEditComponent 
      },
      {
        path: ':id',
        component: LoginDetailComponent,
        resolve: [LoginsResolverService]
      },
      {
        path: ':id/edit',
        component: LoginEditComponent,
        resolve: [LoginsResolverService]
      }
    ]
  },
  { path: 'auth',
    component: AuthComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
