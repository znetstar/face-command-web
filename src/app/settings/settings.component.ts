import { Component, OnInit } from '@angular/core';
import { FaceCommandClientService } from '../face-command-client.service';
import { MatSnackBar } from '@angular/material';

/**
 * Allows the user to modify application settings
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class SettingsComponent implements OnInit {
	/**
	 * Object with configuration properties.
	 */
	public config: any;

	constructor(private client: FaceCommandClientService, public snackbar: MatSnackBar) { }

	/**
	 * Winton log levels.
	 */
	public logLevels: string[] = [
		"error",
		"warn",
		"info",
		"verbose",
		"debug",
		"silly",
		"silent"
	];
	

	public classifiers: string[] = [];

	/**
	 * URL to RPC endpoint.
	 */
	public rpcUrl: string = this.client.rpcUrl;

	/**
	 * Indicates wheather errors should be logged to browser console.
	 */
	public logErrors: boolean = Boolean(localStorage["logErrors"]);

	/**
	 * Resets the RPC URL to application default.
	 */
	public resetRPCUrl() {
		this.rpcUrl = FaceCommandClientService.defaultRPCUrl;
	}

	/**
	 * Sends modified configuration properties to the server and (if possible) saves config to the disk.
	 * If the RPC property is changed will reconnect to the server on the new URL.
	 */
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

	/**
	 * Fires when the HTTP Server property is modified.
	 * @param $event
	 */
	public httpChange($event) {
		if (!$event.checked) {
			this.config.webInterface = false;
		}
	}

	/**
	 * (If possible) loads config from the disk, then retrieves the full configuration.
	 */
	async loadSettings() {
		await this.client.configService.LoadConfig();
		this.config = await this.client.configService.GetConfig();
	}

	/**
	 * Loads config from the server.
	 */
	async ngOnInit() {
		await this.loadSettings();
		this.classifiers = this.config.cascadeClassifiers.map((c) => c.key);
	}
}
