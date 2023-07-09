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

@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.scss"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  patientsForm: FormGroup;
  patients!: Patients;


  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public patientsService: PatientServiceService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.patients.name;
      this.patients = data.patients;
    } else {
      this.dialogTitle = "New Patient";
      this.patients = new Patients({id: Math.random() * 1000, firstName:"",lastName:"", dob: "", gender: ""});
    }
    this.patientsForm = this.createContactForm();
  }
  formControl = new FormControl("", [
    Validators.required,
    // Validators.email,
  ]);
  // getErrorMessage() {
  //   return this.formControl.hasError("required")
  //     ? "Required field"
  //     : this.formControl.hasError("email")
  //     ? "Not a valid email"
  //     : "";
  // }
  createContactForm(): FormGroup {
    return this.fb.group({
      id: [this.patients.id],
      firstName: [this.patients.firstName],
      lastName: [this.patients.lastName],
      gender: [this.patients.gender],
      dob: [this.patients.dob],
    });
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.patientsService.addPatient(this.patientsForm.getRawValue());
  }
}
