import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeMediaComponent } from './sme-media.component';

describe('SmeCardMediaComponent', () => {
  let component: SmeMediaComponent;
  let fixture: ComponentFixture<SmeMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
