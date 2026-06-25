import { TestBed } from '@angular/core/testing';

import { ProducGallary } from './produc-gallary';

describe('ProducGallary', () => {
  let service: ProducGallary;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducGallary);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
