import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-face',
  templateUrl: './add-face.component.html',
  styleUrls: ['./add-face.component.scss']
})
export class AddFaceComponent implements OnInit {

  constructor(private snackbar: MatSnackBar) { }

  @ViewChild('faceDetails') faceDetails;

  ngOnInit() {
  }

  get face() { return this.faceDetails.face; }
  set face(val) { this.faceDetails.face = val; }

  clearFace() {
  	this.face = {};
  	this.faceDetails.imageUrl = "";
  }

  faceUpdated($event) {
  	this.snackbar.open(`Face updated`, "Dismiss", { duration: 2000 });
  }

  faceRemoved($event) {
  	this.snackbar.open(`Face removed`, "Dismiss", { duration: 2000 });
  	this.clearFace();
  }

  faceCreated($event) {
  	this.snackbar.open(`Face created`, "Dismiss", { duration: 2000 });
  }

}
