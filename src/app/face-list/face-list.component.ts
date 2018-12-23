import { Face } from "face-command-common";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FaceCommandClientService } from '../face-command-client.service';

@Component({
  selector: 'app-face-list',
  templateUrl: './face-list.component.html',
  styleUrls: ['./face-list.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class FaceListComponent implements OnInit {
  public selectedFaces: Face[] = [];
  public selectFaces: boolean = false;
  constructor(private client: FaceCommandClientService, private router: Router, private snackbar: MatSnackBar) { }

  public faces: Face[] = [];

  public async removeFaces(): Promise<void> {
    for (const face of this.selectedFaces) {
      await this.client.faceManagementService.RemoveFace(face.id);
    }
    
    this.snackbar.open('Faces removed', 'Dismiss', { duration: 2000 });
    this.selectFaces = null;
    this.selectedFaces = this.faces = [];
  } 

  openAddFace() {
  	this.router.navigateByUrl("/add-face");
  }

  async ngOnInit() {
    this.faces = await this.client.faceManagementService.GetFaces();
  }
}
