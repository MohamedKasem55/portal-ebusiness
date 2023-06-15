import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDownProgressComponent } from './count-down-progress.component';

describe('CountDownProgressComponent', () => {
  let component: CountDownProgressComponent;
  let fixture: ComponentFixture<CountDownProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountDownProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountDownProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
