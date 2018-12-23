import { Face } from "face-command-common";
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FaceCommandClientService } from '../face-command-client.service';

@Component({
  selector: 'app-face-details',
  templateUrl: './face-details.component.html',
  styleUrls: ['./face-details.component.scss'],
  providers: [ FaceCommandClientService ]
})
export class FaceDetailsComponent implements OnInit {

  constructor(private client: FaceCommandClientService, private sanitizer: DomSanitizer) { }
  public face: any = {};
  public faceFromCamera: boolean = false;
  public isNewFace: boolean;
  @Input()
  public imageUrl: SafeUrl;
  private faceHasChanged: boolean = false;

  get faceId(): number {
  	return this.face.id;
  }

  @Input()
  set faceId(value: number) {
  	this.face.id = value;
	}
	
  async setImageUrl(): Promise<void> {
  	this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(await FaceCommandClientService.faceImageAsDataUri(this.face));
  }

  private async showFace(face: Face): Promise<void> {
	this.face = face;
	await this.setImageUrl();
  }

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

  @ViewChild('imageFile') imageFile;

  @Output() updated = new EventEmitter();
  async updateFace(form): Promise<void> {
	if (!form.checkValidity()) return;
	const face = await this.client.faceManagementService.UpdateFace(this.face, this.faceHasChanged, this.faceFromCamera);
	this.updated.emit(null);
	this.showFace(face);
  }

  @Output() removed = new EventEmitter();
  async removeFace() {
	await this.client.faceManagementService.RemoveFace(this.faceId);
	this.removed.emit(null);
  }

  fileAdded(event) {
  	const files: { [key: string]: File } = this.imageFile.nativeElement.files;
  	var file = files[0];
  	if (!file)
  		return;

  	this.imageFile.nativeElement.value = "";
	var reader  = new FileReader();

	reader.onloadend = () => {
		this.face.image = new Uint8Array(reader.result as ArrayBuffer);
	};

	reader.readAsArrayBuffer(file);
	this.faceHasChanged = true;
  }

  async ngOnInit() {
  	if (this.faceId) {
		this.showFace(await this.client.faceManagementService.GetFace(this.faceId));
  	} else {
  		this.isNewFace = true;
  	}
  }

}
