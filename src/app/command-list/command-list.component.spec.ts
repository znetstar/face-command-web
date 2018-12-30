import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatSidenavModule,
  MatListModule,
  MatSnackBarModule,
  MatIconModule,
  MatSelectModule
} from "@angular/material";
import { FormsModule } from "@angular/forms";
import { APP_BASE_HREF } from "@angular/common";
import { assert } from "chai";
import { Command } from 'face-command-common';

import Random from "face-command-common/lib/Random";

import { AppRoutingModule } from "../app-routing.module";
import { CommandListComponent } from './command-list.component';
import { FaceListComponent } from "../face-list/face-list.component";
import { FaceListItemComponent } from "../face-list-item/face-list-item.component";
import { SettingsComponent } from "../settings/settings.component";
import { FaceCommandClientService } from '../face-command-client.service';
import { DetectionComponent } from '../detection/detection.component';
import { AddFaceComponent } from '../add-face/add-face.component';
import { AddCommandComponent } from '../add-command/add-command.component';
import { CommandListItemComponent } from '../command-list-item/command-list-item.component';
import { LogsComponent } from '../logs/logs.component';
import { FaceDetailsComponent } from '../face-details/face-details.component';
import { AddFacesComponent } from '../add-faces/add-faces.component';
import { CommandDetailsComponent } from "../command-details/command-details.component";
const random = new Random();

describe('CommandListComponent', () => {
  let component: CommandListComponent;
  let fixture: ComponentFixture<CommandListComponent>;

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
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatButtonModule,
        MatListModule,
        MatSnackBarModule,
        MatIconModule,
        MatInputModule,
        AppRoutingModule,
        MatSelectModule
      ],
      providers: [ FaceCommandClientService, { provide: APP_BASE_HREF, useValue: '/' } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("#constructor()", () => {
    it('should create', () => {
      assert.ok(component);
    });
  });
  
  describe("#removeCommands()", () => {
    it("should remove commands from the database", async () => {
      const commands: Map<number, Command> = new Map<number, Command>(random.commands().map<any>((command) => [ command.id, command ]));
      
      (<FaceCommandClientService>(<any>component).client).commandService.RemoveCommand = async (commandId: number): Promise<void> => {
        commands.delete(commandId);
      };

      component.selectedCommands = Array.from(commands.values());

      await component.removeCommands();

      assert.isEmpty(Array.from(commands.values()));
    });
  });

  describe("#ngOnInit()", () => {
    it("should retrieve all commands from the database", async () => {
      const commands = random.commands();
      (<FaceCommandClientService>(<any>component).client).commandService.GetCommands = async (): Promise<Command[]> => {
        return commands.slice(0);
      };     

      await component.ngOnInit();

      assert.deepEqual(commands, component.commands);
    });
  });
});
