import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Post } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { PostService } from '../post.service';
import { CategoryService } from '../../categories/category.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { User } from '../../user/models';
import { selectUser } from '../../user/store/reducer';

@Component({
  selector: 'app-post-details',
  imports: [DatePipe, TranslatePipe, FaIconComponent, RouterLink, AsyncPipe],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})
export class PostDetailsComponent implements OnInit {
  protected post?: Post;
  protected category?: string[];
  protected currentUser!: Observable<User | null>;

  public constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private categoryService: CategoryService,
    private store: Store,
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

    this.currentUser = this.store.select(selectUser);
  }

  protected readonly faCaretRight = faCaretRight;
}
