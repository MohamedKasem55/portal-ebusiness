import { TestBed } from '@angular/core/testing';

import { QoyodDashboardService } from './qoyod-dashboard.service';

describe('QoyodDashboardService', () => {
  let service: QoyodDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QoyodDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
