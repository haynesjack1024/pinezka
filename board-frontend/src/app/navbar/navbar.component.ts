import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
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
import { ColorSwitcherComponent } from '../color-switcher/color-switcher.component';

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
    ColorSwitcherComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('userDropdownButton', { read: ElementRef })
  protected toggleUserDropdownButton!: ElementRef;
  @ViewChild('userDropdown') private userDropdownRef!: ElementRef;

  @ViewChild('navbarItemsDropdownButton')
  protected toggleNavbarItemsDropdownButton!: ElementRef;
  @ViewChild('navbarItems') private navbarItemsRef!: ElementRef;

  private userDropdownVisibilityHandler?: DropdownVisibilityHandler;
  private navbarItemsDropdownVisibilityHandler?: DropdownVisibilityHandler;

  protected user$!: Observable<User | null>;

  public constructor(
    private store: Store,
    private renderer: Renderer2,
  ) {}

  public ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
  }

  public ngAfterViewInit(): void {
    this.userDropdownVisibilityHandler = new DropdownVisibilityHandler(
      this.renderer,
      this.toggleUserDropdownButton.nativeElement,
      this.userDropdownRef.nativeElement,
      true,
    );

    this.navbarItemsDropdownVisibilityHandler = new DropdownVisibilityHandler(
      this.renderer,
      this.toggleNavbarItemsDropdownButton.nativeElement,
      this.navbarItemsRef.nativeElement,
    );
  }

  protected onLogout(): void {
    this.store.dispatch(logout());
  }

  protected get isUserDropdownVisible(): boolean {
    if (this.userDropdownVisibilityHandler) {
      return this.userDropdownVisibilityHandler.getIsDropdownVisible();
    }

    return false;
  }

  protected get isNavbarItemsDropdownVisible(): boolean {
    if (this.navbarItemsDropdownVisibilityHandler) {
      return this.navbarItemsDropdownVisibilityHandler.getIsDropdownVisible();
    }

    return false;
  }

  public ngOnDestroy(): void {
    this.userDropdownVisibilityHandler?.cleanup();
    this.navbarItemsDropdownVisibilityHandler?.cleanup();
  }

  protected readonly faBars = faBars;
}

type RemoveListenerFn = () => void;

class DropdownVisibilityHandler {
  private isDropdownVisible: boolean = false;

  private readonly removeToggleListenerFnArray: RemoveListenerFn[] = [];
  private readonly removeHideListenerFnArray: RemoveListenerFn[] = [];

  public constructor(
    private renderer: Renderer2,
    private toggleButton: Element,
    private dropdown: Element,
    toggleOnEnter: boolean = false,
  ) {
    this.removeToggleListenerFnArray.push(
      this.renderer.listen(this.toggleButton, 'click', this.toggleDropdown),
    );

    if (toggleOnEnter) {
      this.removeToggleListenerFnArray.push(
        this.renderer.listen(
          this.toggleButton,
          'keydown.enter',
          this.toggleDropdown,
        ),
      );
    }
  }

  private toggleDropdown = (): void => {
    this.isDropdownVisible = !this.isDropdownVisible;
    if (this.isDropdownVisible) {
      this.removeHideListenerFnArray.push(
        this.renderer.listen('window', 'click', this.hideDropdownOnClick),
        this.renderer.listen('window', 'keydown.esc', this.hideDropdown),
      );
    } else {
      this.removeHideListeners();
    }
  };

  private hideDropdownOnClick = (event: Event): void => {
    if (
      !(event.target instanceof Element) ||
      ![this.dropdown, ...this.getWithAllChildren(this.toggleButton)].includes(
        event.target,
      )
    ) {
      this.hideDropdown();
    }
  };

  private getWithAllChildren(element: Element): Element[] {
    const allChildren: Element[] = [element];
    const elementStack: Element[] = [element];

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

  private hideDropdown = (): void => {
    this.isDropdownVisible = false;
    this.removeHideListeners();
  };

  private removeToggleListeners(): void {
    this.removeListeners(this.removeToggleListenerFnArray);
  }

  private removeHideListeners(): void {
    this.removeListeners(this.removeHideListenerFnArray);
  }

  private removeListeners(removeListenersArray: RemoveListenerFn[]): void {
    do {
      const removeListener = removeListenersArray.pop();
      if (removeListener !== undefined) {
        removeListener();
      }
    } while (removeListenersArray.length);
  }

  public getIsDropdownVisible(): boolean {
    return this.isDropdownVisible;
  }

  public cleanup(): void {
    this.removeToggleListeners();
    this.removeHideListeners();
  }
}
