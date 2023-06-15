import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVerifyNewComponent } from './account-verify-new.component';

describe('AccountVerifyNewComponent', () => {
  let component: AccountVerifyNewComponent;
  let fixture: ComponentFixture<AccountVerifyNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountVerifyNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountVerifyNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
