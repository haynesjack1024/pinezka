import { Component, Input } from '@angular/core';
import { Post } from '../models';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-post-item',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.scss',
})
export class PostItemComponent {
  @Input() public post!: Post;
}
