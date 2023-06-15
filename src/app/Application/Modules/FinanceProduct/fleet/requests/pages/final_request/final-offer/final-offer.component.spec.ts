import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalOfferComponent } from './final-offer.component';

describe('FinalOfferComponent', () => {
  let component: FinalOfferComponent;
  let fixture: ComponentFixture<FinalOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
