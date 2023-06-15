import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceProductsComponent } from './finance-products.component';

describe('FinanceProductsComponent', () => {
  let component: FinanceProductsComponent;
  let fixture: ComponentFixture<FinanceProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
