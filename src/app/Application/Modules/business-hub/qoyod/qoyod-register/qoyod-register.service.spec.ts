import { TestBed } from '@angular/core/testing';

import { QoyodRegisterService } from './qoyod-register.service';

describe('QoyodRegisterService', () => {
  let service: QoyodRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QoyodRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
