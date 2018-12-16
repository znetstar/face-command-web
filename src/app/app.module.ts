import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialComponents } from './material-components';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, 
          MatButtonModule,
          MatSidenavModule, 
          MatIconModule, 
          MatListModule,
          MatTableModule,
          MatOptionModule,
          MatSelectModule,
          MatCheckboxModule,
          MatInputModule
       } from '@angular/material';
import { FaceListComponent } from './face-list/face-list.component';
import { FaceListItemComponent } from './face-list-item/face-list-item.component';
import { SettingsComponent } from './settings/settings.component';
import { AppErrorHandler } from './app-error-handler';
import { FormsModule } from '@angular/forms';
import { DetectionComponent } from './detection/detection.component';
import { AddFacesComponent } from './add-faces/add-faces.component';
import { AddFaceComponent } from './add-face/add-face.component';
import { FaceDetailsComponent } from './face-details/face-details.component';
import { CommandListComponent } from './command-list/command-list.component';
import { CommandDetailsComponent } from './command-details/command-details.component';
import { AddCommandComponent } from './add-command/add-command.component';
import { CommandListItemComponent } from './command-list-item/command-list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    FaceListComponent,
    FaceListItemComponent,
    DetectionComponent,
    SettingsComponent,
    AddFacesComponent,
    AddFaceComponent,
    FaceDetailsComponent,
    CommandListComponent,
    CommandDetailsComponent,
    AddCommandComponent,
    CommandListItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MaterialComponents,
    LayoutModule,
    MaterialComponents,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule
  ],
  providers: [{provide: ErrorHandler, useClass: AppErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
