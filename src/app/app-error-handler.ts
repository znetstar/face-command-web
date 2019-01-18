import { MatSnackBar } from '@angular/material';
import { ErrorHandler, Injectable, Injector, NgZone  } from '@angular/core';
import { ServerError } from "multi-rpc-common";

@Injectable({
  providedIn: 'root'
})

export class AppErrorHandler {
	constructor(private snackbar: MatSnackBar, private injector: Injector, private zone: NgZone) {

	}

	handleError(originalError) {
		let error = originalError.rejection ? originalError.rejection : originalError;
		
		if (!error) return;

		let message = error.message;
		let stack = error.stack;
		if (error instanceof ServerError && error.data) {
			message = error.data.message;
			stack = error.data.stack;
		}
	
		if (stack && localStorage['logErrors'])
			console.error(stack);
		
		this.zone.run(() => {
			if (message)
				this.snackbar.open(message, "Dismiss", { duration: 2000 });
		});
	}
}