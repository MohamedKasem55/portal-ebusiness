import { TestBed } from '@angular/core/testing';

import { CommunityServicesService } from './community-services.service';

describe('CommunityServicesService', () => {
  let service: CommunityServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
