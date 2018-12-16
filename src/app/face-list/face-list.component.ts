import { Component, OnInit } from '@angular/core';
import { FaceDefenseClientService } from '../face-defense-client.service';
import { Router } from '@angular/router';
import { AppErrorHandler } from '../app-error-handler';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-face-list',
  templateUrl: './face-list.component.html',
  styleUrls: ['./face-list.component.scss'],
  providers: [ FaceDefenseClientService ]
})
export class FaceListComponent implements OnInit {
  public selectedFaces: any = [];
  public selectFaces: boolean = false;
  constructor(private client: FaceDefenseClientService, private router: Router, private errors: AppErrorHandler, private snackbar: MatSnackBar) { }

  public faces: any = [];

  removeFaces() {
    Promise.all(
      this.selectedFaces
      .map((face) => {
        return new Promise((resolve, reject) => {
          this.client.invoke("RemoveFace", face.ID)
            .then(() => {
              this.faces.splice(this.faces.indexOf(face), 1);
              resolve();
            })
            .catch(reject);
        });
      })
    )
    .then(() => {
      this.snackbar.open('Faces removed', 'Dismiss', { duration: 2000 });
      this.selectFaces = null;
      this.selectedFaces = [];
    })
    .catch((err) => this.errors.handleError(err));
  } 

  open_add_face() {
  	this.router.navigateByUrl("/add-face");
  }

  ngOnInit() {
  	this.client.invoke('GetFaces').then((faces) => {
  		this.faces = faces;
  	}).catch((err) => { this.errors.handleError(err); });
  }

}
