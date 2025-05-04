import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { AbstractInputDirective } from '../abstract-input/abstract-input.directive';

@Component({
  selector: 'app-input',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent extends AbstractInputDirective {
  @Input() public type: string = 'text';
  @Input({ required: true }) public name!: string;
  @Input({ required: true }) public label!: string;
}
