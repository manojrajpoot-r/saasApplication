import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInputArray } from './dynamic-input-array';

describe('DynamicInputArray', () => {
  let component: DynamicInputArray;
  let fixture: ComponentFixture<DynamicInputArray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicInputArray]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicInputArray);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
