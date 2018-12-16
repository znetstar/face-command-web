import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FaceDefenseClientService } from '../face-defense-client.service';
import { AddFacesComponent } from '../add-faces/add-faces.component';
import { AppErrorHandler } from '../app-error-handler';

@Component({
  selector: 'app-control',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.scss'],
  providers: [ FaceDefenseClientService ]
})
export class DetectionComponent implements OnInit {

  constructor(private client: FaceDefenseClientService, public snackbar: MatSnackBar, private errors: AppErrorHandler) { 
  	this.detectionOptions = {
  		Faces: []
  	};
  }

  public autostartFaces: boolean = true;
  public isDetectionRunning: any = null;
  public detectionOptions: any = {};
  public selectedFaces: any = [];
  public statusChanges: any = [];
  public facesRecognizeEnum: Object = {
    0: "No faces have been detected",
    1:  "Faces have been detected",
    2: "Faces have been recognized",
    3: "Faces are still being detected are no longer being recognized",
    4: "Faces are no longer being detected"

  };

  autostartChange($event) {
  	if ($event.checked) {
  		this.selectedFaces = [];
  	}

  	this.autostartFaces = $event.checked;
  }

  stopDetection() {
  	this.client.invoke("StopDetection").then(() => {
  		this.isDetectionRunning = false;
  		this.snackbar.open("Detection stopped", "Dismiss", { duration: 2000 });
  	})
    .catch((err) => { this.errors.handleError(err); });
  }

  startDetection() {
    this.statusChanges = [];
  	this.detectionOptions.Faces = this.selectedFaces.map((f) => f.ID);
  	this.client.invoke("StartDetection", this.detectionOptions, this.autostartFaces).then(() => {
  		this.isDetectionRunning = true;
  		this.snackbar.open('Detection started', 'Dismiss', { duration: 2000 });
  	})
    .catch((err) => { this.errors.handleError(err); });
  }

  ngOnInit() {
  	this.client.invoke("IsDetectionRunning").then((isDetectionRunning) => this.isDetectionRunning = isDetectionRunning).catch((err) => { this.errors.handleError(err); });
  	this.client.invoke("GetConfigValue", "ImageCaptureFrequency").then((val) => this.detectionOptions.Frequency = val).catch((err) => { this.errors.handleError(err); });
    this.client.invoke("PollForStatusChanges").then(() => {
      this.client.on("UpdateStatusChange", (statusChange) => {
        this.statusChanges.unshift(statusChange);
      });
    });
  }

}
