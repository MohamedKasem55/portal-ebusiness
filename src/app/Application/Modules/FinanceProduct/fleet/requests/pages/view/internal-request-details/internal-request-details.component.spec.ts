import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalRequestDetailsComponent } from './internal-request-details.component';

describe('InternalRequestDetailsComponent', () => {
  let component: InternalRequestDetailsComponent;
  let fixture: ComponentFixture<InternalRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalRequestDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
