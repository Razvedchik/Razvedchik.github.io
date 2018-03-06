define([
	'knockout'
], function(ko) {
	var Disposable = function() {
		this.subscriptions = [];
	};

	Disposable.prototype.dispose = function() {
		for (var i = 0; i < this.subscriptions.length; i++) {
			this.subscriptions[i].dispose && this.subscriptions[i].dispose();
		}

		this.subscriptions.splice(this.subscriptions.length);
	};

	Disposable.prototype.createComputedField = function() {
		var computed = ko.computed.apply(ko, arguments);
		this.subscriptions.push(computed);
		return computed;
	}

	Disposable.prototype.createPureComputedField = function() {
		var computed = ko.pureComputed.apply(ko, arguments);
		this.subscriptions.push(computed);
		return computed;
	}

	return Disposable;
});
