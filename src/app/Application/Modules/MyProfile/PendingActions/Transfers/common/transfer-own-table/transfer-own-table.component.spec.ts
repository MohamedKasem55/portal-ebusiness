import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOwnTableComponent } from './transfer-own-table.component';

describe('TransferOwnTableComponent', () => {
  let component: TransferOwnTableComponent;
  let fixture: ComponentFixture<TransferOwnTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferOwnTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOwnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
