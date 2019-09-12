import { TestBed } from '@angular/core/testing';

import { ImageGalleryOverlayService } from './image-gallery-overlay.service';

describe('ImageGalleryOverlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageGalleryOverlayService = TestBed.get(ImageGalleryOverlayService);
    expect(service).toBeTruthy();
  });
});
