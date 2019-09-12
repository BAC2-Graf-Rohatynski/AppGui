import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdfEditorFunctionsComponent } from './ddf-editor-functions.component';

describe('DdfEditorFunctionsComponent', () => {
  let component: DdfEditorFunctionsComponent;
  let fixture: ComponentFixture<DdfEditorFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdfEditorFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdfEditorFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
