
var UNAUTHORIZED_ERROR = 401;

cacuba.utils.get = function (url, data, callback, type) {
	"use strict";

	if (typeof data ===  "function") {
		type = type || callback;
		callback = data;
		data = undefined;
	}

	return cacuba.utils.ajax({
		url: url,
		type: "get",
		dataType: type,
		data: data,
		success: callback
	});
};

cacuba.utils.getJson = function (url, data, callback) {
	"use strict";

	return cacuba.utils.get(url, data, callback, "json");
};

cacuba.utils.getJsonp = function (url, data, callback) {
	"use strict";

	if (typeof data ===  "function") {
		callback = data;
		data = undefined;
	}

	return cacuba.utils.ajax({
		url: url,
		type: "get",
		dataType: "jsonp",
		data: data,
		success: callback,
		jsonp : "jsonpCallback"
	});
};

cacuba.utils.post = function (url, data, callback, type) {
	"use strict";

	if (typeof data ===  "function") {
		type = type || callback;
		callback = data;
		data = undefined;
	}

	return cacuba.utils.ajax({
		url: url,
		type: "post",
		dataType: type,
		data: data,
		success: callback
	});
};

cacuba.utils.ajax = function (url, options) {
	"use strict";

	// If url is an object
	if ( typeof url === "object" ) {
		options = url;
		url = undefined;
	}

	var settings = $.extend({}, options);

	settings.xhrFields = {
    withCredentials: true
  };

	// Function to set the ajax header.
	settings.beforeSend = function (request) {
		if (typeof request.setRequestHeader !== "undefined") {
			request.setRequestHeader("ajax", "true");
		}

		request.withCredentials = true;

		if (options.beforeSend) {
			options.beforeSend(request);
		}
	};

	settings.error = function (xhr, ajaxOptions, thrownError) {
		var location = null;

		if (xhr.status === UNAUTHORIZED_ERROR && location !== null) {
			if (options.securityHandler) {
				options.securityHandler(location);
			} else {
				cacuba.utils.handleLoginRequest(url, options, location);
			}
		} else if (options.error) {
			options.error(xhr, ajaxOptions, thrownError);
		}

	};

	return $.ajax(settings);
};





