import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { scheduleItem, staffItem } from '../interfaces/nouns';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  activeItem: scheduleItem | undefined;
  constructor(private http: HttpClient) {}

  schedule(slot: scheduleItem) {
    let obs = new Observable<boolean>((observer) => {
      this.http
        .post<boolean>('/schedule', slot, { observe: 'response' })
        .subscribe({
          next: (data) => {
            if (data.body) observer.next(data.body);
          },
          error: (err) => {
            console.log(err);
            observer.next(false);
          },
        });
    });
    return obs;
  }

  getschedule() {
    let obs = new Observable<scheduleItem[] | null>((observer) => {
      this.http
        .get<scheduleItem[]>('/api/schedule', { observe: 'response' })
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

  updateschedule(slot: scheduleItem) {
    let obs = new Observable<boolean>((observer) => {
      this.http
        .put<boolean>('/schedule', slot, { observe: 'response' })
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

  minclass() {
    let obs = new Observable<string>((observer) => {
      this.http
        .get<any>('/api/min/exb_session/time', { observe: 'response' })
        .subscribe({
          next: (data) => {
            observer.next(data.body!['MIN(time)']);
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
    return obs;
  }

  maxclass() {
    let obs = new Observable<string>((observer) => {
      this.http
        .get<any>('/api/max/exb_session/time', { observe: 'response' })
        .subscribe({
          next: (data) => {
            observer.next(data.body!['MAX(time)']);
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
    return obs;
  }
}
