import { TestBed } from '@angular/core/testing';

import { ZidRegisterService } from './zid-register.service';

describe('ZidRegisterService', () => {
  let service: ZidRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZidRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
