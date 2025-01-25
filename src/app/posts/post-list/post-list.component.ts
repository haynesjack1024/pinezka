import { Component, DestroyRef, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../models';
import { PostItemComponent } from '../post-item/post-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBarComponent } from '../../forms/search-bar/search-bar.component';
import { FilteringSidebarComponent } from '../../forms/filtering-sidebar/filtering-sidebar.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest, map } from 'rxjs';

type PostFilteringFn = ([posts, params]: [Post[], ParamMap]) => [
  Post[],
  ParamMap,
];

@Component({
  selector: 'app-post-list',
  imports: [PostItemComponent, SearchBarComponent, FilteringSidebarComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit {
  protected posts: Post[] = [];

  public constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    combineLatest([this.postService.getPosts(), this.route.queryParamMap])
      .pipe(
        map(this.filterByCategory),
        map(this.filterByText),
        map(([posts]) => posts),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((posts) => (this.posts = posts));
  }

  private readonly filterByCategory: PostFilteringFn = ([posts, params]) => {
    const category = parseInt(params.get('category') ?? '');

    return [
      !isNaN(category)
        ? posts.filter((post) => post.category === category)
        : posts,
      params,
    ];
  };

  private readonly filterByText: PostFilteringFn = ([posts, params]) => {
    const search = (params.get('search') ?? '').toLowerCase().split(' ');

    return [
      search.length
        ? posts.filter((post) => {
            const postData = [
              post.author.username,
              post.author.email,
              post.title,
              post.content,
            ].map((data) => data.toLowerCase());

            return postData.some((data) =>
              search.every((token) => data.includes(token)),
            );
          })
        : posts,
      params,
    ];
  };
}
