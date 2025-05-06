import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  imports: [TranslatePipe],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
})
export class BackButtonComponent {
  public constructor(private location: Location) {}

  protected goBack(): void {
    this.location.back();
  }
}
