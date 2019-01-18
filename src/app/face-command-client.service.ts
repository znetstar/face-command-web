import { Injectable } from '@angular/core';
import { EventEmitter2 } from 'eventemitter2';
import { MatSnackBar } from '@angular/material';
import { arrayBufferToBlob, blobToDataURL } from 'blob-util'
import { AppResources, CommandService, DetectionService, FaceManagementService, ConfigService, LogsService } from "face-command-client";
import { Face, LogEntry } from 'face-command-common';
import { Transport, PersistentTransport } from "multi-rpc-common";
import { Client as RPCClient } from "multi-rpc-core";
import { MsgPackSerializer } from "multi-rpc-msgpack-serializer";
import { WebSocketClientTransport } from "multi-rpc-websocket-client-side-transport";
import { ElectronTransport } from "multi-rpc-electron-transport";
import { AppErrorHandler } from './app-error-handler';

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

  protected onTransportDisconnect() {
    this.errors.handleError(new Error(`Disconnected from the server`));

    this.rpcClient.transport.removeListener('disconnect', this.transportDisconnect);
  }

  protected transportDisconnect = this.onTransportDisconnect.bind(this);

  public get rpcClient(): RPCClient {
    return this.resources.rpcClient;
  }

  public get transport(): Transport {
    return this.rpcClient.transport;
  }

  public logEntriesToDisplay: string[] = [
    "warn",
    "error",
    "info"
  ];

  public logMessages(entry: LogEntry) {
    if (this.logEntriesToDisplay.some((level) => level === entry.level))
      this.snackbar.open(entry.message, "Dismiss", { duration: 2000 });
  }

  public get usingElectron(): Boolean { return Boolean(localStorage["electronChannel"]); }

  public async connect() {
    const electronChannel = localStorage["electronChannel"];
    const serializer = new MsgPackSerializer();
    let transport: PersistentTransport;

    if (electronChannel) {
      transport = new ElectronTransport(serializer, electronChannel, eval(`window.nodeRequire("electron");`));
    }
    else {
      transport = new WebSocketClientTransport(serializer, this.rpcUrl);
    }

    this.resources = new AppResources(transport);
  
    this.commandService = new CommandService(this.resources);
    this.detectionService = new DetectionService(this.resources);
    this.faceManagementService = new FaceManagementService(this.resources);
    this.configService = new ConfigService(this.resources);
    this.logsService = new LogsService(this.resources);
    transport.on("error", (error) => {
      this.errors.handleError(error);
    });

    transport.on("disconnect", this.transportDisconnect);
    transport.on("connect", () => {
      transport.on("disconnect", this.transportDisconnect);
    });

    transport.on("reconnected", () => {
      this.snackbar.open("Connection re-established", "Dismiss", { duration: 2000 });
    });

    this.logsService.on("LogEntry", this.logMessages.bind(this));

    await this.resources.rpcClient.connect();
  }

  public static get IMAGE_FORMAT() { return "image/png"; } 

  public static async faceImageAsDataUri(face: Face): Promise<string> {
    return blobToDataURL(arrayBufferToBlob(face.image, FaceCommandClientService.IMAGE_FORMAT))
  }
}
