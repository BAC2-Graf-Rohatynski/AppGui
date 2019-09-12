import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Model} from "./model";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Manufacturer} from "../manufacturer-overlay/manufacturer";
import {ModelService} from "./model.service";


@Component({
  selector: 'app-model-overlay',
  templateUrl: './model-overlay.component.html',
  styleUrls: ['./model-overlay.component.css']
})

export class ModelOverlayComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url:string = "http://localhost:8080/api/model";

  models: Model[] = [];

  model: Model = new Model();



  ngOnInit() {
    this.getModels();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['id','type', 'model', 'author', 'manufacturer', 'version', 'powerConsumption', 'ressourceConsumption', 'comment', 'actions'];
  dataSource = new MatTableDataSource<Model>(this.models);

  constructor(private http: HttpClient, private modelService: ModelService) { }

  resetInputFields(){
    this.model.id = null;
    this.model.type = '';
    this.model.model = '';
    this.model.manufacturer = '';
    this.model.author = '';
    this.model.version = '';
    this.model.powerConsumption ='';
    this.model.ressourceConsumption = '';
    this.model.comment = '';
  }

  createModel(): void{
    this.http.post(this.url, this.model).subscribe(
      res => {
        this.getModels();
        this.resetInputFields();
      },
      err =>{
        alert("An error has occured while sending Ddf data");
      }
    );
  }

  getModels() {
    this.modelService.getModels().subscribe((res : any[])=>{
      this.models = res;
      console.log(this.models);
      this.dataSource =  new MatTableDataSource<Model>(this.models);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteModel(model: Model){
    this.http.post(this.url + '/delete', model).subscribe(
      res => {
        this.getModels()
        //location.reload();
      },
      err =>{
        alert("An error has occured while sending Ddf data");
      }
    );
  }

  editModel(model: Model) {
    this.model.id = model.id;
    this.model.type = model.type;
    this.model.model = model.model;
    this.model.manufacturer = model.manufacturer;
    this.model.author = model.author;
    this.model.version = model.version;
    this.model.powerConsumption = model.powerConsumption;
    this.model.ressourceConsumption = model.ressourceConsumption;
    this.model.comment = model.comment;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  private fieldArray: Array<any> = [];
  private attribute: any = {};

}
