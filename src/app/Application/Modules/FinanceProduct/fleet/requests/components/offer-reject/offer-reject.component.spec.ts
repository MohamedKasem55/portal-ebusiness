import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRejectComponent } from './offer-reject.component';

describe('OfferRejectComponent', () => {
  let component: OfferRejectComponent;
  let fixture: ComponentFixture<OfferRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
