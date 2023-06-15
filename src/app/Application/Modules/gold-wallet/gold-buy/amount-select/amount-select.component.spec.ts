import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountSelectComponent } from './amount-select.component';

describe('AmountSelectComponent', () => {
  let component: AmountSelectComponent;
  let fixture: ComponentFixture<AmountSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
