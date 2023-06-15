import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSummaryComponent } from './internal-summary.component';

describe('InternalSummaryComponent', () => {
  let component: InternalSummaryComponent;
  let fixture: ComponentFixture<InternalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
