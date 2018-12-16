import { Component, OnInit } from '@angular/core';
import { FaceDefenseClientService } from '../face-defense-client.service';
import { MatButton, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [ FaceDefenseClientService ]
})
export class SettingsComponent implements OnInit {
  public config: any;
  constructor(private client: FaceDefenseClientService, public snackbar: MatSnackBar) { }
	private dataSource: Array<any>;
	private originalConfig;

	updateSettings() {
		var promises = Object.keys(this.config).map((key) => {
			var value = this.config[key];
			var promise = null;
			if (value !== this.originalConfig[key]) {
				promise = this.client.invoke("SetConfigValue", key, value);
			}
			this.originalConfig[key] = value;
			return promise;
		}).filter(Boolean);
		var alldone = Promise.all(promises);
		alldone.then(() => {
			this.snackbar.open("Settings updated", "Dismiss", { duration: 2000 });
		});
		return alldone;
	}
  ngOnInit() {
  	this.client.invoke('GetConfig').then((result) => {
  		this.originalConfig = JSON.parse(JSON.stringify(result));
  		this.config = result;
  	});
  }

}
