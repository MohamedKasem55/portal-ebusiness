import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmInformationComponent } from './rm-information.component';

describe('RmInformationComponent', () => {
  let component: RmInformationComponent;
  let fixture: ComponentFixture<RmInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
