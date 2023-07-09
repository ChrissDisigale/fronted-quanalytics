import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';

const routes: Routes = [
  {
    path: "patient-list",
    component: PatientListComponent
  },
  {
    path: "patient-profile/:id",
    component: PatientProfileComponent
  },
  {
    path: "",
    component: PatientListComponent
  },
  {
    path: "**", component: PatientListComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
