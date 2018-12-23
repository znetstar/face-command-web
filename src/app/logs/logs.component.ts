import { Component, OnInit } from '@angular/core';
import { LogEntry } from "face-command-common";
import { FaceCommandClientService } from "../face-command-client.service";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class LogsComponent implements OnInit {
  public entries: LogEntry[] = [ ];
  
  constructor(private client: FaceCommandClientService) { 
  }

  async ngOnInit() {
    this.client.logsService.on("LogEntry", (entry: LogEntry) => {
      this.entries.push(entry);
    });

    await this.client.logsService.StreamHistory(-1);
  }

}
