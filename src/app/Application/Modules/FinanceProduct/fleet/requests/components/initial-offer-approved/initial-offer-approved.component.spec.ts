import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialOfferApprovedComponent } from './initial-offer-approved.component';

describe('InitialOfferApprovedComponent', () => {
  let component: InitialOfferApprovedComponent;
  let fixture: ComponentFixture<InitialOfferApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialOfferApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialOfferApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
