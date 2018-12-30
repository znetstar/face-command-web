import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { 
  MatListModule, 
  MatSelectModule, 
  MatSnackBarModule,
  MatCheckboxModule,
  MatInputModule
} from "@angular/material";
import { assert } from "chai";
import * as Chance from  "chance";
import Random from "face-command-common/lib/Random";

import { AddFacesComponent } from './add-faces.component';
import { FaceCommandClientService } from "../face-command-client.service";

const chance = new Chance();
const random = new Random();

describe('AddFaceComponent', () => {
  let component: AddFacesComponent;
  let fixture: ComponentFixture<AddFacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AddFacesComponent
      ],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatListModule,
        MatSelectModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatInputModule
      ],
      providers: [ FaceCommandClientService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#constructor()', () => {
    it('should create', () => {
      assert.ok(component);
    });
  });

  describe("#clear()", () => {
    it("should empty #selectedFaces and #selectedFacesSelected and reset #faces", () => {
      (<any>component).allFaces = random.faces();

      component.selectedFaces = (<any>component).allFaces.splice(0, chance.integer({ min: 1, max: (<any>component).allFaces.length }));
      component.selectedFacesSelected = component.selectedFaces.slice(0, chance.integer({ min: 1, max: component.selectedFaces.length }));

      component.clear();

      assert.equal(component.faces.length, (<any>component).allFaces.length, "All faces was not reset");
      assert.isEmpty(component.selectedFaces, "Selected faces was not empty");
      assert.isEmpty(component.selectedFacesSelected, "Selected faces selected was not empty");
    });
  });

  describe("#selectFace($event)", () => {
    it("should move a face from faces to selectedFaces", () => {
      component.faces = random.faces();

      const face = component.faces[chance.integer({ min: 0, max: component.faces.length })];

      component.selectFace({ value: face, source: {  } });
      assert.notIncludeOrderedMembers(component.faces, [ face ]);
      assert.includeOrderedMembers(component.selectedFaces, [ face ]);
    });
  }); 

  describe("#removeFace()", () => {
    it("should move faces from selectedFacesSelected to selectedFaces", () => {
      component.faces = random.faces();
      component.selectedFaces = component.faces.splice(0, chance.integer({ min: 1, max: (component.faces.length - 1) }));
      component.selectedFacesSelected = component.selectedFaces.slice(0, chance.integer({ min: 1, max: (component.faces.length - 1) }));
  
      const selectedFaceSelectedIds = component.selectedFacesSelected.slice(0);

      component.removeFaces();

      assert.includeMembers(component.faces, selectedFaceSelectedIds);
    });
  });

  describe("#ngOnInit()", () => {
    it("should exlucde selected faces from faces array on load", async () => {
      const allFaces = random.faces();
      (<FaceCommandClientService>(<any>component).client).faceManagementService.GetFaces = async () => allFaces.slice(0);
      component.selectedFaces = allFaces.slice(0, chance.integer({ min: 1, max: (allFaces.length - 1) }))
      await component.ngOnInit();
      assert.notIncludeOrderedMembers(component.faces, component.selectedFaces);
    });
  });
});
