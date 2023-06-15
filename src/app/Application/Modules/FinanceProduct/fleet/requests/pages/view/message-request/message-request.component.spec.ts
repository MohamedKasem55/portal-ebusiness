import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRequestComponent } from 'app/Application/Modules/FinanceProduct/fleet/requests/pages/view/message-request/message-request.component';

describe('MessageRequestComponent', () => {
  let component: MessageRequestComponent;
  let fixture: ComponentFixture<MessageRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
