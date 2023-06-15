import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationReceiptComponent } from './validation-receipt.component';

describe('ValidationReciptComponent', () => {
  let component: ValidationReceiptComponent;
  let fixture: ComponentFixture<ValidationReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
