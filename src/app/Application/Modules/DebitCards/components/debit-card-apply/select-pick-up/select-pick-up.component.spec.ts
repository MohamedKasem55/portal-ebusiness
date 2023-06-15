import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPickUpComponent } from './select-pick-up.component';

describe('SelectPickUpComponent', () => {
  let component: SelectPickUpComponent;
  let fixture: ComponentFixture<SelectPickUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPickUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPickUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
