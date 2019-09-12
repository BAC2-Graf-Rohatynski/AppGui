import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {ManufacturerOverlayComponent} from "./manufacturer-overlay.component";
import {Observable} from "rxjs";
import {Manufacturer} from "./manufacturer";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  baseUrl:string = "http://localhost:8080/api/manufacturer";

  constructor(private http: HttpClient) { }

  getManufacturers(){
    return this.http.get(this.baseUrl + '/getAll');

  }
}
