import { Injectable } from '@angular/core';
import { PostResponse, Post, PostRequest } from './models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly url: string = '/api/posts/';
  private readonly postsRefresh$ = new BehaviorSubject<void>(undefined);

  public constructor(private httpClient: HttpClient) {}

  public getPosts(): Observable<Post[]> {
    return this.postsRefresh$.pipe(
      switchMap(() => this.httpClient.get<PostResponse[]>(this.url)),
      map((posts): Post[] => posts.map((post) => this.parsePostResponse(post))),
    );
  }

  public refreshPosts(): void {
    this.postsRefresh$.next();
  }

  public getPost(id: number): Observable<Post> {
    return this.httpClient
      .get<PostResponse>(`${this.url}${id}/`)
      .pipe(map((post) => this.parsePostResponse(post)));
  }

  public addPost(post: Partial<PostRequest>): Observable<Post> {
    return this.httpClient
      .post<PostResponse>(this.url, {
        ...post,
        expiry: post.expiry ? this.setTimeToNow(post.expiry) : null,
      })
      .pipe(map((post) => this.parsePostResponse(post)));
  }

  private parsePostResponse(post: PostResponse): Post {
    return {
      ...post,
      expiry: new Date(post.expiry),
      created: new Date(post.created),
      modified: new Date(post.modified),
    };
  }

  private setTimeToNow(date: Date): Date {
    const now = dayjs();

    return dayjs(date)
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second())
      .toDate();
  }
}
