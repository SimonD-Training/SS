import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SummaryComponent } from './components/summary/summary.component';
import { TeachersComponent } from './components/teachers/teachers.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "summary", component: SummaryComponent},
  {path: "teachers", component: TeachersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
