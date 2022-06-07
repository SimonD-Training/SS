import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { user } from '../interfaces/nouns';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(user: user) {
    let obs = new Observable<boolean>((observer) => {
      this.http
        .post<boolean>('/login', user, { observe: 'response' })
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

  auth() {
    let obs = new Observable<boolean>((observer) => {
      this.http
        .get<boolean>('/api/session', { observe: 'response' })
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
}
