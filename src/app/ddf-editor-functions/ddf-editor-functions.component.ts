import { Component, OnInit } from '@angular/core';
import { Function } from "../functions";
import {FormControl} from "@angular/forms";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


interface TableData {
  from: Date;
  to: Date;
}

@Component({
  selector: 'app-ddf-editor-functions',
  templateUrl: './ddf-editor-functions.component.html',
  styleUrls: ['./ddf-editor-functions.component.css']
})
export class DdfEditorFunctionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  selected = '';

  functions = new FormControl();
  functionList: string[] = ['Shutter', 'Strobe', 'Focus', 'Zoom'];

  private fieldArray: Array<any> = [];
  private newAttribute: any = {};

  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

}
