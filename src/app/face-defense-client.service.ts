import { Injectable } from '@angular/core';
import { EventEmitter2 } from 'eventemitter2';
import base64js from 'base64-js';
import { AppErrorHandler } from './app-error-handler';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class FaceDefenseClientService extends EventEmitter2 {
  private ws : WebSocket;
  private callbackTable : Object;
  private idCount = 1;

  invoke(...params: any[]) {
  	var method = params.shift();

  	params = params
    .map((param) => {
  		if (param instanceof ArrayBuffer) {
  			param = new Uint8Array(param);
  		} 

  		if (param instanceof Uint8Array) {
  			return base64js.fromByteArray(param);
  		}

  		return param;
  	});
  	var message = {
  		"jsonrpc": "2.0",
  		method,
  		params,
  		id: this.idCount++
  	};
    var promise = new Promise((resolve, reject) => {
      this.callbackTable[message.id] = (error, result) => {
        if (error) reject(error);
        resolve(result);
      };
    });
    this.send(JSON.stringify(message), void(0));
    return promise;
  }

  onMessage(e) {
  	var data = JSON.parse(e.data);
  	if (data.id) {
  		var callback = this.callbackTable[data.id];
  		delete this.callbackTable[data.id];
  		if (data.error) {
  			var error = new Error(data.error.message);
  			callback(error);
  		} else {
  			callback(null, data.result);
  		}
  	} else if (data.error) {
  	    var error = new Error(data.error.message);
        throw error;
  	} else {
      this.emit.apply(this, [data.method].concat(data.params));
    }
  }

  send(message, callback) {
	    this.waitForConnection(() => {
	        this.ws.send(message);
	        if (typeof callback !== 'undefined') {
	           callback();
	        }
	    }, 1000);
	}

  waitForConnection(callback, interval) {
	    if (this.ws.readyState === 1) {
	        callback();
	    } else {
	        setTimeout(function (that) {
	            that.waitForConnection(callback, interval);
	        }, interval, this);
	    }
   }

   private has_been_open;
   connect(no_msg: boolean) {
    let ws_address = `ws://${document.location.host}/api`;
    this.ws = new WebSocket(ws_address);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = (error) => {
      if (!no_msg)
        this.errors.handleError(new Error('There was an error in communicating with the server'));
    };
    this.ws.onclose = () => {
      if (!no_msg && this.has_been_open)
        this.snackbar.open("Connection to the server has closed", 'Dismiss', { duration: 2000 });
      setTimeout(() => {
        this.connect(true);
      }, 5000);
    };
    this.ws.onopen = () => {
      this.has_been_open = true;
      //this.snackbar.open("Connection to the server established", 'Dismiss', { duration: 2000 });
    };
   }

  constructor(private errors: AppErrorHandler, private snackbar: MatSnackBar) {
  	super();
  	this.callbackTable = new Object();
    this.connect(false);
  }
}
