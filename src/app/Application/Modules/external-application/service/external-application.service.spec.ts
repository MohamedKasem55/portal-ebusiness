import { TestBed } from '@angular/core/testing';

import { ExternalApplicationService } from './external-application.service';

describe('ExternalApplicationService', () => {
  let service: ExternalApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
