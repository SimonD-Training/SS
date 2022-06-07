import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { staffItem, user } from 'src/app/interfaces/nouns';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StaffService } from 'src/app/services/staff.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
})
export class TeachersComponent implements OnInit {
  Teachers: staffItem[] = [];
  Stats = {
    teachers: 0,
    early: '',
    late: '',
  };
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
        staffS.getStaff().subscribe((data) => {
          if (data) this.Teachers = data;
          else this.Teachers = [];
        });
        staffS.countTeachers().subscribe((data) => {
          this.Stats.teachers = data;
        });
        scheduleS.minclass().subscribe((data) => {
          this.Stats.early = data;
        });
        scheduleS.maxclass().subscribe((data) => {
          this.Stats.late = data;
        });
      }
    });
  }

  ngOnInit(): void {}
  hire(form: NgForm) {
    let { teacher, subject, room } = form.controls;
    this.staffS
      .hire({
        id: 0,
        teacher: teacher.value,
        subject: subject.value,
        class: room.value,
      })
      .subscribe((data) => {
        if (data) {
          form.reset();
          this.staffS.getStaff().subscribe((data) => {
            if (data) this.Teachers = data;
            else this.Teachers = [];
          });
          this.staffS.countTeachers().subscribe((data) => {
            this.Stats.teachers = data;
          });
          this.scheduleS.minclass().subscribe((data) => {
            this.Stats.early = data;
          });
          this.scheduleS.maxclass().subscribe((data) => {
            this.Stats.late = data;
          });
        } else {
          this.warningMsg = 'Teacher Already Hired!';
          if (this.warnlock) clearInterval(this.warnlock);
          this.warnlock = setInterval(() => {
            this.warningMsg = null;
          }, 3000);
        }
      });
  }
  edit(staff: staffItem) {
    this.staffS.updatestaff(staff).subscribe((data) => {
      if (data) {
        this.staffS.getStaff().subscribe((data) => {
          if (data) this.Teachers = data;
          else this.Teachers = [];
        });
        this.staffS.countTeachers().subscribe((data) => {
          this.Stats.teachers = data;
        });
        this.scheduleS.minclass().subscribe((data) => {
          this.Stats.early = data;
        });
        this.scheduleS.maxclass().subscribe((data) => {
          this.Stats.late = data;
        });
      } else {
        this.warningMsg = 'Teacher Already Hired!';
        if (this.warnlock) clearInterval(this.warnlock);
        this.warnlock = setInterval(() => {
          this.warningMsg = null;
        }, 3000);
      }
    });
  }
}
