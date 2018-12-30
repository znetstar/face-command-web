import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { CommandDetailsComponent } from '../command-details/command-details.component';

/***
 * Component that handles creating commands.
 */
@Component({
  selector: 'app-add-command',
  templateUrl: './add-command.component.html',
  styleUrls: ['./add-command.component.scss']
})
export class AddCommandComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(private snackbar: MatSnackBar) { 

  }

  /**
   * @ignore
   */
  ngOnInit() {

  }

  /**
   * References the underlying command in thte "command-details" component.
   */
  @ViewChild('commandDetails') public commandDetails: CommandDetailsComponent;

  /**
   * Clears the underlying command.
   */
  clearCommand() {
    this.commandDetails.command = {};
  }

  /**
   * Is called when a command has been sucessfully created.
   */
  created() {
    this.snackbar.open(`Command created`, "Dismiss", { duration: 2000 });
  }

  /**
   * Is called when a command has been sucessfully updated.
   */
  updated() {
    this.snackbar.open(`Command updated`, "Dismiss", { duration: 2000 });
  }

  /**
   * Is called when a command has been sucessfully removed.
   */
  removed() {
  	this.snackbar.open(`Command removed`, "Dismiss", { duration: 2000 });
  	this.clearCommand();
  }
}
