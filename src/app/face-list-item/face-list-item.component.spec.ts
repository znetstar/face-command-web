import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { assert } from "chai";
import { FormsModule } from "@angular/forms";

import {
  MatFormFieldModule, 
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatSidenavModule,
  MatListModule,
  MatSnackBarModule,
  MatIconModule,
  MatSelectModule
} from "@angular/material";
import { APP_BASE_HREF } from "@angular/common";

import { AppRoutingModule } from "../app-routing.module";
import { CommandListComponent } from '../command-list/command-list.component';
import { FaceListComponent } from "../face-list/face-list.component";
import { SettingsComponent } from "../settings/settings.component";
import { FaceCommandClientService } from '../face-command-client.service';
import { DetectionComponent } from '../detection/detection.component';
import { AddFaceComponent } from '../add-face/add-face.component';
import { AddCommandComponent } from '../add-command/add-command.component';
import { CommandListItemComponent } from '../command-list-item/command-list-item.component';
import { LogsComponent } from '../logs/logs.component';
import { FaceDetailsComponent } from '../face-details/face-details.component';
import { AddFacesComponent } from '../add-faces/add-faces.component';
import { CommandDetailsComponent } from '../command-details/command-details.component';

import { FaceListItemComponent } from './face-list-item.component';

describe('FaceDetailComponent', () => {
  let component: FaceListItemComponent;
  let fixture: ComponentFixture<FaceListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CommandListComponent,
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
        CommandDetailsComponent
       ],
      providers: [ FaceCommandClientService, { provide: APP_BASE_HREF, useValue: '/' } ],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule, 
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        MatSidenavModule,
        MatListModule,
        MatSnackBarModule,
        MatIconModule,
        MatSelectModule,
        AppRoutingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("#constructor()", () => {
    it('should create', () => {
      assert.ok(component);
    });
  });
});
