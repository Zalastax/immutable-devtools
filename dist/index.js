(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["immutableDevTools"] = factory();
	else
		root["immutableDevTools"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createFormatters2 = __webpack_require__(1);

	var _createFormatters3 = _interopRequireDefault(_createFormatters2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Check for globally defined Immutable and add an install method to it.
	if (typeof Immutable !== "undefined") {
	  Immutable.installDevTools = install.bind(null, Immutable);
	}

	// I imagine most people are using Immutable as a CommonJS module though...

	var installed = false;
	function install(Immutable) {
	  if (typeof window === "undefined") {
	    throw new Error("Can only install immutable-devtools in a browser environment.");
	  }

	  // Don't install more than once.
	  if (installed === true) {
	    return;
	  }

	  window.devtoolsFormatters = window.devtoolsFormatters || [];

	  var _createFormatters = (0, _createFormatters3.default)(Immutable),
	      RecordFormatter = _createFormatters.RecordFormatter,
	      OrderedMapFormatter = _createFormatters.OrderedMapFormatter,
	      OrderedSetFormatter = _createFormatters.OrderedSetFormatter,
	      ListFormatter = _createFormatters.ListFormatter,
	      MapFormatter = _createFormatters.MapFormatter,
	      SetFormatter = _createFormatters.SetFormatter,
	      StackFormatter = _createFormatters.StackFormatter;

	  window.devtoolsFormatters.push(RecordFormatter, OrderedMapFormatter, OrderedSetFormatter, ListFormatter, MapFormatter, SetFormatter, StackFormatter);

	  installed = true;
	}

	module.exports = install;
	exports.default = install;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createFormatter;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var listStyle = { style: 'list-style-type: none; padding: 0; margin: 0 0 0 12px; font-style: normal' };
	var immutableNameStyle = { style: 'color: rgb(232,98,0)' };
	var keyStyle = { style: 'color: #881391' };
	var defaultValueKeyStyle = { style: 'color: #777' };
	var alteredValueKeyStyle = { style: 'color: #881391; font-weight: bolder' };
	var inlineValuesStyle = { style: 'color: #777; font-style: italic' };
	var nullStyle = { style: 'color: #777' };

	function createFormatter(Immutable) {

	  var reference = function reference(object, config) {
	    if (typeof object === 'undefined') return ['span', nullStyle, 'undefined'];else if (object === 'null') return ['span', nullStyle, 'null'];

	    return ['object', { object: object, config: config }];
	  };

	  var renderIterableHeader = function renderIterableHeader(iterable) {
	    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Iterable';
	    return ['span', ['span', immutableNameStyle, name], ['span', '[' + iterable.size + ']']];
	  };

	  var hasBody = function hasBody(collection, config) {
	    return collection.size > 0 && !(config && config.noPreview);
	  };

	  var renderIterableBody = function renderIterableBody(collection, mapper) {
	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    if (options.sorted) {
	      collection = collection.sortBy(function (value, key) {
	        return key;
	      });
	    }
	    var children = collection.map(mapper).toList().toJS();
	    return ['ol', listStyle].concat(_toConsumableArray(children));
	  };

	  var RecordFormatter = {
	    header: function header(record, config) {
	      if (!(record instanceof Immutable.Record)) return null;

	      var defaults = record.clear();
	      var changed = !Immutable.is(defaults, record);

	      if (config && config.noPreview) return ['span', changed ? immutableNameStyle : nullStyle, record._name || record.constructor.name || 'Record'];

	      var inlinePreview = void 0;
	      if (!changed) {
	        inlinePreview = ['span', inlineValuesStyle, '{}'];
	      } else {
	        var preview = Immutable.Seq(record._keys).reduce(function (preview, key) {
	          if (Immutable.is(defaults.get(key), record.get(key))) return preview;
	          if (preview.length) preview.push(', ');

	          preview.push(['span', {}, ['span', keyStyle, key + ': '], reference(record.get(key), { noPreview: true })]);
	          return preview;
	        }, []);
	        inlinePreview = ['span', inlineValuesStyle, '{'].concat(_toConsumableArray(preview), ['}']);
	      }
	      return ['span', {}, ['span', immutableNameStyle, record._name || record.constructor.name || 'Record'], ' ', inlinePreview];
	    },

	    hasBody: function hasBody(collection, config) {
	      return !(config && config.noPreview) && collection._values.some(function (v) {
	        return v !== undefined;
	      });
	    },
	    body: function body(record) {
	      var defaults = record.clear();
	      var children = Immutable.Seq(record._keys).map(function (key) {
	        var style = Immutable.is(defaults.get(key), record.get(key)) ? defaultValueKeyStyle : alteredValueKeyStyle;
	        return ['li', {}, ['span', style, key + ': '], reference(record.get(key))];
	      }).toJS();
	      return ['ol', listStyle].concat(_toConsumableArray(children));
	    }
	  };

	  var ListFormatter = {
	    header: function header(o) {
	      if (!Immutable.List.isList(o)) return null;
	      return renderIterableHeader(o, 'List');
	    },

	    hasBody: hasBody,
	    body: function body(o) {
	      return renderIterableBody(o, function (value, key) {
	        return ['li', ['span', keyStyle, key + ': '], reference(value)];
	      });
	    }
	  };

	  var StackFormatter = {
	    header: function header(o) {
	      if (!Immutable.Stack.isStack(o)) return null;
	      return renderIterableHeader(o, 'Stack');
	    },

	    hasBody: hasBody,
	    body: function body(o) {
	      return renderIterableBody(o, function (value, key) {
	        return ['li', ['span', keyStyle, key + ': '], reference(value)];
	      });
	    }
	  };

	  var MapFormatter = {
	    header: function header(o) {
	      if (!Immutable.Map.isMap(o)) return null;
	      return renderIterableHeader(o, 'Map');
	    },

	    hasBody: hasBody,
	    body: function body(o) {
	      return renderIterableBody(o, function (value, key) {
	        return ['li', {}, '{', reference(key), ' => ', reference(value), '}'];
	      }, { sorted: true });
	    }
	  };

	  var OrderedMapFormatter = {
	    header: function header(o) {
	      if (!Immutable.OrderedMap.isOrderedMap(o)) return null;
	      return renderIterableHeader(o, 'OrderedMap');
	    },

	    hasBody: hasBody,
	    body: function body(o) {
	      return renderIterableBody(o, function (value, key) {
	        return ['li', {}, '{', reference(key), ' => ', reference(value), '}'];
	      });
	    }
	  };

	  var SetFormatter = {
	    header: function header(o) {
	      if (!Immutable.Set.isSet(o)) return null;
	      return renderIterableHeader(o, 'Set');
	    },

	    hasBody: hasBody,
	    body: function body(o) {
	      return renderIterableBody(o, function (value) {
	        return ['li', reference(value)];
	      }, { sorted: true });
	    }
	  };

	  var OrderedSetFormatter = {
	    header: function header(o) {
	      if (!Immutable.OrderedSet.isOrderedSet(o)) return null;
	      return renderIterableHeader(o, 'OrderedSet');
	    },

	    hasBody: hasBody,
	    body: function body(o) {
	      return renderIterableBody(o, function (value) {
	        return ['li', reference(value)];
	      });
	    }
	  };

	  return {
	    RecordFormatter: RecordFormatter,
	    OrderedMapFormatter: OrderedMapFormatter,
	    OrderedSetFormatter: OrderedSetFormatter,
	    ListFormatter: ListFormatter,
	    MapFormatter: MapFormatter,
	    SetFormatter: SetFormatter,
	    StackFormatter: StackFormatter
	  };
	}

/***/ })
/******/ ])
});
;