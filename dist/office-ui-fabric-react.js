var Fabric =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.bundle.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../common/temp/node_modules/@microsoft/load-themed-styles/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
/**
 * An IThemingInstruction can specify a rawString to be preserved or a theme slot and a default value
 * to use if that slot is not specified by the theme.
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// IE needs to inject styles using cssText. However, we need to evaluate this lazily, so this
// value will initialize as undefined, and later will be set once on first loadStyles injection.
var _injectStylesWithCssText;
// Store the theming state in __themeState__ global scope for reuse in the case of duplicate
// load-themed-styles hosted on the page.
var _root = (typeof window === 'undefined') ? global : window; // tslint:disable-line:no-any
var _themeState = initializeThemeState();
/**
 * Matches theming tokens. For example, "[theme: themeSlotName, default: #FFF]" (including the quotes).
 */
// tslint:disable-next-line:max-line-length
var _themeTokenRegex = /[\'\"]\[theme:\s*(\w+)\s*(?:\,\s*default:\s*([\\"\']?[\.\,\(\)\#\-\s\w]*[\.\,\(\)\#\-\w][\"\']?))?\s*\][\'\"]/g;
/** Maximum style text length, for supporting IE style restrictions. */
var MAX_STYLE_CONTENT_SIZE = 10000;
var now = function () { return (typeof performance !== 'undefined' && !!performance.now) ? performance.now() : Date.now(); };
function measure(func) {
    var start = now();
    func();
    var end = now();
    _themeState.perf.duration += end - start;
}
/**
 * initialize global state object
 */
function initializeThemeState() {
    var state = _root.__themeState__ || {
        theme: undefined,
        lastStyleElement: undefined,
        registeredStyles: []
    };
    if (!state.runState) {
        state = __assign({}, (state), { perf: {
                count: 0,
                duration: 0
            }, runState: {
                flushTimer: 0,
                mode: 0 /* sync */,
                buffer: []
            } });
    }
    if (!state.registeredThemableStyles) {
        state = __assign({}, (state), { registeredThemableStyles: [] });
    }
    _root.__themeState__ = state;
    return state;
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load
 * event is fired.
 * @param {string | ThemableArray} styles Themable style text to register.
 * @param {boolean} loadAsync When true, always load styles in async mode, irrespective of current sync mode.
 */
function loadStyles(styles, loadAsync) {
    if (loadAsync === void 0) { loadAsync = false; }
    measure(function () {
        var styleParts = Array.isArray(styles) ? styles : splitStyles(styles);
        if (_injectStylesWithCssText === undefined) {
            _injectStylesWithCssText = shouldUseCssText();
        }
        var _a = _themeState.runState, mode = _a.mode, buffer = _a.buffer, flushTimer = _a.flushTimer;
        if (loadAsync || mode === 1 /* async */) {
            buffer.push(styleParts);
            if (!flushTimer) {
                _themeState.runState.flushTimer = asyncLoadStyles();
            }
        }
        else {
            applyThemableStyles(styleParts);
        }
    });
}
exports.loadStyles = loadStyles;
/**
 * Allows for customizable loadStyles logic. e.g. for server side rendering application
 * @param {(processedStyles: string, rawStyles?: string | ThemableArray) => void}
 * a loadStyles callback that gets called when styles are loaded or reloaded
 */
function configureLoadStyles(loadStylesFn) {
    _themeState.loadStyles = loadStylesFn;
}
exports.configureLoadStyles = configureLoadStyles;
/**
 * Configure run mode of load-themable-styles
 * @param mode load-themable-styles run mode, async or sync
 */
function configureRunMode(mode) {
    _themeState.runState.mode = mode;
}
exports.configureRunMode = configureRunMode;
/**
 * external code can call flush to synchronously force processing of currently buffered styles
 */
function flush() {
    measure(function () {
        var styleArrays = _themeState.runState.buffer.slice();
        _themeState.runState.buffer = [];
        var mergedStyleArray = [].concat.apply([], styleArrays);
        if (mergedStyleArray.length > 0) {
            applyThemableStyles(mergedStyleArray);
        }
    });
}
exports.flush = flush;
/**
 * register async loadStyles
 */
function asyncLoadStyles() {
    return setTimeout(function () {
        _themeState.runState.flushTimer = 0;
        flush();
    }, 0);
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load event
 * is fired.
 * @param {string} styleText Style to register.
 * @param {IStyleRecord} styleRecord Existing style record to re-apply.
 */
function applyThemableStyles(stylesArray, styleRecord) {
    if (_themeState.loadStyles) {
        _themeState.loadStyles(resolveThemableArray(stylesArray).styleString, stylesArray);
    }
    else {
        _injectStylesWithCssText ?
            registerStylesIE(stylesArray, styleRecord) :
            registerStyles(stylesArray);
    }
}
/**
 * Registers a set theme tokens to find and replace. If styles were already registered, they will be
 * replaced.
 * @param {theme} theme JSON object of theme tokens to values.
 */
function loadTheme(theme) {
    _themeState.theme = theme;
    // reload styles.
    reloadStyles();
}
exports.loadTheme = loadTheme;
/**
 * Clear already registered style elements and style records in theme_State object
 * @option: specify which group of registered styles should be cleared.
 * Default to be both themable and non-themable styles will be cleared
 */
function clearStyles(option) {
    if (option === void 0) { option = 3 /* all */; }
    if (option === 3 /* all */ || option === 2 /* onlyNonThemable */) {
        clearStylesInternal(_themeState.registeredStyles);
        _themeState.registeredStyles = [];
    }
    if (option === 3 /* all */ || option === 1 /* onlyThemable */) {
        clearStylesInternal(_themeState.registeredThemableStyles);
        _themeState.registeredThemableStyles = [];
    }
}
exports.clearStyles = clearStyles;
function clearStylesInternal(records) {
    records.forEach(function (styleRecord) {
        var styleElement = styleRecord && styleRecord.styleElement;
        if (styleElement && styleElement.parentElement) {
            styleElement.parentElement.removeChild(styleElement);
        }
    });
}
/**
 * Reloads styles.
 */
function reloadStyles() {
    if (_themeState.theme) {
        var themableStyles = [];
        for (var _i = 0, _a = _themeState.registeredThemableStyles; _i < _a.length; _i++) {
            var styleRecord = _a[_i];
            themableStyles.push(styleRecord.themableStyle);
        }
        if (themableStyles.length > 0) {
            clearStyles(1 /* onlyThemable */);
            applyThemableStyles([].concat.apply([], themableStyles));
        }
    }
}
/**
 * Find theme tokens and replaces them with provided theme values.
 * @param {string} styles Tokenized styles to fix.
 */
function detokenize(styles) {
    if (styles) {
        styles = resolveThemableArray(splitStyles(styles)).styleString;
    }
    return styles;
}
exports.detokenize = detokenize;
/**
 * Resolves ThemingInstruction objects in an array and joins the result into a string.
 * @param {ThemableArray} splitStyleArray ThemableArray to resolve and join.
 */
function resolveThemableArray(splitStyleArray) {
    var theme = _themeState.theme;
    var themable = false;
    // Resolve the array of theming instructions to an array of strings.
    // Then join the array to produce the final CSS string.
    var resolvedArray = (splitStyleArray || []).map(function (currentValue) {
        var themeSlot = currentValue.theme;
        if (themeSlot) {
            themable = true;
            // A theming annotation. Resolve it.
            var themedValue = theme ? theme[themeSlot] : undefined;
            var defaultValue = currentValue.defaultValue || 'inherit';
            // Warn to console if we hit an unthemed value even when themes are provided, but only if "DEBUG" is true.
            // Allow the themedValue to be undefined to explicitly request the default value.
            if (theme && !themedValue && console && !(themeSlot in theme) && typeof DEBUG !== 'undefined' && DEBUG) {
                console.warn("Theming value not provided for \"" + themeSlot + "\". Falling back to \"" + defaultValue + "\".");
            }
            return themedValue || defaultValue;
        }
        else {
            // A non-themable string. Preserve it.
            return currentValue.rawString;
        }
    });
    return {
        styleString: resolvedArray.join(''),
        themable: themable
    };
}
/**
 * Split tokenized CSS into an array of strings and theme specification objects
 * @param {string} styles Tokenized styles to split.
 */
function splitStyles(styles) {
    var result = [];
    if (styles) {
        var pos = 0; // Current position in styles.
        var tokenMatch = void 0; // tslint:disable-line:no-null-keyword
        while (tokenMatch = _themeTokenRegex.exec(styles)) {
            var matchIndex = tokenMatch.index;
            if (matchIndex > pos) {
                result.push({
                    rawString: styles.substring(pos, matchIndex)
                });
            }
            result.push({
                theme: tokenMatch[1],
                defaultValue: tokenMatch[2] // May be undefined
            });
            // index of the first character after the current match
            pos = _themeTokenRegex.lastIndex;
        }
        // Push the rest of the string after the last match.
        result.push({
            rawString: styles.substring(pos)
        });
    }
    return result;
}
exports.splitStyles = splitStyles;
/**
 * Registers a set of style text. If it is registered too early, we will register it when the
 * window.load event is fired.
 * @param {ThemableArray} styleArray Array of IThemingInstruction objects to register.
 * @param {IStyleRecord} styleRecord May specify a style Element to update.
 */
function registerStyles(styleArray) {
    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    var _a = resolveThemableArray(styleArray), styleString = _a.styleString, themable = _a.themable;
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(styleString));
    _themeState.perf.count++;
    head.appendChild(styleElement);
    var record = {
        styleElement: styleElement,
        themableStyle: styleArray
    };
    if (themable) {
        _themeState.registeredThemableStyles.push(record);
    }
    else {
        _themeState.registeredStyles.push(record);
    }
}
/**
 * Registers a set of style text, for IE 9 and below, which has a ~30 style element limit so we need
 * to register slightly differently.
 * @param {ThemableArray} styleArray Array of IThemingInstruction objects to register.
 * @param {IStyleRecord} styleRecord May specify a style Element to update.
 */
function registerStylesIE(styleArray, styleRecord) {
    var head = document.getElementsByTagName('head')[0];
    var registeredStyles = _themeState.registeredStyles;
    var lastStyleElement = _themeState.lastStyleElement;
    var stylesheet = lastStyleElement ? lastStyleElement.styleSheet : undefined;
    var lastStyleContent = stylesheet ? stylesheet.cssText : '';
    var lastRegisteredStyle = registeredStyles[registeredStyles.length - 1];
    var resolvedStyleText = resolveThemableArray(styleArray).styleString;
    if (!lastStyleElement || (lastStyleContent.length + resolvedStyleText.length) > MAX_STYLE_CONTENT_SIZE) {
        lastStyleElement = document.createElement('style');
        lastStyleElement.type = 'text/css';
        if (styleRecord) {
            head.replaceChild(lastStyleElement, styleRecord.styleElement);
            styleRecord.styleElement = lastStyleElement;
        }
        else {
            head.appendChild(lastStyleElement);
        }
        if (!styleRecord) {
            lastRegisteredStyle = {
                styleElement: lastStyleElement,
                themableStyle: styleArray
            };
            registeredStyles.push(lastRegisteredStyle);
        }
    }
    lastStyleElement.styleSheet.cssText += detokenize(resolvedStyleText);
    Array.prototype.push.apply(lastRegisteredStyle.themableStyle, styleArray); // concat in-place
    // Preserve the theme state.
    _themeState.lastStyleElement = lastStyleElement;
}
/**
 * Checks to see if styleSheet exists as a property off of a style element.
 * This will determine if style registration should be done via cssText (<= IE9) or not
 */
function shouldUseCssText() {
    var useCSSText = false;
    if (typeof document !== 'undefined') {
        var emptyStyle = document.createElement('style');
        emptyStyle.type = 'text/css';
        useCSSText = !!emptyStyle.styleSheet;
    }
    return useCSSText;
}


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../../common/temp/node_modules/@rush-temp/build/node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../common/temp/node_modules/@rush-temp/build/node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "../../common/temp/node_modules/process/browser.js":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "../../common/temp/node_modules/tslib/tslib.es6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-0.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-0\"",
            src: "url('" + baseUrl + "fabric-icons-0-29734c63.woff') format('woff')"
        },
        icons: {
            DecreaseIndentLegacy: '\uE290',
            IncreaseIndentLegacy: '\uE291',
            SizeLegacy: '\uE2B2',
            InternetSharing: '\uE704',
            Brightness: '\uE706',
            MapPin: '\uE707',
            Airplane: '\uE709',
            Tablet: '\uE70A',
            QuickNote: '\uE70B',
            Video: '\uE714',
            People: '\uE716',
            Phone: '\uE717',
            Pin: '\uE718',
            Shop: '\uE719',
            Stop: '\uE71A',
            Link: '\uE71B',
            AllApps: '\uE71D',
            Zoom: '\uE71E',
            ZoomOut: '\uE71F',
            Microphone: '\uE720',
            Camera: '\uE722',
            Attach: '\uE723',
            Send: '\uE724',
            FavoriteList: '\uE728',
            PageSolid: '\uE729',
            Forward: '\uE72A',
            Back: '\uE72B',
            Refresh: '\uE72C',
            Lock: '\uE72E',
            ReportHacked: '\uE730',
            EMI: '\uE731',
            MiniLink: '\uE732',
            Blocked: '\uE733',
            ReadingMode: '\uE736',
            Favicon: '\uE737',
            Remove: '\uE738',
            Checkbox: '\uE739',
            CheckboxComposite: '\uE73A',
            CheckboxIndeterminate: '\uE73C',
            CheckboxCompositeReversed: '\uE73D',
            BackToWindow: '\uE73F',
            FullScreen: '\uE740',
            Print: '\uE749',
            Up: '\uE74A',
            Down: '\uE74B',
            OEM: '\uE74C',
            Save: '\uE74E',
            Cloud: '\uE753',
            CommandPrompt: '\uE756',
            Sad: '\uE757',
            SIPMove: '\uE759',
            EraseTool: '\uE75C',
            GripperTool: '\uE75E',
            Dialpad: '\uE75F',
            PageLeft: '\uE760',
            PageRight: '\uE761',
            MultiSelect: '\uE762',
            KeyboardClassic: '\uE765',
            Play: '\uE768',
            Pause: '\uE769',
            Emoji2: '\uE76E',
            GripperBarHorizontal: '\uE76F',
            System: '\uE770',
            Personalize: '\uE771',
            SearchAndApps: '\uE773',
            Globe: '\uE774',
            ContactInfo: '\uE779',
            Unpin: '\uE77A',
            Contact: '\uE77B',
            Memo: '\uE77C',
            Paste: '\uE77F',
            WindowsLogo: '\uE782',
            Error: '\uE783',
            GripperBarVertical: '\uE784',
            Unlock: '\uE785',
            AutoEnhanceOn: '\uE78D',
            AutoEnhanceOff: '\uE78E',
            Color: '\uE790',
            SaveAs: '\uE792',
            Light: '\uE793',
            Filters: '\uE795',
            AspectRatio: '\uE799',
            Contrast: '\uE7A1',
            Redo: '\uE7A6',
            Crop: '\uE7A8',
            PhotoCollection: '\uE7AA',
            Album: '\uE7AB',
            Rotate: '\uE7AD',
            PanoIndicator: '\uE7B0',
            RedEye: '\uE7B3',
            ThumbnailView: '\uE7B6',
            Package: '\uE7B8',
            Warning: '\uE7BA',
            Financial: '\uE7BB',
            Education: '\uE7BE',
            ShoppingCart: '\uE7BF',
            Train: '\uE7C0',
            Move: '\uE7C2',
            TouchPointer: '\uE7C9',
            Merge: '\uE7D5'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-1.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-1\"",
            src: "url('" + baseUrl + "fabric-icons-1-a653c37c.woff') format('woff')"
        },
        icons: {
            TurnRight: '\uE7DB',
            Ferry: '\uE7E3',
            Highlight: '\uE7E6',
            PowerButton: '\uE7E8',
            Tab: '\uE7E9',
            Admin: '\uE7EF',
            TVMonitor: '\uE7F4',
            Speakers: '\uE7F5',
            StackIndicator: '\uE7FF',
            Nav2DMapView: '\uE800',
            Car: '\uE804',
            Bus: '\uE806',
            EatDrink: '\uE807',
            LocationCircle: '\uE80E',
            Home: '\uE80F',
            SwitcherStartEnd: '\uE810',
            ParkingLocation: '\uE811',
            IncidentTriangle: '\uE814',
            Touch: '\uE815',
            MapDirections: '\uE816',
            CaretHollow: '\uE817',
            CaretSolid: '\uE818',
            History: '\uE81C',
            Location: '\uE81D',
            Work: '\uE821',
            Recent: '\uE823',
            Hotel: '\uE824',
            LocationDot: '\uE827',
            Dictionary: '\uE82D',
            ChromeBack: '\uE830',
            FolderOpen: '\uE838',
            PinnedFill: '\uE842',
            RevToggleKey: '\uE845',
            Previous: '\uE892',
            Next: '\uE893',
            Sync: '\uE895',
            Help: '\uE897',
            Emoji: '\uE899',
            MailForward: '\uE89C',
            ClosePane: '\uE89F',
            OpenPane: '\uE8A0',
            PreviewLink: '\uE8A1',
            ZoomIn: '\uE8A3',
            Bookmarks: '\uE8A4',
            Document: '\uE8A5',
            ProtectedDocument: '\uE8A6',
            OpenInNewWindow: '\uE8A7',
            MailFill: '\uE8A8',
            ViewAll: '\uE8A9',
            Switch: '\uE8AB',
            Rename: '\uE8AC',
            Remote: '\uE8AF',
            SelectAll: '\uE8B3',
            Orientation: '\uE8B4',
            Import: '\uE8B5',
            Picture: '\uE8B9',
            ChromeClose: '\uE8BB',
            ShowResults: '\uE8BC',
            Message: '\uE8BD',
            CalendarDay: '\uE8BF',
            CalendarWeek: '\uE8C0',
            MailReplyAll: '\uE8C2',
            Read: '\uE8C3',
            Cut: '\uE8C6',
            PaymentCard: '\uE8C7',
            Copy: '\uE8C8',
            Important: '\uE8C9',
            MailReply: '\uE8CA',
            GotoToday: '\uE8D1',
            Font: '\uE8D2',
            FontColor: '\uE8D3',
            FolderFill: '\uE8D5',
            Permissions: '\uE8D7',
            DisableUpdates: '\uE8D8',
            Unfavorite: '\uE8D9',
            Italic: '\uE8DB',
            Underline: '\uE8DC',
            Bold: '\uE8DD',
            MoveToFolder: '\uE8DE',
            Dislike: '\uE8E0',
            Like: '\uE8E1',
            AlignCenter: '\uE8E3',
            OpenFile: '\uE8E5',
            FontDecrease: '\uE8E7',
            FontIncrease: '\uE8E8',
            FontSize: '\uE8E9',
            CellPhone: '\uE8EA',
            Calculator: '\uE8EF',
            Library: '\uE8F1',
            PostUpdate: '\uE8F3',
            NewFolder: '\uE8F4',
            CalendarReply: '\uE8F5',
            UnsyncFolder: '\uE8F6',
            SyncFolder: '\uE8F7',
            BlockContact: '\uE8F8',
            Accept: '\uE8FB',
            BulletedList: '\uE8FD',
            Preview: '\uE8FF',
            News: '\uE900',
            Chat: '\uE901'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-10.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-10\"",
            src: "url('" + baseUrl + "fabric-icons-10-fb519450.woff') format('woff')"
        },
        icons: {
            CPlusPlus: '\uF2F4',
            FSharpLanguage: '\uF2F5',
            FSharp: '\uF2F6',
            TypeScriptLanguage: '\uF2F7',
            PythonLanguage: '\uF2F8',
            PY: '\uF2F9',
            CoffeeScript: '\uF2FA',
            MarkDownLanguage: '\uF2FB',
            FullWidth: '\uF2FE',
            FullWidthEdit: '\uF2FF',
            Plug: '\uF300',
            PlugSolid: '\uF301',
            PlugConnected: '\uF302',
            PlugDisconnected: '\uF303',
            UnlockSolid: '\uF304',
            Variable: '\uF305',
            Parameter: '\uF306',
            CommentUrgent: '\uF307',
            Storyboard: '\uF308',
            DiffInline: '\uF309',
            DiffSideBySide: '\uF30A',
            ImageDiff: '\uF30B',
            ImagePixel: '\uF30C',
            FileBug: '\uF30D',
            FileCode: '\uF30E',
            FileComment: '\uF30F',
            BusinessHoursSign: '\uF310',
            FileImage: '\uF311',
            FileSymlink: '\uF312',
            AutoFillTemplate: '\uF313',
            WorkItem: '\uF314',
            WorkItemBug: '\uF315',
            LogRemove: '\uF316',
            ColumnOptions: '\uF317',
            Packages: '\uF318',
            BuildIssue: '\uF319',
            AssessmentGroup: '\uF31A',
            VariableGroup: '\uF31B',
            FullHistory: '\uF31C',
            SingleColumnEdit: '\uF321',
            DoubleColumnEdit: '\uF322',
            TripleColumnEdit: '\uF323',
            ColumnLeftTwoThirdsEdit: '\uF324',
            ColumnRightTwoThirdsEdit: '\uF325',
            StreamLogo: '\uF329',
            PassiveAuthentication: '\uF32A',
            AlertSolid: '\uF331',
            MegaphoneSolid: '\uF332',
            TaskSolid: '\uF333',
            ConfigurationSolid: '\uF334',
            BugSolid: '\uF335',
            CrownSolid: '\uF336',
            Trophy2Solid: '\uF337',
            QuickNoteSolid: '\uF338',
            ConstructionConeSolid: '\uF339',
            PageListSolid: '\uF33A',
            PageListMirroredSolid: '\uF33B',
            StarburstSolid: '\uF33C',
            ReadingModeSolid: '\uF33D',
            SadSolid: '\uF33E',
            HealthSolid: '\uF33F',
            ShieldSolid: '\uF340',
            GiftBoxSolid: '\uF341',
            ShoppingCartSolid: '\uF342',
            MailSolid: '\uF343',
            ChatSolid: '\uF344',
            RibbonSolid: '\uF345',
            FinancialSolid: '\uF346',
            FinancialMirroredSolid: '\uF347',
            HeadsetSolid: '\uF348',
            PermissionsSolid: '\uF349',
            ParkingSolid: '\uF34A',
            ParkingMirroredSolid: '\uF34B',
            DiamondSolid: '\uF34C',
            AsteriskSolid: '\uF34D',
            OfflineStorageSolid: '\uF34E',
            BankSolid: '\uF34F',
            DecisionSolid: '\uF350',
            Parachute: '\uF351',
            ParachuteSolid: '\uF352',
            FiltersSolid: '\uF353',
            ColorSolid: '\uF354',
            ReviewSolid: '\uF355',
            ReviewRequestSolid: '\uF356',
            ReviewRequestMirroredSolid: '\uF357',
            ReviewResponseSolid: '\uF358',
            FeedbackRequestSolid: '\uF359',
            FeedbackRequestMirroredSolid: '\uF35A',
            FeedbackResponseSolid: '\uF35B',
            WorkItemBar: '\uF35C',
            WorkItemBarSolid: '\uF35D',
            Separator: '\uF35E',
            NavigateExternalInline: '\uF35F',
            PlanView: '\uF360',
            TimelineMatrixView: '\uF361',
            EngineeringGroup: '\uF362',
            ProjectCollection: '\uF363',
            CaretBottomRightCenter8: '\uF364',
            CaretBottomLeftCenter8: '\uF365',
            CaretTopRightCenter8: '\uF366'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-11.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-11\"",
            src: "url('" + baseUrl + "fabric-icons-11-a4026982.woff') format('woff')"
        },
        icons: {
            CaretTopLeftCenter8: '\uF367',
            DonutChart: '\uF368',
            ChevronUnfold10: '\uF369',
            ChevronFold10: '\uF36A',
            DoubleChevronDown8: '\uF36B',
            DoubleChevronUp8: '\uF36C',
            DoubleChevronLeft8: '\uF36D',
            DoubleChevronRight8: '\uF36E',
            ChevronDownEnd6: '\uF36F',
            ChevronUpEnd6: '\uF370',
            ChevronLeftEnd6: '\uF371',
            ChevronRightEnd6: '\uF372',
            ContextMenu: '\uF37C',
            AzureAPIManagement: '\uF37F',
            AzureServiceEndpoint: '\uF380',
            VSTSLogo: '\uF381',
            VSTSAltLogo1: '\uF382',
            VSTSAltLogo2: '\uF383',
            FileTypeSolution: '\uF387',
            WordLogoInverse16: '\uF390',
            WordLogo16: '\uF391',
            WordLogoFill16: '\uF392',
            PowerPointLogoInverse16: '\uF393',
            PowerPointLogo16: '\uF394',
            PowerPointLogoFill16: '\uF395',
            ExcelLogoInverse16: '\uF396',
            ExcelLogo16: '\uF397',
            ExcelLogoFill16: '\uF398',
            OneNoteLogoInverse16: '\uF399',
            OneNoteLogo16: '\uF39A',
            OneNoteLogoFill16: '\uF39B',
            OutlookLogoInverse16: '\uF39C',
            OutlookLogo16: '\uF39D',
            OutlookLogoFill16: '\uF39E',
            PublisherLogoInverse16: '\uF39F',
            PublisherLogo16: '\uF3A0',
            PublisherLogoFill16: '\uF3A1',
            VisioLogoInverse16: '\uF3A2',
            VisioLogo16: '\uF3A3',
            VisioLogoFill16: '\uF3A4',
            TestBeaker: '\uF3A5',
            TestBeakerSolid: '\uF3A6',
            TestExploreSolid: '\uF3A7',
            TestAutoSolid: '\uF3A8',
            TestUserSolid: '\uF3A9',
            TestImpactSolid: '\uF3AA',
            TestPlan: '\uF3AB',
            TestStep: '\uF3AC',
            TestParameter: '\uF3AD',
            TestSuite: '\uF3AE',
            TestCase: '\uF3AF',
            Sprint: '\uF3B0',
            SignOut: '\uF3B1',
            TriggerApproval: '\uF3B2',
            Rocket: '\uF3B3',
            AzureKeyVault: '\uF3B4',
            Transition: '\uF3BC',
            LikeSolid: '\uF3BF',
            DislikeSolid: '\uF3C0',
            UnSetColor: '\uF3F9',
            DeclineCall: '\uF405',
            RectangularClipping: '\uF407',
            TeamsLogo16: '\uF40A',
            TeamsLogoFill16: '\uF40B',
            Spacer: '\uF40D',
            SkypeLogo16: '\uF40E',
            SkypeForBusinessLogo16: '\uF40F',
            SkypeForBusinessLogoFill16: '\uF410',
            FilterSolid: '\uF412',
            MailUndelivered: '\uF415',
            MailTentative: '\uF416',
            MailTentativeMirrored: '\uF417',
            MailReminder: '\uF418',
            ReceiptUndelivered: '\uF419',
            ReceiptTentative: '\uF41A',
            ReceiptTentativeMirrored: '\uF41B',
            Inbox: '\uF41C',
            IRMReply: '\uF41D',
            IRMReplyMirrored: '\uF41E',
            IRMForward: '\uF41F',
            IRMForwardMirrored: '\uF420',
            VoicemailIRM: '\uF421',
            EventAccepted: '\uF422',
            EventTentative: '\uF423',
            EventTentativeMirrored: '\uF424',
            EventDeclined: '\uF425',
            IDBadge: '\uF427',
            BackgroundColor: '\uF42B',
            OfficeFormsLogoInverse16: '\uF433',
            OfficeFormsLogo: '\uF434',
            OfficeFormsLogoFill: '\uF435',
            OfficeFormsLogo16: '\uF436',
            OfficeFormsLogoFill16: '\uF437',
            OfficeFormsLogoInverse24: '\uF43A',
            OfficeFormsLogo24: '\uF43B',
            OfficeFormsLogoFill24: '\uF43C',
            PageLock: '\uF43F',
            NotExecuted: '\uF440',
            NotImpactedSolid: '\uF441',
            FieldReadOnly: '\uF442'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-12.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-12\"",
            src: "url('" + baseUrl + "fabric-icons-12-e6882c74.woff') format('woff')"
        },
        icons: {
            FieldRequired: '\uF443',
            BacklogBoard: '\uF444',
            ExternalBuild: '\uF445',
            ExternalTFVC: '\uF446',
            ExternalXAML: '\uF447',
            IssueSolid: '\uF448',
            DefectSolid: '\uF449',
            LadybugSolid: '\uF44A',
            NugetLogo: '\uF44C',
            TFVCLogo: '\uF44D',
            ProjectLogo32: '\uF47E',
            ProjectLogoFill32: '\uF47F',
            ProjectLogo16: '\uF480',
            ProjectLogoFill16: '\uF481',
            SwayLogo32: '\uF482',
            SwayLogoFill32: '\uF483',
            SwayLogo16: '\uF484',
            SwayLogoFill16: '\uF485',
            ClassNotebookLogo32: '\uF486',
            ClassNotebookLogoFill32: '\uF487',
            ClassNotebookLogo16: '\uF488',
            ClassNotebookLogoFill16: '\uF489',
            ClassNotebookLogoInverse32: '\uF48A',
            ClassNotebookLogoInverse16: '\uF48B',
            StaffNotebookLogo32: '\uF48C',
            StaffNotebookLogoFill32: '\uF48D',
            StaffNotebookLogo16: '\uF48E',
            StaffNotebookLogoFill16: '\uF48F',
            StaffNotebookLogoInverted32: '\uF490',
            StaffNotebookLogoInverted16: '\uF491',
            KaizalaLogo: '\uF492',
            TaskLogo: '\uF493',
            ProtectionCenterLogo32: '\uF494',
            GallatinLogo: '\uF496',
            Globe2: '\uF49A',
            Guitar: '\uF49B',
            Breakfast: '\uF49C',
            Brunch: '\uF49D',
            BeerMug: '\uF49E',
            Vacation: '\uF49F',
            Teeth: '\uF4A0',
            Taxi: '\uF4A1',
            Chopsticks: '\uF4A2',
            SyncOccurence: '\uF4A3',
            UnsyncOccurence: '\uF4A4',
            PrimaryCalendar: '\uF4AE',
            SearchCalendar: '\uF4AF',
            VideoOff: '\uF4B0',
            MicrosoftFlowLogo: '\uF4B1',
            BusinessCenterLogo: '\uF4B2',
            ToDoLogoBottom: '\uF4B3',
            ToDoLogoTop: '\uF4B4',
            EditSolid12: '\uF4B5',
            EditSolidMirrored12: '\uF4B6',
            UneditableSolid12: '\uF4B7',
            UneditableSolidMirrored12: '\uF4B8',
            UneditableMirrored: '\uF4B9',
            AdminALogo32: '\uF4BA',
            AdminALogoFill32: '\uF4BB',
            ToDoLogoInverse: '\uF4BC',
            Snooze: '\uF4BD',
            WaffleOffice365: '\uF4E0',
            ImageSearch: '\uF4E8',
            NewsSearch: '\uF4E9',
            VideoSearch: '\uF4EA',
            R: '\uF4EB',
            FontColorA: '\uF4EC',
            FontColorSwatch: '\uF4ED',
            LightWeight: '\uF4EE',
            NormalWeight: '\uF4EF',
            SemiboldWeight: '\uF4F0',
            GroupObject: '\uF4F1',
            UngroupObject: '\uF4F2',
            AlignHorizontalLeft: '\uF4F3',
            AlignHorizontalCenter: '\uF4F4',
            AlignHorizontalRight: '\uF4F5',
            AlignVerticalTop: '\uF4F6',
            AlignVerticalCenter: '\uF4F7',
            AlignVerticalBottom: '\uF4F8',
            HorizontalDistributeCenter: '\uF4F9',
            VerticalDistributeCenter: '\uF4FA',
            Ellipse: '\uF4FB',
            Line: '\uF4FC',
            Octagon: '\uF4FD',
            Hexagon: '\uF4FE',
            Pentagon: '\uF4FF',
            RightTriangle: '\uF500',
            HalfCircle: '\uF501',
            QuarterCircle: '\uF502',
            ThreeQuarterCircle: '\uF503',
            '6PointStar': '\uF504',
            '12PointStar': '\uF505',
            ArrangeBringToFront: '\uF506',
            ArrangeSendToBack: '\uF507',
            ArrangeSendBackward: '\uF508',
            ArrangeBringForward: '\uF509',
            BorderDash: '\uF50A',
            BorderDot: '\uF50B',
            LineStyle: '\uF50C',
            LineThickness: '\uF50D'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-13.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-13\"",
            src: "url('" + baseUrl + "fabric-icons-13-0980cd6d.woff') format('woff')"
        },
        icons: {
            WindowEdit: '\uF50E',
            HintText: '\uF50F',
            MediaAdd: '\uF510',
            AnchorLock: '\uF511',
            AutoHeight: '\uF512',
            ChartSeries: '\uF513',
            ChartXAngle: '\uF514',
            ChartYAngle: '\uF515',
            Combobox: '\uF516',
            LineSpacing: '\uF517',
            Padding: '\uF518',
            PaddingTop: '\uF519',
            PaddingBottom: '\uF51A',
            PaddingLeft: '\uF51B',
            PaddingRight: '\uF51C',
            NavigationFlipper: '\uF51D',
            AlignJustify: '\uF51E',
            TextOverflow: '\uF51F',
            VisualsFolder: '\uF520',
            VisualsStore: '\uF521',
            PictureCenter: '\uF522',
            PictureFill: '\uF523',
            PicturePosition: '\uF524',
            PictureStretch: '\uF525',
            PictureTile: '\uF526',
            Slider: '\uF527',
            SliderHandleSize: '\uF528',
            DefaultRatio: '\uF529',
            NumberSequence: '\uF52A',
            GUID: '\uF52B',
            ReportAdd: '\uF52C',
            DashboardAdd: '\uF52D',
            MapPinSolid: '\uF52E',
            WebPublish: '\uF52F',
            PieSingleSolid: '\uF530',
            BlockedSolid: '\uF531',
            DrillDown: '\uF532',
            DrillDownSolid: '\uF533',
            DrillExpand: '\uF534',
            DrillShow: '\uF535',
            OneDriveFolder16: '\uF53B',
            FunctionalManagerDashboard: '\uF542',
            BIDashboard: '\uF543',
            CodeEdit: '\uF544',
            RenewalCurrent: '\uF545',
            RenewalFuture: '\uF546',
            SplitObject: '\uF547',
            BulkUpload: '\uF548',
            DownloadDocument: '\uF549',
            WaitlistConfirm: '\uF550',
            WaitlistConfirmMirrored: '\uF551',
            LaptopSecure: '\uF552',
            DragObject: '\uF553',
            EntryView: '\uF554',
            EntryDecline: '\uF555',
            ContactCardSettings: '\uF556',
            ContactCardSettingsMirrored: '\uF557',
            CalendarSettings: '\uF558',
            CalendarSettingsMirrored: '\uF559',
            HardDriveLock: '\uF55A',
            HardDriveUnlock: '\uF55B',
            AccountManagement: '\uF55C',
            TransitionPop: '\uF5B2',
            TransitionPush: '\uF5B3',
            TransitionEffect: '\uF5B4',
            LookupEntities: '\uF5B5',
            ExploreData: '\uF5B6',
            AddBookmark: '\uF5B7',
            SearchBookmark: '\uF5B8',
            DrillThrough: '\uF5B9',
            MasterDatabase: '\uF5BA',
            CertifiedDatabase: '\uF5BB',
            MaximumValue: '\uF5BC',
            MinimumValue: '\uF5BD',
            VisualStudioIDELogo32: '\uF5D0',
            PasteAsText: '\uF5D5',
            PasteAsCode: '\uF5D6',
            BrowserTab: '\uF5D7',
            BrowserTabScreenshot: '\uF5D8',
            DesktopScreenshot: '\uF5D9',
            FileYML: '\uF5DA',
            ClipboardSolid: '\uF5DC',
            AnalyticsView: '\uF5F1',
            Leave: '\uF627',
            Trending12: '\uF62D',
            Blocked12: '\uF62E',
            Warning12: '\uF62F',
            CheckedOutByOther12: '\uF630',
            CheckedOutByYou12: '\uF631',
            CircleShapeSolid: '\uF63C',
            SquareShapeSolid: '\uF63D',
            TriangleShapeSolid: '\uF63E',
            DropShapeSolid: '\uF63F',
            RectangleShapeSolid: '\uF640',
            InsertColumnsLeft: '\uF64A',
            InsertColumnsRight: '\uF64B',
            InsertRowsAbove: '\uF64C',
            InsertRowsBelow: '\uF64D',
            DeleteColumns: '\uF64E',
            DeleteRows: '\uF64F'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-14.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-14\"",
            src: "url('" + baseUrl + "fabric-icons-14-eb4d1150.woff') format('woff')"
        },
        icons: {
            DeleteRowsMirrored: '\uF650',
            DeleteTable: '\uF651',
            VersionControlPush: '\uF664',
            WhiteBoardApp16: '\uF673',
            WhiteBoardApp32: '\uF674',
            InsertSignatureLine: '\uF677',
            ArrangeByFrom: '\uF678',
            Phishing: '\uF679',
            CreateMailRule: '\uF67A',
            PublishCourse: '\uF699',
            DictionaryRemove: '\uF69A',
            UserRemove: '\uF69B',
            UserEvent: '\uF69C',
            Encryption: '\uF69D',
            D365TalentLearn: '\uF6BB',
            D365TalentInsight: '\uF6BC',
            D365TalentHRCore: '\uF6BD',
            BacklogList: '\uF6BF',
            ButtonControl: '\uF6C0',
            TableGroup: '\uF6D9',
            MountainClimbing: '\uF6DB',
            TagUnknown: '\uF6DF',
            TagUnknownMirror: '\uF6E0',
            TagUnknown12: '\uF6E1',
            TagUnknown12Mirror: '\uF6E2',
            Link12: '\uF6E3',
            Presentation: '\uF6E4',
            Presentation12: '\uF6E5',
            Lock12: '\uF6E6',
            BuildDefinition: '\uF6E9',
            ReleaseDefinition: '\uF6EA',
            SaveTemplate: '\uF6EC',
            UserGauge: '\uF6ED',
            BlockedSiteSolid12: '\uF70A',
            TagSolid: '\uF70E',
            OfficeChat: '\uF70F',
            OfficeChatSolid: '\uF710',
            MailSchedule: '\uF72E'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-2.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-2\"",
            src: "url('" + baseUrl + "fabric-icons-2-b9379dbc.woff') format('woff')"
        },
        icons: {
            Group: '\uE902',
            World: '\uE909',
            Comment: '\uE90A',
            DockLeft: '\uE90C',
            DockRight: '\uE90D',
            Repair: '\uE90F',
            Accounts: '\uE910',
            RadioBullet: '\uE915',
            Stopwatch: '\uE916',
            Clock: '\uE917',
            WorldClock: '\uE918',
            AlarmClock: '\uE919',
            Photo: '\uE91B',
            Hospital: '\uE91D',
            Timer: '\uE91E',
            FullCircleMask: '\uE91F',
            LocationFill: '\uE920',
            ChromeMinimize: '\uE921',
            Annotation: '\uE924',
            Fingerprint: '\uE928',
            Handwriting: '\uE929',
            Completed: '\uE930',
            Label: '\uE932',
            FlickDown: '\uE935',
            FlickUp: '\uE936',
            FlickLeft: '\uE937',
            FlickRight: '\uE938',
            MiniExpand: '\uE93A',
            MiniContract: '\uE93B',
            Streaming: '\uE93E',
            MusicInCollection: '\uE940',
            OneDriveLogo: '\uE941',
            CompassNW: '\uE942',
            Code: '\uE943',
            LightningBolt: '\uE945',
            CalculatorMultiply: '\uE947',
            CalculatorAddition: '\uE948',
            CalculatorSubtract: '\uE949',
            CalculatorEqualTo: '\uE94E',
            PrintfaxPrinterFile: '\uE956',
            Communications: '\uE95A',
            Headset: '\uE95B',
            Health: '\uE95E',
            ChevronUpSmall: '\uE96D',
            ChevronDownSmall: '\uE96E',
            ChevronLeftSmall: '\uE96F',
            ChevronRightSmall: '\uE970',
            ChevronUpMed: '\uE971',
            ChevronDownMed: '\uE972',
            ChevronLeftMed: '\uE973',
            ChevronRightMed: '\uE974',
            PC1: '\uE977',
            PresenceChickletVideo: '\uE979',
            Reply: '\uE97A',
            HalfAlpha: '\uE97E',
            ConstructionCone: '\uE98F',
            DoubleChevronLeftMed: '\uE991',
            Volume0: '\uE992',
            Volume1: '\uE993',
            Volume2: '\uE994',
            Volume3: '\uE995',
            Chart: '\uE999',
            Robot: '\uE99A',
            Manufacturing: '\uE99C',
            LockSolid: '\uE9A2',
            BidiLtr: '\uE9AA',
            BidiRtl: '\uE9AB',
            RightDoubleQuote: '\uE9B1',
            Sunny: '\uE9BD',
            CloudWeather: '\uE9BE',
            Cloudy: '\uE9BF',
            PartlyCloudyDay: '\uE9C0',
            PartlyCloudyNight: '\uE9C1',
            ClearNight: '\uE9C2',
            RainShowersDay: '\uE9C3',
            Rain: '\uE9C4',
            Thunderstorms: '\uE9C6',
            RainSnow: '\uE9C7',
            Snow: '\uE9C8',
            BlowingSnow: '\uE9C9',
            Frigid: '\uE9CA',
            Fog: '\uE9CB',
            Squalls: '\uE9CC',
            Duststorm: '\uE9CD',
            Unknown: '\uE9CE',
            Precipitation: '\uE9CF',
            Ribbon: '\uE9D1',
            AreaChart: '\uE9D2',
            Assign: '\uE9D3',
            CheckList: '\uE9D5',
            Diagnostic: '\uE9D9',
            Generate: '\uE9DA',
            LineChart: '\uE9E6',
            Equalizer: '\uE9E9',
            BarChartHorizontal: '\uE9EB',
            BarChartVertical: '\uE9EC',
            Freezing: '\uE9EF',
            Processing: '\uE9F5',
            SnowShowerDay: '\uE9FD',
            HailDay: '\uEA00'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-3.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-3\"",
            src: "url('" + baseUrl + "fabric-icons-3-ef2110da.woff') format('woff')"
        },
        icons: {
            WorkFlow: '\uEA01',
            HourGlass: '\uEA03',
            StoreLogoMed20: '\uEA04',
            TimeSheet: '\uEA05',
            TriangleSolid: '\uEA08',
            VideoSolid: '\uEA0C',
            RainShowersNight: '\uEA0F',
            SnowShowerNight: '\uEA11',
            Teamwork: '\uEA12',
            HailNight: '\uEA13',
            PeopleAdd: '\uEA15',
            Glasses: '\uEA16',
            DateTime2: '\uEA17',
            Shield: '\uEA18',
            Header1: '\uEA19',
            PageAdd: '\uEA1A',
            NumberedList: '\uEA1C',
            PowerBILogo: '\uEA1E',
            Info2: '\uEA1F',
            MusicInCollectionFill: '\uEA36',
            Asterisk: '\uEA38',
            ErrorBadge: '\uEA39',
            CircleFill: '\uEA3B',
            Record2: '\uEA3F',
            AllAppsMirrored: '\uEA40',
            BookmarksMirrored: '\uEA41',
            BulletedListMirrored: '\uEA42',
            CaretHollowMirrored: '\uEA45',
            CaretSolidMirrored: '\uEA46',
            ChromeBackMirrored: '\uEA47',
            ClosePaneMirrored: '\uEA49',
            DockLeftMirrored: '\uEA4C',
            DoubleChevronLeftMedMirrored: '\uEA4D',
            HelpMirrored: '\uEA51',
            ImportMirrored: '\uEA52',
            ListMirrored: '\uEA55',
            MailForwardMirrored: '\uEA56',
            MailReplyMirrored: '\uEA57',
            MailReplyAllMirrored: '\uEA58',
            OpenPaneMirrored: '\uEA5B',
            ParkingLocationMirrored: '\uEA5E',
            SendMirrored: '\uEA63',
            ShowResultsMirrored: '\uEA65',
            ThumbnailViewMirrored: '\uEA67',
            Devices3: '\uEA6C',
            Lightbulb: '\uEA80',
            StatusTriangle: '\uEA82',
            VolumeDisabled: '\uEA85',
            Puzzle: '\uEA86',
            EmojiNeutral: '\uEA87',
            EmojiDisappointed: '\uEA88',
            HomeSolid: '\uEA8A',
            Ringer: '\uEA8F',
            PDF: '\uEA90',
            HeartBroken: '\uEA92',
            StoreLogo16: '\uEA96',
            MultiSelectMirrored: '\uEA98',
            Broom: '\uEA99',
            Cocktails: '\uEA9D',
            Wines: '\uEABF',
            Articles: '\uEAC1',
            Cycling: '\uEAC7',
            DietPlanNotebook: '\uEAC8',
            Pill: '\uEACB',
            ExerciseTracker: '\uEACC',
            HandsFree: '\uEAD0',
            Medical: '\uEAD4',
            Running: '\uEADA',
            Weights: '\uEADB',
            Trackers: '\uEADF',
            AddNotes: '\uEAE3',
            AllCurrency: '\uEAE4',
            BarChart4: '\uEAE7',
            CirclePlus: '\uEAEE',
            Coffee: '\uEAEF',
            Cotton: '\uEAF3',
            Market: '\uEAFC',
            Money: '\uEAFD',
            PieDouble: '\uEB04',
            PieSingle: '\uEB05',
            RemoveFilter: '\uEB08',
            Savings: '\uEB0B',
            Sell: '\uEB0C',
            StockDown: '\uEB0F',
            StockUp: '\uEB11',
            Lamp: '\uEB19',
            Source: '\uEB1B',
            MSNVideos: '\uEB1C',
            Cricket: '\uEB1E',
            Golf: '\uEB1F',
            Baseball: '\uEB20',
            Soccer: '\uEB21',
            MoreSports: '\uEB22',
            AutoRacing: '\uEB24',
            CollegeHoops: '\uEB25',
            CollegeFootball: '\uEB26',
            ProFootball: '\uEB27',
            ProHockey: '\uEB28',
            Rugby: '\uEB2D',
            SubstitutionsIn: '\uEB31'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-4.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-4\"",
            src: "url('" + baseUrl + "fabric-icons-4-aeecd474.woff') format('woff')"
        },
        icons: {
            Tennis: '\uEB33',
            Arrivals: '\uEB34',
            Design: '\uEB3C',
            Website: '\uEB41',
            Drop: '\uEB42',
            SkiResorts: '\uEB45',
            Snowflake: '\uEB46',
            BusSolid: '\uEB47',
            FerrySolid: '\uEB48',
            AirplaneSolid: '\uEB4C',
            TrainSolid: '\uEB4D',
            Ticket: '\uEB54',
            Devices4: '\uEB66',
            AzureLogo: '\uEB6A',
            BingLogo: '\uEB6B',
            MSNLogo: '\uEB6C',
            OutlookLogoInverse: '\uEB6D',
            OfficeLogo: '\uEB6E',
            SkypeLogo: '\uEB6F',
            Door: '\uEB75',
            EditMirrored: '\uEB7E',
            GiftCard: '\uEB8E',
            DoubleBookmark: '\uEB8F',
            StatusErrorFull: '\uEB90',
            Certificate: '\uEB95',
            FastForward: '\uEB9D',
            Rewind: '\uEB9E',
            Photo2: '\uEB9F',
            OpenSource: '\uEBC2',
            Movers: '\uEBCD',
            CloudDownload: '\uEBD3',
            Family: '\uEBDA',
            WindDirection: '\uEBE6',
            Bug: '\uEBE8',
            SiteScan: '\uEBEC',
            BrowserScreenShot: '\uEBED',
            F12DevTools: '\uEBEE',
            CSS: '\uEBEF',
            JS: '\uEBF0',
            DeliveryTruck: '\uEBF4',
            ReminderPerson: '\uEBF7',
            ReminderGroup: '\uEBF8',
            TabletMode: '\uEBFC',
            Umbrella: '\uEC04',
            NetworkTower: '\uEC05',
            CityNext: '\uEC06',
            Section: '\uEC0C',
            OneNoteLogoInverse: '\uEC0D',
            ToggleFilled: '\uEC11',
            ToggleBorder: '\uEC12',
            SliderThumb: '\uEC13',
            ToggleThumb: '\uEC14',
            Documentation: '\uEC17',
            Badge: '\uEC1B',
            Giftbox: '\uEC1F',
            VisualStudioLogo: '\uEC22',
            ExcelLogoInverse: '\uEC28',
            WordLogoInverse: '\uEC29',
            PowerPointLogoInverse: '\uEC2A',
            Cafe: '\uEC32',
            SpeedHigh: '\uEC4A',
            Commitments: '\uEC4D',
            ThisPC: '\uEC4E',
            MusicNote: '\uEC4F',
            MicOff: '\uEC54',
            EdgeLogo: '\uEC60',
            CompletedSolid: '\uEC61',
            AlbumRemove: '\uEC62',
            MessageFill: '\uEC70',
            TabletSelected: '\uEC74',
            MobileSelected: '\uEC75',
            LaptopSelected: '\uEC76',
            TVMonitorSelected: '\uEC77',
            DeveloperTools: '\uEC7A',
            InsertTextBox: '\uEC7D',
            LowerBrightness: '\uEC8A',
            DOM: '\uEC8D',
            CloudUpload: '\uEC8E',
            ScrollUpDown: '\uEC8F',
            DateTime: '\uEC92',
            Event: '\uECA3',
            Cake: '\uECA4',
            Org: '\uECA6',
            PartyLeader: '\uECA7',
            DRM: '\uECA8',
            CloudAdd: '\uECA9',
            AppIconDefault: '\uECAA',
            Photo2Add: '\uECAB',
            Photo2Remove: '\uECAC',
            POI: '\uECAF',
            AddTo: '\uECC8',
            RadioBtnOff: '\uECCA',
            RadioBtnOn: '\uECCB',
            ExploreContent: '\uECCD',
            Product: '\uECDC',
            ProgressLoopInner: '\uECDE',
            ProgressLoopOuter: '\uECDF',
            Blocked2: '\uECE4',
            FangBody: '\uECEB',
            ChatInviteFriend: '\uECFE'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-5\"",
            src: "url('" + baseUrl + "fabric-icons-5-f6547654.woff') format('woff')"
        },
        icons: {
            Crown: '\uED01',
            Diamond: '\uED02',
            ScaleUp: '\uED09',
            Feedback: '\uED15',
            SharepointLogoInverse: '\uED18',
            YammerLogo: '\uED19',
            Hide: '\uED1A',
            Uneditable: '\uED1D',
            ReturnToSession: '\uED24',
            OpenFolderHorizontal: '\uED25',
            CalendarMirrored: '\uED28',
            SwayLogoInverse: '\uED29',
            OutOfOffice: '\uED34',
            Trophy: '\uED3F',
            ReopenPages: '\uED50',
            EmojiTabSymbols: '\uED58',
            AADLogo: '\uED68',
            AccessLogo: '\uED69',
            AdminALogoInverse32: '\uED6A',
            AdminCLogoInverse32: '\uED6B',
            AdminDLogoInverse32: '\uED6C',
            AdminELogoInverse32: '\uED6D',
            AdminLLogoInverse32: '\uED6E',
            AdminMLogoInverse32: '\uED6F',
            AdminOLogoInverse32: '\uED70',
            AdminPLogoInverse32: '\uED71',
            AdminSLogoInverse32: '\uED72',
            AdminYLogoInverse32: '\uED73',
            DelveLogoInverse: '\uED76',
            ExchangeLogoInverse: '\uED78',
            LyncLogo: '\uED79',
            OfficeVideoLogoInverse: '\uED7A',
            SocialListeningLogo: '\uED7C',
            VisioLogoInverse: '\uED7D',
            Balloons: '\uED7E',
            Cat: '\uED7F',
            MailAlert: '\uED80',
            MailCheck: '\uED81',
            MailLowImportance: '\uED82',
            MailPause: '\uED83',
            MailRepeat: '\uED84',
            SecurityGroup: '\uED85',
            Table: '\uED86',
            VoicemailForward: '\uED87',
            VoicemailReply: '\uED88',
            Waffle: '\uED89',
            RemoveEvent: '\uED8A',
            EventInfo: '\uED8B',
            ForwardEvent: '\uED8C',
            WipePhone: '\uED8D',
            AddOnlineMeeting: '\uED8E',
            JoinOnlineMeeting: '\uED8F',
            RemoveLink: '\uED90',
            PeopleBlock: '\uED91',
            PeopleRepeat: '\uED92',
            PeopleAlert: '\uED93',
            PeoplePause: '\uED94',
            TransferCall: '\uED95',
            AddPhone: '\uED96',
            UnknownCall: '\uED97',
            NoteReply: '\uED98',
            NoteForward: '\uED99',
            NotePinned: '\uED9A',
            RemoveOccurrence: '\uED9B',
            Timeline: '\uED9C',
            EditNote: '\uED9D',
            CircleHalfFull: '\uED9E',
            Room: '\uED9F',
            Unsubscribe: '\uEDA0',
            Subscribe: '\uEDA1',
            HardDrive: '\uEDA2',
            RecurringTask: '\uEDB2',
            TaskManager: '\uEDB7',
            TaskManagerMirrored: '\uEDB8',
            Combine: '\uEDBB',
            Split: '\uEDBC',
            DoubleChevronUp: '\uEDBD',
            DoubleChevronLeft: '\uEDBE',
            DoubleChevronRight: '\uEDBF',
            TextBox: '\uEDC2',
            TextField: '\uEDC3',
            NumberField: '\uEDC4',
            Dropdown: '\uEDC5',
            BookingsLogo: '\uEDC7',
            ClassNotebookLogoInverse: '\uEDC8',
            DelveAnalyticsLogo: '\uEDCA',
            DocsLogoInverse: '\uEDCB',
            Dynamics365Logo: '\uEDCC',
            DynamicSMBLogo: '\uEDCD',
            OfficeAssistantLogo: '\uEDCE',
            OfficeStoreLogo: '\uEDCF',
            OneNoteEduLogoInverse: '\uEDD0',
            PlannerLogo: '\uEDD1',
            PowerApps: '\uEDD2',
            Suitcase: '\uEDD3',
            ProjectLogoInverse: '\uEDD4',
            CaretLeft8: '\uEDD5',
            CaretRight8: '\uEDD6',
            CaretUp8: '\uEDD7',
            CaretDown8: '\uEDD8'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-6\"",
            src: "url('" + baseUrl + "fabric-icons-6-3954c770.woff') format('woff')"
        },
        icons: {
            CaretLeftSolid8: '\uEDD9',
            CaretRightSolid8: '\uEDDA',
            CaretUpSolid8: '\uEDDB',
            CaretDownSolid8: '\uEDDC',
            ClearFormatting: '\uEDDD',
            Superscript: '\uEDDE',
            Subscript: '\uEDDF',
            Strikethrough: '\uEDE0',
            Export: '\uEDE1',
            ExportMirrored: '\uEDE2',
            SingleBookmark: '\uEDFF',
            SingleBookmarkSolid: '\uEE00',
            DoubleChevronDown: '\uEE04',
            FollowUser: '\uEE05',
            ReplyAll: '\uEE0A',
            WorkforceManagement: '\uEE0F',
            RecruitmentManagement: '\uEE12',
            Questionnaire: '\uEE19',
            ManagerSelfService: '\uEE23',
            ReplyMirrored: '\uEE35',
            ReplyAllMirrored: '\uEE36',
            Medal: '\uEE38',
            AddGroup: '\uEE3D',
            QuestionnaireMirrored: '\uEE4B',
            TemporaryUser: '\uEE58',
            CaretSolid16: '\uEE62',
            GroupedDescending: '\uEE66',
            GroupedAscending: '\uEE67',
            AwayStatus: '\uEE6A',
            MyMoviesTV: '\uEE6C',
            GenericScan: '\uEE6F',
            AustralianRules: '\uEE70',
            WifiEthernet: '\uEE77',
            TrackersMirrored: '\uEE92',
            DateTimeMirrored: '\uEE93',
            StopSolid: '\uEE95',
            DoubleChevronUp12: '\uEE96',
            DoubleChevronDown12: '\uEE97',
            DoubleChevronLeft12: '\uEE98',
            DoubleChevronRight12: '\uEE99',
            CalendarAgenda: '\uEE9A',
            AddEvent: '\uEEB5',
            AssetLibrary: '\uEEB6',
            DataConnectionLibrary: '\uEEB7',
            DocLibrary: '\uEEB8',
            FormLibrary: '\uEEB9',
            FormLibraryMirrored: '\uEEBA',
            ReportLibrary: '\uEEBB',
            ReportLibraryMirrored: '\uEEBC',
            ContactCard: '\uEEBD',
            CustomList: '\uEEBE',
            CustomListMirrored: '\uEEBF',
            IssueTracking: '\uEEC0',
            IssueTrackingMirrored: '\uEEC1',
            PictureLibrary: '\uEEC2',
            OfficeAddinsLogo: '\uEEC7',
            OfflineOneDriveParachute: '\uEEC8',
            OfflineOneDriveParachuteDisabled: '\uEEC9',
            TriangleSolidUp12: '\uEECC',
            TriangleSolidDown12: '\uEECD',
            TriangleSolidLeft12: '\uEECE',
            TriangleSolidRight12: '\uEECF',
            TriangleUp12: '\uEED0',
            TriangleDown12: '\uEED1',
            TriangleLeft12: '\uEED2',
            TriangleRight12: '\uEED3',
            ArrowUpRight8: '\uEED4',
            ArrowDownRight8: '\uEED5',
            DocumentSet: '\uEED6',
            DelveAnalytics: '\uEEEE',
            ArrowUpRightMirrored8: '\uEEEF',
            ArrowDownRightMirrored8: '\uEEF0',
            CompanyDirectory: '\uEF0D',
            CompanyDirectoryMirrored: '\uEF2B',
            OneDriveAdd: '\uEF32',
            ProfileSearch: '\uEF35',
            Header2: '\uEF36',
            Header3: '\uEF37',
            Header4: '\uEF38',
            Eyedropper: '\uEF3C',
            MarketDown: '\uEF42',
            CalendarWorkWeek: '\uEF51',
            SidePanel: '\uEF52',
            GlobeFavorite: '\uEF53',
            CaretTopLeftSolid8: '\uEF54',
            CaretTopRightSolid8: '\uEF55',
            ViewAll2: '\uEF56',
            DocumentReply: '\uEF57',
            PlayerSettings: '\uEF58',
            ReceiptForward: '\uEF59',
            ReceiptReply: '\uEF5A',
            ReceiptCheck: '\uEF5B',
            Fax: '\uEF5C',
            RecurringEvent: '\uEF5D',
            ReplyAlt: '\uEF5E',
            ReplyAllAlt: '\uEF5F',
            EditStyle: '\uEF60',
            EditMail: '\uEF61',
            Lifesaver: '\uEF62',
            LifesaverLock: '\uEF63'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-7.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-7\"",
            src: "url('" + baseUrl + "fabric-icons-7-02107cf8.woff') format('woff')"
        },
        icons: {
            InboxCheck: '\uEF64',
            FolderSearch: '\uEF65',
            CollapseMenu: '\uEF66',
            ExpandMenu: '\uEF67',
            Boards: '\uEF68',
            SunAdd: '\uEF69',
            SunQuestionMark: '\uEF6A',
            LandscapeOrientation: '\uEF6B',
            DocumentSearch: '\uEF6C',
            PublicCalendar: '\uEF6D',
            PublicContactCard: '\uEF6E',
            PublicEmail: '\uEF6F',
            PublicFolder: '\uEF70',
            WordDocument: '\uEF71',
            PowerPointDocument: '\uEF72',
            ExcelDocument: '\uEF73',
            GroupedList: '\uEF74',
            ClassroomLogo: '\uEF75',
            Sections: '\uEF76',
            EditPhoto: '\uEF77',
            Starburst: '\uEF78',
            ShareiOS: '\uEF79',
            AirTickets: '\uEF7A',
            PencilReply: '\uEF7B',
            Tiles2: '\uEF7C',
            SkypeCircleCheck: '\uEF7D',
            SkypeCircleClock: '\uEF7E',
            SkypeCircleMinus: '\uEF7F',
            SkypeMessage: '\uEF83',
            ClosedCaption: '\uEF84',
            ATPLogo: '\uEF85',
            OfficeFormsLogoInverse: '\uEF86',
            RecycleBin: '\uEF87',
            EmptyRecycleBin: '\uEF88',
            Hide2: '\uEF89',
            Breadcrumb: '\uEF8C',
            BirthdayCake: '\uEF8D',
            TimeEntry: '\uEF95',
            PageEdit: '\uEFB6',
            PageRemove: '\uEFBA',
            Database: '\uEFC7',
            EditContact: '\uEFD3',
            ConnectContacts: '\uEFD4',
            ActivateOrders: '\uEFE0',
            DeactivateOrders: '\uEFE1',
            DocumentManagement: '\uEFFC',
            CRMReport: '\uEFFE',
            ZipFolder: '\uF012',
            SurveyQuestions: '\uF01B',
            TextDocument: '\uF029',
            TextDocumentShared: '\uF02B',
            PageCheckedOut: '\uF02C',
            SaveAndClose: '\uF038',
            Script: '\uF03A',
            Archive: '\uF03F',
            ActivityFeed: '\uF056',
            EventDate: '\uF059',
            ArrowUpRight: '\uF069',
            CaretRight: '\uF06B',
            SetAction: '\uF071',
            CaretSolidLeft: '\uF08D',
            CaretSolidDown: '\uF08E',
            CaretSolidRight: '\uF08F',
            CaretSolidUp: '\uF090',
            PowerAppsLogo: '\uF091',
            PowerApps2Logo: '\uF092',
            SearchIssue: '\uF09A',
            SearchIssueMirrored: '\uF09B',
            FabricAssetLibrary: '\uF09C',
            FabricDataConnectionLibrary: '\uF09D',
            FabricDocLibrary: '\uF09E',
            FabricFormLibrary: '\uF09F',
            FabricFormLibraryMirrored: '\uF0A0',
            FabricReportLibrary: '\uF0A1',
            FabricReportLibraryMirrored: '\uF0A2',
            FabricPublicFolder: '\uF0A3',
            FabricFolderSearch: '\uF0A4',
            FabricMovetoFolder: '\uF0A5',
            FabricUnsyncFolder: '\uF0A6',
            FabricSyncFolder: '\uF0A7',
            FabricOpenFolderHorizontal: '\uF0A8',
            FabricFolder: '\uF0A9',
            FabricFolderFill: '\uF0AA',
            FabricNewFolder: '\uF0AB',
            FabricPictureLibrary: '\uF0AC',
            AddFavorite: '\uF0C8',
            AddFavoriteFill: '\uF0C9',
            BufferTimeBefore: '\uF0CF',
            BufferTimeAfter: '\uF0D0',
            BufferTimeBoth: '\uF0D1',
            CannedChat: '\uF0F2',
            SkypeForBusinessLogo: '\uF0FC',
            PageCheckedin: '\uF104',
            ReadOutLoud: '\uF112',
            CaretBottomLeftSolid8: '\uF121',
            CaretBottomRightSolid8: '\uF122',
            FolderHorizontal: '\uF12B',
            MicrosoftStaffhubLogo: '\uF130',
            GiftboxOpen: '\uF133',
            StatusCircleOuter: '\uF136'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-8.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-8\"",
            src: "url('" + baseUrl + "fabric-icons-8-645fa64e.woff') format('woff')"
        },
        icons: {
            StatusCircleInner: '\uF137',
            StatusCircleRing: '\uF138',
            StatusTriangleOuter: '\uF139',
            StatusTriangleInner: '\uF13A',
            StatusTriangleExclamation: '\uF13B',
            StatusCircleExclamation: '\uF13C',
            StatusCircleErrorX: '\uF13D',
            StatusCircleInfo: '\uF13F',
            StatusCircleBlock2: '\uF141',
            StatusCircleQuestionMark: '\uF142',
            Toll: '\uF160',
            ExploreContentSingle: '\uF164',
            CollapseContent: '\uF165',
            CollapseContentSingle: '\uF166',
            InfoSolid: '\uF167',
            ProgressRingDots: '\uF16A',
            CaloriesAdd: '\uF172',
            BranchFork: '\uF173',
            MobileReport: '\uF18A',
            HardDriveGroup: '\uF18F',
            FastMode: '\uF19A',
            ToggleOn: '\uF19E',
            ToggleOff: '\uF19F',
            Trophy2: '\uF1AE',
            BucketColor: '\uF1B6',
            BucketColorFill: '\uF1B7',
            Taskboard: '\uF1C2',
            SingleColumn: '\uF1D3',
            DoubleColumn: '\uF1D4',
            TripleColumn: '\uF1D5',
            ColumnLeftTwoThirds: '\uF1D6',
            ColumnRightTwoThirds: '\uF1D7',
            AccessLogoFill: '\uF1DB',
            AnalyticsLogo: '\uF1DE',
            AnalyticsQuery: '\uF1DF',
            NewAnalyticsQuery: '\uF1E0',
            AnalyticsReport: '\uF1E1',
            WordLogo: '\uF1E3',
            WordLogoFill: '\uF1E4',
            ExcelLogo: '\uF1E5',
            ExcelLogoFill: '\uF1E6',
            OneNoteLogo: '\uF1E7',
            OneNoteLogoFill: '\uF1E8',
            OutlookLogo: '\uF1E9',
            OutlookLogoFill: '\uF1EA',
            PowerPointLogo: '\uF1EB',
            PowerPointLogoFill: '\uF1EC',
            PublisherLogo: '\uF1ED',
            PublisherLogoFill: '\uF1EE',
            ScheduleEventAction: '\uF1EF',
            FlameSolid: '\uF1F3',
            ServerProcesses: '\uF1FE',
            Server: '\uF201',
            SaveAll: '\uF203',
            LinkedInLogo: '\uF20A',
            Decimals: '\uF218',
            SidePanelMirrored: '\uF221',
            ProtectRestrict: '\uF22A',
            UnknownMirrored: '\uF22E',
            PublicContactCardMirrored: '\uF230',
            GridViewSmall: '\uF232',
            GridViewMedium: '\uF233',
            GridViewLarge: '\uF234',
            Step: '\uF241',
            StepInsert: '\uF242',
            StepShared: '\uF243',
            StepSharedAdd: '\uF244',
            StepSharedInsert: '\uF245',
            ViewDashboard: '\uF246',
            ViewList: '\uF247',
            ViewListGroup: '\uF248',
            ViewListTree: '\uF249',
            TriggerAuto: '\uF24A',
            TriggerUser: '\uF24B',
            PivotChart: '\uF24C',
            StackedBarChart: '\uF24D',
            StackedLineChart: '\uF24E',
            BuildQueue: '\uF24F',
            BuildQueueNew: '\uF250',
            UserFollowed: '\uF25C',
            ContactLink: '\uF25F',
            Stack: '\uF26F',
            Bullseye: '\uF272',
            VennDiagram: '\uF273',
            FiveTileGrid: '\uF274',
            FocalPoint: '\uF277',
            RingerRemove: '\uF279',
            TeamsLogoInverse: '\uF27A',
            TeamsLogo: '\uF27B',
            TeamsLogoFill: '\uF27C',
            SkypeForBusinessLogoFill: '\uF27D',
            SharepointLogo: '\uF27E',
            SharepointLogoFill: '\uF27F',
            DelveLogo: '\uF280',
            DelveLogoFill: '\uF281',
            OfficeVideoLogo: '\uF282',
            OfficeVideoLogoFill: '\uF283',
            ExchangeLogo: '\uF284',
            ExchangeLogoFill: '\uF285',
            DocumentApproval: '\uF28B'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons-9.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-9\"",
            src: "url('" + baseUrl + "fabric-icons-9-53746c82.woff') format('woff')"
        },
        icons: {
            CloneToDesktop: '\uF28C',
            InstallToDrive: '\uF28D',
            Blur: '\uF28E',
            Build: '\uF28F',
            ProcessMetaTask: '\uF290',
            BranchFork2: '\uF291',
            BranchLocked: '\uF292',
            BranchCommit: '\uF293',
            BranchCompare: '\uF294',
            BranchMerge: '\uF295',
            BranchPullRequest: '\uF296',
            BranchSearch: '\uF297',
            BranchShelveset: '\uF298',
            RawSource: '\uF299',
            MergeDuplicate: '\uF29A',
            RowsGroup: '\uF29B',
            RowsChild: '\uF29C',
            Deploy: '\uF29D',
            Redeploy: '\uF29E',
            ServerEnviroment: '\uF29F',
            VisioDiagram: '\uF2A0',
            HighlightMappedShapes: '\uF2A1',
            TextCallout: '\uF2A2',
            IconSetsFlag: '\uF2A4',
            VisioLogo: '\uF2A7',
            VisioLogoFill: '\uF2A8',
            VisioDocument: '\uF2A9',
            TimelineProgress: '\uF2AA',
            TimelineDelivery: '\uF2AB',
            Backlog: '\uF2AC',
            TeamFavorite: '\uF2AD',
            TaskGroup: '\uF2AE',
            TaskGroupMirrored: '\uF2AF',
            ScopeTemplate: '\uF2B0',
            AssessmentGroupTemplate: '\uF2B1',
            NewTeamProject: '\uF2B2',
            CommentAdd: '\uF2B3',
            CommentNext: '\uF2B4',
            CommentPrevious: '\uF2B5',
            ShopServer: '\uF2B6',
            LocaleLanguage: '\uF2B7',
            QueryList: '\uF2B8',
            UserSync: '\uF2B9',
            UserPause: '\uF2BA',
            StreamingOff: '\uF2BB',
            ArrowTallUpLeft: '\uF2BD',
            ArrowTallUpRight: '\uF2BE',
            ArrowTallDownLeft: '\uF2BF',
            ArrowTallDownRight: '\uF2C0',
            FieldEmpty: '\uF2C1',
            FieldFilled: '\uF2C2',
            FieldChanged: '\uF2C3',
            FieldNotChanged: '\uF2C4',
            RingerOff: '\uF2C5',
            PlayResume: '\uF2C6',
            BulletedList2: '\uF2C7',
            BulletedList2Mirrored: '\uF2C8',
            ImageCrosshair: '\uF2C9',
            GitGraph: '\uF2CA',
            Repo: '\uF2CB',
            RepoSolid: '\uF2CC',
            FolderQuery: '\uF2CD',
            FolderList: '\uF2CE',
            FolderListMirrored: '\uF2CF',
            LocationOutline: '\uF2D0',
            POISolid: '\uF2D1',
            CalculatorNotEqualTo: '\uF2D2',
            BoxSubtractSolid: '\uF2D3',
            BoxAdditionSolid: '\uF2D4',
            BoxMultiplySolid: '\uF2D5',
            BoxPlaySolid: '\uF2D6',
            BoxCheckmarkSolid: '\uF2D7',
            CirclePauseSolid: '\uF2D8',
            CirclePause: '\uF2D9',
            MSNVideosSolid: '\uF2DA',
            CircleStopSolid: '\uF2DB',
            CircleStop: '\uF2DC',
            NavigateBack: '\uF2DD',
            NavigateBackMirrored: '\uF2DE',
            NavigateForward: '\uF2DF',
            NavigateForwardMirrored: '\uF2E0',
            UnknownSolid: '\uF2E1',
            UnknownMirroredSolid: '\uF2E2',
            CircleAddition: '\uF2E3',
            CircleAdditionSolid: '\uF2E4',
            FilePDB: '\uF2E5',
            FileTemplate: '\uF2E6',
            FileSQL: '\uF2E7',
            FileJAVA: '\uF2E8',
            FileASPX: '\uF2E9',
            FileCSS: '\uF2EA',
            FileSass: '\uF2EB',
            FileLess: '\uF2EC',
            FileHTML: '\uF2ED',
            JavaScriptLanguage: '\uF2EE',
            CSharpLanguage: '\uF2EF',
            CSharp: '\uF2F0',
            VisualBasicLanguage: '\uF2F1',
            VB: '\uF2F2',
            CPlusPlusLanguage: '\uF2F3'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/fabric-icons.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license
// tslint:disable:max-line-length

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons\"",
            src: "url('" + baseUrl + "fabric-icons-a13498cf.woff') format('woff')"
        },
        icons: {
            GlobalNavButton: '\uE700',
            ChevronDown: '\uE70D',
            ChevronUp: '\uE70E',
            Edit: '\uE70F',
            Add: '\uE710',
            Cancel: '\uE711',
            More: '\uE712',
            Settings: '\uE713',
            Mail: '\uE715',
            Filter: '\uE71C',
            Search: '\uE721',
            Share: '\uE72D',
            BlockedSite: '\uE72F',
            FavoriteStar: '\uE734',
            FavoriteStarFill: '\uE735',
            CheckMark: '\uE73E',
            Delete: '\uE74D',
            ChevronLeft: '\uE76B',
            ChevronRight: '\uE76C',
            Calendar: '\uE787',
            Megaphone: '\uE789',
            Undo: '\uE7A7',
            Flag: '\uE7C1',
            Page: '\uE7C3',
            Pinned: '\uE840',
            View: '\uE890',
            Clear: '\uE894',
            Download: '\uE896',
            Upload: '\uE898',
            Folder: '\uE8B7',
            Sort: '\uE8CB',
            AlignRight: '\uE8E2',
            AlignLeft: '\uE8E4',
            Tag: '\uE8EC',
            AddFriend: '\uE8FA',
            Info: '\uE946',
            SortLines: '\uE9D0',
            List: '\uEA37',
            CircleRing: '\uEA3A',
            Heart: '\uEB51',
            HeartFill: '\uEB52',
            Tiles: '\uECA5',
            Embed: '\uECCE',
            Glimmer: '\uECF4',
            Ascending: '\uEDC0',
            Descending: '\uEDC1',
            SortUp: '\uEE68',
            SortDown: '\uEE69',
            SyncToPC: '\uEE6E',
            LargeGrid: '\uEECB',
            SkypeCheck: '\uEF80',
            SkypeClock: '\uEF81',
            SkypeMinus: '\uEF82',
            ClearFilter: '\uEF8F',
            Flow: '\uEF90',
            StatusCircleCheckmark: '\uF13E',
            MoreVertical: '\uF2BC'
        }
    };
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIcons"])(subset, options);
}


/***/ }),

/***/ "../../packages/icons/lib/iconAliases.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerIconAliases", function() { return registerIconAliases; });
/* harmony import */ var _uifabric_styling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/index.js");

var registerIconAliases = function () {
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIconAlias"])('trash', 'delete');
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIconAlias"])('onedrive', 'onedrivelogo');
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIconAlias"])('sixpointstar', '6pointstar');
    Object(_uifabric_styling__WEBPACK_IMPORTED_MODULE_0__["registerIconAlias"])('twelvepointstar', '12pointstar');
};


/***/ }),

/***/ "../../packages/icons/lib/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return initializeIcons; });
/* harmony import */ var _fabric_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/icons/lib/fabric-icons.js");
/* harmony import */ var _fabric_icons_0__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/icons/lib/fabric-icons-0.js");
/* harmony import */ var _fabric_icons_1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/icons/lib/fabric-icons-1.js");
/* harmony import */ var _fabric_icons_10__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/icons/lib/fabric-icons-10.js");
/* harmony import */ var _fabric_icons_11__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/icons/lib/fabric-icons-11.js");
/* harmony import */ var _fabric_icons_12__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../packages/icons/lib/fabric-icons-12.js");
/* harmony import */ var _fabric_icons_13__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../packages/icons/lib/fabric-icons-13.js");
/* harmony import */ var _fabric_icons_14__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../../packages/icons/lib/fabric-icons-14.js");
/* harmony import */ var _fabric_icons_2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../../packages/icons/lib/fabric-icons-2.js");
/* harmony import */ var _fabric_icons_3__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../../packages/icons/lib/fabric-icons-3.js");
/* harmony import */ var _fabric_icons_4__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../../packages/icons/lib/fabric-icons-4.js");
/* harmony import */ var _fabric_icons_5__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("../../packages/icons/lib/fabric-icons-5.js");
/* harmony import */ var _fabric_icons_6__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("../../packages/icons/lib/fabric-icons-6.js");
/* harmony import */ var _fabric_icons_7__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("../../packages/icons/lib/fabric-icons-7.js");
/* harmony import */ var _fabric_icons_8__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("../../packages/icons/lib/fabric-icons-8.js");
/* harmony import */ var _fabric_icons_9__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("../../packages/icons/lib/fabric-icons-9.js");
/* harmony import */ var _iconAliases__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("../../packages/icons/lib/iconAliases.js");

















var DEFAULT_BASE_URL = 'https://spoprod-a.akamaihd.net/files/fabric/assets/icons/';
function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = DEFAULT_BASE_URL; }
    [_fabric_icons__WEBPACK_IMPORTED_MODULE_0__["initializeIcons"], _fabric_icons_0__WEBPACK_IMPORTED_MODULE_1__["initializeIcons"], _fabric_icons_1__WEBPACK_IMPORTED_MODULE_2__["initializeIcons"], _fabric_icons_2__WEBPACK_IMPORTED_MODULE_8__["initializeIcons"], _fabric_icons_3__WEBPACK_IMPORTED_MODULE_9__["initializeIcons"], _fabric_icons_4__WEBPACK_IMPORTED_MODULE_10__["initializeIcons"], _fabric_icons_5__WEBPACK_IMPORTED_MODULE_11__["initializeIcons"], _fabric_icons_6__WEBPACK_IMPORTED_MODULE_12__["initializeIcons"], _fabric_icons_7__WEBPACK_IMPORTED_MODULE_13__["initializeIcons"], _fabric_icons_8__WEBPACK_IMPORTED_MODULE_14__["initializeIcons"], _fabric_icons_9__WEBPACK_IMPORTED_MODULE_15__["initializeIcons"], _fabric_icons_10__WEBPACK_IMPORTED_MODULE_3__["initializeIcons"], _fabric_icons_11__WEBPACK_IMPORTED_MODULE_4__["initializeIcons"], _fabric_icons_12__WEBPACK_IMPORTED_MODULE_5__["initializeIcons"], _fabric_icons_13__WEBPACK_IMPORTED_MODULE_6__["initializeIcons"], _fabric_icons_14__WEBPACK_IMPORTED_MODULE_7__["initializeIcons"]].forEach(function (initialize) { return initialize(baseUrl, options); });
    Object(_iconAliases__WEBPACK_IMPORTED_MODULE_16__["registerIconAliases"])();
}


/***/ }),

/***/ "../../packages/merge-styles/lib/Stylesheet.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InjectionMode", function() { return InjectionMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Stylesheet", function() { return Stylesheet; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");

/**
 * Injection mode for the stylesheet.
 *
 * @public
 */
var InjectionMode;
(function (InjectionMode) {
    /**
     * Avoids style injection, use getRules() to read the styles.
     */
    InjectionMode[InjectionMode["none"] = 0] = "none";
    /**
     * Inserts rules using the insertRule api.
     */
    InjectionMode[InjectionMode["insertNode"] = 1] = "insertNode";
    /**
     * Appends rules using appendChild.
     */
    InjectionMode[InjectionMode["appendChild"] = 2] = "appendChild";
})(InjectionMode || (InjectionMode = {}));
var STYLESHEET_SETTING = '__stylesheet__';
// tslint:disable-next-line:no-any
var _fileScopedGlobal = {};
var _stylesheet;
/**
 * Represents the state of styles registered in the page. Abstracts
 * the surface for adding styles to the stylesheet, exposes helpers
 * for reading the styles registered in server rendered scenarios.
 *
 * @public
 */
var Stylesheet = /** @class */ (function () {
    function Stylesheet(config) {
        this._rules = [];
        this._preservedRules = [];
        this._rulesToInsert = [];
        this._counter = 0;
        this._keyToClassName = {};
        this._onResetCallbacks = [];
        // tslint:disable-next-line:no-any
        this._classNameToArgs = {};
        this._config = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({ injectionMode: 1 /* insertNode */, defaultPrefix: 'css', namespace: undefined }, config);
    }
    /**
     * Gets the singleton instance.
     */
    Stylesheet.getInstance = function () {
        // tslint:disable-next-line:no-any
        var global = typeof window !== 'undefined' ? window : typeof process !== 'undefined' ? process : _fileScopedGlobal;
        _stylesheet = global[STYLESHEET_SETTING];
        if (!_stylesheet || (_stylesheet._lastStyleElement && _stylesheet._lastStyleElement.ownerDocument !== document)) {
            // tslint:disable-next-line:no-string-literal
            var fabricConfig = (global && global['FabricConfig']) || {};
            _stylesheet = global[STYLESHEET_SETTING] = new Stylesheet(fabricConfig.mergeStyles);
        }
        return _stylesheet;
    };
    /**
     * Configures the stylesheet.
     */
    Stylesheet.prototype.setConfig = function (config) {
        this._config = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._config, config);
    };
    /**
     * Configures a reset callback.
     *
     * @param callback - A callback which will be called when the Stylesheet is reset.
     */
    Stylesheet.prototype.onReset = function (callback) {
        this._onResetCallbacks.push(callback);
    };
    /**
     * Generates a unique classname.
     *
     * @param displayName - Optional value to use as a prefix.
     */
    Stylesheet.prototype.getClassName = function (displayName) {
        var namespace = this._config.namespace;
        var prefix = displayName || this._config.defaultPrefix;
        return "" + (namespace ? namespace + '-' : '') + prefix + "-" + this._counter++;
    };
    /**
     * Used internally to cache information about a class which was
     * registered with the stylesheet.
     */
    Stylesheet.prototype.cacheClassName = function (className, key, args, rules) {
        this._keyToClassName[key] = className;
        this._classNameToArgs[className] = {
            args: args,
            rules: rules
        };
    };
    /**
     * Gets the appropriate classname given a key which was previously
     * registered using cacheClassName.
     */
    Stylesheet.prototype.classNameFromKey = function (key) {
        return this._keyToClassName[key];
    };
    /**
     * Gets the arguments associated with a given classname which was
     * previously registered using cacheClassName.
     */
    Stylesheet.prototype.argsFromClassName = function (className) {
        var entry = this._classNameToArgs[className];
        return entry && entry.args;
    };
    /**
     * Gets the arguments associated with a given classname which was
     * previously registered using cacheClassName.
     */
    Stylesheet.prototype.insertedRulesFromClassName = function (className) {
        var entry = this._classNameToArgs[className];
        return entry && entry.rules;
    };
    /**
     * Inserts a css rule into the stylesheet.
     * @param preserve - Preserves the rule beyond a reset boundary.
     */
    Stylesheet.prototype.insertRule = function (rule, preserve) {
        var injectionMode = this._config.injectionMode;
        var element = injectionMode !== 0 /* none */ ? this._getStyleElement() : undefined;
        if (preserve) {
            this._preservedRules.push(rule);
        }
        if (element) {
            switch (this._config.injectionMode) {
                case 1 /* insertNode */:
                    var sheet = element.sheet;
                    try {
                        sheet.insertRule(rule, sheet.cssRules.length);
                    }
                    catch (e) {
                        // The browser will throw exceptions on unsupported rules (such as a moz prefix in webkit.)
                        // We need to swallow the exceptions for this scenario, otherwise we'd need to filter
                        // which could be slower and bulkier.
                    }
                    break;
                case 2 /* appendChild */:
                    element.appendChild(document.createTextNode(rule));
                    break;
            }
        }
        else {
            this._rules.push(rule);
        }
        if (this._config.onInsertRule) {
            this._config.onInsertRule(rule);
        }
    };
    /**
     * Gets all rules registered with the stylesheet; only valid when
     * using InsertionMode.none.
     */
    Stylesheet.prototype.getRules = function (includePreservedRules) {
        return ((includePreservedRules ? this._preservedRules.join('') : '') + this._rules.join('') + this._rulesToInsert.join(''));
    };
    /**
     * Resets the internal state of the stylesheet. Only used in server
     * rendered scenarios where we're using InsertionMode.none.
     */
    Stylesheet.prototype.reset = function () {
        this._rules = [];
        this._rulesToInsert = [];
        this._counter = 0;
        this._classNameToArgs = {};
        this._keyToClassName = {};
        this._onResetCallbacks.forEach(function (callback) { return callback(); });
    };
    // Forces the regeneration of incoming styles without totally resetting the stylesheet.
    Stylesheet.prototype.resetKeys = function () {
        this._keyToClassName = {};
    };
    Stylesheet.prototype._getStyleElement = function () {
        var _this = this;
        if (!this._styleElement && typeof document !== 'undefined') {
            this._styleElement = this._createStyleElement();
            // Reset the style element on the next frame.
            window.requestAnimationFrame(function () {
                _this._styleElement = undefined;
            });
        }
        return this._styleElement;
    };
    Stylesheet.prototype._createStyleElement = function () {
        var styleElement = document.createElement('style');
        styleElement.setAttribute('data-merge-styles', 'true');
        styleElement.type = 'text/css';
        if (this._lastStyleElement && this._lastStyleElement.nextElementSibling) {
            document.head.insertBefore(styleElement, this._lastStyleElement.nextElementSibling);
        }
        else {
            document.head.appendChild(styleElement);
        }
        this._lastStyleElement = styleElement;
        return styleElement;
    };
    return Stylesheet;
}());


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../../common/temp/node_modules/process/browser.js")))

/***/ }),

/***/ "../../packages/merge-styles/lib/concatStyleSets.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concatStyleSets", function() { return concatStyleSets; });
/**
 * Combine a set of styles together (but does not register css classes).
 * @param styleSets One or more stylesets to be merged (each param can also be falsy).
 */
function concatStyleSets() {
    var styleSets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        styleSets[_i] = arguments[_i];
    }
    var mergedSet = {};
    // We process sub component styles in two phases. First we collect them, then we combine them into 1 style function.
    var workingSubcomponentStyles = {};
    for (var _a = 0, styleSets_1 = styleSets; _a < styleSets_1.length; _a++) {
        var currentSet = styleSets_1[_a];
        if (currentSet) {
            for (var prop in currentSet) {
                if (currentSet.hasOwnProperty(prop)) {
                    if (prop === 'subComponentStyles' && currentSet.subComponentStyles !== undefined) {
                        // subcomponent styles - style functions or objects
                        var currentComponentStyles = currentSet.subComponentStyles;
                        for (var subCompProp in currentComponentStyles) {
                            if (currentComponentStyles.hasOwnProperty(subCompProp)) {
                                if (workingSubcomponentStyles.hasOwnProperty(subCompProp)) {
                                    workingSubcomponentStyles[subCompProp].push(currentComponentStyles[subCompProp]);
                                }
                                else {
                                    workingSubcomponentStyles[subCompProp] = [currentComponentStyles[subCompProp]];
                                }
                            }
                        }
                        continue;
                    }
                    // the as any casts below is a workaround for ts 2.8.
                    // todo: remove cast to any in ts 2.9.
                    var mergedValue = mergedSet[prop];
                    var currentValue = currentSet[prop];
                    if (mergedValue === undefined) {
                        mergedSet[prop] = currentValue;
                    }
                    else {
                        mergedSet[prop] = (Array.isArray(mergedValue) ? mergedValue : [mergedValue]).concat((Array.isArray(currentValue) ? currentValue : [currentValue]));
                    }
                }
            }
        }
    }
    if (Object.keys(workingSubcomponentStyles).length > 0) {
        mergedSet.subComponentStyles = {};
        var mergedSubStyles = mergedSet.subComponentStyles;
        var _loop_1 = function (subCompProp) {
            if (workingSubcomponentStyles.hasOwnProperty(subCompProp)) {
                var workingSet_1 = workingSubcomponentStyles[subCompProp];
                mergedSubStyles[subCompProp] = function (styleProps) {
                    return concatStyleSets.apply(void 0, workingSet_1.map(function (styleFunctionOrObject) {
                        return typeof styleFunctionOrObject === 'function' ? styleFunctionOrObject(styleProps) : styleFunctionOrObject;
                    }));
                };
            }
        };
        // now we process the subcomponent styles if there are any
        for (var subCompProp in workingSubcomponentStyles) {
            _loop_1(subCompProp);
        }
    }
    return mergedSet;
}


/***/ }),

/***/ "../../packages/merge-styles/lib/extractStyleParts.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractStyleParts", function() { return extractStyleParts; });
/* harmony import */ var _Stylesheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/Stylesheet.js");

/**
 * Separates the classes and style objects. Any classes that are pre-registered
 * args are auto expanded into objects.
 */
function extractStyleParts() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var classes = [];
    var objects = [];
    var stylesheet = _Stylesheet__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance();
    function _processArgs(argsList) {
        for (var _i = 0, argsList_1 = argsList; _i < argsList_1.length; _i++) {
            var arg = argsList_1[_i];
            if (arg) {
                if (typeof arg === 'string') {
                    if (arg.indexOf(' ') >= 0) {
                        _processArgs(arg.split(' '));
                    }
                    else {
                        var translatedArgs = stylesheet.argsFromClassName(arg);
                        if (translatedArgs) {
                            _processArgs(translatedArgs);
                        }
                        else {
                            // Avoid adding the same class twice.
                            if (classes.indexOf(arg) === -1) {
                                classes.push(arg);
                            }
                        }
                    }
                }
                else if (Array.isArray(arg)) {
                    _processArgs(arg);
                }
                else if (typeof arg === 'object') {
                    objects.push(arg);
                }
            }
        }
    }
    _processArgs(args);
    return {
        classes: classes,
        objects: objects
    };
}


/***/ }),

/***/ "../../packages/merge-styles/lib/fontFace.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fontFace", function() { return fontFace; });
/* harmony import */ var _Stylesheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/Stylesheet.js");
/* harmony import */ var _styleToClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/merge-styles/lib/styleToClassName.js");


/**
 * Registers a font face.
 * @public
 */
function fontFace(font) {
    _Stylesheet__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance().insertRule("@font-face{" + Object(_styleToClassName__WEBPACK_IMPORTED_MODULE_1__["serializeRuleEntries"])(font) + "}", true);
}


/***/ }),

/***/ "../../packages/merge-styles/lib/getVendorSettings.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVendorSettings", function() { return getVendorSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setVendorSettings", function() { return setVendorSettings; });
var _vendorSettings;
function getVendorSettings() {
    if (!_vendorSettings) {
        var doc = typeof document !== 'undefined' ? document : undefined;
        var nav = typeof navigator !== 'undefined' ? navigator : undefined;
        var userAgent = nav ? nav.userAgent.toLowerCase() : undefined;
        if (!doc) {
            _vendorSettings = {
                isWebkit: true,
                isMoz: true,
                isOpera: true,
                isMs: true
            };
        }
        else {
            _vendorSettings = {
                isWebkit: !!(doc && 'WebkitAppearance' in doc.documentElement.style),
                isMoz: !!(userAgent && userAgent.indexOf('firefox') > -1),
                isOpera: !!(userAgent && userAgent.indexOf('opera') > -1),
                isMs: !!(nav && (/rv:11.0/i.test(nav.userAgent) || /Edge\/\d./i.test(navigator.userAgent)))
            };
        }
    }
    return _vendorSettings;
}
/**
 * Sets the vendor settings for prefixing and vendor specific operations.
 */
function setVendorSettings(vendorSettings) {
    _vendorSettings = vendorSettings;
}


/***/ }),

/***/ "../../packages/merge-styles/lib/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mergeStyles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/mergeStyles.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeStyles", function() { return _mergeStyles__WEBPACK_IMPORTED_MODULE_0__["mergeStyles"]; });

/* harmony import */ var _mergeStyleSets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/merge-styles/lib/mergeStyleSets.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeStyleSets", function() { return _mergeStyleSets__WEBPACK_IMPORTED_MODULE_1__["mergeStyleSets"]; });

/* harmony import */ var _concatStyleSets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/merge-styles/lib/concatStyleSets.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "concatStyleSets", function() { return _concatStyleSets__WEBPACK_IMPORTED_MODULE_2__["concatStyleSets"]; });

/* harmony import */ var _fontFace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/merge-styles/lib/fontFace.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fontFace", function() { return _fontFace__WEBPACK_IMPORTED_MODULE_3__["fontFace"]; });

/* harmony import */ var _keyframes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/merge-styles/lib/keyframes.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "keyframes", function() { return _keyframes__WEBPACK_IMPORTED_MODULE_4__["keyframes"]; });

/* harmony import */ var _Stylesheet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../packages/merge-styles/lib/Stylesheet.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InjectionMode", function() { return _Stylesheet__WEBPACK_IMPORTED_MODULE_5__["InjectionMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Stylesheet", function() { return _Stylesheet__WEBPACK_IMPORTED_MODULE_5__["Stylesheet"]; });

/* harmony import */ var _transforms_rtlifyRules__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../packages/merge-styles/lib/transforms/rtlifyRules.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setRTL", function() { return _transforms_rtlifyRules__WEBPACK_IMPORTED_MODULE_6__["setRTL"]; });










/***/ }),

/***/ "../../packages/merge-styles/lib/keyframes.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keyframes", function() { return keyframes; });
/* harmony import */ var _Stylesheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/Stylesheet.js");
/* harmony import */ var _styleToClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/merge-styles/lib/styleToClassName.js");


/**
 * Registers keyframe definitions.
 *
 * @public
 */
function keyframes(timeline) {
    var stylesheet = _Stylesheet__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance();
    var name = stylesheet.getClassName();
    var rulesArray = [];
    for (var prop in timeline) {
        if (timeline.hasOwnProperty(prop)) {
            rulesArray.push(prop, '{', Object(_styleToClassName__WEBPACK_IMPORTED_MODULE_1__["serializeRuleEntries"])(timeline[prop]), '}');
        }
    }
    var rules = rulesArray.join('');
    stylesheet.insertRule("@keyframes " + name + "{" + rules + "}", true);
    stylesheet.cacheClassName(name, rules, [], ['keyframes', rules]);
    return name;
}


/***/ }),

/***/ "../../packages/merge-styles/lib/mergeStyleSets.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeStyleSets", function() { return mergeStyleSets; });
/* harmony import */ var _extractStyleParts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/extractStyleParts.js");
/* harmony import */ var _concatStyleSets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/merge-styles/lib/concatStyleSets.js");
/* harmony import */ var _styleToClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/merge-styles/lib/styleToClassName.js");



/**
 * Takes in one or more style set objects, each consisting of a set of areas,
 * each which will produce a class name. Using this is analogous to calling
 * `mergeStyles` for each property in the object, but ensures we maintain the
 * set ordering when multiple style sets are merged.
 *
 * @param styleSets One or more style sets to be merged.
 */
function mergeStyleSets() {
    var styleSets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        styleSets[_i] = arguments[_i];
    }
    // tslint:disable-next-line:no-any
    var classNameSet = { subComponentStyles: {} };
    var classMap = {};
    var styleSet = styleSets[0];
    if (!styleSet && styleSets.length <= 1) {
        return { subComponentStyles: {} };
    }
    var concatenatedStyleSet = 
    // we have guarded against falsey values just above.
    styleSet;
    if (styleSets.length > 1) {
        concatenatedStyleSet = _concatStyleSets__WEBPACK_IMPORTED_MODULE_1__["concatStyleSets"].apply(void 0, styleSets);
    }
    var registrations = [];
    for (var styleSetArea in concatenatedStyleSet) {
        if (concatenatedStyleSet.hasOwnProperty(styleSetArea)) {
            if (styleSetArea === 'subComponentStyles') {
                classNameSet.subComponentStyles = concatenatedStyleSet.subComponentStyles || {};
                continue;
            }
            var styles = concatenatedStyleSet[styleSetArea];
            var _a = Object(_extractStyleParts__WEBPACK_IMPORTED_MODULE_0__["extractStyleParts"])(styles), classes = _a.classes, objects = _a.objects;
            var registration = Object(_styleToClassName__WEBPACK_IMPORTED_MODULE_2__["styleToRegistration"])({ displayName: styleSetArea }, objects);
            registrations.push(registration);
            if (registration) {
                classMap[styleSetArea] = registration.className;
                // as any cast not needed in ts >=2.9
                classNameSet[styleSetArea] = classes.concat([registration.className]).join(' ');
            }
        }
    }
    for (var _b = 0, registrations_1 = registrations; _b < registrations_1.length; _b++) {
        var registration = registrations_1[_b];
        if (registration) {
            Object(_styleToClassName__WEBPACK_IMPORTED_MODULE_2__["applyRegistration"])(registration, classMap);
        }
    }
    return classNameSet;
}


/***/ }),

/***/ "../../packages/merge-styles/lib/mergeStyles.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeStyles", function() { return mergeStyles; });
/* harmony import */ var _styleToClassName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/styleToClassName.js");
/* harmony import */ var _extractStyleParts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/merge-styles/lib/extractStyleParts.js");


/**
 * Concatination helper, which can merge class names together. Skips over falsey values.
 *
 * @public
 */
function mergeStyles() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var _a = Object(_extractStyleParts__WEBPACK_IMPORTED_MODULE_1__["extractStyleParts"])(args), classes = _a.classes, objects = _a.objects;
    if (objects.length) {
        classes.push(Object(_styleToClassName__WEBPACK_IMPORTED_MODULE_0__["styleToClassName"])(objects));
    }
    return classes.join(' ');
}


/***/ }),

/***/ "../../packages/merge-styles/lib/styleToClassName.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serializeRuleEntries", function() { return serializeRuleEntries; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styleToRegistration", function() { return styleToRegistration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyRegistration", function() { return applyRegistration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styleToClassName", function() { return styleToClassName; });
/* harmony import */ var _Stylesheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/Stylesheet.js");
/* harmony import */ var _transforms_kebabRules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/merge-styles/lib/transforms/kebabRules.js");
/* harmony import */ var _transforms_prefixRules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/merge-styles/lib/transforms/prefixRules.js");
/* harmony import */ var _transforms_provideUnits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/merge-styles/lib/transforms/provideUnits.js");
/* harmony import */ var _transforms_rtlifyRules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/merge-styles/lib/transforms/rtlifyRules.js");





var DISPLAY_NAME = 'displayName';
function getDisplayName(rules) {
    var rootStyle = rules && rules['&'];
    return rootStyle ? rootStyle.displayName : undefined;
}
function extractRules(args, rules, currentSelector) {
    if (rules === void 0) { rules = { __order: [] }; }
    if (currentSelector === void 0) { currentSelector = '&'; }
    var stylesheet = _Stylesheet__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance();
    var currentRules = rules[currentSelector];
    if (!currentRules) {
        currentRules = {};
        rules[currentSelector] = currentRules;
        rules.__order.push(currentSelector);
    }
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        // If the arg is a string, we need to look up the class map and merge.
        if (typeof arg === 'string') {
            var expandedRules = stylesheet.argsFromClassName(arg);
            if (expandedRules) {
                extractRules(expandedRules, rules, currentSelector);
            }
            // Else if the arg is an array, we need to recurse in.
        }
        else if (Array.isArray(arg)) {
            extractRules(arg, rules, currentSelector);
        }
        else {
            // tslint:disable-next-line:no-any
            for (var prop in arg) {
                if (prop === 'selectors') {
                    // tslint:disable-next-line:no-any
                    var selectors = arg.selectors;
                    for (var newSelector in selectors) {
                        if (selectors.hasOwnProperty(newSelector)) {
                            var selectorValue = selectors[newSelector];
                            if (newSelector.indexOf(':global(') === 0) {
                                newSelector = newSelector.replace(/:global\(|\)$/g, '');
                            }
                            else if (newSelector.indexOf('@media') === 0) {
                                newSelector = newSelector + '{' + currentSelector;
                            }
                            else if (newSelector.indexOf(':') === 0) {
                                newSelector = currentSelector + newSelector;
                            }
                            else if (newSelector.indexOf('&') < 0) {
                                newSelector = currentSelector + ' ' + newSelector;
                            }
                            extractRules([selectorValue], rules, newSelector);
                        }
                    }
                }
                else {
                    // Else, add the rule to the currentSelector.
                    if (prop === 'margin' || prop === 'padding') {
                        // tslint:disable-next-line:no-any
                        expandQuads(currentRules, prop, arg[prop]);
                    }
                    else {
                        // tslint:disable-next-line:no-any
                        currentRules[prop] = arg[prop];
                    }
                }
            }
        }
    }
    return rules;
}
function expandQuads(currentRules, name, value) {
    var parts = typeof value === 'string' ? value.split(' ') : [value];
    currentRules[name + 'Top'] = parts[0];
    currentRules[name + 'Right'] = parts[1] || parts[0];
    currentRules[name + 'Bottom'] = parts[2] || parts[0];
    currentRules[name + 'Left'] = parts[3] || parts[1] || parts[0];
}
function getKeyForRules(rules) {
    var serialized = [];
    var hasProps = false;
    for (var _i = 0, _a = rules.__order; _i < _a.length; _i++) {
        var selector = _a[_i];
        serialized.push(selector);
        var rulesForSelector = rules[selector];
        for (var propName in rulesForSelector) {
            if (rulesForSelector.hasOwnProperty(propName) && rulesForSelector[propName] !== undefined) {
                hasProps = true;
                serialized.push(propName, rulesForSelector[propName]);
            }
        }
    }
    return hasProps ? serialized.join('') : undefined;
}
function serializeRuleEntries(ruleEntries) {
    if (!ruleEntries) {
        return '';
    }
    var allEntries = [];
    for (var entry in ruleEntries) {
        if (ruleEntries.hasOwnProperty(entry) && entry !== DISPLAY_NAME && ruleEntries[entry] !== undefined) {
            allEntries.push(entry, ruleEntries[entry]);
        }
    }
    // Apply transforms.
    for (var i = 0; i < allEntries.length; i += 2) {
        Object(_transforms_kebabRules__WEBPACK_IMPORTED_MODULE_1__["kebabRules"])(allEntries, i);
        Object(_transforms_provideUnits__WEBPACK_IMPORTED_MODULE_3__["provideUnits"])(allEntries, i);
        Object(_transforms_rtlifyRules__WEBPACK_IMPORTED_MODULE_4__["rtlifyRules"])(allEntries, i);
        Object(_transforms_prefixRules__WEBPACK_IMPORTED_MODULE_2__["prefixRules"])(allEntries, i);
    }
    // Apply punctuation.
    for (var i = 1; i < allEntries.length; i += 4) {
        allEntries.splice(i, 1, ':', allEntries[i], ';');
    }
    return allEntries.join('');
}
function styleToRegistration() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var rules = extractRules(args);
    var key = getKeyForRules(rules);
    if (key) {
        var stylesheet = _Stylesheet__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance();
        var registration = {
            className: stylesheet.classNameFromKey(key),
            key: key,
            args: args
        };
        if (!registration.className) {
            registration.className = stylesheet.getClassName(getDisplayName(rules));
            var rulesToInsert = [];
            for (var _a = 0, _b = rules.__order; _a < _b.length; _a++) {
                var selector = _b[_a];
                rulesToInsert.push(selector, serializeRuleEntries(rules[selector]));
            }
            registration.rulesToInsert = rulesToInsert;
        }
        return registration;
    }
}
function applyRegistration(registration, classMap) {
    var stylesheet = _Stylesheet__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance();
    var className = registration.className, key = registration.key, args = registration.args, rulesToInsert = registration.rulesToInsert;
    if (rulesToInsert) {
        // rulesToInsert is an ordered array of selector/rule pairs.
        for (var i = 0; i < rulesToInsert.length; i += 2) {
            var rules = rulesToInsert[i + 1];
            if (rules) {
                var selector = rulesToInsert[i];
                // Fix selector using map.
                selector = selector.replace(/(&)|\$([\w-]+)\b/g, function (match, amp, cn) {
                    if (amp) {
                        return '.' + registration.className;
                    }
                    else if (cn) {
                        return '.' + ((classMap && classMap[cn]) || cn);
                    }
                    return '';
                });
                // Insert. Note if a media query, we must close the query with a final bracket.
                var processedRule = selector + "{" + rules + "}" + (selector.indexOf('@media') === 0 ? '}' : '');
                stylesheet.insertRule(processedRule);
            }
        }
        stylesheet.cacheClassName(className, key, args, rulesToInsert);
    }
}
function styleToClassName() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var registration = styleToRegistration.apply(void 0, args);
    if (registration) {
        applyRegistration(registration);
        return registration.className;
    }
    return '';
}


/***/ }),

/***/ "../../packages/merge-styles/lib/transforms/kebabRules.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kebabRules", function() { return kebabRules; });
function kebabRules(rulePairs, index) {
    rulePairs[index] = rulePairs[index].replace(/([A-Z])/g, '-$1').toLowerCase();
}


/***/ }),

/***/ "../../packages/merge-styles/lib/transforms/prefixRules.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prefixRules", function() { return prefixRules; });
/* harmony import */ var _getVendorSettings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/getVendorSettings.js");

var autoPrefixNames = {
    'user-select': 1
};
function prefixRules(rulePairs, index) {
    var vendorSettings = Object(_getVendorSettings__WEBPACK_IMPORTED_MODULE_0__["getVendorSettings"])();
    var name = rulePairs[index];
    if (autoPrefixNames[name]) {
        var value = rulePairs[index + 1];
        if (autoPrefixNames[name]) {
            if (vendorSettings.isWebkit) {
                rulePairs.push('-webkit-' + name, value);
            }
            if (vendorSettings.isMoz) {
                rulePairs.push('-moz-' + name, value);
            }
            if (vendorSettings.isMs) {
                rulePairs.push('-ms-' + name, value);
            }
            if (vendorSettings.isOpera) {
                rulePairs.push('-o-' + name, value);
            }
        }
    }
}


/***/ }),

/***/ "../../packages/merge-styles/lib/transforms/provideUnits.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "provideUnits", function() { return provideUnits; });
var NON_PIXEL_NUMBER_PROPS = [
    'column-count',
    'font-weight',
    'flex-basis',
    'flex',
    'flex-grow',
    'flex-shrink',
    'fill-opacity',
    'opacity',
    'order',
    'z-index',
    'zoom'
];
function provideUnits(rulePairs, index) {
    var name = rulePairs[index];
    var value = rulePairs[index + 1];
    if (typeof value === 'number') {
        var unit = NON_PIXEL_NUMBER_PROPS.indexOf(name) === -1 ? 'px' : '';
        rulePairs[index + 1] = "" + value + unit;
    }
}


/***/ }),

/***/ "../../packages/merge-styles/lib/transforms/rtlifyRules.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setRTL", function() { return setRTL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRTL", function() { return getRTL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rtlifyRules", function() { return rtlifyRules; });
/* harmony import */ var _Stylesheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/Stylesheet.js");

var LEFT = 'left';
var RIGHT = 'right';
var NO_FLIP = '@noflip';
var NAME_REPLACEMENTS = (_a = {},
    _a[LEFT] = RIGHT,
    _a[RIGHT] = LEFT,
    _a);
var VALUE_REPLACEMENTS = {
    'w-resize': 'e-resize',
    'sw-resize': 'se-resize',
    'nw-resize': 'ne-resize'
};
var _rtl = getRTL();
/**
 * Sets the current RTL value.
 */
function setRTL(isRTL) {
    if (_rtl !== isRTL) {
        _Stylesheet__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance().resetKeys();
        _rtl = isRTL;
    }
}
/**
 * Gets the current RTL value.
 */
function getRTL() {
    if (_rtl === undefined) {
        _rtl =
            typeof document !== 'undefined' &&
                !!document.documentElement &&
                document.documentElement.getAttribute('dir') === 'rtl';
    }
    return _rtl;
}
/**
 * RTLifies the rulePair in the array at the current index. This mutates the array for performance
 * reasons.
 */
function rtlifyRules(rulePairs, index) {
    if (getRTL()) {
        var name_1 = rulePairs[index];
        if (!name_1) {
            return;
        }
        var value = rulePairs[index + 1];
        if (typeof value === 'string' && value.indexOf(NO_FLIP) >= 0) {
            rulePairs[index + 1] = value.replace(/\s*(?:\/\*\s*)?\@noflip\b(?:\s*\*\/)?\s*?/g, '');
        }
        else if (name_1.indexOf(LEFT) >= 0) {
            rulePairs[index] = name_1.replace(LEFT, RIGHT);
        }
        else if (name_1.indexOf(RIGHT) >= 0) {
            rulePairs[index] = name_1.replace(RIGHT, LEFT);
        }
        else if (String(value).indexOf(LEFT) >= 0) {
            rulePairs[index + 1] = value.replace(LEFT, RIGHT);
        }
        else if (String(value).indexOf(RIGHT) >= 0) {
            rulePairs[index + 1] = value.replace(RIGHT, LEFT);
        }
        else if (NAME_REPLACEMENTS[name_1]) {
            rulePairs[index] = NAME_REPLACEMENTS[name_1];
        }
        else if (VALUE_REPLACEMENTS[value]) {
            rulePairs[index + 1] = VALUE_REPLACEMENTS[value];
        }
        else {
            switch (name_1) {
                case 'margin':
                case 'padding':
                    rulePairs[index + 1] = flipQuad(value);
                    break;
                case 'box-shadow':
                    rulePairs[index + 1] = negateNum(value, 0);
                    break;
            }
        }
    }
}
/**
 * Given a string value in a space delimited format (e.g. "1 2 3 4"), negates a particular value.
 */
function negateNum(value, partIndex) {
    var parts = value.split(' ');
    var numberVal = parseInt(parts[partIndex], 10);
    parts[0] = parts[0].replace(String(numberVal), String(numberVal * -1));
    return parts.join(' ');
}
/**
 * Given a string quad, flips the left and right values.
 */
function flipQuad(value) {
    if (typeof value === 'string') {
        var parts = value.split(' ');
        if (parts.length === 4) {
            return parts[0] + " " + parts[3] + " " + parts[2] + " " + parts[1];
        }
    }
    return value;
}
var _a;


/***/ }),

/***/ "../../packages/office-ui-fabric-react/lib/Icons.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _uifabric_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/icons/lib/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initializeIcons", function() { return _uifabric_icons__WEBPACK_IMPORTED_MODULE_0__["initializeIcons"]; });




/***/ }),

/***/ "../../packages/styling/lib/MergeStyles.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InjectionMode", function() { return _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["InjectionMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Stylesheet", function() { return _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "concatStyleSets", function() { return _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["concatStyleSets"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fontFace", function() { return _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["fontFace"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "keyframes", function() { return _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeStyleSets", function() { return _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["mergeStyleSets"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeStyles", function() { return _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["mergeStyles"]; });




/***/ }),

/***/ "../../packages/styling/lib/classNames/AnimationClassNames.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationClassNames", function() { return AnimationClassNames; });
/* harmony import */ var _utilities_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/utilities/index.js");
/* harmony import */ var _styles_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/styles/index.js");


var AnimationClassNames = Object(_utilities_index__WEBPACK_IMPORTED_MODULE_0__["buildClassMap"])(_styles_index__WEBPACK_IMPORTED_MODULE_1__["AnimationStyles"]);


/***/ }),

/***/ "../../packages/styling/lib/classNames/ColorClassNames.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColorClassNames", function() { return ColorClassNames; });
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");
/* harmony import */ var _styles_DefaultPalette__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/styles/DefaultPalette.js");
/* harmony import */ var _styles_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/styling/lib/styles/index.js");



var ColorClassNames = {};
for (var colorName in _styles_DefaultPalette__WEBPACK_IMPORTED_MODULE_1__["DefaultPalette"]) {
    if (_styles_DefaultPalette__WEBPACK_IMPORTED_MODULE_1__["DefaultPalette"].hasOwnProperty(colorName)) {
        // Foreground color
        _defineGetter(ColorClassNames, colorName, '', false, 'color');
        // Hover color
        _defineGetter(ColorClassNames, colorName, 'Hover', true, 'color');
        // Background color
        _defineGetter(ColorClassNames, colorName, 'Background', false, 'background');
        // Background hover
        _defineGetter(ColorClassNames, colorName, 'BackgroundHover', true, 'background');
        // Border color
        _defineGetter(ColorClassNames, colorName, 'Border', false, 'borderColor');
        // Border hover color
        _defineGetter(ColorClassNames, colorName, 'BorderHover', true, 'borderColor');
    }
}
/**
 * Defines a getter for the given class configuration.
 */
function _defineGetter(obj, colorName, suffix, isHover, cssProperty) {
    Object.defineProperty(obj, colorName + suffix, {
        get: function () {
            // tslint:disable-next-line:no-any
            var style = (_a = {}, _a[cssProperty] = Object(_styles_index__WEBPACK_IMPORTED_MODULE_2__["getTheme"])().palette[colorName], _a);
            return Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["mergeStyles"])(isHover ? { selectors: { ':hover': style } } : style).toString();
            var _a;
        },
        enumerable: true,
        configurable: true
    });
}


/***/ }),

/***/ "../../packages/styling/lib/classNames/FontClassNames.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontClassNames", function() { return FontClassNames; });
/* harmony import */ var _utilities_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/utilities/index.js");
/* harmony import */ var _styles_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/styles/index.js");


var FontClassNames = Object(_utilities_index__WEBPACK_IMPORTED_MODULE_0__["buildClassMap"])(_styles_index__WEBPACK_IMPORTED_MODULE_1__["DefaultFontStyles"]);


/***/ }),

/***/ "../../packages/styling/lib/classNames/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AnimationClassNames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/classNames/AnimationClassNames.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AnimationClassNames", function() { return _AnimationClassNames__WEBPACK_IMPORTED_MODULE_0__["AnimationClassNames"]; });

/* harmony import */ var _FontClassNames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/classNames/FontClassNames.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FontClassNames", function() { return _FontClassNames__WEBPACK_IMPORTED_MODULE_1__["FontClassNames"]; });

/* harmony import */ var _ColorClassNames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/styling/lib/classNames/ColorClassNames.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ColorClassNames", function() { return _ColorClassNames__WEBPACK_IMPORTED_MODULE_2__["ColorClassNames"]; });






/***/ }),

/***/ "../../packages/styling/lib/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _classNames_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/classNames/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AnimationClassNames", function() { return _classNames_index__WEBPACK_IMPORTED_MODULE_0__["AnimationClassNames"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FontClassNames", function() { return _classNames_index__WEBPACK_IMPORTED_MODULE_0__["FontClassNames"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ColorClassNames", function() { return _classNames_index__WEBPACK_IMPORTED_MODULE_0__["ColorClassNames"]; });

/* harmony import */ var _styles_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/styles/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AnimationStyles", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["AnimationStyles"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AnimationVariables", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["AnimationVariables"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DefaultPalette", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["DefaultPalette"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DefaultFontStyles", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["DefaultFontStyles"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerDefaultFontFaces", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["registerDefaultFontFaces"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FontSizes", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["FontSizes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FontWeights", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["FontWeights"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IconFontSizes", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["IconFontSizes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createFontStyles", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["createFontStyles"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFocusStyle", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["getFocusStyle"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "focusClear", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["focusClear"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hiddenContentStyle", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["hiddenContentStyle"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PulsingBeaconAnimationStyles", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["PulsingBeaconAnimationStyles"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getGlobalClassNames", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["getGlobalClassNames"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ThemeSettingName", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ThemeSettingName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getTheme", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["getTheme"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loadTheme", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["loadTheme"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createTheme", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["createTheme"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerOnThemeChangeCallback", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["registerOnThemeChangeCallback"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "removeOnThemeChangeCallback", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["removeOnThemeChangeCallback"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelector", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["HighContrastSelector"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelectorWhite", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["HighContrastSelectorWhite"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelectorBlack", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["HighContrastSelectorBlack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinSmall", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMinSmall"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinMedium", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMinMedium"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinLarge", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMinLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXLarge", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMinXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXXLarge", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMinXXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXXXLarge", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMinXXXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxSmall", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMaxSmall"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxMedium", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMaxMedium"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxLarge", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMaxLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxXLarge", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMaxXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxXXLarge", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ScreenWidthMaxXXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getScreenSelector", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["getScreenSelector"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalize", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["normalize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "noWrap", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["noWrap"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ZIndexes", function() { return _styles_index__WEBPACK_IMPORTED_MODULE_1__["ZIndexes"]; });

/* harmony import */ var _utilities_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/styling/lib/utilities/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "buildClassMap", function() { return _utilities_index__WEBPACK_IMPORTED_MODULE_2__["buildClassMap"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getIcon", function() { return _utilities_index__WEBPACK_IMPORTED_MODULE_2__["getIcon"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerIcons", function() { return _utilities_index__WEBPACK_IMPORTED_MODULE_2__["registerIcons"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerIconAlias", function() { return _utilities_index__WEBPACK_IMPORTED_MODULE_2__["registerIconAlias"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "unregisterIcons", function() { return _utilities_index__WEBPACK_IMPORTED_MODULE_2__["unregisterIcons"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setIconOptions", function() { return _utilities_index__WEBPACK_IMPORTED_MODULE_2__["setIconOptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getIconClassName", function() { return _utilities_index__WEBPACK_IMPORTED_MODULE_2__["getIconClassName"]; });

/* harmony import */ var _MergeStyles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/styling/lib/MergeStyles.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InjectionMode", function() { return _MergeStyles__WEBPACK_IMPORTED_MODULE_3__["InjectionMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Stylesheet", function() { return _MergeStyles__WEBPACK_IMPORTED_MODULE_3__["Stylesheet"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "concatStyleSets", function() { return _MergeStyles__WEBPACK_IMPORTED_MODULE_3__["concatStyleSets"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fontFace", function() { return _MergeStyles__WEBPACK_IMPORTED_MODULE_3__["fontFace"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "keyframes", function() { return _MergeStyles__WEBPACK_IMPORTED_MODULE_3__["keyframes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeStyleSets", function() { return _MergeStyles__WEBPACK_IMPORTED_MODULE_3__["mergeStyleSets"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeStyles", function() { return _MergeStyles__WEBPACK_IMPORTED_MODULE_3__["mergeStyles"]; });







/***/ }),

/***/ "../../packages/styling/lib/styles/AnimationStyles.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationVariables", function() { return AnimationVariables; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationStyles", function() { return AnimationStyles; });
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");

/* Register the keyframes */
var EASING_FUNCTION_1 = 'cubic-bezier(.1,.9,.2,1)';
var EASING_FUNCTION_2 = 'cubic-bezier(.1,.25,.75,.9)';
var DURATION_1 = '0.167s';
var DURATION_2 = '0.267s';
var DURATION_3 = '0.367s';
var DURATION_4 = '0.467s';
var FADE_IN = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
    from: { opacity: 0 },
    to: { opacity: 1 }
});
var FADE_OUT = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
    from: { opacity: 1 },
    to: { opacity: 0 }
});
var SLIDE_RIGHT_IN10 = _createSlideInX(-10);
var SLIDE_RIGHT_IN20 = _createSlideInX(-20);
var SLIDE_RIGHT_IN40 = _createSlideInX(-40);
var SLIDE_RIGHT_IN400 = _createSlideInX(-400);
var SLIDE_LEFT_IN10 = _createSlideInX(10);
var SLIDE_LEFT_IN20 = _createSlideInX(20);
var SLIDE_LEFT_IN40 = _createSlideInX(40);
var SLIDE_LEFT_IN400 = _createSlideInX(400);
var SLIDE_UP_IN10 = _createSlideInY(10);
var SLIDE_UP_IN20 = _createSlideInY(20);
var SLIDE_DOWN_IN10 = _createSlideInY(-10);
var SLIDE_DOWN_IN20 = _createSlideInY(-20);
var SLIDE_RIGHT_OUT10 = _createSlideOutX(10);
var SLIDE_RIGHT_OUT20 = _createSlideOutX(20);
var SLIDE_RIGHT_OUT40 = _createSlideOutX(40);
var SLIDE_RIGHT_OUT400 = _createSlideOutX(400);
var SLIDE_LEFT_OUT10 = _createSlideOutX(-10);
var SLIDE_LEFT_OUT20 = _createSlideOutX(-20);
var SLIDE_LEFT_OUT40 = _createSlideOutX(-40);
var SLIDE_LEFT_OUT400 = _createSlideOutX(-400);
var SLIDE_UP_OUT10 = _createSlideOutY(-10);
var SLIDE_UP_OUT20 = _createSlideOutY(-20);
var SLIDE_DOWN_OUT10 = _createSlideOutY(10);
var SLIDE_DOWN_OUT20 = _createSlideOutY(20);
var SCALE_UP100 = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
    from: { transform: 'scale3d(.98,.98,1)' },
    to: { transform: 'scale3d(1,1,1)' }
});
var SCALE_DOWN98 = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
    from: { transform: 'scale3d(1,1,1)' },
    to: { transform: 'scale3d(.98,.98,1)' }
});
var SCALE_DOWN100 = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
    from: { transform: 'scale3d(1.03,1.03,1)' },
    to: { transform: 'scale3d(1,1,1)' }
});
var SCALE_UP103 = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
    from: { transform: 'scale3d(1,1,1)' },
    to: { transform: 'scale3d(1.03,1.03,1)' }
});
var ROTATE90 = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
    from: { transform: 'rotateZ(0deg)' },
    to: { transform: 'rotateZ(90deg)' }
});
var ROTATE_N90 = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
    from: { transform: 'rotateZ(0deg)' },
    to: { transform: 'rotateZ(-90deg)' }
});
/**
 * Exporting raw duraction values and easing functions to be used in custom animations
 */
var AnimationVariables = {
    easeFunction1: EASING_FUNCTION_1,
    easeFunction2: EASING_FUNCTION_2,
    durationValue1: DURATION_1,
    durationValue2: DURATION_2,
    durationValue3: DURATION_3,
    durationValue4: DURATION_4
};
/**
 * All Fabric standard animations, exposed as json objects referencing predefined
 * keyframes. These objects can be mixed in with other class definitions.
 */
var AnimationStyles = {
    slideRightIn10: _createAnimation(FADE_IN + "," + SLIDE_RIGHT_IN10, DURATION_3, EASING_FUNCTION_1),
    slideRightIn20: _createAnimation(FADE_IN + "," + SLIDE_RIGHT_IN20, DURATION_3, EASING_FUNCTION_1),
    slideRightIn40: _createAnimation(FADE_IN + "," + SLIDE_RIGHT_IN40, DURATION_3, EASING_FUNCTION_1),
    slideRightIn400: _createAnimation(FADE_IN + "," + SLIDE_RIGHT_IN400, DURATION_3, EASING_FUNCTION_1),
    slideLeftIn10: _createAnimation(FADE_IN + "," + SLIDE_LEFT_IN10, DURATION_3, EASING_FUNCTION_1),
    slideLeftIn20: _createAnimation(FADE_IN + "," + SLIDE_LEFT_IN20, DURATION_3, EASING_FUNCTION_1),
    slideLeftIn40: _createAnimation(FADE_IN + "," + SLIDE_LEFT_IN40, DURATION_3, EASING_FUNCTION_1),
    slideLeftIn400: _createAnimation(FADE_IN + "," + SLIDE_LEFT_IN400, DURATION_3, EASING_FUNCTION_1),
    slideUpIn10: _createAnimation(FADE_IN + "," + SLIDE_UP_IN10, DURATION_3, EASING_FUNCTION_1),
    slideUpIn20: _createAnimation(FADE_IN + "," + SLIDE_UP_IN20, DURATION_3, EASING_FUNCTION_1),
    slideDownIn10: _createAnimation(FADE_IN + "," + SLIDE_DOWN_IN10, DURATION_3, EASING_FUNCTION_1),
    slideDownIn20: _createAnimation(FADE_IN + "," + SLIDE_DOWN_IN20, DURATION_3, EASING_FUNCTION_1),
    slideRightOut10: _createAnimation(FADE_OUT + "," + SLIDE_RIGHT_OUT10, DURATION_3, EASING_FUNCTION_1),
    slideRightOut20: _createAnimation(FADE_OUT + "," + SLIDE_RIGHT_OUT20, DURATION_3, EASING_FUNCTION_1),
    slideRightOut40: _createAnimation(FADE_OUT + "," + SLIDE_RIGHT_OUT40, DURATION_3, EASING_FUNCTION_1),
    slideRightOut400: _createAnimation(FADE_OUT + "," + SLIDE_RIGHT_OUT400, DURATION_3, EASING_FUNCTION_1),
    slideLeftOut10: _createAnimation(FADE_OUT + "," + SLIDE_LEFT_OUT10, DURATION_3, EASING_FUNCTION_1),
    slideLeftOut20: _createAnimation(FADE_OUT + "," + SLIDE_LEFT_OUT20, DURATION_3, EASING_FUNCTION_1),
    slideLeftOut40: _createAnimation(FADE_OUT + "," + SLIDE_LEFT_OUT40, DURATION_3, EASING_FUNCTION_1),
    slideLeftOut400: _createAnimation(FADE_OUT + "," + SLIDE_LEFT_OUT400, DURATION_3, EASING_FUNCTION_1),
    slideUpOut10: _createAnimation(FADE_OUT + "," + SLIDE_UP_OUT10, DURATION_3, EASING_FUNCTION_1),
    slideUpOut20: _createAnimation(FADE_OUT + "," + SLIDE_UP_OUT20, DURATION_3, EASING_FUNCTION_1),
    slideDownOut10: _createAnimation(FADE_OUT + "," + SLIDE_DOWN_OUT10, DURATION_3, EASING_FUNCTION_1),
    slideDownOut20: _createAnimation(FADE_OUT + "," + SLIDE_DOWN_OUT20, DURATION_3, EASING_FUNCTION_1),
    scaleUpIn100: _createAnimation(FADE_IN + "," + SCALE_UP100, DURATION_3, EASING_FUNCTION_1),
    scaleDownIn100: _createAnimation(FADE_IN + "," + SCALE_DOWN100, DURATION_3, EASING_FUNCTION_1),
    scaleUpOut103: _createAnimation(FADE_OUT + "," + SCALE_UP103, DURATION_1, EASING_FUNCTION_2),
    scaleDownOut98: _createAnimation(FADE_OUT + "," + SCALE_DOWN98, DURATION_1, EASING_FUNCTION_2),
    fadeIn100: _createAnimation(FADE_IN, DURATION_1, EASING_FUNCTION_2),
    fadeIn200: _createAnimation(FADE_IN, DURATION_2, EASING_FUNCTION_2),
    fadeIn400: _createAnimation(FADE_IN, DURATION_3, EASING_FUNCTION_2),
    fadeIn500: _createAnimation(FADE_IN, DURATION_4, EASING_FUNCTION_2),
    fadeOut100: _createAnimation(FADE_OUT, DURATION_1, EASING_FUNCTION_2),
    fadeOut200: _createAnimation(FADE_OUT, DURATION_2, EASING_FUNCTION_2),
    fadeOut400: _createAnimation(FADE_OUT, DURATION_3, EASING_FUNCTION_2),
    fadeOut500: _createAnimation(FADE_OUT, DURATION_4, EASING_FUNCTION_2),
    rotate90deg: _createAnimation(ROTATE90, '0.1s', EASING_FUNCTION_2),
    rotateN90deg: _createAnimation(ROTATE_N90, '0.1s', EASING_FUNCTION_2)
    // expandCollapse 100/200/400, delay 100/200
};
function _createAnimation(animationName, animationDuration, animationTimingFunction) {
    return {
        animationName: animationName,
        animationDuration: animationDuration,
        animationTimingFunction: animationTimingFunction,
        animationFillMode: 'both'
    };
}
function _createSlideInX(fromX) {
    return Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
        from: { transform: "translate3d(" + fromX + "px,0,0)" },
        to: { transform: "translate3d(0,0,0)" }
    });
}
function _createSlideInY(fromY) {
    return Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
        from: { transform: "translate3d(0," + fromY + "px,0)" },
        to: { transform: "translate3d(0,0,0)" }
    });
}
function _createSlideOutX(toX) {
    return Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
        from: { transform: "translate3d(0,0,0)" },
        to: { transform: "translate3d(" + toX + "px,0,0)" }
    });
}
function _createSlideOutY(toY) {
    return Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["keyframes"])({
        from: { transform: "translate3d(0,0,0)" },
        to: { transform: "translate3d(0," + toY + "px,0)" }
    });
}


/***/ }),

/***/ "../../packages/styling/lib/styles/CommonStyles.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelector", function() { return HighContrastSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelectorWhite", function() { return HighContrastSelectorWhite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelectorBlack", function() { return HighContrastSelectorBlack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinSmall", function() { return ScreenWidthMinSmall; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinMedium", function() { return ScreenWidthMinMedium; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinLarge", function() { return ScreenWidthMinLarge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXLarge", function() { return ScreenWidthMinXLarge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXXLarge", function() { return ScreenWidthMinXXLarge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXXXLarge", function() { return ScreenWidthMinXXXLarge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxSmall", function() { return ScreenWidthMaxSmall; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxMedium", function() { return ScreenWidthMaxMedium; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxLarge", function() { return ScreenWidthMaxLarge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxXLarge", function() { return ScreenWidthMaxXLarge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxXXLarge", function() { return ScreenWidthMaxXXLarge; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getScreenSelector", function() { return getScreenSelector; });
var HighContrastSelector = '@media screen and (-ms-high-contrast: active)';
var HighContrastSelectorWhite = '@media screen and (-ms-high-contrast: black-on-white)';
var HighContrastSelectorBlack = '@media screen and (-ms-high-contrast: white-on-black)';
var ScreenWidthMinSmall = 320;
var ScreenWidthMinMedium = 480;
var ScreenWidthMinLarge = 640;
var ScreenWidthMinXLarge = 1024;
var ScreenWidthMinXXLarge = 1366;
var ScreenWidthMinXXXLarge = 1920;
var ScreenWidthMaxSmall = ScreenWidthMinMedium - 1;
var ScreenWidthMaxMedium = ScreenWidthMinLarge - 1;
var ScreenWidthMaxLarge = ScreenWidthMinXLarge - 1;
var ScreenWidthMaxXLarge = ScreenWidthMinXXLarge - 1;
var ScreenWidthMaxXXLarge = ScreenWidthMinXXXLarge - 1;
function getScreenSelector(min, max) {
    return "@media only screen and (min-width: " + min + "px) and (max-width: " + max + "px)";
}


/***/ }),

/***/ "../../packages/styling/lib/styles/DefaultFontStyles.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultFontStyles", function() { return DefaultFontStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerDefaultFontFaces", function() { return registerDefaultFontFaces; });
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");
/* harmony import */ var _fonts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/styles/fonts.js");
/* harmony import */ var _uifabric_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/utilities/lib/index.js");



// Default urls.
var DefaultBaseUrl = 'https://static2.sharepointonline.com/files/fabric/assets';
// Standard font styling.
var DefaultFontStyles = Object(_fonts__WEBPACK_IMPORTED_MODULE_1__["createFontStyles"])(Object(_uifabric_utilities__WEBPACK_IMPORTED_MODULE_2__["getLanguage"])());
function _registerFontFace(fontFamily, url, fontWeight, localFontName) {
    fontFamily = "'" + fontFamily + "'";
    var localFontSrc = localFontName !== undefined ? "local('" + localFontName + "')," : '';
    Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["fontFace"])({
        fontFamily: fontFamily,
        src: localFontSrc + ("url('" + url + ".woff2') format('woff2'),") + ("url('" + url + ".woff') format('woff')"),
        fontWeight: fontWeight,
        fontStyle: 'normal'
    });
}
function _registerFontFaceSet(baseUrl, fontFamily, cdnFolder, cdnFontName, localFontName) {
    if (cdnFontName === void 0) { cdnFontName = 'segoeui'; }
    var urlBase = baseUrl + "/" + cdnFolder + "/" + cdnFontName;
    _registerFontFace(fontFamily, urlBase + '-light', _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].light, localFontName && localFontName + ' Light');
    _registerFontFace(fontFamily, urlBase + '-semilight', _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].semilight, localFontName && localFontName + ' SemiLight');
    _registerFontFace(fontFamily, urlBase + '-regular', _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].regular, localFontName);
    _registerFontFace(fontFamily, urlBase + '-semibold', _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].semibold, localFontName && localFontName + ' SemiBold');
}
function registerDefaultFontFaces(baseUrl) {
    if (baseUrl) {
        var fontUrl = baseUrl + "/fonts";
        // Produce @font-face definitions for all supported web fonts.
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontNames"].Thai, 'leelawadeeui-thai', 'leelawadeeui');
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontNames"].Arabic, 'segoeui-arabic');
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontNames"].Cyrillic, 'segoeui-cyrillic');
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontNames"].EastEuropean, 'segoeui-easteuropean');
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontNames"].Greek, 'segoeui-greek');
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontNames"].Hebrew, 'segoeui-hebrew');
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontNames"].Vietnamese, 'segoeui-vietnamese');
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontNames"].WestEuropean, 'segoeui-westeuropean', 'segoeui', 'Segoe UI');
        _registerFontFaceSet(fontUrl, _fonts__WEBPACK_IMPORTED_MODULE_1__["LocalizedFontFamilies"].Selawik, 'selawik', 'selawik');
        // Leelawadee UI (Thai) does not have a 'light' weight, so we override
        // the font-face generated above to use the 'semilight' weight instead.
        _registerFontFace('Leelawadee UI Web', fontUrl + "/leelawadeeui-thai/leelawadeeui-semilight", _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].light);
        // Leelawadee UI (Thai) does not have a 'semibold' weight, so we override
        // the font-face generated above to use the 'bold' weight instead.
        _registerFontFace('Leelawadee UI Web', fontUrl + "/leelawadeeui-thai/leelawadeeui-bold", _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].semibold);
    }
}
/**
 * Reads the fontBaseUrl from window.FabricConfig.fontBaseUrl or falls back to a default.
 */
function _getFontBaseUrl() {
    var win = typeof window !== 'undefined' ? window : undefined;
    // tslint:disable-next-line:no-string-literal no-any
    var fabricConfig = win ? win['FabricConfig'] : undefined;
    return fabricConfig && fabricConfig.fontBaseUrl !== undefined ? fabricConfig.fontBaseUrl : DefaultBaseUrl;
}
/**
 * Register the font faces.
 */
registerDefaultFontFaces(_getFontBaseUrl());


/***/ }),

/***/ "../../packages/styling/lib/styles/DefaultPalette.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultPalette", function() { return DefaultPalette; });
// When adding or removing a color, make sure you keep this consistent with IColorClassNames by adding the color variants.
var DefaultPalette = {
    themeDarker: '#004578',
    themeDark: '#005a9e',
    themeDarkAlt: '#106ebe',
    themePrimary: '#0078d4',
    themeSecondary: '#2b88d8',
    themeTertiary: '#71afe5',
    themeLight: '#c7e0f4',
    themeLighter: '#deecf9',
    themeLighterAlt: '#eff6fc',
    black: '#000000',
    blackTranslucent40: 'rgba(0,0,0,.4)',
    neutralDark: '#212121',
    neutralPrimary: '#333333',
    neutralPrimaryAlt: '#3c3c3c',
    neutralSecondary: '#666666',
    neutralSecondaryAlt: '#767676',
    neutralTertiary: '#a6a6a6',
    neutralTertiaryAlt: '#c8c8c8',
    neutralQuaternary: '#d0d0d0',
    neutralQuaternaryAlt: '#dadada',
    neutralLight: '#eaeaea',
    neutralLighter: '#f4f4f4',
    neutralLighterAlt: '#f8f8f8',
    accent: '#0078d4',
    white: '#ffffff',
    whiteTranslucent40: 'rgba(255,255,255,.4)',
    yellow: '#ffb900',
    yellowLight: '#fff100',
    orange: '#d83b01',
    orangeLight: '#ea4300',
    orangeLighter: '#ff8c00',
    redDark: '#a80000',
    red: '#e81123',
    magentaDark: '#5c005c',
    magenta: '#b4009e',
    magentaLight: '#e3008c',
    purpleDark: '#32145a',
    purple: '#5c2d91',
    purpleLight: '#b4a0ff',
    blueDark: '#002050',
    blueMid: '#00188f',
    blue: '#0078d4',
    blueLight: '#00bcf2',
    tealDark: '#004b50',
    teal: '#008272',
    tealLight: '#00b294',
    greenDark: '#004b1c',
    green: '#107c10',
    greenLight: '#bad80a'
};


/***/ }),

/***/ "../../packages/styling/lib/styles/DefaultTypography.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultFontSizes", function() { return DefaultFontSizes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultFontFamilies", function() { return DefaultFontFamilies; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultFontWeights", function() { return DefaultFontWeights; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultFontVariants", function() { return DefaultFontVariants; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultTypography", function() { return DefaultTypography; });
/* harmony import */ var _DefaultFontStyles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/styles/DefaultFontStyles.js");
/* harmony import */ var _fonts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/styles/fonts.js");


var DefaultFontSizes = {
    mini: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].mini,
    xSmall: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].xSmall,
    small: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].small,
    smallPlus: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].smallPlus,
    medium: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].medium,
    mediumPlus: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].mediumPlus,
    large: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].large,
    xLarge: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].xLarge,
    xxLarge: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].xxLarge,
    mega: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontSizes"].mega
};
var DefaultFontFamilies = {
    default: _DefaultFontStyles__WEBPACK_IMPORTED_MODULE_0__["DefaultFontStyles"].medium.fontFamily,
    monospace: 'Menlo, Monaco, "Courier New", monospace'
};
var DefaultFontWeights = {
    default: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].regular,
    regular: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].regular,
    light: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].light,
    semibold: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].semibold,
    bold: _fonts__WEBPACK_IMPORTED_MODULE_1__["FontWeights"].bold
};
var DefaultFontVariants = {
    default: {
        fontFamily: 'default',
        fontSize: 'medium',
        fontWeight: 'default'
    },
    caption: {
        fontSize: 'xSmall'
    },
    h1: {
        fontSize: 'mega',
        fontWeight: 'light'
    },
    h2: {
        fontSize: 'xxLarge',
        fontWeight: 'light'
    },
    h3: {
        fontSize: 'xLarge',
        fontWeight: 'light'
    },
    h4: {
        fontSize: 'large',
        fontWeight: 'light'
    },
    h5: {
        fontSize: 'mediumPlus',
        fontWeight: 'light'
    }
};
var DefaultTypography = {
    families: DefaultFontFamilies,
    sizes: DefaultFontSizes,
    weights: DefaultFontWeights,
    variants: DefaultFontVariants
};


/***/ }),

/***/ "../../packages/styling/lib/styles/GeneralStyles.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalize", function() { return normalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noWrap", function() { return noWrap; });
// This file mimics styles and mixins from _General.Mixins.scss
var normalize = {
    boxShadow: 'none',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
};
var noWrap = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
};


/***/ }),

/***/ "../../packages/styling/lib/styles/PulsingBeaconAnimationStyles.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PulsingBeaconAnimationStyles", function() { return PulsingBeaconAnimationStyles; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/merge-styles/lib/index.js");


var DEFAULT_DURATION = '14s';
var DEFAULT_DELAY = '2s';
var DEFAULT_ITERATION_COUNT = '1';
function _continuousPulseStepOne(beaconColorOne, innerDimension) {
    return {
        borderColor: beaconColorOne,
        borderWidth: '0px',
        width: innerDimension,
        height: innerDimension
    };
}
function _continuousPulseStepTwo(borderWidth) {
    return {
        opacity: 1,
        borderWidth: borderWidth
    };
}
function _continuousPulseStepThree() {
    return {
        opacity: 1
    };
}
function _continuousPulseStepFour(beaconColorTwo, outerDimension) {
    return {
        borderWidth: '0',
        width: outerDimension,
        height: outerDimension,
        opacity: 0,
        borderColor: beaconColorTwo
    };
}
function _continuousPulseStepFive(beaconColorOne, innerDimension) {
    return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _continuousPulseStepOne(beaconColorOne, innerDimension), {
        opacity: 0
    });
}
function _continuousPulseAnimationDouble(beaconColorOne, beaconColorTwo, innerDimension, outerDimension, borderWidth) {
    return Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_1__["keyframes"])({
        '0%': _continuousPulseStepOne(beaconColorOne, innerDimension),
        '1.42%': _continuousPulseStepTwo(borderWidth),
        '3.57%': _continuousPulseStepThree(),
        '7.14%': _continuousPulseStepFour(beaconColorTwo, outerDimension),
        '8%': _continuousPulseStepFive(beaconColorOne, innerDimension),
        '29.99%': _continuousPulseStepFive(beaconColorOne, innerDimension),
        '30%': _continuousPulseStepOne(beaconColorOne, innerDimension),
        '31.42%': _continuousPulseStepTwo(borderWidth),
        '33.57%': _continuousPulseStepThree(),
        '37.14%': _continuousPulseStepFour(beaconColorTwo, outerDimension),
        '38%': _continuousPulseStepFive(beaconColorOne, innerDimension),
        '79.42%': _continuousPulseStepFive(beaconColorOne, innerDimension),
        '79.43': _continuousPulseStepOne(beaconColorOne, innerDimension),
        '81.85': _continuousPulseStepTwo(borderWidth),
        '83.42': _continuousPulseStepThree(),
        '87%': _continuousPulseStepFour(beaconColorTwo, outerDimension),
        '100%': {}
    });
}
function _continuousPulseAnimationSingle(beaconColorOne, beaconColorTwo, innerDimension, outerDimension, borderWidth) {
    return Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_1__["keyframes"])({
        '0%': _continuousPulseStepOne(beaconColorOne, innerDimension),
        '14.2%': _continuousPulseStepTwo(borderWidth),
        '35.7%': _continuousPulseStepThree(),
        '71.4%': _continuousPulseStepFour(beaconColorTwo, outerDimension),
        '100%': {}
    });
}
function _createDefaultAnimation(animationName) {
    return {
        animationName: animationName,
        animationIterationCount: DEFAULT_ITERATION_COUNT,
        animationDuration: DEFAULT_DURATION,
        animationDelay: DEFAULT_DELAY
    };
}
var PulsingBeaconAnimationStyles = {
    continuousPulseAnimationDouble: _continuousPulseAnimationDouble,
    continuousPulseAnimationSingle: _continuousPulseAnimationSingle,
    createDefaultAnimation: _createDefaultAnimation
};


/***/ }),

/***/ "../../packages/styling/lib/styles/fonts.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalizedFontNames", function() { return LocalizedFontNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalizedFontFamilies", function() { return LocalizedFontFamilies; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontSizes", function() { return FontSizes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontWeights", function() { return FontWeights; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IconFontSizes", function() { return IconFontSizes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFontStyles", function() { return createFontStyles; });
// Fallback fonts, if specified system or web fonts are unavailable.
var FontFamilyFallbacks = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif";
// Font face names to be registered.
var LocalizedFontNames;
(function (LocalizedFontNames) {
    LocalizedFontNames.Arabic = 'Segoe UI Web (Arabic)';
    LocalizedFontNames.Cyrillic = 'Segoe UI Web (Cyrillic)';
    LocalizedFontNames.EastEuropean = 'Segoe UI Web (East European)';
    LocalizedFontNames.Greek = 'Segoe UI Web (Greek)';
    LocalizedFontNames.Hebrew = 'Segoe UI Web (Hebrew)';
    LocalizedFontNames.Thai = 'Leelawadee UI Web';
    LocalizedFontNames.Vietnamese = 'Segoe UI Web (Vietnamese)';
    LocalizedFontNames.WestEuropean = 'Segoe UI Web (West European)';
    LocalizedFontNames.Selawik = 'Selawik Web';
})(LocalizedFontNames || (LocalizedFontNames = {}));
// Font families with fallbacks, for the general regions.
var LocalizedFontFamilies;
(function (LocalizedFontFamilies) {
    LocalizedFontFamilies.Arabic = "'" + LocalizedFontNames.Arabic + "'";
    LocalizedFontFamilies.ChineseSimplified = "'Microsoft Yahei UI', Verdana, Simsun";
    LocalizedFontFamilies.ChineseTraditional = "'Microsoft Jhenghei UI', Pmingliu";
    LocalizedFontFamilies.Cyrillic = "'" + LocalizedFontNames.Cyrillic + "'";
    LocalizedFontFamilies.EastEuropean = "'" + LocalizedFontNames.EastEuropean + "'";
    LocalizedFontFamilies.Greek = "'" + LocalizedFontNames.Greek + "'";
    LocalizedFontFamilies.Hebrew = "'" + LocalizedFontNames.Hebrew + "'";
    LocalizedFontFamilies.Hindi = "'Nirmala UI'";
    LocalizedFontFamilies.Japanese = "'Yu Gothic UI', 'Meiryo UI', Meiryo, 'MS Pgothic', Osaka";
    LocalizedFontFamilies.Korean = "'Malgun Gothic', Gulim";
    LocalizedFontFamilies.Selawik = "'" + LocalizedFontNames.Selawik + "'";
    LocalizedFontFamilies.Thai = "'Leelawadee UI Web', 'Kmer UI'";
    LocalizedFontFamilies.Vietnamese = "'" + LocalizedFontNames.Vietnamese + "'";
    LocalizedFontFamilies.WestEuropean = "'" + LocalizedFontNames.WestEuropean + "'";
})(LocalizedFontFamilies || (LocalizedFontFamilies = {}));
// By default, we favor system fonts for the default.
// All localized fonts use a web font and never use the system font.
var defaultFontFamily = "'Segoe UI', '" + LocalizedFontNames.WestEuropean + "'";
// Mapping of language prefix to to font family.
var LanguageToFontMap = {
    ar: LocalizedFontFamilies.Arabic,
    bg: LocalizedFontFamilies.Cyrillic,
    cs: LocalizedFontFamilies.EastEuropean,
    el: LocalizedFontFamilies.Greek,
    et: LocalizedFontFamilies.EastEuropean,
    he: LocalizedFontFamilies.Hebrew,
    hi: LocalizedFontFamilies.Hindi,
    hr: LocalizedFontFamilies.EastEuropean,
    hu: LocalizedFontFamilies.EastEuropean,
    ja: LocalizedFontFamilies.Japanese,
    kk: LocalizedFontFamilies.EastEuropean,
    ko: LocalizedFontFamilies.Korean,
    lt: LocalizedFontFamilies.EastEuropean,
    lv: LocalizedFontFamilies.EastEuropean,
    pl: LocalizedFontFamilies.EastEuropean,
    ru: LocalizedFontFamilies.Cyrillic,
    sk: LocalizedFontFamilies.EastEuropean,
    'sr-latn': LocalizedFontFamilies.EastEuropean,
    th: LocalizedFontFamilies.Thai,
    tr: LocalizedFontFamilies.EastEuropean,
    uk: LocalizedFontFamilies.Cyrillic,
    vi: LocalizedFontFamilies.Vietnamese,
    'zh-hans': LocalizedFontFamilies.ChineseSimplified,
    'zh-hant': LocalizedFontFamilies.ChineseTraditional
};
// Standard font sizes.
var FontSizes;
(function (FontSizes) {
    FontSizes.mini = '10px';
    FontSizes.xSmall = '11px';
    FontSizes.small = '12px';
    FontSizes.smallPlus = '13px';
    FontSizes.medium = '14px';
    FontSizes.mediumPlus = '15px';
    FontSizes.icon = '16px';
    FontSizes.large = '17px';
    FontSizes.xLarge = '21px';
    FontSizes.xxLarge = '28px';
    FontSizes.superLarge = '42px';
    FontSizes.mega = '72px';
})(FontSizes || (FontSizes = {}));
// Standard font weights.
var FontWeights;
(function (FontWeights) {
    FontWeights.light = 100;
    FontWeights.semilight = 300;
    FontWeights.regular = 400;
    FontWeights.semibold = 600;
    FontWeights.bold = 700;
})(FontWeights || (FontWeights = {}));
// Standard Icon Sizes.
var IconFontSizes;
(function (IconFontSizes) {
    IconFontSizes.xSmall = '10px';
    IconFontSizes.small = '12px';
    IconFontSizes.medium = '16px';
    IconFontSizes.large = '20px';
})(IconFontSizes || (IconFontSizes = {}));
function _fontFamilyWithFallbacks(fontFamily) {
    return fontFamily + ", " + FontFamilyFallbacks;
}
function createFontStyles(localeCode) {
    var localizedFont = _getLocalizedFontFamily(localeCode);
    var fontFamilyWithFallback = _fontFamilyWithFallbacks(localizedFont);
    var semilightFontFamilyWithFallback = fontFamilyWithFallback;
    // Chrome has a bug where it does not render Segoe UI Semilight correctly, so we force the webfont to be used in that case
    if (localizedFont === defaultFontFamily) {
        semilightFontFamilyWithFallback = _fontFamilyWithFallbacks(LocalizedFontFamilies.WestEuropean);
    }
    var fontStyles = {
        tiny: _createFont(FontSizes.mini, FontWeights.semibold, fontFamilyWithFallback),
        xSmall: _createFont(FontSizes.xSmall, FontWeights.regular, fontFamilyWithFallback),
        small: _createFont(FontSizes.small, FontWeights.regular, fontFamilyWithFallback),
        smallPlus: _createFont(FontSizes.smallPlus, FontWeights.regular, fontFamilyWithFallback),
        medium: _createFont(FontSizes.medium, FontWeights.regular, fontFamilyWithFallback),
        mediumPlus: _createFont(FontSizes.mediumPlus, FontWeights.regular, fontFamilyWithFallback),
        large: _createFont(FontSizes.large, FontWeights.semilight, semilightFontFamilyWithFallback),
        xLarge: _createFont(FontSizes.xLarge, FontWeights.light, fontFamilyWithFallback),
        xxLarge: _createFont(FontSizes.xxLarge, FontWeights.light, fontFamilyWithFallback),
        superLarge: _createFont(FontSizes.superLarge, FontWeights.light, fontFamilyWithFallback),
        mega: _createFont(FontSizes.mega, FontWeights.light, fontFamilyWithFallback)
    };
    return fontStyles;
}
/**
 * If there is a localized font for this language, return that. Returns undefined if there is no localized font for that language.
 */
function _getLocalizedFontFamily(language) {
    for (var lang in LanguageToFontMap) {
        if (LanguageToFontMap.hasOwnProperty(lang) && language && lang.indexOf(language) === 0) {
            // tslint:disable-next-line:no-any
            return LanguageToFontMap[lang];
        }
    }
    return defaultFontFamily;
}
function _createFont(size, weight, fontFamily) {
    return {
        fontFamily: fontFamily,
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        fontSize: size,
        fontWeight: weight
    };
}


/***/ }),

/***/ "../../packages/styling/lib/styles/getFocusStyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFocusStyle", function() { return getFocusStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focusClear", function() { return focusClear; });
/* harmony import */ var _CommonStyles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/styles/CommonStyles.js");
/* harmony import */ var _uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/index.js");
/* harmony import */ var _zIndexes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/styling/lib/styles/zIndexes.js");



/**
 * Generates a focus style which can be used to define an :after focus border.
 *
 * @param theme - The theme object to use.
 * @param inset - The number of pixels to inset the border.
 * @param position - The positioning applied to the container. Must
 * be 'relative' or 'absolute' so that the focus border can live around it.
 * @param highContrastStyle - Style for high contrast mode.
 * @param borderColor - Color of the border.
 * @param outlineColor - Color of the outline.
 * @param isFocusedOnly - If the styles should apply on focus or not.
 * @returns The style object.
 */
function getFocusStyle(theme, inset, position, highContrastStyle, borderColor, outlineColor, isFocusedOnly) {
    if (inset === void 0) { inset = 0; }
    if (position === void 0) { position = 'relative'; }
    if (highContrastStyle === void 0) { highContrastStyle = undefined; }
    if (borderColor === void 0) { borderColor = theme.palette.white; }
    if (outlineColor === void 0) { outlineColor = theme.palette.neutralSecondary; }
    if (isFocusedOnly === void 0) { isFocusedOnly = true; }
    return {
        outline: 'transparent',
        position: position,
        selectors: (_a = {
                '::-moz-focus-inner': {
                    border: '0'
                }
            },
            _a["." + _uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["IsFocusVisibleClassName"] + " &" + (isFocusedOnly ? ':focus' : '') + ":after"] = {
                content: '""',
                position: 'absolute',
                left: inset + 1,
                top: inset + 1,
                bottom: inset + 1,
                right: inset + 1,
                border: '1px solid ' + borderColor,
                outline: '1px solid ' + outlineColor,
                zIndex: _zIndexes__WEBPACK_IMPORTED_MODULE_2__["ZIndexes"].FocusStyle,
                selectors: (_b = {},
                    _b[_CommonStyles__WEBPACK_IMPORTED_MODULE_0__["HighContrastSelector"]] = highContrastStyle,
                    _b)
            },
            _a)
    };
    var _a, _b;
}
/**
 * Generates style to clear browser specific focus styles.
 */
function focusClear() {
    return {
        selectors: {
            '&::-moz-focus-inner': {
                // Clear the focus border in Firefox. Reference: http://stackoverflow.com/a/199319/1436671
                border: 0
            },
            '&': {
                // Clear browser specific focus styles and use transparent as placeholder for focus style
                outline: 'transparent'
            }
        }
    };
}


/***/ }),

/***/ "../../packages/styling/lib/styles/getGlobalClassNames.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGlobalClassNames", function() { return getGlobalClassNames; });
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");
/* harmony import */ var _uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/index.js");


/**
 * Checks for the `disableGlobalClassNames` property on the `theme` to determine if it should return `classNames`
 * Note that calls to this function are memoized.
 *
 * @param classNames The collection of global class names that apply when the flag is false. Make sure to pass in
 * the same instance on each call to benefit from memoization.
 * @param theme The theme to check the flag on
 * @param disableGlobalClassNames Optional. Explicitly opt in/out of disabling global classnames. Defaults to false.
 */
var getGlobalClassNames = Object(_uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["memoizeFunction"])(function (classNames, theme, disableGlobalClassNames) {
    var styleSheet = _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance();
    if (disableGlobalClassNames || (disableGlobalClassNames === undefined && theme.disableGlobalClassNames)) {
        // disable global classnames
        return Object.keys(classNames).reduce(function (acc, className) {
            acc[className] = styleSheet.getClassName(classNames[className]);
            return acc;
        }, {});
    }
    // use global classnames
    return classNames;
});


/***/ }),

/***/ "../../packages/styling/lib/styles/hiddenContentStyle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hiddenContentStyle", function() { return hiddenContentStyle; });
var hiddenContentStyle = {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    border: 0,
    overflow: 'hidden'
};


/***/ }),

/***/ "../../packages/styling/lib/styles/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AnimationStyles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/styles/AnimationStyles.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AnimationStyles", function() { return _AnimationStyles__WEBPACK_IMPORTED_MODULE_0__["AnimationStyles"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AnimationVariables", function() { return _AnimationStyles__WEBPACK_IMPORTED_MODULE_0__["AnimationVariables"]; });

/* harmony import */ var _DefaultPalette__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/styles/DefaultPalette.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DefaultPalette", function() { return _DefaultPalette__WEBPACK_IMPORTED_MODULE_1__["DefaultPalette"]; });

/* harmony import */ var _DefaultFontStyles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/styling/lib/styles/DefaultFontStyles.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DefaultFontStyles", function() { return _DefaultFontStyles__WEBPACK_IMPORTED_MODULE_2__["DefaultFontStyles"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerDefaultFontFaces", function() { return _DefaultFontStyles__WEBPACK_IMPORTED_MODULE_2__["registerDefaultFontFaces"]; });

/* harmony import */ var _fonts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/styling/lib/styles/fonts.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FontSizes", function() { return _fonts__WEBPACK_IMPORTED_MODULE_3__["FontSizes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FontWeights", function() { return _fonts__WEBPACK_IMPORTED_MODULE_3__["FontWeights"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IconFontSizes", function() { return _fonts__WEBPACK_IMPORTED_MODULE_3__["IconFontSizes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createFontStyles", function() { return _fonts__WEBPACK_IMPORTED_MODULE_3__["createFontStyles"]; });

/* harmony import */ var _getFocusStyle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/styling/lib/styles/getFocusStyle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFocusStyle", function() { return _getFocusStyle__WEBPACK_IMPORTED_MODULE_4__["getFocusStyle"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "focusClear", function() { return _getFocusStyle__WEBPACK_IMPORTED_MODULE_4__["focusClear"]; });

/* harmony import */ var _hiddenContentStyle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../packages/styling/lib/styles/hiddenContentStyle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hiddenContentStyle", function() { return _hiddenContentStyle__WEBPACK_IMPORTED_MODULE_5__["hiddenContentStyle"]; });

/* harmony import */ var _PulsingBeaconAnimationStyles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../packages/styling/lib/styles/PulsingBeaconAnimationStyles.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PulsingBeaconAnimationStyles", function() { return _PulsingBeaconAnimationStyles__WEBPACK_IMPORTED_MODULE_6__["PulsingBeaconAnimationStyles"]; });

/* harmony import */ var _getGlobalClassNames__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../../packages/styling/lib/styles/getGlobalClassNames.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getGlobalClassNames", function() { return _getGlobalClassNames__WEBPACK_IMPORTED_MODULE_7__["getGlobalClassNames"]; });

/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../../packages/styling/lib/styles/theme.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ThemeSettingName", function() { return _theme__WEBPACK_IMPORTED_MODULE_8__["ThemeSettingName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getTheme", function() { return _theme__WEBPACK_IMPORTED_MODULE_8__["getTheme"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loadTheme", function() { return _theme__WEBPACK_IMPORTED_MODULE_8__["loadTheme"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createTheme", function() { return _theme__WEBPACK_IMPORTED_MODULE_8__["createTheme"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerOnThemeChangeCallback", function() { return _theme__WEBPACK_IMPORTED_MODULE_8__["registerOnThemeChangeCallback"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "removeOnThemeChangeCallback", function() { return _theme__WEBPACK_IMPORTED_MODULE_8__["removeOnThemeChangeCallback"]; });

/* harmony import */ var _CommonStyles__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../../packages/styling/lib/styles/CommonStyles.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelector", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["HighContrastSelector"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelectorWhite", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["HighContrastSelectorWhite"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HighContrastSelectorBlack", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["HighContrastSelectorBlack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinSmall", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMinSmall"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinMedium", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMinMedium"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinLarge", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMinLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXLarge", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMinXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXXLarge", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMinXXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMinXXXLarge", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMinXXXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxSmall", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMaxSmall"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxMedium", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMaxMedium"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxLarge", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMaxLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxXLarge", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMaxXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenWidthMaxXXLarge", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["ScreenWidthMaxXXLarge"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getScreenSelector", function() { return _CommonStyles__WEBPACK_IMPORTED_MODULE_9__["getScreenSelector"]; });

/* harmony import */ var _GeneralStyles__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../../packages/styling/lib/styles/GeneralStyles.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalize", function() { return _GeneralStyles__WEBPACK_IMPORTED_MODULE_10__["normalize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "noWrap", function() { return _GeneralStyles__WEBPACK_IMPORTED_MODULE_10__["noWrap"]; });

/* harmony import */ var _zIndexes__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("../../packages/styling/lib/styles/zIndexes.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ZIndexes", function() { return _zIndexes__WEBPACK_IMPORTED_MODULE_11__["ZIndexes"]; });















/***/ }),

/***/ "../../packages/styling/lib/styles/theme.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThemeSettingName", function() { return ThemeSettingName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTheme", function() { return getTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerOnThemeChangeCallback", function() { return registerOnThemeChangeCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeOnThemeChangeCallback", function() { return removeOnThemeChangeCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadTheme", function() { return loadTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTheme", function() { return createTheme; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var _uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/index.js");
/* harmony import */ var _DefaultFontStyles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/styling/lib/styles/DefaultFontStyles.js");
/* harmony import */ var _DefaultPalette__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/styling/lib/styles/DefaultPalette.js");
/* harmony import */ var _DefaultTypography__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/styling/lib/styles/DefaultTypography.js");
/* harmony import */ var _microsoft_load_themed_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../common/temp/node_modules/@microsoft/load-themed-styles/lib/index.js");
/* harmony import */ var _microsoft_load_themed_styles__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_microsoft_load_themed_styles__WEBPACK_IMPORTED_MODULE_5__);






var _theme = createTheme({
    palette: _DefaultPalette__WEBPACK_IMPORTED_MODULE_3__["DefaultPalette"],
    semanticColors: _makeSemanticColorsFromPalette(_DefaultPalette__WEBPACK_IMPORTED_MODULE_3__["DefaultPalette"], false, false),
    fonts: _DefaultFontStyles__WEBPACK_IMPORTED_MODULE_2__["DefaultFontStyles"],
    isInverted: false,
    typography: _DefaultTypography__WEBPACK_IMPORTED_MODULE_4__["DefaultTypography"],
    disableGlobalClassNames: false
});
var _onThemeChangeCallbacks = [];
var ThemeSettingName = 'theme';
if (!_uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["Customizations"].getSettings([ThemeSettingName]).theme) {
    var win = typeof window !== 'undefined' ? window : undefined;
    // tslint:disable:no-string-literal no-any
    if (win && win['FabricConfig'] && win['FabricConfig'].theme) {
        _theme = createTheme(win['FabricConfig'].theme);
    }
    // tslint:enable:no-string-literal no-any
    // Set the default theme.
    _uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["Customizations"].applySettings((_a = {}, _a[ThemeSettingName] = _theme, _a));
}
/**
 * Gets the theme object
 * @param {boolean} depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
function getTheme(depComments) {
    if (depComments === void 0) { depComments = false; }
    if (depComments === true) {
        _theme = createTheme({}, depComments);
    }
    return _theme;
}
/**
 * Registers a callback that gets called whenever the theme changes.
 * This should only be used when the component cannot automatically get theme changes through its state.
 * This will not register duplicate callbacks.
 */
function registerOnThemeChangeCallback(callback) {
    if (_onThemeChangeCallbacks.indexOf(callback) === -1) {
        _onThemeChangeCallbacks.push(callback);
    }
}
/**
 * See registerOnThemeChangeCallback().
 * Removes previously registered callbacks.
 */
function removeOnThemeChangeCallback(callback) {
    var i = _onThemeChangeCallbacks.indexOf(callback);
    if (i === -1) {
        return;
    }
    _onThemeChangeCallbacks.splice(i, 1);
}
/**
 * Applies the theme, while filling in missing slots.
 * @param {object} theme - Partial theme object.
 * @param {boolean} depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
function loadTheme(theme, depComments) {
    if (depComments === void 0) { depComments = false; }
    _theme = createTheme(theme, depComments);
    // Invoke the legacy method of theming the page as well.
    Object(_microsoft_load_themed_styles__WEBPACK_IMPORTED_MODULE_5__["loadTheme"])(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _theme.palette, _theme.semanticColors));
    _uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["Customizations"].applySettings((_a = {}, _a[ThemeSettingName] = _theme, _a));
    _onThemeChangeCallbacks.forEach(function (callback) {
        try {
            callback(_theme);
        }
        catch (e) {
            // don't let a bad callback break everything else
        }
    });
    return _theme;
    var _a;
}
/**
 * Creates a custom theme definition which can be used with the Customizer.
 * @param {object} theme - Partial theme object.
 * @param {boolean} depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
function createTheme(theme, depComments) {
    if (depComments === void 0) { depComments = false; }
    var newPalette = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _DefaultPalette__WEBPACK_IMPORTED_MODULE_3__["DefaultPalette"], theme.palette);
    if (!theme.palette || !theme.palette.accent) {
        newPalette.accent = newPalette.themePrimary;
    }
    // mix in custom overrides with good slots first, since custom overrides might be used in fixing deprecated slots
    var newSemanticColors = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _makeSemanticColorsFromPalette(newPalette, !!theme.isInverted, depComments), theme.semanticColors);
    var typography = Object(_uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["merge"])({}, _DefaultTypography__WEBPACK_IMPORTED_MODULE_4__["DefaultTypography"], theme.typography);
    var variants = typography.variants;
    for (var variantName in variants) {
        if (variants.hasOwnProperty(variantName)) {
            var variant = variants[variantName];
            if (variant.fontFamily && typography.families[variant.fontFamily]) {
                variant.fontFamily = typography.families[variant.fontFamily];
            }
            if (variant.fontSize && typography.sizes[variant.fontSize]) {
                variant.fontSize = typography.sizes[variant.fontSize];
            }
            if (variant.fontWeight && typography.weights[variant.fontWeight]) {
                variant.fontWeight = typography.weights[variant.fontWeight];
            }
        }
    }
    return {
        palette: newPalette,
        fonts: tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _DefaultFontStyles__WEBPACK_IMPORTED_MODULE_2__["DefaultFontStyles"], theme.fonts),
        semanticColors: newSemanticColors,
        isInverted: !!theme.isInverted,
        disableGlobalClassNames: !!theme.disableGlobalClassNames,
        typography: typography
    };
}
// Generates all the semantic slot colors based on the Fabric palette.
// We'll use these as fallbacks for semantic slots that the passed in theme did not define.
function _makeSemanticColorsFromPalette(p, isInverted, depComments) {
    var toReturn = {
        bodyBackground: p.white,
        bodyStandoutBackground: p.white,
        bodyFrameBackground: p.white,
        bodyFrameDivider: p.neutralLight,
        bodyText: p.neutralPrimary,
        bodyTextChecked: p.black,
        bodySubtext: p.neutralSecondary,
        bodyDivider: p.neutralTertiaryAlt,
        disabledBackground: p.neutralLighter,
        disabledText: p.neutralTertiary,
        disabledBodyText: p.neutralTertiaryAlt,
        disabledSubtext: p.neutralQuaternary,
        focusBorder: p.black,
        variantBorder: p.neutralLight,
        variantBorderHovered: p.neutralTertiary,
        defaultStateBackground: p.neutralLight,
        errorText: !isInverted ? p.redDark : '#ff5f5f',
        warningText: !isInverted ? '#333333' : '#ffffff',
        errorBackground: !isInverted ? 'rgba(232, 17, 35, .2)' : 'rgba(232, 17, 35, .5)',
        blockingBackground: !isInverted ? 'rgba(234, 67, 0, .2)' : 'rgba(234, 67, 0, .5)',
        warningBackground: !isInverted ? 'rgba(255, 185, 0, .2)' : 'rgba(255, 251, 0, .6)',
        warningHighlight: !isInverted ? '#ffb900' : '#fff100',
        successBackground: !isInverted ? 'rgba(186, 216, 10, .2)' : 'rgba(186, 216, 10, .4)',
        inputBorder: p.neutralTertiary,
        inputBorderHovered: p.neutralDark,
        inputBackground: p.white,
        inputBackgroundChecked: p.themePrimary,
        inputBackgroundCheckedHovered: p.themeDarkAlt,
        inputForegroundChecked: p.white,
        inputFocusBorderAlt: p.themePrimary,
        smallInputBorder: p.neutralSecondary,
        inputPlaceholderText: p.neutralSecondary,
        buttonBackground: p.neutralLighter,
        buttonBackgroundChecked: p.neutralTertiaryAlt,
        buttonBackgroundHovered: p.neutralLight,
        buttonBackgroundCheckedHovered: p.neutralLight,
        buttonBackgroundPressed: p.neutralLight,
        buttonBorder: 'transparent',
        buttonText: p.neutralPrimary,
        buttonTextHovered: p.black,
        buttonTextChecked: p.neutralDark,
        buttonTextCheckedHovered: p.black,
        buttonTextPressed: p.neutralDark,
        buttonTextDisabled: p.neutralQuaternary,
        buttonBorderDisabled: 'transparent',
        primaryButtonBackground: p.themePrimary,
        primaryButtonBackgroundHovered: p.themeDarkAlt,
        primaryButtonBackgroundPressed: p.themeDark,
        primaryButtonBorder: 'transparent',
        primaryButtonText: p.white,
        primaryButtonTextHovered: p.white,
        primaryButtonTextPressed: p.white,
        menuItemBackgroundHovered: p.neutralLighter,
        menuIcon: p.themePrimary,
        menuHeader: p.themePrimary,
        listBackground: p.white,
        listText: p.neutralPrimary,
        listItemBackgroundHovered: p.neutralLighter,
        listItemBackgroundChecked: p.neutralLight,
        listItemBackgroundCheckedHovered: p.neutralQuaternaryAlt,
        listHeaderBackgroundHovered: p.neutralLighter,
        listHeaderBackgroundPressed: p.neutralLight,
        actionLink: p.neutralPrimary,
        actionLinkHovered: p.neutralDark,
        link: p.themePrimary,
        linkHovered: p.themeDarker,
        // Deprecated slots, second pass by _fixDeprecatedSlots() later for self-referential slots
        listTextColor: '',
        menuItemBackgroundChecked: p.neutralLight
    };
    return _fixDeprecatedSlots(toReturn, depComments);
}
function _fixDeprecatedSlots(s, depComments) {
    // Add @deprecated tag as comment if enabled
    var dep = '';
    if (depComments === true) {
        dep = ' /* @deprecated */';
    }
    s.listTextColor = s.listText + dep;
    s.menuItemBackgroundChecked += dep;
    return s;
}
var _a;


/***/ }),

/***/ "../../packages/styling/lib/styles/zIndexes.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZIndexes", function() { return ZIndexes; });
var ZIndexes;
(function (ZIndexes) {
    ZIndexes.Nav = 1;
    ZIndexes.ScrollablePane = 1;
    ZIndexes.FocusStyle = 1;
    ZIndexes.Coachmark = 1000;
    ZIndexes.Layer = 1000000;
    ZIndexes.KeytipLayer = 1000001;
})(ZIndexes || (ZIndexes = {}));


/***/ }),

/***/ "../../packages/styling/lib/utilities/buildClassMap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildClassMap", function() { return buildClassMap; });
/* harmony import */ var _MergeStyles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/MergeStyles.js");

/**
 * Builds a class names object from a given map.
 *
 * @param styles - Map of unprocessed styles.
 * @returns Map of property name to class name.
 */
function buildClassMap(styles) {
    var classes = {};
    var _loop_1 = function (styleName) {
        if (styles.hasOwnProperty(styleName)) {
            var className_1;
            Object.defineProperty(classes, styleName, {
                get: function () {
                    if (className_1 === undefined) {
                        // tslint:disable-next-line:no-any
                        className_1 = Object(_MergeStyles__WEBPACK_IMPORTED_MODULE_0__["mergeStyles"])(styles[styleName]).toString();
                    }
                    return className_1;
                },
                enumerable: true,
                configurable: true
            });
        }
    };
    for (var styleName in styles) {
        _loop_1(styleName);
    }
    return classes;
}


/***/ }),

/***/ "../../packages/styling/lib/utilities/getIconClassName.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIconClassName", function() { return getIconClassName; });
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/utilities/icons.js");


var defaultIconStyles = {
    display: 'inline-block'
};
/**
 * Gets an icon classname. You should be able to add this classname to an I tag with no
 * additional classnames, and render the icon.
 *
 * @public
 */
function getIconClassName(name) {
    var className = '';
    var icon = Object(_icons__WEBPACK_IMPORTED_MODULE_1__["getIcon"])(name);
    if (icon) {
        className = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["mergeStyles"])(icon.subset.className, defaultIconStyles, {
            selectors: {
                '::before': {
                    content: "\"" + icon.code + "\""
                }
            }
        });
    }
    return className;
}


/***/ }),

/***/ "../../packages/styling/lib/utilities/icons.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerIcons", function() { return registerIcons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unregisterIcons", function() { return unregisterIcons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerIconAlias", function() { return registerIconAlias; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIcon", function() { return getIcon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setIconOptions", function() { return setIconOptions; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var _uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/index.js");
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/merge-styles/lib/index.js");



var ICON_SETTING_NAME = 'icons';
var _iconSettings = _uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["GlobalSettings"].getValue(ICON_SETTING_NAME, {
    __options: {
        disableWarnings: false,
        warnOnMissingIcons: true
    },
    __remapped: {}
});
// Reset icon registration on stylesheet resets.
var stylesheet = _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__["Stylesheet"].getInstance();
if (stylesheet && stylesheet.onReset) {
    stylesheet.onReset(function () {
        for (var name_1 in _iconSettings) {
            if (_iconSettings.hasOwnProperty(name_1) && !!_iconSettings[name_1].subset) {
                _iconSettings[name_1].subset.className = undefined;
            }
        }
    });
}
/**
 * Normalizes an icon name for consistent mapping.
 * Current implementation is to convert the icon name to lower case.
 *
 * @param name - Icon name to normalize.
 * @returns {string} Normalized icon name to use for indexing and mapping.
 */
var normalizeIconName = function (name) { return name.toLowerCase(); };
/**
 * Registers a given subset of icons.
 *
 * @param iconSubset - the icon subset definition.
 */
function registerIcons(iconSubset, options) {
    var subset = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, iconSubset, { isRegistered: false, className: undefined });
    var icons = iconSubset.icons;
    // Grab options, optionally mix user provided ones on top.
    options = options ? tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _iconSettings.__options, options) : _iconSettings.__options;
    for (var iconName in icons) {
        if (icons.hasOwnProperty(iconName)) {
            var code = icons[iconName];
            var normalizedIconName = normalizeIconName(iconName);
            if (_iconSettings[normalizedIconName]) {
                if (!options.disableWarnings) {
                    Object(_uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["warn"])("Icon '" + iconName + " being re-registered. Ignoring duplicate registration.");
                }
            }
            else {
                _iconSettings[normalizedIconName] = {
                    code: code,
                    subset: subset
                };
            }
        }
    }
}
/**
 * Unregisters icons by name.
 *
 * @param iconNames - List of icons to unregister.
 */
function unregisterIcons(iconNames) {
    var options = _iconSettings.__options;
    var _loop_1 = function (iconName) {
        var normalizedIconName = normalizeIconName(iconName);
        if (_iconSettings[normalizedIconName]) {
            delete _iconSettings[normalizedIconName];
        }
        else {
            // Warn that we are trying to delete an icon that doesn't exist
            if (!options.disableWarnings) {
                Object(_uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["warn"])("The icon \"" + iconName + "\" tried to unregister but was not registered.");
            }
        }
        // Delete any aliases for this iconName
        if (_iconSettings.__remapped[normalizedIconName]) {
            delete _iconSettings.__remapped[normalizedIconName];
        }
        // Delete any items that were an alias for this iconName
        Object.keys(_iconSettings.__remapped).forEach(function (key) {
            if (_iconSettings.__remapped[key] === normalizedIconName) {
                delete _iconSettings.__remapped[key];
            }
        });
    };
    for (var _i = 0, iconNames_1 = iconNames; _i < iconNames_1.length; _i++) {
        var iconName = iconNames_1[_i];
        _loop_1(iconName);
    }
}
/**
 * Remaps one icon name to another.
 */
function registerIconAlias(iconName, mappedToName) {
    _iconSettings.__remapped[normalizeIconName(iconName)] = normalizeIconName(mappedToName);
}
/**
 * Gets an icon definition. If an icon is requested but the subset has yet to be registered,
 * it will get registered immediately.
 *
 * @public
 * @param name - Name of icon.
 */
function getIcon(name) {
    var icon = undefined;
    var options = _iconSettings.__options;
    name = name ? normalizeIconName(name) : '';
    name = _iconSettings.__remapped[name] || name;
    if (name) {
        icon = _iconSettings[name];
        if (icon) {
            var subset = icon.subset;
            if (subset && subset.fontFace) {
                if (!subset.isRegistered) {
                    Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__["fontFace"])(subset.fontFace);
                    subset.isRegistered = true;
                }
                if (!subset.className) {
                    subset.className = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__["mergeStyles"])(subset.style, {
                        fontFamily: subset.fontFace.fontFamily,
                        fontWeight: subset.fontFace.fontWeight || 'normal',
                        fontStyle: subset.fontFace.fontStyle || 'normal'
                    });
                }
            }
        }
        else {
            if (!options.disableWarnings && options.warnOnMissingIcons) {
                Object(_uifabric_utilities__WEBPACK_IMPORTED_MODULE_1__["warn"])("The icon \"" + name + "\" was used but not registered. See http://aka.ms/fabric-icon-usage for more information.");
            }
        }
    }
    return icon;
}
/**
 * Sets the icon options.
 *
 * @public
 */
function setIconOptions(options) {
    _iconSettings.__options = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _iconSettings.__options, options);
}


/***/ }),

/***/ "../../packages/styling/lib/utilities/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _buildClassMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/styling/lib/utilities/buildClassMap.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "buildClassMap", function() { return _buildClassMap__WEBPACK_IMPORTED_MODULE_0__["buildClassMap"]; });

/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/styling/lib/utilities/icons.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getIcon", function() { return _icons__WEBPACK_IMPORTED_MODULE_1__["getIcon"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerIcons", function() { return _icons__WEBPACK_IMPORTED_MODULE_1__["registerIcons"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerIconAlias", function() { return _icons__WEBPACK_IMPORTED_MODULE_1__["registerIconAlias"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "unregisterIcons", function() { return _icons__WEBPACK_IMPORTED_MODULE_1__["unregisterIcons"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setIconOptions", function() { return _icons__WEBPACK_IMPORTED_MODULE_1__["setIconOptions"]; });

/* harmony import */ var _getIconClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/styling/lib/utilities/getIconClassName.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getIconClassName", function() { return _getIconClassName__WEBPACK_IMPORTED_MODULE_2__["getIconClassName"]; });






/***/ }),

/***/ "../../packages/utilities/lib/Async.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Async", function() { return Async; });
/**
 * Bugs often appear in async code when stuff gets disposed, but async operations don't get canceled.
 * This Async helper class solves these issues by tying async code to the lifetime of a disposable object.
 *
 * Usage: Anything class extending from BaseModel can access this helper via this.async. Otherwise create a
 * new instance of the class and remember to call dispose() during your code's dispose handler.
 *
 * @public
 */
var Async = /** @class */ (function () {
    // tslint:disable-next-line:no-any
    function Async(parent, onError) {
        this._timeoutIds = null;
        this._immediateIds = null;
        this._intervalIds = null;
        this._animationFrameIds = null;
        this._isDisposed = false;
        this._parent = parent || null;
        this._onErrorHandler = onError;
        this._noop = function () {
            /* do nothing */
        };
    }
    /**
     * Dispose function, clears all async operations.
     */
    Async.prototype.dispose = function () {
        var id;
        this._isDisposed = true;
        this._parent = null;
        // Clear timeouts.
        if (this._timeoutIds) {
            for (id in this._timeoutIds) {
                if (this._timeoutIds.hasOwnProperty(id)) {
                    this.clearTimeout(parseInt(id, 10));
                }
            }
            this._timeoutIds = null;
        }
        // Clear immediates.
        if (this._immediateIds) {
            for (id in this._immediateIds) {
                if (this._immediateIds.hasOwnProperty(id)) {
                    this.clearImmediate(parseInt(id, 10));
                }
            }
            this._immediateIds = null;
        }
        // Clear intervals.
        if (this._intervalIds) {
            for (id in this._intervalIds) {
                if (this._intervalIds.hasOwnProperty(id)) {
                    this.clearInterval(parseInt(id, 10));
                }
            }
            this._intervalIds = null;
        }
        // Clear animation frames.
        if (this._animationFrameIds) {
            for (id in this._animationFrameIds) {
                if (this._animationFrameIds.hasOwnProperty(id)) {
                    this.cancelAnimationFrame(parseInt(id, 10));
                }
            }
            this._animationFrameIds = null;
        }
    };
    /**
     * SetTimeout override, which will auto cancel the timeout during dispose.
     * @param callback - Callback to execute.
     * @param duration - Duration in milliseconds.
     * @returns The setTimeout id.
     */
    Async.prototype.setTimeout = function (callback, duration) {
        var _this = this;
        var timeoutId = 0;
        if (!this._isDisposed) {
            if (!this._timeoutIds) {
                this._timeoutIds = {};
            }
            /* tslint:disable:ban-native-functions */
            timeoutId = setTimeout(function () {
                // Time to execute the timeout, enqueue it as a foreground task to be executed.
                try {
                    // Now delete the record and call the callback.
                    if (_this._timeoutIds) {
                        delete _this._timeoutIds[timeoutId];
                    }
                    callback.apply(_this._parent);
                }
                catch (e) {
                    if (_this._onErrorHandler) {
                        _this._onErrorHandler(e);
                    }
                }
            }, duration);
            /* tslint:enable:ban-native-functions */
            this._timeoutIds[timeoutId] = true;
        }
        return timeoutId;
    };
    /**
     * Clears the timeout.
     * @param id - Id to cancel.
     */
    Async.prototype.clearTimeout = function (id) {
        if (this._timeoutIds && this._timeoutIds[id]) {
            /* tslint:disable:ban-native-functions */
            clearTimeout(id);
            delete this._timeoutIds[id];
            /* tslint:enable:ban-native-functions */
        }
    };
    /**
     * SetImmediate override, which will auto cancel the immediate during dispose.
     * @param callback - Callback to execute.
     * @returns The setTimeout id.
     */
    Async.prototype.setImmediate = function (callback) {
        var _this = this;
        var immediateId = 0;
        if (!this._isDisposed) {
            if (!this._immediateIds) {
                this._immediateIds = {};
            }
            /* tslint:disable:ban-native-functions */
            var setImmediateCallback = function () {
                // Time to execute the timeout, enqueue it as a foreground task to be executed.
                try {
                    // Now delete the record and call the callback.
                    if (_this._immediateIds) {
                        delete _this._immediateIds[immediateId];
                    }
                    callback.apply(_this._parent);
                }
                catch (e) {
                    _this._logError(e);
                }
            };
            immediateId = window.setImmediate
                ? window.setImmediate(setImmediateCallback)
                : window.setTimeout(setImmediateCallback, 0);
            /* tslint:enable:ban-native-functions */
            this._immediateIds[immediateId] = true;
        }
        return immediateId;
    };
    /**
     * Clears the immediate.
     * @param id - Id to cancel.
     */
    Async.prototype.clearImmediate = function (id) {
        if (this._immediateIds && this._immediateIds[id]) {
            /* tslint:disable:ban-native-functions */
            window.clearImmediate ? window.clearImmediate(id) : window.clearTimeout(id);
            delete this._immediateIds[id];
            /* tslint:enable:ban-native-functions */
        }
    };
    /**
     * SetInterval override, which will auto cancel the timeout during dispose.
     * @param callback - Callback to execute.
     * @param duration - Duration in milliseconds.
     * @returns The setTimeout id.
     */
    Async.prototype.setInterval = function (callback, duration) {
        var _this = this;
        var intervalId = 0;
        if (!this._isDisposed) {
            if (!this._intervalIds) {
                this._intervalIds = {};
            }
            /* tslint:disable:ban-native-functions */
            intervalId = setInterval(function () {
                // Time to execute the interval callback, enqueue it as a foreground task to be executed.
                try {
                    callback.apply(_this._parent);
                }
                catch (e) {
                    _this._logError(e);
                }
            }, duration);
            /* tslint:enable:ban-native-functions */
            this._intervalIds[intervalId] = true;
        }
        return intervalId;
    };
    /**
     * Clears the interval.
     * @param id - Id to cancel.
     */
    Async.prototype.clearInterval = function (id) {
        if (this._intervalIds && this._intervalIds[id]) {
            /* tslint:disable:ban-native-functions */
            clearInterval(id);
            delete this._intervalIds[id];
            /* tslint:enable:ban-native-functions */
        }
    };
    /**
     * Creates a function that, when executed, will only call the func function at most once per
     * every wait milliseconds. Provide an options object to indicate that func should be invoked
     * on the leading and/or trailing edge of the wait timeout. Subsequent calls to the throttled
     * function will return the result of the last func call.
     *
     * Note: If leading and trailing options are true func will be called on the trailing edge of
     * the timeout only if the the throttled function is invoked more than once during the wait timeout.
     *
     * @param func - The function to throttle.
     * @param wait - The number of milliseconds to throttle executions to. Defaults to 0.
     * @param options - The options object.
     * @returns The new throttled function.
     */
    Async.prototype.throttle = function (func, wait, options) {
        var _this = this;
        if (this._isDisposed) {
            return this._noop;
        }
        var waitMS = wait || 0;
        var leading = true;
        var trailing = true;
        var lastExecuteTime = 0;
        var lastResult;
        // tslint:disable-next-line:no-any
        var lastArgs;
        var timeoutId = null;
        if (options && typeof options.leading === 'boolean') {
            leading = options.leading;
        }
        if (options && typeof options.trailing === 'boolean') {
            trailing = options.trailing;
        }
        var callback = function (userCall) {
            var now = new Date().getTime();
            var delta = now - lastExecuteTime;
            var waitLength = leading ? waitMS - delta : waitMS;
            if (delta >= waitMS && (!userCall || leading)) {
                lastExecuteTime = now;
                if (timeoutId) {
                    _this.clearTimeout(timeoutId);
                    timeoutId = null;
                }
                lastResult = func.apply(_this._parent, lastArgs);
            }
            else if (timeoutId === null && trailing) {
                timeoutId = _this.setTimeout(callback, waitLength);
            }
            return lastResult;
        };
        // tslint:disable-next-line:no-any
        var resultFunction = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            lastArgs = args;
            return callback(true);
        };
        return resultFunction;
    };
    /**
     * Creates a function that will delay the execution of func until after wait milliseconds have
     * elapsed since the last time it was invoked. Provide an options object to indicate that func
     * should be invoked on the leading and/or trailing edge of the wait timeout. Subsequent calls
     * to the debounced function will return the result of the last func call.
     *
     * Note: If leading and trailing options are true func will be called on the trailing edge of
     * the timeout only if the the debounced function is invoked more than once during the wait
     * timeout.
     *
     * @param func - The function to debounce.
     * @param wait - The number of milliseconds to delay.
     * @param options - The options object.
     * @returns The new debounced function.
     */
    Async.prototype.debounce = function (func, wait, options) {
        var _this = this;
        if (this._isDisposed) {
            var noOpFunction = (function () {
                /** Do nothing */
            });
            noOpFunction.cancel = function () {
                return;
            };
            /* tslint:disable:no-any */
            noOpFunction.flush = (function () { return null; });
            /* tslint:enable:no-any */
            noOpFunction.pending = function () { return false; };
            return noOpFunction;
        }
        var waitMS = wait || 0;
        var leading = false;
        var trailing = true;
        var maxWait = null;
        var lastCallTime = 0;
        var lastExecuteTime = new Date().getTime();
        var lastResult;
        // tslint:disable-next-line:no-any
        var lastArgs;
        var timeoutId = null;
        if (options && typeof options.leading === 'boolean') {
            leading = options.leading;
        }
        if (options && typeof options.trailing === 'boolean') {
            trailing = options.trailing;
        }
        if (options && typeof options.maxWait === 'number' && !isNaN(options.maxWait)) {
            maxWait = options.maxWait;
        }
        var markExecuted = function (time) {
            if (timeoutId) {
                _this.clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastExecuteTime = time;
        };
        var invokeFunction = function (time) {
            markExecuted(time);
            lastResult = func.apply(_this._parent, lastArgs);
        };
        var callback = function (userCall) {
            var now = new Date().getTime();
            var executeImmediately = false;
            if (userCall) {
                if (leading && now - lastCallTime >= waitMS) {
                    executeImmediately = true;
                }
                lastCallTime = now;
            }
            var delta = now - lastCallTime;
            var waitLength = waitMS - delta;
            var maxWaitDelta = now - lastExecuteTime;
            var maxWaitExpired = false;
            if (maxWait !== null) {
                // maxWait only matters when there is a pending callback
                if (maxWaitDelta >= maxWait && timeoutId) {
                    maxWaitExpired = true;
                }
                else {
                    waitLength = Math.min(waitLength, maxWait - maxWaitDelta);
                }
            }
            if (delta >= waitMS || maxWaitExpired || executeImmediately) {
                invokeFunction(now);
            }
            else if ((timeoutId === null || !userCall) && trailing) {
                timeoutId = _this.setTimeout(callback, waitLength);
            }
            return lastResult;
        };
        var pending = function () {
            return !!timeoutId;
        };
        var cancel = function () {
            if (pending()) {
                // Mark the debounced function as having executed
                markExecuted(new Date().getTime());
            }
        };
        var flush = function () {
            if (pending()) {
                invokeFunction(new Date().getTime());
            }
            return lastResult;
        };
        // tslint:disable-next-line:no-any
        var resultFunction = (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            lastArgs = args;
            return callback(true);
        });
        resultFunction.cancel = cancel;
        resultFunction.flush = flush;
        resultFunction.pending = pending;
        return resultFunction;
    };
    Async.prototype.requestAnimationFrame = function (callback) {
        var _this = this;
        var animationFrameId = 0;
        if (!this._isDisposed) {
            if (!this._animationFrameIds) {
                this._animationFrameIds = {};
            }
            /* tslint:disable:ban-native-functions */
            var animationFrameCallback = function () {
                try {
                    // Now delete the record and call the callback.
                    if (_this._animationFrameIds) {
                        delete _this._animationFrameIds[animationFrameId];
                    }
                    callback.apply(_this._parent);
                }
                catch (e) {
                    _this._logError(e);
                }
            };
            animationFrameId = window.requestAnimationFrame
                ? window.requestAnimationFrame(animationFrameCallback)
                : window.setTimeout(animationFrameCallback, 0);
            /* tslint:enable:ban-native-functions */
            this._animationFrameIds[animationFrameId] = true;
        }
        return animationFrameId;
    };
    Async.prototype.cancelAnimationFrame = function (id) {
        if (this._animationFrameIds && this._animationFrameIds[id]) {
            /* tslint:disable:ban-native-functions */
            window.cancelAnimationFrame ? window.cancelAnimationFrame(id) : window.clearTimeout(id);
            /* tslint:enable:ban-native-functions */
            delete this._animationFrameIds[id];
        }
    };
    // tslint:disable-next-line:no-any
    Async.prototype._logError = function (e) {
        if (this._onErrorHandler) {
            this._onErrorHandler(e);
        }
    };
    return Async;
}());



/***/ }),

/***/ "../../packages/utilities/lib/AutoScroll.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutoScroll", function() { return AutoScroll; });
/* harmony import */ var _EventGroup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/EventGroup.js");
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/scroll.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/utilities/lib/dom.js");



var SCROLL_ITERATION_DELAY = 16;
var SCROLL_GUTTER_HEIGHT = 100;
var MAX_SCROLL_VELOCITY = 15;
/**
 * AutoScroll simply hooks up mouse events given a parent element, and scrolls the container
 * up/down depending on how close the mouse is to the top/bottom of the container.
 *
 * Once you don't want autoscroll any more, just dispose the helper and it will unhook events.
 *
 * @public
 */
var AutoScroll = /** @class */ (function () {
    function AutoScroll(element) {
        this._events = new _EventGroup__WEBPACK_IMPORTED_MODULE_0__["EventGroup"](this);
        this._scrollableParent = Object(_scroll__WEBPACK_IMPORTED_MODULE_1__["findScrollableParent"])(element);
        this._incrementScroll = this._incrementScroll.bind(this);
        this._scrollRect = Object(_dom__WEBPACK_IMPORTED_MODULE_2__["getRect"])(this._scrollableParent);
        // tslint:disable-next-line:no-any
        if (this._scrollableParent === window) {
            this._scrollableParent = document.body;
        }
        if (this._scrollableParent) {
            this._events.on(window, 'mousemove', this._onMouseMove, true);
            this._events.on(window, 'touchmove', this._onTouchMove, true);
        }
    }
    AutoScroll.prototype.dispose = function () {
        this._events.dispose();
        this._stopScroll();
    };
    AutoScroll.prototype._onMouseMove = function (ev) {
        this._computeScrollVelocity(ev.clientY);
    };
    AutoScroll.prototype._onTouchMove = function (ev) {
        if (ev.touches.length > 0) {
            this._computeScrollVelocity(ev.touches[0].clientY);
        }
    };
    AutoScroll.prototype._computeScrollVelocity = function (clientY) {
        if (!this._scrollRect) {
            return;
        }
        var scrollRectTop = this._scrollRect.top;
        var scrollClientBottom = scrollRectTop + this._scrollRect.height - SCROLL_GUTTER_HEIGHT;
        if (clientY < scrollRectTop + SCROLL_GUTTER_HEIGHT) {
            this._scrollVelocity = Math.max(-MAX_SCROLL_VELOCITY, -MAX_SCROLL_VELOCITY * ((SCROLL_GUTTER_HEIGHT - (clientY - scrollRectTop)) / SCROLL_GUTTER_HEIGHT));
        }
        else if (clientY > scrollClientBottom) {
            this._scrollVelocity = Math.min(MAX_SCROLL_VELOCITY, MAX_SCROLL_VELOCITY * ((clientY - scrollClientBottom) / SCROLL_GUTTER_HEIGHT));
        }
        else {
            this._scrollVelocity = 0;
        }
        if (this._scrollVelocity) {
            this._startScroll();
        }
        else {
            this._stopScroll();
        }
    };
    AutoScroll.prototype._startScroll = function () {
        if (!this._timeoutId) {
            this._incrementScroll();
        }
    };
    AutoScroll.prototype._incrementScroll = function () {
        if (this._scrollableParent) {
            this._scrollableParent.scrollTop += Math.round(this._scrollVelocity);
        }
        this._timeoutId = setTimeout(this._incrementScroll, SCROLL_ITERATION_DELAY);
    };
    AutoScroll.prototype._stopScroll = function () {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            delete this._timeoutId;
        }
    };
    return AutoScroll;
}());



/***/ }),

/***/ "../../packages/utilities/lib/BaseComponent.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseComponent", function() { return BaseComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nullRender", function() { return nullRender; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Async__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/utilities/lib/Async.js");
/* harmony import */ var _EventGroup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/utilities/lib/EventGroup.js");
/* harmony import */ var _warn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/utilities/lib/warn.js");
/* harmony import */ var _initializeFocusRects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../packages/utilities/lib/initializeFocusRects.js");
/* harmony import */ var _initializeDir__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../packages/utilities/lib/initializeDir.js");







/**
 * BaseComponent class, which provides basic helpers for all components.
 *
 * @public
 */
var BaseComponent = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](BaseComponent, _super);
    // tslint:enable:variable-name
    /**
     * BaseComponent constructor
     * @param props - The props for the component.
     * @param context - The context for the component.
     */
    // tslint:disable-next-line:no-any
    function BaseComponent(props, context) {
        var _this = _super.call(this, props, context) || this;
        // Ensure basic assumptions about the environment.
        Object(_initializeFocusRects__WEBPACK_IMPORTED_MODULE_5__["initializeFocusRects"])();
        Object(_initializeDir__WEBPACK_IMPORTED_MODULE_6__["initializeDir"])();
        _makeAllSafe(_this, BaseComponent.prototype, [
            'componentWillMount',
            'componentDidMount',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'componentWillReceiveProps',
            'render',
            'componentDidUpdate',
            'componentWillUnmount'
        ]);
        return _this;
    }
    /**
     * When the component will receive props, make sure the componentRef is updated.
     */
    // tslint:disable-next-line:no-any
    BaseComponent.prototype.componentWillReceiveProps = function (newProps, newContext) {
        this._updateComponentRef(this.props, newProps);
    };
    /**
     * When the component has mounted, update the componentRef.
     */
    BaseComponent.prototype.componentDidMount = function () {
        this._setComponentRef(this.props.componentRef, this);
    };
    /**
     * If we have disposables, dispose them automatically on unmount.
     */
    BaseComponent.prototype.componentWillUnmount = function () {
        this._setComponentRef(this.props.componentRef, null);
        if (this.__disposables) {
            for (var i = 0, len = this._disposables.length; i < len; i++) {
                var disposable = this.__disposables[i];
                if (disposable.dispose) {
                    disposable.dispose();
                }
            }
            this.__disposables = null;
        }
    };
    Object.defineProperty(BaseComponent.prototype, "className", {
        /**
         * Gets the object's class name.
         */
        get: function () {
            if (!this.__className) {
                var funcNameRegex = /function (.{1,})\(/;
                var results = funcNameRegex.exec(this.constructor.toString());
                this.__className = results && results.length > 1 ? results[1] : '';
            }
            return this.__className;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseComponent.prototype, "_disposables", {
        /**
         * Allows subclasses to push things to this._disposables to be auto disposed.
         */
        get: function () {
            if (!this.__disposables) {
                this.__disposables = [];
            }
            return this.__disposables;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseComponent.prototype, "_async", {
        /**
         * Gets the async instance associated with the component, created on demand. The async instance gives
         * subclasses a way to execute setTimeout/setInterval async calls safely, where the callbacks
         * will be cleared/ignored automatically after unmounting. The helpers within the async object also
         * preserve the this pointer so that you don't need to "bind" the callbacks.
         */
        get: function () {
            if (!this.__async) {
                this.__async = new _Async__WEBPACK_IMPORTED_MODULE_2__["Async"](this);
                this._disposables.push(this.__async);
            }
            return this.__async;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseComponent.prototype, "_events", {
        /**
         * Gets the event group instance assocaited with the component, created on demand. The event instance
         * provides on/off methods for listening to DOM (or regular javascript object) events. The event callbacks
         * will be automatically disconnected after unmounting. The helpers within the events object also
         * preserve the this reference so that you don't need to "bind" the callbacks.
         */
        get: function () {
            if (!this.__events) {
                this.__events = new _EventGroup__WEBPACK_IMPORTED_MODULE_3__["EventGroup"](this);
                this._disposables.push(this.__events);
            }
            return this.__events;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Helper to return a memoized ref resolver function.
     * @param refName - Name of the member to assign the ref to.
     * @returns A function instance keyed from the given refname.
     * @deprecated Use `createRef` from React.createRef.
     */
    BaseComponent.prototype._resolveRef = function (refName) {
        var _this = this;
        if (!this.__resolves) {
            this.__resolves = {};
        }
        if (!this.__resolves[refName]) {
            // tslint:disable-next-line:no-any
            this.__resolves[refName] = function (ref) {
                // tslint:disable-next-line:no-any
                return (_this[refName] = ref);
            };
        }
        return this.__resolves[refName];
    };
    /**
     * Updates the componentRef (by calling it with "this" when necessary.)
     */
    BaseComponent.prototype._updateComponentRef = function (currentProps, newProps) {
        if (newProps === void 0) { newProps = {}; }
        if (currentProps.componentRef !== newProps.componentRef) {
            this._setComponentRef(currentProps.componentRef, null);
            this._setComponentRef(newProps.componentRef, this);
        }
    };
    /**
     * Warns when a deprecated props are being used.
     *
     * @param deprecationMap - The map of deprecations, where key is the prop name and the value is
     * either null or a replacement prop name.
     */
    BaseComponent.prototype._warnDeprecations = function (deprecationMap) {
        Object(_warn__WEBPACK_IMPORTED_MODULE_4__["warnDeprecations"])(this.className, this.props, deprecationMap);
    };
    /**
     * Warns when props which are mutually exclusive with each other are both used.
     *
     * @param mutuallyExclusiveMap - The map of mutually exclusive props.
     */
    BaseComponent.prototype._warnMutuallyExclusive = function (mutuallyExclusiveMap) {
        Object(_warn__WEBPACK_IMPORTED_MODULE_4__["warnMutuallyExclusive"])(this.className, this.props, mutuallyExclusiveMap);
    };
    /**
     * Warns when props are required if a condition is met.
     *
     * @param requiredProps - The name of the props that are required when the condition is met.
     * @param conditionalPropName - The name of the prop that the condition is based on.
     * @param condition - Whether the condition is met.
     */
    BaseComponent.prototype._warnConditionallyRequiredProps = function (requiredProps, conditionalPropName, condition) {
        Object(_warn__WEBPACK_IMPORTED_MODULE_4__["warnConditionallyRequiredProps"])(this.className, this.props, requiredProps, conditionalPropName, condition);
    };
    BaseComponent.prototype._setComponentRef = function (ref, value) {
        if (!this._skipComponentRefResolution && ref) {
            if (typeof ref === 'function') {
                ref(value);
            }
            if (typeof ref === 'object') {
                // tslint:disable:no-any
                ref.current = value;
            }
        }
    };
    return BaseComponent;
}(react__WEBPACK_IMPORTED_MODULE_1__["Component"]));

/**
 * Helper to override a given method with a wrapper method that can try/catch the original, but also
 * ensures that the BaseComponent's methods are called before the subclass's. This ensures that
 * componentWillUnmount in the base is called and that things in the _disposables array are disposed.
 */
function _makeAllSafe(obj, prototype, methodNames) {
    for (var i = 0, len = methodNames.length; i < len; i++) {
        _makeSafe(obj, prototype, methodNames[i]);
    }
}
function _makeSafe(obj, prototype, methodName) {
    // tslint:disable:no-any
    var classMethod = obj[methodName];
    var prototypeMethod = prototype[methodName];
    // tslint:enable:no-any
    if (classMethod || prototypeMethod) {
        // tslint:disable-next-line:no-any
        obj[methodName] = function () {
            var retVal;
            if (prototypeMethod) {
                retVal = prototypeMethod.apply(this, arguments);
            }
            if (classMethod !== prototypeMethod) {
                retVal = classMethod.apply(this, arguments);
            }
            return retVal;
        };
    }
}
/**
 * Simple constant function for returning null, used to render empty templates in JSX.
 *
 * @public
 */
function nullRender() {
    return null;
}


/***/ }),

/***/ "../../packages/utilities/lib/Context.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "provideContext", function() { return provideContext; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function provideContext(contextTypes, mapPropsToContext) {
    var Provider = /** @class */ (function (_super) {
        tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](Provider, _super);
        function Provider() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Provider.prototype.getChildContext = function () {
            return mapPropsToContext(this.props);
        };
        Provider.prototype.render = function () {
            return react__WEBPACK_IMPORTED_MODULE_1__["Children"].only(this.props.children);
        };
        Provider.childContextTypes = contextTypes;
        return Provider;
    }(react__WEBPACK_IMPORTED_MODULE_1__["Component"]));
    return Provider;
}


/***/ }),

/***/ "../../packages/utilities/lib/Customizations.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Customizations", function() { return Customizations; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var _GlobalSettings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/GlobalSettings.js");
/* harmony import */ var _EventGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/utilities/lib/EventGroup.js");



var CustomizationsGlobalKey = 'customizations';
var NO_CUSTOMIZATIONS = { settings: {}, scopedSettings: {} };
var _allSettings = _GlobalSettings__WEBPACK_IMPORTED_MODULE_1__["GlobalSettings"].getValue(CustomizationsGlobalKey, {
    settings: {},
    scopedSettings: {}
});
var _events = new _EventGroup__WEBPACK_IMPORTED_MODULE_2__["EventGroup"](_allSettings);
var Customizations = /** @class */ (function () {
    function Customizations() {
    }
    Customizations.reset = function () {
        _allSettings.settings = {};
        _allSettings.scopedSettings = {};
    };
    // tslint:disable-next-line:no-any
    Customizations.applySettings = function (settings) {
        _allSettings.settings = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _allSettings.settings, settings);
        Customizations._raiseChange();
    };
    // tslint:disable-next-line:no-any
    Customizations.applyScopedSettings = function (scopeName, settings) {
        _allSettings.scopedSettings[scopeName] = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _allSettings.scopedSettings[scopeName], settings);
        Customizations._raiseChange();
    };
    Customizations.getSettings = function (properties, scopeName, localSettings
    // tslint:disable-next-line:no-any
    ) {
        if (localSettings === void 0) { localSettings = NO_CUSTOMIZATIONS; }
        // tslint:disable-next-line:no-any
        var settings = {};
        var localScopedSettings = (scopeName && localSettings.scopedSettings[scopeName]) || {};
        var globalScopedSettings = (scopeName && _allSettings.scopedSettings[scopeName]) || {};
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            settings[property] =
                localScopedSettings[property] ||
                    localSettings.settings[property] ||
                    globalScopedSettings[property] ||
                    _allSettings.settings[property];
        }
        return settings;
    };
    Customizations.observe = function (onChange) {
        _events.on(_allSettings, 'change', onChange);
    };
    Customizations.unobserve = function (onChange) {
        _events.off(_allSettings, 'change', onChange);
    };
    Customizations._raiseChange = function () {
        _events.raise('change');
    };
    return Customizations;
}());



/***/ }),

/***/ "../../packages/utilities/lib/Customizer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomizerContext", function() { return CustomizerContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Customizer", function() { return Customizer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _BaseComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/utilities/lib/BaseComponent.js");
/* harmony import */ var _Customizations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/utilities/lib/Customizations.js");




var CustomizerContext = react__WEBPACK_IMPORTED_MODULE_1__["createContext"]({
    customizations: {
        settings: {},
        scopedSettings: {}
    }
});
/**
 * The Customizer component allows for default props to be mixed into components which
 * are decorated with the customizable() decorator, or use the styled HOC. This enables
 * injection scenarios like:
 *
 * 1. render svg icons instead of the icon font within all buttons
 * 2. inject a custom theme object into a component
 *
 * Props are provided via the settings prop which should be one of the following:
 * - A json map which contains 1 or more name/value pairs representing injectable props.
 * - A function that receives the current settings and returns the new ones that apply to the scope
 *
 * @public
 */
var Customizer = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](Customizer, _super);
    function Customizer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onCustomizationChange = function () { return _this.forceUpdate(); };
        return _this;
    }
    Customizer.prototype.componentDidMount = function () {
        _Customizations__WEBPACK_IMPORTED_MODULE_3__["Customizations"].observe(this._onCustomizationChange);
    };
    Customizer.prototype.componentWillUnmount = function () {
        _Customizations__WEBPACK_IMPORTED_MODULE_3__["Customizations"].unobserve(this._onCustomizationChange);
    };
    Customizer.prototype.render = function () {
        var _this = this;
        return (react__WEBPACK_IMPORTED_MODULE_1__["createElement"](CustomizerContext.Consumer, null, function (parentContext) {
            var newContext = _this._getCustomizations(_this.props, parentContext);
            return react__WEBPACK_IMPORTED_MODULE_1__["createElement"](CustomizerContext.Provider, { value: newContext }, _this.props.children);
        }));
    };
    Customizer.prototype._getCustomizations = function (props, parentContext) {
        var _a = (parentContext || {}).customizations, customizations = _a === void 0 ? { settings: {}, scopedSettings: {} } : _a;
        return {
            customizations: {
                settings: mergeSettings(customizations.settings, props.settings),
                scopedSettings: mergeScopedSettings(customizations.scopedSettings, props.scopedSettings)
            }
        };
    };
    return Customizer;
}(_BaseComponent__WEBPACK_IMPORTED_MODULE_2__["BaseComponent"]));

function mergeSettings(oldSettings, newSettings) {
    if (oldSettings === void 0) { oldSettings = {}; }
    var mergeSettingsWith = isSettingsFunction(newSettings) ? newSettings : settingsMergeWith(newSettings);
    return mergeSettingsWith(oldSettings);
}
function mergeScopedSettings(oldSettings, newSettings) {
    if (oldSettings === void 0) { oldSettings = {}; }
    var mergeSettingsWith = isSettingsFunction(newSettings) ? newSettings : scopedSettingsMergeWith(newSettings);
    return mergeSettingsWith(oldSettings);
}
function isSettingsFunction(settings) {
    return typeof settings === 'function';
}
function settingsMergeWith(newSettings) {
    return function (settings) { return (newSettings ? tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, settings, newSettings) : settings); };
}
function scopedSettingsMergeWith(scopedSettingsFromProps) {
    if (scopedSettingsFromProps === void 0) { scopedSettingsFromProps = {}; }
    return function (oldScopedSettings) {
        var newScopedSettings = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, oldScopedSettings);
        for (var scopeName in scopedSettingsFromProps) {
            if (scopedSettingsFromProps.hasOwnProperty(scopeName)) {
                newScopedSettings[scopeName] = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, oldScopedSettings[scopeName], scopedSettingsFromProps[scopeName]);
            }
        }
        return newScopedSettings;
    };
}


/***/ }),

/***/ "../../packages/utilities/lib/DelayedRender.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DelayedRender", function() { return DelayedRender; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Utility component for delaying the render of a child component after a given delay. This component
 * requires a single child component; don't pass in many components. Wrap multiple components in a DIV
 * if necessary.
 *
 * @public
 */
var DelayedRender = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DelayedRender, _super);
    function DelayedRender(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isRendered: false
        };
        return _this;
    }
    DelayedRender.prototype.componentDidMount = function () {
        var _this = this;
        var delay = this.props.delay;
        this._timeoutId = setTimeout(function () {
            _this.setState({
                isRendered: true
            });
        }, delay);
    };
    DelayedRender.prototype.componentWillUnmount = function () {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }
    };
    DelayedRender.prototype.render = function () {
        return this.state.isRendered ? react__WEBPACK_IMPORTED_MODULE_1__["Children"].only(this.props.children) : null;
    };
    DelayedRender.defaultProps = {
        delay: 0
    };
    return DelayedRender;
}(react__WEBPACK_IMPORTED_MODULE_1__["Component"]));



/***/ }),

/***/ "../../packages/utilities/lib/EventGroup.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventGroup", function() { return EventGroup; });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/object.js");
/* tslint:disable:no-string-literal */

/** An instance of EventGroup allows anything with a handle to it to trigger events on it.
 *  If the target is an HTMLElement, the event will be attached to the element and can be
 *  triggered as usual (like clicking for onclick).
 *  The event can be triggered by calling EventGroup.raise() here. If the target is an
 *  HTMLElement, the event gets raised and is handled by the browser. Otherwise, it gets
 *  handled here in EventGroup, and the handler is called in the context of the parent
 *  (which is passed in in the constructor).
 *
 * @public
 */
var EventGroup = /** @class */ (function () {
    /** parent: the context in which events attached to non-HTMLElements are called */
    // tslint:disable-next-line:no-any
    function EventGroup(parent) {
        this._id = EventGroup._uniqueId++;
        this._parent = parent;
        this._eventRecords = [];
    }
    /** For IE8, bubbleEvent is ignored here and must be dealt with by the handler.
     *  Events raised here by default have bubbling set to false and cancelable set to true.
     *  This applies also to built-in events being raised manually here on HTMLElements,
     *  which may lead to unexpected behavior if it differs from the defaults.
     *
     */
    EventGroup.raise = function (
    // tslint:disable-next-line:no-any
    target, eventName, 
    // tslint:disable-next-line:no-any
    eventArgs, bubbleEvent) {
        var retVal;
        if (EventGroup._isElement(target)) {
            if (document.createEvent) {
                var ev = document.createEvent('HTMLEvents');
                ev.initEvent(eventName, bubbleEvent || false, true);
                Object(_object__WEBPACK_IMPORTED_MODULE_0__["assign"])(ev, eventArgs);
                retVal = target.dispatchEvent(ev);
                // tslint:disable-next-line:no-any
            }
            else if (document['createEventObject']) {
                // IE8
                // tslint:disable-next-line:no-any
                var evObj = document['createEventObject'](eventArgs);
                // cannot set cancelBubble on evObj, fireEvent will overwrite it
                target.fireEvent('on' + eventName, evObj);
            }
        }
        else {
            while (target && retVal !== false) {
                var events = target.__events__;
                var eventRecords = events ? events[eventName] : null;
                if (eventRecords) {
                    for (var id in eventRecords) {
                        if (eventRecords.hasOwnProperty(id)) {
                            var eventRecordList = eventRecords[id];
                            for (var listIndex = 0; retVal !== false && listIndex < eventRecordList.length; listIndex++) {
                                var record = eventRecordList[listIndex];
                                if (record.objectCallback) {
                                    retVal = record.objectCallback.call(record.parent, eventArgs);
                                }
                            }
                        }
                    }
                }
                // If the target has a parent, bubble the event up.
                target = bubbleEvent ? target.parent : null;
            }
        }
        return retVal;
    };
    // tslint:disable-next-line:no-any
    EventGroup.isObserved = function (target, eventName) {
        var events = target && target.__events__;
        return !!events && !!events[eventName];
    };
    /** Check to see if the target has declared support of the given event. */
    // tslint:disable-next-line:no-any
    EventGroup.isDeclared = function (target, eventName) {
        var declaredEvents = target && target.__declaredEvents;
        return !!declaredEvents && !!declaredEvents[eventName];
    };
    // tslint:disable-next-line:no-any
    EventGroup.stopPropagation = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else {
            // IE8
            event.cancelBubble = true;
        }
    };
    EventGroup._isElement = function (target) {
        return (!!target && (!!target.addEventListener || (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement)));
    };
    EventGroup.prototype.dispose = function () {
        if (!this._isDisposed) {
            this._isDisposed = true;
            this.off();
            this._parent = null;
        }
    };
    /** On the target, attach a set of events, where the events object is a name to function mapping. */
    // tslint:disable-next-line:no-any
    EventGroup.prototype.onAll = function (target, events, useCapture) {
        for (var eventName in events) {
            if (events.hasOwnProperty(eventName)) {
                this.on(target, eventName, events[eventName], useCapture);
            }
        }
    };
    /** On the target, attach an event whose handler will be called in the context of the parent
     * of this instance of EventGroup.
     */
    // tslint:disable-next-line:no-any
    EventGroup.prototype.on = function (target, eventName, callback, useCapture) {
        var _this = this;
        if (eventName.indexOf(',') > -1) {
            var events = eventName.split(/[ ,]+/);
            for (var i = 0; i < events.length; i++) {
                this.on(target, events[i], callback, useCapture);
            }
        }
        else {
            var parent_1 = this._parent;
            var eventRecord = {
                target: target,
                eventName: eventName,
                parent: parent_1,
                callback: callback,
                useCapture: useCapture || false
            };
            // Initialize and wire up the record on the target, so that it can call the callback if the event fires.
            var events = (target.__events__ = target.__events__ || {});
            events[eventName] =
                events[eventName] ||
                    {
                        count: 0
                    };
            events[eventName][this._id] = events[eventName][this._id] || [];
            events[eventName][this._id].push(eventRecord);
            events[eventName].count++;
            if (EventGroup._isElement(target)) {
                // tslint:disable-next-line:no-any
                var processElementEvent = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (_this._isDisposed) {
                        return;
                    }
                    var result;
                    try {
                        result = callback.apply(parent_1, args);
                        if (result === false && args[0]) {
                            var e = args[0];
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            }
                            e.cancelBubble = true;
                        }
                    }
                    catch (e) {
                        /* ErrorHelper.log(e); */
                    }
                    return result;
                };
                eventRecord.elementCallback = processElementEvent;
                if (target.addEventListener) {
                    /* tslint:disable:ban-native-functions */
                    target.addEventListener(eventName, processElementEvent, useCapture);
                    /* tslint:enable:ban-native-functions */
                }
                else if (target.attachEvent) {
                    // IE8
                    target.attachEvent('on' + eventName, processElementEvent);
                }
            }
            else {
                // tslint:disable-next-line:no-any
                var processObjectEvent = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (_this._isDisposed) {
                        return;
                    }
                    return callback.apply(parent_1, args);
                };
                eventRecord.objectCallback = processObjectEvent;
            }
            // Remember the record locally, so that it can be removed.
            this._eventRecords.push(eventRecord);
        }
    };
    // tslint:disable-next-line:no-any
    EventGroup.prototype.off = function (target, eventName, callback, useCapture) {
        for (var i = 0; i < this._eventRecords.length; i++) {
            var eventRecord = this._eventRecords[i];
            if ((!target || target === eventRecord.target) &&
                (!eventName || eventName === eventRecord.eventName) &&
                (!callback || callback === eventRecord.callback) &&
                (typeof useCapture !== 'boolean' || useCapture === eventRecord.useCapture)) {
                var events = eventRecord.target.__events__;
                var targetArrayLookup = events[eventRecord.eventName];
                var targetArray = targetArrayLookup ? targetArrayLookup[this._id] : null;
                // We may have already target's entries, so check for null.
                if (targetArray) {
                    if (targetArray.length === 1 || !callback) {
                        targetArrayLookup.count -= targetArray.length;
                        delete events[eventRecord.eventName][this._id];
                    }
                    else {
                        targetArrayLookup.count--;
                        targetArray.splice(targetArray.indexOf(eventRecord), 1);
                    }
                    if (!targetArrayLookup.count) {
                        delete events[eventRecord.eventName];
                    }
                }
                if (eventRecord.elementCallback) {
                    if (eventRecord.target.removeEventListener) {
                        eventRecord.target.removeEventListener(eventRecord.eventName, eventRecord.elementCallback, eventRecord.useCapture);
                    }
                    else if (eventRecord.target.detachEvent) {
                        // IE8
                        eventRecord.target.detachEvent('on' + eventRecord.eventName, eventRecord.elementCallback);
                    }
                }
                this._eventRecords.splice(i--, 1);
            }
        }
    };
    /** Trigger the given event in the context of this instance of EventGroup. */
    // tslint:disable-next-line:no-any
    EventGroup.prototype.raise = function (eventName, eventArgs, bubbleEvent) {
        return EventGroup.raise(this._parent, eventName, eventArgs, bubbleEvent);
    };
    /** Declare an event as being supported by this instance of EventGroup. */
    EventGroup.prototype.declare = function (event) {
        var declaredEvents = (this._parent.__declaredEvents = this._parent.__declaredEvents || {});
        if (typeof event === 'string') {
            declaredEvents[event] = true;
        }
        else {
            for (var i = 0; i < event.length; i++) {
                declaredEvents[event[i]] = true;
            }
        }
    };
    // tslint:disable-next-line:no-inferrable-types
    EventGroup._uniqueId = 0;
    return EventGroup;
}());



/***/ }),

/***/ "../../packages/utilities/lib/FabricPerformance.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FabricPerformance", function() { return FabricPerformance; });
var now = function () {
    return typeof performance !== 'undefined' && !!performance.now ? performance.now() : Date.now();
};
var RESET_INTERVAL = 3 * 60 * 1000; // auto reset every 3 minutes
/**
 * Performance helper class for measuring things.
 *
 * @public
 */
var FabricPerformance = /** @class */ (function () {
    function FabricPerformance() {
    }
    /**
     * Measures execution time of the given syncronous function. If the same logic is executed multiple times,
     * each individual measurement will be collected as well the overall numbers.
     * @param name - The name of this measurement
     * @param func - The logic to be measured for execution time
     */
    FabricPerformance.measure = function (name, func) {
        if (FabricPerformance._timeoutId) {
            FabricPerformance.setPeriodicReset();
        }
        var start = now();
        func();
        var end = now();
        var measurement = FabricPerformance.summary[name] || {
            totalDuration: 0,
            count: 0,
            all: []
        };
        var duration = end - start;
        measurement.totalDuration += duration;
        measurement.count++;
        measurement.all.push({
            duration: duration,
            timeStamp: end
        });
        FabricPerformance.summary[name] = measurement;
    };
    FabricPerformance.reset = function () {
        FabricPerformance.summary = {};
        clearTimeout(FabricPerformance._timeoutId);
        FabricPerformance._timeoutId = NaN;
    };
    FabricPerformance.setPeriodicReset = function () {
        FabricPerformance._timeoutId = setTimeout(function () { return FabricPerformance.reset(); }, RESET_INTERVAL);
    };
    FabricPerformance.summary = {};
    return FabricPerformance;
}());



/***/ }),

/***/ "../../packages/utilities/lib/GlobalSettings.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalSettings", function() { return GlobalSettings; });
/**
 * Storing global state in local module variables has issues when more than one copy
 * if the module gets loaded on the page (due to a bundling error or simply by consuming
 * a prebundled script.)
 *
 * This file contains helpers to deal with the getting and setting local state, and allows
 * callers to get called back when it mutates.
 */
var GLOBAL_SETTINGS_PROP_NAME = '__globalSettings__';
var CALLBACK_STATE_PROP_NAME = '__callbacks__';
// tslint:disable-next-line:no-any
var _global;
var _counter = 0;
if (typeof window !== 'undefined') {
    _global = window;
}
else if (typeof global !== 'undefined') {
    _global = global;
}
else {
    _global = {};
}
// tslint:disable-next-line:no-any
var _globalSettings = (_global[GLOBAL_SETTINGS_PROP_NAME] = _global[GLOBAL_SETTINGS_PROP_NAME] || (_a = {},
    _a[CALLBACK_STATE_PROP_NAME] = {},
    _a));
var _callbacks = _globalSettings[CALLBACK_STATE_PROP_NAME];
/**
 * Global settings helper, which stores settings in the global (window) namespace.
 * If window is not provided, it will store settings in module scope. Provides a
 * way to observe changes as well when their values change.
 *
 * @public
 */
var GlobalSettings = /** @class */ (function () {
    function GlobalSettings() {
    }
    GlobalSettings.getValue = function (key, defaultValue) {
        if (_globalSettings[key] === undefined) {
            _globalSettings[key] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        }
        return _globalSettings[key];
    };
    GlobalSettings.setValue = function (key, value) {
        var oldValue = _globalSettings[key];
        if (value !== oldValue) {
            _globalSettings[key] = value;
            var changeDescription = {
                oldValue: oldValue,
                value: value,
                key: key
            };
            for (var id in _callbacks) {
                if (_callbacks.hasOwnProperty(id)) {
                    _callbacks[id](changeDescription);
                }
            }
        }
        return value;
    };
    GlobalSettings.addChangeListener = function (cb) {
        // Note: we use generated ids on the callbacks to create a map of the callbacks, which optimizes removal.
        // (It's faster to delete a key than it is to look up the index of an object and splice an array.)
        var id = cb.__id__;
        if (!id) {
            id = cb.__id__ = String(_counter++);
        }
        _callbacks[id] = cb;
    };
    GlobalSettings.removeChangeListener = function (cb) {
        delete _callbacks[cb.__id__];
    };
    return GlobalSettings;
}());

var _a;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../../common/temp/node_modules/@rush-temp/build/node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../packages/utilities/lib/KeyCodes.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeyCodes", function() { return KeyCodes; });
/**
 * Const enum for keycodes.
 *
 * @public
 */
var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["backspace"] = 8] = "backspace";
    KeyCodes[KeyCodes["tab"] = 9] = "tab";
    KeyCodes[KeyCodes["enter"] = 13] = "enter";
    KeyCodes[KeyCodes["shift"] = 16] = "shift";
    KeyCodes[KeyCodes["ctrl"] = 17] = "ctrl";
    KeyCodes[KeyCodes["alt"] = 18] = "alt";
    KeyCodes[KeyCodes["pauseBreak"] = 19] = "pauseBreak";
    KeyCodes[KeyCodes["capslock"] = 20] = "capslock";
    KeyCodes[KeyCodes["escape"] = 27] = "escape";
    KeyCodes[KeyCodes["space"] = 32] = "space";
    KeyCodes[KeyCodes["pageUp"] = 33] = "pageUp";
    KeyCodes[KeyCodes["pageDown"] = 34] = "pageDown";
    KeyCodes[KeyCodes["end"] = 35] = "end";
    KeyCodes[KeyCodes["home"] = 36] = "home";
    KeyCodes[KeyCodes["left"] = 37] = "left";
    KeyCodes[KeyCodes["up"] = 38] = "up";
    KeyCodes[KeyCodes["right"] = 39] = "right";
    KeyCodes[KeyCodes["down"] = 40] = "down";
    KeyCodes[KeyCodes["insert"] = 45] = "insert";
    KeyCodes[KeyCodes["del"] = 46] = "del";
    KeyCodes[KeyCodes["zero"] = 48] = "zero";
    KeyCodes[KeyCodes["one"] = 49] = "one";
    KeyCodes[KeyCodes["two"] = 50] = "two";
    KeyCodes[KeyCodes["three"] = 51] = "three";
    KeyCodes[KeyCodes["four"] = 52] = "four";
    KeyCodes[KeyCodes["five"] = 53] = "five";
    KeyCodes[KeyCodes["six"] = 54] = "six";
    KeyCodes[KeyCodes["seven"] = 55] = "seven";
    KeyCodes[KeyCodes["eight"] = 56] = "eight";
    KeyCodes[KeyCodes["nine"] = 57] = "nine";
    KeyCodes[KeyCodes["a"] = 65] = "a";
    KeyCodes[KeyCodes["b"] = 66] = "b";
    KeyCodes[KeyCodes["c"] = 67] = "c";
    KeyCodes[KeyCodes["d"] = 68] = "d";
    KeyCodes[KeyCodes["e"] = 69] = "e";
    KeyCodes[KeyCodes["f"] = 70] = "f";
    KeyCodes[KeyCodes["g"] = 71] = "g";
    KeyCodes[KeyCodes["h"] = 72] = "h";
    KeyCodes[KeyCodes["i"] = 73] = "i";
    KeyCodes[KeyCodes["j"] = 74] = "j";
    KeyCodes[KeyCodes["k"] = 75] = "k";
    KeyCodes[KeyCodes["l"] = 76] = "l";
    KeyCodes[KeyCodes["m"] = 77] = "m";
    KeyCodes[KeyCodes["n"] = 78] = "n";
    KeyCodes[KeyCodes["o"] = 79] = "o";
    KeyCodes[KeyCodes["p"] = 80] = "p";
    KeyCodes[KeyCodes["q"] = 81] = "q";
    KeyCodes[KeyCodes["r"] = 82] = "r";
    KeyCodes[KeyCodes["s"] = 83] = "s";
    KeyCodes[KeyCodes["t"] = 84] = "t";
    KeyCodes[KeyCodes["u"] = 85] = "u";
    KeyCodes[KeyCodes["v"] = 86] = "v";
    KeyCodes[KeyCodes["w"] = 87] = "w";
    KeyCodes[KeyCodes["x"] = 88] = "x";
    KeyCodes[KeyCodes["y"] = 89] = "y";
    KeyCodes[KeyCodes["z"] = 90] = "z";
    KeyCodes[KeyCodes["leftWindow"] = 91] = "leftWindow";
    KeyCodes[KeyCodes["rightWindow"] = 92] = "rightWindow";
    KeyCodes[KeyCodes["select"] = 93] = "select";
    KeyCodes[KeyCodes["zero_numpad"] = 96] = "zero_numpad";
    KeyCodes[KeyCodes["one_numpad"] = 97] = "one_numpad";
    KeyCodes[KeyCodes["two_numpad"] = 98] = "two_numpad";
    KeyCodes[KeyCodes["three_numpad"] = 99] = "three_numpad";
    KeyCodes[KeyCodes["four_numpad"] = 100] = "four_numpad";
    KeyCodes[KeyCodes["five_numpad"] = 101] = "five_numpad";
    KeyCodes[KeyCodes["six_numpad"] = 102] = "six_numpad";
    KeyCodes[KeyCodes["seven_numpad"] = 103] = "seven_numpad";
    KeyCodes[KeyCodes["eight_numpad"] = 104] = "eight_numpad";
    KeyCodes[KeyCodes["nine_numpad"] = 105] = "nine_numpad";
    KeyCodes[KeyCodes["multiply"] = 106] = "multiply";
    KeyCodes[KeyCodes["add"] = 107] = "add";
    KeyCodes[KeyCodes["subtract"] = 109] = "subtract";
    KeyCodes[KeyCodes["decimalPoint"] = 110] = "decimalPoint";
    KeyCodes[KeyCodes["divide"] = 111] = "divide";
    KeyCodes[KeyCodes["f1"] = 112] = "f1";
    KeyCodes[KeyCodes["f2"] = 113] = "f2";
    KeyCodes[KeyCodes["f3"] = 114] = "f3";
    KeyCodes[KeyCodes["f4"] = 115] = "f4";
    KeyCodes[KeyCodes["f5"] = 116] = "f5";
    KeyCodes[KeyCodes["f6"] = 117] = "f6";
    KeyCodes[KeyCodes["f7"] = 118] = "f7";
    KeyCodes[KeyCodes["f8"] = 119] = "f8";
    KeyCodes[KeyCodes["f9"] = 120] = "f9";
    KeyCodes[KeyCodes["f10"] = 121] = "f10";
    KeyCodes[KeyCodes["f11"] = 122] = "f11";
    KeyCodes[KeyCodes["f12"] = 123] = "f12";
    KeyCodes[KeyCodes["numlock"] = 144] = "numlock";
    KeyCodes[KeyCodes["scrollLock"] = 145] = "scrollLock";
    KeyCodes[KeyCodes["semicolon"] = 186] = "semicolon";
    KeyCodes[KeyCodes["equalSign"] = 187] = "equalSign";
    KeyCodes[KeyCodes["comma"] = 188] = "comma";
    KeyCodes[KeyCodes["dash"] = 189] = "dash";
    KeyCodes[KeyCodes["period"] = 190] = "period";
    KeyCodes[KeyCodes["forwardSlash"] = 191] = "forwardSlash";
    KeyCodes[KeyCodes["graveAccent"] = 192] = "graveAccent";
    KeyCodes[KeyCodes["openBracket"] = 219] = "openBracket";
    KeyCodes[KeyCodes["backSlash"] = 220] = "backSlash";
    KeyCodes[KeyCodes["closeBracket"] = 221] = "closeBracket";
    KeyCodes[KeyCodes["singleQuote"] = 222] = "singleQuote";
})(KeyCodes || (KeyCodes = {}));


/***/ }),

/***/ "../../packages/utilities/lib/Rectangle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rectangle", function() { return Rectangle; });
/**
 * Rectangle helper class.
 *
 * @public
 */
var Rectangle = /** @class */ (function () {
    function Rectangle(left, right, top, bottom) {
        if (left === void 0) { left = 0; }
        if (right === void 0) { right = 0; }
        if (top === void 0) { top = 0; }
        if (bottom === void 0) { bottom = 0; }
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }
    Object.defineProperty(Rectangle.prototype, "width", {
        /**
         * Calculated automatically by subtracting the right from left
         */
        get: function () {
            return this.right - this.left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        /**
         * Calculated automatically by subtracting the bottom from top.
         */
        get: function () {
            return this.bottom - this.top;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Tests if another rect is approximately equal to this rect (within 4 decimal places.)
     */
    Rectangle.prototype.equals = function (rect) {
        // I'm fixing it to 4 decimal places because it allows enough precision and will handle cases when something should be rounded,
        // like .999999 should round to 1.
        return (parseFloat(this.top.toFixed(4)) === parseFloat(rect.top.toFixed(4)) &&
            parseFloat(this.bottom.toFixed(4)) === parseFloat(rect.bottom.toFixed(4)) &&
            parseFloat(this.left.toFixed(4)) === parseFloat(rect.left.toFixed(4)) &&
            parseFloat(this.right.toFixed(4)) === parseFloat(rect.right.toFixed(4)));
    };
    return Rectangle;
}());



/***/ }),

/***/ "../../packages/utilities/lib/aria.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeAriaAttributeValues", function() { return mergeAriaAttributeValues; });
/**
 * ARIA helper to concatenate attributes, returning undefined if all attributes
 * are undefined. (Empty strings are not a valid ARIA attribute value.)
 *
 * NOTE: This function will NOT insert whitespace between provided attributes.
 *
 * @param ariaAttributes ARIA attributes to merge
 */
function mergeAriaAttributeValues() {
    var ariaAttributes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ariaAttributes[_i] = arguments[_i];
    }
    var mergedAttribute = ariaAttributes
        .filter(function (arg) { return arg !== undefined && arg !== null; })
        .join('');
    return mergedAttribute === '' ? undefined : mergedAttribute;
}


/***/ }),

/***/ "../../packages/utilities/lib/array.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findIndex", function() { return findIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "find", function() { return find; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createArray", function() { return createArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toMatrix", function() { return toMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeIndex", function() { return removeIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "replaceElement", function() { return replaceElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addElementAtIndex", function() { return addElementAtIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arraysEqual", function() { return arraysEqual; });
/**
 * Helper to find the index of an item within an array, using a callback to
 * determine the match.
 *
 * @public
 * @param array - Array to search.
 * @param cb - Callback which returns true on matches.
 */
function findIndex(array, cb) {
    var index = -1;
    for (var i = 0; array && i < array.length; i++) {
        if (cb(array[i], i)) {
            index = i;
            break;
        }
    }
    return index;
}
/**
 * Helper to find the first item within an array that satisfies the callback.
 * @param array - Array to search
 * @param cb - Callback which returns true on matches
 */
function find(array, cb) {
    var index = findIndex(array, cb);
    if (index < 0) {
        return undefined;
    }
    return array[index];
}
/**
 * Creates an array of a given size and helper method to populate.
 *
 * @public
 * @param size - Size of array.
 * @param getItem - Callback to populate given cell index.
 */
function createArray(size, getItem) {
    var array = [];
    for (var i = 0; i < size; i++) {
        array.push(getItem(i));
    }
    return array;
}
/**
 * Convert the given array to a matrix with columnCount number
 * of columns.
 *
 * @public
 * @param items - The array to convert
 * @param columnCount - The number of columns for the resulting matrix
 * @returns {any[][]} - A matrix of items
 */
function toMatrix(items, columnCount) {
    return items.reduce(function (rows, currentValue, index) {
        if (index % columnCount === 0) {
            rows.push([currentValue]);
        }
        else {
            rows[rows.length - 1].push(currentValue);
        }
        return rows;
    }, []);
}
/**
 * Given an array, it returns a new array that does not contain the item at the given index.
 * @param array - The array to operate on
 * @param index - The index of the element to remove
 */
function removeIndex(array, index) {
    return array.filter(function (_, i) { return index !== i; });
}
/**
 * Given an array, this function returns a new array where the element at a given index has been replaced.
 * @param array - The array to operate on
 * @param newElement - The element that will be placed in the new array
 * @param index - The index of the element that should be replaced
 */
function replaceElement(array, newElement, index) {
    var copy = array.slice();
    copy[index] = newElement;
    return copy;
}
/**
 * Given an array, this function returns a new array where an element has been inserted at the given index.
 * @param array - The array to operate on
 * @param index - The index where an element should be inserted
 * @param itemToAdd - The element to insert
 */
function addElementAtIndex(array, index, itemToAdd) {
    var copy = array.slice();
    copy.splice(index, 0, itemToAdd);
    return copy;
}
/**
 * Given an array where each element is of type T or T[], flatten it into an array of T
 * @param array - The array where each element can optionally also be an array
 */
function flatten(array) {
    var result = [];
    array.forEach(function (item) { return (result = result.concat(item)); });
    return result;
}
/**
 * Returns a boolean indicating if the two given arrays are equal in length and values.
 *
 * @param array1 - First array to compare
 * @param array2 - Second array to compare
 * @returns {boolean} True if the arrays are the same length and have the same values in the same positions, false otherwise.
 */
function arraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}


/***/ }),

/***/ "../../packages/utilities/lib/assertNever.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assertNever", function() { return assertNever; });
/**
 * AssertNever is a utility function that can be used for exhaustiveness checks in switch statements.
 *
 * @public
 */
function assertNever(x) {
    throw new Error('Unexpected object: ' + x);
}


/***/ }),

/***/ "../../packages/utilities/lib/autobind.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autobind", function() { return autobind; });
/**
 * Autobind is a utility for binding methods in a class. This simplifies tagging methods as being "bound" to the this pointer
 * so that they can be used in scenarios that simply require a function callback.
 * @deprecated This has been deprecated in favor of using arrow function properties
 */
function autobind(
// tslint:disable-next-line:no-any
target, key, descriptor) {
    var fn = descriptor.value;
    var defining = false;
    return {
        configurable: true,
        get: function () {
            if (defining || (fn && this === fn.prototype) || this.hasOwnProperty(key)) {
                return fn;
            }
            // Bind method only once, and update the property to return the bound value from now on
            var fnBound = fn && fn.bind(this);
            defining = true;
            Object.defineProperty(this, key, {
                configurable: true,
                writable: true,
                enumerable: true,
                value: fnBound
            });
            defining = false;
            return fnBound;
        },
        // tslint:disable-next-line:no-any
        set: function (newValue) {
            Object.defineProperty(this, key, {
                configurable: true,
                writable: true,
                enumerable: true,
                value: newValue
            });
        }
    };
}


/***/ }),

/***/ "../../packages/utilities/lib/classNamesFunction.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classNamesFunction", function() { return classNamesFunction; });
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");

/**
 * Creates a getClassNames function which calls getStyles given the props, and injects them
 * into mergeStyleSets.
 */
function classNamesFunction() {
    // TODO: memoize.
    var getClassNames = function (styleFunctionOrObject, styleProps) {
        if (styleProps === void 0) { styleProps = {}; }
        // styleSet might be undefined if styleFunctionOrObject is undefined, but getStyles should never
        // ordinarily be undefined (it would hardly make any sense).
        // However, because we usually use `props.styles` as the argument to an invocation of this method, and
        // `props.styles` itself is defined as optional, this avoids the need to use `!` at all invocation points.
        if (styleFunctionOrObject === undefined) {
            return {};
        }
        var styleSet = styleFunctionOrObject &&
            (typeof styleFunctionOrObject === 'function' ? styleFunctionOrObject(styleProps) : styleFunctionOrObject);
        return Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["mergeStyleSets"])(styleSet);
    };
    return getClassNames;
}


/***/ }),

/***/ "../../packages/utilities/lib/createRef.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return createRef; });
/**
 * @deprecated Use React.createRef.
 * May be removed in 6 months (Jan '19).
 */
function createRef() {
    var refObject = (function (element) {
        refObject.current = element;
    });
    // This getter is here to support the deprecated value prop on the refObject.
    Object.defineProperty(refObject, 'value', {
        get: function () {
            return refObject.current;
        }
    });
    refObject.current = null;
    return refObject;
}


/***/ }),

/***/ "../../packages/utilities/lib/css.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "css", function() { return css; });
/**
 * Concatination helper, which can merge class names together. Skips over falsey values.
 *
 * @public
 */
function css() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var classes = [];
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var arg = args_1[_a];
        if (arg) {
            if (typeof arg === 'string') {
                classes.push(arg);
            }
            else if (arg.hasOwnProperty('toString') && typeof arg.toString === 'function') {
                classes.push(arg.toString());
            }
            else {
                // tslint:disable-next-line:no-any
                for (var key in arg) {
                    // tslint:disable-next-line:no-any
                    if (arg[key]) {
                        classes.push(key);
                    }
                }
            }
        }
    }
    return classes.join(' ');
}


/***/ }),

/***/ "../../packages/utilities/lib/customizable.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "customizable", function() { return customizable; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Customizations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/utilities/lib/Customizations.js");
/* harmony import */ var _hoistStatics__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/utilities/lib/hoistStatics.js");
/* harmony import */ var _Customizer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/utilities/lib/Customizer.js");
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../packages/merge-styles/lib/index.js");






function customizable(scope, fields, concatStyles
// tslint:disable-next-line:no-any
) {
    // tslint:disable-next-line:no-shadowed-variable
    return function customizableFactory(
    // tslint:disable-next-line:no-any
    ComposedComponent
    // tslint:disable-next-line:no-any
    ) {
        var resultClass = (_a = /** @class */ (function (_super) {
                tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ComponentWithInjectedProps, _super);
                // tslint:disable-next-line:no-any
                function ComponentWithInjectedProps(props) {
                    var _this = _super.call(this, props) || this;
                    _this._onSettingChanged = _this._onSettingChanged.bind(_this);
                    return _this;
                }
                ComponentWithInjectedProps.prototype.componentDidMount = function () {
                    _Customizations__WEBPACK_IMPORTED_MODULE_2__["Customizations"].observe(this._onSettingChanged);
                };
                ComponentWithInjectedProps.prototype.componentWillUnmount = function () {
                    _Customizations__WEBPACK_IMPORTED_MODULE_2__["Customizations"].unobserve(this._onSettingChanged);
                };
                ComponentWithInjectedProps.prototype.render = function () {
                    var _this = this;
                    return (react__WEBPACK_IMPORTED_MODULE_1__["createElement"](_Customizer__WEBPACK_IMPORTED_MODULE_4__["CustomizerContext"].Consumer, null, function (context) {
                        var defaultProps = _Customizations__WEBPACK_IMPORTED_MODULE_2__["Customizations"].getSettings(fields, scope, context.customizations);
                        // tslint:disable-next-line:no-any
                        var componentProps = _this.props;
                        if (concatStyles) {
                            var mergedStyles = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_5__["concatStyleSets"])(defaultProps.styles, componentProps.styles);
                            return react__WEBPACK_IMPORTED_MODULE_1__["createElement"](ComposedComponent, tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, defaultProps, componentProps, { styles: mergedStyles }));
                        }
                        return react__WEBPACK_IMPORTED_MODULE_1__["createElement"](ComposedComponent, tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, defaultProps, componentProps));
                    }));
                };
                ComponentWithInjectedProps.prototype._onSettingChanged = function () {
                    this.forceUpdate();
                };
                return ComponentWithInjectedProps;
            }(react__WEBPACK_IMPORTED_MODULE_1__["Component"])),
            _a.displayName = 'Customized' + scope,
            _a);
        return Object(_hoistStatics__WEBPACK_IMPORTED_MODULE_3__["hoistStatics"])(ComposedComponent, resultClass);
        var _a;
    };
}


/***/ }),

/***/ "../../packages/utilities/lib/dom.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setVirtualParent", function() { return setVirtualParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVirtualParent", function() { return getVirtualParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getParent", function() { return getParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getChildren", function() { return getChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elementContains", function() { return elementContains; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSSR", function() { return setSSR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWindow", function() { return getWindow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDocument", function() { return getDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRect", function() { return getRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findElementRecursive", function() { return findElementRecursive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elementContainsAttribute", function() { return elementContainsAttribute; });
/**
 * Sets the virtual parent of an element.
 * Pass `undefined` as the `parent` to clear the virtual parent.
 *
 * @public
 */
function setVirtualParent(child, parent) {
    var virtualChild = child;
    var virtualParent = parent;
    if (!virtualChild._virtual) {
        virtualChild._virtual = {
            children: []
        };
    }
    var oldParent = virtualChild._virtual.parent;
    if (oldParent && oldParent !== parent) {
        // Remove the child from its old parent.
        var index = oldParent._virtual.children.indexOf(virtualChild);
        if (index > -1) {
            oldParent._virtual.children.splice(index, 1);
        }
    }
    virtualChild._virtual.parent = virtualParent || undefined;
    if (virtualParent) {
        if (!virtualParent._virtual) {
            virtualParent._virtual = {
                children: []
            };
        }
        virtualParent._virtual.children.push(virtualChild);
    }
}
/**
 * Gets the virtual parent given the child element, if it exists.
 *
 * @public
 */
function getVirtualParent(child) {
    var parent;
    if (child && isVirtualElement(child)) {
        parent = child._virtual.parent;
    }
    return parent;
}
/**
 * Gets the element which is the parent of a given element.
 * If `allowVirtuaParents` is `true`, this method prefers the virtual parent over
 * real DOM parent when present.
 *
 * @public
 */
function getParent(child, allowVirtualParents) {
    if (allowVirtualParents === void 0) { allowVirtualParents = true; }
    return (child &&
        ((allowVirtualParents && getVirtualParent(child)) || (child.parentNode && child.parentNode)));
}
/**
 * Gets the elements which are child elements of the given element.
 * If `allowVirtualChildren` is `true`, this method enumerates virtual child elements
 * after the original children.
 * @param parent
 * @param allowVirtualChildren
 */
function getChildren(parent, allowVirtualChildren) {
    if (allowVirtualChildren === void 0) { allowVirtualChildren = true; }
    var children = [];
    if (parent) {
        for (var i = 0; i < parent.children.length; i++) {
            children.push(parent.children.item(i));
        }
        if (allowVirtualChildren && isVirtualElement(parent)) {
            children.push.apply(children, parent._virtual.children);
        }
    }
    return children;
}
/**
 * Determines whether or not a parent element contains a given child element.
 * If `allowVirtualParents` is true, this method may return `true` if the child
 * has the parent in its virtual element hierarchy.
 *
 * @public
 */
function elementContains(parent, child, allowVirtualParents) {
    if (allowVirtualParents === void 0) { allowVirtualParents = true; }
    var isContained = false;
    if (parent && child) {
        if (allowVirtualParents) {
            isContained = false;
            while (child) {
                var nextParent = getParent(child);
                if (nextParent === parent) {
                    isContained = true;
                    break;
                }
                child = nextParent;
            }
        }
        else if (parent.contains) {
            isContained = parent.contains(child);
        }
    }
    return isContained;
}
var _isSSR = false;
/**
 * Helper to set ssr mode to simulate no window object returned from getWindow helper.
 *
 * @public
 */
function setSSR(isEnabled) {
    _isSSR = isEnabled;
}
/**
 * Helper to get the window object.
 *
 * @public
 */
function getWindow(rootElement) {
    if (_isSSR || typeof window === 'undefined') {
        return undefined;
    }
    else {
        return rootElement && rootElement.ownerDocument && rootElement.ownerDocument.defaultView
            ? rootElement.ownerDocument.defaultView
            : window;
    }
}
/**
 * Helper to get the document object.
 *
 * @public
 */
function getDocument(rootElement) {
    if (_isSSR || typeof document === 'undefined') {
        return undefined;
    }
    else {
        return rootElement && rootElement.ownerDocument ? rootElement.ownerDocument : document;
    }
}
/**
 * Helper to get bounding client rect, works with window.
 *
 * @public
 */
function getRect(element) {
    var rect;
    if (element) {
        if (element === window) {
            rect = {
                left: 0,
                top: 0,
                width: window.innerWidth,
                height: window.innerHeight,
                right: window.innerWidth,
                bottom: window.innerHeight
            };
        }
        else if (element.getBoundingClientRect) {
            rect = element.getBoundingClientRect();
        }
    }
    return rect;
}
/**
 * Finds the first parent element where the matchFunction returns true
 * @param element element to start searching at
 * @param matchFunction the function that determines if the element is a match
 * @returns the matched element or null no match was found
 */
function findElementRecursive(element, matchFunction) {
    if (!element || element === document.body) {
        return null;
    }
    return matchFunction(element) ? element : findElementRecursive(getParent(element), matchFunction);
}
/**
 * Determines if an element, or any of its ancestors, contian the given attribute
 * @param element - element to start searching at
 * @param attribute - the attribute to search for
 * @returns the value of the first instance found
 */
function elementContainsAttribute(element, attribute) {
    var elementMatch = findElementRecursive(element, function (testElement) { return testElement.hasAttribute(attribute); });
    return elementMatch && elementMatch.getAttribute(attribute);
}
/**
 * Determines whether or not an element has the virtual hierarchy extension.
 *
 * @public
 */
function isVirtualElement(element) {
    return element && !!element._virtual;
}


/***/ }),

/***/ "../../packages/utilities/lib/focus.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFirstFocusable", function() { return getFirstFocusable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLastFocusable", function() { return getLastFocusable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFirstTabbable", function() { return getFirstTabbable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLastTabbable", function() { return getLastTabbable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focusFirstChild", function() { return focusFirstChild; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPreviousElement", function() { return getPreviousElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNextElement", function() { return getNextElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isElementVisible", function() { return isElementVisible; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isElementTabbable", function() { return isElementTabbable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isElementFocusZone", function() { return isElementFocusZone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isElementFocusSubZone", function() { return isElementFocusSubZone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doesElementContainFocus", function() { return doesElementContainFocus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shouldWrapFocus", function() { return shouldWrapFocus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focusAsync", function() { return focusAsync; });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/dom.js");
/* tslint:disable:no-string-literal */

var IS_FOCUSABLE_ATTRIBUTE = 'data-is-focusable';
var IS_VISIBLE_ATTRIBUTE = 'data-is-visible';
var FOCUSZONE_ID_ATTRIBUTE = 'data-focuszone-id';
var FOCUSZONE_SUB_ATTRIBUTE = 'data-is-sub-focuszone';
/**
 * Gets the first focusable element.
 *
 * @public
 */
function getFirstFocusable(rootElement, currentElement, includeElementsInFocusZones) {
    return getNextElement(rootElement, currentElement, true /*checkNode*/, false /*suppressParentTraversal*/, false /*suppressChildTraversal*/, includeElementsInFocusZones);
}
/**
 * Gets the last focusable element.
 *
 * @public
 */
function getLastFocusable(rootElement, currentElement, includeElementsInFocusZones) {
    return getPreviousElement(rootElement, currentElement, true /*checkNode*/, false /*suppressParentTraversal*/, true /*traverseChildren*/, includeElementsInFocusZones);
}
/**
 * Gets the first tabbable element.
 * The difference between focusable and tabbable is that tabbable elements are focusable elements that also have tabIndex != -1.
 * @param rootElement The parent element to search beneath.
 * @param currentElement The descendant of rootElement to start the search at.  This element is the first one checked,
 * and iteration continues forward.  Typical use passes rootElement.firstChild.
 * @param includeElementsInFocusZones true if traversal should go into FocusZone descendants.
 * @public
 */
function getFirstTabbable(rootElement, currentElement, includeElementsInFocusZones) {
    return getNextElement(rootElement, currentElement, true /*checkNode*/, false /*suppressParentTraversal*/, false /*suppressChildTraversal*/, includeElementsInFocusZones, false /*allowFocusRoot*/, true /*tabbable*/);
}
/**
 * Gets the last tabbable element.
 * The difference between focusable and tabbable is that tabbable elements are focusable elements that also have tabIndex != -1.
 * @param rootElement The parent element to search beneath.
 * @param currentElement The descendant of rootElement to start the search at.  This element is the first one checked,
 * and iteration continues in reverse.  Typical use passes rootElement.lastChild.
 * @param includeElementsInFocusZones true if traversal should go into FocusZone descendants.
 * @public
 */
function getLastTabbable(rootElement, currentElement, includeElementsInFocusZones) {
    return getPreviousElement(rootElement, currentElement, true /*checkNode*/, false /*suppressParentTraversal*/, true /*traverseChildren*/, includeElementsInFocusZones, false /*allowFocusRoot*/, true /*tabbable*/);
}
/**
 * Attempts to focus the first focusable element that is a child or child's child of the rootElement.
 *
 * @public
 * @param rootElement - Element to start the search for a focusable child.
 * @returns True if focus was set, false if it was not.
 */
function focusFirstChild(rootElement) {
    var element = getNextElement(rootElement, rootElement, true, false, false, true);
    if (element) {
        focusAsync(element);
        return true;
    }
    return false;
}
/**
 * Traverse to find the previous element.
 * If tabbable is true, the element must have tabIndex != -1.
 *
 * @public
 */
function getPreviousElement(rootElement, currentElement, checkNode, suppressParentTraversal, traverseChildren, includeElementsInFocusZones, allowFocusRoot, tabbable) {
    if (!currentElement || (!allowFocusRoot && currentElement === rootElement)) {
        return null;
    }
    var isCurrentElementVisible = isElementVisible(currentElement);
    // Check its children.
    if (traverseChildren &&
        isCurrentElementVisible &&
        (includeElementsInFocusZones || !(isElementFocusZone(currentElement) || isElementFocusSubZone(currentElement)))) {
        var childMatch = getPreviousElement(rootElement, currentElement.lastElementChild, true, true, true, includeElementsInFocusZones, allowFocusRoot, tabbable);
        if (childMatch) {
            if ((tabbable && isElementTabbable(childMatch, true)) || !tabbable) {
                return childMatch;
            }
            var childMatchSiblingMatch = getPreviousElement(rootElement, childMatch.previousElementSibling, true, true, true, includeElementsInFocusZones, allowFocusRoot, tabbable);
            if (childMatchSiblingMatch) {
                return childMatchSiblingMatch;
            }
            var childMatchParent = childMatch.parentElement;
            // At this point if we have not found any potential matches
            // start looking at the rest of the subtree under the currentParent.
            // NOTE: We do not want to recurse here because doing so could
            // cause elements to get skipped.
            while (childMatchParent && childMatchParent !== currentElement) {
                var childMatchParentMatch = getPreviousElement(rootElement, childMatchParent.previousElementSibling, true, true, true, includeElementsInFocusZones, allowFocusRoot, tabbable);
                if (childMatchParentMatch) {
                    return childMatchParentMatch;
                }
                childMatchParent = childMatchParent.parentElement;
            }
        }
    }
    // Check the current node, if it's not the first traversal.
    if (checkNode && isCurrentElementVisible && isElementTabbable(currentElement)) {
        return currentElement;
    }
    // Check its previous sibling.
    var siblingMatch = getPreviousElement(rootElement, currentElement.previousElementSibling, true, true, true, includeElementsInFocusZones, allowFocusRoot, tabbable);
    if (siblingMatch) {
        return siblingMatch;
    }
    // Check its parent.
    if (!suppressParentTraversal) {
        return getPreviousElement(rootElement, currentElement.parentElement, true, false, false, includeElementsInFocusZones, allowFocusRoot, tabbable);
    }
    return null;
}
/**
 * Traverse to find the next focusable element.
 * If tabbable is true, the element must have tabIndex != -1.
 *
 * @public
 */
function getNextElement(rootElement, currentElement, checkNode, suppressParentTraversal, suppressChildTraversal, includeElementsInFocusZones, allowFocusRoot, tabbable) {
    if (!currentElement || (currentElement === rootElement && suppressChildTraversal && !allowFocusRoot)) {
        return null;
    }
    var isCurrentElementVisible = isElementVisible(currentElement);
    // Check the current node, if it's not the first traversal.
    if (checkNode && isCurrentElementVisible && isElementTabbable(currentElement, tabbable)) {
        return currentElement;
    }
    // Check its children.
    if (!suppressChildTraversal &&
        isCurrentElementVisible &&
        (includeElementsInFocusZones || !(isElementFocusZone(currentElement) || isElementFocusSubZone(currentElement)))) {
        var childMatch = getNextElement(rootElement, currentElement.firstElementChild, true, true, false, includeElementsInFocusZones, allowFocusRoot, tabbable);
        if (childMatch) {
            return childMatch;
        }
    }
    if (currentElement === rootElement) {
        return null;
    }
    // Check its sibling.
    var siblingMatch = getNextElement(rootElement, currentElement.nextElementSibling, true, true, false, includeElementsInFocusZones, allowFocusRoot, tabbable);
    if (siblingMatch) {
        return siblingMatch;
    }
    if (!suppressParentTraversal) {
        return getNextElement(rootElement, currentElement.parentElement, false, false, true, includeElementsInFocusZones, allowFocusRoot, tabbable);
    }
    return null;
}
/**
 * Determines if an element is visible.
 *
 * @public
 */
function isElementVisible(element) {
    // If the element is not valid, return false.
    if (!element || !element.getAttribute) {
        return false;
    }
    var visibilityAttribute = element.getAttribute(IS_VISIBLE_ATTRIBUTE);
    // If the element is explicitly marked with the visibility attribute, return that value as boolean.
    if (visibilityAttribute !== null && visibilityAttribute !== undefined) {
        return visibilityAttribute === 'true';
    }
    // Fallback to other methods of determining actual visibility.
    return (element.offsetHeight !== 0 ||
        element.offsetParent !== null ||
        // tslint:disable-next-line:no-any
        element.isVisible === true); // used as a workaround for testing.
}
/**
 * Determines if an element can receive focus programmatically or via a mouse click.
 * If checkTabIndex is true, additionally checks to ensure the element can be focused with the tab key, meaning tabIndex != -1.
 *
 * @public
 */
function isElementTabbable(element, checkTabIndex) {
    // If this element is null or is disabled, it is not considered tabbable.
    if (!element || element.disabled) {
        return false;
    }
    var tabIndex = 0;
    var tabIndexAttributeValue = null;
    if (element && element.getAttribute) {
        tabIndexAttributeValue = element.getAttribute('tabIndex');
        if (tabIndexAttributeValue) {
            tabIndex = parseInt(tabIndexAttributeValue, 10);
        }
    }
    var isFocusableAttribute = element.getAttribute ? element.getAttribute(IS_FOCUSABLE_ATTRIBUTE) : null;
    var isTabIndexSet = tabIndexAttributeValue !== null && tabIndex >= 0;
    var result = !!element &&
        isFocusableAttribute !== 'false' &&
        (element.tagName === 'A' ||
            element.tagName === 'BUTTON' ||
            element.tagName === 'INPUT' ||
            element.tagName === 'TEXTAREA' ||
            isFocusableAttribute === 'true' ||
            isTabIndexSet ||
            (element.getAttribute && element.getAttribute('role') === 'button'));
    return checkTabIndex ? tabIndex !== -1 && result : result;
}
/**
 * Determines if a given element is a focus zone.
 *
 * @public
 */
function isElementFocusZone(element) {
    return !!(element && element.getAttribute && !!element.getAttribute(FOCUSZONE_ID_ATTRIBUTE));
}
/**
 * Determines if a given element is a focus sub zone.
 *
 * @public
 */
function isElementFocusSubZone(element) {
    return !!(element && element.getAttribute && element.getAttribute(FOCUSZONE_SUB_ATTRIBUTE) === 'true');
}
/**
 * Determines if an element, or any of its children, contain focus.
 *
 * @public
 */
function doesElementContainFocus(element) {
    var document = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getDocument"])(element);
    var currentActiveElement = document && document.activeElement;
    if (currentActiveElement && Object(_dom__WEBPACK_IMPORTED_MODULE_0__["elementContains"])(element, currentActiveElement)) {
        return true;
    }
    return false;
}
/**
 * Determines if an, or any of its ancestors, sepcificies that it doesn't want focus to wrap
 * @param element - element to start searching from
 * @param noWrapDataAttribute - the no wrap data attribute to match (either)
 * @returns true if focus should wrap, false otherwise
 */
function shouldWrapFocus(element, noWrapDataAttribute) {
    return Object(_dom__WEBPACK_IMPORTED_MODULE_0__["elementContainsAttribute"])(element, noWrapDataAttribute) === 'true' ? false : true;
}
var targetToFocusOnNextRepaint = undefined;
/**
 * Sets focus to an element asynchronously. The focus will be set at the next browser repaint,
 * meaning it won't cause any extra recalculations. If more than one focusAsync is called during one frame,
 * only the latest called focusAsync element will actually be focused
 * @param element The element to focus
 */
function focusAsync(element) {
    if (element) {
        // An element was already queued to be focused, so replace that one with the new element
        if (targetToFocusOnNextRepaint) {
            targetToFocusOnNextRepaint = element;
            return;
        }
        targetToFocusOnNextRepaint = element;
        var win = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getWindow"])(element);
        if (win) {
            // element.focus() is a no-op if the element is no longer in the DOM, meaning this is always safe
            win.requestAnimationFrame(function () {
                targetToFocusOnNextRepaint && targetToFocusOnNextRepaint.focus();
                // We are done focusing for this frame, so reset the queued focus element
                targetToFocusOnNextRepaint = undefined;
            });
        }
    }
}


/***/ }),

/***/ "../../packages/utilities/lib/hoist.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hoistMethods", function() { return hoistMethods; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unhoistMethods", function() { return unhoistMethods; });
var REACT_LIFECYCLE_EXCLUSIONS = [
    'setState',
    'render',
    'componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
];
/**
 * Allows you to hoist methods, except those in an exclusion set from a source object into a destination object.
 *
 * @public
 * @param destination - The instance of the object to hoist the methods onto.
 * @param source - The instance of the object where the methods are hoisted from.
 * @param exclusions - (Optional) What methods to exclude from being hoisted.
 * @returns An array of names of methods that were hoisted.
 */
function hoistMethods(
// tslint:disable-next-line:no-any
destination, 
// tslint:disable-next-line:no-any
source, exclusions) {
    if (exclusions === void 0) { exclusions = REACT_LIFECYCLE_EXCLUSIONS; }
    var hoisted = [];
    var _loop_1 = function (methodName) {
        if (typeof source[methodName] === 'function' &&
            destination[methodName] === undefined &&
            (!exclusions || exclusions.indexOf(methodName) === -1)) {
            hoisted.push(methodName);
            /* tslint:disable:no-function-expression */
            destination[methodName] = function () {
                source[methodName].apply(source, arguments);
            };
            /* tslint:enable */
        }
    };
    for (var methodName in source) {
        _loop_1(methodName);
    }
    return hoisted;
}
/**
 * Provides a method for convenience to unhoist hoisted methods.
 *
 * @public
 * @param source - The source object upon which methods were hoisted.
 * @param methodNames - An array of method names to unhoist.
 */
// tslint:disable-next-line:no-any
function unhoistMethods(source, methodNames) {
    methodNames.forEach(function (methodName) { return delete source[methodName]; });
}


/***/ }),

/***/ "../../packages/utilities/lib/hoistStatics.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hoistStatics", function() { return hoistStatics; });
/**
 * Allows you to hoist static functions in components.
 * Created for the purpose of fixing broken static functions in classes
 * that utilize decorators.
 *
 * @public
 * @param source - The object where the methods are hoisted from.
 * @param dest - The object to hoist the methods onto.
 * @returns The dest object with methods added
 */
function hoistStatics(source, dest) {
    for (var name_1 in source) {
        if (source.hasOwnProperty(name_1)) {
            // tslint:disable-next-line:no-any
            dest[name_1] = source[name_1];
        }
    }
    return dest;
}


/***/ }),

/***/ "../../packages/utilities/lib/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/Async.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Async", function() { return _Async__WEBPACK_IMPORTED_MODULE_0__["Async"]; });

/* harmony import */ var _AutoScroll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/AutoScroll.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AutoScroll", function() { return _AutoScroll__WEBPACK_IMPORTED_MODULE_1__["AutoScroll"]; });

/* harmony import */ var _BaseComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/utilities/lib/BaseComponent.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseComponent", function() { return _BaseComponent__WEBPACK_IMPORTED_MODULE_2__["BaseComponent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "nullRender", function() { return _BaseComponent__WEBPACK_IMPORTED_MODULE_2__["nullRender"]; });

/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/utilities/lib/Context.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "provideContext", function() { return _Context__WEBPACK_IMPORTED_MODULE_3__["provideContext"]; });

/* harmony import */ var _Customizations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/utilities/lib/Customizations.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Customizations", function() { return _Customizations__WEBPACK_IMPORTED_MODULE_4__["Customizations"]; });

/* harmony import */ var _Customizer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../packages/utilities/lib/Customizer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CustomizerContext", function() { return _Customizer__WEBPACK_IMPORTED_MODULE_5__["CustomizerContext"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Customizer", function() { return _Customizer__WEBPACK_IMPORTED_MODULE_5__["Customizer"]; });

/* harmony import */ var _DelayedRender__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../packages/utilities/lib/DelayedRender.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DelayedRender", function() { return _DelayedRender__WEBPACK_IMPORTED_MODULE_6__["DelayedRender"]; });

/* harmony import */ var _EventGroup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../../packages/utilities/lib/EventGroup.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EventGroup", function() { return _EventGroup__WEBPACK_IMPORTED_MODULE_7__["EventGroup"]; });

/* harmony import */ var _FabricPerformance__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../../packages/utilities/lib/FabricPerformance.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FabricPerformance", function() { return _FabricPerformance__WEBPACK_IMPORTED_MODULE_8__["FabricPerformance"]; });

/* harmony import */ var _GlobalSettings__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../../packages/utilities/lib/GlobalSettings.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GlobalSettings", function() { return _GlobalSettings__WEBPACK_IMPORTED_MODULE_9__["GlobalSettings"]; });

/* harmony import */ var _KeyCodes__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../../packages/utilities/lib/KeyCodes.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KeyCodes", function() { return _KeyCodes__WEBPACK_IMPORTED_MODULE_10__["KeyCodes"]; });

/* harmony import */ var _Rectangle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("../../packages/utilities/lib/Rectangle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Rectangle", function() { return _Rectangle__WEBPACK_IMPORTED_MODULE_11__["Rectangle"]; });

/* harmony import */ var _aria__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("../../packages/utilities/lib/aria.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeAriaAttributeValues", function() { return _aria__WEBPACK_IMPORTED_MODULE_12__["mergeAriaAttributeValues"]; });

/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("../../packages/utilities/lib/array.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "findIndex", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["findIndex"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "find", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["find"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createArray", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["createArray"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toMatrix", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["toMatrix"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "removeIndex", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["removeIndex"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "replaceElement", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["replaceElement"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addElementAtIndex", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["addElementAtIndex"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["flatten"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "arraysEqual", function() { return _array__WEBPACK_IMPORTED_MODULE_13__["arraysEqual"]; });

/* harmony import */ var _assertNever__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("../../packages/utilities/lib/assertNever.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "assertNever", function() { return _assertNever__WEBPACK_IMPORTED_MODULE_14__["assertNever"]; });

/* harmony import */ var _autobind__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("../../packages/utilities/lib/autobind.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "autobind", function() { return _autobind__WEBPACK_IMPORTED_MODULE_15__["autobind"]; });

/* harmony import */ var _classNamesFunction__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("../../packages/utilities/lib/classNamesFunction.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "classNamesFunction", function() { return _classNamesFunction__WEBPACK_IMPORTED_MODULE_16__["classNamesFunction"]; });

/* harmony import */ var _createRef__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("../../packages/utilities/lib/createRef.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return _createRef__WEBPACK_IMPORTED_MODULE_17__["createRef"]; });

/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("../../packages/utilities/lib/css.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "css", function() { return _css__WEBPACK_IMPORTED_MODULE_18__["css"]; });

/* harmony import */ var _customizable__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("../../packages/utilities/lib/customizable.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "customizable", function() { return _customizable__WEBPACK_IMPORTED_MODULE_19__["customizable"]; });

/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("../../packages/utilities/lib/dom.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setVirtualParent", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["setVirtualParent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getVirtualParent", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["getVirtualParent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getParent", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["getParent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getChildren", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["getChildren"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "elementContains", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["elementContains"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setSSR", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["setSSR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getWindow", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["getWindow"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getDocument", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["getDocument"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRect", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["getRect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "findElementRecursive", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["findElementRecursive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "elementContainsAttribute", function() { return _dom__WEBPACK_IMPORTED_MODULE_20__["elementContainsAttribute"]; });

/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("../../packages/utilities/lib/focus.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFirstFocusable", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["getFirstFocusable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLastFocusable", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["getLastFocusable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFirstTabbable", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["getFirstTabbable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLastTabbable", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["getLastTabbable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "focusFirstChild", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["focusFirstChild"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getPreviousElement", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["getPreviousElement"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getNextElement", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["getNextElement"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isElementVisible", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["isElementVisible"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isElementTabbable", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["isElementTabbable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isElementFocusZone", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["isElementFocusZone"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isElementFocusSubZone", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["isElementFocusSubZone"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doesElementContainFocus", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["doesElementContainFocus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shouldWrapFocus", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["shouldWrapFocus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "focusAsync", function() { return _focus__WEBPACK_IMPORTED_MODULE_21__["focusAsync"]; });

/* harmony import */ var _hoist__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("../../packages/utilities/lib/hoist.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hoistMethods", function() { return _hoist__WEBPACK_IMPORTED_MODULE_22__["hoistMethods"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "unhoistMethods", function() { return _hoist__WEBPACK_IMPORTED_MODULE_22__["unhoistMethods"]; });

/* harmony import */ var _hoistStatics__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("../../packages/utilities/lib/hoistStatics.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hoistStatics", function() { return _hoistStatics__WEBPACK_IMPORTED_MODULE_23__["hoistStatics"]; });

/* harmony import */ var _initializeFocusRects__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("../../packages/utilities/lib/initializeFocusRects.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IsFocusVisibleClassName", function() { return _initializeFocusRects__WEBPACK_IMPORTED_MODULE_24__["IsFocusVisibleClassName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initializeFocusRects", function() { return _initializeFocusRects__WEBPACK_IMPORTED_MODULE_24__["initializeFocusRects"]; });

/* harmony import */ var _initials__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("../../packages/utilities/lib/initials.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getInitials", function() { return _initials__WEBPACK_IMPORTED_MODULE_25__["getInitials"]; });

/* harmony import */ var _keyboard__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("../../packages/utilities/lib/keyboard.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isDirectionalKeyCode", function() { return _keyboard__WEBPACK_IMPORTED_MODULE_26__["isDirectionalKeyCode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addDirectionalKeyCode", function() { return _keyboard__WEBPACK_IMPORTED_MODULE_26__["addDirectionalKeyCode"]; });

/* harmony import */ var _language__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("../../packages/utilities/lib/language.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLanguage", function() { return _language__WEBPACK_IMPORTED_MODULE_27__["getLanguage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setLanguage", function() { return _language__WEBPACK_IMPORTED_MODULE_27__["setLanguage"]; });

/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("../../packages/utilities/lib/math.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getDistanceBetweenPoints", function() { return _math__WEBPACK_IMPORTED_MODULE_28__["getDistanceBetweenPoints"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fitContentToBounds", function() { return _math__WEBPACK_IMPORTED_MODULE_28__["fitContentToBounds"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "calculatePrecision", function() { return _math__WEBPACK_IMPORTED_MODULE_28__["calculatePrecision"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "precisionRound", function() { return _math__WEBPACK_IMPORTED_MODULE_28__["precisionRound"]; });

/* harmony import */ var _memoize__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__("../../packages/utilities/lib/memoize.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setMemoizeWeakMap", function() { return _memoize__WEBPACK_IMPORTED_MODULE_29__["setMemoizeWeakMap"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resetMemoizations", function() { return _memoize__WEBPACK_IMPORTED_MODULE_29__["resetMemoizations"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "memoize", function() { return _memoize__WEBPACK_IMPORTED_MODULE_29__["memoize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "memoizeFunction", function() { return _memoize__WEBPACK_IMPORTED_MODULE_29__["memoizeFunction"]; });

/* harmony import */ var _merge__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__("../../packages/utilities/lib/merge.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return _merge__WEBPACK_IMPORTED_MODULE_30__["merge"]; });

/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__("../../packages/utilities/lib/object.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shallowCompare", function() { return _object__WEBPACK_IMPORTED_MODULE_31__["shallowCompare"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return _object__WEBPACK_IMPORTED_MODULE_31__["assign"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "filteredAssign", function() { return _object__WEBPACK_IMPORTED_MODULE_31__["filteredAssign"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getId", function() { return _object__WEBPACK_IMPORTED_MODULE_31__["getId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resetIds", function() { return _object__WEBPACK_IMPORTED_MODULE_31__["resetIds"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mapEnumByName", function() { return _object__WEBPACK_IMPORTED_MODULE_31__["mapEnumByName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "values", function() { return _object__WEBPACK_IMPORTED_MODULE_31__["values"]; });

/* harmony import */ var _overflow__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__("../../packages/utilities/lib/overflow.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hasHorizontalOverflow", function() { return _overflow__WEBPACK_IMPORTED_MODULE_32__["hasHorizontalOverflow"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hasVerticalOverflow", function() { return _overflow__WEBPACK_IMPORTED_MODULE_32__["hasVerticalOverflow"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hasOverflow", function() { return _overflow__WEBPACK_IMPORTED_MODULE_32__["hasOverflow"]; });

/* harmony import */ var _properties__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__("../../packages/utilities/lib/properties.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "baseElementEvents", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["baseElementEvents"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "baseElementProperties", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["baseElementProperties"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "htmlElementProperties", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["htmlElementProperties"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "anchorProperties", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["anchorProperties"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "buttonProperties", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["buttonProperties"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "divProperties", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["divProperties"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "inputProperties", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["inputProperties"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "textAreaProperties", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["textAreaProperties"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "imageProperties", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["imageProperties"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getNativeProps", function() { return _properties__WEBPACK_IMPORTED_MODULE_33__["getNativeProps"]; });

/* harmony import */ var _resources__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__("../../packages/utilities/lib/resources.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getResourceUrl", function() { return _resources__WEBPACK_IMPORTED_MODULE_34__["getResourceUrl"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setBaseUrl", function() { return _resources__WEBPACK_IMPORTED_MODULE_34__["setBaseUrl"]; });

/* harmony import */ var _rtl__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__("../../packages/utilities/lib/rtl.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRTL", function() { return _rtl__WEBPACK_IMPORTED_MODULE_35__["getRTL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setRTL", function() { return _rtl__WEBPACK_IMPORTED_MODULE_35__["setRTL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRTLSafeKeyCode", function() { return _rtl__WEBPACK_IMPORTED_MODULE_35__["getRTLSafeKeyCode"]; });

/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__("../../packages/utilities/lib/scroll.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DATA_IS_SCROLLABLE_ATTRIBUTE", function() { return _scroll__WEBPACK_IMPORTED_MODULE_36__["DATA_IS_SCROLLABLE_ATTRIBUTE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "allowScrollOnElement", function() { return _scroll__WEBPACK_IMPORTED_MODULE_36__["allowScrollOnElement"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "disableBodyScroll", function() { return _scroll__WEBPACK_IMPORTED_MODULE_36__["disableBodyScroll"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "enableBodyScroll", function() { return _scroll__WEBPACK_IMPORTED_MODULE_36__["enableBodyScroll"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getScrollbarWidth", function() { return _scroll__WEBPACK_IMPORTED_MODULE_36__["getScrollbarWidth"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "findScrollableParent", function() { return _scroll__WEBPACK_IMPORTED_MODULE_36__["findScrollableParent"]; });

/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__("../../packages/utilities/lib/string.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "format", function() { return _string__WEBPACK_IMPORTED_MODULE_37__["format"]; });

/* harmony import */ var _styled__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__("../../packages/utilities/lib/styled.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "styled", function() { return _styled__WEBPACK_IMPORTED_MODULE_38__["styled"]; });

/* harmony import */ var _warn__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__("../../packages/utilities/lib/warn.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "warnDeprecations", function() { return _warn__WEBPACK_IMPORTED_MODULE_39__["warnDeprecations"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "warnMutuallyExclusive", function() { return _warn__WEBPACK_IMPORTED_MODULE_39__["warnMutuallyExclusive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "warnConditionallyRequiredProps", function() { return _warn__WEBPACK_IMPORTED_MODULE_39__["warnConditionallyRequiredProps"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "warn", function() { return _warn__WEBPACK_IMPORTED_MODULE_39__["warn"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setWarningCallback", function() { return _warn__WEBPACK_IMPORTED_MODULE_39__["setWarningCallback"]; });











































/***/ }),

/***/ "../../packages/utilities/lib/initializeDir.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeDir", function() { return initializeDir; });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/dom.js");

function initializeDir(window) {
    var win = (window || Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getWindow"])());
    if (win && !win.__hasInitializedDir__) {
        win.__hasInitializedDir__ = true;
        // Ensure that the documentElement has a 'dir' attribute.
        var documentElement = win.document.documentElement;
        if (!documentElement.hasAttribute('dir')) {
            documentElement.setAttribute('dir', 'ltr');
        }
    }
}


/***/ }),

/***/ "../../packages/utilities/lib/initializeFocusRects.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IsFocusVisibleClassName", function() { return IsFocusVisibleClassName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeFocusRects", function() { return initializeFocusRects; });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/dom.js");
/* harmony import */ var _keyboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/keyboard.js");


var IsFocusVisibleClassName = 'ms-Fabric--isFocusVisible';
/**
 * Initializes the logic which:
 *
 * 1. Subscribes keydown and mousedown events. (It will only do it once per window,
 *    so it's safe to call this method multiple times.)
 * 2. When the user presses directional keyboard keys, adds the 'is-focusVisible' classname
 *    to the document body.
 * 3. When the user clicks a mouse button, we remove the classname if it exists.
 *
 * This logic allows components on the page to conditionally render focus treatments only
 * if the global classname exists, which simplifies logic overall.
 *
 * @param window
 */
function initializeFocusRects(window) {
    var win = (window || Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getWindow"])());
    if (win && !win.__hasInitializeFocusRects__) {
        win.__hasInitializeFocusRects__ = true;
        win.addEventListener('mousedown', _onMouseDown, true);
        win.addEventListener('keydown', _onKeyDown, true);
    }
}
function _onMouseDown(ev) {
    var win = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getWindow"])(ev.target);
    if (win) {
        var classList = win.document.body.classList;
        if (classList.contains(IsFocusVisibleClassName)) {
            classList.remove(IsFocusVisibleClassName);
        }
    }
}
function _onKeyDown(ev) {
    var win = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getWindow"])(ev.target);
    if (win) {
        var classList = win.document.body.classList;
        if (Object(_keyboard__WEBPACK_IMPORTED_MODULE_1__["isDirectionalKeyCode"])(ev.which) && !classList.contains(IsFocusVisibleClassName)) {
            classList.add(IsFocusVisibleClassName);
        }
    }
}


/***/ }),

/***/ "../../packages/utilities/lib/initials.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInitials", function() { return getInitials; });
/**
 * Regular expression matching characters to ignore when calculating the initials.
 * The first part matches characters within parenthesis, including the parenthesis.
 * The second part matches special ASCII characters except space, plus some unicode special characters.
 */
var UNWANTED_CHARS_REGEX = /\([^)]*\)|[\0-\u001F\!-/:-@\[-`\{-\u00BF\u0250-\u036F\uD800-\uFFFF]/g;
/**
 * Regular expression matching phone numbers. Applied after chars matching UNWANTED_CHARS_REGEX have been removed
 * and number has been trimmed for whitespaces
 */
var PHONENUMBER_REGEX = /^\d+[\d\s]*(:?ext|x|)\s*\d+$/i;
/** Regular expression matching one or more spaces. */
var MULTIPLE_WHITESPACES_REGEX = /\s+/g;
/**
 * Regular expression matching languages for which we currently don't support initials.
 * Arabic:   Arabic, Arabic Supplement, Arabic Extended-A.
 * Korean:   Hangul Jamo, Hangul Compatibility Jamo, Hangul Jamo Extended-A, Hangul Syllables, Hangul Jamo Extended-B.
 * Japanese: Hiragana, Katakana.
 * CJK:      CJK Unified Ideographs Extension A, CJK Unified Ideographs, CJK Compatibility Ideographs, CJK Unified Ideographs Extension B
 */
/* tslint:disable:max-line-length */
var UNSUPPORTED_TEXT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD869][\uDC00-\uDED6]/;
/* tslint:enable:max-line-length */
function getInitialsLatin(displayName, isRtl) {
    var initials = '';
    var splits = displayName.split(' ');
    if (splits.length === 2) {
        initials += splits[0].charAt(0).toUpperCase();
        initials += splits[1].charAt(0).toUpperCase();
    }
    else if (splits.length === 3) {
        initials += splits[0].charAt(0).toUpperCase();
        initials += splits[2].charAt(0).toUpperCase();
    }
    else if (splits.length !== 0) {
        initials += splits[0].charAt(0).toUpperCase();
    }
    if (isRtl && initials.length > 1) {
        return initials.charAt(1) + initials.charAt(0);
    }
    return initials;
}
function cleanupDisplayName(displayName) {
    displayName = displayName.replace(UNWANTED_CHARS_REGEX, '');
    displayName = displayName.replace(MULTIPLE_WHITESPACES_REGEX, ' ');
    displayName = displayName.trim();
    return displayName;
}
/**
 * Get (up to 2 characters) initials based on display name of the persona.
 *
 * @public
 */
function getInitials(displayName, isRtl, allowPhoneInitials) {
    if (!displayName) {
        return '';
    }
    displayName = cleanupDisplayName(displayName);
    // For names containing CJK characters, and phone numbers, we don't display initials
    if (UNSUPPORTED_TEXT_REGEX.test(displayName) || (!allowPhoneInitials && PHONENUMBER_REGEX.test(displayName))) {
        return '';
    }
    return getInitialsLatin(displayName, isRtl);
}


/***/ }),

/***/ "../../packages/utilities/lib/keyboard.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDirectionalKeyCode", function() { return isDirectionalKeyCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDirectionalKeyCode", function() { return addDirectionalKeyCode; });
var DirectionalKeyCodes = (_a = {},
    _a[38 /* up */] = 1,
    _a[40 /* down */] = 1,
    _a[37 /* left */] = 1,
    _a[39 /* right */] = 1,
    _a[36 /* home */] = 1,
    _a[35 /* end */] = 1,
    _a[9 /* tab */] = 1,
    _a[33 /* pageUp */] = 1,
    _a[34 /* pageDown */] = 1,
    _a);
/**
 * Returns true if the keycode is a directional keyboard key.
 */
function isDirectionalKeyCode(which) {
    return !!DirectionalKeyCodes[which];
}
/**
 * Adds a keycode to the list of keys that, when pressed, should cause the focus outlines to be visible.
 * This can be used to add global shortcut keys that directionally move from section to section within
 * an app or between focus trap zones.
 */
function addDirectionalKeyCode(which) {
    DirectionalKeyCodes[which] = 1;
}
var _a;


/***/ }),

/***/ "../../packages/utilities/lib/language.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLanguage", function() { return getLanguage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setLanguage", function() { return setLanguage; });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/dom.js");
/* harmony import */ var _localStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/localStorage.js");


// Default to undefined so that we initialize on first read.
var _language;
/**
 * Gets the rtl state of the page (returns true if in rtl.)
 *
 * @public
 */
function getLanguage() {
    if (_language === undefined) {
        var doc = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
        var savedLanguage = Object(_localStorage__WEBPACK_IMPORTED_MODULE_1__["getItem"])('language');
        if (savedLanguage !== null) {
            _language = savedLanguage;
        }
        if (_language === undefined && doc) {
            _language = doc.documentElement.getAttribute('lang');
        }
        if (_language === undefined) {
            _language = 'en';
        }
    }
    return _language;
}
/**
 * Sets the rtl state of the page (by adjusting the dir attribute of the html element.)
 *
 * @public
 */
function setLanguage(language, avoidPersisting) {
    if (avoidPersisting === void 0) { avoidPersisting = false; }
    var doc = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    if (doc) {
        doc.documentElement.setAttribute('lang', language);
    }
    if (!avoidPersisting) {
        Object(_localStorage__WEBPACK_IMPORTED_MODULE_1__["setItem"])('language', language);
    }
    _language = language;
}


/***/ }),

/***/ "../../packages/utilities/lib/localStorage.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getItem", function() { return getItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setItem", function() { return setItem; });
/**
 * Fetches an item from local storage without throwing an exception
 * @param key The key of the item to fetch from local storage
 */
function getItem(key) {
    var result = null;
    try {
        result = window.localStorage.getItem(key);
    }
    catch (e) {
        /* Eat the exception */
    }
    return result;
}
/**
 * Inserts an item into local storage without throwing an exception
 * @param key The key of the item to add to local storage
 * @param data The data to put into local storage
 */
function setItem(key, data) {
    try {
        window.localStorage.setItem(key, data);
    }
    catch (e) {
        /* Eat the exception */
    }
}


/***/ }),

/***/ "../../packages/utilities/lib/math.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDistanceBetweenPoints", function() { return getDistanceBetweenPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fitContentToBounds", function() { return fitContentToBounds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculatePrecision", function() { return calculatePrecision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "precisionRound", function() { return precisionRound; });
/**
 * Determines the distance between two points.
 *
 * @public
 */
function getDistanceBetweenPoints(point1, point2) {
    var distance = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    return distance;
}
/**
 * Produces a proportionally-scaled version of an input content size when fit to a bounding size.
 * Given a `contentSize` and a `boundsSize`, this function scales `contentSize` proportionally
 * using either `contain` or `cover` fit behaviors.
 * Use this function to pre-calculate the layout for the CSS `object-fit` and `background-fit` behaviors.
 * With `contain`, the output size must be the largest it can be while completely within the `boundsSize`.
 * With `cover`, the output size must be the smallest it can be while completely around the `boundsSize`.
 * By default, there is a `maxScale` value of 1, which prevents the `contentSize` from being scaled larger.
 *
 * @param options the options for the bounds fit operation
 */
function fitContentToBounds(options) {
    var contentSize = options.contentSize, boundsSize = options.boundsSize, _a = options.mode, mode = _a === void 0 ? 'contain' : _a, _b = options.maxScale, maxScale = _b === void 0 ? 1 : _b;
    var contentAspectRatio = contentSize.width / contentSize.height;
    var boundsAspectRatio = boundsSize.width / boundsSize.height;
    var scale;
    if (mode === 'contain' ? contentAspectRatio > boundsAspectRatio : contentAspectRatio < boundsAspectRatio) {
        scale = boundsSize.width / contentSize.width;
    }
    else {
        scale = boundsSize.height / contentSize.height;
    }
    var finalScale = Math.min(maxScale, scale);
    return {
        width: contentSize.width * finalScale,
        height: contentSize.height * finalScale
    };
}
/**
 * Calculates a number's precision based on the number of trailing
 * zeros if the number does not have a decimal indicated by a negative
 * precision. Otherwise, it calculates the number of digits after
 * the decimal point indicated by a positive precision.
 * @param value
 */
function calculatePrecision(value) {
    /**
     * Group 1:
     * [1-9]([0]+$) matches trailing zeros
     * Group 2:
     * \.([0-9]*) matches all digits after a decimal point.
     */
    var groups = /[1-9]([0]+$)|\.([0-9]*)/.exec(String(value));
    if (!groups) {
        return 0;
    }
    if (groups[1]) {
        return -groups[1].length;
    }
    if (groups[2]) {
        return groups[2].length;
    }
    return 0;
}
/**
 * Rounds a number to a certain level of precision. Accepts negative precision.
 * @param value The value that is being rounded.
 * @param precision The number of decimal places to round the number to
 */
function precisionRound(value, precision, base) {
    if (base === void 0) { base = 10; }
    var exp = Math.pow(base, precision);
    return Math.round(value * exp) / exp;
}


/***/ }),

/***/ "../../packages/utilities/lib/memoize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setMemoizeWeakMap", function() { return setMemoizeWeakMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetMemoizations", function() { return resetMemoizations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "memoize", function() { return memoize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "memoizeFunction", function() { return memoizeFunction; });
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");

var stylesheet = _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance();
if (stylesheet && stylesheet.onReset) {
    _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance().onReset(resetMemoizations);
}
var _resetCounter = 0;
var _emptyObject = { empty: true };
var _dictionary = {};
var _weakMap = typeof WeakMap === 'undefined' ? null : WeakMap;
/**
 *  Test utility for providing a custom weakmap.
 *
 * @internal
 * */
function setMemoizeWeakMap(weakMap) {
    _weakMap = weakMap;
}
/**
 * Reset memoizations.
 */
function resetMemoizations() {
    _resetCounter++;
}
/**
 * Memoize decorator to be used on class methods. Note that the "this" reference
 * will be inaccessible within a memoized method, given that a cached method's this
 * would not be instance specific.
 *
 * @public
 */
function memoize(target, key, descriptor) {
    // We bind to "null" to prevent people from inadvertently pulling values from "this",
    // rather than passing them in as input values which can be memoized.
    var fn = memoizeFunction(descriptor.value && descriptor.value.bind(null));
    return {
        configurable: true,
        get: function () {
            return fn;
        }
    };
}
/**
 * Memoizes a function; when you pass in the same parameters multiple times, it returns a cached result.
 * Be careful when passing in objects, you need to pass in the same INSTANCE for caching to work. Otherwise
 * it will grow the cache unnecessarily. Also avoid using default values that evaluate functions; passing in
 * undefined for a value and relying on a default function will execute it the first time, but will not
 * re-evaluate subsequent times which may have been unexpected.
 *
 * By default, the cache will reset after 100 permutations, to avoid abuse cases where the function is
 * unintendedly called with unique objects. Without a reset, the cache could grow infinitely, so we safeguard
 * by resetting. To override this behavior, pass a value of 0 to the maxCacheSize parameter.
 *
 * @public
 * @param cb - The function to memoize.
 * @param maxCacheSize - Max results to cache. If the cache exceeds this value, it will reset on the next call.
 * @returns A memoized version of the function.
 */
function memoizeFunction(cb, maxCacheSize) {
    if (maxCacheSize === void 0) { maxCacheSize = 100; }
    // Avoid breaking scenarios which don't have weak map.
    if (!_weakMap) {
        return cb;
    }
    var rootNode;
    var cacheSize = 0;
    var localResetCounter = _resetCounter;
    // tslint:disable-next-line:no-function-expression
    return function memoizedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var currentNode = rootNode;
        if (rootNode === undefined ||
            localResetCounter !== _resetCounter ||
            (maxCacheSize > 0 && cacheSize > maxCacheSize)) {
            rootNode = _createNode();
            cacheSize = 0;
            localResetCounter = _resetCounter;
        }
        currentNode = rootNode;
        // Traverse the tree until we find the match.
        for (var i = 0; i < args.length; i++) {
            var arg = _normalizeArg(args[i]);
            if (!currentNode.map.has(arg)) {
                currentNode.map.set(arg, _createNode());
            }
            currentNode = currentNode.map.get(arg);
        }
        if (!currentNode.hasOwnProperty('value')) {
            currentNode.value = cb.apply(void 0, args);
            cacheSize++;
        }
        return currentNode.value;
    };
}
function _normalizeArg(val) {
    if (!val) {
        return _emptyObject;
    }
    else if (typeof val === 'object') {
        return val;
    }
    else if (!_dictionary[val]) {
        _dictionary[val] = { val: val };
    }
    return _dictionary[val];
}
function _createNode() {
    return {
        map: _weakMap ? new _weakMap() : null
    };
}


/***/ }),

/***/ "../../packages/utilities/lib/merge.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return merge; });
/**
 * Simple deep merge function. Takes all arguments and returns a deep copy of the objects merged
 * together in the order provided. If an object creates a circular reference, it will assign the
 * original reference.
 */
function merge(target) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var arg = args_1[_a];
        _merge(target || {}, arg);
    }
    return target;
}
/**
 * The _merge helper iterates through all props on source and assigns them to target.
 * When the value is an object, we will create a deep clone of the object. However if
 * there is a circular reference, the value will not be deep cloned and will persist
 * the reference.
 */
// tslint:disable-next-line:no-any
function _merge(target, source, circularReferences) {
    if (circularReferences === void 0) { circularReferences = []; }
    circularReferences.push(source);
    for (var name_1 in source) {
        if (source.hasOwnProperty(name_1)) {
            var value = source[name_1];
            if (typeof value === 'object') {
                var isCircularReference = circularReferences.indexOf(value) > -1;
                target[name_1] = isCircularReference ? value : _merge(target[name_1] || {}, value, circularReferences);
            }
            else {
                target[name_1] = value;
            }
        }
    }
    circularReferences.pop();
    return target;
}


/***/ }),

/***/ "../../packages/utilities/lib/object.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallowCompare", function() { return shallowCompare; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filteredAssign", function() { return filteredAssign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getId", function() { return getId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetIds", function() { return resetIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapEnumByName", function() { return mapEnumByName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "values", function() { return values; });
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/merge-styles/lib/index.js");

// Initialize global window id.
var CURRENT_ID_PROPERTY = '__currentId__';
var DEFAULT_ID_STRING = 'id__';
// tslint:disable-next-line:no-any
var _global = (typeof window !== 'undefined' && window) || process;
if (_global[CURRENT_ID_PROPERTY] === undefined) {
    _global[CURRENT_ID_PROPERTY] = 0;
}
// tslint:disable-next-line:no-any
function checkProperties(a, b) {
    for (var propName in a) {
        if (a.hasOwnProperty(propName)) {
            if (!b.hasOwnProperty(propName) || b[propName] !== a[propName]) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Compares a to b and b to a.
 *
 * @public
 */
function shallowCompare(a, b) {
    return checkProperties(a, b) && checkProperties(b, a);
}
/**
 * Makes a resulting merge of a bunch of objects. Pass in the target object followed by 1 or more
 * objects as arguments and they will be merged sequentially into the target. Note that this will
 * shallow merge; it will not create new cloned values for target members.
 *
 * @public
 * @param target - Target object to merge following object arguments into.
 * @param args - One or more objects that will be mixed into the target in the order they are provided.
 * @returns Resulting merged target.
 */
// tslint:disable-next-line:no-any
function assign(target) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return filteredAssign.apply(this, [null, target].concat(args));
}
/**
 * Makes a resulting merge of a bunch of objects, but allows a filter function to be passed in to filter
 * the resulting merges. This allows for scenarios where you want to merge "everything except that one thing"
 * or "properties that start with data-". Note that this will shallow merge; it will not create new cloned
 * values for target members.
 *
 * @public
 * @param isAllowed - Callback to determine if the given propName is allowed in the result.
 * @param target - Target object to merge following object arguments into.
 * @param args - One or more objects that will be mixed into the target in the order they are provided.
 * @returns Resulting merged target.
 */
// tslint:disable-next-line:no-any
function filteredAssign(isAllowed, target) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    target = target || {};
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var sourceObject = args_1[_a];
        if (sourceObject) {
            for (var propName in sourceObject) {
                if (sourceObject.hasOwnProperty(propName) && (!isAllowed || isAllowed(propName))) {
                    target[propName] = sourceObject[propName];
                }
            }
        }
    }
    return target;
}
// Configure ids to reset on stylesheet resets.
var stylesheet = _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_0__["Stylesheet"].getInstance();
if (stylesheet && stylesheet.onReset) {
    stylesheet.onReset(resetIds);
}
/**
 * Generates a unique id in the global scope (this spans across duplicate copies of the same library.)
 *
 * @public
 */
function getId(prefix) {
    var index = _global[CURRENT_ID_PROPERTY]++;
    return (prefix || DEFAULT_ID_STRING) + index;
}
/**
 * Resets id counter to an (optional) number.
 *
 * @public
 */
function resetIds(counter) {
    if (counter === void 0) { counter = 0; }
    _global[CURRENT_ID_PROPERTY] = counter;
}
/* Takes an enum and iterates over each value of the enum (as a string), running the callback on each, returning a mapped array.
 * The callback takes as a first parameter the string that represents the name of the entry, and the second parameter is the
 * value of that entry, which is the value you'd normally use when using the enum (usually a number).
 * */
function mapEnumByName(
// tslint:disable-next-line:no-any
theEnum, callback) {
    // map<any> to satisfy compiler since it doesn't realize we strip out undefineds in the .filter() call
    return Object.keys(theEnum)
        .map(function (p) {
        // map on each property name as a string
        if (String(Number(p)) !== p) {
            // if the property is not just a number (because enums in TypeScript will map both ways)
            return callback(p, theEnum[p]);
        }
    })
        .filter(function (v) { return !!v; }); // only return elements with values
}
/**
 * Get all values in an object dictionary
 *
 * @param obj - The dictionary to get values for
 */
// tslint:disable-next-line:no-any
function values(obj) {
    return Object.keys(obj).reduce(function (arr, key) {
        arr.push(obj[key]);
        return arr;
    }, []);
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../../common/temp/node_modules/process/browser.js")))

/***/ }),

/***/ "../../packages/utilities/lib/overflow.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasHorizontalOverflow", function() { return hasHorizontalOverflow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasVerticalOverflow", function() { return hasVerticalOverflow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasOverflow", function() { return hasOverflow; });
/**
 * Detects whether an element's content has horizontal overflow
 *
 * @public
 * @param element - Element to check for overflow
 * @returns True if element's content overflows
 */
function hasHorizontalOverflow(element) {
    return element.clientWidth < element.scrollWidth;
}
/**
 * Detects whether an element's content has vertical overflow
 *
 * @public
 * @param element - Element to check for overflow
 * @returns True if element's content overflows
 */
function hasVerticalOverflow(element) {
    return element.clientHeight < element.scrollHeight;
}
/**
 * Detects whether an element's content has overflow in any direction
 *
 * @public
 * @param element - Element to check for overflow
 * @returns True if element's content overflows
 */
function hasOverflow(element) {
    return hasHorizontalOverflow(element) || hasVerticalOverflow(element);
}


/***/ }),

/***/ "../../packages/utilities/lib/properties.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "baseElementEvents", function() { return baseElementEvents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "baseElementProperties", function() { return baseElementProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "htmlElementProperties", function() { return htmlElementProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "anchorProperties", function() { return anchorProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buttonProperties", function() { return buttonProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "divProperties", function() { return divProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inputProperties", function() { return inputProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "textAreaProperties", function() { return textAreaProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "imageProperties", function() { return imageProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNativeProps", function() { return getNativeProps; });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/object.js");

/**
 * An array of events that are allowed on every html element type.
 *
 * @public
 */
var baseElementEvents = [
    'onCopy',
    'onCut',
    'onPaste',
    'onCompositionEnd',
    'onCompositionStart',
    'onCompositionUpdate',
    'onFocus',
    'onFocusCapture',
    'onBlur',
    'onBlurCapture',
    'onChange',
    'onInput',
    'onSubmit',
    'onLoad',
    'onError',
    'onKeyDown',
    'onKeyDownCapture',
    'onKeyPress',
    'onKeyUp',
    'onAbort',
    'onCanPlay',
    'onCanPlayThrough',
    'onDurationChange',
    'onEmptied',
    'onEncrypted',
    'onEnded',
    'onLoadedData',
    'onLoadedMetadata',
    'onLoadStart',
    'onPause',
    'onPlay',
    'onPlaying',
    'onProgress',
    'onRateChange',
    'onSeeked',
    'onSeeking',
    'onStalled',
    'onSuspend',
    'onTimeUpdate',
    'onVolumeChange',
    'onWaiting',
    'onClick',
    'onClickCapture',
    'onContextMenu',
    'onDoubleClick',
    'onDrag',
    'onDragEnd',
    'onDragEnter',
    'onDragExit',
    'onDragLeave',
    'onDragOver',
    'onDragStart',
    'onDrop',
    'onMouseDown',
    'onMouseDownCapture',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseMove',
    'onMouseOut',
    'onMouseOver',
    'onMouseUp',
    'onMouseUpCapture',
    'onSelect',
    'onTouchCancel',
    'onTouchEnd',
    'onTouchMove',
    'onTouchStart',
    'onScroll',
    'onWheel'
];
/**
 * An array of element attributes which are allowed on every html element type.
 *
 * @public
 */
var baseElementProperties = [
    'defaultChecked',
    'defaultValue',
    'accept',
    'acceptCharset',
    'accessKey',
    'action',
    'allowFullScreen',
    'allowTransparency',
    'alt',
    'async',
    'autoComplete',
    'autoFocus',
    'autoPlay',
    'capture',
    'cellPadding',
    'cellSpacing',
    'charSet',
    'challenge',
    'checked',
    'children',
    'classID',
    'className',
    'cols',
    'colSpan',
    'content',
    'contentEditable',
    'contextMenu',
    'controls',
    'coords',
    'crossOrigin',
    'data',
    'dateTime',
    'default',
    'defer',
    'dir',
    'download',
    'draggable',
    'encType',
    'form',
    'formAction',
    'formEncType',
    'formMethod',
    'formNoValidate',
    'formTarget',
    'frameBorder',
    'headers',
    'height',
    'hidden',
    'high',
    'hrefLang',
    'htmlFor',
    'httpEquiv',
    'icon',
    'id',
    'inputMode',
    'integrity',
    'is',
    'keyParams',
    'keyType',
    'kind',
    'lang',
    'list',
    'loop',
    'low',
    'manifest',
    'marginHeight',
    'marginWidth',
    'max',
    'maxLength',
    'media',
    'mediaGroup',
    'method',
    'min',
    'minLength',
    'multiple',
    'muted',
    'name',
    'noValidate',
    'open',
    'optimum',
    'pattern',
    'placeholder',
    'poster',
    'preload',
    'radioGroup',
    'readOnly',
    'rel',
    'required',
    'role',
    'rows',
    'rowSpan',
    'sandbox',
    'scope',
    'scoped',
    'scrolling',
    'seamless',
    'selected',
    'shape',
    'size',
    'sizes',
    'span',
    'spellCheck',
    'src',
    'srcDoc',
    'srcLang',
    'srcSet',
    'start',
    'step',
    'style',
    'summary',
    'tabIndex',
    'title',
    'type',
    'useMap',
    'value',
    'width',
    'wmode',
    'wrap'
];
/**
 * An array of HTML element properties and events.
 *
 * @public
 */
var htmlElementProperties = baseElementProperties.concat(baseElementEvents);
/**
 * An array of A tag properties and events.
 *
 * @public
 */
var anchorProperties = htmlElementProperties.concat(['href', 'target']);
/**
 * An array of BUTTON tag properties and events.
 *
 * @public
 */
var buttonProperties = htmlElementProperties.concat(['disabled']);
/**
 * An array of DIV tag properties and events.
 *
 * @public
 */
var divProperties = htmlElementProperties.concat(['align', 'noWrap']);
/**
 * An array of INPUT tag properties and events.
 *
 * @public
 */
var inputProperties = buttonProperties;
/**
 * An array of TEXTAREA tag properties and events.
 *
 * @public
 */
var textAreaProperties = buttonProperties;
/**
 * An array of IMAGE tag properties and events.
 *
 * @public
 */
var imageProperties = divProperties;
/**
 * Gets native supported props for an html element provided the allowance set. Use one of the property
 * sets defined (divProperties, buttonPropertes, etc) to filter out supported properties from a given
 * props set. Note that all data- and aria- prefixed attributes will be allowed.
 * NOTE: getNativeProps should always be applied first when adding props to a react component. The
 * non-native props should be applied second. This will prevent getNativeProps from overriding your custom props.
 * For example, if props passed to getNativeProps has an onClick function and getNativeProps is added to
 * the component after an onClick function is added, then the getNativeProps onClick will override it.
 *
 * @public
 * @param props - The unfiltered input props
 * @param allowedPropsNames-  The array of allowed propnames.
 * @returns The filtered props
 */
function getNativeProps(props, allowedPropNames, excludedPropNames) {
    return Object(_object__WEBPACK_IMPORTED_MODULE_0__["filteredAssign"])(function (propName) {
        return ((!excludedPropNames || excludedPropNames.indexOf(propName) < 0) &&
            (propName.indexOf('data-') === 0 || propName.indexOf('aria-') === 0 || allowedPropNames.indexOf(propName) >= 0));
    }, {}, props);
}


/***/ }),

/***/ "../../packages/utilities/lib/resources.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getResourceUrl", function() { return getResourceUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setBaseUrl", function() { return setBaseUrl; });
var _baseUrl = '';
/** Sets the current base url used for fetching images. */
function getResourceUrl(url) {
    return _baseUrl + url;
}
/** Gets the current base url used for fetching images. */
function setBaseUrl(baseUrl) {
    _baseUrl = baseUrl;
}


/***/ }),

/***/ "../../packages/utilities/lib/rtl.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRTL", function() { return getRTL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setRTL", function() { return setRTL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRTLSafeKeyCode", function() { return getRTLSafeKeyCode; });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/dom.js");
/* harmony import */ var _sessionStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/utilities/lib/sessionStorage.js");
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/merge-styles/lib/index.js");



var RTL_LOCAL_STORAGE_KEY = 'isRTL';
// Default to undefined so that we initialize on first read.
var _isRTL;
/**
 * Gets the rtl state of the page (returns true if in rtl.)
 */
function getRTL() {
    if (_isRTL === undefined) {
        // Fabric supports persisting the RTL setting between page refreshes via session storage
        var savedRTL = Object(_sessionStorage__WEBPACK_IMPORTED_MODULE_1__["getItem"])(RTL_LOCAL_STORAGE_KEY);
        if (savedRTL !== null) {
            _isRTL = savedRTL === '1';
            setRTL(_isRTL);
        }
        var doc = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
        if (_isRTL === undefined && doc) {
            _isRTL = doc.documentElement.getAttribute('dir') === 'rtl';
            Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__["setRTL"])(_isRTL);
        }
    }
    return !!_isRTL;
}
/**
 * Sets the rtl state of the page (by adjusting the dir attribute of the html element.)
 */
function setRTL(isRTL, persistSetting) {
    if (persistSetting === void 0) { persistSetting = false; }
    var doc = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    if (doc) {
        doc.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    }
    if (persistSetting) {
        Object(_sessionStorage__WEBPACK_IMPORTED_MODULE_1__["setItem"])(RTL_LOCAL_STORAGE_KEY, isRTL ? '1' : '0');
    }
    _isRTL = isRTL;
    Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__["setRTL"])(_isRTL);
}
/**
 * Returns the given key, but flips right/left arrows if necessary.
 */
function getRTLSafeKeyCode(key) {
    if (getRTL()) {
        if (key === 37 /* left */) {
            key = 39 /* right */;
        }
        else if (key === 39 /* right */) {
            key = 37 /* left */;
        }
    }
    return key;
}


/***/ }),

/***/ "../../packages/utilities/lib/scroll.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DATA_IS_SCROLLABLE_ATTRIBUTE", function() { return DATA_IS_SCROLLABLE_ATTRIBUTE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "allowScrollOnElement", function() { return allowScrollOnElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disableBodyScroll", function() { return disableBodyScroll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableBodyScroll", function() { return enableBodyScroll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getScrollbarWidth", function() { return getScrollbarWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findScrollableParent", function() { return findScrollableParent; });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/utilities/lib/dom.js");
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../packages/merge-styles/lib/index.js");


var _scrollbarWidth;
var _bodyScrollDisabledCount = 0;
var DisabledScrollClassName = Object(_uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_1__["mergeStyles"])({
    overflow: 'hidden !important'
});
/**
 * Placing this attribute on scrollable divs optimizes detection to know
 * if the div is scrollable or not (given we can avoid expensive operations
 * like getComputedStyle.)
 *
 * @public
 */
var DATA_IS_SCROLLABLE_ATTRIBUTE = 'data-is-scrollable';
var _makeElementScrollAllower = function () {
    var _previousClientY = 0;
    var _element = null;
    // remember the clientY for future calls of _preventOverscrolling
    var _saveClientY = function (event) {
        if (event.targetTouches.length === 1) {
            _previousClientY = event.targetTouches[0].clientY;
        }
    };
    // prevent the body from scrolling when the user attempts
    // to scroll past the top or bottom of the element
    var _preventOverscrolling = function (event) {
        // only respond to a single-finger touch
        if (event.targetTouches.length !== 1) {
            return;
        }
        // prevent the body touchmove handler from firing
        // so that scrolling is allowed within the element
        event.stopPropagation();
        if (!_element) {
            return;
        }
        var clientY = event.targetTouches[0].clientY - _previousClientY;
        // if the element is scrolled to the top,
        // prevent the user from scrolling up
        if (_element.scrollTop === 0 && clientY > 0) {
            event.preventDefault();
        }
        // if the element is scrolled to the bottom,
        // prevent the user from scrolling down
        if (_element.scrollHeight - _element.scrollTop <= _element.clientHeight && clientY < 0) {
            event.preventDefault();
        }
    };
    return function (element, events) {
        if (!element) {
            return;
        }
        element.style.overflowY = 'auto';
        events.on(element, 'touchstart', _saveClientY);
        events.on(element, 'touchmove', _preventOverscrolling);
        _element = element;
    };
};
/**
 * Allows the user to scroll within a element,
 * while preventing the user from scrolling the body
 */
var allowScrollOnElement = _makeElementScrollAllower();
var _disableIosBodyScroll = function (event) {
    event.preventDefault();
};
/**
 * Disables the body scrolling.
 *
 * @public
 */
function disableBodyScroll() {
    var doc = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    if (doc && doc.body && !_bodyScrollDisabledCount) {
        doc.body.classList.add(DisabledScrollClassName);
        doc.body.addEventListener('touchmove', _disableIosBodyScroll, { passive: false, capture: false });
    }
    _bodyScrollDisabledCount++;
}
/**
 * Enables the body scrolling.
 *
 * @public
 */
function enableBodyScroll() {
    if (_bodyScrollDisabledCount > 0) {
        var doc = Object(_dom__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
        if (doc && doc.body && _bodyScrollDisabledCount === 1) {
            doc.body.classList.remove(DisabledScrollClassName);
            doc.body.removeEventListener('touchmove', _disableIosBodyScroll);
        }
        _bodyScrollDisabledCount--;
    }
}
/**
 * Calculates the width of a scrollbar for the browser/os.
 *
 * @public
 */
function getScrollbarWidth() {
    if (_scrollbarWidth === undefined) {
        var scrollDiv = document.createElement('div');
        scrollDiv.style.setProperty('width', '100px');
        scrollDiv.style.setProperty('height', '100px');
        scrollDiv.style.setProperty('overflow', 'scroll');
        scrollDiv.style.setProperty('position', 'absolute');
        scrollDiv.style.setProperty('top', '-9999px');
        document.body.appendChild(scrollDiv);
        // Get the scrollbar width
        _scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        // Delete the DIV
        document.body.removeChild(scrollDiv);
    }
    return _scrollbarWidth;
}
/**
 * Traverses up the DOM for the element with the data-is-scrollable=true attribute, or returns
 * document.body.
 *
 * @public
 */
function findScrollableParent(startingElement) {
    var el = startingElement;
    // First do a quick scan for the scrollable attribute.
    while (el && el !== document.body) {
        if (el.getAttribute(DATA_IS_SCROLLABLE_ATTRIBUTE) === 'true') {
            return el;
        }
        el = el.parentElement;
    }
    // If we haven't found it, the use the slower method: compute styles to evaluate if overflow is set.
    el = startingElement;
    while (el && el !== document.body) {
        if (el.getAttribute(DATA_IS_SCROLLABLE_ATTRIBUTE) !== 'false') {
            var computedStyles = getComputedStyle(el);
            var overflowY = computedStyles ? computedStyles.getPropertyValue('overflow-y') : '';
            if (overflowY && (overflowY === 'scroll' || overflowY === 'auto')) {
                return el;
            }
        }
        el = el.parentElement;
    }
    // Fall back to window scroll.
    if (!el || el === document.body) {
        // tslint:disable-next-line:no-any
        el = window;
    }
    return el;
}


/***/ }),

/***/ "../../packages/utilities/lib/sessionStorage.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getItem", function() { return getItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setItem", function() { return setItem; });
/**
 * Fetches an item from session storage without throwing an exception
 * @param key The key of the item to fetch from session storage
 */
function getItem(key) {
    var result = null;
    try {
        result = window.sessionStorage.getItem(key);
    }
    catch (e) {
        /* Eat the exception */
    }
    return result;
}
/**
 * Inserts an item into session storage without throwing an exception
 * @param key The key of the item to add to session storage
 * @param data The data to put into session storage
 */
function setItem(key, data) {
    try {
        window.sessionStorage.setItem(key, data);
    }
    catch (e) {
        /* Eat the exception */
    }
}


/***/ }),

/***/ "../../packages/utilities/lib/string.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "format", function() { return format; });
// Regex that finds { and } so they can be removed on a lookup for string format
var FORMAT_ARGS_REGEX = /[\{\}]/g;
// Regex that finds {#} so it can be replaced by the arguments in string format
var FORMAT_REGEX = /\{\d+\}/g;
/**
 * String format method, used for scenarios where at runtime you
 * need to evaluate a formatted string given a tokenized string. This
 * usually only is needed in localization scenarios.

 * Example "I love {0} every {1}".format("CXP") will result in a Debug Exception.
 *
 * @public
 */
// tslint:disable-next-line:no-any
function format(s) {
    'use strict';
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var args = values;
    // Callback match function
    function replace_func(match) {
        // looks up in the args
        // tslint:disable-next-line:no-any
        var replacement = args[match.replace(FORMAT_ARGS_REGEX, '')];
        // catches undefined in nondebug and null in debug and nondebug
        if (replacement === null || replacement === undefined) {
            replacement = '';
        }
        return replacement;
    }
    return s.replace(FORMAT_REGEX, replace_func);
}


/***/ }),

/***/ "../../packages/utilities/lib/styled.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styled", function() { return styled; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../common/temp/node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../packages/merge-styles/lib/index.js");
/* harmony import */ var _Customizations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../packages/utilities/lib/Customizations.js");
/* harmony import */ var _Customizer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../packages/utilities/lib/Customizer.js");





var DefaultFields = ['theme', 'styles'];
/**
 * The styled HOC wrapper allows you to create a functional wrapper around a given component which will resolve
 * getStyles functional props, and mix customized props passed in using concatStyleSets.
 *
 * @example
 * ```tsx
 * export const Toggle = styled(
 *   ToggleBase,
 *   props => ({ root: { background: 'red' }})
 * );
 * ```
 * @param Component - The unstyled base component to render, which receives styles.
 * @param baseStyles - The styles which should be curried with the component.
 * @param getProps - A helper which provides default props.
 * @param customizable - An object which defines which props can be customized using the Customizer.
 */
function styled(Component, baseStyles, getProps, customizable) {
    var Wrapped = function (componentProps) {
        customizable = customizable || { scope: '', fields: undefined };
        var scope = customizable.scope, _a = customizable.fields, fields = _a === void 0 ? DefaultFields : _a;
        return (react__WEBPACK_IMPORTED_MODULE_1__["createElement"](_Customizer__WEBPACK_IMPORTED_MODULE_4__["CustomizerContext"].Consumer, null, function (context) {
            var settings = _Customizations__WEBPACK_IMPORTED_MODULE_3__["Customizations"].getSettings(fields, scope, context.customizations);
            var customizedStyles = settings.styles, rest = tslib__WEBPACK_IMPORTED_MODULE_0__["__rest"](settings, ["styles"]);
            var styles = function (styleProps) {
                return _resolve(styleProps, baseStyles, customizedStyles, componentProps.styles);
            };
            var additionalProps = getProps ? getProps(componentProps) : undefined;
            return react__WEBPACK_IMPORTED_MODULE_1__["createElement"](Component, tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, rest, additionalProps, componentProps, { styles: styles }));
        }));
    };
    Wrapped.displayName = "Styled" + (Component.displayName || Component.name);
    return Wrapped;
}
function _resolve(styleProps) {
    var allStyles = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        allStyles[_i - 1] = arguments[_i];
    }
    var result = [];
    for (var _a = 0, allStyles_1 = allStyles; _a < allStyles_1.length; _a++) {
        var styles = allStyles_1[_a];
        if (styles) {
            result.push(typeof styles === 'function' ? styles(styleProps) : styles);
        }
    }
    if (result.length) {
        // cliffkoh: I cannot figure out how to avoid the cast to any here.
        // It is something to do with the use of Omit in IStyleSet.
        // It might not be necessary once  Omit becomes part of lib.d.ts (when we remove our own Omit and rely on
        // the official version).
        // tslint:disable-next-line:no-any
        return _uifabric_merge_styles__WEBPACK_IMPORTED_MODULE_2__["concatStyleSets"].apply(void 0, result);
    }
    return undefined;
}


/***/ }),

/***/ "../../packages/utilities/lib/warn.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "warnDeprecations", function() { return warnDeprecations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "warnMutuallyExclusive", function() { return warnMutuallyExclusive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "warnConditionallyRequiredProps", function() { return warnConditionallyRequiredProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "warn", function() { return warn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setWarningCallback", function() { return setWarningCallback; });
var _warningCallback = undefined;
/**
 * Warns when a deprecated props are being used.
 *
 * @public
 * @param componentName - The name of the component being used.
 * @param props - The props passed into the component.
 * @param deprecationMap - The map of deprecations, where key is the prop name and the value is
 * either null or a replacement prop name.
 */
function warnDeprecations(componentName, props, deprecationMap) {
    for (var propName in deprecationMap) {
        if (props && propName in props) {
            var deprecationMessage = componentName + " property '" + propName + "' was used but has been deprecated.";
            var replacementPropName = deprecationMap[propName];
            if (replacementPropName) {
                deprecationMessage += " Use '" + replacementPropName + "' instead.";
            }
            warn(deprecationMessage);
        }
    }
}
/**
 * Warns when two props which are mutually exclusive are both being used.
 *
 * @public
 * @param componentName - The name of the component being used.
 * @param props - The props passed into the component.
 * @param exclusiveMap - A map where the key is a parameter, and the value is the other parameter.
 */
function warnMutuallyExclusive(componentName, props, exclusiveMap) {
    for (var propName in exclusiveMap) {
        if (props && propName in props) {
            var propInExclusiveMapValue = exclusiveMap[propName];
            if (propInExclusiveMapValue && propInExclusiveMapValue in props) {
                warn(componentName + " property '" + propName + "' is mutually exclusive with '" + exclusiveMap[propName] + "'. Use one or the other.");
            }
        }
    }
}
/**
 * Warns when props are required if a condition is met.
 *
 * @public
 * @param componentName - The name of the component being used.
 * @param props - The props passed into the component.
 * @param requiredProps - The name of the props that are required when the condition is met.
 * @param conditionalPropName - The name of the prop that the condition is based on.
 * @param condition - Whether the condition is met.
 */
function warnConditionallyRequiredProps(componentName, props, requiredProps, conditionalPropName, condition) {
    if (condition === true) {
        for (var _i = 0, requiredProps_1 = requiredProps; _i < requiredProps_1.length; _i++) {
            var requiredPropName = requiredProps_1[_i];
            if (!(requiredPropName in props)) {
                warn(componentName + " property '" + requiredPropName + "' is required when '" + conditionalPropName + "' is used.'");
            }
        }
    }
}
/**
 * Sends a warning to console, if the api is present.
 *
 * @public
 * @param message - Warning message.
 */
function warn(message) {
    if (_warningCallback) {
        _warningCallback(message);
    }
    else if (console && console.warn) {
        console.warn(message);
    }
}
/**
 * Configures the warning callback. Passing in undefined will reset it to use the default
 * console.warn function.
 *
 * @public
 * @param warningCallback - Callback to override the generated warnings.
 */
function setWarningCallback(warningCallback) {
    _warningCallback = warningCallback;
}


/***/ }),

/***/ "./lib/index.bundle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var office_ui_fabric_react_lib_Icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../packages/office-ui-fabric-react/lib/Icons.js");
// Using the default import, include all icon definitions. Products that care
// about bundle size should not be using the main entry, until tree shaking
// is perfected. (Use the top level imports instead.)

Object(office_ui_fabric_react_lib_Icons__WEBPACK_IMPORTED_MODULE_0__["initializeIcons"])();


/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = React;

/***/ })

/******/ });
//# sourceMappingURL=office-ui-fabric-react.js.map