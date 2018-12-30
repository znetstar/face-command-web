import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';
import { Face } from "face-command-common";
import { FaceCommandClientService } from '../face-command-client.service';

/**
 * Component that allows the user to select faces.
 */
@Component({
  selector: 'app-add-faces',
  templateUrl: './add-faces.component.html',
  styleUrls: ['./add-faces.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class AddFacesComponent implements OnInit {

  /**
   * @ignore
   */
  constructor(private client: FaceCommandClientService) { }

  /**
   * Bank of faces retrieved from the server.
   */
  private allFaces: Face[] = [];

  /**
   * Bank of faces that can be selected.
   * This array contains faces from `this.allFaces` not currently in `this.selectedFaces`.
   */
  public faces: Face[] = [];

  /**
   * Faces currently selected by the user.
   * This array contains faces from `this.allFaces` not currently in `this.faces`.
   */
  @Input() selectedFaces: Face[] = [];

  /**
   * Faces currently selected from the pool of existing selected faces.
   * Faces in this array will be moved from `this.selectedFaces` to `this.faces` if the user triggers `this.removeFaces()`.
   */
  public selectedFacesSelected: Face[] = [];

  /**
   * This event fires when a face has been moved from `this.faces` to `this.selectedFaces`.
   */
  @Output() added = new EventEmitter();

  /**
   * This event fires when a face has been moved from `this.selectedFaces` to `this.faces`.
   */
  @Output() removed = new EventEmitter();

   /**
   * This event fires when a face has been moved from `this.selectedFaces` to `this.faces` or vice-versa.
   */
  @Output() changed = new EventEmitter();

  /**
   * This event fires when a face has been selected from the list of selected faces.
   */
  @Output() selected = new EventEmitter();
 
  /**
   * Resets all of the arrays.
   */
  @Output() clear = function() {
    this.selectedFaces = [];
    this.selectedFacesSelected = [];
  	this.faces = this.allFaces.slice(0);
  }

  /**
   * Moves a face from `this.faces` to `this.selectedFaces`.
   * @param $event
   */
  selectFace($event) {
    const face = this.faces.splice(this.faces.indexOf($event.value), 1)[0];
  	this.selectedFaces.push(face);
  	this.added.emit(face);
    this.changed.emit(this.selectedFaces);
  	$event.source.value = null;
  }

  /**
   * Moves any faces in `this.selectedFacesSelected` from `this.selectedFaces` to `this.faces`. 
   */
  removeFaces() {
    for (const face of this.selectedFacesSelected) {
      this.selectedFaces.splice(this.selectedFaces.indexOf(face), 1)[0];
    	this.faces.push(face);
    	this.removed.emit(face);
    }
    this.changed.emit(this.selectedFaces);
    this.selectedFacesSelected = [];
  }

  /**
   * Retrieves faces from the database.
   */
  async ngOnInit() {
    this.allFaces = await this.client.faceManagementService.GetFaces();
    this.faces = this.allFaces.slice(0).filter((f: Face) => (!this.selectedFaces.some((i: Face) => f.id === i.id)));
  }
}
