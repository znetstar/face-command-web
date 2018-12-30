import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatSnackBarModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatListModule, 
  MatSelectModule 
} from "@angular/material";
import { assert } from "chai";
import * as Chance from  "chance";
import {cloneDeep} from "lodash";

import Random from "face-command-common/lib/Random";
import { RunConditionType, Command } from "face-command-common";

import { CommandDetailsComponent } from './command-details.component';
import { AddFacesComponent } from "../add-faces/add-faces.component";
import { FaceCommandClientService } from '../face-command-client.service';

const chance = Chance();
const random = new Random();

describe('CommandDetailsComponent', () => {
  let component: CommandDetailsComponent;
  let fixture: ComponentFixture<CommandDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CommandDetailsComponent, 
        AddFacesComponent 
      ],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatInputModule,
        MatFormFieldModule,
        MatListModule,
        MatSelectModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("#constructor()", () => {
    it("should create", () => {
      assert.ok(component);
    });
  });

  describe("#commandId", () => {
    it("should set underlying command id", () => { 
        const id = chance.integer();
        component.command = {};
        component.commandId = id;
        assert.equal(id, component.command.id);
    });

    it("should get underlying command id", () => { 
      const id = chance.integer();
      component.command = {};
      component.command.id = id;
      assert.equal(id, component.commandId);
    });
  });

  describe("#isNewCommand", () => {
      it("should be true if command.id is undefined", () => {
        component.command.id = void(0);
        assert.isTrue(component.isNewCommand);
      });

      it("should be false if command.id is defined", () => {
        component.command = { id: chance.integer() };
        assert.isFalse(component.isNewCommand);
      });
  });

  describe("#firstSelectedRunCondition", () => {
    it("should return the first element in runConditionsSelected", () => {
      component.runConditionsSelected = random.runConditions();

      assert.deepEqual(component.runConditionsSelected[0], component.firstSelectedRunCondition);
    });
  });

  describe("#facesToRecognizeOpen", () => {
    it("should be true when run condition type is RunOnSpecificFacesRecognized", () => {
      component.runConditionsSelected = [ random.runCondition() ];
      component.firstSelectedRunCondition.runConditionType = +RunConditionType.RunOnSpecificFacesRecognized;
      assert.isTrue(component.facesToRecognizeOpen);
    });

    it("should be true when run condition type is RunOnSpecificFacesNoLongerRecognized", () => {
      component.runConditionsSelected = [ random.runCondition() ];
      
      component.firstSelectedRunCondition.runConditionType = +RunConditionType.RunOnSpecificFacesNoLongerRecognized;
      assert.isTrue(component.facesToRecognizeOpen);
    });

    it("should be false when run condition type is not 2 or 5", () => {
      component.runConditionsSelected = random.runConditions();

      component.firstSelectedRunCondition.runConditionType = chance.integer({ min: 7 });
      assert.isFalse(component.facesToRecognizeOpen);
    });

    it("should be false if multiple run conditions are selected", () => {
      component.runConditionsSelected = [random.runCondition()].concat(random.runConditions()).map((rc) => {
        rc.runConditionType = 2;
        return rc;
      });

      assert.isFalse(component.facesToRecognizeOpen);
    });
  });

  describe("#ftrChange()", () => {
    it("should set the first selected run condition's facesToRecognize property with input", () => {
      component.runConditionsSelected = random.runConditions();
      const faces = random.faces();
      component.ftrChange(faces);
      
      assert.deepEqual(faces, component.firstSelectedRunCondition.facesToRecognize);
    });
  });

  describe("runConditionSelectionChange()", () => {
      it("should add the selected run condition to the command", () => {
        component.runConditionTypes = Array.from(component.runConditionsEnum);
        const type = component.runConditionTypes[chance.integer({ min: 1, max: 6 })];
        component.runConditionSelectionChange({ value: type, source: {} });

        assert.isArray(component.command.runConditions);
        assert.isNotEmpty(component.command.runConditions);
        assert.equal(type[0], component.command.runConditions[0].runConditionType);
        assert.notIncludeDeepOrderedMembers(component.runConditionTypes, type);
      });
  });
  
  describe("removeRunConditionsSelected()", () => {
    it("should remove the selected run condition from the command", () => {
      component.runConditionTypes = Array.from(component.runConditionsEnum);
      const type = component.runConditionTypes.splice(chance.integer({ min: 0, max: 6 }), 1)[0];
      const runCondition = { facesToRecognize: [], runConditionType: type[0] };
      component.command = {
        runConditions: [ runCondition ]
      };
      component.runConditionsSelected.push(runCondition);
    
      component.removeRunConditionsSelected();

      assert.isEmpty(component.runConditionsSelected);
      assert.isEmpty(component.command.runConditions);
      assert.includeDeepMembers(component.runConditionTypes.map((t) => t[0]), [type[0]]);
    });
  });

  describe("getDataAndRunConditions()", () => {
    it("should format the run conditions in a format ready to send to the server", () => {
      const command = random.command();
      component.command = command;
      const data = { foo: chance.string() };
      component.command.data = JSON.stringify(data, null, 4);

      const formattedData = component.getDataAndRunConditions();
      assert.deepEqual(data, formattedData.data);
  
      assert.deepEqual(command.runConditions.map((condition) => {
        condition.facesToRecognize = <any>condition.facesToRecognize.map((f) => f.id);
        delete condition.commandId;
        return cloneDeep(condition);
      }), formattedData.runConditions);
    });
  });
  
  describe("#_updatetCommand()", () => {
    it("should replace the underlying command", () => {
      const cmd = random.command();
      component._updateCommand(cmd);
      assert.deepEqual(cmd, component.command);
    });
  });

  describe("#createCommand()", () => {
    it("should send the command properties to the server", async () => {
      const command = random.command();
      const jsonData = { foo: chance.string() };
      command.data = JSON.stringify(jsonData);
      (<FaceCommandClientService>(<any>component).client).commandService.AddCommand = async (type: string, runConditions: any, name: string, data: any): Promise<Command> => {
        assert.equal(command.name, name);
        assert.equal(command.type, type);
        assert.deepEqual(jsonData, data);

        assert.deepEqual(command.runConditions.map((condition) => {
          condition.facesToRecognize = <any>condition.facesToRecognize.map((f) => f.id);
          delete condition.commandId;
          return cloneDeep(condition);
        }), runConditions);

        return command;
      };

     component.command = command;
     await component.createCommand({ checkValidity: () => true });
    });

    it("should update the underlying command with properties send from the server", async () => {
      const targetCommand = random.command();
      (<FaceCommandClientService>(<any>component).client).commandService.AddCommand = async (): Promise<Command> => {
        return targetCommand;
      };

      component.command = random.command();
      component.command.data = JSON.stringify({ foo: chance.string() }); 
      await component.createCommand({ checkValidity: () => true });
      assert.deepEqual(component.command, targetCommand);
    });
  });

  describe("#updateCommand()", () => {
    it("should send the command properties to the server", async () => {
      const command = random.command();
      const jsonData = { foo: chance.string() };
      command.data = JSON.stringify(jsonData);
      (<FaceCommandClientService>(<any>component).client).commandService.UpdateCommand = async (commandDelta: any): Promise<Command> => {
        assert.equal(command.name, commandDelta.name);
        assert.equal(command.type, commandDelta.type);
        assert.deepEqual(jsonData, commandDelta.data);

        assert.deepEqual(command.runConditions.map((condition) => {
          condition.facesToRecognize = <any>condition.facesToRecognize.map((f) => f.id);
          delete condition.commandId;
          return cloneDeep(condition);
        }), commandDelta.runConditions);

        return random.command();
      };

     component.command = command;
     await component.updateCommand({ checkValidity: () => true });
    });

    it("should update the underlying command with properties send from the server", async () => {
      const targetCommand = random.command();
      (<FaceCommandClientService>(<any>component).client).commandService.UpdateCommand = async (): Promise<Command> => {
        return targetCommand;
      };

      component.command = random.command();
      component.command.data = JSON.stringify({ foo: chance.string() }); 
      await component.updateCommand({ checkValidity: () => true });
      assert.deepEqual(component.command, targetCommand);
    });
  });

  describe("#removeCommand()", () => {
    it("should remove a commmand from the server", async () => {
      const commands: Map<number, Command> = new Map<number, Command>(random.commands().map((value: Command): any => [ value.id, value ]));
      (<FaceCommandClientService>(<any>component).client).commandService.RemoveCommand = async (commandId: number): Promise<void> => {
        commands.delete(commandId);
      }; 

       const targetId = Array.from(commands.keys())[0];
       component.command = commands.get(targetId);
       await component.removeCommand();
       assert.isFalse(commands.has(targetId));
    });
  });
  
  describe("#ngOnInit()", () => {
    it("should load command types from the server", async () => {
      const commandTypes = [];
      for (let i = 0; i < chance.integer({ min: 1, max: 20 }); i++) {
        commandTypes.push(chance.string());
      }

      (<FaceCommandClientService>(<any>component).client).commandService.GetCommandTypeNames = async (): Promise<string[]> => {
        return commandTypes.slice(0);
      };      

      await component.ngOnInit();
      assert.deepEqual(commandTypes, component.commandTypes);
    });

    it("should load existing command from the server", async () => {
      (<FaceCommandClientService>(<any>component).client).commandService.GetCommandTypeNames = async (): Promise<string[]> => {
        return [];
      };    
      
      const commands: Map<number, Command> = new Map<number, Command>(random.commands().map((value: Command): any => [ value.id, value ]));
      const matchingCommand = Array.from(commands)[0][1];
      (<FaceCommandClientService>(<any>component).client).commandService.GetCommand = async (commandId: number): Promise<Command> => {
        return commands.get(commandId);
      };    

      component.commandId = matchingCommand.id;

      await component.ngOnInit();
      assert.deepEqual(matchingCommand, component.command);
    });

    it("should load existing command from the server", async () => {
      (<FaceCommandClientService>(<any>component).client).commandService.GetCommandTypeNames = async (): Promise<string[]> => {
        return [];
      };    
    
      const command = random.command();
      const runCondition = random.runCondition();
      command.runConditions = [ runCondition ];

      (<FaceCommandClientService>(<any>component).client).commandService.GetCommand = async (commandId: number): Promise<Command> => {
        return command;
      };    
    
      await component.ngOnInit();
      assert.notIncludeOrderedMembers(component.runConditionTypes.map((listedRunCondition) => listedRunCondition[0]), command.runConditions.map((rc) => rc.runConditionType));
    });
  });
});
