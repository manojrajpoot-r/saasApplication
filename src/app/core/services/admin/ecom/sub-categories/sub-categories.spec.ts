import { TestBed } from '@angular/core/testing';

import { SubCategories } from './sub-categories';

describe('SubCategories', () => {
  let service: SubCategories;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubCategories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
