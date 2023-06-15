import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferAcceptanceCallComponent } from './offer-acceptance-call.component';

describe('OfferAcceptanceCallComponent', () => {
  let component: OfferAcceptanceCallComponent;
  let fixture: ComponentFixture<OfferAcceptanceCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferAcceptanceCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferAcceptanceCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
