import { Component, OnInit, Renderer2 } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-color-switcher',
  imports: [FaIconComponent],
  templateUrl: './color-switcher.component.html',
  styleUrl: './color-switcher.component.scss',
})
export class ColorSwitcherComponent implements OnInit {
  private root!: Element;
  protected darkMode!: boolean;

  public constructor(private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.root = self.document.querySelector(':root') as Element;
    this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.renderer.setStyle(
      this.root,
      'color-scheme',
      this.darkMode ? 'dark' : 'light',
    );
  }

  protected toggleColorScheme(): void {
    const hasDarkMode =
      self.window.getComputedStyle(this.root).colorScheme === 'dark';
    this.renderer.setStyle(
      this.root,
      'color-scheme',
      hasDarkMode ? 'light' : 'dark',
    );
    this.darkMode = !hasDarkMode;
  }

  protected readonly faMoon = faMoon;
  protected readonly faSun = faSun;
}
