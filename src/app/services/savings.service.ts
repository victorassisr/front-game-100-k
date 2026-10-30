import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environment.production';

export interface NumberEntry {
  row: number;
  number: number;
  checked: boolean;
}

export interface SavingsResponse {
  metrics: {
    totalSaved: number;
    targetTotal: number;
    progressPercentage: number;
    completedCount: number;
    remainingCount: number;
  };
  entries: NumberEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class SavingsService {
  private apiUrl = `${environment.apiUrl}/numbers`;

  constructor(private http: HttpClient) {}

  getData(): Observable<SavingsResponse> {
    const timestamp = new Date().getTime();
    return this.http.get<SavingsResponse>(`${this.apiUrl}?t=${timestamp}`).pipe(take(1));
  }

  updateStatus(number: number, checked: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${number}`, { checked }).pipe(take(1));
  }

  resetAll(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset`, {}).pipe(take(1));
  }
}