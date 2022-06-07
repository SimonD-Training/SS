import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from 'src/app/interfaces/nouns';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  warningMsg: string | null = null;
  warnlock: any;
  constructor(private userS: UserService, private router: Router) {}

  ngOnInit(): void {}

  login(form: NgForm) {
    let { email, password } = form.controls;
    this.userS
      .login({ email: email.value, password: password.value })
      .subscribe((data) => {
        if (data) {
          this.router.navigate(['/summary']);
        } else {
          this.warningMsg = "User Not Found!";
          if ( this.warnlock ) clearInterval(this.warnlock);
          this.warnlock = setInterval(() => {
            this.warningMsg = null;
          }, 3000);
        }
      });
  }
}
