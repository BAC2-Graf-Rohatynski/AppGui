import {Component, OnInit, Output} from '@angular/core';
import {SidenavService} from "../sidenav.service";
import{DdfeditorComponent} from "../ddfeditor/ddfeditor.component";
import {ManufacturerOverlayService} from "../manufacturer-overlay/manufacturer-overlay-service.service";
import {ManufacturerOverlayRef} from "../manufacturer-overlay/manufacturer-overlay-ref";
import {ModelOverlayService} from "../model-overlay/model-overlay-service.service";
import {ModelOverlayRef} from "../model-overlay/model-overlay-ref";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  title = "ISC Dummy Titel"


  ngOnInit() {
  }

  constructor(private sidenav: SidenavService) {

  }
  toggleActive:boolean = false;

  toggleSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenav.toggle();

    console.log('Clicked');
  }


}
