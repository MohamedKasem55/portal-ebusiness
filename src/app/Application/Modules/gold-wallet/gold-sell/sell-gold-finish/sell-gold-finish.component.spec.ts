import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellGoldFinishComponent } from './sell-gold-finish.component';

describe('SellGoldFinishComponent', () => {
  let component: SellGoldFinishComponent;
  let fixture: ComponentFixture<SellGoldFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellGoldFinishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellGoldFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
