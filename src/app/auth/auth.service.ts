import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, timeout } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    private timeoutInSeconds = 900;

    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string, apiKey: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apiKey, 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(
            catchError(this.handleError), 
            tap(resData => {
                this.handleAuth(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
//                    +resData.expiresIn
                    +this.timeoutInSeconds
                );
            })
        );
    }

    login(email: string, password: string, apiKey: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            timeout(this.timeoutInSeconds * 1000),
            catchError(this.handleError),
            tap(resData => {
                this.handleAuth(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    // +resData.expiresIn
                    +this.timeoutInSeconds
                );
            })
        );
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );
        const user = new User(
            email,
            userId,
            token,
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMsg = 'Unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMsg);
        }
        switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMsg = 'This email exists already';
              break;
            case 'INVALID_LOGIN_CREDENTIALS':
              errorMsg = 'The credential is invalid';
              break;  
        }
        return throwError(errorMsg);
    }
}
