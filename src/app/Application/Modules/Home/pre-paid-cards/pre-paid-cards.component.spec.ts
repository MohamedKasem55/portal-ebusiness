import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePaidCardsComponent } from './pre-paid-cards.component';

describe('PrePaidCardsComponent', () => {
  let component: PrePaidCardsComponent;
  let fixture: ComponentFixture<PrePaidCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrePaidCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrePaidCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
