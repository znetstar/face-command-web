import { TestBed, inject } from '@angular/core/testing';

import { FaceDefenseClientService } from './face-defense-client.service';

describe('FaceDefenseClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FaceDefenseClientService]
    });
  });

  it('should be created', inject([FaceDefenseClientService], (service: FaceDefenseClientService) => {
    expect(service).toBeTruthy();
  }));
});
