import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentStatusDetailsComponent } from './document-status-details.component';

describe('DocumentStatusDetailsComponent', () => {
  let component: DocumentStatusDetailsComponent;
  let fixture: ComponentFixture<DocumentStatusDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentStatusDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentStatusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
