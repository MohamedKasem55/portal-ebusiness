import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QoyodDashboardComponent } from './qoyod-dashboard.component';

describe('QoyodDashboardComponent', () => {
  let component: QoyodDashboardComponent;
  let fixture: ComponentFixture<QoyodDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QoyodDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QoyodDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
