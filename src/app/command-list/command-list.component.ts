import { Component, OnInit } from '@angular/core';
import { FaceCommandClientService } from '../face-command-client.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Command } from 'face-command-common';

@Component({
  selector: 'app-command-list',
  templateUrl: './command-list.component.html',
  styleUrls: ['./command-list.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class CommandListComponent implements OnInit {
  public selectedCommands: Command[] = [];
  public selectCommands: boolean = false;
  public commands: any = [];
  constructor(private client: FaceCommandClientService, private router: Router, private snackbar: MatSnackBar) { }


  openAddCommand() {
  	this.router.navigateByUrl("/add-command");
  }

  async removeCommands(): Promise<void> {
    for (const command of this.selectedCommands) {
      await this.client.commandService.RemoveCommand(command.id);
    }

	  this.snackbar.open('Commands removed', 'Dismiss', { duration: 2000 });
  } 

  async ngOnInit() {
	this.commands = await this.client.commandService.GetCommands();
  }

}
