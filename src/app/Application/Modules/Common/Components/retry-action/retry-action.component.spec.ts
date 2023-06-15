import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetryActionComponent } from './retry-action.component';

describe('RetryActionComponent', () => {
  let component: RetryActionComponent;
  let fixture: ComponentFixture<RetryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetryActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
