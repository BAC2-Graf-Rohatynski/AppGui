import {ChangeDetectorRef, Component, Inject, OnChanges, OnInit, ViewChild} from '@angular/core';
import {SidenavService} from "../sidenav.service";
import {
  MAT_DIALOG_DATA,
  MatDialog, MatDialogRef,
  MatIcon, MatPaginator,
  MatSidenav, MatSnackBar, MatSort, MatTableDataSource,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNestedDataSource
} from "@angular/material";
import {ModelOverlayRef} from "../model-overlay/model-overlay-ref";
import {ModelOverlayService} from "../model-overlay/model-overlay-service.service";
import {FormControl} from "@angular/forms";
import {ManufacturerOverlayRef} from "../manufacturer-overlay/manufacturer-overlay-ref";
import {Manufacturer} from "../manufacturer-overlay/manufacturer";
import {Tab} from "./tab";
import {FlatTreeControl} from "@angular/cdk/tree";
import {FunctionCall} from "@angular/compiler";
import {ManufacturerOverlayService} from "../manufacturer-overlay/manufacturer-overlay-service.service";
import {DeviceTypeService} from "../ddf-editor-content/device-type.service";
import {DeviceType} from "../ddf-editor-content/ddf";
import {Model} from "../model-overlay/model";
import {ModelService} from "../model-overlay/model.service";
import {ManufacturerService} from "../manufacturer-overlay/manufacturer.service";
import {HttpClient} from "@angular/common/http";
import {GoboService} from "./gobo.service";
import {Gobo} from "./gobo";
import {ParallelHasher} from "ts-md5/dist/parallel_hasher";
import {ImageService} from "./image.service";
import {Image} from "./image";
import {delay} from "rxjs/operators";
import {UploadComponent} from "../upload/upload.component";


interface FileNode {
  name: string;
  icon?: string;
  parent?: string;
  children?: FileNode[];
}


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: string;
  parent: string;
}

@Component({
  selector: 'app-ddfeditor',
  templateUrl: './ddfeditor.component.html',
  styleUrls: ['./ddfeditor.component.css']
})
export class DdfeditorComponent implements OnInit {

  @ViewChild('sidenav') public sidenav: MatSidenav;

  TREE_DATA: FileNode[] = [
    {
      name: 'DDF File',
      children: [
        {
          name: 'New DDF',
          parent: 'File',
          icon: 'note_add'
        },
        {
          name: 'Show DDF Files',
          parent: 'File',
          icon: 'edit'
        },

      ]
    }, {
      name: 'Model',
      children: [
        {
          name: 'New',
          parent: 'Model',
          icon: 'note_add'
        },
        {
          name: 'Edit',
          parent: 'Model',
          icon: 'edit'
        },
      ]
    },
    {
      name: 'Manufacturer',
      children: [
        {
          name: 'New',
          parent: 'Manufacturer',
          icon: 'note_ad'
        },
        {
          name: 'Edit',
          parent: 'Manufacturer',
          icon: 'edit'
        },
      ]
    },
    {
      name: 'Gobos',
    },
    {
      name: 'Extras'
    }
  ];

  constructor(private sidenavService: SidenavService,
              private modelDialog: ModelOverlayService,
              private manufacturerDialog: ManufacturerOverlayService,
              public dialog: MatDialog,
              private deviceTypeService: DeviceTypeService,
              private modelService: ModelService,
              private manufacturerService: ManufacturerService,
              private _snackBar: MatSnackBar
  ) {
    this.dataSource.data = this.TREE_DATA;
    this.getModels();
    this.getManufacturers()
  }

  ngOnInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  isExpanded = true;
  showFileSubmenu: boolean = false;
  isShowing = false;
  showFileSubSubmenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  showModel() {
    let dialogRef: ModelOverlayRef = this.modelDialog.open();
  }

  models: Model[];

  async getModels() {
    this.modelService.getModels().subscribe((res: any[]) => {
      this.models = res;
      console.log(this.models)
    });
  }


  showManufacturer() {
    let dialogRef: ManufacturerOverlayRef = this.manufacturerDialog.open();
  }

  manufacturers: Manufacturer[];

  async getManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((res: any[]) => {
      this.manufacturers = res;
      console.log(this.manufacturers)
    });
  }

  /**
   *Tabs
   */

  tabs: Tab[] = [];
  textFields: string[] = [];

  selected = new FormControl(0);

  addTab(selectAfterAdding: boolean, name: string) {
    if(name){
      let tab: Tab = new Tab(name);
      this.tabs.push(tab);

      if (selectAfterAdding) {
        this.selected.setValue(this.tabs.length - 1);
      }
    }
  }

  checkIfDdfViewerExistence(){
    for(let tab of this.tabs){
      if(tab.name.toLowerCase() == "Ddf viewer"){
        return true;
      }
    }
    return false;
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  closeTab(tab: Tab) {
    var len = this.tabs.length;
    for (let i = 0; i < len; i++) {
      if (tab == this.tabs[i]) {
        this.removeTab(i);
      }
    }
  }

  /**
   *Tree menu functions
   */

  /**
   *
   * @param node
   * @param level
   */
  private transformer = (node: FileNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      parent: node.parent,
      icon: node.icon,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  treeFunctions(node: ExampleFlatNode) {
    console.log("Node: " + node.name + node.parent);
    if (node.parent == 'File') {
      if (node.name == 'New DDF') {
        this.openDdfSelectDialog();
      } else if(node.name == 'Show DDF Files'){
        if(this.checkIfDdfViewerExistence() == false){
          this.addTab(true, "DDF Viewer");
        }else{
          this.openSnackBar("DDF Viewer already open","Close");
        }
      }else {
        console.log("Sidenav Function not found");
      }
    } else if (node.parent == 'Model') {
      if (node.name == 'New') {
        this.openModelCreatorDialog()
      } else {
        console.log("Sidenav Function not found");
      }
    } else if (node.parent == 'Manufacturer') {
      if (node.name == 'New') {
        this.openManufacturerCreatorDialog();
      } else {
        console.log("Sidenav Function not found");
      }
    } else if (node.name == 'Gobos') {
      this.openGoboCreatorDialog()
    } else {
      console.log("not found");
    }
  }

  //DDF Selector Dialog
  name = '';
  deviceType: DeviceType;
  manufacturer;
  model;
  standardDevice;

  openDdfSelectDialog(): void {

    const dialogRef = this.dialog.open(DdfSelectDialog, {
      width: '500px',
      height: '500px',
      data: {
        deviceTypes: this.deviceTypeService.deviceTypes,
        manufacturers: this.manufacturers,
        models: this.models
      },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.deviceType = result['selectedDeviceType'];
      this.name = this.deviceType.name;
      this.manufacturer = result['selectedManufacturer'];
      this.model = result['selectedModel'];
      console.log("dialog model");
      console.log(this.model);
      this.standardDevice = result['selectedStandardDevice'];
      this.addTab(true, this.name);
    });
  }

  openModelCreatorDialog(): void {

    const dialogRef = this.dialog.open(ModelCreatorDialog, {
      height: '700px',
      width: '1200px',
      data: {},
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("dialog model");
    });
  }

  openManufacturerCreatorDialog(): void {

    const dialogRef = this.dialog.open(ManufacturerCreatorDialog, {
      height: '600px',
      width: '1200px',
      data: {},
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openGoboCreatorDialog(): void {
    const dialogRef = this.dialog.open(GoboCreatorDialog, {
      width: '1200px',
      height: '700px',
      data: {},
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openImageGalleryDialog(): void {

    const dialogRef = this.dialog.open(ImageGalleryDialog, {
      height: '700px',
      width: '1200px',
      data: {},
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("dialog model");
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open( message, action, {
      duration: 2000,
    });
  }

}

export interface DialogData {
  deviceTypes: DeviceType[];
  manufacturers: Manufacturer[];
  models: Model[];
  selectedDeviceType: DeviceType;
  selectedManufacturer: Manufacturer;
  selectedModel: Model;
  selectedStandardDevice: string;
}


@Component({
  selector: 'ddf-select-dialog',
  templateUrl: 'ddf-select-dialog.html',
  styleUrls: ['./ddf-select-dialog.css'],
})
export class DdfSelectDialog {

  constructor(
    public dialogRef: MatDialogRef<DdfSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private deviceTypeService: DeviceTypeService, private _snackBar: MatSnackBar) {
  }

  openManufacturerSnackbar() {
    if (this.data.selectedDeviceType == null) {
      this.openSnackBar("Device Type", 'Close')
    }
  }

  openModelSnackbar() {
    if (this.data.selectedManufacturer == null) {
      this.openSnackBar("Manufacturer", 'Close')
    }
  }

  openStandardDeviceSnackbar() {
    if (this.data.selectedDeviceType == null) {
      this.openSnackBar("Device Type", 'Close')
    }
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open('Select ' + message + ' first', action, {
      duration: 2000,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();

  }


}

/**
 * ModelDialog
 */

export interface modelDialog {
  deviceTypes: DeviceType[];
  manufacturers: Manufacturer[];
  models: Model[];
  selectedDeviceType: DeviceType;
  selectedManufacturer: Manufacturer;
  selectedModel: Model;
  selectedStandardDevice: string;
}


@Component({
  selector: 'model-creator-dialog',
  templateUrl: 'model-creator-dialog.html',
  styleUrls: ['../model-overlay/model-overlay.component.css'],
})
export class ModelCreatorDialog {

  constructor(
    public dialogRef: MatDialogRef<ModelCreatorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private modelService: ModelService, private _snackBar: MatSnackBar, private http: HttpClient) {
    this.getModels();
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url: string = "http://localhost:8080/api/model";

  models: Model[] = [];

  model: Model = new Model();

  message: string;
  action: string = "Close";


  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['id', 'type', 'model', 'author', 'manufacturer', 'version', 'powerConsumption', 'ressourceConsumption', 'comment', 'actions'];
  dataSource = new MatTableDataSource<Model>(this.models);

  resetInputFields() {
    this.model.id = null;
    this.model.type = '';
    this.model.model = '';
    this.model.manufacturer = '';
    this.model.author = '';
    this.model.version = '';
    this.model.powerConsumption = '';
    this.model.ressourceConsumption = '';
    this.model.comment = '';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  checkModelExistence() {
    for (let model of this.models) {
      if (this.model.model == model.model) {
        this.message = "Model " + model.model + " already exists";
        this.openSnackBar(this.message, this.action);
        return true;
      }
    }
    return false;
  }

  createModel(): void {
    if (this.checkModelExistence()) {
      return;
    } else {
      this.http.post(this.url, this.model).subscribe(
        res => {
          console.log(this.model);
          if (this.model.id == null) {
            this.message = "Model created";
            this.openSnackBar(this.message, this.action);
          } else {
            this.message = "Model with ID " + this.model.id + " saved";
            this.openSnackBar(this.message, this.action);
          }
          this.getModels();
          this.resetInputFields();
        },
        err => {
          alert("An error has occured while sending Ddf data");
        }
      );
    }
  }

  getModels() {
    this.modelService.getModels().subscribe((res: any[]) => {
      this.models = res;
      console.log(this.models);
      this.dataSource = new MatTableDataSource<Model>(this.models);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteModel(model: Model) {
      this.http.post(this.url + '/delete', model).subscribe(
        res => {
          this.getModels()
          this.message = "Model " + model.model + " with ID " + model.id + " deleted";
          this.openSnackBar(this.message, this.action);
          //location.reload();
        },
        err => {
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
    this.message = "Model " + model.model + " with ID " + model.id + " selected";
    this.openSnackBar(this.message, this.action);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  private fieldArray: Array<any> = [];
  private attribute: any = {};

  onNoClick(): void {
    this.dialogRef.close();

  }
}

/**
 * ManufacturerDialog
 */

export interface modelDialog {
  name: string;
  id: number;
}


@Component({
  selector: 'manufacturer-creator-dialog',
  templateUrl: 'manufacturer-creator-dialog.html',
  styleUrls: ['../model-overlay/model-overlay.component.css'],
})
export class ManufacturerCreatorDialog {

  constructor(
    public dialogRef: MatDialogRef<ManufacturerCreatorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private manufacturerService: ManufacturerService, private _snackBar: MatSnackBar, private http: HttpClient) {
    this.getManufacturers();
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url: string = "http://localhost:8080/api/manufacturer";

  manufacturers: Manufacturer[] = [];

  manufacturer: Manufacturer = new Manufacturer();

  message: string;
  action: string = "Close";

  ngOnInit() {
    this.getManufacturers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Manufacturer>(this.manufacturers);

  resetInputFields() {
    this.manufacturer.id = null;
    this.manufacturer.name = '';
  }

  closeManufacturer() {

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  checkManufacturerExistence() {
    for (let manufacturer of this.manufacturers) {
      if (this.manufacturer.name == manufacturer.name) {
        this.message = "Manufacturer " + manufacturer.name + " already exists";
        this.openSnackBar(this.message, this.action);
        return true;
      }
    }
    return false;
  }

  createManufacturer(): void {
    if (this.manufacturer.name == '' || this.manufacturer.name == null) {
      this.message = "Please specify a manufacturer name";
      this.openSnackBar(this.message, this.action);
    } else if (this.checkManufacturerExistence()) {
      return;
    } else {
      this.http.post(this.url, this.manufacturer).subscribe(
        res => {
          console.log(this.manufacturer)
          if (this.manufacturer.id == null) {
            this.message = "Manufacturer created";
            this.openSnackBar(this.message, this.action);
          } else {
            this.message = "Manufacturer " + this.manufacturer.name + " with ID " + this.manufacturer.id + " saved";
            this.openSnackBar(this.message, this.action);
          }
          this.getManufacturers();
          this.resetInputFields();
          //location.reload();
        },
        err => {
          alert("An error has occured while sending Ddf data");
        }
      );
    }
  }


  getManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((res: any[]) => {
      this.manufacturers = res;
      console.log("Manufacturer Array: " + this.manufacturers);
      this.dataSource = new MatTableDataSource<Manufacturer>(this.manufacturers);
      console.log("Datasource: " + this.dataSource)
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteManufacturer(manufacturer: Manufacturer) {
    this.http.post(this.url + '/delete', manufacturer).subscribe(
      res => {
        this.getManufacturers()
        this.message = "Manufacturer " + manufacturer.name + " with ID " + manufacturer.id + " saved";
        this.openSnackBar(this.message, this.action);
        //location.reload();
      },
      err => {
        alert("An error has occured while sending Ddf data");
      }
    );
  }

  editManufacturer(manufacturer: Manufacturer) {
    this.manufacturer.name = manufacturer.name;
    this.manufacturer.id = manufacturer.id;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}


/**
 * GoboDialog
 */

export interface GoboDialogData {
  id: number;
  color: string[];
  hexCode: string;
}


@Component({
  selector: 'gobo-creator-dialog',
  templateUrl: 'gobo-creator-dialog.html',
  styleUrls: ['../model-overlay/model-overlay.component.css'],
})
export class GoboCreatorDialog {

  constructor(
    public dialogRef: MatDialogRef<GoboCreatorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GoboDialogData, private goboService: GoboService, private _snackBar: MatSnackBar, private http: HttpClient) {
    this.getGobos();
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url: string = "http://localhost:8080/api/gobo";

  gobos: Gobo[] = [];

  gobo: Gobo = new Gobo();

  message: string;
  action: string = "Close";

  ngOnInit() {
    this.getGobos();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['id', 'color', 'hexCode', 'actions'];
  dataSource = new MatTableDataSource<Gobo>(this.gobos);

  resetInputFields() {
    this.gobo.id = null;
    this.gobo.color = '';
    this.gobo.hexCode = '';
    this.imageUrl = '';
    this.gobo.base64String = null;
  }

  closeGobos() {

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  checkGoboExistence() {
    for (let gobo of this.gobos) {
      if (this.gobo.hexCode == gobo.hexCode) {
        this.message = "Gobo with Hex Code " + gobo.hexCode + " already exists";
        this.openSnackBar(this.message, this.action);
        return true;
      }
    }
    return false;
  }


  createGobo(): void {
    if (this.gobo.color == '' || this.gobo.color == null || this.gobo.hexCode == '' || this.gobo.hexCode == null) {
      this.message = "Please specify color and hex Code";
      console.log(this.gobo);
      this.openSnackBar(this.message, this.action);
    } else if (this.checkGoboExistence()) {
      console.log(this.gobo);
      return;
    } else {
      this.http.post(this.url, this.gobo).subscribe(
        res => {
          console.log("Sending Gobo to Server....")
          console.log(this.gobo);
          if (this.gobo.id == null) {
            this.message = "Gobo created";
            this.openSnackBar(this.message, this.action);
          } else {
            this.message = "Gobo with ID " + this.gobo.id + " saved";
            this.openSnackBar(this.message, this.action);
          }
          this.getGobos();
          this.resetInputFields();
          //location.reload();
        },
        err => {
          alert("An error has occured while sending Ddf data");
        }
      )
    }
    ;
  }

  getGobos() {
    this.goboService.getGobos().subscribe((res: any[]) => {
      this.gobos = res;
      console.log("Gobo Array: " + this.gobos);
      this.dataSource = new MatTableDataSource<Gobo>(this.gobos);
      console.log("Datasource: " + this.dataSource)
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteGobo(gobo: Gobo) {
    this.http.post(this.url + '/delete', gobo).subscribe(
      res => {
        this.getGobos()
        this.message = "Gobo " + gobo.color + " with ID " + gobo.id + " deleted";
        this.openSnackBar(this.message, this.action);
      },
      err => {
        alert("An error has occured while sending Ddf data");
      }
    );
  }

  editGobo(gobo: Gobo) {
    this.gobo.color = gobo.color;
    this.gobo.id = gobo.id;
    this.gobo.hexCode = gobo.hexCode;
    this.gobo.imageHash = gobo.imageHash;
    this.gobo.base64String = gobo.base64String;
    //this.createImagePath();
    this.message = "Gobot " + gobo.color + " with ID " + gobo.id + " selected";
    this.openSnackBar(this.message, this.action);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Image uploader
   */
  public path;
  imageUrl: string;
  imageFile;

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      //this.gobo.image = this.createBinaryImageData(files);
      //this.createImagePath(files[0]);
      this.createBinaryImageData();
      this.hashImage()
    }
  }

  /**
   createImageFromBinary(base64String: string){
    var uints = new Uint8Array(base64String);
    var base64 = btoa(String.fromCharCode.apply(null, uints));
    this.imageUrl = 'data:image/jpeg;base64,' + base64;

    //decode atob()
  }
   */

  hashImage() {
    let hasher = new ParallelHasher('assets/md5_worker.js');
    hasher.hash(this.imageFile).then(res => this.gobo.imageHash = res);
  }

  createBinaryImageData() {
    let reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.imageFile);
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.gobo.base64String = btoa(binaryString);  // Converting binary string data.
  }

}


/**
 * ImageGalleryDialog
 */

export interface ImageGalleryData {
    image: Image;
}


@Component({
  selector: 'image-gallery-dialog',
  templateUrl: 'image-gallery-dialog.html',
  styleUrls: ['../model-overlay/model-overlay.component.css'],
})
export class ImageGalleryDialog implements OnChanges {

  constructor(
    public dialogRef: MatDialogRef<ImageGalleryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ImageGalleryData,
    private imageService: ImageService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private manufacturerService: ManufacturerService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog) {

    console.log(this.allImages);
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url: string = "http://localhost:8080/api/image";

  message: string;
  action: string = "Close";

  allImages: Image[] = [];
  manufacturers: Manufacturer[] = [];
  selectedManufacturer: Manufacturer = new Manufacturer();
  filterBy?: string = 'all';
  imageUrlFirst: string = "data:image/";
  imageUrlSecond: string = ";base64,";

  async ngOnInit() {
    this.getImages();
    delay(5000);
    this.getManufacturers();
    this.selectedManufacturer.name = this.filterBy;
    delay(5000);
    this.getTags();
  }

  async getManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((res: any[]) => {
      this.manufacturers = res;
      console.log(this.manufacturers);
    });
  }

  async getImages() {
    await this.imageService.getImages().subscribe((res: any[]) => {
      this.allImages = res;
      console.log(this.allImages)
      this.getFileExtension(this.allImages[0].base64String);
      this.clearSelection();
    });
  }

  clearSelection(){
    for(let image of this.allImages){
      image.selected = false;
    }
  }

  setFilterBy(filterString: string) {
    this.filterBy = filterString;
  }

  ngOnChanges() {
    this.getImages();
  }

  getTags(){
    for(let image of this.allImages){
      for(let tag of image.tags){
        if(this.tags.includes(tag)){}
        else{
          this.tags.push(tag);
        }
      }
    }
  }

  tags: string[] = [];
  filters: string[] = [];
  imageFile;
  imageToUpload: Image = new Image();

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      this.createBinaryImageData();
      this.hashImage()
    }
  }

  hashImage() {
    let hasher = new ParallelHasher('assets/md5_worker.js');
    hasher.hash(this.imageFile).then(res => this.imageToUpload.imageHash = res);
  }

  createBinaryImageData() {
    let reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.imageFile);
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.imageToUpload.base64String = btoa(binaryString);  // Converting binary string data.
  }

  saveUploadedImage(): void {
    if (!this.imageToUpload.base64String || !this.imageToUpload.imageHash) {
      this.message = "Please Upload a File";
      console.log(this.imageToUpload);
      this.openSnackBar(this.message, this.action);
      return;
    } else if (this.checkImageExistence()) {
      console.log(this.imageToUpload);
      return;
    } else{
      this.http.post(this.url, this.imageToUpload).subscribe(
        res => {
          console.log("Sending image to Server....")
          console.log(this.imageToUpload);
          if (this.imageToUpload.id == null) {
            this.message = "image created";
            this.openSnackBar(this.message, this.action);
          } else {
            this.message = "Image with ID " + this.imageToUpload.id + " saved";
            this.openSnackBar(this.message, this.action);
          }
          this.getImages();
          this.imageToUpload = new Image();
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
      if(this.imageToUpload.imageHash === image.imageHash){
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
        console.log("jpg");
        return "jpg";
      default:
        return '';
    }
  }

  selected: boolean = false;
  clickEvent(image: Image){
    image.selected = !image.selected;
  }

  async deleteImages(){
    for(let image of this.allImages){
      if(image.selected == true){
        await this.postImage(image);
      }
    }
    delay(2000);
    await this.ngOnChanges();
    delay(2000);
    this.setFilterBy(this.filterBy);
  }

  async deleteImage(image: Image){
    await this.postImage(image);
    this.message = "Image with ID " + image.id + " deleted";
    this.openSnackBar(this.message, this.action);
    delay(2000);
  }

  postImage(image: Image) {
    this.http.post(this.url + '/delete', image).subscribe(
      res => {
        this.message = "Image with ID " + image.id + " deleted";
        //this.openSnackBar(this.message, this.action);
      },
      err => {
        alert("An error has occured while sending image data");
      }
    );
  }

  editImage(image: Image): void {
    const dialogRef = this.dialog.open(UploadComponent, {
      height: '700px',
      maxWidth: '300',
      data: {
        editImage: image
      },
      position:{
        top:'100px',
        right:'0px'
      },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("dialog model");
      this.cd.detectChanges();
    });
  }

  upload(): void {
    const dialogRef = this.dialog.open(UploadComponent, {
      height: '700px',
      maxWidth: '300',
      data: {},
      position:{
        top:'95px',
        right:'0px'
      },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("dialog model");
      this.getImages();
    });
  }

  confirm(){
    if(this.checkSelection() === true){
      console.log("image dialog data");
      console.log(this.data);
      for(let selected of this.allImages){
        if (selected.selected){
          this.data.image = selected;
        }
      }
      this.dialogRef.close(this.data);
    } else{
      this.message = "please choose only one picture";
      this.openSnackBar(this.message,this.action);
    }
  }

  checkSelection(): boolean{
    let counter: number = 0;
    for(let selected of this.allImages){
      if (selected.selected){
        counter++;
      }
    }
    console.log(counter);
    if(counter == 1){
      return true;
    } else{
      return false;
    }
  }

}


/**

 var bytes = [ ... ]; // get from server
 var uints = new UInt8Array(bytes);
 var base64 = btoa(String.fromCharCode(null, uints));
 var url = 'data:image/jpeg;base64,' + base64;



 var reader = new FileReader();
 if(event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.gobo.image = file;

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imageUrl = reader.result.toString(); //add source to image
      }
    }


 private prepareSave(): any{
    let input = new FormData();
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here

    input.append('gobo', JSON.stringify(this.gobo));

    return input;

  }

 */
