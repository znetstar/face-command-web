import { Injectable } from '@angular/core';
import { EventEmitter2 } from 'eventemitter2';
import { MatSnackBar } from '@angular/material';
import { arrayBufferToBlob, blobToDataURL } from 'blob-util'
import { AppResources, CommandService, DetectionService, FaceManagementService, ConfigService, LogsService } from "face-command-client";
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
  public configService: ConfigService;
  public logsService: LogsService;

  constructor(private errors: AppErrorHandler, private snackbar: MatSnackBar) {
    super();
    this.connect();
  }

  public static get defaultRPCUrl() { return `${(location.protocol === 'https:') ? 'wss' : 'ws'}://${document.location.host}/rpc`; }
  
  public rpcUrl: string = window.localStorage["rpcUrl"] || FaceCommandClientService.defaultRPCUrl;

  public async connect() {
    this.resources = new AppResources(this.rpcUrl);
    this.commandService = new CommandService(this.resources);
    this.detectionService = new DetectionService(this.resources);
    this.faceManagementService = new FaceManagementService(this.resources);
    this.configService = new ConfigService(this.resources);
    this.logsService = new LogsService(this.resources);
    await this.resources.rpcClient.connect();
  }

  public static get IMAGE_FORMAT() { return "image/png"; } 

  public static async faceImageAsDataUri(face: Face): Promise<string> {
    return blobToDataURL(arrayBufferToBlob(face.image, FaceCommandClientService.IMAGE_FORMAT))
  }
}
