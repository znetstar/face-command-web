import { Component, OnInit, EventEmitter, Output, Input, ViewChild  } from '@angular/core';
import { FaceDefenseClientService } from '../face-defense-client.service';
import { AppErrorHandler } from '../app-error-handler';

@Component({
  selector: 'app-add-faces',
  templateUrl: './add-faces.component.html',
  styleUrls: ['./add-faces.component.scss'],
  providers: [ FaceDefenseClientService ]
})
export class AddFacesComponent implements OnInit {

  constructor(private client: FaceDefenseClientService, private errors: AppErrorHandler) { }
  private originalAllFaces: any;
  public allFaces: any;
  public selectedFacesSelected: any = [];
  @Input() selectedFaces: any = [];

  @Output() added = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() changed = new EventEmitter();
 
  @Output() clear = function() {
  	this.selectedFaces = [];
  	this.allFaces = this.originalAllFaces.slice(0);
  }

  selectFace($event) {
  	for (var faceIndex in this.allFaces) {
  		var face = this.allFaces.splice(this.allFaces.indexOf($event.value), 1)[0];
  		break;
  	}
  	this.selectedFaces.push(face);
  	this.added.emit(face);
    this.changed.emit(this.selectedFaces);
  	$event.source.value = null;
  }

  removeFace() {
    for (var face of this.selectedFacesSelected) {
      this.selectedFaces.splice(this.selectedFaces.indexOf(face), 1)[0];
    	this.allFaces.push(face);
    	this.removed.emit(face);
    }
    this.changed.emit(this.selectedFaces);
    this.selectedFacesSelected = [];
  }

  ngOnInit() {
    this.selectedFaces = this.selectedFaces || [];
  	this.client.invoke("GetFaces").then((faces) => {
  		this.originalAllFaces = faces;
  		this.allFaces = this.originalAllFaces.slice(0).filter((f) => (!this.selectedFaces.some((i) => f.ID === i.ID)));
  	}).catch((err) => { this.errors.handleError(err); });
  }

}
