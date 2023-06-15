import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeCardComponent } from './sme-card.component';

describe('SmeCardComponent', () => {
  let component: SmeCardComponent;
  let fixture: ComponentFixture<SmeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
