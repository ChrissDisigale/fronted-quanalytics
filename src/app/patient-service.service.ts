import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from "rxjs";
import { Patients } from './patient'; 
import { HttpClient, HttpHeaders,HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";

@Injectable({
  providedIn: 'root'
})
export class PatientServiceService extends UnsubscribeOnDestroyAdapter 
{
 // private readonly API_URL = "assets/data/farmers.json";
 isTblLoading = true;
 dataChange: BehaviorSubject<Patients[]> = new BehaviorSubject<Patients[]>([]);
 // Temporarily stores data from dialogs
 dialogData: any;

 private baseURL = "http://localhost:8080/api/v1/patients";
 private baseURL2 = "http://localhost:8080/api/v1/visits";



//  httpOptions = {
//      headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` })
//    };

 constructor(private httpClient: HttpClient) {
   super();
 }
 get data(): Patients[] {
   return this.dataChange.value;
 }

 getDialogData() {
   return this.dialogData;
 }
 /** CRUD METHODS */
 getAllPatients(): Observable<Patients[]> {
   this.subs.sink = this.httpClient.get<Patients[]>(`${this.baseURL}`).subscribe(
     (data) => {
       this.isTblLoading = false;
       this.dataChange.next(data);
     },
     (error: HttpErrorResponse) => {
       this.isTblLoading = false;
       console.log(error.name + " " + error.message);
     }
   );
   return this.dataChange;
 }

 addPatient(patient: any): Observable<any> {
  this.dialogData = patient;

  this.httpClient.post<any>(`${this.baseURL}`,patient).subscribe(data => {
    this.dialogData = patient;
    },
    (err: HttpErrorResponse) => {
   // error code here
  });
  return this.dataChange;
}

updatePatient(patient: any, id:number): Observable<any> {
  this.dialogData = patient;

  this.httpClient.put<any>(`${this.baseURL}/${id}`,patient).subscribe(data => {
    this.dialogData = patient;
    },
    (err: HttpErrorResponse) => {
   // error code here
  });
  return this.dataChange;
}

addVisit(visit: any): Observable<any> {
  this.dialogData = visit;

  this.httpClient.post<any>(`${this.baseURL2}`,visit).subscribe(data => {
    this.dialogData = visit;
    },
    (err: HttpErrorResponse) => {
   // error code here
  });
  return this.dataChange;
}

getPatientVisit(id:number) : Observable<any>{
  return this.httpClient.get<any>(`${this.baseURL2}/${id}`);
}

getPatientDetail(id:number) : Observable<any>{
  return this.httpClient.get<any>(`${this.baseURL}/${id}`);
}
  
}