import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs';

export type ToastType = 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class TranslatedToastrService {
  public constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {}

  public show(key: string, type: ToastType): void {
    // create toast of provided type
    const toast = (() => {
      switch (type) {
        case 'success':
          return this.toastr.success();
        case 'error':
          return this.toastr.error();
        default:
          throw new Error(
            'TranslatedToastrService: invalid toast type passed to show.',
          );
      }
    })();

    // set the toast's message to the translation
    const translationSub = this.translate
      .stream(key)
      .subscribe(
        (message: unknown) =>
          (toast.toastRef.componentInstance.message = message),
      );
    // close translation subscription on toast's destruction
    toast.onHidden.pipe(first()).subscribe(() => translationSub.unsubscribe());
  }
}
