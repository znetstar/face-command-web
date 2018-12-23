import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaceCommandClientService } from '../face-command-client.service';
import { MatSnackBar,MatCheckbox } from '@angular/material';

@Component({
  selector: 'app-face-list-item',
  templateUrl: './face-list-item.component.html',
  styleUrls: ['./face-list-item.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class FaceListItemComponent implements OnInit {

  constructor(private client: FaceCommandClientService, private route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar) { }
  public id: Number;


  faceUpdated() {
    this.snackBar.open('Face updated', 'Dismiss', { duration: 2000 });
  }

  faceRemoved() {
    this.snackBar.open('Face removed', 'Dismiss', { duration: 2000 });
    this.router.navigateByUrl("/faces");   
  }

  ngOnInit() {
  	this.id = Number(+this.route.snapshot.params["id"]);
  }

}
