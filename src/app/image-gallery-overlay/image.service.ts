import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseUrl:string = "http://localhost:8080/api/image";

  constructor(private http: HttpClient) { }

  getImages(){
    return this.http.get(this.baseUrl + '/getAll');

  }

}
