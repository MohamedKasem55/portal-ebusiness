import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitCardApplyComponent } from './debit-card-apply.component';

describe('DebitCardApplyComponent', () => {
  let component: DebitCardApplyComponent;
  let fixture: ComponentFixture<DebitCardApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitCardApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitCardApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
