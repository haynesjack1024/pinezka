import { Injectable } from '@angular/core';
import { Post } from './models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly url: string = '/api/posts/';

  public constructor(private httpClient: HttpClient) {}

  public getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.url);
  }
}
