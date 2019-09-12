import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerOverlayComponent } from './manufacturer-overlay.component';

describe('ManufacturerOverlayComponent', () => {
  let component: ManufacturerOverlayComponent;
  let fixture: ComponentFixture<ManufacturerOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
