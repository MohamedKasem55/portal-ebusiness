import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZidDashboardComponent } from './zid-dashboard.component';

describe('ZidDashboardComponent', () => {
  let component: ZidDashboardComponent;
  let fixture: ComponentFixture<ZidDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZidDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZidDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
