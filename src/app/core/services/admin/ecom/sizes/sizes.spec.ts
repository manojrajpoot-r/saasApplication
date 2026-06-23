import { TestBed } from '@angular/core/testing';

import { Sizes } from './sizes';

describe('Sizes', () => {
  let service: Sizes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sizes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
