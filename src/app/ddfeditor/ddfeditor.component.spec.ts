import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdfeditorComponent } from './ddfeditor.component';

describe('DdfeditorComponent', () => {
  let component: DdfeditorComponent;
  let fixture: ComponentFixture<DdfeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdfeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdfeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
