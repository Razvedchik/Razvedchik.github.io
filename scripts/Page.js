define([
    'BasePopup',
    'Button',
    'MessageBox'
], function(BasePopup, Button, MessageBox) {
    'use strict';

    var Page = function() {
        this.popups = [];

        var inst = this;
        this.btnCreateSimplePopup = new Button({
            text: 'Create simple popup',
            click: function() {
                var popup = inst.createPopup();
                popup.show().then(function(answer) { console.log(answer); })
            }
        });

        this.btnCreateSimpleModalPopup = new Button({
            text: 'Create simple modal popup',
            click: function() {
                var popup = inst.createPopup();
                popup.showModal().then(function(answer) { console.log(answer); })
            }
        });

        this.btnCreateYesNoCancelMessageBox = new Button({
            text: 'Create YesNoCancel message box',
            click: function() {
                var popup = inst.createYesNoCancelMessageBox();
                popup.show().then(function(answer) { console.log(popup._getDefaultButtonText(answer)); })
            }
        });
    }

    Page.prototype.createPopup = function() {
        var popup = new BasePopup({
            title: 'Test Popup Title',
            message: 'Test Popup Message.',
            buttons: [
                new Button({
                    text: 'Да',
                    click: function() {
                        popup.hide();
                        popup.resolve('Да');
                        popup.dispose();
                    }
                }),
                new Button({
                    text: 'Нет',
                    click: function(resolve, reject) {
                        popup.hide();
                        popup.resolve('Нет');
                        popup.dispose();
                    }
                }),
            ]
        });

        this.popups.push(popup);

        return popup;
    }

    Page.prototype.createYesNoCancelMessageBox = function() {
        var popup = new MessageBox({
            title: 'Test MessageBox Title',
            message: 'Test MessageBox Message.',
            buttons: [
                MessageBox.buttonType.yes,
                MessageBox.buttonType.no,
                MessageBox.buttonType.cancel
            ]
        });

        this.popups.push(popup);

        return popup;
    }

    return Page;
});