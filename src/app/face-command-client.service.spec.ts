import { TestBed, inject } from '@angular/core/testing';

import { FaceCommandClientService } from './face-command-client.service';

describe('FaceDefenseClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FaceCommandClientService]
    });
  });

  it('should be created', inject([FaceCommandClientService], (service: FaceCommandClientService) => {
    expect(service).toBeTruthy();
  }));
});
