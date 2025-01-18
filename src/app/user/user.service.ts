import { Injectable } from '@angular/core';
import { User, UserLoginDetails } from './models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly usersUrl: string = '/api/users/';
  private readonly loginUrl: string = '/api/login/';

  private currentUser = new BehaviorSubject<User | null>(null);

  public constructor(private httpClient: HttpClient) {}

  public getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.usersUrl}${id}/`);
  }

  public login(loginDetails: Partial<UserLoginDetails>): Observable<User> {
    return this.httpClient
      .post<User>(this.loginUrl, loginDetails)
      .pipe(tap((user) => this.currentUser.next(user)));
  }
}
