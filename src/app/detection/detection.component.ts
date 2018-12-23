import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FaceCommandClientService } from '../face-command-client.service';
import { AddFacesComponent } from '../add-faces/add-faces.component';
import { AppErrorHandler } from '../app-error-handler';
import { DetectionOptions, EigenFaceRecognizerOptions, Status } from 'face-command-common';

@Component({
  selector: 'app-control',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class DetectionComponent implements OnInit {
  constructor(private client: FaceCommandClientService, public snackbar: MatSnackBar, private errors: AppErrorHandler) { 

  }

  public autostartFaces: boolean = true;
  public isDetectionRunning: boolean;
  public detectionOptions: DetectionOptions = <any>{ faces: [] };
  public get selectedFaces() { return this.detectionOptions.faces; }
  public statusChanges: Status[] = [];
  public facesRecognizeEnum: Object = {
    0: "No faces have been detected",
    1:  "Faces have been detected",
    2: "Faces have been recognized",
    3: "Faces are still being detected are no longer being recognized",
    4: "Faces are no longer being detected"
  };

  autostartChange($event) {
  	if ($event.checked) {
      this.selectedFaces.splice(0, this.selectedFaces.length);
    }
    
  	this.autostartFaces = $event.checked;
  }

  async stopDetection() {
    await this.client.detectionService.StopDetection();
    this.statusChanges = [];
  }

  async startDetection() {
    this.statusChanges = [];
    await this.client.detectionService.StartDetection(this.detectionOptions);
  }

  async ngOnInit() {
    this.isDetectionRunning = await this.client.detectionService.IsDetectionRunning();
    const recOptions = new EigenFaceRecognizerOptions((await this.client.configService.GetConfigValue("eigenFaceRecognizerOptions:components")), (await this.client.configService.GetConfigValue("eigenFaceRecognizerOptions:threshold")));
    this.detectionOptions = new DetectionOptions((await this.client.configService.GetConfigValue("imageCaptureFrequency")), recOptions);
    this.client.detectionService.on("StatusChange", (status: Status) => {
      this.statusChanges.unshift(status);
    });

    this.client.detectionService.on("DetectionRunning", (running: boolean) => {
      if (running) {
        this.snackbar.open('Detection started', 'Dismiss', { duration: 2000 });
      } else {
        this.snackbar.open('Detection stopped', 'Dismiss', { duration: 2000 });
      }
      this.isDetectionRunning = running;
    });
  }

}
