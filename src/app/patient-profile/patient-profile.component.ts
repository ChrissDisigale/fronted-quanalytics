import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { PatientServiceService } from '../patient-service.service';
import { VisitDialogComponent } from '../visit-dialog/visit-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {

  patient:any = {};
  visit:any = {};
  

  constructor(private patientService: PatientServiceService, private route: ActivatedRoute,  public dialog: MatDialog,) {}

  ngOnInit(): void {
    this.loadPatientData()
    this.loadPatientVisit()
   }

   loadPatientData(){
    this.patientService.getPatientDetail(this.route.snapshot.params['id']).subscribe(
      data => {
        this.patient = data
      }
    );
   }

   loadPatientVisit(){
    this.patientService.getPatientVisit(this.route.snapshot.params['id']).subscribe(
      data => {
        this.visit = data[0]
      }
    );
   }

   visitPatient() {
    const dialogRef = this.dialog.open(VisitDialogComponent, {
      data: {
        patient: this.patient,
        action: "add",
      }
        });
     dialogRef.afterClosed().subscribe((result) => {
      if (result === 1){
         this.loadPatientData()
         this.loadPatientVisit()
      }
    });
  }
}
