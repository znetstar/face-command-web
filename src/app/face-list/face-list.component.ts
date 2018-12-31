import { Face } from "face-command-common";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FaceCommandClientService } from '../face-command-client.service';

/**
 * Component lists faces stored in the database.
 */
@Component({
  selector: 'app-face-list',
  templateUrl: './face-list.component.html',
  styleUrls: ['./face-list.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class FaceListComponent implements OnInit {
  /**
   * Faces currently selected for deletion.
   */
  public selectedFaces: Face[] = [];

  /**
   * When true the user can select multiple commands for deletion.
   */
  public selectFaces: boolean = false;

  /**
   * Faces from the database.
   */
  public faces: Face[] = [];

  constructor(private client: FaceCommandClientService, private router: Router, private snackbar: MatSnackBar) { }

  /**
   * Removes selected faces from the database.
   */
  public async removeFaces(): Promise<void> {
    for (const face of this.selectedFaces) {
      await this.client.faceManagementService.RemoveFace(face.id);
    }
    
    this.snackbar.open('Faces removed', 'Dismiss', { duration: 2000 });
    this.selectFaces = null;
    this.selectedFaces = this.faces = [];
  } 

  /**
   * Redirects to the add=face component
   */
  openAddFace() {
  	this.router.navigateByUrl("/add-face");
  }

  /**
   * Loads faces from the database.
   */
  async ngOnInit() {
    this.faces = await this.client.faceManagementService.GetFaces();
  }
}
