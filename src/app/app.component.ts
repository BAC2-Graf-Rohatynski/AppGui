import {Component, ViewChild} from '@angular/core';
import {SidenavService} from "./sidenav.service";
import {MatSidenav} from "@angular/material";
import {ManufacturerOverlayService} from "./manufacturer-overlay/manufacturer-overlay-service.service";
import {ManufacturerOverlayRef} from "./manufacturer-overlay/manufacturer-overlay-ref";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ISC-Dummy-Titel';

  @ViewChild('sidenav') public sidenav: MatSidenav;

  constructor(private sidenavService: SidenavService) {
  }

  ngOnInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

}


