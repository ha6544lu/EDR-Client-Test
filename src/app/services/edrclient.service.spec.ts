import { TestBed } from '@angular/core/testing';

import { EDRClientService } from './edrclient.service';

describe('EDRClientService', () => {
  let service: EDRClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EDRClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
