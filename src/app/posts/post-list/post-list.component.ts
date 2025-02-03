import { Component, DestroyRef, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../models';
import { PostItemComponent } from '../post-item/post-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FilteringSidebarComponent } from '../filtering-sidebar/filtering-sidebar.component';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { CategoryService } from '../../categories/category.service';
import { SorterComponent } from '../sorter/sorter.component';
import { PaginatorComponent } from '../../paginator/paginator.component';

@Component({
  selector: 'app-post-list',
  imports: [
    PostItemComponent,
    SearchBarComponent,
    FilteringSidebarComponent,
    SorterComponent,
    RouterOutlet,
    RouterLink,
    PaginatorComponent,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit {
  protected posts: Post[] = [];

  public constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.postService
      .getPosts()
      .pipe(
        this.filterPostsByCategory(),
        this.filterPostsByText(),
        this.filterPostsByCity(),
        this.filterPostsByExpiry(),
        this.sortPosts(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((posts) => (this.posts = posts));
  }

  private filterPostsByCategory() {
    return (posts$: Observable<Post[]>): Observable<Post[]> =>
      combineLatest([
        posts$,
        this.categoryService
          .getCurrentCategory()
          .pipe(
            map((category) =>
              category.id ? [category.id, ...(category.children ?? [])] : [],
            ),
          ),
      ]).pipe(
        map(([posts, categoryIds]) =>
          categoryIds.length
            ? posts.filter((post) => categoryIds.includes(post.category))
            : posts,
        ),
      );
  }

  private filterPostsByText() {
    const predicate =
      (search: string[]) =>
      (post: Post): boolean =>
        [post.author.username, post.author.email, post.title, post.content]
          .map((data) => data.toLowerCase())
          .some((data) => search.every((token) => data.includes(token)));

    return (posts$: Observable<Post[]>): Observable<Post[]> =>
      combineLatest([
        posts$,
        this.route.queryParamMap.pipe(
          map((params) =>
            (params.get('search') ?? '').toLowerCase().split(' '),
          ),
        ),
      ]).pipe(
        map(([posts, search]) =>
          search.length ? posts.filter(predicate(search)) : posts,
        ),
      );
  }

  private filterPostsByCity() {
    return (posts$: Observable<Post[]>): Observable<Post[]> =>
      combineLatest([
        posts$,
        this.route.queryParamMap.pipe(map((params) => params.get('city'))),
      ]).pipe(
        map(([posts, city]) =>
          city ? posts.filter((post) => post.city === city) : posts,
        ),
      );
  }

  private filterPostsByExpiry() {
    return (posts$: Observable<Post[]>): Observable<Post[]> =>
      combineLatest([
        posts$,
        this.route.queryParamMap.pipe(
          map((params) => params.get('expired') === 'true'),
        ),
      ]).pipe(
        map(([posts, expired]) =>
          posts.filter((post) => new Date() > post.expiry === expired),
        ),
      );
  }

  private sortPosts() {
    const alphaSort = (a: Post, b: Post): number =>
      a.title.localeCompare(b.title);
    const modifiedSort = (a: Post, b: Post): number =>
      b.modified.valueOf() - a.modified.valueOf();

    return (posts$: Observable<Post[]>): Observable<Post[]> =>
      combineLatest([
        posts$,
        this.route.queryParamMap.pipe(map((params) => params.get('sorting'))),
      ]).pipe(
        map(([posts, sorting]) => {
          switch (sorting) {
            case 'alpha':
              posts.sort(alphaSort);
              break;
            case 'modified':
              posts.sort(modifiedSort);
              break;
          }

          return posts;
        }),
      );
  }
}
