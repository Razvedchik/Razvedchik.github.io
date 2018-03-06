define([
    'knockout',
    'utils',
    'jquery',
    'jqueryui'
], function(ko, utils, $) {
    'use strict';
    
    var Popupable = {}

    Popupable.constructMainHtmlElement = function() {
        if (this.mainHtmlElement != undefined) return;

        this._popupId = this.id || utils.generateGuid();
        this._parentHtmlElement = document.getElementsByTagName('body')[0];

        var popupPropertyName = 'popup_' + this._popupId;

        window.popups = window.popups || {};
        window.popups[popupPropertyName] = this;

        var mainHtmlElement = document.createElement('div');
        mainHtmlElement.setAttribute('data-bind', 'template: { name: window.popups[\'' + popupPropertyName + '\'].templateName(), data: window.popups[\'' + popupPropertyName + '\'], afterRender: window.popups[\'' + popupPropertyName + '\'].afterRender }');

        this._parentHtmlElement.appendChild(mainHtmlElement);
        this._mainHtmlElement = mainHtmlElement;

        ko.applyBindings(this, mainHtmlElement);
    };

    Popupable.afterRenderPopupable = function(dom) {
        $(".popup", dom).draggable({
            handle: $(".header", dom)
        });
        $(".header", dom).mousedown(function () {
            $(this).addClass('dragging');
        }).mouseup(function () {
            $(this).removeClass('dragging');
        });
    }

    Popupable.disposePopupable = function() {
        if (this._mainHtmlElement == undefined) return;

        this._parentHtmlElement.removeChild(this._mainHtmlElement);

        var popupPropertyName = 'popup_' + this._popupId;
        delete window.popups[popupPropertyName];
    };

    return Popupable;
});