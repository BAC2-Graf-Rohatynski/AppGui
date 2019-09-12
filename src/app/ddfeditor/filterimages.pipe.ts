import { Pipe, PipeTransform } from '@angular/core';
import {Image} from "./image";

@Pipe({
  name: 'filterimages'
})
export class FilterimagesPipe implements PipeTransform {
  transform(items: Image[], image: string): any {
    if(image === 'all'){ return items } else
      return items.filter(item =>{
        return item.imageHash === image;
      });
  }

}
