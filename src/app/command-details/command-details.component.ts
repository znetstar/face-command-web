import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Command, RunConditionType, RunCondition } from 'face-command-common';

import { FaceCommandClientService } from '../face-command-client.service';

/**
 * A component that displays the details of a command.
 */
@Component({
  selector: 'app-command-details',
  templateUrl: './command-details.component.html',
  styleUrls: ['./command-details.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class CommandDetailsComponent implements OnInit {
  /**
   * Underlying command object.
   */
  public command: any = {  };
  
  /**
   * List of command types names.
   */
  public commandTypes: string[];

  /**
   * List of run condition types that will be displayed to the user.
   */
  public runConditionTypes: any[];
  
  /**
   * The currently selected run condition for editing.
   */
  public selectedRunCondition: RunCondition;

  /**
   * Enum mapping run condition type number to text that will be displayed to the user. 
   */
  public runConditionsEnum: Map<RunConditionType, string> = new Map<RunConditionType, string>([
    [ +RunConditionType.RunOnFaceDetected, "Run when a face is detected" ],
    [ +RunConditionType.RunOnAnyFaceRecognized, "Run when any face is recognized" ],
    [ +RunConditionType.RunOnSpecificFacesRecognized, "Run when specific faces are recognized" ],
    [ +RunConditionType.RunOnNoFacesDetected, "Run when no faces can be detected" ],
    [ +RunConditionType.RunOnAnyFaceNoLongerRecognized, "Run when any face is no longer recognized" ],
    [ +RunConditionType.RunOnSpecificFacesNoLongerRecognized, "Run when specific faces are no longer recognized" ],
    [ +RunConditionType.RunOnFacesNoLongerDetected, "Run when faces are no longer detected" ]
  ])

  /**
   * Run conditions currently selected.
   */
  public runConditionsSelected: any = [];


  @Output()
  public created = new EventEmitter();

  @Output()
  public updated = new EventEmitter();

  @Output()
  public removed = new EventEmitter();

  /**
   * ID if the currently loaded command. If this is a new command the ID will be empty.
   * Setting the ID before calling ngOnInit will load the retireve that corresponding command from the server.
   */
  get commandId(): number { return this.command.id; }
  @Input()
  set commandId(value: number) { this.command.id = value; }

  /**
   * Is true if a commad hasn't been sent to or loaded from the server.
   */
  public get isNewCommand(): boolean {
    return typeof(this.commandId) === 'undefined';
  }

  /**
   * Returns the first run condition selected.
   */
  get firstSelectedRunCondition(): RunCondition {
  	return this.runConditionsSelected[0];
  }

  /**
   * Determines if the `AddFaces` component should be shown to add faces to `RunCondition.facesToRecognize`.
   */
  get facesToRecognizeOpen() {
  	return (this.runConditionsSelected.length === 1) && [(+RunConditionType.RunOnSpecificFacesRecognized), (+RunConditionType.RunOnSpecificFacesNoLongerRecognized)].some((n) => n === this.firstSelectedRunCondition.runConditionType);
  }

  constructor(private client: FaceCommandClientService, private snackbar: MatSnackBar) {  
  }

  /**
   * Moves faces selected in the `AddFaces` component to the first run condition selected
   * @param ftr - Faces from the `AddFaces` component
   */
  ftrChange(faces) {
  	this.firstSelectedRunCondition.facesToRecognize = faces;
  }

  /**
   * Adds the selected run condition type to the list of run conditions of the command, removing the type from the array of types.
   * @param $event 
   */
  runConditionSelectionChange($event) {
  	const runConditionType = $event.value;
  	this.command.runConditions = (this.command.runConditions || []).concat({
  		facesToRecognize: [],
  		runConditionType: runConditionType[0]
  	});
  	this.runConditionTypes.splice(this.runConditionTypes.indexOf(runConditionType), 1);
	  $event.source.value = null;
  }

  /**
   * Removes run conditions seleted from the array of run conditions of the command, adding the type to the list of types.
   */
  removeRunConditionsSelected() {
    for (const runCondition of this.runConditionsSelected) {
      this.command.runConditions.splice(this.command.runConditions.indexOf(runCondition), 1)[0];
    	this.runConditionTypes.push([ runCondition.runConditionType, this.runConditionsEnum.get(runCondition.runConditionType) ]);
    }
    this.runConditionsSelected = [];
  }

  /**
   * Formats the run conditions and additonal command data. 
   */
  getDataAndRunConditions() {
    const runConditions = this.command.runConditions.map((r) => {
      const { runConditionType, id } = r;
  		const facesToRecognize = (r.facesToRecognize && (r.facesToRecognize.length > 0 ? (r.facesToRecognize.map((f) => f.id)) : null)) || null;
  		return { runConditionType, id, facesToRecognize };
  	});	
  	const data = this.command.data ? JSON.parse(this.command.data) : null;

  	return { runConditions, data };
  }

  /**
   * Replaces the underlying command component.
   * @param command - Command to replace with.
   */
  _updateCommand(command: Command) {
	  this.command = command;
	  this.created.emit(this.command);
  }

  /**
   * Sends the underlying command's properties to the server.
   *  
   * @param form - Angular form. 
   * @async
   */
  async createCommand(form) {
  	if (!form.checkValidity() || !this.command.runConditions.length) 
  		return;

  	let { data, runConditions } = this.getDataAndRunConditions();
	  
    const command = await this.client.commandService.AddCommand(this.command.type, runConditions, this.command.name, data);
    this._updateCommand(command);
    this.created.emit(this.command);
  }

  /**
   * Updates an existing command on the server.
   * @param form - Angular form.
   * @async
   */
  async updateCommand(form) {
  	if (!form.checkValidity() || !this.command.runConditions.length) 
  		return;

    const { data, runConditions } = this.getDataAndRunConditions();
    const { id, name, type } = this.command;
    const command = {
    	data,
    	runConditions,
    	id,
    	name, 
      type
    };

	  const updatedCommand =  await this.client.commandService.UpdateCommand(command);
    this._updateCommand(updatedCommand);
    this.updated.emit(this.command);
  }

  /**
   * Removes the command from the server.
   * 
   * @async
   */
  async removeCommand() {
    await this.client.commandService.RemoveCommand(this.commandId);
    this.removed.emit(null);	
  }
  
  /**
   * Loads the command types from the server.
   * If a commandId has been set will attempt to retrieve command data from the server.
   * @async
   */
  async ngOnInit() {
    this.commandTypes = await this.client.commandService.GetCommandTypeNames();

    if (!this.isNewCommand) {
      this.command = await this.client.commandService.GetCommand(this.commandId);
    }

    this.runConditionTypes = 
      Array.from(this.runConditionsEnum)
      .filter((listedCondition) => {  
        return !(!this.isNewCommand && (<Command>this.command).runConditions.some((condition) => condition.runConditionType === listedCondition[0]));
      });
  }
}
