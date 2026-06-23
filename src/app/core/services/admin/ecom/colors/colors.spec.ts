import { TestBed } from '@angular/core/testing';

import { Colors } from './colors';

describe('Colors', () => {
  let service: Colors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Colors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
