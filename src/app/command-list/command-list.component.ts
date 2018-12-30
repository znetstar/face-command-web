import { Component, OnInit } from '@angular/core';
import { FaceCommandClientService } from '../face-command-client.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Command } from 'face-command-common';

/**
 * Component that lists commands saved in the database.
 */
@Component({
  selector: 'app-command-list',
  templateUrl: './command-list.component.html',
  styleUrls: ['./command-list.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class CommandListComponent implements OnInit {
  /**
   * Commands selected by the user.
   */
  public selectedCommands: Command[] = [];
  
  /**
   * When true the user can select multiple commands for deletion.
   */
  public selectCommands: boolean = false;

  /**
   * Commands from the database.
   */
  public commands: Command[] = [];

  constructor(private client: FaceCommandClientService, private router: Router, private snackbar: MatSnackBar) { }

  /**
   * Redirects to the add=command component
   */
  openAddCommand() {
  	this.router.navigateByUrl("/add-command");
  }

  /**
   * Removes selected commands from the database
   */
  async removeCommands(): Promise<void> {
    for (const command of this.selectedCommands) {
      await this.client.commandService.RemoveCommand(command.id);
    }

	  this.snackbar.open('Commands removed', 'Dismiss', { duration: 2000 });
  } 

  /**
   * Loads commands from the database.
   */
  async ngOnInit() {
	  this.commands = await this.client.commandService.GetCommands();
  }

}
