/* 
 *  Helperbit: a p2p donation platform (crowdsurance)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user.model';


export interface AuthStatus {
	status: 'ok' | 'none';
	username?: string;
}

export interface AuthLoginData {
	user: string;
	password: string;
	language?: string;
}

export interface AuthLogin {
	token: string;
	username: string;
	email: string;
	usertype: string;
	policyversion: {
		current: { terms: number; privacy: number };
		accepted: { terms: number; privacy: number };
	};
}

export interface ChangePasswordData {
	token?: string;
	oldpassword?: string;
	newpassword: string;
}

export interface AuthSignupData {
	email: string;
	username: string;
	password: string;
	newsletter: boolean;
	refby?: string;
	language?: string;
	terms: boolean;
	usertype: string;
	subtype?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

	login(loginData: AuthLoginData): Observable<AuthLogin> {
		return this.http.post<AuthLogin>(environment.helperbitApi + '/login', loginData);
	}

	activate(email: string, token: string): Observable<void> {
		return this.http.post<void>(environment.helperbitApi + '/auth/activate', { email: email, token: token });
  }

	resendActivation(email: string): Observable<void> {
		return this.http.post<void>(environment.helperbitApi + '/auth/activate/resend', { email: email });
	}

	logout(): Observable<void> {
    // localStorage.removeItem('currentUser');
		return this.http.post<void>(environment.helperbitApi + '/logout', {},
			{ headers: { ignoreLoadingBar: String(true) } });
  }
  
	signup(signupData: AuthSignupData): Observable<void> {
		return this.http.post<void>(environment.helperbitApi + '/signup', signupData);
	}

	changePassword(changeData: ChangePasswordData): Observable<void> {
		return this.http.post<void>(environment.helperbitApi + '/auth/change', changeData);
	}

	resetPassword(email: string): Observable<void> {
		return this.http.post<void>(environment.helperbitApi + '/auth/reset', { email: email });
	}
}
