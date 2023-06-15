import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeCheckComponent } from './sme-check.component';

describe('SmeCheckComponent', () => {
  let component: SmeCheckComponent;
  let fixture: ComponentFixture<SmeCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
