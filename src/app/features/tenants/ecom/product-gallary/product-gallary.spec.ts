import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGallary } from './product-gallary';

describe('ProductGallary', () => {
  let component: ProductGallary;
  let fixture: ComponentFixture<ProductGallary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGallary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGallary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
