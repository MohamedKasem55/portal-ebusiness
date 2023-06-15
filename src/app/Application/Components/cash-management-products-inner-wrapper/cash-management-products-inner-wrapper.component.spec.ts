import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashManagementProductsInnerWrapperComponent } from './cash-management-products-inner-wrapper.component';

describe('CashManagementProductsInnerWrapperComponent', () => {
  let component: CashManagementProductsInnerWrapperComponent;
  let fixture: ComponentFixture<CashManagementProductsInnerWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashManagementProductsInnerWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashManagementProductsInnerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
