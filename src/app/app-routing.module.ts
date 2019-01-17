import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaceListComponent } from './face-list/face-list.component';
import { FaceListItemComponent } from './face-list-item/face-list-item.component';
import { SettingsComponent } from './settings/settings.component';
import { DetectionComponent } from './detection/detection.component';
import { AddFaceComponent } from './add-face/add-face.component';
import { CommandListComponent } from './command-list/command-list.component';
import { CommandListItemComponent } from './command-list-item/command-list-item.component';
import { AddCommandComponent } from './add-command/add-command.component';
import { LogsComponent } from "./logs/logs.component";

const routes: Routes = [
	{ path: '', component: DetectionComponent },
	{ path: 'faces', component: FaceListComponent },
	{ path: 'faces/:id', component: FaceListItemComponent },
	{ path: 'settings', component: SettingsComponent },
	{ path: 'detection', component: DetectionComponent },
	{ path: 'add-face', component: AddFaceComponent },
	{ path: 'commands', component: CommandListComponent },
	{ path: 'add-command', component: AddCommandComponent },
	{ path: 'commands/:id', component: CommandListItemComponent },
	{ path: 'logs', component: LogsComponent }
];

@NgModule({
  imports: [
	  RouterModule.forRoot(routes, {
		  useHash: Boolean(localStorage["useHash"])
	  })
	],
  exports: [RouterModule]
})
export class AppRoutingModule { }
