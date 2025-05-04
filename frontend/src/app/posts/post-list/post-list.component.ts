import { AfterContentChecked, Component, Inject, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../models';
import { PostItemComponent } from '../post-item/post-item.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FilteringSidebarComponent } from '../filtering-sidebar/filtering-sidebar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, Observable, Subject, tap } from 'rxjs';
import { CategoryService } from '../../categories/category.service';
import { SorterComponent } from '../sorter/sorter.component';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  PaginatorComponent,
} from '../../paginator/paginator.component';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-post-list',
  imports: [
    PostItemComponent,
    SearchBarComponent,
    FilteringSidebarComponent,
    SorterComponent,
    RouterLink,
    PaginatorComponent,
    AsyncPipe,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
  providers: [
    {
      provide: DEFAULT_PAGE_SIZE,
      useValue: 10,
    },
    {
      provide: DEFAULT_PAGE_NUMBER,
      useValue: 1,
    },
  ],
})
export class PostListComponent implements OnInit, AfterContentChecked {
  protected posts$!: Observable<Post[]>;
  private totalPostCount$ = new Subject<number>();
  protected childDetailsRoute?: ActivatedRoute;

  public constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    protected route: ActivatedRoute,
    @Inject(DEFAULT_PAGE_SIZE) private defaultPageSize: number,
    @Inject(DEFAULT_PAGE_NUMBER) private defaultPageNumber: number,
  ) {}

  public ngOnInit(): void {
    this.posts$ = this.postService
      .getPosts()
      .pipe(
        this.filterPostsByCategory(),
        this.filterPostsByText(),
        this.filterPostsByCity(),
        this.filterPostsByExpiry(),
        this.sortPosts(),
        this.paginate(),
      );

    this.childDetailsRoute = this.getChildDetailsRoute(this.route);
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
    const viewsSort = (a: Post, b: Post): number => b.views - a.views;

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
            case 'views':
              posts.sort(viewsSort);
              break;
          }

          return posts;
        }),
      );
  }

  private paginate() {
    const parseParam = (param: string | null, defaultValue: number): number =>
      param !== null ? parseInt(param) : defaultValue;

    return (posts$: Observable<Post[]>): Observable<Post[]> =>
      combineLatest([
        posts$.pipe(tap((posts) => this.totalPostCount$.next(posts.length))),
        this.route.queryParamMap.pipe(
          map((params) => [
            parseParam(params.get('page-number'), this.defaultPageNumber),
            parseParam(params.get('page-size'), this.defaultPageSize),
          ]),
        ),
      ]).pipe(
        map(([posts, [pageNumber, pageSize]]) => {
          const offset = (pageNumber - 1) * pageSize;

          return posts.slice(offset, offset + pageSize);
        }),
      );
  }

  private getChildDetailsRoute(
    route?: ActivatedRoute,
  ): ActivatedRoute | undefined {
    return route?.children.find(
      (value) => value.component === PostDetailsComponent,
    );
  }

  public ngAfterContentChecked(): void {
    const currentChildDetailsRoute = this.getChildDetailsRoute(this.route);
    if (currentChildDetailsRoute !== this.childDetailsRoute) {
      this.childDetailsRoute = currentChildDetailsRoute;
    }
  }

  protected getTotalPostCount(): Observable<number> {
    return this.totalPostCount$.asObservable();
  }

  protected isDetailsRouteMatched(id: number): boolean {
    if (this.childDetailsRoute !== undefined) {
      const matchedId = this.childDetailsRoute.snapshot.paramMap.get('id');

      return matchedId !== null && parseInt(matchedId) === id;
    }

    return false;
  }
}
