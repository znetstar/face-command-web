import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DetectionOptions, EigenFaceRecognizerOptions, Status } from 'face-command-common';
import { FaceCommandClientService } from '../face-command-client.service';
import { AppErrorHandler } from '../app-error-handler';
import { RPCModels } from 'face-command-client';

/**
 * Component that allows the user to control detection.
 */
@Component({
  selector: 'app-detection',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class DetectionComponent implements OnInit {
  constructor(private client: FaceCommandClientService, public snackbar: MatSnackBar, private errors: AppErrorHandler) { 

  }

  /**
   * Detection options that will be sent to the server.
   */
  public detectionOptions: DetectionOptions = <any>{ faces: [] };

  /**
   * Gets autostartFaces from detection options
   */
  public get autostartFaces(): boolean {
    return this.detectionOptions.autostartFaces;
  }
  /**
   * Sets autostartFaces from detection options
   */
  public set autostartFaces(value: boolean) {
    this.detectionOptions.autostartFaces = value;
  }

  /**
   * Faces currently added to detection options.
   */
  public get selectedFaces() { return this.detectionOptions.faces; }

  /**
   * Is true when detection is running.
   */
  public isDetectionRunning: boolean;

  /**
   * Status changes that have occured since detection started.
   */
  public lastStatus: Status;
  
  public formatStatusBrightness(status: Status) {
    return Math.round(status.brightness*100);
  }

  /**
   * Stops the detection session.
   */
  async stopDetection() {
    await this.client.detectionService.StopDetection();
    this.lastStatus = null;
  }

  /**
   * Attempts to start the detection session.
   */
  async startDetection() {
    this.lastStatus = null;
    await this.client.detectionService.StartDetection(this.detectionOptions);
  }

  /**
   * Retrieves detection information from the server.
   * Starts listening for stattus changes.
   */
  async ngOnInit() {
    this.isDetectionRunning = await this.client.detectionService.IsDetectionRunning();
    this.lastStatus = await this.client.detectionService.GetLastStatus();

    const recOptions = new EigenFaceRecognizerOptions((await this.client.configService.GetConfigValue("eigenFaceRecognizerOptions:components")), (await this.client.configService.GetConfigValue("eigenFaceRecognizerOptions:threshold")));
    this.detectionOptions = new DetectionOptions((await this.client.configService.GetConfigValue("imageCaptureFrequency")), recOptions);

    this.client.detectionService.on("StatusChange", (status: Status) => {
      this.lastStatus = status;
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
