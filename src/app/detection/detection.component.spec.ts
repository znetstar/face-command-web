import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { 
  MatListModule, 
  MatSelectModule, 
  MatSnackBarModule,
  MatCheckboxModule,
  MatInputModule
} from "@angular/material";

import Random from "face-command-common/lib/Random";
import { assert } from "chai";
import * as Chance from "chance";

import { DetectionComponent } from './detection.component';
import { AddFacesComponent } from "../add-faces/add-faces.component";
import { FaceCommandClientService } from '../face-command-client.service';
import { DetectionOptions, EigenFaceRecognizerOptions } from 'face-command-common';

const chance = Chance()
const random = new Random();

describe('DetectionComponent', () => {
  let component: DetectionComponent;
  let fixture: ComponentFixture<DetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DetectionComponent,
        AddFacesComponent
      ],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatSelectModule, 
        MatSnackBarModule,
        MatCheckboxModule,
        MatInputModule,
        MatListModule
      ],
      providers: [
        FaceCommandClientService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#constructor()', () => {
    it('should create', () => {
      assert.ok(component);
    });
  });

  describe("#autostartFaces", () => {
    it("should get the underlying property", () => {
      const value = chance.bool();
      component.detectionOptions.autostartFaces = value;
      
      assert.equal(value, component.autostartFaces);
    });

    it("should set the underlying property", () => {
      const value = chance.bool();
      component.autostartFaces = value;
      
      assert.equal(value, component.detectionOptions.autostartFaces);
    });
  });

  describe("#selectedFaces", () => {
    it("should get the underlying property", () => {
      const faces = random.faces();
      component.detectionOptions.faces = faces;
      
      assert.deepEqual(faces, component.selectedFaces);
    });
  });

  describe("#stopDetection()", () => {
    it("should call stop detection on the server", async () => {
      component.statusChanges = random.statuses();
      (<FaceCommandClientService>(<any>component).client).detectionService.StopDetection = async () => {

      };
      
      await component.stopDetection();
      assert.isEmpty(component.statusChanges)
    });
  });

  describe("#startDetection()", () => {
    it("should call start detection on the server", async () => {
      const opts = random.detectionOptions();
      component.statusChanges = random.statuses();
      (<FaceCommandClientService>(<any>component).client).detectionService.StartDetection = async (options: DetectionOptions) => {
        assert.deepEqual(opts, options);
      }; 
      component.detectionOptions = opts;
      await component.startDetection();
      assert.isEmpty(component.statusChanges);
    });
  });

  describe("#ngOnInit()", () => {
    it("isDetection running should set with the value from the server", async () => {
      (<FaceCommandClientService>(<any>component).client).configService.GetConfigValue = async () => null;
      const value = chance.bool();
      (<FaceCommandClientService>(<any>component).client).detectionService.IsDetectionRunning = async (): Promise<boolean> => value
      await component.ngOnInit();
      assert.equal(value, component.isDetectionRunning );
    });

    it("should retrieve the detection options", async () => {
      const recOptions = new EigenFaceRecognizerOptions(chance.floating(), chance.floating());
      const options = new DetectionOptions(chance.floating(), recOptions, [], chance.bool()); 
      const config = new Map<string, any>([
        [ "eigenFaceRecognizerOptions:components", options.eigenFaceRecognizerOptions.components ],
        [ "eigenFaceRecognizerOptions:threshold", options.eigenFaceRecognizerOptions.threshold ],
        [ "imageCaptureFrequency", options.frequency ]
      ]);
      (<FaceCommandClientService>(<any>component).client).configService.GetConfigValue = async (key: string) => config.get(key);
      (<FaceCommandClientService>(<any>component).client).detectionService.IsDetectionRunning = async (): Promise<boolean> => chance.bool()
      await component.ngOnInit();

      assert.deepEqual(component.detectionOptions, options);
    });

    it("should add status changes to the component", async () => {
      (<FaceCommandClientService>(<any>component).client).configService.GetConfigValue = async (key: string) => chance.string();
      (<FaceCommandClientService>(<any>component).client).detectionService.IsDetectionRunning = async (): Promise<boolean> => chance.bool();
      const status = random.status();
      await component.ngOnInit();
      (<FaceCommandClientService>(<any>component).client).detectionService.emit("StatusChange", status);
      assert.isNotEmpty(component.statusChanges);
      assert.includeDeepOrderedMembers(component.statusChanges, [ status ]);
    });

    it("should update DetectionRunning", async () => {
      (<FaceCommandClientService>(<any>component).client).configService.GetConfigValue = async (key: string) => chance.string();
      (<FaceCommandClientService>(<any>component).client).detectionService.IsDetectionRunning = async (): Promise<boolean> => chance.bool();
      await component.ngOnInit();
      const value = chance.bool();
      (<FaceCommandClientService>(<any>component).client).detectionService.emit("DetectionRunning", value);
      assert.equal(component.isDetectionRunning, value);
    });
  });
});
