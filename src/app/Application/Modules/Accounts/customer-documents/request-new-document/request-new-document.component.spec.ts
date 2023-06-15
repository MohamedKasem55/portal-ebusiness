import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNewDocumentComponent } from './request-new-document.component';

describe('RequestNewDocumentComponent', () => {
  let component: RequestNewDocumentComponent;
  let fixture: ComponentFixture<RequestNewDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestNewDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestNewDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
