import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PatientServiceService } from "../patient-service.service";  
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Patients } from "../patient"; 
import { DataSource } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FormDialogComponent } from "../form-dialog/form-dialog.component"; 
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { EditPatientComponent } from "../edit-patient/edit-patient.component";

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    // "select",
    "id",
    "firstName",
    "lastName",
    "gender",
    "dob",
    "actions",
  ];
  exampleDatabase!: PatientServiceService | null;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Patients>(true, []);
  index!: number;
  id!: number;
  patients!: Patients | null;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public patientsService: PatientServiceService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild("filter", { static: true }) filter!: ElementRef;
  ngOnInit() {
    this.loadData();
  }
  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        patients: this.patients,
        action: "add",
      }
        });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.exampleDatabase!.dataChange.value.unshift(
          this.patientsService.getDialogData()
        );
        this.refreshTable();
        this.loadData();
        // this.showNotification(
        //   "snackbar-success",
        //   "Add Record Successfully...!!!",
        //   "bottom",
        //   "center"
        // );
      }
    });
  }

  editCall(row:any) {
    this.id = row.id;

    const dialogRef = this.dialog.open(EditPatientComponent, {
      data: {
        patients: row,
        action: "edit",
      }
      });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase!.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase!.dataChange.value[foundIndex] =
          this.patientsService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
        // this.showNotification(
        //   "black",
        //   "Edit Record Successfully...!!!",
        //   "bottom",
        //   "center"
        // );
      }
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource!.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource!.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }

  public loadData() {
    
    this.exampleDatabase = new PatientServiceService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, "keyup").subscribe(
      res => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }
  // showNotification(colorName, text, placementFrom, placementAlign) {
  //   this.snackBar.open(text, "", {
  //     duration: 2000,
  //     verticalPosition: placementFrom,
  //     horizontalPosition: placementAlign,
  //     panelClass: colorName,
  //   });
  // }
}
export class ExampleDataSource extends DataSource<Patients> {
  filterChange = new BehaviorSubject("");

  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Patients[] = [];
  renderedData: Patients[] = [];
  constructor(
    public exampleDatabase: PatientServiceService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Patients[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllPatients();
    
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((patients: Patients) => {
            const searchStr = (
              patients.firstName +
              patients.lastName +
              patients.dob +
              patients.gender
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;

      })
    );
  }
  disconnect() {}
  /** Returns a sorted copy of the database data. */
  sortData(data: Patients[]): Patients[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";
      switch (this._sort.active) {
        case "id":
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case "firstName":
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case "lastName":
          [propertyA, propertyB] = [a.lastName, b.lastName];
          break;  
        case "gender":
          [propertyA, propertyB] = [a.gender, b.gender];
          break;
        case "dob":
          [propertyA, propertyB] = [a.dob, b.dob];
          break;    
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }
}

