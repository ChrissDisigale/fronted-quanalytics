import { formatDate } from "@angular/common";
export class Patients {
      id: number;
      firstName: string;
      lastName: string;
      dob: string ;
      gender: string ;

  constructor(patients:Patients) {
    {
      this.id = patients.id ;
      this.firstName = patients.firstName || "";
      this.lastName = patients.lastName || "";
      this.gender = patients.gender || "";
      this.dob = patients.dob || "";
    }
  }
  // public getRandomID(): string {
  //   const S4 = () => {
  //     return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  //   };
  //   return S4() + S4();
  // }
}
