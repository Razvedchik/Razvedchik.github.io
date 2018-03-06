define([
	'knockout'
], function(ko) {

	var loggingId = 0;
	var utils = {};

	/**
	 * Метод на основе переданного значения создает observable-поле.
	 * Если переданное значение уже является observable-полем, то метод его возвращает без изменений
	 */
	utils.createObservableIfNot = function(initVariable, defaultValue) {
		return (initVariable == undefined)
			? ko.observable(defaultValue)
			: ko.isObservable(initVariable) || ko.isComputed(initVariable) ? initVariable : ko.observable(initVariable);
	};

	utils.getCookie = function(name) {
		if (!name) {
			return undefined;
		}
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)")); //ignore jslint
		return matches ? decodeURIComponent(matches[1]) : undefined;
	};

	/**
	 * Создает подписки для логирования состояния при автотестах.
	 * @param {object} params - параметры для логирования
	 * @param {string} params.name - название сущности (для удобства поиска в логах)
	 * @param {object} params.context - сущность, для которой настраивается логирование
	 * @param {array} params.fieldsToLog - массив полей для логирования их значений. Каждое поле описывается в виде объекта
	 * @param {string} params.fieldsToLog[].name - название поля (для удобства поиска в логах)
	 * @param {object} params.fieldsToLog[].field - само поле. В случае, если является observable-полем - на изменение его значения будет создана подписка с логированием изменения
	 * @param {object} params.methodsToLog - массив методов для логирования. Каждый метод описывается в виде объекта
	 * @param {string} params.methodsToLog[].name - название метода (для удобства поиска в логах)
	 * @param {string} params.methodsToLog[].method - сам метод
	 * @param {string} params.methodsToLog[].needLogArguments - если true, то логирует аргументы, скоторыми вызван метод
	 * @param {bool} parame.needLogStackTrace - если true, то при логировании будет писаться stackTrace места логирования
	 */
	utils.createLoggingSubscriptionsForAutotests = function(params) {
		var internalLoggingId = loggingId++;

		var logCommonPrefix = params.name + ' loggingId=' + internalLoggingId;

		logFullState(params, logCommonPrefix + ' created.')

		var subscriptions = [];
		if (params.fieldsToLog != null && params.fieldsToLog.length > 0) {
			for (var i = 0; i < params.fieldsToLog.length; i++) {
				if (ko.isObservable(params.fieldsToLog[i].field) || ko.isComputed(params.fieldsToLog[i].field)) {
					subscriptions.push(params.fieldsToLog[i].field.subscribe(logNewValue.bind(null, logCommonPrefix + ', ' + params.fieldsToLog[i].name + '=', params.needLogStackTrace)));
				}
			}
		}

		if (params.methodsToLog && params.methodsToLog.length > 0) {
			for (var i = 0; i < params.methodsToLog.length; i++) {
				createMethodCallSubscription(logCommonPrefix, params.needLogStackTrace, params.context, params.methodsToLog[i]);
			}
		}

		if (params.context.dispose != null) {
			var baseDispose = params.context.dispose;
			params.context.dispose = function() {
				baseDispose.call(params.context);

				for (var j = 0; j < subscriptions.length; j++) {
					subscriptions[j].dispose();
				}

				logFullState(params, logCommonPrefix + ' destroyed.')
			}
		}
	};

	var logNewValue = function(prefix, needLogStackTrace, newValue) {
		console.log(prefix + newValue);
		if (needLogStackTrace) console.log((new Error('Stack trace')).stack);
	};

	var logFullState = function(params, prefix) {
		var log = prefix;

		if (params.fieldsToLog != null && params.fieldsToLog.length > 0) {
			for (var i = 0; i < params.fieldsToLog.length; i++) {
				log += ' ' + params.fieldsToLog[i].name + '=';
				if (ko.isObservable(params.fieldsToLog[i].field) || ko.isComputed(params.fieldsToLog[i].field)) {
					log += params.fieldsToLog[i].field();
				} else {
					log += params.fieldsToLog[i].field;
				}
				log += '.';
			}
		}

		console.log(log);
		if (params.needLogStackTrace) console.log((new Error('Stack trace')).stack);
	}

	var createMethodCallSubscription = function(prefix, needLogStackTrace, context, methodToLog) {
		for (var key in context) {
			if (context[key] != methodToLog.method) continue;

			var baseMethod = methodToLog.method;
			context[key] = function() {
				console.log(prefix + '. ' + methodToLog.name + ' call start.');
				if (needLogStackTrace) console.log((new Error('Stack trace')).stack);

				var result = baseMethod.apply(context, arguments);

				console.log(prefix + '. ' + methodToLog.name + ' call end.');
				if (needLogStackTrace) console.log((new Error('Stack trace')).stack);

				return result;
			};

			return;
		}

		console.log(prefix + '. Could not found method named ' + methodToLog + '.');
    }
    
    utils.generateGuid = function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
      
    var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	
	utils.loadCss = function(url) {
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;
		document.getElementsByTagName("head")[0].appendChild(link);
	}

	utils.extend = function(object)
	{
		var mixins = Array.prototype.slice.call(arguments, 1);
		
		for (var i = 0; i < mixins.length; ++i)
		{
			for (var prop in mixins[i])
			{
				if (typeof object.prototype[prop] === "undefined")
				{
					object.prototype[prop] = mixins[i][prop];
				}
			}
		}
	}

	return utils;
})
