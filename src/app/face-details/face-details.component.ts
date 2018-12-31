import { Face } from "face-command-common";
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { blobToArrayBuffer } from "blob-util";
import { FaceCommandClientService } from '../face-command-client.service';

/**
 * This component lets the user view and modify faces.
 */
@Component({
  selector: 'app-face-details',
  templateUrl: './face-details.component.html',
  styleUrls: ['./face-details.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class FaceDetailsComponent implements OnInit {
  constructor(private client: FaceCommandClientService, private sanitizer: DomSanitizer) {

	}
	
	/**
	 * Underlying face object.
	 */
	public face: any = {};

	/**
	 * Indicates that a new image should be captured upon upload.
	 */
	public faceFromCamera: boolean = false;
	
	/**
	 * Is true when no ID is present on the underlying face.
	 */
  public get isNewFace(): boolean {
		return !this.faceId;
	}

	/**
	 * Face data-uri image url.
	 */
  @Input()
	public imageUrl: SafeUrl;
	
	/**
	 * Indicates wheather the server should scan the uploaded image for faces.
	 */
  private faceHasChanged: boolean = false;

	/**
	 * Returns the ID of the underlying face.
	 */
  get faceId(): number {
  	return this.face.id;
  }

	/**
	 * Sets the ID of the underlying face.
	 * @param id - ID to set.
	 */
  @Input()
  set faceId(value: number) {
  	this.face.id = value;
	}
	
	/**
	 * Converts the image property of the underlying face to a data-uri. The data-uri is assigned to the imageUrl property of the component. 
	 */
  async setImageUrl(): Promise<void> {
  	this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(await FaceCommandClientService.faceImageAsDataUri(this.face));
  }

	/**
	 * Replaces the underlying face, sets the data-uri of the face image. 
	 * @param face - Input face.
	 */
  private async showFace(face: Face): Promise<void> {
		this.face = face;
		await this.setImageUrl();
  }

	/**
	 * Sends properties of the underlying face to the server.
	 */
  @Output() created = new EventEmitter();
  async createFace(form): Promise<void> {
		if (!form.checkValidity() || (!this.faceFromCamera && !this.face.image)) return;
		let face: Face;
		if (this.faceFromCamera) {
			face = await this.client.faceManagementService.AddFaceFromCamera(this.face.name, this.face.autostart);
		} else {
			face = await this.client.faceManagementService.AddFace(this.face.image, this.face.name, this.face.autostart);
		}

		this.showFace(face);
		this.created.emit(this.face);
  }

	/**
	 * Reference to the image file input.
	 */
  @ViewChild('imageFile') private imageFile;

	/**
	 * Updates an existing face object with new properties.
	 */
  @Output() updated = new EventEmitter();
  async updateFace(form): Promise<void> {
		if (!form.checkValidity()) return;

		const face = await this.client.faceManagementService.UpdateFace(this.face, this.faceHasChanged, this.faceFromCamera);
		this.updated.emit(null);
		this.showFace(face);
  }

	/**
	 * Removes the face from the database.
	 */
  @Output() removed = new EventEmitter();
  async removeFace() {
		await this.client.faceManagementService.RemoveFace(this.faceId);
		this.removed.emit(null);
  }

	/**
	 * Converts the image uploaded using the file input into a Uint8Array and assigns it to the image property of the underlying face object.
	 */
  async fileAdded() {
  	const files: { [key: string]: File } = this.imageFile.nativeElement.files;
		const file = files[0];
		if (!file)
			return;

		this.face.image = new Uint8Array(await blobToArrayBuffer(file));
  }

	/**
	 * If the ID input is set, downloads the matching face.
	 */
  async ngOnInit() {
		if (!this.isNewFace)
			await this.showFace(await this.client.faceManagementService.GetFace(this.faceId));
  }

}
