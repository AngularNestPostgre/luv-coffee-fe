import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { take } from 'rxjs/operators';
import { LocalStorage } from '@core/services/storage.service';

const LOCAL_STORAGE_KEY = 'anp-theme';

@Injectable({ providedIn: 'root' })
export class ThemeManagerService {
  private document = inject(DOCUMENT);
  private localStorage = inject(LocalStorage);
  private _isDarkSub = new BehaviorSubject(false);
  isDark$ = this._isDarkSub.asObservable();
  private _window = this.document.defaultView;

  constructor() {
    this.setTheme(this.getPreferredTheme());

    if (this._window !== null && this._window.matchMedia) {
      this._window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          const storedTheme = this.getStoredTheme();
          
          if (storedTheme !== 'light' && storedTheme !== 'dark') {
            this.setTheme(this.getPreferredTheme());
          }
        });
    }
  }

  private getStoredTheme = () =>
    JSON.parse(this.localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}').theme;

  private setStoredTheme = (theme: string) => {
    const meta = JSON.parse(this.localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}');
    if (meta === true ) {this.localStorage.setItem(LOCAL_STORAGE_KEY, '{}');}
    meta.theme = theme;
    this.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meta));
  };

  private getPreferredTheme = (): 'dark' | 'light' => {
    const storedTheme = this.getStoredTheme();

    if (storedTheme) {
      return storedTheme;
    }

    if (this._window !== null && this._window.matchMedia) {
      return this._window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    return 'light';
  };

  private setTheme = (theme: string) => {
    if (this._window !== null && this._window.matchMedia) {
      if (
        theme === 'auto' &&
        this._window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        this.document.documentElement.setAttribute('data-bs-theme', 'dark');
        this._isDarkSub.next(true);
      } else {
        this.document.documentElement.setAttribute('data-bs-theme', theme);
        this._isDarkSub.next(theme === 'dark');
      }
      this.setMaterialTheme();
    }
  };

  private setMaterialTheme() {
    this.isDark$.pipe(take(1)).subscribe((isDark) => {
      if (isDark) {
        const href = 'dark-theme.css';
        getLinkElementForKey('dark-theme').setAttribute('href', href);
        this.document.documentElement.classList.add('dark-theme');
      } else {
        this.removeStyle('dark-theme');
        this.document.documentElement.classList.remove('dark-theme');
      }
    });
  }

  private removeStyle(key: string) {
    const existingLinkElement = getExistingLinkElementByKey(key);
    if (existingLinkElement) {
      this.document.head.removeChild(existingLinkElement);
    }
  }

  public changeTheme(theme: string) {
    this.setStoredTheme(theme);
    this.setTheme(theme);
  }
}

function getLinkElementForKey(key: string) {
  return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string) {
  return document.head.querySelector(
    `link[rel="stylesheet"].${getClassNameForKey(key)}`
  );
}

function createLinkElementWithKey(key: string) {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', 'stylesheet');
  linkEl.classList.add(getClassNameForKey(key));
  document.head.appendChild(linkEl);
  return linkEl;
}

function getClassNameForKey(key: string) {
  return `style-manager-${key}`;
}
