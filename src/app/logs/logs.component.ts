import { Component, OnInit } from '@angular/core';
import { LogEntry } from "face-command-common";
import { FaceCommandClientService } from "../face-command-client.service";

/**
 * Displays logs from the server.
 */
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class LogsComponent implements OnInit {
  /**
   * Logs that have been sent from the server.
   */
  public entries: LogEntry[] = [ ];
  
  constructor(private client: FaceCommandClientService) { 
  }

  /**
   * Loads logs from the server. Listens for new log entries.
   */
  async ngOnInit() {
    this.client.logsService.on("LogEntry", (entry: LogEntry) => {
      this.entries.push(entry);
    });

    await this.client.logsService.StreamHistory(-1);
  }

}
