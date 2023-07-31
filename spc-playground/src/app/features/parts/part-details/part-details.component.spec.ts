import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartDetailsComponent } from './part-details.component';

describe('PartDetailsComponent', () => {
  let component: PartDetailsComponent;
  let fixture: ComponentFixture<PartDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartDetailsComponent]
    });
    fixture = TestBed.createComponent(PartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
