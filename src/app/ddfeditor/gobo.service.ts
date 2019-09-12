import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GoboService {

  baseUrl:string = "http://localhost:8080/api/gobo";

  constructor(private http: HttpClient) { }

  getGobos(){
    return this.http.get(this.baseUrl + '/getAll');
  }
}
