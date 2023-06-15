import { TestBed } from '@angular/core/testing';

import { CashManagementProductsService } from './cash-management-products.service';

describe('CashManagementProductsService', () => {
  let service: CashManagementProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashManagementProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
