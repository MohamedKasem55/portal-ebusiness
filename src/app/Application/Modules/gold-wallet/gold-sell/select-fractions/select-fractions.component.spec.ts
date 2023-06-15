import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFractionsComponent } from './select-fractions.component';

describe('SelectFractionsComponent', () => {
  let component: SelectFractionsComponent;
  let fixture: ComponentFixture<SelectFractionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectFractionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
