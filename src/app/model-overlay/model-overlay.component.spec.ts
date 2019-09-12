import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelOverlayComponent } from './model-overlay.component';

describe('ModelOverlayComponent', () => {
  let component: ModelOverlayComponent;
  let fixture: ComponentFixture<ModelOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
