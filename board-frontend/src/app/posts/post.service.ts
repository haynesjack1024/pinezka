import { Injectable } from '@angular/core';
import { PostResponse, Post, PostRequest } from './models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly url: string = '/api/posts/';
  private readonly postsRefresh$ = new BehaviorSubject<void>(undefined);

  public constructor(private http: HttpClient) {}

  public getPosts(): Observable<Post[]> {
    return this.postsRefresh$.pipe(
      switchMap(() => this.http.get<PostResponse[]>(this.url)),
      map((posts): Post[] => posts.map((post) => this.parsePostResponse(post))),
    );
  }

  public refreshPosts(): void {
    this.postsRefresh$.next();
  }

  public getPost(id: number): Observable<Post> {
    return this.http
      .get<PostResponse>(`${this.url}${id}/`)
      .pipe(map((post) => this.parsePostResponse(post)));
  }

  public addPost(post: Partial<PostRequest>): Observable<Post> {
    return this.http
      .post<PostResponse>(this.url, post)
      .pipe(map((post) => this.parsePostResponse(post)));
  }

  public updatePost(id: number, post: Partial<PostRequest>): Observable<Post> {
    return this.http
      .patch<PostResponse>(`${this.url}${id}/`, post)
      .pipe(map((post) => this.parsePostResponse(post)));
  }

  public deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}/`);
  }

  private parsePostResponse(post: PostResponse): Post {
    return {
      ...post,
      expiry: new Date(post.expiry),
      created: new Date(post.created),
      modified: new Date(post.modified),
    };
  }
}
