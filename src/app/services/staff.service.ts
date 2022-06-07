import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { staffItem } from '../interfaces/nouns';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  constructor(private http: HttpClient) {}

  hire(staff: staffItem) {
    let obs = new Observable<boolean>((observer) => {
      this.http
        .post<boolean>('/staff', staff, { observe: 'response' })
        .subscribe({
          next: (data) => {
            observer.next(data.body!);
          },
          error: (err) => {
            console.log(err);
            observer.next(false);
          },
        });
    });
    return obs;
  }

  getStaff() {
    let obs = new Observable<staffItem[] | null>((observer) => {
      this.http
        .get<staffItem[]>('/api/staff', { observe: 'response' })
        .subscribe({
          next: (data) => {
            observer.next(data.body!);
          },
          error: (err) => {
            console.log(err);
            observer.next(null);
          },
        });
    });
    return obs;
  }

  updatestaff(staff: staffItem) {
    let obs = new Observable<boolean>((observer) => {
      this.http
        .put<boolean>('/staff', staff, { observe: 'response' })
        .subscribe({
          next: (data) => {
            observer.next(data.body!);
          },
          error: (err) => {
            console.log(err);
            observer.next(false);
          },
        });
    });
    return obs;
  }

  countTeachers() {
    let obs = new Observable<number>((observer) => {
      this.http
        .get<any>('/api/count/exb_teacher/teacher', { observe: 'response' })
        .subscribe({
          next: (data) => {
            observer.next(data.body!['COUNT(teacher)']);
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
    return obs;
  }
}
