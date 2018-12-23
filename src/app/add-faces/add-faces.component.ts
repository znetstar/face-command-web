import { Component, OnInit, EventEmitter, Output, Input, ViewChild  } from '@angular/core';
import { Face } from "face-command-common";
import { FaceCommandClientService } from '../face-command-client.service';

@Component({
  selector: 'app-add-faces',
  templateUrl: './add-faces.component.html',
  styleUrls: ['./add-faces.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class AddFacesComponent implements OnInit {

  constructor(private client: FaceCommandClientService) { }
  private originalAllFaces: Face[] = [];
  public allFaces: Face[] = [];
  public selectedFacesSelected: Face[] = [];

  @Input() selectedFaces: Face[] = [];

  @Output() added = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() changed = new EventEmitter();
 
  @Output() clear = function() {
  	this.selectedFaces = [];
  	this.allFaces = this.originalAllFaces.slice(0);
  }

  selectFace($event) {
    const face = this.allFaces.splice(this.allFaces.indexOf($event.value), 1)[0];
  	this.selectedFaces.push(face);
  	this.added.emit(face);
    this.changed.emit(this.selectedFaces);
  	$event.source.value = null;
  }

  removeFace() {
    for (const face of this.selectedFacesSelected) {
      this.selectedFaces.splice(this.selectedFaces.indexOf(face), 1)[0];
    	this.allFaces.push(face);
    	this.removed.emit(face);
    }
    this.changed.emit(this.selectedFaces);
    this.selectedFacesSelected = [];
  }

  async ngOnInit() {
    this.selectedFaces = this.selectedFaces || [];

    const faces = await this.client.faceManagementService.GetFaces();
    this.originalAllFaces = faces;
    this.allFaces = this.originalAllFaces.slice(0).filter((f) => (!this.selectedFaces.some((i) => f.id === i.id)));
  }
}
