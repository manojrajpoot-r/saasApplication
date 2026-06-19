import { TestBed } from '@angular/core/testing';

import { Subcription } from './subcription';

describe('Subcription', () => {
  let service: Subcription;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Subcription);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
