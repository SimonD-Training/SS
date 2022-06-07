import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { scheduleItem, staffItem } from 'src/app/interfaces/nouns';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StaffService } from 'src/app/services/staff.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  Schedule: scheduleItem[] = [];
  Teachers: staffItem[] = [];
  warningMsg: string | null = null;
  warnlock: any;
  constructor(
    private scheduleS: ScheduleService,
    private staffS: StaffService,
    private userS: UserService,
    private router: Router
  ) {
    userS.auth().subscribe((data) => {
      if (!data) router.navigate(['']);
      else {
        scheduleS.getschedule().subscribe((data) => {
          if (data) this.Schedule = data;
          else this.Schedule = [];
        });
        staffS.getStaff().subscribe((data) => {
          if (data) this.Teachers = data;
          else this.Teachers = [];
        });
      }
    });
  }

  ngOnInit(): void {}
  schedule(form: NgForm) {
    let { classroom, time, day, teacher, subject } = form.controls;
    this.scheduleS
      .schedule({
        class: classroom.value,
        time: time.value,
        day: day.value,
        teacher: teacher.value,
        subject: subject.value,
      })
      .subscribe((data) => {
        if (data) {
          form.reset();
          this.scheduleS.getschedule().subscribe((data2) => {
            if (data2) this.Schedule = data2;
            else this.Schedule = [];
          });
        } else {
          this.warningMsg = 'Schedules Overlap!';
          if (this.warnlock) clearInterval(this.warnlock);
          this.warnlock = setInterval(() => {
            this.warningMsg = null;
          }, 3000);
        }
      });
  }
  edit(item: scheduleItem) {
    this.scheduleS.updateschedule(item).subscribe((data) => {
      if (data) {
        this.scheduleS.getschedule().subscribe((data2) => {
          if (data2) this.Schedule = data2;
          else this.Schedule = [];
        });
      } else {
        this.warningMsg = 'Invalid Changes!';
        if (this.warnlock) clearInterval(this.warnlock);
        this.warnlock = setInterval(() => {
          this.warningMsg = null;
        }, 3000);
      }
    });
  }
}
