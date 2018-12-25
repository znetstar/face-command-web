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


	public rpcUrl: string = this.client.rpcUrl;
	public logErrors: boolean = Boolean(localStorage["logErrors"]);

	public resetRPCUrl() {
		this.rpcUrl = FaceCommandClientService.defaultRPCUrl;
	}

	async updateSettings() {
		if (this.rpcUrl !== this.client.rpcUrl) {
			localStorage["rpcUrl"] = this.rpcUrl;
			this.client.rpcUrl = this.rpcUrl;
			await this.client.connect();
		}

		if (this.logErrors !== Boolean(localStorage["logErrors"])) {
			if (this.logErrors)
				localStorage["logErrors"] = 1;
			else
				localStorage.removeItem("logErrors");
		}

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
