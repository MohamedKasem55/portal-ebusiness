import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestWizardComponent } from './add-request-wizard.component';

describe('AddRequestWizardComponent', () => {
  let component: AddRequestWizardComponent;
  let fixture: ComponentFixture<AddRequestWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
