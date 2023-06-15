import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSignatureComponent } from './branch-signature.component';

describe('BranchSignatureComponent', () => {
  let component: BranchSignatureComponent;
  let fixture: ComponentFixture<BranchSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
