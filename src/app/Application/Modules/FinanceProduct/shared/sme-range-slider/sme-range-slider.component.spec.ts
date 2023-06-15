import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeRangeSliderComponent } from 'app/Application/Modules/FinanceProduct/shared/sme-range-slider/sme-range-slider.component';

describe('SmeRangeSliderComponent', () => {
  let component: SmeRangeSliderComponent;
  let fixture: ComponentFixture<SmeRangeSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeRangeSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
