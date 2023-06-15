import { TestBed } from '@angular/core/testing';

import { ZidDashboardService } from './zid-dashboard.service';

describe('ZidDashboardService', () => {
  let service: ZidDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZidDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
