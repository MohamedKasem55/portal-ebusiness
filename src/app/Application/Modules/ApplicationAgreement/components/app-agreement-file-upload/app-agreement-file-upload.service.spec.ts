import { TestBed } from '@angular/core/testing';

import { AppAgreementFileUploadService } from './app-agreement-file-upload.service';

describe('AppAgreementFileUploadService', () => {
  let service: AppAgreementFileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppAgreementFileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
