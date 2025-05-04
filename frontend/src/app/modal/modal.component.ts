import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input({ required: true }) public title: string = '';
  @Input({ required: true }) public content: string = '';
  @Input({ required: true }) public confirmLabel: string = '';
  @Input({ required: true }) public cancelLabel: string = '';

  @Output() public confirmed = new EventEmitter<void>();

  @ViewChild('dialog') protected dialog!: ElementRef<HTMLDialogElement>;

  public show(): void {
    this.dialog.nativeElement.showModal();
  }

  public onConfirm(event: Event): void {
    event.preventDefault();
    this.confirmed.emit();
    this.dialog.nativeElement.close();
  }
}
