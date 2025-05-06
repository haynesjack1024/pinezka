import { Component, Input } from '@angular/core';
import { AbstractInputDirective } from '../abstract-input/abstract-input.directive';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';

@Component({
  selector: 'app-textarea',
  imports: [AsyncPipe, ReactiveFormsModule, AutosizeModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent extends AbstractInputDirective {
  @Input({ required: true }) public name!: string;
  @Input({ required: true }) public label!: string;
}
