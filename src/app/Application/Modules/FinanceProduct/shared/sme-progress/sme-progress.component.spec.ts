import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeProgressComponent } from './sme-progress.component';

describe('SmeProgressComponent', () => {
  let component: SmeProgressComponent;
  let fixture: ComponentFixture<SmeProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
