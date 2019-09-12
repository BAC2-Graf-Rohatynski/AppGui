import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGalleryOverlayComponent } from './image-gallery-overlay.component';

describe('ImageGalleryOverlayComponent', () => {
  let component: ImageGalleryOverlayComponent;
  let fixture: ComponentFixture<ImageGalleryOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageGalleryOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageGalleryOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
