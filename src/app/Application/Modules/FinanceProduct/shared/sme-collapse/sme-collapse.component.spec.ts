import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeCollapseComponent } from './sme-collapse.component';

describe('SmeCollapseComponent', () => {
  let component: SmeCollapseComponent;
  let fixture: ComponentFixture<SmeCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeCollapseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
