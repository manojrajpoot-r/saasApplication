import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVarient } from './product-varient';

describe('ProductVarient', () => {
  let component: ProductVarient;
  let fixture: ComponentFixture<ProductVarient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVarient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVarient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
