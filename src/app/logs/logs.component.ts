import { Component, OnInit } from '@angular/core';
import { LogEntry } from "face-command-common";
import { uniq } from "lodash";
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
  public entries: LogEntry[] = [];
  
  constructor(private client: FaceCommandClientService) { 
  }

  onLogEntry(entry: LogEntry) {
    let equal = false;
    for (const existingEntry of this.entries) {
      if (entry.id.length !== existingEntry.id.length ) 
        continue;

      for (let i = 0; i < entry.id.length; i++) {
        if (entry.id[i] === existingEntry.id[i])
          equal = true;
        else {
          equal = false;
          break;
        }
      }
      if (equal)
        break;
    }
    if (!equal)
      this.entries.push(entry);
  }

  /**
   * Loads logs from the server. Listens for new log entries.
   */
  async ngOnInit() {
    this.client.logsService.on("LogEntry", this.onLogEntry.bind(this));

    await this.client.logsService.StreamHistory(-1);

    (<any>window).entries = this.entries;
  }

}
