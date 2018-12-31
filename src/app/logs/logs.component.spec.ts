import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { assert } from "chai";
import { MatSnackBarModule } from '@angular/material';
import Random from "face-command-common/lib/Random";

import { LogsComponent } from './logs.component';
import { FaceCommandClientService } from '../face-command-client.service';
import { LogEntry } from 'face-command-common';

const random = new Random();

describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsComponent ],
      imports: [
        BrowserAnimationsModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("#constructor()", () => {
    it('should create', () => {
      assert.ok(component);
    });
  });

  describe("#ngOnInit()", () =>{
    it("should add all log entries from the server to this.entries", async () => {
      const entries = random.logEntries();
      (<FaceCommandClientService>(<any>component).client).logsService.StreamHistory = async (start?): Promise<void> => {
        for (const entry of entries) 
          (<FaceCommandClientService>(<any>component).client).logsService.emit("LogEntry", entry);
      };

      (<FaceCommandClientService>(<any>component).client).logsService.on("LogEntry", (entry: LogEntry) => {
        assert.includeDeepMembers(entries, [ entry ]);
      });

      await component.ngOnInit();
    });
  });
});
