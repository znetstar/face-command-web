import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { FaceDetailsComponent } from "../face-details/face-details.component";

/**
 * Component for creating faces.
 */
@Component({
  selector: 'app-add-face',
  templateUrl: './add-face.component.html',
  styleUrls: ['./add-face.component.scss']
})
export class AddFaceComponent implements OnInit {
  /**
   * Underlying face details component.
   */
  @ViewChild('faceDetails')  faceDetails: FaceDetailsComponent;

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
   * Passthrough to the face property on the underlying face details component.
   */
  get face() { return this.faceDetails.face; }
  set face(val) { this.faceDetails.face = val; }

  /**
   * Clears the values on the underlying face details object.
   */
  clearFace() {
  	this.face = {};
  	this.faceDetails.imageUrl = "";
  }

  /**
   * Is called when a face is created.
   */
  faceCreated() {
  	this.snackbar.open(`Face created`, "Dismiss", { duration: 2000 });
  }

  /**
   * Is called when a face is removed.
   */
  faceRemoved() {
  	this.snackbar.open(`Face removed`, "Dismiss", { duration: 2000 });
  	this.clearFace();
  }

  /**
   * Is called when a face is updated.
   */
  faceUpdated() {
  	this.snackbar.open(`Face updated`, "Dismiss", { duration: 2000 });
  }
}
