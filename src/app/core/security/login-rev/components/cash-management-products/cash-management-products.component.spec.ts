import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashManagementProductsComponent } from './cash-management-products.component';

describe('CashManagementProductsComponent', () => {
  let component: CashManagementProductsComponent;
  let fixture: ComponentFixture<CashManagementProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashManagementProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashManagementProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
