import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeCardMediaComponent } from './sme-card-media.component';

describe('SmeCardMediaComponent', () => {
  let component: SmeCardMediaComponent;
  let fixture: ComponentFixture<SmeCardMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeCardMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeCardMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
