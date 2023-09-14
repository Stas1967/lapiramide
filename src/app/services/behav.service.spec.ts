import { TestBed } from '@angular/core/testing';

import { BehavService } from './behav.service';

describe('BehavService', () => {
  let service: BehavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BehavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
