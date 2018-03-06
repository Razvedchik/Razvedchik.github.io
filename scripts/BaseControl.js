define([
    'knockout',
    'utils',
    'Disposable'
], function(ko, utils, Disposable) {
    'use strict';

	var BaseControl = function (params) {
		params = params || {};
		
		Disposable.call(this);

		this.tn = utils.createObservableIfNot(params.templateName);
		this.afterRenderCallback = params.afterRender;
		this.isRendered = ko.observable(false);
		this.templateName = ko.computed({ read: this._getTn, write: this._setTn }, this);
        this.childControls = [];
        
		if (this.tn() != null)
			this.templateName(this.tn());
    };

    BaseControl.prototype = Object.create(Disposable.prototype);
    BaseControl.prototype.constructor = BaseControl;

    BaseControl.prototype._getTn = function() {
        return this.tn();
    }
    BaseControl.prototype._setTn = function(value) {
		this.tn(value);
    }
    
	BaseControl.prototype.afterRender = function (dom, item) {
		item.dom = dom;
		if (item.afterRenderCallback != undefined) {
			item.afterRenderCallback(item.dom, item);
		}
		item.isRendered(true);
    };
    
    var baseDispose = BaseControl.prototype.dispose;
	BaseControl.prototype.dispose = function () {
        baseDispose.call(this);

		for (var i = 0; i < this.childControls.length; i++) {
			if (this.childControls[i].dispose != undefined) {
				this.childControls[i].dispose();
			}
		}
	};

	return BaseControl;
});