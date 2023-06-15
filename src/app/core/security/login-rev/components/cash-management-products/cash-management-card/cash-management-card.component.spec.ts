import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashManagementCardComponent } from './cash-management-card.component';

describe('CashManagementCardComponent', () => {
  let component: CashManagementCardComponent;
  let fixture: ComponentFixture<CashManagementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashManagementCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashManagementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
