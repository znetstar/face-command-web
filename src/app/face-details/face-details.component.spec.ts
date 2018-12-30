import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { 
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatSnackBarModule, 
  MatFormFieldModule
} from "@angular/material";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import Random from "face-command-common/lib/Random";
import { assert } from "chai";
import * as Chance from "chance";
import { cloneDeep } from "lodash";
import { Face } from 'face-command-common';
import { arrayBufferToBlob } from "blob-util";

import { FaceDetailsComponent } from './face-details.component';
import { FaceCommandClientService } from '../face-command-client.service';


const chance = Chance();
const random = new Random();

describe('FaceDetailsComponent', () => {
  let component: FaceDetailsComponent;
  let fixture: ComponentFixture<FaceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceDetailsComponent ],
      imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        BrowserAnimationsModule,
        FormsModule,
        MatSnackBarModule, 
        MatFormFieldModule
      ],
      providers: [
        FaceCommandClientService,
        { provide: DomSanitizer, useValue: { bypassSecurityTrustUrl: (url) => 'SafeUrl:'+url } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("#constructor()", () => {
    it('should create', () => {
      assert.ok(component);
    });
  });

  describe("#isNewFace", () => {
    it('should be false if the ID property on this.face is set', () => {
      const value = chance.integer();
      component.face = { id: value };
      
      assert.isFalse(component.isNewFace);
    });
  });

  describe("#faceId", () => {
    it('should set the ID property on this.face', () => {
      const value = chance.integer();
      component.faceId = value;
      assert.equal(value, component.face.id);
    });

    it('should get the ID property on this.face', () => {
      const value = chance.integer();
      component.face.id = value;

      assert.equal(value, component.faceId);
    });
  });

  describe("#setImageUrl()", () => {
    it('should generate a safe url', async () => {
      const face = random.face();
      const dataUri = await FaceCommandClientService.faceImageAsDataUri(face);
      const url = (<DomSanitizer>(<any>component).sanitizer).bypassSecurityTrustUrl(dataUri);
      component.face = face;
      await component.setImageUrl();
      assert.equal(url, component.imageUrl);
    });
  });

  describe("#showFace()", () => {
    it('should replace the underlying face object with the input', async () => {
      const face = random.face();
      component.face = random.face();
      (<any>component).showFace(face);

      assert.deepEqual(face, component.face);
    });

    it('should replace the imageUrl with a safe imageUrl from the input', async () => {
      const face = random.face();
      component.face = random.face();
      (<any>component.imageUrl) = chance.string();
      (<any>component).showFace(face);

      const dataUri = await FaceCommandClientService.faceImageAsDataUri(face);
      const url = (<DomSanitizer>(<any>component).sanitizer).bypassSecurityTrustUrl(dataUri);
      assert.equal(url, component.imageUrl);
    });
  });

  describe("#createFace()", () => {
    it('should replace the underlying face object with the input when a face has been uploaded', async () => {
      const face = random.face();
      component.face = cloneDeep(face);
      delete component.face.id;
      component.faceFromCamera = false;
      (<FaceCommandClientService>(<any>component).client).faceManagementService.AddFace = async (image: Uint8Array, name: string, autostart: boolean): Promise<Face> => {
        return new Face(face.id, name, image, autostart);
      };

      await component.createFace({ checkValidity: () => true });
      assert.deepEqual(face, component.face);
    });

    it('should replace the underlying face object with the input when directed to obtain an image from the camera', async () => {
      const face = random.face();
      component.face = cloneDeep(face);
      delete component.face.id;
      delete component.face.image;
      component.faceFromCamera = true;
      (<FaceCommandClientService>(<any>component).client).faceManagementService.AddFaceFromCamera = async (name: string, autostart: boolean): Promise<Face> => {
        return new Face(face.id, name, face.image, autostart);
      };

      await component.createFace({ checkValidity: () => true });
      assert.deepEqual(face, component.face);
    });
  });

  describe("#updateFace()", () => {
    it("should update the face on the server", async () => {
      const face = random.face();
      const faces = new Map<number, Face>([
        [ face.id, face ]
      ]);

      component.face = face;
      component.face.name = chance.string();
      component.face.image = random.bytes();

      (<FaceCommandClientService>(<any>component).client).faceManagementService.UpdateFace = async (faceDelta: Face): Promise<Face> => {
        assert.isTrue(faces.has(faceDelta.id));
        faces.set(faceDelta.id, faceDelta);
        return faceDelta;
      };

      await component.updateFace({ checkValidity: () => true });
      assert.deepEqual(faces.get(face.id), component.face);
    });
  });

  describe("#removeFace()", () => {
    it("should update the face on the server", async () => {
      const face = random.face();
      const faces = new Map<number, Face>([
        [ face.id, face ]
      ]);

      component.face = face;

      (<FaceCommandClientService>(<any>component).client).faceManagementService.RemoveFace = async (faceId: number): Promise<void> => {
        assert.isTrue(faces.has(faceId));
        faces.delete(faceId);
      };

      await component.removeFace();
      assert.isFalse(faces.has(face.id));
    });
  });
  
  describe("#fileAdded()", () => {
    it("should add image uploaded to image property of face object", async () => {
      const image = random.bytes();
      const imageFile = new File([ arrayBufferToBlob((image.buffer as ArrayBuffer), FaceCommandClientService.IMAGE_FORMAT) ], chance.string(), { type: FaceCommandClientService.IMAGE_FORMAT });

      (<any>component).imageFile = {
        nativeElement: {
          files: [ imageFile ]
        }
      };

      await component.fileAdded();

      assert.deepEqual(image, component.face.image);
    });
  });

  describe("#ngOnInit()", () => {
    it("should fetch the face with a matching ID", async () => {
      const face = random.face();
      const faces = new Map<number, Face>([
        [ face.id, face ]
      ]);
      
      component.face = { id: face.id };

      (<FaceCommandClientService>(<any>component).client).faceManagementService.GetFace = async (faceId: number): Promise<Face> => {
        assert.isTrue(faces.has(faceId));
        return faces.get(faceId);
      };

      await component.ngOnInit();
      assert.deepEqual(face, component.face);
    });
  });
});
