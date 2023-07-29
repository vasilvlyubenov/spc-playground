import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseBatchComponent } from './close-batch.component';

describe('CloseBatchComponent', () => {
  let component: CloseBatchComponent;
  let fixture: ComponentFixture<CloseBatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CloseBatchComponent]
    });
    fixture = TestBed.createComponent(CloseBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
