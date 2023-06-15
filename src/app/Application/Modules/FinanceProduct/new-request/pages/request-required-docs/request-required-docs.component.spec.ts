import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRequiredDocsComponent } from './request-required-docs.component';

describe('RequestRequiredDocsComponent', () => {
  let component: RequestRequiredDocsComponent;
  let fixture: ComponentFixture<RequestRequiredDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestRequiredDocsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRequiredDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
