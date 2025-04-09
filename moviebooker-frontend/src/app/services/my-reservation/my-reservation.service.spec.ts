import { TestBed } from '@angular/core/testing';

import { MyReservationService } from './my-reservation.service';

describe('MyReservationService', () => {
  let service: MyReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
