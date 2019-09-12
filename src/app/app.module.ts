import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import {
  DdfeditorComponent,
  DdfSelectDialog,
  GoboCreatorDialog, ImageGalleryDialog, ManufacturerCreatorDialog,
  ModelCreatorDialog
} from './ddfeditor/ddfeditor.component';
import { ConfigtoolComponent } from './configtool/configtool.component';
import { Router, RouterModule, Routes} from "@angular/router";
import { NotfoundComponent } from './notfound/notfound.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DdfEditorContentComponent, ImageSelectDialog} from './ddf-editor-content/ddf-editor-content.component';
import { HttpClientModule } from '@angular/common/http';
import { UploadComponent } from './upload/upload.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { DdfEditorFunctionsComponent } from './ddf-editor-functions/ddf-editor-functions.component';
import { LayoutModule } from '@angular/cdk/layout';
import {A11yModule} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { FooterComponent } from './footer/footer.component';
import {SidenavService} from "./sidenav.service";
import { DevComponent } from './dev/dev.component';
import { LicenseComponent } from './license/license.component';
import { LicenseContentComponent } from './license-content/license-content.component';
import { ManufacturerOverlayComponent } from './manufacturer-overlay/manufacturer-overlay.component';
import { OverlayModule } from '@angular/cdk/overlay'
import {ManufacturerOverlayService} from "./manufacturer-overlay/manufacturer-overlay-service.service";
import { ModelOverlayComponent } from './model-overlay/model-overlay.component';
import {ModelOverlayService} from "./model-overlay/model-overlay-service.service";
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ImageGalleryOverlayComponent } from './image-gallery-overlay/image-gallery-overlay.component';
import {ImageGalleryOverlayService} from "./image-gallery-overlay/image-gallery-overlay.service";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import { NgxGalleryModule } from 'ngx-gallery';
import { DdfViewerComponent } from './ddf-viewer/ddf-viewer.component';
import {ParallelHasher} from "ts-md5/dist/parallel_hasher";
import { Md5 } from 'ts-md5/dist/md5';
import {Md5FileHasher} from "ts-md5/dist/md5_file_hasher";
import {MatSnackBar} from '@angular/material/snack-bar';
import { FilterimagesPipe } from './ddfeditor/filterimages.pipe';
import {ImageService} from "./ddfeditor/image.service";
import * as _ from 'lodash';
const routes: Routes = [
  { path: 'editor', component: DdfeditorComponent },
  { path: 'configtool', component: ConfigtoolComponent },
  { path: 'dev', component: DevComponent },
  { path: 'license', component: LicenseComponent },
  { path: '', component: DdfeditorComponent, pathMatch: 'full'},
  { path: '**', component: NotfoundComponent }
]

@NgModule({
  exports: [
    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTreeModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableModule,
    MatSnackBarModule
  ],
  declarations: [
    AppComponent,
    NavigationComponent,
    DdfeditorComponent,
    ConfigtoolComponent,
    NotfoundComponent,
    DdfEditorContentComponent,
    UploadComponent,
    DdfEditorFunctionsComponent,
    FooterComponent,
    DevComponent,
    LicenseComponent,
    LicenseContentComponent,
    ManufacturerOverlayComponent,
    ModelOverlayComponent,
    ImageGalleryOverlayComponent,
    DdfViewerComponent,
    DdfSelectDialog,
    ModelCreatorDialog,
    GoboCreatorDialog,
    ManufacturerCreatorDialog,
    ImageSelectDialog,
    ImageGalleryDialog,
    FilterimagesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {enableTracing:true}),
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatMenuModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    NgMaterialMultilevelMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule,
    MDBBootstrapModule.forRoot(),
    NgxGalleryModule,
    MatDialogModule,
    MatChipsModule

  ],
  providers: [
    SidenavService,
    ManufacturerOverlayService,
    ModelOverlayService,
    ImageGalleryOverlayService,
    ImageService,
    FilterimagesPipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    ManufacturerOverlayComponent,
    ModelOverlayComponent,
    ImageGalleryOverlayComponent,
    DdfSelectDialog,
    ModelCreatorDialog,
    GoboCreatorDialog,
    ManufacturerCreatorDialog,
    ImageSelectDialog,
    ImageGalleryDialog,
    UploadComponent
  ]
})
export class AppModule {}
