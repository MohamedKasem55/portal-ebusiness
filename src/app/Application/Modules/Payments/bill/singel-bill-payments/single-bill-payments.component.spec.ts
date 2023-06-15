import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBillPaymentsComponent } from './single-bill-payments.component';

describe('SingleBillPaymentsComponent', () => {
  let component: SingleBillPaymentsComponent;
  let fixture: ComponentFixture<SingleBillPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBillPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleBillPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
