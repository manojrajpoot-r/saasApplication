import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Colors } from './colors';

describe('Colors', () => {
  let component: Colors;
  let fixture: ComponentFixture<Colors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Colors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Colors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
