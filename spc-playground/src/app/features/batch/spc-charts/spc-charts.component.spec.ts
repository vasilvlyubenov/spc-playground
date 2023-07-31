import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpcChartsComponent } from './spc-charts.component';

describe('SpcChartsComponent', () => {
  let component: SpcChartsComponent;
  let fixture: ComponentFixture<SpcChartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpcChartsComponent]
    });
    fixture = TestBed.createComponent(SpcChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
