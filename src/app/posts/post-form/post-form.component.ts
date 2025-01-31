import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CitySelectComponent } from '../../cities/city-select/city-select.component';
import { CategorySelectComponent } from '../../categories/category-select/category-select.component';
import { TextareaComponent } from '../../forms/textarea/textarea.component';
import { PostService } from '../post.service';
import { TranslatedToastrService } from '../../translated-toastr.service';
import { _ } from '@ngx-translate/core';
import { ExpiryInputComponent } from '../../forms/expiry-input/expiry-input.component';

@Component({
  selector: 'app-post-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    CitySelectComponent,
    CategorySelectComponent,
    TextareaComponent,
    ExpiryInputComponent,
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

  public constructor(
    private postService: PostService,
    private translatedToastr: TranslatedToastrService,
  ) {}

  public ngOnInit(): void {
    this.formGroup.statusChanges.subscribe((v) => console.log(v));
  }

  protected onSubmit(): void {
    this.postService.addPost(this.formGroup.value).subscribe({
      next: () => {
        this.postService.refreshPosts();
        this.formGroup.reset();
        this.formGroup.markAsUntouched();
        this.translatedToastr.show(_('post.add-success'), 'success');
      },
      error: () => {
        this.translatedToastr.show(_('post.add-failure'), 'error');
        this.formGroup.markAllAsTouched();
      },
    });
  }
}
