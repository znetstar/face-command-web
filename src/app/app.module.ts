import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
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
          MatInputModule,
          MatGridListModule,
          MatSnackBarModule
       } from '@angular/material';
import { NgxAutoScrollModule } from "ngx-auto-scroll";
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
import { LogsComponent } from './logs/logs.component';
import { FaceCommandClientService } from './face-command-client.service';

const hrefValue = localStorage["baseHref"] ? localStorage["baseHref"] : '/';
const baseHref = { provide: APP_BASE_HREF, useValue : hrefValue };

if (!localStorage["devMode"])
  enableProdMode();

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
    CommandListItemComponent,
    LogsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    NgxAutoScrollModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatGridListModule,
    MatSnackBarModule
  ],
  providers: [ {
     provide: ErrorHandler, useClass: AppErrorHandler }, 
     FaceCommandClientService,
     baseHref
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
