import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaceCommandClientService } from '../face-command-client.service';
import { MatSnackBar } from '@angular/material';

/**
 * Displays a single face saved in the database
 */
@Component({
  selector: 'app-face-list-item',
  templateUrl: './face-list-item.component.html',
  styleUrls: ['./face-list-item.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class FaceListItemComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar) { }
  
  /**
   * ID of the existing face.
   */
  @Input()
  public id: Number;

  /**
   * Is called when a face has been successfuly updates.
   */
  faceUpdated() {
    this.snackBar.open('Face updated', 'Dismiss', { duration: 2000 });
  }

  /**
   * Is called when a face has been successfuly removed.
   */
  faceRemoved() {
    this.snackBar.open('Face removed', 'Dismiss', { duration: 2000 });
    this.router.navigateByUrl("/faces");   
  }

  /**
   * Extracts the ID paramater of the URL.
   */
  ngOnInit() {
  	this.id = +this.route.snapshot.params["id"];
  }
}
