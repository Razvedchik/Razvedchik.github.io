define([
    'BasePopup',
    'Button'
], function(BasePopup, Button) {
    'use strict';
    
    var MessageBox = function(params) {
        params = params || {};

        params.buttons = params.buttons || [MessageBox.buttonType.ok]

        for (var i = 0; i < params.buttons.length; i++) {
            if (typeof params.buttons[i] !== 'number') continue;

            var button = new Button({
                text: this._getDefaultButtonText(params.buttons[i]),
                click: this._defaultButtonClick.bind(this, params.buttons[i])
            });

            params.buttons[i] = button;
        }

        BasePopup.call(this, params);
    };

    MessageBox.prototype = Object.create(BasePopup.prototype);
    MessageBox.prototype.constructor = MessageBox;

    MessageBox.prototype._defaultButtonClick = function(buttonType) {
        this.hide();
        this.resolve(buttonType);
        this.dispose();
    }

    MessageBox.prototype._getDefaultButtonText = function(buttonType) {
        switch (buttonType) {
            case MessageBox.buttonType.ok: {
                return 'Ок'
            }
            case MessageBox.buttonType.cancel: {
                return 'Отмена'
            }
            case MessageBox.buttonType.yes: {
                return 'Да'
            }
            case MessageBox.buttonType.no: {
                return 'Нет'
            }
        }

        return 'Unknown button type';
    }

    MessageBox.buttonType = {
        ok: 1,
        cancel: 2,
        yes: 3,
        no: 4
    };

    return MessageBox;
});