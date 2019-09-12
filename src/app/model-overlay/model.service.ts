import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  baseUrl:string = "http://localhost:8080/api/model";

  constructor(private http: HttpClient) { }

  getModels(){
    return this.http.get(this.baseUrl + '/getAll');
  }
}
