import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFinanceManagementComponent } from './business-finance-management.component';

describe('BusinessFinanceManagmentComponent', () => {
  let component: BusinessFinanceManagementComponent;
  let fixture: ComponentFixture<BusinessFinanceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessFinanceManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFinanceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
