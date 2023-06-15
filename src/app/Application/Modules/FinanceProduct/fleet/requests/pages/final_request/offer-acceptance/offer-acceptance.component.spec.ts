import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferAcceptanceComponent } from './offer-acceptance.component';

describe('OfferAcceptanceComponent', () => {
  let component: OfferAcceptanceComponent;
  let fixture: ComponentFixture<OfferAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferAcceptanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
