import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FaceDefenseClientService } from '../face-defense-client.service';
import { AppErrorHandler } from '../app-error-handler';


@Component({
  selector: 'app-command-details',
  templateUrl: './command-details.component.html',
  styleUrls: ['./command-details.component.scss'],
  providers: [ FaceDefenseClientService ]
})

export class CommandDetailsComponent implements OnInit {
  public command: any = {  };
  public commandTypes: any;
  public runConditionTypes: any[];
  public selectedRunCondition: any;
  public runConditionsEnum: any;
  public runConditionsSelected: any = [];

  get commandId() { return this.command.ID; }
  @Input()
  set commandId(value) { this.command.ID = value; }

  get firstSelectedCommand() {
  	return this.runConditionsSelected[0];
  }

  get facesToRecognizeOpen() {
  	return (this.runConditionsSelected.length === 1) && [2,5].some((n) => n === this.runConditionsSelected[0].RunConditionType);
  }

  ftrChange(ftr) {
  	this.firstSelectedCommand.FacesToRecognize = ftr;
  }

  runConditionSelected($event) {
  	let con = $event.value;
  	this.command.RunConditions = (this.command.RunConditions || []).concat({
  		FacesToRecognize: [],
  		RunConditionType: con.value
  	});
  	this.runConditionTypes.splice(this.runConditionTypes.indexOf(con), 1)[0];
	  $event.source.value = null;
  }

  removeRunConditionsSelected() {
    for (var runCondition of this.runConditionsSelected) {
        this.command.RunConditions.splice(this.command.RunConditions.indexOf(runCondition), 1)[0];
    	this.runConditionTypes.push({ value: runCondition.RunConditionType, label: this.runConditionsEnum[runCondition.RunConditionType] });
    }
    this.runConditionsSelected = [];
  }

  getDataAndRunConditions() {
    let RunConditions = this.command.RunConditions.map((r) => {
  		let FacesToRecognize = (r.FacesToRecognize && (r.FacesToRecognize.length > 0 ? (r.FacesToRecognize.map((f) => f.ID)) : null)) || null;
  		return { RunConditionType: r.RunConditionType, FacesToRecognize };
  	});	
  	let Data = this.command.Data ? JSON.parse(this.command.Data) : null;

  	return { RunConditions, Data };
  }

  createCommand(form) {
  	if (!form.checkValidity() || !this.command.RunConditions.length) 
  		return;

  	let { Data, RunConditions } = this.getDataAndRunConditions();
  	
  	this.client.invoke('StoreCommand', this.command.Type, Data, RunConditions, this.command.Name)
  	.then((id) => {
  		this.commandId = id;
  		this.created.emit(this.command);
  	}).catch((err) => this.errors.handleError(err));
  }

  updateCommand(form) {
  	if (!form.checkValidity() || !this.command.RunConditions.length) 
  		return;

    let { Data, RunConditions } = this.getDataAndRunConditions();
    let { ID, Name, Type } = this.command;
    let cmd = {
    	Data,
    	RunConditions,
    	ID,
    	Name, 
      Type
    };

    this.client.invoke('UpdateCommand', cmd)
   	.then(() => {
   		this.updated.emit(null);
   	})
   	.catch((err) => this.errors.handleError(err));
  }

  removeCommand() {
  	this.client.invoke('RemoveCommand', this.command.ID)
  	.then(() => {
  		this.removed.emit(null);
  	})
   	.catch((err) => this.errors.handleError(err));  	
  }

  @Output()
  public created = new EventEmitter();

  @Output()
  public updated = new EventEmitter();

  @Output()
  public removed = new EventEmitter();

  constructor(private client: FaceDefenseClientService, private errors: AppErrorHandler) {
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
  public isNewCommand: boolean;
  ngOnInit() {
  	this.runConditionTypes = Object.keys(this.runConditionsEnum).map((i) => ({ value: Number(i), label: this.runConditionsEnum[i] }))
  	this.client.invoke('GetAvailableCommandTypes').then((types) => {
  		this.commandTypes = types;
  	}).catch((error) => this.errors.handleError(error));
  	if (this.commandId) {
  		this.client.invoke('GetCommand', this.commandId).then((command: any) => {
  			command.RunConditions.forEach((r, index) => {
  				let conditionType = this.runConditionTypes.filter((f) => f.value === r.RunConditionType)[0];
  				this.runConditionTypes.splice(this.runConditionTypes.indexOf(conditionType), 1);

  				if (r.FacesToRecognize) {
	  				Promise.all(r.FacesToRecognize.map((face_id) => this.client.invoke('GetFace', face_id))).then((faces) => {
	  					this.command.RunConditions[index].FacesToRecognize = faces;
	  				}).catch((err) => { this.errors.handleError(err); });
	  				command.RunConditions[index].FacesToRecognize = [];
	  			}
  			});

  			this.command = command;
  		}).catch((err) => { this.errors.handleError(err); });
  	} else {
  		this.isNewCommand = true;
  	}
  }

}
