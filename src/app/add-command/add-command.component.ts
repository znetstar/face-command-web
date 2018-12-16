import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-command',
  templateUrl: './add-command.component.html',
  styleUrls: ['./add-command.component.scss']
})
export class AddCommandComponent implements OnInit {
  clearCommand() {
  	this.command.command = {};
  }

  created($event) {
	this.snackbar.open(`Command created`, "Dismiss", { duration: 2000 });
  }

  updated($event) {
	this.snackbar.open(`Command updated`, "Dismiss", { duration: 2000 });
  }

  removed($event) {
  	this.snackbar.open(`Command removed`, "Dismiss", { duration: 2000 });
  	this.clearCommand();
  }

  @ViewChild('command') command;
  constructor(private snackbar: MatSnackBar) { }

  ngOnInit() {
  }

}
