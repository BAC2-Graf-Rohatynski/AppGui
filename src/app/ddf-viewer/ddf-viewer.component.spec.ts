import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdfViewerComponent } from './ddf-viewer.component';

describe('DdfViewerComponent', () => {
  let component: DdfViewerComponent;
  let fixture: ComponentFixture<DdfViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdfViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
