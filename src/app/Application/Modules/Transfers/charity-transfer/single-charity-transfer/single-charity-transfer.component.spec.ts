import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCharityTransferComponent } from './single-charity-transfer.component';

describe('SingleCharityTransferComponent', () => {
  let component: SingleCharityTransferComponent;
  let fixture: ComponentFixture<SingleCharityTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCharityTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCharityTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
