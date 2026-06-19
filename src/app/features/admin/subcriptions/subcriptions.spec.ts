import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subcriptions } from './subcriptions';

describe('Subcriptions', () => {
  let component: Subcriptions;
  let fixture: ComponentFixture<Subcriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subcriptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subcriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
