import { TestBed } from '@angular/core/testing';

import { EventomenuService } from './eventomenu.service';

describe('EventomenuService', () => {
  let service: EventomenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventomenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
