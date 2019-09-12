import { TestBed } from '@angular/core/testing';

import { GoboService } from './gobo.service';

describe('GoboService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoboService = TestBed.get(GoboService);
    expect(service).toBeTruthy();
  });
});
