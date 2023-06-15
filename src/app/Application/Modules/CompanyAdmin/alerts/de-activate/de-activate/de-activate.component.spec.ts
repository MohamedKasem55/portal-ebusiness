import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeActivateComponent } from './de-activate.component';

describe('DeActivateComponent', () => {
  let component: DeActivateComponent;
  let fixture: ComponentFixture<DeActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeActivateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
