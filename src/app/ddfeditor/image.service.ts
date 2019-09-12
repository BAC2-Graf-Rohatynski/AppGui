import { Injectable } from '@angular/core'
import {HttpClient} from "@angular/common/http";
import {Image} from "./image";
@Injectable()
export class ImageService {
  baseUrl:string = "http://localhost:8080/api/image";

  constructor(private http: HttpClient) { }


  /**
  getImages() {
    return this.allImages = Imagesdelatils.slice(0);
  }

  getImage(id: number) {
    return Imagesdelatils.slice(0).find(Images => Images.id == id)
  }
*/
  getImages(){
    return this.http.get(this.baseUrl + '/getAll');
  }

}
