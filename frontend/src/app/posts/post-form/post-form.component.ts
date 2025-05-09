import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CitySelectComponent } from '../../cities/city-select/city-select.component';
import { CategorySelectComponent } from '../../categories/category-select/category-select.component';
import { TextareaComponent } from '../../forms/textarea/textarea.component';
import { PostService } from '../post.service';
import { TranslatedToastrService } from '../../translated-toastr.service';
import { _ } from '@ngx-translate/core';
import { ExpiryInputComponent } from '../expiry/expiry-input/expiry-input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  filter,
  finalize,
  firstValueFrom,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BackButtonComponent } from '../../back-button/back-button.component';

@Component({
  selector: 'app-post-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    CitySelectComponent,
    CategorySelectComponent,
    TextareaComponent,
    ExpiryInputComponent,
    AsyncPipe,
    BackButtonComponent,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent implements OnInit {
  protected readonly formGroup = new FormGroup({
    city: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    category: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    title: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(130)],
      nonNullable: true,
    }),
    content: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    expiry: new FormControl<Date | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  private id = new BehaviorSubject<number | null>(null);
  protected submitLabel = this.id.pipe(
    switchMap((id) =>
      this.translate.stream(
        id !== null ? _('form.label.save-edit-post') : _('form.label.add-post'),
      ),
    ),
  );

  public constructor(
    private postService: PostService,
    private translatedToastr: TranslatedToastrService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id) => id !== null),
        switchMap((id) => this.postService.getPost(parseInt(id))),
        tap(({ id, created, modified, author, ...rest }) => {
          this.id.next(id);
          this.formGroup.setValue(rest);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected async onSubmit(): Promise<void> {
    const id = await firstValueFrom(this.id);

    (id !== null
      ? this.postService.updatePost(id, this.formGroup.value).pipe(
          tap(() => {
            this.router.navigate(['posts', id], {
              queryParamsHandling: 'preserve',
            });
            this.translatedToastr.show(_('post.edit-success'), 'success');
          }),
          catchError((err) => {
            this.translatedToastr.show(_('post.edit-failure'), 'error');
            throw err;
          }),
        )
      : this.postService.addPost(this.formGroup.value).pipe(
          tap(() => {
            this.formGroup.reset();
            this.formGroup.markAsUntouched();
            this.translatedToastr.show(_('post.add-success'), 'success');
          }),
          catchError((err) => {
            this.translatedToastr.show(_('post.add-failure'), 'error');
            throw err;
          }),
        )
    )
      .pipe(
        catchError(() => {
          this.formGroup.markAllAsTouched();

          return EMPTY;
        }),
        finalize(() => this.postService.refreshPosts()),
      )
      .subscribe();
  }
}
