import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly url = '/api/post-categories/';

  public constructor(private http: HttpClient) {}

  public getTopmostCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  public getCategory(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}${categoryId}/`);
  }
}
