import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Model} from "../model-overlay/model";
import {Ddf} from "./ddf";

@Injectable({
  providedIn: 'root'
})
export class DdfFileService {

  baseUrl:string = "http://localhost:8080/api/ddf";

  constructor(private http: HttpClient) { }

  findDevice(device: Ddf): Ddf{
    let url = this.baseUrl+"/findDevice";
    let ddf;
    console.log("viewmodel" + JSON.stringify(device));
    this.http.post(url, device).subscribe(
      res => {
        ddf = res;
      },
      err =>{
        alert("An error has occured while sending Ddf data");
      }
    );

    return ddf;
  }

  getDevices(){
    return this.http.get(this.baseUrl + '/getAll');

  }


}
