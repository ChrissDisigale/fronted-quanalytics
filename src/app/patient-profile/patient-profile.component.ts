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
  

  constructor(private patientService: PatientServiceService, private route: ActivatedRoute,  public dialog: MatDialog,) {}

  ngOnInit(): void {
    this.patientService.getPatientDetail(this.route.snapshot.params['id']).subscribe(
      data => {
        this.patient = data
      }
    );
    console.log(this.patient)
   }

   visitPatient() {
    const dialogRef = this.dialog.open(VisitDialogComponent, {
      data: {
        // patients: this.patients,
        action: "add",
      }
        });
     dialogRef.afterClosed().subscribe((result) => {

    });
  }
}
