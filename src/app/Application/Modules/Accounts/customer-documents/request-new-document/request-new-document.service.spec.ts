import { TestBed } from '@angular/core/testing';

import { RequestNewDocumentService } from './request-new-document.service';

describe('RequestNewDocumentService', () => {
  let service: RequestNewDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestNewDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
