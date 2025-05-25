import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';

import { Login } from '../login.model';
import { LoginService } from '../login.service';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
    selector: 'app-login-edit',
    templateUrl: './login-edit.component.html',
    styleUrls: ['./login-edit.component.css'],
    standalone: false
})
export class LoginEditComponent implements OnInit {
  id: number;
  login: Login;
  editMode = false;
  loginForm: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  onSubmit() {
    const established_local = this.loginForm.get('established.established')?.value;
    this.login = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
      comments: this.loginForm.get('comments').value,
      established: established_local ? new Date(established_local).toISOString() : ''
    }
    console.log(this.login);
    if (this.editMode) {
      this.loginService.updateLogin(this.id, this.login);
    } else {
      this.loginService.addLogin(this.login);
    }
    this.dataStorageService.storeLogins();
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let username = '';
    let password = '';
    let comments = '';
    let established = '';

    if (this.editMode) {
      const login = this.loginService.getLogin(this.id);
      username = login.username;
      password = login.password;
      comments = login.comments;
      established = login.established;
    }

    this.loginForm = this.fb.group({
      username: new UntypedFormControl(username, Validators.required),
      password: new UntypedFormControl(password, Validators.required),
      comments: new UntypedFormControl(comments, Validators.required),
      established: this.fb.group({established: new UntypedFormControl(established, Validators.required)})
    });
  }

  get established() {
    const established_local = this.loginForm.get('established.established')?.value;
    return established_local ? new Date(established_local).toISOString() : '';
  }
}
