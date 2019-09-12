import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Manufacturer} from "../manufacturer-overlay/manufacturer";
import {Slave} from "./slave";

@Component({
  selector: 'app-configtool',
  templateUrl: './configtool.component.html',
  styleUrls: ['./configtool.component.css']
})
export class ConfigtoolComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  slaves: Slave[] = [];



  displayedColumns: string[] = ['ssid','groups', 'activeShow', 'macAddress', 'ipAddress','ddfHash' ,'imageHash'
  ,'status', 'type','device' ,'manufacturer','universe','hls','dmxChannels','dmxStart',
    'dmxEnd','udpPort','rotating','positionX','positionY','positionZ','rotationX','rotationY',
    'rotationZ','accelerationX','accelerationY','accelerationZ','ddfID'];
  dataSource = new MatTableDataSource<Slave>(this.slaves);


  constructor() { }

  ngOnInit() {
  }

}
