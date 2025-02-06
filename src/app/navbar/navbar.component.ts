import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../user/store/actions';
import { Observable } from 'rxjs';
import { User } from '../user/models';
import { selectUser } from '../user/store/reducer';
import { AsyncPipe, NgClass, UpperCasePipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-navbar',
  imports: [
    TranslatePipe,
    RouterOutlet,
    AsyncPipe,
    FaIconComponent,
    UpperCasePipe,
    ChipComponent,
    TranslatePipe,
    UpperCasePipe,
    RouterLink,
    NgClass,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  protected showNavbarDropdown: boolean = false;
  @ViewChild('navbarItemsDropdownButton')
  protected toggleNavbarItemsDropdownButton!: ElementRef;
  @ViewChild('navbarItems')
  protected navbarItems!: ElementRef;

  protected user$!: Observable<User | null>;

  public constructor(
    private store: Store,
    private renderer: Renderer2,
  ) {}

  public ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
    this.renderer.listen('window', 'click', this.hideNavbarItemsDropdown);
    this.renderer.listen(
      'window',
      'keydown.enter',
      this.hideNavbarItemsDropdown,
    );
  }

  protected onLogout(): void {
    this.store.dispatch(logout());
  }

  protected toggleNavbarItemsDropdown(): void {
    this.showNavbarDropdown = !this.showNavbarDropdown;
  }

  private hideNavbarItemsDropdown = (event: Event): void => {
    if (
      ![
        this.navbarItems.nativeElement,
        this.toggleNavbarItemsDropdownButton.nativeElement,
        ...this.getAllChildren(this.toggleNavbarItemsDropdownButton),
      ].includes(event.target)
    ) {
      this.showNavbarDropdown = false;
    }
  };

  private getAllChildren(element: ElementRef<Element>): Element[] {
    const allChildren: Element[] = [];
    const elementStack: Element[] = [element.nativeElement];

    while (elementStack.length) {
      const currentElement = elementStack.pop();
      const currentElementChildren = Array.from(currentElement?.children ?? []);
      const internals = currentElementChildren.filter(
        (child) => child.children.length,
      );

      allChildren.push(...currentElementChildren);
      elementStack.push(...internals);
    }

    return allChildren;
  }

  protected readonly faBars = faBars;
}
