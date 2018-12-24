import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FaceCommandClientService } from '../face-command-client.service';
import { Command } from 'face-command-common';


@Component({
  selector: 'app-command-details',
  templateUrl: './command-details.component.html',
  styleUrls: ['./command-details.component.scss'],
  providers: [ FaceCommandClientService ]
})

export class CommandDetailsComponent implements OnInit {
  public command: any = {  };
  public commandTypes: string[];
  public runConditionTypes: any[];
  public selectedRunCondition: any;
  public runConditionsEnum: any;
  public runConditionsSelected: any = [];

  get commandId(): number { return this.command.id; }
  @Input()
  set commandId(value: number) { this.command.id = value; }

  get firstSelectedCommand() {
  	return this.runConditionsSelected[0];
  }

  get facesToRecognizeOpen() {
  	return (this.runConditionsSelected.length === 1) && [2,5].some((n) => n === this.runConditionsSelected[0].runConditionType);
  }

  ftrChange(ftr) {
  	this.firstSelectedCommand.facesToRecognize = ftr;
  }

  runConditionSelected($event) {
  	const con = $event.value;
  	this.command.runConditions = (this.command.runConditions || []).concat({
  		facesToRecognize: [],
  		runConditionType: con.value
  	});
  	this.runConditionTypes.splice(this.runConditionTypes.indexOf(con), 1);
	  $event.source.value = null;
  }

  removeRunConditionsSelected() {
    for (const runCondition of this.runConditionsSelected) {
        this.command.runConditions.splice(this.command.runConditions.indexOf(runCondition), 1)[0];
    	this.runConditionTypes.push({ value: runCondition.runConditionType, label: this.runConditionsEnum[runCondition.runConditionType] });
    }
    this.runConditionsSelected = [];
  }

  getDataAndRunConditions() {
    const runConditions = this.command.runConditions.map((r) => {
      const { runConditionType, id } = r;
  		const facesToRecognize = (r.facesToRecognize && (r.facesToRecognize.length > 0 ? (r.facesToRecognize.map((f) => f.id)) : null)) || null;
  		return { runConditionType, id, facesToRecognize };
  	});	
  	const data = this.command.data ? JSON.parse(this.command.data) : null;

  	return { runConditions, data };
  }

  _updateCommand(command: Command) {
	  this.command = command;
	  this.created.emit(this.command);
  }

  async createCommand(form) {
  	if (!form.checkValidity() || !this.command.runConditions.length) 
  		return;

  	let { data, runConditions } = this.getDataAndRunConditions();
	  
	const command = await this.client.commandService.AddCommand(this.command.type, runConditions, this.command.name, data);
	this._updateCommand(command);
  }

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
    this.snackbar.open('Command updated', 'Dismiss', { duration: 2000 });
  }

  async removeCommand() {
    await this.client.commandService.RemoveCommand(this.commandId);
    this.removed.emit(null);	
  }

  @Output()
  public created = new EventEmitter();

  @Output()
  public updated = new EventEmitter();

  @Output()
  public removed = new EventEmitter();

  constructor(private client: FaceCommandClientService, private snackbar: MatSnackBar) {
  	this.runConditionsEnum = {
		0: 'Run when a face is detected',
		1: 'Run when any face is recognized',
		2: 'Run when specific faces are recognized',
		3: 'Run when no faces can be detected',
		4: 'Run when any face is no longer recognized',
		5: 'Run when specific faces are no longer recognized',
		6: 'Run when faces are no longer detected'
	};
  }
  public isNewCommand: boolean = false;
  async ngOnInit() {
    this.commandTypes = await this.client.commandService.GetCommandTypeNames();
    if (this.commandId) {
      this.command = await this.client.commandService.GetCommand(this.commandId);
    } else {
      this.isNewCommand = true;
    }
    this.runConditionTypes = Object.keys(this.runConditionsEnum)
      .map((i) => ({ value: +i, label: this.runConditionsEnum[i] }))
      .filter((listedCondition) => {  
        return !(this.command && this.command.id && (<Command>this.command).runConditions.some((condition) => condition.runConditionType === listedCondition.value));
      });
  }
}
