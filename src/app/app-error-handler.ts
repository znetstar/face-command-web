import { MatSnackBar } from '@angular/material';
import { ErrorHandler, Injectable, Injector, NgZone  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppErrorHandler {
	constructor(private snackbar: MatSnackBar, private injector: Injector, private zone: NgZone) {

	}

	handleError(error) {
		console.error(error.message)
		this.zone.run(() => {
			this.snackbar.open(error.message, "Dismiss", { duration: 2000 });
		});
	}
}