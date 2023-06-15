import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineMerchantPortalComponent } from './online-merchant-portal.component';

describe('OnlineMerchantPortalComponent', () => {
  let component: OnlineMerchantPortalComponent;
  let fixture: ComponentFixture<OnlineMerchantPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineMerchantPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineMerchantPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
