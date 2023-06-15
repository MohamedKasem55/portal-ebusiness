import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVerifyListComponent } from './account-verify-list.component';

describe('AccountVerifyListComponent', () => {
  let component: AccountVerifyListComponent;
  let fixture: ComponentFixture<AccountVerifyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountVerifyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountVerifyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
