import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGoldComponent } from './select-gold.component';

describe('SelectGoldComponent', () => {
  let component: SelectGoldComponent;
  let fixture: ComponentFixture<SelectGoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectGoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
