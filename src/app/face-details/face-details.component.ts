import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FaceDefenseClientService } from '../face-defense-client.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppErrorHandler } from '../app-error-handler';

@Component({
  selector: 'app-face-details',
  templateUrl: './face-details.component.html',
  styleUrls: ['./face-details.component.scss'],
  providers: [ FaceDefenseClientService ]
})
export class FaceDetailsComponent implements OnInit {

  constructor(private client: FaceDefenseClientService, private sanitizer: DomSanitizer, private errors: AppErrorHandler) { }

  public face: any = {};
  public faceFromCamera: boolean = false;
  public isNewFace: boolean;
  @Input()
  private _imageUrl: any = "";
  private faceHasChanged: boolean = false;

  get faceId() {
  	return this.face.ID;
  }

  @Input()
  set faceId(value) {
  	this.face.ID = value;
  }

  get imageUrl() {
  	return this._imageUrl;
  }

  set imageUrl(value) {
  	this._imageUrl = this.sanitizer.bypassSecurityTrustUrl(value);
  }

  setImageUrl() {
  	this.imageUrl = "data:image/jpeg;base64,"+this.face.Image;
  }

  _updateFace(face) {
  	return new Promise((resolve, reject) => { 
		this.face = face;
		this.setImageUrl();
		resolve()
	});
  }

  @Output() created = new EventEmitter();
  createFace(form) {
    if (!form.checkValidity() || (!this.faceFromCamera && !this.face.Image)) return;
  	if (this.faceFromCamera) {
  		this.client.invoke('AddFaceFromCamera', this.face.Name, this.face.Autostart)
  		.then((id) => this.client.invoke('GetFace', id))
  		.then(this._updateFace.bind(this))
  		.then((face) => { this.created.emit(this.face); })
  		.catch((err) => { this.errors.handleError(err); });
  	} else {
  		this.client.invoke('AddFace', this.face.Image, this.face.Name, this.face.Autostart)
  		.then((id) => this.client.invoke('GetFace', id))
  		.then(this._updateFace.bind(this))
  		.then(() => this.created.emit(this.face))
  		.catch((err) => { this.errors.handleError(err); });
  	}
  }

  @ViewChild('imageFile') imageFile;

  @Output() updated = new EventEmitter();
  updateFace(form) {
    if (!form.checkValidity()) return;
    this.client.invoke('UpdateFace', this.face, this.faceHasChanged, this.faceFromCamera).then(() => { 
    	this.updated.emit(null); 
    	this.client.invoke('GetFace', this.faceId)
    	.then(this._updateFace.bind(this));
    }).catch((err) => { this.errors.handleError(err); });
  }

  @Output() removed = new EventEmitter();
  removeFace() {
    this.client.invoke('RemoveFace', this.faceId).then(() => {
    	this.removed.emit(null);
    }).catch((err) => { this.errors.handleError(err); });
  }

  fileAdded(event) {
  	const files: { [key: string]: File } = this.imageFile.nativeElement.files;
  	var file = files[0];
  	if (!file)
  		return;

  	this.imageFile.nativeElement.value = "";
	var reader  = new FileReader();

	reader.addEventListener("load", () => {
		this.imageUrl = reader.result;
		this.face.Image = reader.result.toString().split(';base64,').pop();
	}, false);

	reader.readAsDataURL(file);
	this.faceHasChanged = true;
  }

  ngOnInit() {
  	if (this.faceId) {
  		this.client.invoke('GetFace', this.faceId).then((face) => {
  			this.face = face;
  			this.setImageUrl();
  		}).catch((err) => { this.errors.handleError(err); });;
  	} else {
  		this.isNewFace = true;
  	}
  }

}
