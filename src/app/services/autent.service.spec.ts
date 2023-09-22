import { TestBed } from '@angular/core/testing';

import { AutentService } from './autent.service';

describe('AutentService', () => {
  let service: AutentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
