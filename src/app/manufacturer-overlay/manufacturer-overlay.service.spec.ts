import { TestBed } from '@angular/core/testing';

import { ManufacturerOverlayService } from './manufacturer-overlay-service.service';

describe('ManufacturerOverlayServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManufacturerOverlayService = TestBed.get(ManufacturerOverlayService);
    expect(service).toBeTruthy();
  });
});
