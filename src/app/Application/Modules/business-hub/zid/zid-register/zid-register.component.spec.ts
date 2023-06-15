import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZidRegisterComponent } from './zid-register.component';

describe('ZidRegisterComponent', () => {
  let component: ZidRegisterComponent;
  let fixture: ComponentFixture<ZidRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZidRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZidRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
