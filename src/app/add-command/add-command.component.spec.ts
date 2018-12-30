import { assert } from "chai";
import { ErrorHandler } from "@angular/core";
import { 
  async, 
  ComponentFixture, 
  TestBed,
} from '@angular/core/testing';
import { 
  MatButtonModule, 
  MatSnackBarModule,
  MatInputModule,
  MatSelectModule,
  MatListModule
} from "@angular/material";
import { FormsModule } from "@angular/forms"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AddCommandComponent } from './add-command.component';
import { CommandDetailsComponent } from '../command-details/command-details.component';
import { AppErrorHandler } from "../app-error-handler";
import { FaceCommandClientService } from "../face-command-client.service";
import { AddFacesComponent } from "../add-faces/add-faces.component";

describe('AddCommandComponent', () => {
  let component: AddCommandComponent;
  let fixture: ComponentFixture<AddCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AddCommandComponent, 
        CommandDetailsComponent,
        AddFacesComponent
      ],
      imports: [
        MatButtonModule,
        MatSnackBarModule,
        MatInputModule,
        FormsModule,
        MatSelectModule,
        MatListModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ErrorHandler, useClass: AppErrorHandler }, 
        FaceCommandClientService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("#constructor()", () => {
    it('should create', () => {
      assert.ok(component);
    });
  });

  describe("#commandDetails", () => {
    it("should contain a command details component", () => {
      assert.instanceOf(component.commandDetails, CommandDetailsComponent);
    });
  });
});
