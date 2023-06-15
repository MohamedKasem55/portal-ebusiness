import { TestBed } from '@angular/core/testing';

import { AccountVerifyDetailsService } from './account-verify-details.service';

describe('AccountVerifyDetailsService', () => {
  let service: AccountVerifyDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountVerifyDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
