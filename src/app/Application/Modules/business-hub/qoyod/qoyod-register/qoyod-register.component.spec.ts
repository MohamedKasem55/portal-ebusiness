import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QoyodRegisterComponent } from './qoyod-register.component';

describe('QoyodRegisterComponent', () => {
  let component: QoyodRegisterComponent;
  let fixture: ComponentFixture<QoyodRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QoyodRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QoyodRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
