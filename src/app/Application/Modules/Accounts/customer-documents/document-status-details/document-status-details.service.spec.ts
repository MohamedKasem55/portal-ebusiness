import { TestBed } from '@angular/core/testing';

import { DocumentStatusDetailsService } from './document-status-details.service';

describe('DocumentStatusDetailsService', () => {
  let service: DocumentStatusDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentStatusDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
