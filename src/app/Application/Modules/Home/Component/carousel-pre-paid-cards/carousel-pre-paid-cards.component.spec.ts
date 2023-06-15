import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselPrePaidCardsComponent } from './carousel-pre-paid-cards.component';

describe('CarouselPrePaidCardsComponent', () => {
  let component: CarouselPrePaidCardsComponent;
  let fixture: ComponentFixture<CarouselPrePaidCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselPrePaidCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselPrePaidCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
