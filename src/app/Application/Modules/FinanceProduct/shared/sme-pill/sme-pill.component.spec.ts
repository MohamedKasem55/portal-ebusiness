import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmePillComponent } from './sme-pill.component';

describe('SmePillComponent', () => {
  let component: SmePillComponent;
  let fixture: ComponentFixture<SmePillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmePillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmePillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
