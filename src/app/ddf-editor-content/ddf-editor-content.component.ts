import {AfterViewInit, Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl } from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSelect,
  MatSnackBar,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import {Manufacturer} from "../manufacturer-overlay/manufacturer";
import {ManufacturerService} from "../manufacturer-overlay/manufacturer.service";
import {ManufacturerOverlayRef} from "../manufacturer-overlay/manufacturer-overlay-ref";
import {ModelOverlayRef} from "../model-overlay/model-overlay-ref";
import {ManufacturerOverlayService} from "../manufacturer-overlay/manufacturer-overlay-service.service";
import {ModelOverlayService} from "../model-overlay/model-overlay-service.service";
import {ReplaySubject, Subject} from "rxjs";
import {delay, take, takeUntil} from "rxjs/operators";
import {Model} from "../model-overlay/model";
import {ModelService} from "../model-overlay/model.service";
import {ImageOverlayRef} from "../image-gallery-overlay/image-overlay-ref";
import {ImageGalleryOverlayService} from "../image-gallery-overlay/image-gallery-overlay.service";
import {Ddf, DeviceType, Effect} from "./ddf";
import {MatOption} from "@angular/material/typings/esm5/core";
import {group} from "@angular/animations";
import {DeviceTypeService} from "./device-type.service";
import {ParallelHasher} from "ts-md5/dist/parallel_hasher";
import {DdfSelectDialog, ImageGalleryDialog} from "../ddfeditor/ddfeditor.component";
import {ImageService} from "../image-gallery-overlay/image.service";
import {NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery";
import {GoboService} from "../ddfeditor/gobo.service";
import {Gobo} from "../ddfeditor/gobo";
import {Color} from "./color";
import {Image} from "../ddfeditor/image";
import {DdfFileService} from "./ddf-file.service";


@Component({
  selector: 'app-ddf-editor-content',
  templateUrl: './ddf-editor-content.component.html',
  styleUrls: ['./ddf-editor-content.component.css'],
})
export class DdfEditorContentComponent implements OnInit, AfterViewInit, OnDestroy {

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedDeviceType: DeviceType;
  @Input() selectedManufacturer: Manufacturer;
  @Input() selectedModel: Model;
  @Input() selectedStandardDevice: string;

  numbers: number[] = [];

  /**
   * table
   */

  /**
  displayedColumns: string[] = ['group','subgroup', 'dmx', 'mode', 'dmxVal',
    'dmxMin', 'dmxMax', 'realVal',  'valID', 'realMin', 'realMax', 'unit',
    'hlVal', 'hlValSpot', 'speed', 'energyVal', 'fuelVal', 'actions'];
   */

  displayedColumns: string[] = ['group','subgroup', 'dmx', 'mode', 'dmxVal',
     'realVal', 'goboVal', 'color', 'unit', 'speed', 'hlVal', 'hlValSpot',  'energyVal', 'fuelVal', 'actions'];

  units: String[] = ['bpm','rpm','Hz','%', 'degree'];

  effects: Effect[] = [];
  datasource = new MatTableDataSource<Effect>(this.effects);


  /**
   * Device Types -> später in die DB
   */
  //public filteredDeviceTypes = this.deviceTypes.slice();
  protected deviceTypes: DeviceType[] = [];
  /** control for the selected manufacturer */
  public deviceTypeCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public filteredDeviceTypeCtrl: FormControl = new FormControl();
  /** list of manufacturers filtered by search keyword */
  public filteredDeviceTypes: ReplaySubject<DeviceType[]> = new ReplaySubject<DeviceType[]>(1);
  @ViewChild('deviceTypeSelect') deviceTypeSelect: MatSelect;

  /**
   * Manufacturers and Manfacturer Fiter
   */

  /** list of manufacturers */
  protected manufacturers: Manufacturer[] = [];
  /** control for the selected manufacturer */
  public manufacturerCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public filteredManufacturerCtrl: FormControl = new FormControl();
  /** list of manufacturers filtered by search keyword */
  public filteredManufacturers: ReplaySubject<Manufacturer[]> = new ReplaySubject<Manufacturer[]>(1);
  @ViewChild('manufacturerSelect') manufacturerSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /**
   * Model and Model Fiter
   */

  /** list of models */
  protected models: Model[] = [];
  /** control for the selected model */
  public modelCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public filteredModelCtrl: FormControl = new FormControl();
  /** list of model filtered by search keyword */
  public filteredModels: ReplaySubject<Model[]> = new ReplaySubject<Model[]>(1);
  @ViewChild('modelSelect') modelSelect: MatSelect;

  /** list of gobos */
  protected gobos: Gobo[] = [];

  /**list of colors */
  protected colors: Color[] = [];

  /**
   * ViewModel
   */
  ddfViewModel: Ddf = {
    version: 0,
    type: '',
    category: '',
    manufacturer: '',
    imageHash: '',
    model: '',
    author: '',
    createDate: '',
    powerConsumption: '',
    ressourceConsumption: '',
    comment: '',
    power: '',
    dmxUsedSum: 0,
    standardDevice: '',
    dmxSum: 0,
    panTiltInvert: true,
    effects: null
  };

/**
  setType(event){

    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    }
    console.log(this.ddfViewModel);
    this.selectedDeviceType = selectedData.value;
    console.log(this.selectedDeviceType);


    this.initSelection();
    this.emptyTable();
  }

  setModel(event){
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    }
    this.ddfViewModel.type = selectedData.value.name;
  }

  setManufacturer(event){
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    }
    this.ddfViewModel.type = selectedData.value.name;
  }
*/

  setEffects(){
    this.ddfViewModel.effects = this.effects;
    console.log(this.datasource);
  }

  constructor(private http: HttpClient,
              private manufacturerService: ManufacturerService,
              private modelService: ModelService,
              private goboService: GoboService,
              private deviceTypeService: DeviceTypeService,
              private previewDialog: ManufacturerOverlayService,
              private modelDialog: ModelOverlayService,
              private imageDialog: ImageGalleryOverlayService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              public ddfFileService: DdfFileService) {
    this.deviceTypes = deviceTypeService.deviceTypes;
    this.deviceTypeCtrl.setValue(this.deviceTypes);
    this.filteredDeviceTypes.next(this.deviceTypes.slice());
    //this.selectedDeviceType = this.deviceTypes[0];
  }

  async initSelection(){
    this.ddfViewModel.type = this.selectedDeviceType.name;
    this.ddfViewModel.manufacturer = this.selectedManufacturer.name;
    this.ddfViewModel.model = this.selectedModel.model;
    this.ddfViewModel.standardDevice = this.selectedStandardDevice;
    this.ddfViewModel.effects = this.effects;
    this.ddfViewModel.version++;
    //let ddf: Ddf = this.checkDdfExistence(this.ddfViewModel);
    console.log(this.selectedModel);
    console.log(this.ddfViewModel.model);
  }

  ngOnInit() {
    this.initSelection();
    this.getManufacturers();
    this.getModels();
    this.getGobos();
    // listen for search field value changes
    /*
    this.filteredManufacturerCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterManufacturers();
      });

    this.filteredModelCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterModels();
      });

    this.filteredDeviceTypeCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDeviceTypes();
      });

     */
    this.addElement();
    this.effects[0].mainGroup = this.selectedDeviceType.groups.keys().next().value;

    for(let i = 1; i < 128; i++){
      this.numbers.push(i);
    }
  }

  ngAfterViewInit() {
    //this.setInitialManufacturerValue();
    //this.setInitialModelValue();
    //this.setInitialDeviceTypeValue();
    this.datasource.sort = this.sort;
    //this.datasource.paginator = this.paginator;

    //add first Element to init table
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }

  async checkDdfExistence(ddf: Ddf){
    let device = await this.ddfFileService.findDevice(ddf);
    return device;
  }

  createDDF(): void{
    let url = "http://localhost:8080/api/ddf";
    console.log("viewmodel" + JSON.stringify(this.ddfViewModel));
    this.checkAllTypes();
    this.http.post(url, this.ddfViewModel).subscribe(
      res => {
      },
      err =>{
        alert("An error has occured while sending Ddf data");
      }
    );
  }

   /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialDeviceTypeValue() {
    this.filteredManufacturers
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.deviceTypeSelect.compareWith = (a: DeviceType, b: DeviceType) => a && b && a.name === b.name;
      });
  }

  protected filterDeviceTypes() {
    if (!this.deviceTypes) {
      return;
    }
    // get the search keyword
    let search = this.filteredDeviceTypeCtrl.value;
    if (!search) {
      this.filteredDeviceTypes.next(this.deviceTypes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredDeviceTypes.next(
      this.deviceTypes.filter(deviceType => deviceType.name.toLowerCase().indexOf(search) > -1)
    );
  }

  async getManufacturers() {
    await this.manufacturerService.getManufacturers().subscribe((res : any[])=>{
      this.manufacturers = res;
      console.log(this.manufacturers)
    });

    // set initial selection
    this.manufacturerCtrl.setValue(this.manufacturers);

    // load the initial bank list
    this.filteredManufacturers.next(this.manufacturers.slice());
  }

  async manufacturerClick(){
    await this.getManufacturers();
    if(this.selectedDeviceType == null){
      this.openSnackBar("Select Device Type first");
    }
  }


  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialManufacturerValue() {
    this.filteredManufacturers
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.manufacturerSelect.compareWith = (a: Manufacturer, b: Manufacturer) => a && b && a.id === b.id;
      });
  }

  protected filterManufacturers() {
    if (!this.manufacturers) {
      return;
    }
    // get the search keyword
    let search = this.filteredManufacturerCtrl.value;
    if (!search) {
      this.filteredManufacturers.next(this.manufacturers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredManufacturers.next(
      this.manufacturers.filter(manufacturer => manufacturer.name.toLowerCase().indexOf(search) > -1)
    );
  }

  async  getModels() {
    this.modelService.getModels().subscribe((res : any[])=>{
      this.models = res;
      console.log(this.models)
    });

    // set initial selection
    this.modelCtrl.setValue(this.models);

    // load the initial bank list
    this.filteredModels.next(this.models.slice());
  }

  async modelClick(){
    await this.getModels();
    if(this.ddfViewModel.model == null || this.ddfViewModel.model == ''){
      this.openSnackBar("Select Manufacturer first");
    }
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialModelValue() {
    this.filteredModels
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.modelSelect.compareWith = (a: Model, b: Model) => a && b && a.id === b.id;
      });
  }

  protected filterModels() {
    if (!this.models) {
      return;
    }
    // get the search keyword
    let search = this.filteredModelCtrl.value;
    if (!search) {
      this.filteredModels.next(this.models.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredModels.next(
      this.models.filter(model => model.model.toLowerCase().indexOf(search) > -1)
    );
  }

  /**
   * Gobos
   */

  async  getGobos() {
    this.goboService.getGobos().subscribe((res : any[])=>{
      this.gobos = res;
      console.log(this.gobos)
    });
  }

  /**
   * Table Functions
   */

  addElement(){
    let funObj = new Effect();
    this.effects.push(funObj);
    this.datasource =  new MatTableDataSource<Effect>(this.effects);
    //this.datasource.paginator = this.paginator;
    console.log(this.datasource);
  }


  deleteElement(fun: Effect){
    const index = this.effects.indexOf(fun);
    if(index == 0){
      this.openSnackBar("First Element cannot be deleted.");
    }else{
      this.effects.splice(index, 1);
      this.datasource =  new MatTableDataSource<Effect>(this.effects);
      //this.datasource.paginator = this.paginator;
    }
  }

  emptyTable(){

    for(let i = this.effects.length-1; i >= 0; i--){
     if(i != 0){
       this.deleteElement(this.effects[i]);
     }
    }

    this.effects[0].mainGroup = this.selectedDeviceType.groups.keys().next().value;
    this.datasource = new MatTableDataSource<Effect>(this.effects);
  }



  checkGroup(element: Effect){
    console.log(this.ddfViewModel);
    console.log(this.effects);
    console.log(this.selectedDeviceType);
    if(element.mainGroup != '' && element.mainGroup != null){
      return element.mainGroup;
      console.log(element.mainGroup);
    }
    else if(element.mainGroup == '' || element.mainGroup == null){
      for(let i = this.effects.indexOf(element) - 1; i >= 0; i--){
        if(this.effects[i].mainGroup != '' && this.effects[i].mainGroup != null){
          return this.effects[i].mainGroup;
        }
      }
    } else{
      return '';
    }
  }

  checkSubgroup(element: Effect){
    if(element.subgroup != '' && element.subgroup != null){
      return element.subgroup;
      console.log(element.subgroup);
    }
    else if(element.subgroup == '' || element.subgroup == null){
      for(let i = this.effects.indexOf(element) - 1; i >= 0; i--){
        if(this.effects[i].subgroup != '' && this.effects[i].subgroup != null){
          return this.effects[i].subgroup;
        }
      }
    } else{
      return '';
    }
  }

  checkAllTypes(){
    for(let element of this.ddfViewModel.effects){
      this.checkType(element);
    }
  }



  checkType(element: Effect){
    if(element.mode == ''){
      this.ddfViewModel.type = '';
    } else {
      for(let type of this.selectedDeviceType.stepArray){
        if(element.mode.toLowerCase() == type){
          element.type = "step";
        }
      }

      for(let type of this.selectedDeviceType.rangeArray){
        if(element.mode.toLowerCase() == type){
          element.type = "range";
        }
      }

      for(let type of this.selectedDeviceType.stepRangeArray){
        if(element.mode.toLowerCase() == type){
          element.type = "step/range";
        }
      }
    }
  }

  checkRealValue(effect: Effect){
    let message = '';
    if(Number(effect.dmxReal) === null){
      message = "Invalid value";
      effect.dmxReal = '';
      this.openSnackBar(message)
    } else if ((Number(effect.dmxReal) <= 0 && (Number(effect.dmxReal) <= 255))){
      console.log("Real value ok");
    } else if ((Number(effect.dmxReal) <= 0 && (Number(effect.dmxReal) <= 65.535))){
      console.log("Real value ok");
    }
  }

  //table filter
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
  /**
   * Overlay
   */
  showManufacturer() {
    let dialogRef: ManufacturerOverlayRef = this.previewDialog.open();
  }

  showModel() {
    let dialogRef: ModelOverlayRef = this.modelDialog.open();
  }

  showImages(){
    let dialogRef: ImageOverlayRef = this.imageDialog.open();
  }
  /**
   * Image uploader
   */

  openImageSelectDialog(): void {

    const dialogRef = this.dialog.open(ImageSelectDialog, {

      data: {
        deviceTypes: this.deviceTypeService.deviceTypes,
        manufacturers: this.manufacturers,
        models: this.models
      },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.deviceType = result['selectedDeviceType'];
    });
  }

  image: Image = new Image();
  imageUrlFirst: string = "data:image/";
  imageUrlSecond: string = ";base64,";
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
      this.image = result['image'];
      console.log(this.image);
      this.ddfViewModel.imageHash = this.image.imageHash;
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
  selector: 'image-select-dialog',
  templateUrl: 'image-select-dialog.html',
  styleUrls: ['../image-gallery-overlay/image-gallery-overlay.component.css'],
})
export class ImageSelectDialog {

  constructor(
    public dialogRef: MatDialogRef<ImageSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private imageService: ImageService, private _snackBar: MatSnackBar) {
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open('Select ' + message + ' first', action, {
      duration: 2000,
    });
  }

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  ngOnInit() {
    this.galleryOptions = [
      { width: '100%' ,"thumbnailsColumns": 3, "thumbnailsRows": 2, "thumbnailsPercent": 40, "imagePercent": 60, "thumbnailMargin": 2, "thumbnailsMargin": 2, "thumbnailsOrder": 2 },

    ];

    this.galleryImages = [
      {
        small: 'assets/car.jpg',
        medium: 'assets/car.jpg',
        big: 'assets/car.jpg'
      },

    ];
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

}
