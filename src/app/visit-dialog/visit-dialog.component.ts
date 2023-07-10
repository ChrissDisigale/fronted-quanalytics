import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { PatientServiceService } from "../patient-service.service"; 

import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { Patients } from "../patient"; 
import { formatDate } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-visit-dialog',
  templateUrl: './visit-dialog.component.html',
  styleUrls: ['./visit-dialog.component.scss']
})
export class VisitDialogComponent {
  action: string;
  dialogTitle: string;
  patientsForm: FormGroup;
  patient_id: any;

  weight:any;
  height:any;
  bmi:any;
  patient!: Patients;


  general_health: string[] = ['Good', 'Poor'];
  loose_weight: string[] = ['Yes', 'No'];

  constructor(
    public dialogRef: MatDialogRef<VisitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public patientsService: PatientServiceService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.patients.name;
      // this.patients = data.patients;
    } else {
      this.dialogTitle = "Patient Visit";
      this.patient_id = data.patient.id;
      // this.patients = new Patients({id: Math.random() * 1000, firstName:"",lastName:"", dob: "", gender: ""});
    }
    this.patientsForm! = this.createContactForm();
    
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      height: new FormControl(""),
      weight: new FormControl(""),
      bmi: new FormControl(""),
      date: new FormControl(""),
      general_health: new FormControl(""),
      comment: new FormControl(""),
      patientId: [this.patient_id],
    });
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.patientsService.addVisit(this.patientsForm.getRawValue());
  }

  getHeight(event: any) {
    const height = event.target.value;
    this.height = height/100;
    console.log(height);
    console.log(this.patient_id);
    // You can perform further operations with the value here
  }

  getWeight(event: any) {
    const weight = event.target.value;
    const bmi = weight/(this.height*this.height)
    this.bmi = bmi
    this.patientsForm.get('bmi')?.setValue(this.bmi);
    this.patientsForm.get('bmi')?.disable();
    console.log(weight);
    console.log(bmi);
    // You can perform further operations with the value here
  }



}
