import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFaceComponent } from './add-face.component';

describe('AddFaceComponent', () => {
  let component: AddFaceComponent;
  let fixture: ComponentFixture<AddFaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
