import { Injectable } from '@angular/core';
import { User, UserLoginDetails, UserPatchRequest } from './models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly checkSessionUrl: string = '/api/check-session/';
  private readonly loginUrl: string = '/api/login/';
  private readonly logoutUrl: string = '/api/logout/';
  private readonly usersUrl: string = '/api/users/';

  private currentUser = new BehaviorSubject<User | null>(null);

  public constructor(private httpClient: HttpClient) {}

  public getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.usersUrl}${id}/`);
  }

  public checkSession(): Observable<User> {
    return this.httpClient.get<User>(this.checkSessionUrl);
  }

  public login(loginDetails: Partial<UserLoginDetails>): Observable<User> {
    return this.httpClient
      .post<User>(this.loginUrl, loginDetails)
      .pipe(tap((user) => this.currentUser.next(user)));
  }

  public logout(): Observable<void> {
    return this.httpClient.post<void>(this.logoutUrl, null);
  }

  public patchUser({
    id,
    ...user
  }: Partial<UserPatchRequest>): Observable<User> {
    return this.httpClient.patch<User>(`${this.usersUrl}${id}/`, user);
  }
}
