import { Injectable } from '@angular/core';
import { ApiPost, Post } from './models';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly url: string = '/api/posts/';

  public constructor(private httpClient: HttpClient) {}

  public getPosts(): Observable<Post[]> {
    return this.httpClient.get<ApiPost[]>(this.url).pipe(
      map((posts): Post[] =>
        posts.map((post) => ({
          ...post,
          expiry: new Date(post.expiry),
          created: new Date(post.created),
          modified: new Date(post.modified),
        })),
      ),
    );
  }
}
