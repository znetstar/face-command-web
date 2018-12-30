import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatRadioModule, MatCheckboxModule, MatFormFieldModule, MatSnackBarModule, MatInputModule } from "@angular/material";
import { assert } from "chai";
import * as Chance from  "chance";

import { FaceDetailsComponent } from "../face-details/face-details.component"
import { AddFaceComponent } from './add-face.component';

const chance = new Chance();

describe('AddFaceComponent', () => {
  let component: AddFaceComponent;
  let fixture: ComponentFixture<AddFaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AddFaceComponent,
        FaceDetailsComponent
      ],
      imports: [
        MatRadioModule,
        FormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#constructor()', () => {
    it('should create', () => {
      assert.ok(component);
    });
  });

  describe('#faceDetails', () => {
    it("face details should be an instance of FaceDetailsComponent", () => {
      assert.instanceOf(component.faceDetails, FaceDetailsComponent);
    });
  });

  describe('#face', () => {
    it("this.face should passthrough to face details", () => {
      const data = chance.string();

      component.face = data;
    
      assert.equal(component.faceDetails.face, data);
      assert.equal(component.face, data);
    });
  });
});
