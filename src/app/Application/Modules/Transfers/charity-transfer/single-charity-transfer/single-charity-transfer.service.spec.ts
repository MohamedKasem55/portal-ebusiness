import { TestBed } from '@angular/core/testing';

import { SingleCharityTransferService } from './single-charity-transfer.service';

describe('SingleCharityTransferService', () => {
  let service: SingleCharityTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleCharityTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
