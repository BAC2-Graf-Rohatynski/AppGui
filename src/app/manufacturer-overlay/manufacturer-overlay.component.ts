import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Manufacturer} from "./manufacturer";
import {ManufacturerService} from "./manufacturer.service";
import {MatPaginator, MatTableDataSource, MatSort} from "@angular/material";
import {ManufacturerOverlayService} from "./manufacturer-overlay-service.service";


@Component({
  selector: 'app-manufacturer-overlay',
  templateUrl: './manufacturer-overlay.component.html',
  styleUrls: ['./manufacturer-overlay.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class ManufacturerOverlayComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url:string = "http://localhost:8080/api/manufacturer";

  manufacturers: Manufacturer[] = [];

  model: Manufacturer = {
    id: null,
    name: ''
  };

  ngOnInit() {
    this.getManufacturers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['id','name', 'actions'];
  dataSource = new MatTableDataSource<Manufacturer>(this.manufacturers);

  constructor(private http: HttpClient, private manufacturerService: ManufacturerService) { }

  resetInputFields(){
    this.model.id = null;
    this.model.name = '';
  }

  closeManufacturer(){

  }

  createManufacturer(): void{
    this.http.post(this.url , this.model).subscribe(
      res => {
        console.log(this.model)
        this.getManufacturers();
        this.resetInputFields();
        //location.reload();
      },
      err =>{
        alert("An error has occured while sending Ddf data");
      }
    );
  }


  getManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((res : any[])=>{
      this.manufacturers = res;
      console.log("Manufacturer Array: " + this.manufacturers);
      this.dataSource =  new MatTableDataSource<Manufacturer>(this.manufacturers);
      console.log("Datasource: " + this.dataSource)
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteManufacturer(manufacturer: Manufacturer){
    this.http.post(this.url + '/delete', manufacturer).subscribe(
      res => {
        this.getManufacturers()
        //location.reload();
      },
      err =>{
        alert("An error has occured while sending Ddf data");
      }
    );
  }

  editManufacturer(manufacturer: Manufacturer){
    this.model.name = manufacturer.name;
    this.model.id = manufacturer.id;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}




