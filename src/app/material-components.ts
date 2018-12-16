import {MatButtonModule, MatCheckboxModule,MatGridListModule,MatSnackBarModule} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule,MatGridListModule,MatSnackBarModule],
  exports: [MatButtonModule, MatCheckboxModule,MatGridListModule,MatSnackBarModule],
})

export class MaterialComponents { }