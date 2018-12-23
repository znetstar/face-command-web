import { Component, OnInit } from '@angular/core';
import { FaceCommandClientService } from '../face-command-client.service';
import { MatButton, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class SettingsComponent implements OnInit {
  public config: any;
  constructor(private client: FaceCommandClientService, public snackbar: MatSnackBar) { }

	public logLevels: any[] = [
		"error",
		"warn",
		"info",
		"verbose",
		"debug",
		"silly"
	];


	async updateSettings() {
		await this.client.configService.SetConfig(this.config);
		await this.client.configService.SaveConfig();

		this.snackbar.open("Settings updated", "Dismiss", { duration: 2000 });
	}

	public httpChange($event) {
		if (!$event.checked) {
			this.config.webInterface = false;
		}
	}


	async loadSettings() {
		this.config = await this.client.configService.GetConfig();
	}

  async ngOnInit() {
		await this.loadSettings();
  }

}
