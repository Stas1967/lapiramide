import { TestBed } from '@angular/core/testing';

import { NuserGuard } from './nuser.guard';

describe('NuserGuard', () => {
  let guard: NuserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NuserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
