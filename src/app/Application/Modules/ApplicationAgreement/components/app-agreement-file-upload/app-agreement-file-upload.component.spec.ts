import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAgreementFileUploadComponent } from './app-agreement-file-upload.component';

describe('AppAgreementFileUploadComponent', () => {
  let component: AppAgreementFileUploadComponent;
  let fixture: ComponentFixture<AppAgreementFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAgreementFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAgreementFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
