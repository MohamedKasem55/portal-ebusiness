import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAgreementComponent } from './app-agreement.component';

describe('AppAgreementComponent', () => {
  let component: AppAgreementComponent;
  let fixture: ComponentFixture<AppAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
