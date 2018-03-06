define([
	'BaseControl',
	'utils'
], function(BaseControl, utils) {
	'use strict';

	utils.loadCss('styles/css/Button.css');

	/**
	 * Обычная кнопка
	 */
	var Button = function(params) {
		params = params || {};
		params.templateName = params.templateName || 'Button';

		this.initParams = params;

		BaseControl.call(this, params);

		this.id = params.id ? params.id + '_click' : undefined;

		this.iconClass = utils.createObservableIfNot(params.iconClass);
		this.wait = utils.createObservableIfNot(params.wait, false);
		this.disabled = utils.createObservableIfNot(params.disabled, false);
		this.text = utils.createObservableIfNot(params.text, 'Default label');
		this.visible = utils.createObservableIfNot(params.visible, true);
		this.title = utils.createObservableIfNot(params.title);
		this.role = params.role || null;

		this.onClick = params.click;
		this.onMouseOver = params.mouseOver;
		this.onMouseOut = params.mouseOut;
	};

	Button.prototype = Object.create(BaseControl.prototype);
	Button.prototype.constructor = Button;

	Button.prototype.internalClick = function (item, event) {
		if (!this.wait() && !this.disabled() && this.onClick != null) {
			this.onClick.call(this);
		}
	};
	Button.prototype.mouseOver = function (model, event) {
		if (this.onMouseOver != null) {
			this.onMouseOver(model, event);
		}
	};
	Button.prototype.mouseOut = function (model, event) {
		if (this.onMouseOut != null) {
			this.onMouseOut(model, event);
		}
	};

	return Button;
});
