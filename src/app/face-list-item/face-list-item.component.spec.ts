import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceDetailComponent } from './face-detail.component';

describe('FaceDetailComponent', () => {
  let component: FaceDetailComponent;
  let fixture: ComponentFixture<FaceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
