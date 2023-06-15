import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVerifyDetailsComponent } from './account-verify-details.component';

describe('AccountVerifyDetailsComponent', () => {
  let component: AccountVerifyDetailsComponent;
  let fixture: ComponentFixture<AccountVerifyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountVerifyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountVerifyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
