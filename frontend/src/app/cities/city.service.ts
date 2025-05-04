import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { City } from './models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private readonly url = '/api/cities/';
  private readonly cities$: BehaviorSubject<City[]> = new BehaviorSubject<
    City[]
  >([]);

  public constructor(private http: HttpClient) {
    this.http
      .get<City[]>(this.url)
      .pipe(takeUntilDestroyed())
      .subscribe((cities) => this.cities$.next(cities));
  }

  public getCities(): Observable<City[]> {
    return this.cities$;
  }
}
