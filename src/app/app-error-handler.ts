import { MatSnackBar } from '@angular/material';
import { ErrorHandler, Injectable, Injector, NgZone  } from '@angular/core';
import { ServerError } from "face-command-client/node_modules/multi-rpc-browser/lib/index";

@Injectable({
  providedIn: 'root'
})

export class AppErrorHandler {
	constructor(private snackbar: MatSnackBar, private injector: Injector, private zone: NgZone) {

	}

	handleError(originalError) {
		let error = originalError.rejection ? originalError.rejection : originalError;
		console.error(error, error.data)
		this.zone.run(() => {
			let message = error.message;
			if (error instanceof ServerError && error.data)
				message = error.data.message;
			
			this.snackbar.open(message, "Dismiss", { duration: 2000 });
		});
	}
}