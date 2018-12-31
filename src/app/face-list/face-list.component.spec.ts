import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { 
  MatIconModule,
  MatListModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSnackBarModule
} from "@angular/material";
import Random from "face-command-common/lib/Random";
import { Face } from "face-command-common";
import { assert } from "chai";
import * as Chance from "chance";
import { APP_BASE_HREF } from "@angular/common";

import { AppRoutingModule } from "../app-routing.module";
import { FaceListComponent } from "../face-list/face-list.component";
import { FaceListItemComponent } from "../face-list-item/face-list-item.component";
import { SettingsComponent } from "../settings/settings.component";
import { DetectionComponent } from '../detection/detection.component';
import { AddFaceComponent } from '../add-face/add-face.component';
import { AddCommandComponent } from '../add-command/add-command.component';
import { CommandListItemComponent } from '../command-list-item/command-list-item.component';
import { CommandListComponent } from '../command-list/command-list.component';
import { LogsComponent } from '../logs/logs.component';
import { FaceDetailsComponent } from '../face-details/face-details.component';
import { AddFacesComponent } from '../add-faces/add-faces.component';
import { CommandDetailsComponent } from "../command-details/command-details.component";
import { FaceCommandClientService } from '../face-command-client.service';

const random = new Random();
const chance = Chance();

describe('FaceListComponent', () => {
  let component: FaceListComponent;
  let fixture: ComponentFixture<FaceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        FaceListComponent,
        FaceListItemComponent,
        SettingsComponent,
        DetectionComponent,
        AddFaceComponent,
        AddCommandComponent,
        CommandListItemComponent,
        LogsComponent,
        FaceDetailsComponent,
        AddFacesComponent,
        CommandDetailsComponent,
        CommandListComponent
      ],
      imports: [
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule,
        MatListModule,
        AppRoutingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule
      ],
      providers: [ FaceCommandClientService, { provide: APP_BASE_HREF, useValue: '/' } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("#constructor()", () => {
    it('should create', () => {
      assert.ok(component);
    });
  });

  describe("#removeFaces()", async () => {
    it("should remove selected faces from the database", async () => {
      const faces = new Map<number, Face>(random.faces().map<any>((face) => [ face.id, face ]))
      component.faces = Array.from(faces.values());
      component.selectedFaces = Array.from(faces.values());
      component.selectFaces = true;

      (<FaceCommandClientService>(<any>component).client).faceManagementService.RemoveFace = async (faceId: number) => {
        faces.delete(faceId);
      }

      await component.removeFaces();  

      assert.isEmpty(Array.from(faces));
    })
  });

  describe("#ngOnInit()", async () => {
    it("should retrieve all faces from the database", async () => {
      const faces = random.faces();

      (<FaceCommandClientService>(<any>component).client).faceManagementService.GetFaces = async () => {
        return faces;
      }

      await component.ngOnInit();  

      assert.deepEqual(faces, component.faces);
    })
  });
});
