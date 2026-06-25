import { TestBed } from '@angular/core/testing';

import { ProducVarient } from './produc-varient';

describe('ProducVarient', () => {
  let service: ProducVarient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducVarient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
