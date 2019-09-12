import {ChangeDetectorRef, Component, Inject, OnChanges, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSnackBar, MatSort} from "@angular/material";
import {ImageService} from "../ddfeditor/image.service";
import {HttpClient} from "@angular/common/http";
import {ManufacturerService} from "../manufacturer-overlay/manufacturer.service";
import {Image} from "../ddfeditor/image";
import {Manufacturer} from "../manufacturer-overlay/manufacturer";
import {delay} from "rxjs/operators";
import {ParallelHasher} from "ts-md5/dist/parallel_hasher";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/typings/chips";
import {Tag} from "./tag";

export interface UploadData{
  editImage: Image;
}


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnChanges {

  constructor(
    public dialogRef: MatDialogRef<UploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UploadData,
    private imageService: ImageService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private manufacturerService: ManufacturerService,
    private cd: ChangeDetectorRef) {
    this.initEditableImage();


      console.log(this.allImages);
  }

  initEditableImage() {
    if (this.data.editImage) {
      this.imageToHandle = this.data.editImage;
      if (this.imageToHandle.tags)
        for (let tag of this.imageToHandle.tags) {
          this.addExistingTags(tag);
        }
      }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url: string = "http://localhost:8080/api/image";

  message: string;
  action: string = "Close";

  //Hash prüfen im Backend
  allImages: Image[] = [];
  manufacturers: Manufacturer[] = [];
  selectedManufacturer: Manufacturer = new Manufacturer();
  imageUrlFirst: string = "data:image/";
  imageUrlSecond: string = ";base64,";

  async ngOnInit() {
    delay(5000);
    this.getManufacturers();
  }

  async getManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((res: any[]) => {
      this.manufacturers = res;
      console.log(this.manufacturers);
    });
  }

  ngOnChanges() {
  }

  imageFile;
  imageToHandle: Image = new Image();

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      this.createBinaryImageData();
      this.hashImage()
    }
  }

  hashImage() {
    let hasher = new ParallelHasher('assets/md5_worker.js');
    hasher.hash(this.imageFile).then(res => this.imageToHandle.imageHash = res);
  }

  createBinaryImageData() {
    let reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.imageFile);
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.imageToHandle.base64String = btoa(binaryString);  // Converting binary string data.
  }

  saveUploadedImage(): void {
    if (!this.imageToHandle.base64String || !this.imageToHandle.imageHash) {
      this.message = "Please Upload a File";
      console.log(this.imageToHandle);
      this.openSnackBar(this.message, this.action);
      return;
    } else if (this.checkImageExistence()) {
      console.log(this.imageToHandle);
      return;
    } else{
      this.http.post(this.url, this.imageToHandle).subscribe(
        res => {
          console.log("Sending image to Server....")
          console.log(this.imageToHandle);
          if (this.imageToHandle.id == null) {
            this.message = "image created";
            this.openSnackBar(this.message, this.action);
          } else {
            this.message = "Image with ID " + this.imageToHandle.id + " saved";
            this.openSnackBar(this.message, this.action);
          }
          this.imageToHandle = new Image();
          //location.reload();
        },
        err => {
          alert("An error has occured while sending Ddf data");
        }
      )
    }
  }

  checkImageExistence(): boolean{
    for(let image of this.allImages){
      if(this.imageToHandle.imageHash === image.imageHash){
        this.message = "Images already exists";
        this.openSnackBar(this.message,this.action);
        return true;
      }
    }
    return false;
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getFileExtension(base64String: string) {
    let data: string;
    if (base64String) {
      data = base64String.substring(0, 5);
    } else {
      return '';
    }

    switch (data.toUpperCase()) {
      case "IVBOR":
        console.log("png");
        return "png";
      case "/9J/4":
        console.log("png");
        return "jpg";
      default:
        return '';
    }
  }

  selected: boolean = false;
  clickEvent(image: Image){
    image.selected = !image.selected;
  }


  addTag(newTag: string){
    if(this.imageToHandle){
      if(newTag){
        for(let tag of this.imageToHandle.tags){
          if(newTag == tag){
            this.message = "tag already exists";
            this.openSnackBar(this.message, this.action);
            return;
          }
        }
        this.imageToHandle.tags.push(newTag);
      }
    }
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [
  ];

  addExistingTags(tag: string): void {
    //add tag
    if (tag) {
      this.tags.push({name: tag});
    }

  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    //add tag
    if ((value || '').trim()) {
      this.tags.push({name: value.trim()});
     this.addTag(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.imageToHandle.tags.splice(index,1);
    }
  }

   submit(){

  }

}
