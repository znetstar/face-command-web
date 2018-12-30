import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatSnackBarModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatListModule, 
  MatSelectModule 
} from "@angular/material";
import { assert } from "chai";
import * as Chance from  "chance";

import { Face } from "face-command-common";
import Random from "face-command-common/lib/Random";

import { CommandDetailsComponent } from './command-details.component';
import { AddFacesComponent } from "../add-faces/add-faces.component";

describe('CommandDetailsComponent', () => {
  let component: CommandDetailsComponent;
  let fixture: ComponentFixture<CommandDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CommandDetailsComponent, 
        AddFacesComponent 
      ],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatInputModule,
        MatFormFieldModule,
        MatListModule,
        MatSelectModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("#constructor()", () => {
    it("should create", () => {
      assert.ok(component);
    });
  });
});
