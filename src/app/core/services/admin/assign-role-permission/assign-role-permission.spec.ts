import { TestBed } from '@angular/core/testing';

import { AssignRolePermission } from './assign-role-permission';

describe('AssignRolePermission', () => {
  let service: AssignRolePermission;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignRolePermission);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
