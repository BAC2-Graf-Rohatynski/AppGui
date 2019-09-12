export class Image{
  id: number;
  imageHash: string;
  base64String: string;
  manufacturer: string;
  selected: boolean;
  tags: string[];


  constructor(){
    this.tags = [];
  }
}
