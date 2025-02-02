import { Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { PostService } from '../post.service';
import { CategoryService } from '../../categories/category.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { _, TranslatePipe } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { User } from '../../user/models';
import { selectUser } from '../../user/store/reducer';
import { ModalComponent } from '../../modal/modal.component';
import { TranslatedToastrService } from '../../translated-toastr.service';

@Component({
  selector: 'app-post-details',
  imports: [
    DatePipe,
    TranslatePipe,
    FaIconComponent,
    RouterLink,
    AsyncPipe,
    ModalComponent,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})
export class PostDetailsComponent implements OnInit {
  protected post?: Post;
  protected category?: string[];
  protected currentUser!: Observable<User | null>;

  @ViewChild(ModalComponent) protected modal!: ModalComponent;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoryService: CategoryService,
    private store: Store,
    private translatedToastr: TranslatedToastrService,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => {
          const id = params.get('id');
          if (id === null) {
            throw new Error('PostDetailsComponent: No post id fragment given');
          }

          return id;
        }),
        switchMap((id) => this.postService.getPost(parseInt(id))),
        tap((post) => (this.post = post)),
        switchMap((post) =>
          this.categoryService.getCategoryFullName(post.category),
        ),
        tap((category) => (this.category = category)),
        catchError(() => {
          void this.router.navigate(['posts'], {
            queryParamsHandling: 'preserve',
          });

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.currentUser = this.store.select(selectUser);
  }

  protected onDelete(): void {
    this.modal.show();
  }

  protected onDeleteConfirm(): void {
    if (this.post?.id) {
      this.postService
        .deletePost(this.post.id)
        .pipe(finalize(() => this.postService.refreshPosts()))
        .subscribe({
          next: () => {
            void this.router.navigate(['posts'], {
              queryParamsHandling: 'preserve',
            });
            this.translatedToastr.show(_('post.delete-success'), 'success');
          },
          error: () => {
            this.translatedToastr.show(_('post.delete-failure'), 'error');
          },
        });
    }
  }

  protected readonly faCaretRight = faCaretRight;
}
