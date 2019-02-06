/**
 * Modified version of
 * https://stackoverflow.com/questions/14218607/javascript-loading-progress-of-an-image 
 */
var Loader = function(url, callbacks) {
	var xmlHTTP = new XMLHttpRequest();
	var notifiedNotComputable = 0;

	if (!callbacks || (typeof callbacks !== 'object')) {
		callbacks = {};
	}

	xmlHTTP.open('GET', url, true);
	xmlHTTP.responseType = 'blob';

	xmlHTTP.onload = function() {
		if ((this.status.toString())[0] != 2) {
			return;
		}

		var blob = this.response;
		var obj = URL.createObjectURL(blob);

		if (callbacks.complete) {
			callbacks.complete(obj);
		}
	};

	xmlHTTP.onprogress = function(e) {
		if (!e.lengthComputable) {
			if (!notifiedNotComputable && callbacks.notComputable) {
				notifiedNotComputable = 1;
				callbacks.notComputable();
			}

			return;
		}
		
		if (callbacks.progress) {
			callbacks.progress(e.loaded, e.total);
		}
	};

	xmlHTTP.onloadstart = function() {
		if (callbacks.start) {
			callbacks.start();
		}
	};

	xmlHTTP.onloadend = function() {
		if (callbacks.end) {
			callbacks.end();
		}
	};

	xmlHTTP.onerror = function () {
		if (callbacks.error) {
			callbacks.error();
		}
	};

	xmlHTTP.send();
};


Image.prototype.load = function(url, callbacks)
{
	var self = this;
	var delayedHandler = callbacks.complete;

	callbacks.complete = function(obj) {
		self.src = obj;
	};

	self.onload = function(e) {
		if (delayedHandler) {
			delayedHandler(self);
		}
	};

	return new Loader(url, callbacks);
};

Audio.prototype.load = function(url, callbacks)
{
	var self = this;
	var delayedHandler = callbacks.complete;

	callbacks.complete = function(obj) {
		self.src = obj;

		if (delayedHandler) {
			delayedHandler(self);
		}
	};

	return new Loader(url, callbacks);
};

var Video = function() {};

Video.prototype.load = function(url, callbacks)
{
	var video = document.createElement('video');
	var delayedHandler = callbacks.complete;

	callbacks.complete = function(obj) {
		video.src = obj;

		if (delayedHandler) {
			delayedHandler(video);
		}
	};

	return new Loader(url, callbacks);
};