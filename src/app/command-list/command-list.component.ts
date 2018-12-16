import { Component, OnInit } from '@angular/core';
import { FaceDefenseClientService } from '../face-defense-client.service';
import { Router } from '@angular/router';
import { AppErrorHandler } from '../app-error-handler';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-command-list',
  templateUrl: './command-list.component.html',
  styleUrls: ['./command-list.component.scss'],
  providers: [ FaceDefenseClientService ]
})
export class CommandListComponent implements OnInit {
  public selectedCommands: any = [];
  public selectCommands: boolean = false;
  public commands: any = [];
  constructor(private client: FaceDefenseClientService, private router: Router, private errors: AppErrorHandler, private snackbar: MatSnackBar) { }


  open_add_command() {
  	this.router.navigateByUrl("/add-command");
  }

  removeCommands() {
  	Promise.all(
  		this.selectedCommands
  		.map((command) => {
  			return new Promise((resolve, reject) => {
  				this.client.invoke("RemoveCommand", command.ID)
  					.then(() => {
  						this.commands.splice(this.commands.indexOf(command), 1);
  						resolve();
  					})
  					.catch(reject);
  			});
  		})
  	)
  	.then(() => {
  		this.snackbar.open('Commands removed', 'Dismiss', { duration: 2000 });
  		this.selectCommands = null;
  		this.selectedCommands = [];
  	})
  	.catch((err) => this.errors.handleError(err));
  } 

  ngOnInit() {
  	this.client.invoke('GetCommands').then((commands) => {
  		this.commands = commands;
  	}).catch((err) => { this.errors.handleError(err); });
  }

}
