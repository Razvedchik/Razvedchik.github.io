define([
    'BasePopup',
    'Button'
], function(BasePopup, Button) {
    'use strict';

    var Page = function() {
        this.popups = [];

        this.btnCreateSimplePopup = new Button({
            text: 'Create simple popup',
            click: this.createAndShowNewPopup.bind(this)
        });

        this.btnCreateSimpleModalPopup = new Button({
            text: 'Create simple modal popup',
            click: this.createAndShowNewPopup.bind(this, true)
        });
    }

    Page.prototype.createAndShowNewPopup = function(modal) {
        var popup = new BasePopup({
            title: 'Test Popup Title',
            message: 'Test Popup Message.',
            buttons: [
                new Button({
                    text: 'Ok',
                    click: function() {
                        popup.hide();
                        popup.resolve('Ok');
                        popup.dispose();
                    }
                }),
                new Button({
                    text: 'No',
                    click: function(resolve, reject) {
                        popup.hide();
                        popup.resolve('No');
                        popup.dispose();
                    }
                }),
            ]
        });

        if (modal) {
            popup.showModal().then(function(answer) { console.log(answer); });
        } else {
            popup.show().then(function(answer) { console.log(answer); });
        }

        this.popups.push(popup);
    }

    return Page;
});