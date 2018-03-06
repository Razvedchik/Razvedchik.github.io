define([
    'knockout',
    'utils',
    'BaseControl',
    'Popupable'
], function(ko, utils, BaseControl, Popupable) {
    'use strict';

    utils.loadCss('styles/css/BasePopup.css');
    
    var BasePopup = function(params) {
        params = params || {};
        params.templateName = params.templateName || 'BasePopup';
        if (params.afterRender != undefined) {
            var paramsAfterRender = params.afterRender;
            var inst = this;
            params.afterRender = function (dom, item) {
                paramsAfterRender(dom, item);
                inst.afterRenderPopupable(dom, item);
            }
        } else {
            params.afterRender = this.afterRenderPopupable;
        }

        BaseControl.call(this, params);

        this.title = params.title;
        this.message = params.message;
        this.buttons = params.buttons || [];

        this.id = params.id;
        this.visible = ko.observable(false);
        this.isModal = ko.observable(false);
    };

    BasePopup.prototype = Object.create(BaseControl.prototype);
    BasePopup.prototype.constructor = BaseControl;

    utils.extend(BasePopup, Popupable);

    BasePopup.prototype.show = function() {
        this.constructMainHtmlElement();

        this.visible(true);

        var inst = this;
        return new Promise(function(resolve, reject) {
            inst.resolve = resolve;
            inst.reject = reject;
        })
    };

    BasePopup.prototype.showModal = function() {
        this.constructMainHtmlElement();

        this.isModal(true);
        this.visible(true);

        var inst = this;
        return new Promise(function(resolve, reject) {
            inst.resolve = resolve;
            inst.reject = reject;
        })
    }

    BasePopup.prototype.hide = function() {
        this.visible(false);
    }

    var baseDispose = BasePopup.prototype.dispose;
    BasePopup.prototype.dispose = function() {
        if (this.visible()) this.visible(false);

        this.disposePopupable();

        baseDispose.call(this);
    }

    return BasePopup;
});