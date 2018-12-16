import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacesComponent } from './add-faces.component';

describe('AddFacesComponent', () => {
  let component: AddFacesComponent;
  let fixture: ComponentFixture<AddFacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
