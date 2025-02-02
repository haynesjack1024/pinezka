import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../user/store/actions';
import { Observable } from 'rxjs';
import { User } from '../user/models';
import { selectUser } from '../user/store/reducer';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ChipComponent } from '../chip/chip.component';
import {
  faRectangleList,
  faSquarePlus,
} from '@fortawesome/free-regular-svg-icons';

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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  protected user$!: Observable<User | null>;
  protected showUserDropdown: boolean = false;

  public constructor(private store: Store) {}

  public ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
  }

  protected onLogout(): void {
    this.store.dispatch(logout());
  }

  protected onBarsClick(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  protected readonly faBars = faBars;
  protected readonly faSquarePlus = faSquarePlus;
  protected readonly faRectangleList = faRectangleList;
}
