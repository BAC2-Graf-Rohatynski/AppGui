import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.css']
})
export class DevComponent implements OnInit {

  constructor() { }

  url: string = "http://localhost:8080/CommandGetAllSlaves"

   getUrl(): string{
    return this.url;
  }

  ngOnInit() {
  }

}
