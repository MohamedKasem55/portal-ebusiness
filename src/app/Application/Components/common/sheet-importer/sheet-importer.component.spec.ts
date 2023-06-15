import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetImporterComponent } from './sheet-importer.component';

describe('SheetImporterComponent', () => {
  let component: SheetImporterComponent;
  let fixture: ComponentFixture<SheetImporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetImporterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
