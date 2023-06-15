import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityServicesComponent } from './community-services.component';

describe('CommunityServicesComponent', () => {
  let component: CommunityServicesComponent;
  let fixture: ComponentFixture<CommunityServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
