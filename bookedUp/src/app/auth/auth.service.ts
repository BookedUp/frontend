import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthResponse} from "./model/auth-response";
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../env/env";
import {User} from "../core/model/User";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';


  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  });

  user$ = new BehaviorSubject("");
  userState = this.user$.asObservable();

  constructor(private http: HttpClient) {
    this.user$.next(this.getRole());
  }

  login(auth: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, auth, {
      headers: this.headers,
    });
  }

  logout(): Observable<string> {
    return this.http.get(environment.apiHost + 'logOut', {
      responseType: 'text',
    });
  }

  getRole(): any {
    if (this.isLoggedIn()) {
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      return helper.decodeToken(accessToken).role[0].authority;
    }
    return null;
  }

  getUsername(): any {
    if (this.isLoggedIn()) {
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      return helper.decodeToken(accessToken).username;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') != null;
  }

  setUser(): void {
    this.user$.next(this.getRole());
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/registration`, user, {
      headers: this.headers,
    });
  }

}
