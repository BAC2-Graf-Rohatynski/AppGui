import { TestBed } from '@angular/core/testing';

import { DdfFileService } from './ddf-file.service';

describe('DdfFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DdfFileService = TestBed.get(DdfFileService);
    expect(service).toBeTruthy();
  });
});
