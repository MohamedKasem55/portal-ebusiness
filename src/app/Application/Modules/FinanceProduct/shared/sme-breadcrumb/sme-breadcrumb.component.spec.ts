import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeBreadcrumbComponent } from './sme-breadcrumb.component';

describe('SmeBreadcrumbComponent', () => {
  let component: SmeBreadcrumbComponent;
  let fixture: ComponentFixture<SmeBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeBreadcrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
