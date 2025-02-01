import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { PostService } from '../post.service';
import { CategoryService } from '../../categories/category.service';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-post-details',
  imports: [DatePipe, TranslatePipe, FaIconComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})
export class PostDetailsComponent implements OnInit {
  protected post?: Post;
  protected category?: string[];

  public constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private categoryService: CategoryService,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id) => id !== null),
        switchMap((id) => this.postService.getPost(parseInt(id))),
        tap((post) => (this.post = post)),
        switchMap((post) =>
          this.categoryService.getCategoryFullName(post.category),
        ),
        tap((category) => (this.category = category)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected readonly faCaretRight = faCaretRight;
}
