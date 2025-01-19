import { Component, DestroyRef, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../models';
import { PostItemComponent } from '../post-item/post-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-list',
  imports: [PostItemComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit {
  protected posts: Post[] = [];

  public constructor(
    private postService: PostService,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.postService
      .getPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => (this.posts = posts));
  }
}
