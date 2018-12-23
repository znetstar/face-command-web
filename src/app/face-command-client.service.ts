import { Injectable } from '@angular/core';
import { EventEmitter2 } from 'eventemitter2';
import { MatSnackBar } from '@angular/material';
import { AppResources, CommandService, DetectionService, FaceManagementService, ConfigService } from "face-command-client";
import { AppErrorHandler } from './app-error-handler';
import { Face } from 'face-command-common';

@Injectable({
  providedIn: 'root'
})

export class FaceCommandClientService extends EventEmitter2 {
  public resources: AppResources;
  public commandService: CommandService;
  public detectionService: DetectionService;
  public faceManagementService: FaceManagementService;
  public configService: ConfigService

  constructor(private errors: AppErrorHandler, private snackbar: MatSnackBar) {
    super();
    this.resources = new AppResources(`${(location.protocol === 'https:') ? 'wss' : 'ws'}://${document.location.host}/rpc`);
    this.commandService = new CommandService(this.resources);
    this.detectionService = new DetectionService(this.resources);
    this.faceManagementService = new FaceManagementService(this.resources);
    this.configService = new ConfigService(this.resources);
  }

  public static async faceImageAsDataUri(face: Face): Promise<string> {
    return FaceCommandClientService.bufferAsDataUri(face.image, "image/png");
  }

  public static async bufferAsDataUri(buffer: Uint8Array, mime: string = "application/octet-stream"): Promise<string> {
    return `data:${mime};base64,`+btoa(String.fromCharCode.apply(null, buffer));
  }
}
