(function () {
  'use strict';

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var MotionInput_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    /**
     * `MotionInput` singleton.
     * The `MotionInput` singleton allows to initialize motion events
     * and to listen to them.
     *
     * @class MotionInput
     */


    var MotionInput = function () {
      /**
       * Creates the `MotionInput` module instance.
       *
       * @constructor
       */
      function MotionInput() {
        _classCallCheck(this, MotionInput);
        /**
         * Pool of all available modules.
         *
         * @this MotionInput
         * @type {object}
         * @default {}
         */


        this.modules = {};
      }
      /**
       * Adds a module to the `MotionInput` module.
       *
       * @param {string} eventType - Name of the event type.
       * @param {InputModule} module - Module to add to the `MotionInput` module.
       */


      _createClass(MotionInput, [{
        key: "addModule",
        value: function addModule(eventType, module) {
          this.modules[eventType] = module;
        }
        /**
         * Gets a module.
         *
         * @param {string} eventType - Name of the event type (module) to retrieve.
         * @return {InputModule}
         */

      }, {
        key: "getModule",
        value: function getModule(eventType) {
          return this.modules[eventType];
        }
        /**
         * Requires a module.
         * If the module has been initialized already, returns its promise. Otherwise,
         * initializes the module.
         *
         * @param {string} eventType - Name of the event type (module) to require.
         * @return {Promise}
         */

      }, {
        key: "requireModule",
        value: function requireModule(eventType) {
          var module = this.getModule(eventType);
          if (module.promise) return module.promise;
          return module.init();
        }
        /**
         * Initializes the `MotionInput` module.
         *
         * @param {Array<String>} eventTypes - Array of the event types to initialize.
         * @return {Promise}
         */

      }, {
        key: "init",
        value: function init() {
          var _this = this;

          for (var _len = arguments.length, eventTypes = Array(_len), _key = 0; _key < _len; _key++) {
            eventTypes[_key] = arguments[_key];
          }

          if (Array.isArray(eventTypes[0])) eventTypes = eventTypes[0];
          var modulePromises = eventTypes.map(function (value) {
            var module = _this.getModule(value);

            return module.init();
          });
          return Promise.all(modulePromises);
        }
        /**
         * Adds a listener.
         *
         * @param {string} eventType - Name of the event type (module) to add a listener to.
         * @param {function} listener - Listener to add.
         */

      }, {
        key: "addListener",
        value: function addListener(eventType, listener) {
          var module = this.getModule(eventType);
          module.addListener(listener);
        }
        /**
         * Removes a listener.
         *
         * @param {string} eventType - Name of the event type (module) to add a listener to.
         * @param {function} listener - Listener to remove.
         */

      }, {
        key: "removeListener",
        value: function removeListener(eventType, listener) {
          var module = this.getModule(eventType);
          module.removeListener(listener);
        }
      }]);

      return MotionInput;
    }();

    exports.default = new MotionInput();
  });
  unwrapExports(MotionInput_1);

  var InputModule_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    /**
     * `InputModule` class.
     * The `InputModule` class allows to instantiate modules that are part of the
     * motion input module, and that provide values (for instance, `deviceorientation`,
     * `acceleration`, `energy`).
     *
     * @class InputModule
     */


    var InputModule = function () {
      /**
       * Creates an `InputModule` module instance.
       *
       * @constructor
       * @param {string} eventType - Name of the module / event (*e.g.* `deviceorientation, 'acceleration', 'energy').
       */
      function InputModule(eventType) {
        _classCallCheck(this, InputModule);
        /**
         * Event type of the module.
         *
         * @this InputModule
         * @type {string}
         * @constant
         */


        this.eventType = eventType;
        /**
         * Array of listeners attached to this module / event.
         *
         * @this InputModule
         * @type {Set<Function>}
         */

        this.listeners = new Set();
        /**
         * Event sent by this module.
         *
         * @this InputModule
         * @type {number|number[]}
         * @default null
         */

        this.event = null;
        /**
         * Module promise (resolved when the module is initialized).
         *
         * @this InputModule
         * @type {Promise}
         * @default null
         */

        this.promise = null;
        /**
         * Indicates if the module's event values are calculated from parent modules / events.
         *
         * @this InputModule
         * @type {bool}
         * @default false
         */

        this.isCalculated = false;
        /**
         * Indicates if the module's event values are provided by the device's sensors.
         * (*I.e.* indicates if the `'devicemotion'` or `'deviceorientation'` events provide the required raw values.)
         *
         * @this InputModule
         * @type {bool}
         * @default false
         */

        this.isProvided = false;
        /**
         * Period at which the module's events are sent (`undefined` if the events are not sent at regular intervals).
         *
         * @this InputModule
         * @type {number}
         * @default undefined
         */

        this.period = undefined;
        this.emit = this.emit.bind(this);
      }
      /**
       * Indicates whether the module can provide values or not.
       *
       * @type {bool}
       * @readonly
       */


      _createClass(InputModule, [{
        key: "init",

        /**
         * Initializes the module.
         *
         * @param {function} promiseFun - Promise function that takes the `resolve` and `reject` functions as arguments.
         * @return {Promise}
         */
        value: function init(promiseFun) {
          this.promise = new Promise(promiseFun);
          return this.promise;
        }
        /**
         * Adds a listener to the module.
         *
         * @param {function} listener - Listener to add.
         */

      }, {
        key: "addListener",
        value: function addListener(listener) {
          this.listeners.add(listener);
        }
        /**
         * Removes a listener from the module.
         *
         * @param {function} listener - Listener to remove.
         */

      }, {
        key: "removeListener",
        value: function removeListener(listener) {
          this.listeners.delete(listener);
        }
        /**
         * Propagates an event to all the module's listeners.
         *
         * @param {number|number[]} [event=this.event] - Event values to propagate to the module's listeners.
         */

      }, {
        key: "emit",
        value: function emit() {
          var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.event;
          this.listeners.forEach(function (listener) {
            return listener(event);
          });
        }
      }, {
        key: "isValid",
        get: function get() {
          return this.isProvided || this.isCalculated;
        }
      }]);

      return InputModule;
    }();

    exports.default = InputModule;
  });
  unwrapExports(InputModule_1);

  var DOMEventSubmodule_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var _InputModule3 = _interopRequireDefault(InputModule_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _possibleConstructorReturn(self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    /**
     * `DOMEventSubmodule` class.
     * The `DOMEventSubmodule` class allows to instantiate modules that provide
     * unified values (such as `AccelerationIncludingGravity`, `Acceleration`,
     * `RotationRate`, `Orientation`, `OrientationAlt) from the `devicemotion`
     * or `deviceorientation` DOM events.
     *
     * @class DOMEventSubmodule
     * @extends InputModule
     */


    var DOMEventSubmodule = function (_InputModule) {
      _inherits(DOMEventSubmodule, _InputModule);
      /**
       * Creates a `DOMEventSubmodule` module instance.
       *
       * @constructor
       * @param {DeviceMotionModule|DeviceOrientationModule} DOMEventModule - The parent DOM event module.
       * @param {string} eventType - The name of the submodule / event (*e.g.* 'acceleration' or 'orientationAlt').
       * @see DeviceMotionModule
       * @see DeviceOrientationModule
       */


      function DOMEventSubmodule(DOMEventModule, eventType) {
        _classCallCheck(this, DOMEventSubmodule);
        /**
         * The DOM event parent module from which this module gets the raw values.
         *
         * @this DOMEventSubmodule
         * @type {DeviceMotionModule|DeviceOrientationModule}
         * @constant
         */


        var _this = _possibleConstructorReturn(this, (DOMEventSubmodule.__proto__ || Object.getPrototypeOf(DOMEventSubmodule)).call(this, eventType));

        _this.DOMEventModule = DOMEventModule;
        /**
         * Raw values coming from the `devicemotion` event sent by this module.
         *
         * @this DOMEventSubmodule
         * @type {number[]}
         * @default [0, 0, 0]
         */

        _this.event = [0, 0, 0];
        /**
         * Compass heading reference (iOS devices only, `Orientation` and `OrientationAlt` submodules only).
         *
         * @this DOMEventSubmodule
         * @type {number}
         * @default null
         */

        _this._webkitCompassHeadingReference = null;
        return _this;
      }
      /**
       * Initializes of the module.
       *
       * @return {Promise}
       */


      _createClass(DOMEventSubmodule, [{
        key: 'init',
        value: function init() {
          var _this2 = this; // Indicate to the parent module that this event is required


          this.DOMEventModule.required[this.eventType] = true; // If the parent event has not been initialized yet, initialize it

          var DOMEventPromise = this.DOMEventModule.promise;
          if (!DOMEventPromise) DOMEventPromise = this.DOMEventModule.init();
          return DOMEventPromise.then(function (module) {
            return _this2;
          });
        }
      }]);

      return DOMEventSubmodule;
    }(_InputModule3.default);

    exports.default = DOMEventSubmodule;
  });
  unwrapExports(DOMEventSubmodule_1);

  var platform = createCommonjsModule(function (module, exports) {
    (function () {
      /** Used to determine if values are of the language type `Object`. */

      var objectTypes = {
        'function': true,
        'object': true
      };
      /** Used as a reference to the global object. */

      var root = objectTypes[typeof window] && window || this;
      /** Backup possible global object. */

      var oldRoot = root;
      /** Detect free variable `exports`. */

      var freeExports = objectTypes['object'] && exports;
      /** Detect free variable `module`. */

      var freeModule = objectTypes['object'] && module && !module.nodeType && module;
      /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */

      var freeGlobal = freeExports && freeModule && typeof commonjsGlobal == 'object' && commonjsGlobal;

      if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
        root = freeGlobal;
      }
      /**
       * Used as the maximum length of an array-like object.
       * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
       * for more details.
       */


      var maxSafeInteger = Math.pow(2, 53) - 1;
      /** Regular expression to detect Opera. */

      var reOpera = /\bOpera/;
      /** Possible global object. */

      var thisBinding = this;
      /** Used for native method references. */

      var objectProto = Object.prototype;
      /** Used to check for own properties of an object. */

      var hasOwnProperty = objectProto.hasOwnProperty;
      /** Used to resolve the internal `[[Class]]` of values. */

      var toString = objectProto.toString;
      /*--------------------------------------------------------------------------*/

      /**
       * Capitalizes a string value.
       *
       * @private
       * @param {string} string The string to capitalize.
       * @returns {string} The capitalized string.
       */

      function capitalize(string) {
        string = String(string);
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      /**
       * A utility function to clean up the OS name.
       *
       * @private
       * @param {string} os The OS name to clean up.
       * @param {string} [pattern] A `RegExp` pattern matching the OS name.
       * @param {string} [label] A label for the OS.
       */


      function cleanupOS(os, pattern, label) {
        // Platform tokens are defined at:
        // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
        // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
        var data = {
          '10.0': '10',
          '6.4': '10 Technical Preview',
          '6.3': '8.1',
          '6.2': '8',
          '6.1': 'Server 2008 R2 / 7',
          '6.0': 'Server 2008 / Vista',
          '5.2': 'Server 2003 / XP 64-bit',
          '5.1': 'XP',
          '5.01': '2000 SP1',
          '5.0': '2000',
          '4.0': 'NT',
          '4.90': 'ME'
        }; // Detect Windows version from platform tokens.

        if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) && (data = data[/[\d.]+$/.exec(os)])) {
          os = 'Windows ' + data;
        } // Correct character case and cleanup string.


        os = String(os);

        if (pattern && label) {
          os = os.replace(RegExp(pattern, 'i'), label);
        }

        os = format(os.replace(/ ce$/i, ' CE').replace(/\bhpw/i, 'web').replace(/\bMacintosh\b/, 'Mac OS').replace(/_PowerPC\b/i, ' OS').replace(/\b(OS X) [^ \d]+/i, '$1').replace(/\bMac (OS X)\b/, '$1').replace(/\/(\d)/, ' $1').replace(/_/g, '.').replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '').replace(/\bx86\.64\b/gi, 'x86_64').replace(/\b(Windows Phone) OS\b/, '$1').replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1').split(' on ')[0]);
        return os;
      }
      /**
       * An iteration utility for arrays and objects.
       *
       * @private
       * @param {Array|Object} object The object to iterate over.
       * @param {Function} callback The function called per iteration.
       */


      function each(object, callback) {
        var index = -1,
            length = object ? object.length : 0;

        if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
          while (++index < length) {
            callback(object[index], index, object);
          }
        } else {
          forOwn(object, callback);
        }
      }
      /**
       * Trim and conditionally capitalize string values.
       *
       * @private
       * @param {string} string The string to format.
       * @returns {string} The formatted string.
       */


      function format(string) {
        string = trim(string);
        return /^(?:webOS|i(?:OS|P))/.test(string) ? string : capitalize(string);
      }
      /**
       * Iterates over an object's own properties, executing the `callback` for each.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} callback The function executed per own property.
       */


      function forOwn(object, callback) {
        for (var key in object) {
          if (hasOwnProperty.call(object, key)) {
            callback(object[key], key, object);
          }
        }
      }
      /**
       * Gets the internal `[[Class]]` of a value.
       *
       * @private
       * @param {*} value The value.
       * @returns {string} The `[[Class]]`.
       */


      function getClassOf(value) {
        return value == null ? capitalize(value) : toString.call(value).slice(8, -1);
      }
      /**
       * Host objects can return type values that are different from their actual
       * data type. The objects we are concerned with usually return non-primitive
       * types of "object", "function", or "unknown".
       *
       * @private
       * @param {*} object The owner of the property.
       * @param {string} property The property to check.
       * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
       */


      function isHostType(object, property) {
        var type = object != null ? typeof object[property] : 'number';
        return !/^(?:boolean|number|string|undefined)$/.test(type) && (type == 'object' ? !!object[property] : true);
      }
      /**
       * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
       *
       * @private
       * @param {string} string The string to qualify.
       * @returns {string} The qualified string.
       */


      function qualify(string) {
        return String(string).replace(/([ -])(?!$)/g, '$1?');
      }
      /**
       * A bare-bones `Array#reduce` like utility function.
       *
       * @private
       * @param {Array} array The array to iterate over.
       * @param {Function} callback The function called per iteration.
       * @returns {*} The accumulated result.
       */


      function reduce(array, callback) {
        var accumulator = null;
        each(array, function (value, index) {
          accumulator = callback(accumulator, value, index, array);
        });
        return accumulator;
      }
      /**
       * Removes leading and trailing whitespace from a string.
       *
       * @private
       * @param {string} string The string to trim.
       * @returns {string} The trimmed string.
       */


      function trim(string) {
        return String(string).replace(/^ +| +$/g, '');
      }
      /*--------------------------------------------------------------------------*/

      /**
       * Creates a new platform object.
       *
       * @memberOf platform
       * @param {Object|string} [ua=navigator.userAgent] The user agent string or
       *  context object.
       * @returns {Object} A platform object.
       */


      function parse(ua) {
        /** The environment context object. */
        var context = root;
        /** Used to flag when a custom context is provided. */

        var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String'; // Juggle arguments.

        if (isCustomContext) {
          context = ua;
          ua = null;
        }
        /** Browser navigator object. */


        var nav = context.navigator || {};
        /** Browser user agent string. */

        var userAgent = nav.userAgent || '';
        ua || (ua = userAgent);
        /** Used to flag when `thisBinding` is the [ModuleScope]. */

        var isModuleScope = isCustomContext || thisBinding == oldRoot;
        /** Used to detect if browser is like Chrome. */

        var likeChrome = isCustomContext ? !!nav.likeChrome : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());
        /** Internal `[[Class]]` value shortcuts. */

        var objectClass = 'Object',
            airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
            enviroClass = isCustomContext ? objectClass : 'Environment',
            javaClass = isCustomContext && context.java ? 'JavaPackage' : getClassOf(context.java),
            phantomClass = isCustomContext ? objectClass : 'RuntimeObject';
        /** Detect Java environments. */

        var java = /\bJava/.test(javaClass) && context.java;
        /** Detect Rhino. */

        var rhino = java && getClassOf(context.environment) == enviroClass;
        /** A character to represent alpha. */

        var alpha = java ? 'a' : '\u03b1';
        /** A character to represent beta. */

        var beta = java ? 'b' : '\u03b2';
        /** Browser document object. */

        var doc = context.document || {};
        /**
         * Detect Opera browser (Presto-based).
         * http://www.howtocreate.co.uk/operaStuff/operaObject.html
         * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
         */

        var opera = context.operamini || context.opera;
        /** Opera `[[Class]]`. */

        var operaClass = reOpera.test(operaClass = isCustomContext && opera ? opera['[[Class]]'] : getClassOf(opera)) ? operaClass : opera = null;
        /*------------------------------------------------------------------------*/

        /** Temporary variable used over the script's lifetime. */

        var data;
        /** The CPU architecture. */

        var arch = ua;
        /** Platform description array. */

        var description = [];
        /** Platform alpha/beta indicator. */

        var prerelease = null;
        /** A flag to indicate that environment features should be used to resolve the platform. */

        var useFeatures = ua == userAgent;
        /** The browser/environment version. */

        var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();
        /** A flag to indicate if the OS ends with "/ Version" */

        var isSpecialCasedOS;
        /* Detectable layout engines (order is important). */

        var layout = getLayout([{
          'label': 'EdgeHTML',
          'pattern': 'Edge'
        }, 'Trident', {
          'label': 'WebKit',
          'pattern': 'AppleWebKit'
        }, 'iCab', 'Presto', 'NetFront', 'Tasman', 'KHTML', 'Gecko']);
        /* Detectable browser names (order is important). */

        var name = getName(['Adobe AIR', 'Arora', 'Avant Browser', 'Breach', 'Camino', 'Electron', 'Epiphany', 'Fennec', 'Flock', 'Galeon', 'GreenBrowser', 'iCab', 'Iceweasel', 'K-Meleon', 'Konqueror', 'Lunascape', 'Maxthon', {
          'label': 'Microsoft Edge',
          'pattern': 'Edge'
        }, 'Midori', 'Nook Browser', 'PaleMoon', 'PhantomJS', 'Raven', 'Rekonq', 'RockMelt', {
          'label': 'Samsung Internet',
          'pattern': 'SamsungBrowser'
        }, 'SeaMonkey', {
          'label': 'Silk',
          'pattern': '(?:Cloud9|Silk-Accelerated)'
        }, 'Sleipnir', 'SlimBrowser', {
          'label': 'SRWare Iron',
          'pattern': 'Iron'
        }, 'Sunrise', 'Swiftfox', 'Waterfox', 'WebPositive', 'Opera Mini', {
          'label': 'Opera Mini',
          'pattern': 'OPiOS'
        }, 'Opera', {
          'label': 'Opera',
          'pattern': 'OPR'
        }, 'Chrome', {
          'label': 'Chrome Mobile',
          'pattern': '(?:CriOS|CrMo)'
        }, {
          'label': 'Firefox',
          'pattern': '(?:Firefox|Minefield)'
        }, {
          'label': 'Firefox for iOS',
          'pattern': 'FxiOS'
        }, {
          'label': 'IE',
          'pattern': 'IEMobile'
        }, {
          'label': 'IE',
          'pattern': 'MSIE'
        }, 'Safari']);
        /* Detectable products (order is important). */

        var product = getProduct([{
          'label': 'BlackBerry',
          'pattern': 'BB10'
        }, 'BlackBerry', {
          'label': 'Galaxy S',
          'pattern': 'GT-I9000'
        }, {
          'label': 'Galaxy S2',
          'pattern': 'GT-I9100'
        }, {
          'label': 'Galaxy S3',
          'pattern': 'GT-I9300'
        }, {
          'label': 'Galaxy S4',
          'pattern': 'GT-I9500'
        }, {
          'label': 'Galaxy S5',
          'pattern': 'SM-G900'
        }, {
          'label': 'Galaxy S6',
          'pattern': 'SM-G920'
        }, {
          'label': 'Galaxy S6 Edge',
          'pattern': 'SM-G925'
        }, {
          'label': 'Galaxy S7',
          'pattern': 'SM-G930'
        }, {
          'label': 'Galaxy S7 Edge',
          'pattern': 'SM-G935'
        }, 'Google TV', 'Lumia', 'iPad', 'iPod', 'iPhone', 'Kindle', {
          'label': 'Kindle Fire',
          'pattern': '(?:Cloud9|Silk-Accelerated)'
        }, 'Nexus', 'Nook', 'PlayBook', 'PlayStation Vita', 'PlayStation', 'TouchPad', 'Transformer', {
          'label': 'Wii U',
          'pattern': 'WiiU'
        }, 'Wii', 'Xbox One', {
          'label': 'Xbox 360',
          'pattern': 'Xbox'
        }, 'Xoom']);
        /* Detectable manufacturers. */

        var manufacturer = getManufacturer({
          'Apple': {
            'iPad': 1,
            'iPhone': 1,
            'iPod': 1
          },
          'Archos': {},
          'Amazon': {
            'Kindle': 1,
            'Kindle Fire': 1
          },
          'Asus': {
            'Transformer': 1
          },
          'Barnes & Noble': {
            'Nook': 1
          },
          'BlackBerry': {
            'PlayBook': 1
          },
          'Google': {
            'Google TV': 1,
            'Nexus': 1
          },
          'HP': {
            'TouchPad': 1
          },
          'HTC': {},
          'LG': {},
          'Microsoft': {
            'Xbox': 1,
            'Xbox One': 1
          },
          'Motorola': {
            'Xoom': 1
          },
          'Nintendo': {
            'Wii U': 1,
            'Wii': 1
          },
          'Nokia': {
            'Lumia': 1
          },
          'Samsung': {
            'Galaxy S': 1,
            'Galaxy S2': 1,
            'Galaxy S3': 1,
            'Galaxy S4': 1
          },
          'Sony': {
            'PlayStation': 1,
            'PlayStation Vita': 1
          }
        });
        /* Detectable operating systems (order is important). */

        var os = getOS(['Windows Phone', 'Android', 'CentOS', {
          'label': 'Chrome OS',
          'pattern': 'CrOS'
        }, 'Debian', 'Fedora', 'FreeBSD', 'Gentoo', 'Haiku', 'Kubuntu', 'Linux Mint', 'OpenBSD', 'Red Hat', 'SuSE', 'Ubuntu', 'Xubuntu', 'Cygwin', 'Symbian OS', 'hpwOS', 'webOS ', 'webOS', 'Tablet OS', 'Tizen', 'Linux', 'Mac OS X', 'Macintosh', 'Mac', 'Windows 98;', 'Windows ']);
        /*------------------------------------------------------------------------*/

        /**
         * Picks the layout engine from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected layout engine.
         */

        function getLayout(guesses) {
          return reduce(guesses, function (result, guess) {
            return result || RegExp('\\b' + (guess.pattern || qualify(guess)) + '\\b', 'i').exec(ua) && (guess.label || guess);
          });
        }
        /**
         * Picks the manufacturer from an array of guesses.
         *
         * @private
         * @param {Array} guesses An object of guesses.
         * @returns {null|string} The detected manufacturer.
         */


        function getManufacturer(guesses) {
          return reduce(guesses, function (result, value, key) {
            // Lookup the manufacturer by product or scan the UA for the manufacturer.
            return result || (value[product] || value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] || RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)) && key;
          });
        }
        /**
         * Picks the browser name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected browser name.
         */


        function getName(guesses) {
          return reduce(guesses, function (result, guess) {
            return result || RegExp('\\b' + (guess.pattern || qualify(guess)) + '\\b', 'i').exec(ua) && (guess.label || guess);
          });
        }
        /**
         * Picks the OS name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected OS name.
         */


        function getOS(guesses) {
          return reduce(guesses, function (result, guess) {
            var pattern = guess.pattern || qualify(guess);

            if (!result && (result = RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua))) {
              result = cleanupOS(result, pattern, guess.label || guess);
            }

            return result;
          });
        }
        /**
         * Picks the product name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected product name.
         */


        function getProduct(guesses) {
          return reduce(guesses, function (result, guess) {
            var pattern = guess.pattern || qualify(guess);

            if (!result && (result = RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) || RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) || RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua))) {
              // Split by forward slash and append product version if needed.
              if ((result = String(guess.label && !RegExp(pattern, 'i').test(guess.label) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
                result[0] += ' ' + result[1];
              } // Correct character case and cleanup string.


              guess = guess.label || guess;
              result = format(result[0].replace(RegExp(pattern, 'i'), guess).replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ').replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
            }

            return result;
          });
        }
        /**
         * Resolves the version using an array of UA patterns.
         *
         * @private
         * @param {Array} patterns An array of UA patterns.
         * @returns {null|string} The detected version.
         */


        function getVersion(patterns) {
          return reduce(patterns, function (result, pattern) {
            return result || (RegExp(pattern + '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
          });
        }
        /**
         * Returns `platform.description` when the platform object is coerced to a string.
         *
         * @name toString
         * @memberOf platform
         * @returns {string} Returns `platform.description` if available, else an empty string.
         */


        function toStringPlatform() {
          return this.description || '';
        }
        /*------------------------------------------------------------------------*/
        // Convert layout to an array so we can add extra details.


        layout && (layout = [layout]); // Detect product names that contain their manufacturer's name.

        if (manufacturer && !product) {
          product = getProduct([manufacturer]);
        } // Clean up Google TV.


        if (data = /\bGoogle TV\b/.exec(product)) {
          product = data[0];
        } // Detect simulators.


        if (/\bSimulator\b/i.test(ua)) {
          product = (product ? product + ' ' : '') + 'Simulator';
        } // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.


        if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
          description.push('running in Turbo/Uncompressed mode');
        } // Detect IE Mobile 11.


        if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
          data = parse(ua.replace(/like iPhone OS/, ''));
          manufacturer = data.manufacturer;
          product = data.product;
        } // Detect iOS.
        else if (/^iP/.test(product)) {
            name || (name = 'Safari');
            os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua)) ? ' ' + data[1].replace(/_/g, '.') : '');
          } // Detect Kubuntu.
          else if (name == 'Konqueror' && !/buntu/i.test(os)) {
              os = 'Kubuntu';
            } // Detect Android browsers.
            else if (manufacturer && manufacturer != 'Google' && (/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua) || /\bVita\b/.test(product)) || /\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua)) {
                name = 'Android Browser';
                os = /\bAndroid\b/.test(os) ? os : 'Android';
              } // Detect Silk desktop/accelerated modes.
              else if (name == 'Silk') {
                  if (!/\bMobi/i.test(ua)) {
                    os = 'Android';
                    description.unshift('desktop mode');
                  }

                  if (/Accelerated *= *true/i.test(ua)) {
                    description.unshift('accelerated');
                  }
                } // Detect PaleMoon identifying as Firefox.
                else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
                    description.push('identifying as Firefox ' + data[1]);
                  } // Detect Firefox OS and products running Firefox.
                  else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
                      os || (os = 'Firefox OS');
                      product || (product = data[1]);
                    } // Detect false positives for Firefox/Safari.
                    else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
                        // Escape the `/` for Firefox 1.
                        if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
                          // Clear name of false positives.
                          name = null;
                        } // Reassign a generic name.


                        if ((data = product || manufacturer || os) && (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
                          name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
                        }
                      } // Add Chrome version to description for Electron.
                      else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
                          description.push('Chromium ' + data);
                        } // Detect non-Opera (Presto-based) versions (order is important).


        if (!version) {
          version = getVersion(['(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))', 'Version', qualify(name), '(?:Firefox|Minefield|NetFront)']);
        } // Detect stubborn layout engines.


        if (data = layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' || /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') || /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' || !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') || layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront') {
          layout = [data];
        } // Detect Windows Phone 7 desktop mode.


        if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
          name += ' Mobile';
          os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
          description.unshift('desktop mode');
        } // Detect Windows Phone 8.x desktop mode.
        else if (/\bWPDesktop\b/i.test(ua)) {
            name = 'IE Mobile';
            os = 'Windows Phone 8.x';
            description.unshift('desktop mode');
            version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
          } // Detect IE 11 identifying as other browsers.
          else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
              if (name) {
                description.push('identifying as ' + name + (version ? ' ' + version : ''));
              }

              name = 'IE';
              version = data[1];
            } // Leverage environment features.


        if (useFeatures) {
          // Detect server-side environments.
          // Rhino has a global function while others have a global object.
          if (isHostType(context, 'global')) {
            if (java) {
              data = java.lang.System;
              arch = data.getProperty('os.arch');
              os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
            }

            if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
              os || (os = data[0].os || null);

              try {
                data[1] = context.require('ringo/engine').version;
                version = data[1].join('.');
                name = 'RingoJS';
              } catch (e) {
                if (data[0].global.system == context.system) {
                  name = 'Narwhal';
                }
              }
            } else if (typeof context.process == 'object' && !context.process.browser && (data = context.process)) {
              if (typeof data.versions == 'object') {
                if (typeof data.versions.electron == 'string') {
                  description.push('Node ' + data.versions.node);
                  name = 'Electron';
                  version = data.versions.electron;
                } else if (typeof data.versions.nw == 'string') {
                  description.push('Chromium ' + version, 'Node ' + data.versions.node);
                  name = 'NW.js';
                  version = data.versions.nw;
                }
              } else {
                name = 'Node.js';
                arch = data.arch;
                os = data.platform;
                version = /[\d.]+/.exec(data.version);
                version = version ? version[0] : 'unknown';
              }
            } else if (rhino) {
              name = 'Rhino';
            }
          } // Detect Adobe AIR.
          else if (getClassOf(data = context.runtime) == airRuntimeClass) {
              name = 'Adobe AIR';
              os = data.flash.system.Capabilities.os;
            } // Detect PhantomJS.
            else if (getClassOf(data = context.phantom) == phantomClass) {
                name = 'PhantomJS';
                version = (data = data.version || null) && data.major + '.' + data.minor + '.' + data.patch;
              } // Detect IE compatibility modes.
              else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
                  // We're in compatibility mode when the Trident version + 4 doesn't
                  // equal the document mode.
                  version = [version, doc.documentMode];

                  if ((data = +data[1] + 4) != version[1]) {
                    description.push('IE ' + version[1] + ' mode');
                    layout && (layout[1] = '');
                    version[1] = data;
                  }

                  version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
                } // Detect IE 11 masking as other browsers.
                else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
                    description.push('masking as ' + name + ' ' + version);
                    name = 'IE';
                    version = '11.0';
                    layout = ['Trident'];
                    os = 'Windows';
                  }

          os = os && format(os);
        } // Detect prerelease phases.


        if (version && (data = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) || /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) || /\bMinefield\b/i.test(ua) && 'a')) {
          prerelease = /b/i.test(data) ? 'beta' : 'alpha';
          version = version.replace(RegExp(data + '\\+?$'), '') + (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
        } // Detect Firefox Mobile.


        if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
          name = 'Firefox Mobile';
        } // Obscure Maxthon's unreliable version.
        else if (name == 'Maxthon' && version) {
            version = version.replace(/\.[\d.]+/, '.x');
          } // Detect Xbox 360 and Xbox One.
          else if (/\bXbox\b/i.test(product)) {
              if (product == 'Xbox 360') {
                os = null;
              }

              if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
                description.unshift('mobile mode');
              }
            } // Add mobile postfix.
            else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) && (os == 'Windows CE' || /Mobi/i.test(ua))) {
                name += ' Mobile';
              } // Detect IE platform preview.
              else if (name == 'IE' && useFeatures) {
                  try {
                    if (context.external === null) {
                      description.unshift('platform preview');
                    }
                  } catch (e) {
                    description.unshift('embedded');
                  }
                } // Detect BlackBerry OS version.
                // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
                else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data = (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] || version)) {
                    data = [data, /BB10/.test(ua)];
                    os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
                    version = null;
                  } // Detect Opera identifying/masking itself as another browser.
                  // http://www.opera.com/support/kb/view/843/
                  else if (this != forOwn && product != 'Wii' && (useFeatures && opera || /Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua) || name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os) || name == 'IE' && (os && !/^Win/.test(os) && version > 5.5 || /\bWindows XP\b/.test(os) && version > 8 || version == 8 && !/\bTrident\b/.test(ua))) && !reOpera.test(data = parse.call(forOwn, ua.replace(reOpera, '') + ';')) && data.name) {
                      // When "identifying", the UA contains both Opera and the other browser's name.
                      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');

                      if (reOpera.test(name)) {
                        if (/\bIE\b/.test(data) && os == 'Mac OS') {
                          os = null;
                        }

                        data = 'identify' + data;
                      } // When "masking", the UA contains only the other browser's name.
                      else {
                          data = 'mask' + data;

                          if (operaClass) {
                            name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
                          } else {
                            name = 'Opera';
                          }

                          if (/\bIE\b/.test(data)) {
                            os = null;
                          }

                          if (!useFeatures) {
                            version = null;
                          }
                        }

                      layout = ['Presto'];
                      description.push(data);
                    } // Detect WebKit Nightly and approximate Chrome/Safari versions.


        if (data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1]) {
          // Correct build number for numeric comparison.
          // (e.g. "532.5" becomes "532.05")
          data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data]; // Nightly builds are postfixed with a "+".

          if (name == 'Safari' && data[1].slice(-1) == '+') {
            name = 'WebKit Nightly';
            prerelease = 'alpha';
            version = data[1].slice(0, -1);
          } // Clear incorrect browser versions.
          else if (version == data[1] || version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
              version = null;
            } // Use the full Chrome version when available.


          data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1]; // Detect Blink layout engine.

          if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
            layout = ['Blink'];
          } // Detect JavaScriptCore.
          // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi


          if (!useFeatures || !likeChrome && !data[1]) {
            layout && (layout[1] = 'like Safari');
            data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
          } else {
            layout && (layout[1] = 'like Chrome');
            data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
          } // Add the postfix of ".x" or "+" for approximate versions.


          layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+')); // Obscure version for some Safari 1-2 releases.

          if (name == 'Safari' && (!version || parseInt(version) > 45)) {
            version = data;
          }
        } // Detect Opera desktop modes.


        if (name == 'Opera' && (data = /\bzbov|zvav$/.exec(os))) {
          name += ' ';
          description.unshift('desktop mode');

          if (data == 'zvav') {
            name += 'Mini';
            version = null;
          } else {
            name += 'Mobile';
          }

          os = os.replace(RegExp(' *' + data + '$'), '');
        } // Detect Chrome desktop mode.
        else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
            description.unshift('desktop mode');
            name = 'Chrome Mobile';
            version = null;

            if (/\bOS X\b/.test(os)) {
              manufacturer = 'Apple';
              os = 'iOS 4.3+';
            } else {
              os = null;
            }
          } // Strip incorrect OS versions.


        if (version && version.indexOf(data = /[\d.]+$/.exec(os)) == 0 && ua.indexOf('/' + data + '-') > -1) {
          os = trim(os.replace(data, ''));
        } // Add layout engine.


        if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (/Browser|Lunascape|Maxthon/.test(name) || name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
          // Don't add layout details to description if they are falsey.
          (data = layout[layout.length - 1]) && description.push(data);
        } // Combine contextual information.


        if (description.length) {
          description = ['(' + description.join('; ') + ')'];
        } // Append manufacturer to description.


        if (manufacturer && product && product.indexOf(manufacturer) < 0) {
          description.push('on ' + manufacturer);
        } // Append product to description.


        if (product) {
          description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
        } // Parse the OS into an object.


        if (os) {
          data = / ([\d.+]+)$/.exec(os);
          isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
          os = {
            'architecture': 32,
            'family': data && !isSpecialCasedOS ? os.replace(data[0], '') : os,
            'version': data ? data[1] : null,
            'toString': function toString() {
              var version = this.version;
              return this.family + (version && !isSpecialCasedOS ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
            }
          };
        } // Add browser/OS architecture.


        if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
          if (os) {
            os.architecture = 64;
            os.family = os.family.replace(RegExp(' *' + data), '');
          }

          if (name && (/\bWOW64\b/i.test(ua) || useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua))) {
            description.unshift('32-bit');
          }
        } // Chrome 39 and above on OS X is always 64-bit.
        else if (os && /^OS X/.test(os.family) && name == 'Chrome' && parseFloat(version) >= 39) {
            os.architecture = 64;
          }

        ua || (ua = null);
        /*------------------------------------------------------------------------*/

        /**
         * The platform object.
         *
         * @name platform
         * @type Object
         */

        var platform = {};
        /**
         * The platform description.
         *
         * @memberOf platform
         * @type string|null
         */

        platform.description = ua;
        /**
         * The name of the browser's layout engine.
         *
         * The list of common layout engines include:
         * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
         *
         * @memberOf platform
         * @type string|null
         */

        platform.layout = layout && layout[0];
        /**
         * The name of the product's manufacturer.
         *
         * The list of manufacturers include:
         * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
         * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
         * "Nokia", "Samsung" and "Sony"
         *
         * @memberOf platform
         * @type string|null
         */

        platform.manufacturer = manufacturer;
        /**
         * The name of the browser/environment.
         *
         * The list of common browser names include:
         * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
         * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
         * "Opera Mini" and "Opera"
         *
         * Mobile versions of some browsers have "Mobile" appended to their name:
         * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
         *
         * @memberOf platform
         * @type string|null
         */

        platform.name = name;
        /**
         * The alpha/beta release indicator.
         *
         * @memberOf platform
         * @type string|null
         */

        platform.prerelease = prerelease;
        /**
         * The name of the product hosting the browser.
         *
         * The list of common products include:
         *
         * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
         * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
         *
         * @memberOf platform
         * @type string|null
         */

        platform.product = product;
        /**
         * The browser's user agent string.
         *
         * @memberOf platform
         * @type string|null
         */

        platform.ua = ua;
        /**
         * The browser/environment version.
         *
         * @memberOf platform
         * @type string|null
         */

        platform.version = name && version;
        /**
         * The name of the operating system.
         *
         * @memberOf platform
         * @type Object
         */

        platform.os = os || {
          /**
           * The CPU architecture the OS is built for.
           *
           * @memberOf platform.os
           * @type number|null
           */
          'architecture': null,

          /**
           * The family of the OS.
           *
           * Common values include:
           * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
           * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
           * "Android", "iOS" and "Windows Phone"
           *
           * @memberOf platform.os
           * @type string|null
           */
          'family': null,

          /**
           * The version of the OS.
           *
           * @memberOf platform.os
           * @type string|null
           */
          'version': null,

          /**
           * Returns the OS string.
           *
           * @memberOf platform.os
           * @returns {string} The OS string.
           */
          'toString': function toString() {
            return 'null';
          }
        };
        platform.parse = parse;
        platform.toString = toStringPlatform;

        if (platform.version) {
          description.unshift(version);
        }

        if (platform.name) {
          description.unshift(name);
        }

        if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
          description.push(product ? '(' + os + ')' : 'on ' + os);
        }

        if (description.length) {
          platform.description = description.join(' ');
        }

        return platform;
      }
      /*--------------------------------------------------------------------------*/
      // Export platform.


      var platform = parse(); // Some AMD build optimizers, like r.js, check for condition patterns like the following:

      if (freeExports && freeModule) {
          // Export for CommonJS support.
          forOwn(platform, function (value, key) {
            freeExports[key] = value;
          });
        } else {
          // Export to the global object.
          root.platform = platform;
        }
    }).call(commonjsGlobal);
  });

  var DeviceOrientationModule_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var _get = function get(object, property, receiver) {
      if (object === null) object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent === null) {
          return undefined;
        } else {
          return get(parent, property, receiver);
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;

        if (getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
    };

    var _DOMEventSubmodule2 = _interopRequireDefault(DOMEventSubmodule_1);

    var _InputModule3 = _interopRequireDefault(InputModule_1);

    var _MotionInput2 = _interopRequireDefault(MotionInput_1);

    var _platform2 = _interopRequireDefault(platform);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _possibleConstructorReturn(self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    /**
     * Converts degrees to radians.
     *
     * @param {number} deg - Angle in degrees.
     * @return {number}
     */


    function degToRad(deg) {
      return deg * Math.PI / 180;
    }
    /**
     * Converts radians to degrees.
     *
     * @param {number} rad - Angle in radians.
     * @return {number}
     */


    function radToDeg(rad) {
      return rad * 180 / Math.PI;
    }
    /**
     * Normalizes a 3 x 3 matrix.
     *
     * @param {number[]} m - Matrix to normalize, represented by an array of length 9.
     * @return {number[]}
     */


    function normalize(m) {
      var det = m[0] * m[4] * m[8] + m[1] * m[5] * m[6] + m[2] * m[3] * m[7] - m[0] * m[5] * m[7] - m[1] * m[3] * m[8] - m[2] * m[4] * m[6];

      for (var i = 0; i < m.length; i++) {
        m[i] /= det;
      }

      return m;
    }
    /**
     * Converts a Euler angle `[alpha, beta, gamma]` to the W3C specification, where:
     * - `alpha` is in [0; +360[;
     * - `beta` is in [-180; +180[;
     * - `gamma` is in [-90; +90[.
     *
     * @param {number[]} eulerAngle - Euler angle to unify, represented by an array of length 3 (`[alpha, beta, gamma]`).
     * @see {@link http://www.w3.org/TR/orientation-event/}
     */


    function unify(eulerAngle) {
      // Cf. W3C specification (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
      // and Euler angles Wikipedia page (http://en.wikipedia.org/wiki/Euler_angles).
      //
      // W3C convention: Tait–Bryan angles Z-X'-Y'', where:
      //   alpha is in [0; +360[,
      //   beta is in [-180; +180[,
      //   gamma is in [-90; +90[.
      var alphaIsValid = typeof eulerAngle[0] === 'number';

      var _alpha = alphaIsValid ? degToRad(eulerAngle[0]) : 0;

      var _beta = degToRad(eulerAngle[1]);

      var _gamma = degToRad(eulerAngle[2]);

      var cA = Math.cos(_alpha);
      var cB = Math.cos(_beta);
      var cG = Math.cos(_gamma);
      var sA = Math.sin(_alpha);
      var sB = Math.sin(_beta);
      var sG = Math.sin(_gamma);
      var alpha = void 0,
          beta = void 0,
          gamma = void 0;
      var m = [cA * cG - sA * sB * sG, -cB * sA, cA * sG + cG * sA * sB, cG * sA + cA * sB * sG, cA * cB, sA * sG - cA * cG * sB, -cB * sG, sB, cB * cG];
      normalize(m); // Since we want gamma in [-90; +90[, cG >= 0.

      if (m[8] > 0) {
        // Case 1: m[8] > 0 <=> cB > 0                 (and cG != 0)
        //                  <=> beta in ]-pi/2; +pi/2[ (and cG != 0)
        alpha = Math.atan2(-m[1], m[4]);
        beta = Math.asin(m[7]); // asin returns a number between -pi/2 and +pi/2 => OK

        gamma = Math.atan2(-m[6], m[8]);
      } else if (m[8] < 0) {
        // Case 2: m[8] < 0 <=> cB < 0                            (and cG != 0)
        //                  <=> beta in [-pi; -pi/2[ U ]+pi/2; +pi] (and cG != 0)
        // Since cB < 0 and cB is in m[1] and m[4], the point is flipped by 180 degrees.
        // Hence, we have to multiply both arguments of atan2 by -1 in order to revert
        // the point in its original position (=> another flip by 180 degrees).
        alpha = Math.atan2(m[1], -m[4]);
        beta = -Math.asin(m[7]);
        beta += beta >= 0 ? -Math.PI : Math.PI; // asin returns a number between -pi/2 and pi/2 => make sure beta in [-pi; -pi/2[ U ]+pi/2; +pi]

        gamma = Math.atan2(m[6], -m[8]); // same remark as for alpha, multiplication by -1
      } else {
        // Case 3: m[8] = 0 <=> cB = 0 or cG = 0
        if (m[6] > 0) {
          // Subcase 1: cG = 0 and cB > 0
          //            cG = 0 <=> sG = -1 <=> gamma = -pi/2 => m[6] = cB
          //            Hence, m[6] > 0 <=> cB > 0 <=> beta in ]-pi/2; +pi/2[
          alpha = Math.atan2(-m[1], m[4]);
          beta = Math.asin(m[7]); // asin returns a number between -pi/2 and +pi/2 => OK

          gamma = -Math.PI / 2;
        } else if (m[6] < 0) {
          // Subcase 2: cG = 0 and cB < 0
          //            cG = 0 <=> sG = -1 <=> gamma = -pi/2 => m[6] = cB
          //            Hence, m[6] < 0 <=> cB < 0 <=> beta in [-pi; -pi/2[ U ]+pi/2; +pi]
          alpha = Math.atan2(m[1], -m[4]); // same remark as for alpha in a case above

          beta = -Math.asin(m[7]);
          beta += beta >= 0 ? -Math.PI : Math.PI; // asin returns a number between -pi/2 and +pi/2 => make sure beta in [-pi; -pi/2[ U ]+pi/2; +pi]

          gamma = -Math.PI / 2;
        } else {
          // Subcase 3: cB = 0
          // In the case where cos(beta) = 0 (i.e. beta = -pi/2 or beta = pi/2),
          // we have the gimbal lock problem: in that configuration, only the angle
          // alpha + gamma (if beta = +pi/2) or alpha - gamma (if beta = -pi/2)
          // are uniquely defined: alpha and gamma can take an infinity of values.
          // For convenience, let's set gamma = 0 (and thus sin(gamma) = 0).
          // (As a consequence of the gimbal lock problem, there is a discontinuity
          // in alpha and gamma.)
          alpha = Math.atan2(m[3], m[0]);
          beta = m[7] > 0 ? Math.PI / 2 : -Math.PI / 2;
          gamma = 0;
        }
      } // atan2 returns a number between -pi and pi => make sure that alpha is in [0, 2*pi[.


      alpha += alpha < 0 ? 2 * Math.PI : 0;
      eulerAngle[0] = alphaIsValid ? radToDeg(alpha) : null;
      eulerAngle[1] = radToDeg(beta);
      eulerAngle[2] = radToDeg(gamma);
    }
    /**
     * Converts a Euler angle `[alpha, beta, gamma]` to a Euler angle where:
     * - `alpha` is in [0; +360[;
     * - `beta` is in [-90; +90[;
     * - `gamma` is in [-180; +180[.
     *
     * @param {number[]} eulerAngle - Euler angle to convert, represented by an array of length 3 (`[alpha, beta, gamma]`).
     */


    function unifyAlt(eulerAngle) {
      // Convention here: Tait–Bryan angles Z-X'-Y'', where:
      //   alpha is in [0; +360[,
      //   beta is in [-90; +90[,
      //   gamma is in [-180; +180[.
      var alphaIsValid = typeof eulerAngle[0] === 'number';

      var _alpha = alphaIsValid ? degToRad(eulerAngle[0]) : 0;

      var _beta = degToRad(eulerAngle[1]);

      var _gamma = degToRad(eulerAngle[2]);

      var cA = Math.cos(_alpha);
      var cB = Math.cos(_beta);
      var cG = Math.cos(_gamma);
      var sA = Math.sin(_alpha);
      var sB = Math.sin(_beta);
      var sG = Math.sin(_gamma);
      var alpha = void 0,
          beta = void 0,
          gamma = void 0;
      var m = [cA * cG - sA * sB * sG, -cB * sA, cA * sG + cG * sA * sB, cG * sA + cA * sB * sG, cA * cB, sA * sG - cA * cG * sB, -cB * sG, sB, cB * cG];
      normalize(m);
      alpha = Math.atan2(-m[1], m[4]);
      alpha += alpha < 0 ? 2 * Math.PI : 0; // atan2 returns a number between -pi and +pi => make sure alpha is in [0, 2*pi[.

      beta = Math.asin(m[7]); // asin returns a number between -pi/2 and pi/2 => OK

      gamma = Math.atan2(-m[6], m[8]); // atan2 returns a number between -pi and +pi => OK

      eulerAngle[0] = alphaIsValid ? radToDeg(alpha) : null;
      eulerAngle[1] = radToDeg(beta);
      eulerAngle[2] = radToDeg(gamma);
    }
    /**
     * `DeviceOrientationModule` singleton.
     * The `DeviceOrientationModule` singleton provides the raw values
     * of the orientation provided by the `DeviceMotion` event.
     * It also instantiate the `Orientation` submodule that unifies those
     * values across platforms by making them compliant with {@link
     * http://www.w3.org/TR/orientation-event/|the W3C standard} (*i.e.*
     * the `alpha` angle between `0` and `360` degrees, the `beta` angle
     * between `-180` and `180` degrees, and `gamma` between `-90` and
     * `90` degrees), as well as the `OrientationAlt` submodules (with
     * the `alpha` angle between `0` and `360` degrees, the `beta` angle
     * between `-90` and `90` degrees, and `gamma` between `-180` and
     * `180` degrees).
     * When the `orientation` raw values are not provided by the sensors,
     * this modules tries to recalculate `beta` and `gamma` from the
     * `AccelerationIncludingGravity` module, if available (in that case,
     * the `alpha` angle is impossible to retrieve since the compass is
     * not available).
     *
     * @class DeviceMotionModule
     * @extends InputModule
     */


    var DeviceOrientationModule = function (_InputModule) {
      _inherits(DeviceOrientationModule, _InputModule);
      /**
       * Creates the `DeviceOrientation` module instance.
       *
       * @constructor
       */


      function DeviceOrientationModule() {
        _classCallCheck(this, DeviceOrientationModule);
        /**
         * Raw values coming from the `deviceorientation` event sent by this module.
         *
         * @this DeviceOrientationModule
         * @type {number[]}
         * @default [null, null, null]
         */


        var _this = _possibleConstructorReturn(this, (DeviceOrientationModule.__proto__ || Object.getPrototypeOf(DeviceOrientationModule)).call(this, 'deviceorientation'));

        _this.event = [null, null, null];
        /**
         * The `Orientation` module.
         * Provides unified values of the orientation compliant with {@link
         * http://www.w3.org/TR/orientation-event/|the W3C standard}
         * (`alpha` in `[0, 360]`, beta in `[-180, +180]`, `gamma` in `[-90, +90]`).
         *
         * @this DeviceOrientationModule
         * @type {DOMEventSubmodule}
         */

        _this.orientation = new _DOMEventSubmodule2.default(_this, 'orientation');
        /**
         * The `OrientationAlt` module.
         * Provides alternative values of the orientation
         * (`alpha` in `[0, 360]`, beta in `[-90, +90]`, `gamma` in `[-180, +180]`).
         *
         * @this DeviceOrientationModule
         * @type {DOMEventSubmodule}
         */

        _this.orientationAlt = new _DOMEventSubmodule2.default(_this, 'orientationAlt');
        /**
         * Required submodules / events.
         *
         * @this DeviceOrientationModule
         * @type {object}
         * @property {bool} orientation - Indicates whether the `orientation` unified values are required or not (defaults to `false`).
         * @property {bool} orientationAlt - Indicates whether the `orientationAlt` values are required or not (defaults to `false`).
         */

        _this.required = {
          orientation: false,
          orientationAlt: false
        };
        /**
         * Resolve function of the module's promise.
         *
         * @this DeviceOrientationModule
         * @type {function}
         * @default null
         * @see DeviceOrientationModule#init
         */

        _this._promiseResolve = null;
        /**
         * Gravity vector calculated from the `accelerationIncludingGravity` unified values.
         *
         * @this DeviceOrientationModule
         * @type {number[]}
         * @default [0, 0, 0]
         */

        _this._estimatedGravity = [0, 0, 0];
        _this._processFunction = null;
        _this._process = _this._process.bind(_this);
        _this._deviceorientationCheck = _this._deviceorientationCheck.bind(_this);
        _this._deviceorientationListener = _this._deviceorientationListener.bind(_this);
        return _this;
      }
      /**
       * Sensor check on initialization of the module.
       * This method:
       * - checks whether the `orientation` values are valid or not;
       * - (in the case where orientation raw values are not provided)
       *   tries to calculate the orientation from the
       *   `accelerationIncludingGravity` unified values.
       *
       * @param {DeviceMotionEvent} e - First `'devicemotion'` event caught, on which the check is done.
       */


      _createClass(DeviceOrientationModule, [{
        key: '_deviceorientationCheck',
        value: function _deviceorientationCheck(e) {
          // clear timeout (anti-Firefox bug solution, window event deviceorientation being nver called)
          // set the set timeout in init() function
          clearTimeout(this._checkTimeoutId);
          this.isProvided = true; // Sensor availability for the orientation and alternative orientation

          var rawValuesProvided = typeof e.alpha === 'number' && typeof e.beta === 'number' && typeof e.gamma === 'number';
          this.orientation.isProvided = rawValuesProvided;
          this.orientationAlt.isProvided = rawValuesProvided; // TODO(?): get pseudo-period
          // swap the process function to the

          this._processFunction = this._deviceorientationListener; // If orientation or alternative orientation are not provided by raw sensors but required,
          // try to calculate them with `accelerationIncludingGravity` unified values

          if (this.required.orientation && !this.orientation.isProvided || this.required.orientationAlt && !this.orientationAlt.isProvided) this._tryAccelerationIncludingGravityFallback();else this._promiseResolve(this);
        }
        /**
         * `'deviceorientation'` event callback.
         * This method emits an event with the raw `'deviceorientation'` values,
         * and emits events with the unified `orientation` and / or the
         * `orientationAlt` values if they are required.
         *
         * @param {DeviceOrientationEvent} e - `'deviceorientation'` event the values are calculated from.
         */

      }, {
        key: '_deviceorientationListener',
        value: function _deviceorientationListener(e) {
          // 'deviceorientation' event (raw values)
          var outEvent = this.event;
          outEvent[0] = e.alpha;
          outEvent[1] = e.beta;
          outEvent[2] = e.gamma;
          if (this.listeners.size > 0) this.emit(outEvent); // 'orientation' event (unified values)

          if (this.orientation.listeners.size > 0 && this.required.orientation && this.orientation.isProvided) {
            // On iOS, the `alpha` value is initialized at `0` on the first `deviceorientation` event
            // so we keep that reference in memory to calculate the North later on
            if (!this.orientation._webkitCompassHeadingReference && e.webkitCompassHeading && _platform2.default.os.family === 'iOS') this.orientation._webkitCompassHeadingReference = e.webkitCompassHeading;
            var _outEvent = this.orientation.event;
            _outEvent[0] = e.alpha;
            _outEvent[1] = e.beta;
            _outEvent[2] = e.gamma; // On iOS, replace the `alpha` value by the North value and unify the angles
            // (the default representation of the angles on iOS is not compliant with the W3C specification)

            if (this.orientation._webkitCompassHeadingReference && _platform2.default.os.family === 'iOS') {
              _outEvent[0] += 360 - this.orientation._webkitCompassHeadingReference;
              unify(_outEvent);
            }

            this.orientation.emit(_outEvent);
          } // 'orientationAlt' event


          if (this.orientationAlt.listeners.size > 0 && this.required.orientationAlt && this.orientationAlt.isProvided) {
            // On iOS, the `alpha` value is initialized at `0` on the first `deviceorientation` event
            // so we keep that reference in memory to calculate the North later on
            if (!this.orientationAlt._webkitCompassHeadingReference && e.webkitCompassHeading && _platform2.default.os.family === 'iOS') this.orientationAlt._webkitCompassHeadingReference = e.webkitCompassHeading;
            var _outEvent2 = this.orientationAlt.event;
            _outEvent2[0] = e.alpha;
            _outEvent2[1] = e.beta;
            _outEvent2[2] = e.gamma; // On iOS, replace the `alpha` value by the North value but do not convert the angles
            // (the default representation of the angles on iOS is compliant with the alternative representation)

            if (this.orientationAlt._webkitCompassHeadingReference && _platform2.default.os.family === 'iOS') {
              _outEvent2[0] -= this.orientationAlt._webkitCompassHeadingReference;
              _outEvent2[0] += _outEvent2[0] < 0 ? 360 : 0; // make sure `alpha` is in [0, +360[
            } // On Android, transform the angles to the alternative representation
            // (the default representation of the angles on Android is compliant with the W3C specification)


            if (_platform2.default.os.family === 'Android') unifyAlt(_outEvent2);
            this.orientationAlt.emit(_outEvent2);
          }
        }
        /**
         * Checks whether `beta` and `gamma` can be calculated from the `accelerationIncludingGravity` values or not.
         */

      }, {
        key: '_tryAccelerationIncludingGravityFallback',
        value: function _tryAccelerationIncludingGravityFallback() {
          var _this2 = this;

          _MotionInput2.default.requireModule('accelerationIncludingGravity').then(function (accelerationIncludingGravity) {
            if (accelerationIncludingGravity.isValid) {
              console.log("WARNING (motion-input): The 'deviceorientation' event does not exist or does not provide values in your browser, so the orientation of the device is estimated from DeviceMotion's 'accelerationIncludingGravity' event. Since the compass is not available, only the `beta` and `gamma` angles are provided (`alpha` is null).");

              if (_this2.required.orientation) {
                _this2.orientation.isCalculated = true;
                _this2.orientation.period = accelerationIncludingGravity.period;

                _MotionInput2.default.addListener('accelerationIncludingGravity', function (accelerationIncludingGravity) {
                  _this2._calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity);
                });
              }

              if (_this2.required.orientationAlt) {
                _this2.orientationAlt.isCalculated = true;
                _this2.orientationAlt.period = accelerationIncludingGravity.period;

                _MotionInput2.default.addListener('accelerationIncludingGravity', function (accelerationIncludingGravity) {
                  _this2._calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity, true);
                });
              }
            }

            _this2._promiseResolve(_this2);
          });
        }
        /**
         * Calculates and emits `beta` and `gamma` values as a fallback of the `orientation` and / or `orientationAlt` events, from the `accelerationIncludingGravity` unified values.
         *
         * @param {number[]} accelerationIncludingGravity - Latest `accelerationIncludingGravity raw values.
         * @param {bool} [alt=false] - Indicates whether we need the alternate representation of the angles or not.
         */

      }, {
        key: '_calculateBetaAndGammaFromAccelerationIncludingGravity',
        value: function _calculateBetaAndGammaFromAccelerationIncludingGravity(accelerationIncludingGravity) {
          var alt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          var k = 0.8; // Low pass filter to estimate the gravity

          this._estimatedGravity[0] = k * this._estimatedGravity[0] + (1 - k) * accelerationIncludingGravity[0];
          this._estimatedGravity[1] = k * this._estimatedGravity[1] + (1 - k) * accelerationIncludingGravity[1];
          this._estimatedGravity[2] = k * this._estimatedGravity[2] + (1 - k) * accelerationIncludingGravity[2];
          var _gX = this._estimatedGravity[0];
          var _gY = this._estimatedGravity[1];
          var _gZ = this._estimatedGravity[2];
          var norm = Math.sqrt(_gX * _gX + _gY * _gY + _gZ * _gZ);
          _gX /= norm;
          _gY /= norm;
          _gZ /= norm; // Adopting the following conventions:
          // - each matrix operates by pre-multiplying column vectors,
          // - each matrix represents an active rotation,
          // - each matrix represents the composition of intrinsic rotations,
          // the rotation matrix representing the composition of a rotation
          // about the x-axis by an angle beta and a rotation about the y-axis
          // by an angle gamma is:
          //
          // [ cos(gamma)               ,  0          ,  sin(gamma)              ,
          //   sin(beta) * sin(gamma)   ,  cos(beta)  ,  -cos(gamma) * sin(beta) ,
          //   -cos(beta) * sin(gamma)  ,  sin(beta)  ,  cos(beta) * cos(gamma)  ].
          //
          // Hence, the projection of the normalized gravity g = [0, 0, 1]
          // in the device's reference frame corresponds to:
          //
          // gX = -cos(beta) * sin(gamma),
          // gY = sin(beta),
          // gZ = cos(beta) * cos(gamma),
          //
          // so beta = asin(gY) and gamma = atan2(-gX, gZ).
          // Beta & gamma equations (we approximate [gX, gY, gZ] by [_gX, _gY, _gZ])

          var beta = radToDeg(Math.asin(_gY)); // beta is in [-pi/2; pi/2[

          var gamma = radToDeg(Math.atan2(-_gX, _gZ)); // gamma is in [-pi; pi[

          if (alt) {
            // In that case, there is nothing to do since the calculations above gave the angle in the right ranges
            var outEvent = this.orientationAlt.event;
            outEvent[0] = null;
            outEvent[1] = beta;
            outEvent[2] = gamma;
            this.orientationAlt.emit(outEvent);
          } else {
            // Here we have to unify the angles to get the ranges compliant with the W3C specification
            var _outEvent3 = this.orientation.event;
            _outEvent3[0] = null;
            _outEvent3[1] = beta;
            _outEvent3[2] = gamma;
            unify(_outEvent3);
            this.orientation.emit(_outEvent3);
          }
        }
      }, {
        key: '_process',
        value: function _process(data) {
          this._processFunction(data);
        }
        /**
         * Initializes of the module.
         *
         * @return {Promise}
         */

      }, {
        key: 'init',
        value: function init() {
          var _this3 = this;

          return _get(DeviceOrientationModule.prototype.__proto__ || Object.getPrototypeOf(DeviceOrientationModule.prototype), 'init', this).call(this, function (resolve) {
            _this3._promiseResolve = resolve;

            if (window.DeviceOrientationEvent) {
              _this3._processFunction = _this3._deviceorientationCheck; // feature detect

              if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(function (permissionState) {
                  if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', _this3._process, false); // set fallback timeout for Firefox (its window never calling the DeviceOrientation event, a 
                    // require of the DeviceOrientation service will result in the require promise never being resolved
                    // hence the Experiment start() method never called)

                    _this3._checkTimeoutId = setTimeout(function () {
                      return resolve(_this3);
                    }, 500);
                  }
                }).catch(console.error);
              } else {
                // handle regular non iOS 13+ devices
                window.addEventListener('deviceorientation', _this3._process, false); // set fallback timeout for Firefox (its window never calling the DeviceOrientation event, a 
                // require of the DeviceOrientation service will result in the require promise never being resolved
                // hence the Experiment start() method never called)

                _this3._checkTimeoutId = setTimeout(function () {
                  return resolve(_this3);
                }, 500);
              }
            } else if (_this3.required.orientation) {
              _this3._tryAccelerationIncludingGravityFallback();
            } else {
              resolve(_this3);
            }
          });
        }
      }]);

      return DeviceOrientationModule;
    }(_InputModule3.default);

    exports.default = new DeviceOrientationModule();
  });
  unwrapExports(DeviceOrientationModule_1);

  var DeviceMotionModule_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var _get = function get(object, property, receiver) {
      if (object === null) object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent === null) {
          return undefined;
        } else {
          return get(parent, property, receiver);
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;

        if (getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
    };

    var _InputModule3 = _interopRequireDefault(InputModule_1);

    var _DOMEventSubmodule2 = _interopRequireDefault(DOMEventSubmodule_1);

    var _MotionInput2 = _interopRequireDefault(MotionInput_1);

    var _platform2 = _interopRequireDefault(platform);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _possibleConstructorReturn(self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    /**
     * Gets the current local time in seconds.
     * Uses `window.performance.now()` if available, and `Date.now()` otherwise.
     *
     * @return {number}
     */


    function getLocalTime() {
      if (window.performance) return window.performance.now() / 1000;
      return Date.now() / 1000;
    }

    var chromeRegExp = /Chrome/;
    var toDeg = 180 / Math.PI;
    /**
     * `DeviceMotion` module singleton.
     * The `DeviceMotionModule` singleton provides the raw values
     * of the acceleration including gravity, acceleration, and rotation
     * rate provided by the `DeviceMotion` event.
     * It also instantiate the `AccelerationIncludingGravity`,
     * `Acceleration` and `RotationRate` submodules that unify those values
     * across platforms by making them compliant with {@link
     * http://www.w3.org/TR/orientation-event/|the W3C standard}.
     * When raw values are not provided by the sensors, this modules tries
     * to recalculate them from available values:
     * - `acceleration` is calculated from `accelerationIncludingGravity`
     *   with a high-pass filter;
     * - (coming soon — waiting for a bug on Chrome to be resolved)
     *   `rotationRate` is calculated from `orientation`.
     *
     * @class DeviceMotionModule
     * @extends InputModule
     */

    var DeviceMotionModule = function (_InputModule) {
      _inherits(DeviceMotionModule, _InputModule);
      /**
       * Creates the `DeviceMotion` module instance.
       *
       * @constructor
       */


      function DeviceMotionModule() {
        _classCallCheck(this, DeviceMotionModule);
        /**
         * Raw values coming from the `devicemotion` event sent by this module.
         *
         * @this DeviceMotionModule
         * @type {number[]}
         * @default [null, null, null, null, null, null, null, null, null]
         */


        var _this = _possibleConstructorReturn(this, (DeviceMotionModule.__proto__ || Object.getPrototypeOf(DeviceMotionModule)).call(this, 'devicemotion'));

        _this.event = [null, null, null, null, null, null, null, null, null];
        /**
         * The `AccelerationIncludingGravity` module.
         * Provides unified values of the acceleration including gravity.
         *
         * @this DeviceMotionModule
         * @type {DOMEventSubmodule}
         */

        _this.accelerationIncludingGravity = new _DOMEventSubmodule2.default(_this, 'accelerationIncludingGravity');
        /**
         * The `Acceleration` submodule.
         * Provides unified values of the acceleration.
         * Estimates the acceleration values from `accelerationIncludingGravity`
         * raw values if the acceleration raw values are not available on the
         * device.
         *
         * @this DeviceMotionModule
         * @type {DOMEventSubmodule}
         */

        _this.acceleration = new _DOMEventSubmodule2.default(_this, 'acceleration');
        /**
         * The `RotationRate` submodule.
         * Provides unified values of the rotation rate.
         * (coming soon, waiting for a bug on Chrome to be resolved)
         * Estimates the rotation rate values from `orientation` values if
         * the rotation rate raw values are not available on the device.
         *
         * @this DeviceMotionModule
         * @type {DOMEventSubmodule}
         */

        _this.rotationRate = new _DOMEventSubmodule2.default(_this, 'rotationRate');
        /**
         * Required submodules / events.
         *
         * @this DeviceMotionModule
         * @type {object}
         * @property {bool} accelerationIncludingGravity - Indicates whether the `accelerationIncludingGravity` unified values are required or not (defaults to `false`).
         * @property {bool} acceleration - Indicates whether the `acceleration` unified values are required or not (defaults to `false`).
         * @property {bool} rotationRate - Indicates whether the `rotationRate` unified values are required or not (defaults to `false`).
         */

        _this.required = {
          accelerationIncludingGravity: false,
          acceleration: false,
          rotationRate: false
        };
        /**
         * Resolve function of the module's promise.
         *
         * @this DeviceMotionModule
         * @type {function}
         * @default null
         * @see DeviceMotionModule#init
         */

        _this._promiseResolve = null;
        /**
         * Unifying factor of the motion data values (`1` on Android, `-1` on iOS).
         *
         * @this DeviceMotionModule
         * @type {number}
         */

        _this._unifyMotionData = _platform2.default.os.family === 'iOS' ? -1 : 1;
        /**
         * Unifying factor of the period (`1` on Android, `1` on iOS). in sec
         * @todo - unify with e.interval specification (in ms) ?
         *
         * @this DeviceMotionModule
         * @type {number}
         */

        _this._unifyPeriod = _platform2.default.os.family === 'Android' ? 0.001 : 1;
        /**
         * Acceleration calculated from the `accelerationIncludingGravity` raw values.
         *
         * @this DeviceMotionModule
         * @type {number[]}
         * @default [0, 0, 0]
         */

        _this._calculatedAcceleration = [0, 0, 0];
        /**
         * Time constant (half-life) of the high-pass filter used to smooth the acceleration values calculated from the acceleration including gravity raw values (in seconds).
         *
         * @this DeviceMotionModule
         * @type {number}
         * @default 0.1
         * @constant
         */

        _this._calculatedAccelerationTimeConstant = 0.1;
        /**
         * Latest `accelerationIncludingGravity` raw value, used in the high-pass filter to calculate the acceleration (if the `acceleration` values are not provided by `'devicemotion'`).
         *
         * @this DeviceMotionModule
         * @type {number[]}
         * @default [0, 0, 0]
         */

        _this._lastAccelerationIncludingGravity = [0, 0, 0];
        /**
         * Rotation rate calculated from the orientation values.
         *
         * @this DeviceMotionModule
         * @type {number[]}
         * @default [0, 0, 0]
         */

        _this._calculatedRotationRate = [0, 0, 0];
        /**
         * Latest orientation value, used to calculate the rotation rate  (if the `rotationRate` values are not provided by `'devicemotion'`).
         *
         * @this DeviceMotionModule
         * @type {number[]}
         * @default [0, 0, 0]
         */

        _this._lastOrientation = [0, 0, 0];
        /**
         * Latest orientation timestamps, used to calculate the rotation rate (if the `rotationRate` values are not provided by `'devicemotion'`).
         *
         * @this DeviceMotionModule
         * @type {number[]}
         * @default [0, 0, 0]
         */

        _this._lastOrientationTimestamp = null;
        _this._processFunction = null;
        _this._process = _this._process.bind(_this);
        _this._devicemotionCheck = _this._devicemotionCheck.bind(_this);
        _this._devicemotionListener = _this._devicemotionListener.bind(_this);
        _this._checkCounter = 0;
        return _this;
      }
      /**
       * Decay factor of the high-pass filter used to calculate the acceleration from the `accelerationIncludingGravity` raw values.
       *
       * @type {number}
       * @readonly
       */


      _createClass(DeviceMotionModule, [{
        key: '_devicemotionCheck',

        /**
         * Sensor check on initialization of the module.
         * This method:
         * - checks whether the `accelerationIncludingGravity`, the `acceleration`,
         *   and the `rotationRate` values are valid or not;
         * - gets the period of the `'devicemotion'` event and sets the period of
         *   the `AccelerationIncludingGravity`, `Acceleration`, and `RotationRate`
         *   submodules;
         * - (in the case where acceleration raw values are not provided)
         *   indicates whether the acceleration can be calculated from the
         *   `accelerationIncludingGravity` unified values or not.
         *
         * @param {DeviceMotionEvent} e - The first `'devicemotion'` event caught.
         */
        value: function _devicemotionCheck(e) {
          // clear timeout (anti-Firefox bug solution, window event deviceorientation being nver called)
          // set the set timeout in init() function
          clearTimeout(this._checkTimeoutId);
          this.isProvided = true;
          this.period = e.interval / 1000;
          this.interval = e.interval; // Sensor availability for the acceleration including gravity

          this.accelerationIncludingGravity.isProvided = e.accelerationIncludingGravity && typeof e.accelerationIncludingGravity.x === 'number' && typeof e.accelerationIncludingGravity.y === 'number' && typeof e.accelerationIncludingGravity.z === 'number';
          this.accelerationIncludingGravity.period = e.interval * this._unifyPeriod; // Sensor availability for the acceleration

          this.acceleration.isProvided = e.acceleration && typeof e.acceleration.x === 'number' && typeof e.acceleration.y === 'number' && typeof e.acceleration.z === 'number';
          this.acceleration.period = e.interval * this._unifyPeriod; // Sensor availability for the rotation rate

          this.rotationRate.isProvided = e.rotationRate && typeof e.rotationRate.alpha === 'number' && typeof e.rotationRate.beta === 'number' && typeof e.rotationRate.gamma === 'number';
          this.rotationRate.period = e.interval * this._unifyPeriod; // in firefox android, accelerationIncludingGravity retrieve null values
          // on the first callback. so wait a second call to be sure.

          if (_platform2.default.os.family === 'Android' && /Firefox/.test(_platform2.default.name) && this._checkCounter < 1) {
            this._checkCounter++;
          } else {
            // now that the sensors are checked, replace the process function with
            // the final listener
            this._processFunction = this._devicemotionListener; // if acceleration is not provided by raw sensors, indicate whether it
            // can be calculated with `accelerationincludinggravity` or not

            if (!this.acceleration.isProvided) this.acceleration.isCalculated = this.accelerationIncludingGravity.isProvided; // WARNING
            // The lines of code below are commented because of a bug of Chrome
            // on some Android devices, where 'devicemotion' events are not sent
            // or caught if the listener is set up after a 'deviceorientation'
            // listener. Here, the _tryOrientationFallback method would add a
            // 'deviceorientation' listener and block all subsequent 'devicemotion'
            // events on these devices. Comments will be removed once the bug of
            // Chrome is corrected.
            // if (this.required.rotationRate && !this.rotationRate.isProvided)
            //   this._tryOrientationFallback();
            // else

            this._promiseResolve(this);
          }
        }
        /**
         * `'devicemotion'` event callback.
         * This method emits an event with the raw `'devicemotion'` values, and emits
         * events with the unified `accelerationIncludingGravity`, `acceleration`,
         * and / or `rotationRate` values if they are required.
         *
         * @param {DeviceMotionEvent} e - `'devicemotion'` event the values are calculated from.
         */

      }, {
        key: '_devicemotionListener',
        value: function _devicemotionListener(e) {
          // 'devicemotion' event (raw values)
          if (this.listeners.size > 0) this._emitDeviceMotionEvent(e); // alert(`${this.accelerationIncludingGravity.listeners.size} -
          //     ${this.required.accelerationIncludingGravity} -
          //     ${this.accelerationIncludingGravity.isValid}
          // `);
          // 'acceleration' event (unified values)

          if (this.accelerationIncludingGravity.listeners.size > 0 && this.required.accelerationIncludingGravity && this.accelerationIncludingGravity.isValid) {
            this._emitAccelerationIncludingGravityEvent(e);
          } // 'accelerationIncludingGravity' event (unified values)
          // the fallback calculation of the acceleration happens in the
          //  `_emitAcceleration` method, so we check if this.acceleration.isValid


          if (this.acceleration.listeners.size > 0 && this.required.acceleration && this.acceleration.isValid) {
            this._emitAccelerationEvent(e);
          } // 'rotationRate' event (unified values)
          // the fallback calculation of the rotation rate does NOT happen in the
          // `_emitRotationRate` method, so we only check if this.rotationRate.isProvided


          if (this.rotationRate.listeners.size > 0 && this.required.rotationRate && this.rotationRate.isProvided) {
            this._emitRotationRateEvent(e);
          }
        }
        /**
         * Emits the `'devicemotion'` raw values.
         *
         * @param {DeviceMotionEvent} e - `'devicemotion'` event the values are calculated from.
         */

      }, {
        key: '_emitDeviceMotionEvent',
        value: function _emitDeviceMotionEvent(e) {
          var outEvent = this.event;

          if (e.accelerationIncludingGravity) {
            outEvent[0] = e.accelerationIncludingGravity.x;
            outEvent[1] = e.accelerationIncludingGravity.y;
            outEvent[2] = e.accelerationIncludingGravity.z;
          }

          if (e.acceleration) {
            outEvent[3] = e.acceleration.x;
            outEvent[4] = e.acceleration.y;
            outEvent[5] = e.acceleration.z;
          }

          if (e.rotationRate) {
            outEvent[6] = e.rotationRate.alpha;
            outEvent[7] = e.rotationRate.beta;
            outEvent[8] = e.rotationRate.gamma;
          }

          this.emit(outEvent);
        }
        /**
         * Emits the `accelerationIncludingGravity` unified values.
         *
         * @param {DeviceMotionEvent} e - `'devicemotion'` event the values are calculated from.
         */

      }, {
        key: '_emitAccelerationIncludingGravityEvent',
        value: function _emitAccelerationIncludingGravityEvent(e) {
          var outEvent = this.accelerationIncludingGravity.event;
          outEvent[0] = e.accelerationIncludingGravity.x * this._unifyMotionData;
          outEvent[1] = e.accelerationIncludingGravity.y * this._unifyMotionData;
          outEvent[2] = e.accelerationIncludingGravity.z * this._unifyMotionData;
          this.accelerationIncludingGravity.emit(outEvent);
        }
        /**
         * Emits the `acceleration` unified values.
         * When the `acceleration` raw values are not available, the method
         * also calculates the acceleration from the
         * `accelerationIncludingGravity` raw values.
         *
         * @param {DeviceMotionEvent} e - The `'devicemotion'` event.
         */

      }, {
        key: '_emitAccelerationEvent',
        value: function _emitAccelerationEvent(e) {
          var outEvent = this.acceleration.event;

          if (this.acceleration.isProvided) {
            // If raw acceleration values are provided
            outEvent[0] = e.acceleration.x * this._unifyMotionData;
            outEvent[1] = e.acceleration.y * this._unifyMotionData;
            outEvent[2] = e.acceleration.z * this._unifyMotionData;
          } else if (this.accelerationIncludingGravity.isValid) {
            // Otherwise, if accelerationIncludingGravity values are provided,
            // estimate the acceleration with a high-pass filter
            var accelerationIncludingGravity = [e.accelerationIncludingGravity.x * this._unifyMotionData, e.accelerationIncludingGravity.y * this._unifyMotionData, e.accelerationIncludingGravity.z * this._unifyMotionData];
            var k = this._calculatedAccelerationDecay; // High-pass filter to estimate the acceleration (without the gravity)

            this._calculatedAcceleration[0] = (1 + k) * 0.5 * (accelerationIncludingGravity[0] - this._lastAccelerationIncludingGravity[0]) + k * this._calculatedAcceleration[0];
            this._calculatedAcceleration[1] = (1 + k) * 0.5 * (accelerationIncludingGravity[1] - this._lastAccelerationIncludingGravity[1]) + k * this._calculatedAcceleration[1];
            this._calculatedAcceleration[2] = (1 + k) * 0.5 * (accelerationIncludingGravity[2] - this._lastAccelerationIncludingGravity[2]) + k * this._calculatedAcceleration[2];
            this._lastAccelerationIncludingGravity[0] = accelerationIncludingGravity[0];
            this._lastAccelerationIncludingGravity[1] = accelerationIncludingGravity[1];
            this._lastAccelerationIncludingGravity[2] = accelerationIncludingGravity[2];
            outEvent[0] = this._calculatedAcceleration[0];
            outEvent[1] = this._calculatedAcceleration[1];
            outEvent[2] = this._calculatedAcceleration[2];
          }

          this.acceleration.emit(outEvent);
        }
        /**
         * Emits the `rotationRate` unified values.
         *
         * @param {DeviceMotionEvent} e - `'devicemotion'` event the values are calculated from.
         */

      }, {
        key: '_emitRotationRateEvent',
        value: function _emitRotationRateEvent(e) {
          var outEvent = this.rotationRate.event; // In all platforms, rotation axes are messed up according to the spec
          // https://w3c.github.io/deviceorientation/spec-source-orientation.html
          //
          // gamma should be alpha
          // alpha should be beta
          // beta should be gamma

          outEvent[0] = e.rotationRate.gamma;
          outEvent[1] = e.rotationRate.alpha, outEvent[2] = e.rotationRate.beta; // Chrome Android retrieve values that are in rad/s
          // cf. https://bugs.chromium.org/p/chromium/issues/detail?id=541607
          //
          // From spec: "The rotationRate attribute must be initialized with the rate
          // of rotation of the hosting device in space. It must be expressed as the
          // rate of change of the angles defined in section 4.1 and must be expressed
          // in degrees per second (deg/s)."
          //
          // fixed since Chrome 65
          // cf. https://github.com/immersive-web/webvr-polyfill/issues/307

          if (_platform2.default.os.family === 'Android' && chromeRegExp.test(_platform2.default.name) && parseInt(_platform2.default.version.split('.')[0]) < 65) {
            outEvent[0] *= toDeg;
            outEvent[1] *= toDeg, outEvent[2] *= toDeg;
          }

          this.rotationRate.emit(outEvent);
        }
        /**
         * Calculates and emits the `rotationRate` unified values from the `orientation` values.
         *
         * @param {number[]} orientation - Latest `orientation` raw values.
         */

      }, {
        key: '_calculateRotationRateFromOrientation',
        value: function _calculateRotationRateFromOrientation(orientation) {
          var now = getLocalTime();
          var k = 0.8; // TODO: improve low pass filter (frames are not regular)

          var alphaIsValid = typeof orientation[0] === 'number';

          if (this._lastOrientationTimestamp) {
            var rAlpha = null;
            var rBeta = void 0;
            var rGamma = void 0;
            var alphaDiscontinuityFactor = 0;
            var betaDiscontinuityFactor = 0;
            var gammaDiscontinuityFactor = 0;
            var deltaT = now - this._lastOrientationTimestamp;

            if (alphaIsValid) {
              // alpha discontinuity (+360 -> 0 or 0 -> +360)
              if (this._lastOrientation[0] > 320 && orientation[0] < 40) alphaDiscontinuityFactor = 360;else if (this._lastOrientation[0] < 40 && orientation[0] > 320) alphaDiscontinuityFactor = -360;
            } // beta discontinuity (+180 -> -180 or -180 -> +180)


            if (this._lastOrientation[1] > 140 && orientation[1] < -140) betaDiscontinuityFactor = 360;else if (this._lastOrientation[1] < -140 && orientation[1] > 140) betaDiscontinuityFactor = -360; // gamma discontinuities (+180 -> -180 or -180 -> +180)

            if (this._lastOrientation[2] > 50 && orientation[2] < -50) gammaDiscontinuityFactor = 180;else if (this._lastOrientation[2] < -50 && orientation[2] > 50) gammaDiscontinuityFactor = -180;

            if (deltaT > 0) {
              // Low pass filter to smooth the data
              if (alphaIsValid) rAlpha = k * this._calculatedRotationRate[0] + (1 - k) * (orientation[0] - this._lastOrientation[0] + alphaDiscontinuityFactor) / deltaT;
              rBeta = k * this._calculatedRotationRate[1] + (1 - k) * (orientation[1] - this._lastOrientation[1] + betaDiscontinuityFactor) / deltaT;
              rGamma = k * this._calculatedRotationRate[2] + (1 - k) * (orientation[2] - this._lastOrientation[2] + gammaDiscontinuityFactor) / deltaT;
              this._calculatedRotationRate[0] = rAlpha;
              this._calculatedRotationRate[1] = rBeta;
              this._calculatedRotationRate[2] = rGamma;
            } // TODO: resample the emission rate to match the devicemotion rate


            this.rotationRate.emit(this._calculatedRotationRate);
          }

          this._lastOrientationTimestamp = now;
          this._lastOrientation[0] = orientation[0];
          this._lastOrientation[1] = orientation[1];
          this._lastOrientation[2] = orientation[2];
        }
        /**
         * Checks whether the rotation rate can be calculated from the `orientation` values or not.
         *
         * @todo - this should be reviewed to comply with the axis order defined
         *  in the spec
         */
        // WARNING
        // The lines of code below are commented because of a bug of Chrome
        // on some Android devices, where 'devicemotion' events are not sent
        // or caught if the listener is set up after a 'deviceorientation'
        // listener. Here, the _tryOrientationFallback method would add a
        // 'deviceorientation' listener and block all subsequent 'devicemotion'
        // events on these devices. Comments will be removed once the bug of
        // Chrome is corrected.
        // _tryOrientationFallback() {
        //   MotionInput.requireModule('orientation')
        //     .then((orientation) => {
        //       if (orientation.isValid) {
        //         console.log(`
        //           WARNING (motion-input): The 'devicemotion' event does not exists or
        //           does not provide rotation rate values in your browser, so the rotation
        //           rate of the device is estimated from the 'orientation', calculated
        //           from the 'deviceorientation' event. Since the compass might not
        //           be available, only \`beta\` and \`gamma\` angles may be provided
        //           (\`alpha\` would be null).`
        //         );
        //         this.rotationRate.isCalculated = true;
        //         MotionInput.addListener('orientation', (orientation) => {
        //           this._calculateRotationRateFromOrientation(orientation);
        //         });
        //       }
        //       this._promiseResolve(this);
        //     });
        // }

      }, {
        key: '_process',
        value: function _process(data) {
          this._processFunction(data);
        }
        /**
         * Initializes of the module.
         *
         * @return {promise}
         */

      }, {
        key: 'init',
        value: function init() {
          var _this2 = this;

          return _get(DeviceMotionModule.prototype.__proto__ || Object.getPrototypeOf(DeviceMotionModule.prototype), 'init', this).call(this, function (resolve) {
            _this2._promiseResolve = resolve;

            if (window.DeviceMotionEvent) {
              _this2._processFunction = _this2._devicemotionCheck; // feature detect

              if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().then(function (permissionState) {
                  if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', _this2._process);
                  }
                }).catch(console.error);
              } else {
                // handle regular non iOS 13+ devices
                window.addEventListener('devicemotion', _this2._process);
              } // set fallback timeout for Firefox desktop (its window never calling the DeviceOrientation event, a
              // require of the DeviceOrientation service will result in the require promise never being resolved
              // hence the Experiment start() method never called)
              // > note 02/02/2018: this seems to create problems with ipods that
              // don't have enough time to start (sometimes), hence creating false
              // negative. So we only apply to Firefox desktop and put a really
              // large value (4sec) just in case.


              if (_platform2.default.name === 'Firefox' && _platform2.default.os.family !== 'Android' && _platform2.default.os.family !== 'iOS') {
                console.warn('[motion-input] register timer for Firefox desktop');
                _this2._checkTimeoutId = setTimeout(function () {
                  return resolve(_this2);
                }, 4 * 1000);
              }
            } // WARNING
            // The lines of code below are commented because of a bug of Chrome
            // on some Android devices, where 'devicemotion' events are not sent
            // or caught if the listener is set up after a 'deviceorientation'
            // listener. Here, the _tryOrientationFallback method would add a
            // 'deviceorientation' listener and block all subsequent 'devicemotion'
            // events on these devices. Comments will be removed once the bug of
            // Chrome is corrected.
            // else if (this.required.rotationRate)
            // this._tryOrientationFallback();
            else resolve(_this2);
          });
        }
      }, {
        key: '_calculatedAccelerationDecay',
        get: function get() {
          return Math.exp(-2 * Math.PI * this.accelerationIncludingGravity.period / this._calculatedAccelerationTimeConstant);
        }
      }]);

      return DeviceMotionModule;
    }(_InputModule3.default);

    exports.default = new DeviceMotionModule();
  });
  unwrapExports(DeviceMotionModule_1);

  var EnergyModule_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var _get = function get(object, property, receiver) {
      if (object === null) object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent === null) {
          return undefined;
        } else {
          return get(parent, property, receiver);
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;

        if (getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
    };

    var _InputModule3 = _interopRequireDefault(InputModule_1);

    var _MotionInput2 = _interopRequireDefault(MotionInput_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _possibleConstructorReturn(self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    /**
     * Energy module singleton.
     * The energy module singleton provides energy values (between 0 and 1)
     * based on the acceleration and the rotation rate of the device.
     * The period of the energy values is the same as the period of the
     * acceleration and the rotation rate values.
     *
     * @class EnergyModule
     * @extends InputModule
     */


    var EnergyModule = function (_InputModule) {
      _inherits(EnergyModule, _InputModule);
      /**
       * Creates the energy module instance.
       *
       * @constructor
       */


      function EnergyModule() {
        _classCallCheck(this, EnergyModule);
        /**
         * Event containing the value of the energy, sent by the energy module.
         *
         * @this EnergyModule
         * @type {number}
         * @default 0
         */


        var _this = _possibleConstructorReturn(this, (EnergyModule.__proto__ || Object.getPrototypeOf(EnergyModule)).call(this, 'energy'));

        _this.event = 0;
        /**
         * The acceleration module, used in the calculation of the energy.
         *
         * @this EnergyModule
         * @type {DOMEventSubmodule}
         * @default null
         * @see DevicemotionModule
         */

        _this._accelerationModule = null;
        /**
         * Latest acceleration value sent by the acceleration module.
         *
         * @this EnergyModule
         * @type {number[]}
         * @default null
         */

        _this._accelerationValues = null;
        /**
         * Maximum value reached by the acceleration magnitude, clipped at `this._accelerationMagnitudeThreshold`.
         *
         * @this EnergyModule
         * @type {number}
         * @default 9.81
         */

        _this._accelerationMagnitudeCurrentMax = 1 * 9.81;
        /**
         * Clipping value of the acceleration magnitude.
         *
         * @this EnergyModule
         * @type {number}
         * @default 20
         * @constant
         */

        _this._accelerationMagnitudeThreshold = 4 * 9.81;
        /**
         * The rotation rate module, used in the calculation of the energy.
         *
         * @this EnergyModule
         * @type {DOMEventSubmodule}
         * @default null
         * @see DevicemotionModule
         */

        _this._rotationRateModule = null;
        /**
         * Latest rotation rate value sent by the rotation rate module.
         *
         * @this EnergyModule
         * @type {number[]}
         * @default null
         */

        _this._rotationRateValues = null;
        /**
         * Maximum value reached by the rotation rate magnitude, clipped at `this._rotationRateMagnitudeThreshold`.
         *
         * @this EnergyModule
         * @type {number}
         * @default 400
         */

        _this._rotationRateMagnitudeCurrentMax = 400;
        /**
         * Clipping value of the rotation rate magnitude.
         *
         * @this EnergyModule
         * @type {number}
         * @default 600
         * @constant
         */

        _this._rotationRateMagnitudeThreshold = 600;
        /**
         * Time constant (half-life) of the low-pass filter used to smooth the energy values (in seconds).
         *
         * @this EnergyModule
         * @type {number}
         * @default 0.1
         * @constant
         */

        _this._energyTimeConstant = 0.1;
        _this._onAcceleration = _this._onAcceleration.bind(_this);
        _this._onRotationRate = _this._onRotationRate.bind(_this);
        return _this;
      }
      /**
       * Decay factor of the low-pass filter used to smooth the energy values.
       *
       * @type {number}
       * @readonly
       */


      _createClass(EnergyModule, [{
        key: 'init',

        /**
         * Initializes of the module.
         *
         * @return {Promise}
         */
        value: function init() {
          var _this2 = this;

          return _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'init', this).call(this, function (resolve) {
            // The energy module requires the acceleration and the rotation rate modules
            Promise.all([_MotionInput2.default.requireModule('acceleration'), _MotionInput2.default.requireModule('rotationRate')]).then(function (modules) {
              var _modules = _slicedToArray(modules, 2),
                  acceleration = _modules[0],
                  rotationRate = _modules[1];

              _this2._accelerationModule = acceleration;
              _this2._rotationRateModule = rotationRate;
              _this2.isCalculated = _this2._accelerationModule.isValid || _this2._rotationRateModule.isValid;
              if (_this2._accelerationModule.isValid) _this2.period = _this2._accelerationModule.period;else if (_this2._rotationRateModule.isValid) _this2.period = _this2._rotationRateModule.period;
              resolve(_this2);
            });
          });
        }
      }, {
        key: 'addListener',
        value: function addListener(listener) {
          if (this.listeners.size === 0) {
            if (this._accelerationModule.isValid) this._accelerationModule.addListener(this._onAcceleration);
            if (this._rotationRateModule.isValid) this._rotationRateModule.addListener(this._onRotationRate);
          }

          _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'addListener', this).call(this, listener);
        }
      }, {
        key: 'removeListener',
        value: function removeListener(listener) {
          _get(EnergyModule.prototype.__proto__ || Object.getPrototypeOf(EnergyModule.prototype), 'removeListener', this).call(this, listener);

          if (this.listeners.size === 0) {
            if (this._accelerationModule.isValid) this._accelerationModule.removeListener(this._onAcceleration);
            if (this._rotationRateModule.isValid) this._rotationRateModule.removeListener(this._onRotationRate);
          }
        }
        /**
         * Acceleration values handler.
         *
         * @param {number[]} acceleration - Latest acceleration value.
         */

      }, {
        key: '_onAcceleration',
        value: function _onAcceleration(acceleration) {
          this._accelerationValues = acceleration; // If the rotation rate values are not available, we calculate the energy right away.

          if (!this._rotationRateModule.isValid) this._calculateEnergy();
        }
        /**
         * Rotation rate values handler.
         *
         * @param {number[]} rotationRate - Latest rotation rate value.
         */

      }, {
        key: '_onRotationRate',
        value: function _onRotationRate(rotationRate) {
          this._rotationRateValues = rotationRate; // We know that the acceleration and rotation rate values coming from the
          // same `devicemotion` event are sent in that order (acceleration > rotation rate)
          // so when the rotation rate is provided, we calculate the energy value of the
          // latest `devicemotion` event when we receive the rotation rate values.

          this._calculateEnergy();
        }
        /**
         * Energy calculation: emits an energy value between 0 and 1.
         *
         * This method checks if the acceleration modules is valid. If that is the case,
         * it calculates an estimation of the energy (between 0 and 1) based on the ratio
         * of the current acceleration magnitude and the maximum acceleration magnitude
         * reached so far (clipped at the `this._accelerationMagnitudeThreshold` value).
         * (We use this trick to get uniform behaviors among devices. If we calculated
         * the ratio based on a fixed value independent of what the device is capable of
         * providing, we could get inconsistent behaviors. For instance, the devices
         * whose accelerometers are limited at 2g would always provide very low values
         * compared to devices with accelerometers capable of measuring 4g accelerations.)
         * The same checks and calculations are made on the rotation rate module.
         * Finally, the energy value is the maximum between the energy value estimated
         * from the acceleration, and the one estimated from the rotation rate. It is
         * smoothed through a low-pass filter.
         */

      }, {
        key: '_calculateEnergy',
        value: function _calculateEnergy() {
          var accelerationEnergy = 0;
          var rotationRateEnergy = 0; // Check the acceleration module and calculate an estimation of the energy value from the latest acceleration value

          if (this._accelerationModule.isValid) {
            var aX = this._accelerationValues[0];
            var aY = this._accelerationValues[1];
            var aZ = this._accelerationValues[2];
            var accelerationMagnitude = Math.sqrt(aX * aX + aY * aY + aZ * aZ); // Store the maximum acceleration magnitude reached so far, clipped at `this._accelerationMagnitudeThreshold`

            if (this._accelerationMagnitudeCurrentMax < accelerationMagnitude) this._accelerationMagnitudeCurrentMax = Math.min(accelerationMagnitude, this._accelerationMagnitudeThreshold); // TODO(?): remove ouliers --- on some Android devices, the magnitude is very high on a few isolated datapoints,
            // which make the threshold very high as well => the energy remains around 0.5, even when you shake very hard.

            accelerationEnergy = Math.min(accelerationMagnitude / this._accelerationMagnitudeCurrentMax, 1);
          } // Check the rotation rate module and calculate an estimation of the energy value from the latest rotation rate value


          if (this._rotationRateModule.isValid) {
            var rA = this._rotationRateValues[0];
            var rB = this._rotationRateValues[1];
            var rG = this._rotationRateValues[2];
            var rotationRateMagnitude = Math.sqrt(rA * rA + rB * rB + rG * rG); // Store the maximum rotation rate magnitude reached so far, clipped at `this._rotationRateMagnitudeThreshold`

            if (this._rotationRateMagnitudeCurrentMax < rotationRateMagnitude) this._rotationRateMagnitudeCurrentMax = Math.min(rotationRateMagnitude, this._rotationRateMagnitudeThreshold);
            rotationRateEnergy = Math.min(rotationRateMagnitude / this._rotationRateMagnitudeCurrentMax, 1);
          }

          var energy = Math.max(accelerationEnergy, rotationRateEnergy); // Low-pass filter to smooth the energy values

          var k = this._energyDecay;
          this.event = k * this.event + (1 - k) * energy; // Emit the energy value

          this.emit(this.event);
        }
      }, {
        key: '_energyDecay',
        get: function get() {
          return Math.exp(-2 * Math.PI * this.period / this._energyTimeConstant);
        }
      }]);

      return EnergyModule;
    }(_InputModule3.default);

    exports.default = new EnergyModule();
  });
  unwrapExports(EnergyModule_1);

  var dist = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _MotionInput2 = _interopRequireDefault(MotionInput_1);

    var _DeviceOrientationModule2 = _interopRequireDefault(DeviceOrientationModule_1);

    var _DeviceMotionModule2 = _interopRequireDefault(DeviceMotionModule_1);

    var _EnergyModule2 = _interopRequireDefault(EnergyModule_1);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    /**
     * The motion input module can be used as follows
     *
     * @example
     * import motionInput from 'motion-input';
     * const requiredEvents = ;
     *
     * motionInput
     *  .init(['acceleration', 'orientation', 'energy'])
     *  .then(([acceleration, orientation, energy]) => {
     *    if (acceleration.isValid) {
     *      acceleration.addListener((data) => {
     *        console.log('acceleration', data);
     *        // do something with the acceleration values
     *      });
     *    }
     *
     *    // ...
     *  });
     */


    _MotionInput2.default.addModule('devicemotion', _DeviceMotionModule2.default);

    _MotionInput2.default.addModule('deviceorientation', _DeviceOrientationModule2.default);

    _MotionInput2.default.addModule('accelerationIncludingGravity', _DeviceMotionModule2.default.accelerationIncludingGravity);

    _MotionInput2.default.addModule('acceleration', _DeviceMotionModule2.default.acceleration);

    _MotionInput2.default.addModule('rotationRate', _DeviceMotionModule2.default.rotationRate);

    _MotionInput2.default.addModule('orientation', _DeviceOrientationModule2.default.orientation);

    _MotionInput2.default.addModule('orientationAlt', _DeviceOrientationModule2.default.orientationAlt);

    _MotionInput2.default.addModule('energy', _EnergyModule2.default);

    exports.default = _MotionInput2.default;
  });
  unwrapExports(dist);

  function setupOverlay(id) {
    var hasButton = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var overlay = document.getElementById("".concat(id, "-overlay"));
    overlay.addEventListener('click', function () {
      overlay.classList.remove('open');
      if (callback) callback();
    });

    if (hasButton) {
      var button = document.getElementById("".concat(id, "-button"));
      button.addEventListener('click', function () {
        return overlay.classList.add('open');
      });
    } else {
      overlay.classList.add('open');
    }

    return overlay;
  }

  function main() {
    setupOverlay('help');
    setupOverlay('info');
  }

  window.addEventListener('load', main);

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9tb3Rpb24taW5wdXQvZGlzdC9Nb3Rpb25JbnB1dC5qcyIsIi4uL25vZGVfbW9kdWxlcy9tb3Rpb24taW5wdXQvZGlzdC9JbnB1dE1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9tb3Rpb24taW5wdXQvZGlzdC9ET01FdmVudFN1Ym1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9wbGF0Zm9ybS9wbGF0Zm9ybS5qcyIsIi4uL25vZGVfbW9kdWxlcy9tb3Rpb24taW5wdXQvZGlzdC9EZXZpY2VPcmllbnRhdGlvbk1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9tb3Rpb24taW5wdXQvZGlzdC9EZXZpY2VNb3Rpb25Nb2R1bGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbW90aW9uLWlucHV0L2Rpc3QvRW5lcmd5TW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1pbnB1dC9kaXN0L2luZGV4LmpzIiwiLi4vc3JjL3V0aWxzL2hlbHBlcnMuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxuICogYE1vdGlvbklucHV0YCBzaW5nbGV0b24uXG4gKiBUaGUgYE1vdGlvbklucHV0YCBzaW5nbGV0b24gYWxsb3dzIHRvIGluaXRpYWxpemUgbW90aW9uIGV2ZW50c1xuICogYW5kIHRvIGxpc3RlbiB0byB0aGVtLlxuICpcbiAqIEBjbGFzcyBNb3Rpb25JbnB1dFxuICovXG52YXIgTW90aW9uSW5wdXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGZ1bmN0aW9uIE1vdGlvbklucHV0KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNb3Rpb25JbnB1dCk7XG5cbiAgICAvKipcbiAgICAgKiBQb29sIG9mIGFsbCBhdmFpbGFibGUgbW9kdWxlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIE1vdGlvbklucHV0XG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMubW9kdWxlcyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBtb2R1bGUgdG8gdGhlIGBNb3Rpb25JbnB1dGAgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZS5cbiAgICogQHBhcmFtIHtJbnB1dE1vZHVsZX0gbW9kdWxlIC0gTW9kdWxlIHRvIGFkZCB0byB0aGUgYE1vdGlvbklucHV0YCBtb2R1bGUuXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKE1vdGlvbklucHV0LCBbe1xuICAgIGtleTogXCJhZGRNb2R1bGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkTW9kdWxlKGV2ZW50VHlwZSwgbW9kdWxlKSB7XG4gICAgICB0aGlzLm1vZHVsZXNbZXZlbnRUeXBlXSA9IG1vZHVsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHR5cGUgKG1vZHVsZSkgdG8gcmV0cmlldmUuXG4gICAgICogQHJldHVybiB7SW5wdXRNb2R1bGV9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRNb2R1bGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TW9kdWxlKGV2ZW50VHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kdWxlc1tldmVudFR5cGVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcXVpcmVzIGEgbW9kdWxlLlxuICAgICAqIElmIHRoZSBtb2R1bGUgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWxyZWFkeSwgcmV0dXJucyBpdHMgcHJvbWlzZS4gT3RoZXJ3aXNlLFxuICAgICAqIGluaXRpYWxpemVzIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byByZXF1aXJlLlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJyZXF1aXJlTW9kdWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVpcmVNb2R1bGUoZXZlbnRUeXBlKSB7XG4gICAgICB2YXIgbW9kdWxlID0gdGhpcy5nZXRNb2R1bGUoZXZlbnRUeXBlKTtcblxuICAgICAgaWYgKG1vZHVsZS5wcm9taXNlKSByZXR1cm4gbW9kdWxlLnByb21pc2U7XG5cbiAgICAgIHJldHVybiBtb2R1bGUuaW5pdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBgTW90aW9uSW5wdXRgIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gZXZlbnRUeXBlcyAtIEFycmF5IG9mIHRoZSBldmVudCB0eXBlcyB0byBpbml0aWFsaXplLlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJpbml0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZXZlbnRUeXBlcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBldmVudFR5cGVzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudFR5cGVzWzBdKSkgZXZlbnRUeXBlcyA9IGV2ZW50VHlwZXNbMF07XG5cbiAgICAgIHZhciBtb2R1bGVQcm9taXNlcyA9IGV2ZW50VHlwZXMubWFwKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgbW9kdWxlID0gX3RoaXMuZ2V0TW9kdWxlKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG1vZHVsZS5pbml0KCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKG1vZHVsZVByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byBhZGQgYSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImFkZExpc3RlbmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBtb2R1bGUgPSB0aGlzLmdldE1vZHVsZShldmVudFR5cGUpO1xuICAgICAgbW9kdWxlLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdHlwZSAobW9kdWxlKSB0byBhZGQgYSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIHJlbW92ZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZUxpc3RlbmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBtb2R1bGUgPSB0aGlzLmdldE1vZHVsZShldmVudFR5cGUpO1xuICAgICAgbW9kdWxlLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTW90aW9uSW5wdXQ7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IG5ldyBNb3Rpb25JbnB1dCgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWsxdmRHbHZia2x1Y0hWMExtcHpJbDBzSW01aGJXVnpJanBiSWsxdmRHbHZia2x1Y0hWMElpd2liVzlrZFd4bGN5SXNJbVYyWlc1MFZIbHdaU0lzSW0xdlpIVnNaU0lzSW1kbGRFMXZaSFZzWlNJc0luQnliMjFwYzJVaUxDSnBibWwwSWl3aVpYWmxiblJVZVhCbGN5SXNJa0Z5Y21GNUlpd2lhWE5CY25KaGVTSXNJbTF2WkhWc1pWQnliMjFwYzJWeklpd2liV0Z3SWl3aWRtRnNkV1VpTENKUWNtOXRhWE5sSWl3aVlXeHNJaXdpYkdsemRHVnVaWElpTENKaFpHUk1hWE4wWlc1bGNpSXNJbkpsYlc5MlpVeHBjM1JsYm1WeUlsMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3TzBGQlFVRTdPenM3T3pzN1NVRlBUVUVzVnpzN1FVRkZTanM3T3pzN1FVRkxRU3g1UWtGQll6dEJRVUZCT3p0QlFVVmFPenM3T3pzN08wRkJUMEVzVTBGQlMwTXNUMEZCVEN4SFFVRmxMRVZCUVdZN1FVRkRSRHM3UVVGRlJEczdPenM3T3pzN096czRRa0ZOVlVNc1V5eEZRVUZYUXl4TkxFVkJRVkU3UVVGRE0wSXNWMEZCUzBZc1QwRkJUQ3hEUVVGaFF5eFRRVUZpTEVsQlFUQkNReXhOUVVFeFFqdEJRVU5FT3p0QlFVVkVPenM3T3pzN096czdPRUpCVFZWRUxGTXNSVUZCVnp0QlFVTnVRaXhoUVVGUExFdEJRVXRFTEU5QlFVd3NRMEZCWVVNc1UwRkJZaXhEUVVGUU8wRkJRMFE3TzBGQlJVUTdPenM3T3pzN096czdPMnREUVZGalFTeFRMRVZCUVZjN1FVRkRka0lzVlVGQlRVTXNVMEZCVXl4TFFVRkxReXhUUVVGTUxFTkJRV1ZHTEZOQlFXWXNRMEZCWmpzN1FVRkZRU3hWUVVGSlF5eFBRVUZQUlN4UFFVRllMRVZCUTBVc1QwRkJUMFlzVDBGQlQwVXNUMEZCWkRzN1FVRkZSaXhoUVVGUFJpeFBRVUZQUnl4SlFVRlFMRVZCUVZBN1FVRkRSRHM3UVVGRlJEczdPenM3T3pzN096SkNRVTF2UWp0QlFVRkJPenRCUVVGQkxIZERRVUZhUXl4VlFVRlpPMEZCUVZwQkxHdENRVUZaTzBGQlFVRTdPMEZCUTJ4Q0xGVkJRVWxETEUxQlFVMURMRTlCUVU0c1EwRkJZMFlzVjBGQlZ5eERRVUZZTEVOQlFXUXNRMEZCU2l4RlFVTkZRU3hoUVVGaFFTeFhRVUZYTEVOQlFWZ3NRMEZCWWpzN1FVRkZSaXhWUVVGTlJ5eHBRa0ZCYVVKSUxGZEJRVmRKTEVkQlFWZ3NRMEZCWlN4VlFVRkRReXhMUVVGRUxFVkJRVmM3UVVGREwwTXNXVUZCVFZRc1UwRkJVeXhOUVVGTFF5eFRRVUZNTEVOQlFXVlJMRXRCUVdZc1EwRkJaanRCUVVOQkxHVkJRVTlVTEU5QlFVOUhMRWxCUVZBc1JVRkJVRHRCUVVORUxFOUJTSE5DTEVOQlFYWkNPenRCUVV0QkxHRkJRVTlQTEZGQlFWRkRMRWRCUVZJc1EwRkJXVW9zWTBGQldpeERRVUZRTzBGQlEwUTdPMEZCUlVRN096czdPenM3T3p0blEwRk5XVklzVXl4RlFVRlhZU3hSTEVWQlFWVTdRVUZETDBJc1ZVRkJUVm9zVTBGQlV5eExRVUZMUXl4VFFVRk1MRU5CUVdWR0xGTkJRV1lzUTBGQlpqdEJRVU5CUXl4aFFVRlBZU3hYUVVGUUxFTkJRVzFDUkN4UlFVRnVRanRCUVVORU96dEJRVVZFT3pzN096czdPenM3YlVOQlRXVmlMRk1zUlVGQlYyRXNVU3hGUVVGVk8wRkJRMnhETEZWQlFVMWFMRk5CUVZNc1MwRkJTME1zVTBGQlRDeERRVUZsUml4VFFVRm1MRU5CUVdZN1FVRkRRVU1zWVVGQlQyTXNZMEZCVUN4RFFVRnpRa1lzVVVGQmRFSTdRVUZEUkRzN096czdPMnRDUVVkWkxFbEJRVWxtTEZkQlFVb3NSU0lzSW1acGJHVWlPaUpOYjNScGIyNUpibkIxZEM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dZRTF2ZEdsdmJrbHVjSFYwWUNCemFXNW5iR1YwYjI0dVhHNGdLaUJVYUdVZ1lFMXZkR2x2YmtsdWNIVjBZQ0J6YVc1bmJHVjBiMjRnWVd4c2IzZHpJSFJ2SUdsdWFYUnBZV3hwZW1VZ2JXOTBhVzl1SUdWMlpXNTBjMXh1SUNvZ1lXNWtJSFJ2SUd4cGMzUmxiaUIwYnlCMGFHVnRMbHh1SUNwY2JpQXFJRUJqYkdGemN5Qk5iM1JwYjI1SmJuQjFkRnh1SUNvdlhHNWpiR0Z6Y3lCTmIzUnBiMjVKYm5CMWRDQjdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTnlaV0YwWlhNZ2RHaGxJR0JOYjNScGIyNUpibkIxZEdBZ2JXOWtkV3hsSUdsdWMzUmhibU5sTGx4dUlDQWdLbHh1SUNBZ0tpQkFZMjl1YzNSeWRXTjBiM0pjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBjblZqZEc5eUtDa2dlMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVUc5dmJDQnZaaUJoYkd3Z1lYWmhhV3hoWW14bElHMXZaSFZzWlhNdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWRHaHBjeUJOYjNScGIyNUpibkIxZEZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHR2WW1wbFkzUjlYRzRnSUNBZ0lDb2dRR1JsWm1GMWJIUWdlMzFjYmlBZ0lDQWdLaTljYmlBZ0lDQjBhR2x6TG0xdlpIVnNaWE1nUFNCN2ZUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJCWkdSeklHRWdiVzlrZFd4bElIUnZJSFJvWlNCZ1RXOTBhVzl1U1c1d2RYUmdJRzF2WkhWc1pTNWNiaUFnSUNwY2JpQWdJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJR1YyWlc1MFZIbHdaU0F0SUU1aGJXVWdiMllnZEdobElHVjJaVzUwSUhSNWNHVXVYRzRnSUNBcUlFQndZWEpoYlNCN1NXNXdkWFJOYjJSMWJHVjlJRzF2WkhWc1pTQXRJRTF2WkhWc1pTQjBieUJoWkdRZ2RHOGdkR2hsSUdCTmIzUnBiMjVKYm5CMWRHQWdiVzlrZFd4bExseHVJQ0FnS2k5Y2JpQWdZV1JrVFc5a2RXeGxLR1YyWlc1MFZIbHdaU3dnYlc5a2RXeGxLU0I3WEc0Z0lDQWdkR2hwY3k1dGIyUjFiR1Z6VzJWMlpXNTBWSGx3WlYwZ1BTQnRiMlIxYkdVN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlYwY3lCaElHMXZaSFZzWlM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlHVjJaVzUwVkhsd1pTQXRJRTVoYldVZ2IyWWdkR2hsSUdWMlpXNTBJSFI1Y0dVZ0tHMXZaSFZzWlNrZ2RHOGdjbVYwY21sbGRtVXVYRzRnSUNBcUlFQnlaWFIxY200Z2UwbHVjSFYwVFc5a2RXeGxmVnh1SUNBZ0tpOWNiaUFnWjJWMFRXOWtkV3hsS0dWMlpXNTBWSGx3WlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtMXZaSFZzWlhOYlpYWmxiblJVZVhCbFhUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJTWlhGMWFYSmxjeUJoSUcxdlpIVnNaUzVjYmlBZ0lDb2dTV1lnZEdobElHMXZaSFZzWlNCb1lYTWdZbVZsYmlCcGJtbDBhV0ZzYVhwbFpDQmhiSEpsWVdSNUxDQnlaWFIxY201eklHbDBjeUJ3Y205dGFYTmxMaUJQZEdobGNuZHBjMlVzWEc0Z0lDQXFJR2x1YVhScFlXeHBlbVZ6SUhSb1pTQnRiMlIxYkdVdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQmxkbVZ1ZEZSNWNHVWdMU0JPWVcxbElHOW1JSFJvWlNCbGRtVnVkQ0IwZVhCbElDaHRiMlIxYkdVcElIUnZJSEpsY1hWcGNtVXVYRzRnSUNBcUlFQnlaWFIxY200Z2UxQnliMjFwYzJWOVhHNGdJQ0FxTDF4dUlDQnlaWEYxYVhKbFRXOWtkV3hsS0dWMlpXNTBWSGx3WlNrZ2UxeHVJQ0FnSUdOdmJuTjBJRzF2WkhWc1pTQTlJSFJvYVhNdVoyVjBUVzlrZFd4bEtHVjJaVzUwVkhsd1pTazdYRzVjYmlBZ0lDQnBaaUFvYlc5a2RXeGxMbkJ5YjIxcGMyVXBYRzRnSUNBZ0lDQnlaWFIxY200Z2JXOWtkV3hsTG5CeWIyMXBjMlU3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdiVzlrZFd4bExtbHVhWFFvS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkpibWwwYVdGc2FYcGxjeUIwYUdVZ1lFMXZkR2x2YmtsdWNIVjBZQ0J0YjJSMWJHVXVYRzRnSUNBcVhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYazhVM1J5YVc1blBuMGdaWFpsYm5SVWVYQmxjeUF0SUVGeWNtRjVJRzltSUhSb1pTQmxkbVZ1ZENCMGVYQmxjeUIwYnlCcGJtbDBhV0ZzYVhwbExseHVJQ0FnS2lCQWNtVjBkWEp1SUh0UWNtOXRhWE5sZlZ4dUlDQWdLaTljYmlBZ2FXNXBkQ2d1TGk1bGRtVnVkRlI1Y0dWektTQjdYRzRnSUNBZ2FXWWdLRUZ5Y21GNUxtbHpRWEp5WVhrb1pYWmxiblJVZVhCbGMxc3dYU2twWEc0Z0lDQWdJQ0JsZG1WdWRGUjVjR1Z6SUQwZ1pYWmxiblJVZVhCbGMxc3dYVnh1WEc0Z0lDQWdZMjl1YzNRZ2JXOWtkV3hsVUhKdmJXbHpaWE1nUFNCbGRtVnVkRlI1Y0dWekxtMWhjQ2dvZG1Gc2RXVXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJRzF2WkhWc1pTQTlJSFJvYVhNdVoyVjBUVzlrZFd4bEtIWmhiSFZsS1R0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ0YjJSMWJHVXVhVzVwZENncE8xeHVJQ0FnSUgwcE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUZCeWIyMXBjMlV1WVd4c0tHMXZaSFZzWlZCeWIyMXBjMlZ6S1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkJaR1J6SUdFZ2JHbHpkR1Z1WlhJdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQmxkbVZ1ZEZSNWNHVWdMU0JPWVcxbElHOW1JSFJvWlNCbGRtVnVkQ0IwZVhCbElDaHRiMlIxYkdVcElIUnZJR0ZrWkNCaElHeHBjM1JsYm1WeUlIUnZMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UyWjFibU4wYVc5dWZTQnNhWE4wWlc1bGNpQXRJRXhwYzNSbGJtVnlJSFJ2SUdGa1pDNWNiaUFnSUNvdlhHNGdJR0ZrWkV4cGMzUmxibVZ5S0dWMlpXNTBWSGx3WlN3Z2JHbHpkR1Z1WlhJcElIdGNiaUFnSUNCamIyNXpkQ0J0YjJSMWJHVWdQU0IwYUdsekxtZGxkRTF2WkhWc1pTaGxkbVZ1ZEZSNWNHVXBPMXh1SUNBZ0lHMXZaSFZzWlM1aFpHUk1hWE4wWlc1bGNpaHNhWE4wWlc1bGNpazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVW1WdGIzWmxjeUJoSUd4cGMzUmxibVZ5TGx4dUlDQWdLbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UzTjBjbWx1WjMwZ1pYWmxiblJVZVhCbElDMGdUbUZ0WlNCdlppQjBhR1VnWlhabGJuUWdkSGx3WlNBb2JXOWtkV3hsS1NCMGJ5QmhaR1FnWVNCc2FYTjBaVzVsY2lCMGJ5NWNiaUFnSUNvZ1FIQmhjbUZ0SUh0bWRXNWpkR2x2Ym4wZ2JHbHpkR1Z1WlhJZ0xTQk1hWE4wWlc1bGNpQjBieUJ5WlcxdmRtVXVYRzRnSUNBcUwxeHVJQ0J5WlcxdmRtVk1hWE4wWlc1bGNpaGxkbVZ1ZEZSNWNHVXNJR3hwYzNSbGJtVnlLU0I3WEc0Z0lDQWdZMjl1YzNRZ2JXOWtkV3hsSUQwZ2RHaHBjeTVuWlhSTmIyUjFiR1VvWlhabGJuUlVlWEJsS1R0Y2JpQWdJQ0J0YjJSMWJHVXVjbVZ0YjNabFRHbHpkR1Z1WlhJb2JHbHpkR1Z1WlhJcE8xeHVJQ0I5WEc1OVhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHNWxkeUJOYjNScGIyNUpibkIxZENncE8xeHVJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxuICogYElucHV0TW9kdWxlYCBjbGFzcy5cbiAqIFRoZSBgSW5wdXRNb2R1bGVgIGNsYXNzIGFsbG93cyB0byBpbnN0YW50aWF0ZSBtb2R1bGVzIHRoYXQgYXJlIHBhcnQgb2YgdGhlXG4gKiBtb3Rpb24gaW5wdXQgbW9kdWxlLCBhbmQgdGhhdCBwcm92aWRlIHZhbHVlcyAoZm9yIGluc3RhbmNlLCBgZGV2aWNlb3JpZW50YXRpb25gLFxuICogYGFjY2VsZXJhdGlvbmAsIGBlbmVyZ3lgKS5cbiAqXG4gKiBAY2xhc3MgSW5wdXRNb2R1bGVcbiAqL1xudmFyIElucHV0TW9kdWxlID0gZnVuY3Rpb24gKCkge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBJbnB1dE1vZHVsZWAgbW9kdWxlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIG1vZHVsZSAvIGV2ZW50ICgqZS5nLiogYGRldmljZW9yaWVudGF0aW9uLCAnYWNjZWxlcmF0aW9uJywgJ2VuZXJneScpLlxuICAgKi9cbiAgZnVuY3Rpb24gSW5wdXRNb2R1bGUoZXZlbnRUeXBlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIElucHV0TW9kdWxlKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHR5cGUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50VHlwZSA9IGV2ZW50VHlwZTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGxpc3RlbmVycyBhdHRhY2hlZCB0byB0aGlzIG1vZHVsZSAvIGV2ZW50LlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7U2V0PEZ1bmN0aW9uPn1cbiAgICAgKi9cbiAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHNlbnQgYnkgdGhpcyBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ8bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHRoaXMuZXZlbnQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIHByb21pc2UgKHJlc29sdmVkIHdoZW4gdGhlIG1vZHVsZSBpcyBpbml0aWFsaXplZCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtQcm9taXNlfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICB0aGlzLnByb21pc2UgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHRoZSBtb2R1bGUncyBldmVudCB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSBwYXJlbnQgbW9kdWxlcyAvIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEB0aGlzIElucHV0TW9kdWxlXG4gICAgICogQHR5cGUge2Jvb2x9XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICB0aGlzLmlzQ2FsY3VsYXRlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHRoZSBtb2R1bGUncyBldmVudCB2YWx1ZXMgYXJlIHByb3ZpZGVkIGJ5IHRoZSBkZXZpY2UncyBzZW5zb3JzLlxuICAgICAqICgqSS5lLiogaW5kaWNhdGVzIGlmIHRoZSBgJ2RldmljZW1vdGlvbidgIG9yIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudHMgcHJvdmlkZSB0aGUgcmVxdWlyZWQgcmF3IHZhbHVlcy4pXG4gICAgICpcbiAgICAgKiBAdGhpcyBJbnB1dE1vZHVsZVxuICAgICAqIEB0eXBlIHtib29sfVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgdGhpcy5pc1Byb3ZpZGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBQZXJpb2QgYXQgd2hpY2ggdGhlIG1vZHVsZSdzIGV2ZW50cyBhcmUgc2VudCAoYHVuZGVmaW5lZGAgaWYgdGhlIGV2ZW50cyBhcmUgbm90IHNlbnQgYXQgcmVndWxhciBpbnRlcnZhbHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgSW5wdXRNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHRoaXMucGVyaW9kID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5lbWl0ID0gdGhpcy5lbWl0LmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBjYW4gcHJvdmlkZSB2YWx1ZXMgb3Igbm90LlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbH1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKElucHV0TW9kdWxlLCBbe1xuICAgIGtleTogXCJpbml0XCIsXG5cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlRnVuIC0gUHJvbWlzZSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBgcmVzb2x2ZWAgYW5kIGByZWplY3RgIGZ1bmN0aW9ucyBhcyBhcmd1bWVudHMuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdChwcm9taXNlRnVuKSB7XG4gICAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShwcm9taXNlRnVuKTtcbiAgICAgIHJldHVybiB0aGlzLnByb21pc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIHRvIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIGFkZC5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImFkZExpc3RlbmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgICB0aGlzLmxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmcm9tIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciAtIExpc3RlbmVyIHRvIHJlbW92ZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZUxpc3RlbmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb3BhZ2F0ZXMgYW4gZXZlbnQgdG8gYWxsIHRoZSBtb2R1bGUncyBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcnxudW1iZXJbXX0gW2V2ZW50PXRoaXMuZXZlbnRdIC0gRXZlbnQgdmFsdWVzIHRvIHByb3BhZ2F0ZSB0byB0aGUgbW9kdWxlJ3MgbGlzdGVuZXJzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZW1pdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbWl0KCkge1xuICAgICAgdmFyIGV2ZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0aGlzLmV2ZW50O1xuXG4gICAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXIoZXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImlzVmFsaWRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzUHJvdmlkZWQgfHwgdGhpcy5pc0NhbGN1bGF0ZWQ7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIElucHV0TW9kdWxlO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBJbnB1dE1vZHVsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrbHVjSFYwVFc5a2RXeGxMbXB6SWwwc0ltNWhiV1Z6SWpwYklrbHVjSFYwVFc5a2RXeGxJaXdpWlhabGJuUlVlWEJsSWl3aWJHbHpkR1Z1WlhKeklpd2lVMlYwSWl3aVpYWmxiblFpTENKd2NtOXRhWE5sSWl3aWFYTkRZV3hqZFd4aGRHVmtJaXdpYVhOUWNtOTJhV1JsWkNJc0luQmxjbWx2WkNJc0luVnVaR1ZtYVc1bFpDSXNJbVZ0YVhRaUxDSmlhVzVrSWl3aWNISnZiV2x6WlVaMWJpSXNJbEJ5YjIxcGMyVWlMQ0pzYVhOMFpXNWxjaUlzSW1Ga1pDSXNJbVJsYkdWMFpTSXNJbVp2Y2tWaFkyZ2lYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN1FVRkJRVHM3T3pzN096czdTVUZSVFVFc1Z6czdRVUZGU2pzN096czdPMEZCVFVFc2RVSkJRVmxETEZOQlFWb3NSVUZCZFVJN1FVRkJRVHM3UVVGRmNrSTdPenM3T3pzN1FVRlBRU3hUUVVGTFFTeFRRVUZNTEVkQlFXbENRU3hUUVVGcVFqczdRVUZGUVRzN096czdPMEZCVFVFc1UwRkJTME1zVTBGQlRDeEhRVUZwUWl4SlFVRkpReXhIUVVGS0xFVkJRV3BDT3p0QlFVVkJPenM3T3pzN08wRkJUMEVzVTBGQlMwTXNTMEZCVEN4SFFVRmhMRWxCUVdJN08wRkJSVUU3T3pzN096czdRVUZQUVN4VFFVRkxReXhQUVVGTUxFZEJRV1VzU1VGQlpqczdRVUZGUVRzN096czdPenRCUVU5QkxGTkJRVXRETEZsQlFVd3NSMEZCYjBJc1MwRkJjRUk3TzBGQlJVRTdPenM3T3pzN08wRkJVVUVzVTBGQlMwTXNWVUZCVEN4SFFVRnJRaXhMUVVGc1FqczdRVUZGUVRzN096czdPenRCUVU5QkxGTkJRVXRETEUxQlFVd3NSMEZCWTBNc1UwRkJaRHM3UVVGRlFTeFRRVUZMUXl4SlFVRk1MRWRCUVZrc1MwRkJTMEVzU1VGQlRDeERRVUZWUXl4SlFVRldMRU5CUVdVc1NVRkJaaXhEUVVGYU8wRkJRMFE3TzBGQlJVUTdPenM3T3pzN096czdPenRCUVZWQk96czdPenM3ZVVKQlRVdERMRlVzUlVGQldUdEJRVU5tTEZkQlFVdFFMRTlCUVV3c1IwRkJaU3hKUVVGSlVTeFBRVUZLTEVOQlFWbEVMRlZCUVZvc1EwRkJaanRCUVVOQkxHRkJRVThzUzBGQlMxQXNUMEZCV2p0QlFVTkVPenRCUVVWRU96czdPenM3T3p0blEwRkxXVk1zVVN4RlFVRlZPMEZCUTNCQ0xGZEJRVXRhTEZOQlFVd3NRMEZCWldFc1IwRkJaaXhEUVVGdFFrUXNVVUZCYmtJN1FVRkRSRHM3UVVGRlJEczdPenM3T3pzN2JVTkJTMlZCTEZFc1JVRkJWVHRCUVVOMlFpeFhRVUZMV2l4VFFVRk1MRU5CUVdWakxFMUJRV1lzUTBGQmMwSkdMRkZCUVhSQ08wRkJRMFE3TzBGQlJVUTdPenM3T3pzN096SkNRVXQ1UWp0QlFVRkJMRlZCUVhCQ1ZpeExRVUZ2UWl4MVJVRkJXaXhMUVVGTFFTeExRVUZQT3p0QlFVTjJRaXhYUVVGTFJpeFRRVUZNTEVOQlFXVmxMRTlCUVdZc1EwRkJkVUk3UVVGQlFTeGxRVUZaU0N4VFFVRlRWaXhMUVVGVUxFTkJRVm83UVVGQlFTeFBRVUYyUWp0QlFVTkVPenM3ZDBKQmVFTmhPMEZCUTFvc1lVRkJVU3hMUVVGTFJ5eFZRVUZNTEVsQlFXMUNMRXRCUVV0RUxGbEJRV2hETzBGQlEwUTdPenM3T3p0clFrRjVRMWxPTEZjaUxDSm1hV3hsSWpvaVNXNXdkWFJOYjJSMWJHVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUdCSmJuQjFkRTF2WkhWc1pXQWdZMnhoYzNNdVhHNGdLaUJVYUdVZ1lFbHVjSFYwVFc5a2RXeGxZQ0JqYkdGemN5QmhiR3h2ZDNNZ2RHOGdhVzV6ZEdGdWRHbGhkR1VnYlc5a2RXeGxjeUIwYUdGMElHRnlaU0J3WVhKMElHOW1JSFJvWlZ4dUlDb2diVzkwYVc5dUlHbHVjSFYwSUcxdlpIVnNaU3dnWVc1a0lIUm9ZWFFnY0hKdmRtbGtaU0IyWVd4MVpYTWdLR1p2Y2lCcGJuTjBZVzVqWlN3Z1lHUmxkbWxqWlc5eWFXVnVkR0YwYVc5dVlDeGNiaUFxSUdCaFkyTmxiR1Z5WVhScGIyNWdMQ0JnWlc1bGNtZDVZQ2t1WEc0Z0tseHVJQ29nUUdOc1lYTnpJRWx1Y0hWMFRXOWtkV3hsWEc0Z0tpOWNibU5zWVhOeklFbHVjSFYwVFc5a2RXeGxJSHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRM0psWVhSbGN5QmhiaUJnU1c1d2RYUk5iMlIxYkdWZ0lHMXZaSFZzWlNCcGJuTjBZVzVqWlM1Y2JpQWdJQ3BjYmlBZ0lDb2dRR052Ym5OMGNuVmpkRzl5WEc0Z0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQmxkbVZ1ZEZSNWNHVWdMU0JPWVcxbElHOW1JSFJvWlNCdGIyUjFiR1VnTHlCbGRtVnVkQ0FvS21VdVp5NHFJR0JrWlhacFkyVnZjbWxsYm5SaGRHbHZiaXdnSjJGalkyVnNaWEpoZEdsdmJpY3NJQ2RsYm1WeVoza25LUzVjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBjblZqZEc5eUtHVjJaVzUwVkhsd1pTa2dlMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUlhabGJuUWdkSGx3WlNCdlppQjBhR1VnYlc5a2RXeGxMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRSFJvYVhNZ1NXNXdkWFJOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN2MzUnlhVzVuZlZ4dUlDQWdJQ0FxSUVCamIyNXpkR0Z1ZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVpYWmxiblJVZVhCbElEMGdaWFpsYm5SVWVYQmxPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUVhKeVlYa2diMllnYkdsemRHVnVaWEp6SUdGMGRHRmphR1ZrSUhSdklIUm9hWE1nYlc5a2RXeGxJQzhnWlhabGJuUXVYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFkR2hwY3lCSmJuQjFkRTF2WkhWc1pWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0VFpYUThSblZ1WTNScGIyNCtmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11YkdsemRHVnVaWEp6SUQwZ2JtVjNJRk5sZENncE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dSWFpsYm5RZ2MyVnVkQ0JpZVNCMGFHbHpJRzF2WkhWc1pTNWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQjBhR2x6SUVsdWNIVjBUVzlrZFd4bFhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTI1MWJXSmxjbnh1ZFcxaVpYSmJYWDFjYmlBZ0lDQWdLaUJBWkdWbVlYVnNkQ0J1ZFd4c1hHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWxkbVZ1ZENBOUlHNTFiR3c3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCTmIyUjFiR1VnY0hKdmJXbHpaU0FvY21WemIyeDJaV1FnZDJobGJpQjBhR1VnYlc5a2RXeGxJR2x6SUdsdWFYUnBZV3hwZW1Wa0tTNWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQjBhR2x6SUVsdWNIVjBUVzlrZFd4bFhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTFCeWIyMXBjMlY5WEc0Z0lDQWdJQ29nUUdSbFptRjFiSFFnYm5Wc2JGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVjSEp2YldselpTQTlJRzUxYkd3N1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkpibVJwWTJGMFpYTWdhV1lnZEdobElHMXZaSFZzWlNkeklHVjJaVzUwSUhaaGJIVmxjeUJoY21VZ1kyRnNZM1ZzWVhSbFpDQm1jbTl0SUhCaGNtVnVkQ0J0YjJSMWJHVnpJQzhnWlhabGJuUnpMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRSFJvYVhNZ1NXNXdkWFJOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1ltOXZiSDFjYmlBZ0lDQWdLaUJBWkdWbVlYVnNkQ0JtWVd4elpWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVhWE5EWVd4amRXeGhkR1ZrSUQwZ1ptRnNjMlU3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCSmJtUnBZMkYwWlhNZ2FXWWdkR2hsSUcxdlpIVnNaU2R6SUdWMlpXNTBJSFpoYkhWbGN5QmhjbVVnY0hKdmRtbGtaV1FnWW5rZ2RHaGxJR1JsZG1salpTZHpJSE5sYm5OdmNuTXVYRzRnSUNBZ0lDb2dLQ3BKTG1VdUtpQnBibVJwWTJGMFpYTWdhV1lnZEdobElHQW5aR1YyYVdObGJXOTBhVzl1SjJBZ2IzSWdZQ2RrWlhacFkyVnZjbWxsYm5SaGRHbHZiaWRnSUdWMlpXNTBjeUJ3Y205MmFXUmxJSFJvWlNCeVpYRjFhWEpsWkNCeVlYY2dkbUZzZFdWekxpbGNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQjBhR2x6SUVsdWNIVjBUVzlrZFd4bFhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTJKdmIyeDlYRzRnSUNBZ0lDb2dRR1JsWm1GMWJIUWdabUZzYzJWY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtbHpVSEp2ZG1sa1pXUWdQU0JtWVd4elpUdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRkJsY21sdlpDQmhkQ0IzYUdsamFDQjBhR1VnYlc5a2RXeGxKM01nWlhabGJuUnpJR0Z5WlNCelpXNTBJQ2hnZFc1a1pXWnBibVZrWUNCcFppQjBhR1VnWlhabGJuUnpJR0Z5WlNCdWIzUWdjMlZ1ZENCaGRDQnlaV2QxYkdGeUlHbHVkR1Z5ZG1Gc2N5a3VYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFkR2hwY3lCSmJuQjFkRTF2WkhWc1pWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0dWRXMWlaWEo5WEc0Z0lDQWdJQ29nUUdSbFptRjFiSFFnZFc1a1pXWnBibVZrWEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1d1pYSnBiMlFnUFNCMWJtUmxabWx1WldRN1hHNWNiaUFnSUNCMGFHbHpMbVZ0YVhRZ1BTQjBhR2x6TG1WdGFYUXVZbWx1WkNoMGFHbHpLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCSmJtUnBZMkYwWlhNZ2QyaGxkR2hsY2lCMGFHVWdiVzlrZFd4bElHTmhiaUJ3Y205MmFXUmxJSFpoYkhWbGN5QnZjaUJ1YjNRdVhHNGdJQ0FxWEc0Z0lDQXFJRUIwZVhCbElIdGliMjlzZlZ4dUlDQWdLaUJBY21WaFpHOXViSGxjYmlBZ0lDb3ZYRzRnSUdkbGRDQnBjMVpoYkdsa0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb2RHaHBjeTVwYzFCeWIzWnBaR1ZrSUh4OElIUm9hWE11YVhORFlXeGpkV3hoZEdWa0tUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJKYm1sMGFXRnNhWHBsY3lCMGFHVWdiVzlrZFd4bExseHVJQ0FnS2x4dUlDQWdLaUJBY0dGeVlXMGdlMloxYm1OMGFXOXVmU0J3Y205dGFYTmxSblZ1SUMwZ1VISnZiV2x6WlNCbWRXNWpkR2x2YmlCMGFHRjBJSFJoYTJWeklIUm9aU0JnY21WemIyeDJaV0FnWVc1a0lHQnlaV3BsWTNSZ0lHWjFibU4wYVc5dWN5QmhjeUJoY21kMWJXVnVkSE11WEc0Z0lDQXFJRUJ5WlhSMWNtNGdlMUJ5YjIxcGMyVjlYRzRnSUNBcUwxeHVJQ0JwYm1sMEtIQnliMjFwYzJWR2RXNHBJSHRjYmlBZ0lDQjBhR2x6TG5CeWIyMXBjMlVnUFNCdVpYY2dVSEp2YldselpTaHdjbTl0YVhObFJuVnVLVHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTV3Y205dGFYTmxPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVGa1pITWdZU0JzYVhOMFpXNWxjaUIwYnlCMGFHVWdiVzlrZFd4bExseHVJQ0FnS2x4dUlDQWdLaUJBY0dGeVlXMGdlMloxYm1OMGFXOXVmU0JzYVhOMFpXNWxjaUF0SUV4cGMzUmxibVZ5SUhSdklHRmtaQzVjYmlBZ0lDb3ZYRzRnSUdGa1pFeHBjM1JsYm1WeUtHeHBjM1JsYm1WeUtTQjdYRzRnSUNBZ2RHaHBjeTVzYVhOMFpXNWxjbk11WVdSa0tHeHBjM1JsYm1WeUtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJTWlcxdmRtVnpJR0VnYkdsemRHVnVaWElnWm5KdmJTQjBhR1VnYlc5a2RXeGxMbHh1SUNBZ0tseHVJQ0FnS2lCQWNHRnlZVzBnZTJaMWJtTjBhVzl1ZlNCc2FYTjBaVzVsY2lBdElFeHBjM1JsYm1WeUlIUnZJSEpsYlc5MlpTNWNiaUFnSUNvdlhHNGdJSEpsYlc5MlpVeHBjM1JsYm1WeUtHeHBjM1JsYm1WeUtTQjdYRzRnSUNBZ2RHaHBjeTVzYVhOMFpXNWxjbk11WkdWc1pYUmxLR3hwYzNSbGJtVnlLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCUWNtOXdZV2RoZEdWeklHRnVJR1YyWlc1MElIUnZJR0ZzYkNCMGFHVWdiVzlrZFd4bEozTWdiR2x6ZEdWdVpYSnpMbHh1SUNBZ0tseHVJQ0FnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbnh1ZFcxaVpYSmJYWDBnVzJWMlpXNTBQWFJvYVhNdVpYWmxiblJkSUMwZ1JYWmxiblFnZG1Gc2RXVnpJSFJ2SUhCeWIzQmhaMkYwWlNCMGJ5QjBhR1VnYlc5a2RXeGxKM01nYkdsemRHVnVaWEp6TGx4dUlDQWdLaTljYmlBZ1pXMXBkQ2hsZG1WdWRDQTlJSFJvYVhNdVpYWmxiblFwSUh0Y2JpQWdJQ0IwYUdsekxteHBjM1JsYm1WeWN5NW1iM0pGWVdOb0tHeHBjM1JsYm1WeUlEMCtJR3hwYzNSbGJtVnlLR1YyWlc1MEtTazdYRzRnSUgxY2JuMWNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdTVzV3ZFhSTmIyUjFiR1U3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfSW5wdXRNb2R1bGUyID0gcmVxdWlyZSgnLi9JbnB1dE1vZHVsZScpO1xuXG52YXIgX0lucHV0TW9kdWxlMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0lucHV0TW9kdWxlMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxuLyoqXG4gKiBgRE9NRXZlbnRTdWJtb2R1bGVgIGNsYXNzLlxuICogVGhlIGBET01FdmVudFN1Ym1vZHVsZWAgY2xhc3MgYWxsb3dzIHRvIGluc3RhbnRpYXRlIG1vZHVsZXMgdGhhdCBwcm92aWRlXG4gKiB1bmlmaWVkIHZhbHVlcyAoc3VjaCBhcyBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBBY2NlbGVyYXRpb25gLFxuICogYFJvdGF0aW9uUmF0ZWAsIGBPcmllbnRhdGlvbmAsIGBPcmllbnRhdGlvbkFsdCkgZnJvbSB0aGUgYGRldmljZW1vdGlvbmBcbiAqIG9yIGBkZXZpY2VvcmllbnRhdGlvbmAgRE9NIGV2ZW50cy5cbiAqXG4gKiBAY2xhc3MgRE9NRXZlbnRTdWJtb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbnZhciBET01FdmVudFN1Ym1vZHVsZSA9IGZ1bmN0aW9uIChfSW5wdXRNb2R1bGUpIHtcbiAgX2luaGVyaXRzKERPTUV2ZW50U3VibW9kdWxlLCBfSW5wdXRNb2R1bGUpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYERPTUV2ZW50U3VibW9kdWxlYCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbk1vZHVsZXxEZXZpY2VPcmllbnRhdGlvbk1vZHVsZX0gRE9NRXZlbnRNb2R1bGUgLSBUaGUgcGFyZW50IERPTSBldmVudCBtb2R1bGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgc3VibW9kdWxlIC8gZXZlbnQgKCplLmcuKiAnYWNjZWxlcmF0aW9uJyBvciAnb3JpZW50YXRpb25BbHQnKS5cbiAgICogQHNlZSBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICogQHNlZSBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgKi9cbiAgZnVuY3Rpb24gRE9NRXZlbnRTdWJtb2R1bGUoRE9NRXZlbnRNb2R1bGUsIGV2ZW50VHlwZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBET01FdmVudFN1Ym1vZHVsZSk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRE9NIGV2ZW50IHBhcmVudCBtb2R1bGUgZnJvbSB3aGljaCB0aGlzIG1vZHVsZSBnZXRzIHRoZSByYXcgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRE9NRXZlbnRTdWJtb2R1bGVcbiAgICAgKiBAdHlwZSB7RGV2aWNlTW90aW9uTW9kdWxlfERldmljZU9yaWVudGF0aW9uTW9kdWxlfVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChET01FdmVudFN1Ym1vZHVsZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKERPTUV2ZW50U3VibW9kdWxlKSkuY2FsbCh0aGlzLCBldmVudFR5cGUpKTtcblxuICAgIF90aGlzLkRPTUV2ZW50TW9kdWxlID0gRE9NRXZlbnRNb2R1bGU7XG5cbiAgICAvKipcbiAgICAgKiBSYXcgdmFsdWVzIGNvbWluZyBmcm9tIHRoZSBgZGV2aWNlbW90aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRE9NRXZlbnRTdWJtb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgX3RoaXMuZXZlbnQgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBDb21wYXNzIGhlYWRpbmcgcmVmZXJlbmNlIChpT1MgZGV2aWNlcyBvbmx5LCBgT3JpZW50YXRpb25gIGFuZCBgT3JpZW50YXRpb25BbHRgIHN1Ym1vZHVsZXMgb25seSkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBET01FdmVudFN1Ym1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIF90aGlzLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSA9IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKERPTUV2ZW50U3VibW9kdWxlLCBbe1xuICAgIGtleTogJ2luaXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIC8vIEluZGljYXRlIHRvIHRoZSBwYXJlbnQgbW9kdWxlIHRoYXQgdGhpcyBldmVudCBpcyByZXF1aXJlZFxuICAgICAgdGhpcy5ET01FdmVudE1vZHVsZS5yZXF1aXJlZFt0aGlzLmV2ZW50VHlwZV0gPSB0cnVlO1xuXG4gICAgICAvLyBJZiB0aGUgcGFyZW50IGV2ZW50IGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXQsIGluaXRpYWxpemUgaXRcbiAgICAgIHZhciBET01FdmVudFByb21pc2UgPSB0aGlzLkRPTUV2ZW50TW9kdWxlLnByb21pc2U7XG4gICAgICBpZiAoIURPTUV2ZW50UHJvbWlzZSkgRE9NRXZlbnRQcm9taXNlID0gdGhpcy5ET01FdmVudE1vZHVsZS5pbml0KCk7XG5cbiAgICAgIHJldHVybiBET01FdmVudFByb21pc2UudGhlbihmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgIHJldHVybiBfdGhpczI7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRE9NRXZlbnRTdWJtb2R1bGU7XG59KF9JbnB1dE1vZHVsZTMuZGVmYXVsdCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IERPTUV2ZW50U3VibW9kdWxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtSUFRVVjJaVzUwVTNWaWJXOWtkV3hsTG1weklsMHNJbTVoYldWeklqcGJJa1JQVFVWMlpXNTBVM1ZpYlc5a2RXeGxJaXdpUkU5TlJYWmxiblJOYjJSMWJHVWlMQ0psZG1WdWRGUjVjR1VpTENKbGRtVnVkQ0lzSWw5M1pXSnJhWFJEYjIxd1lYTnpTR1ZoWkdsdVoxSmxabVZ5Wlc1alpTSXNJbkpsY1hWcGNtVmtJaXdpUkU5TlJYWmxiblJRY205dGFYTmxJaXdpY0hKdmJXbHpaU0lzSW1sdWFYUWlMQ0owYUdWdUlpd2liVzlrZFd4bElsMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenRCUVVGQk96czdPenM3T3pzN096czdRVUZGUVRzN096czdPenM3T3p0SlFWVk5RU3hwUWpzN08wRkJSVW83T3pzN096czdPenRCUVZOQkxEWkNRVUZaUXl4alFVRmFMRVZCUVRSQ1F5eFRRVUUxUWl4RlFVRjFRenRCUVVGQk96dEJRVWR5UXpzN096czdPenRCUVVoeFF5eHpTVUZETDBKQkxGTkJSQ3RDT3p0QlFWVnlReXhWUVVGTFJDeGpRVUZNTEVkQlFYTkNRU3hqUVVGMFFqczdRVUZGUVRzN096czdPenRCUVU5QkxGVkJRVXRGTEV0QlFVd3NSMEZCWVN4RFFVRkRMRU5CUVVRc1JVRkJTU3hEUVVGS0xFVkJRVThzUTBGQlVDeERRVUZpT3p0QlFVVkJPenM3T3pzN08wRkJUMEVzVlVGQlMwTXNPRUpCUVV3c1IwRkJjME1zU1VGQmRFTTdRVUUxUW5GRE8wRkJOa0owUXpzN1FVRkZSRHM3T3pzN096czdPekpDUVV0UE8wRkJRVUU3TzBGQlEwdzdRVUZEUVN4WFFVRkxTQ3hqUVVGTUxFTkJRVzlDU1N4UlFVRndRaXhEUVVFMlFpeExRVUZMU0N4VFFVRnNReXhKUVVFclF5eEpRVUV2UXpzN1FVRkZRVHRCUVVOQkxGVkJRVWxKTEd0Q1FVRnJRaXhMUVVGTFRDeGpRVUZNTEVOQlFXOUNUU3hQUVVFeFF6dEJRVU5CTEZWQlFVa3NRMEZCUTBRc1pVRkJUQ3hGUVVORlFTeHJRa0ZCYTBJc1MwRkJTMHdzWTBGQlRDeERRVUZ2UWs4c1NVRkJjRUlzUlVGQmJFSTdPMEZCUlVZc1lVRkJUMFlzWjBKQlFXZENSeXhKUVVGb1FpeERRVUZ4UWl4VlFVRkRReXhOUVVGRU8wRkJRVUU3UVVGQlFTeFBRVUZ5UWl4RFFVRlFPMEZCUTBRN096czdPenRyUWtGSFdWWXNhVUlpTENKbWFXeGxJam9pUkU5TlJYWmxiblJUZFdKdGIyUjFiR1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1NXNXdkWFJOYjJSMWJHVWdabkp2YlNBbkxpOUpibkIxZEUxdlpIVnNaU2M3WEc1Y2JpOHFLbHh1SUNvZ1lFUlBUVVYyWlc1MFUzVmliVzlrZFd4bFlDQmpiR0Z6Y3k1Y2JpQXFJRlJvWlNCZ1JFOU5SWFpsYm5SVGRXSnRiMlIxYkdWZ0lHTnNZWE56SUdGc2JHOTNjeUIwYnlCcGJuTjBZVzUwYVdGMFpTQnRiMlIxYkdWeklIUm9ZWFFnY0hKdmRtbGtaVnh1SUNvZ2RXNXBabWxsWkNCMllXeDFaWE1nS0hOMVkyZ2dZWE1nWUVGalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhsZ0xDQmdRV05qWld4bGNtRjBhVzl1WUN4Y2JpQXFJR0JTYjNSaGRHbHZibEpoZEdWZ0xDQmdUM0pwWlc1MFlYUnBiMjVnTENCZ1QzSnBaVzUwWVhScGIyNUJiSFFwSUdaeWIyMGdkR2hsSUdCa1pYWnBZMlZ0YjNScGIyNWdYRzRnS2lCdmNpQmdaR1YyYVdObGIzSnBaVzUwWVhScGIyNWdJRVJQVFNCbGRtVnVkSE11WEc0Z0tseHVJQ29nUUdOc1lYTnpJRVJQVFVWMlpXNTBVM1ZpYlc5a2RXeGxYRzRnS2lCQVpYaDBaVzVrY3lCSmJuQjFkRTF2WkhWc1pWeHVJQ292WEc1amJHRnpjeUJFVDAxRmRtVnVkRk4xWW0xdlpIVnNaU0JsZUhSbGJtUnpJRWx1Y0hWMFRXOWtkV3hsSUh0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUTNKbFlYUmxjeUJoSUdCRVQwMUZkbVZ1ZEZOMVltMXZaSFZzWldBZ2JXOWtkV3hsSUdsdWMzUmhibU5sTGx4dUlDQWdLbHh1SUNBZ0tpQkFZMjl1YzNSeWRXTjBiM0pjYmlBZ0lDb2dRSEJoY21GdElIdEVaWFpwWTJWTmIzUnBiMjVOYjJSMWJHVjhSR1YyYVdObFQzSnBaVzUwWVhScGIyNU5iMlIxYkdWOUlFUlBUVVYyWlc1MFRXOWtkV3hsSUMwZ1ZHaGxJSEJoY21WdWRDQkVUMDBnWlhabGJuUWdiVzlrZFd4bExseHVJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnWlhabGJuUlVlWEJsSUMwZ1ZHaGxJRzVoYldVZ2IyWWdkR2hsSUhOMVltMXZaSFZzWlNBdklHVjJaVzUwSUNncVpTNW5MaW9nSjJGalkyVnNaWEpoZEdsdmJpY2diM0lnSjI5eWFXVnVkR0YwYVc5dVFXeDBKeWt1WEc0Z0lDQXFJRUJ6WldVZ1JHVjJhV05sVFc5MGFXOXVUVzlrZFd4bFhHNGdJQ0FxSUVCelpXVWdSR1YyYVdObFQzSnBaVzUwWVhScGIyNU5iMlIxYkdWY2JpQWdJQ292WEc0Z0lHTnZibk4wY25WamRHOXlLRVJQVFVWMlpXNTBUVzlrZFd4bExDQmxkbVZ1ZEZSNWNHVXBJSHRjYmlBZ0lDQnpkWEJsY2lobGRtVnVkRlI1Y0dVcE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dWR2hsSUVSUFRTQmxkbVZ1ZENCd1lYSmxiblFnYlc5a2RXeGxJR1p5YjIwZ2QyaHBZMmdnZEdocGN5QnRiMlIxYkdVZ1oyVjBjeUIwYUdVZ2NtRjNJSFpoYkhWbGN5NWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQjBhR2x6SUVSUFRVVjJaVzUwVTNWaWJXOWtkV3hsWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMFJsZG1salpVMXZkR2x2YmsxdlpIVnNaWHhFWlhacFkyVlBjbWxsYm5SaGRHbHZiazF2WkhWc1pYMWNiaUFnSUNBZ0tpQkFZMjl1YzNSaGJuUmNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMa1JQVFVWMlpXNTBUVzlrZFd4bElEMGdSRTlOUlhabGJuUk5iMlIxYkdVN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlNZWGNnZG1Gc2RXVnpJR052YldsdVp5Qm1jbTl0SUhSb1pTQmdaR1YyYVdObGJXOTBhVzl1WUNCbGRtVnVkQ0J6Wlc1MElHSjVJSFJvYVhNZ2JXOWtkV3hsTGx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUhSb2FYTWdSRTlOUlhabGJuUlRkV0p0YjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN2JuVnRZbVZ5VzExOVhHNGdJQ0FnSUNvZ1FHUmxabUYxYkhRZ1d6QXNJREFzSURCZFhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWxkbVZ1ZENBOUlGc3dMQ0F3TENBd1hUdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRU52YlhCaGMzTWdhR1ZoWkdsdVp5QnlaV1psY21WdVkyVWdLR2xQVXlCa1pYWnBZMlZ6SUc5dWJIa3NJR0JQY21sbGJuUmhkR2x2Ym1BZ1lXNWtJR0JQY21sbGJuUmhkR2x2YmtGc2RHQWdjM1ZpYlc5a2RXeGxjeUJ2Ym14NUtTNWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQjBhR2x6SUVSUFRVVjJaVzUwVTNWaWJXOWtkV3hsWEc0Z0lDQWdJQ29nUUhSNWNHVWdlMjUxYldKbGNuMWNiaUFnSUNBZ0tpQkFaR1ZtWVhWc2RDQnVkV3hzWEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1ZmQyVmlhMmwwUTI5dGNHRnpjMGhsWVdScGJtZFNaV1psY21WdVkyVWdQU0J1ZFd4c08xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWx1YVhScFlXeHBlbVZ6SUc5bUlIUm9aU0J0YjJSMWJHVXVYRzRnSUNBcVhHNGdJQ0FxSUVCeVpYUjFjbTRnZTFCeWIyMXBjMlY5WEc0Z0lDQXFMMXh1SUNCcGJtbDBLQ2tnZTF4dUlDQWdJQzh2SUVsdVpHbGpZWFJsSUhSdklIUm9aU0J3WVhKbGJuUWdiVzlrZFd4bElIUm9ZWFFnZEdocGN5QmxkbVZ1ZENCcGN5QnlaWEYxYVhKbFpGeHVJQ0FnSUhSb2FYTXVSRTlOUlhabGJuUk5iMlIxYkdVdWNtVnhkV2x5WldSYmRHaHBjeTVsZG1WdWRGUjVjR1ZkSUQwZ2RISjFaVHRjYmx4dUlDQWdJQzh2SUVsbUlIUm9aU0J3WVhKbGJuUWdaWFpsYm5RZ2FHRnpJRzV2ZENCaVpXVnVJR2x1YVhScFlXeHBlbVZrSUhsbGRDd2dhVzVwZEdsaGJHbDZaU0JwZEZ4dUlDQWdJR3hsZENCRVQwMUZkbVZ1ZEZCeWIyMXBjMlVnUFNCMGFHbHpMa1JQVFVWMlpXNTBUVzlrZFd4bExuQnliMjFwYzJVN1hHNGdJQ0FnYVdZZ0tDRkVUMDFGZG1WdWRGQnliMjFwYzJVcFhHNGdJQ0FnSUNCRVQwMUZkbVZ1ZEZCeWIyMXBjMlVnUFNCMGFHbHpMa1JQVFVWMlpXNTBUVzlrZFd4bExtbHVhWFFvS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUJFVDAxRmRtVnVkRkJ5YjIxcGMyVXVkR2hsYmlnb2JXOWtkV3hsS1NBOVBpQjBhR2x6S1R0Y2JpQWdmVnh1ZlZ4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCRVQwMUZkbVZ1ZEZOMVltMXZaSFZzWlR0Y2JpSmRmUT09IiwiLyohXG4gKiBQbGF0Zm9ybS5qcyA8aHR0cHM6Ly9tdGhzLmJlL3BsYXRmb3JtPlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNiBCZW5qYW1pbiBUYW4gPGh0dHBzOi8vZGVtb25lYXV4LmdpdGh1Yi5pby8+XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDEzIEpvaG4tRGF2aWQgRGFsdG9uIDxodHRwOi8vYWxseW91Y2FubGVldC5jb20vPlxuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL210aHMuYmUvbWl0PlxuICovXG47KGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgYE9iamVjdGAuICovXG4gIHZhciBvYmplY3RUeXBlcyA9IHtcbiAgICAnZnVuY3Rpb24nOiB0cnVlLFxuICAgICdvYmplY3QnOiB0cnVlXG4gIH07XG5cbiAgLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciByb290ID0gKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdykgfHwgdGhpcztcblxuICAvKiogQmFja3VwIHBvc3NpYmxlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciBvbGRSb290ID0gcm9vdDtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xuICB2YXIgZnJlZUV4cG9ydHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cztcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG4gIHZhciBmcmVlTW9kdWxlID0gb2JqZWN0VHlwZXNbdHlwZW9mIG1vZHVsZV0gJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMgb3IgQnJvd3NlcmlmaWVkIGNvZGUgYW5kIHVzZSBpdCBhcyBgcm9vdGAuICovXG4gIHZhciBmcmVlR2xvYmFsID0gZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcbiAgaWYgKGZyZWVHbG9iYWwgJiYgKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbCkpIHtcbiAgICByb290ID0gZnJlZUdsb2JhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGFzIHRoZSBtYXhpbXVtIGxlbmd0aCBvZiBhbiBhcnJheS1saWtlIG9iamVjdC5cbiAgICogU2VlIHRoZSBbRVM2IHNwZWNdKGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKVxuICAgKiBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKi9cbiAgdmFyIG1heFNhZmVJbnRlZ2VyID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuICAvKiogUmVndWxhciBleHByZXNzaW9uIHRvIGRldGVjdCBPcGVyYS4gKi9cbiAgdmFyIHJlT3BlcmEgPSAvXFxiT3BlcmEvO1xuXG4gIC8qKiBQb3NzaWJsZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgdGhpc0JpbmRpbmcgPSB0aGlzO1xuXG4gIC8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG4gIHZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgLyoqIFVzZWQgdG8gY2hlY2sgZm9yIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdC4gKi9cbiAgdmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgaW50ZXJuYWwgYFtbQ2xhc3NdXWAgb2YgdmFsdWVzLiAqL1xuICB2YXIgdG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ2FwaXRhbGl6ZXMgYSBzdHJpbmcgdmFsdWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjYXBpdGFsaXplLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY2FwaXRhbGl6ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKTtcbiAgICByZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgdXRpbGl0eSBmdW5jdGlvbiB0byBjbGVhbiB1cCB0aGUgT1MgbmFtZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9zIFRoZSBPUyBuYW1lIHRvIGNsZWFuIHVwLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3BhdHRlcm5dIEEgYFJlZ0V4cGAgcGF0dGVybiBtYXRjaGluZyB0aGUgT1MgbmFtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtsYWJlbF0gQSBsYWJlbCBmb3IgdGhlIE9TLlxuICAgKi9cbiAgZnVuY3Rpb24gY2xlYW51cE9TKG9zLCBwYXR0ZXJuLCBsYWJlbCkge1xuICAgIC8vIFBsYXRmb3JtIHRva2VucyBhcmUgZGVmaW5lZCBhdDpcbiAgICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1Mzc1MDMoVlMuODUpLmFzcHhcbiAgICAvLyBodHRwOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDA4MTEyMjA1Mzk1MC9odHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1Mzc1MDMoVlMuODUpLmFzcHhcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICcxMC4wJzogJzEwJyxcbiAgICAgICc2LjQnOiAgJzEwIFRlY2huaWNhbCBQcmV2aWV3JyxcbiAgICAgICc2LjMnOiAgJzguMScsXG4gICAgICAnNi4yJzogICc4JyxcbiAgICAgICc2LjEnOiAgJ1NlcnZlciAyMDA4IFIyIC8gNycsXG4gICAgICAnNi4wJzogICdTZXJ2ZXIgMjAwOCAvIFZpc3RhJyxcbiAgICAgICc1LjInOiAgJ1NlcnZlciAyMDAzIC8gWFAgNjQtYml0JyxcbiAgICAgICc1LjEnOiAgJ1hQJyxcbiAgICAgICc1LjAxJzogJzIwMDAgU1AxJyxcbiAgICAgICc1LjAnOiAgJzIwMDAnLFxuICAgICAgJzQuMCc6ICAnTlQnLFxuICAgICAgJzQuOTAnOiAnTUUnXG4gICAgfTtcbiAgICAvLyBEZXRlY3QgV2luZG93cyB2ZXJzaW9uIGZyb20gcGxhdGZvcm0gdG9rZW5zLlxuICAgIGlmIChwYXR0ZXJuICYmIGxhYmVsICYmIC9eV2luL2kudGVzdChvcykgJiYgIS9eV2luZG93cyBQaG9uZSAvaS50ZXN0KG9zKSAmJlxuICAgICAgICAoZGF0YSA9IGRhdGFbL1tcXGQuXSskLy5leGVjKG9zKV0pKSB7XG4gICAgICBvcyA9ICdXaW5kb3dzICcgKyBkYXRhO1xuICAgIH1cbiAgICAvLyBDb3JyZWN0IGNoYXJhY3RlciBjYXNlIGFuZCBjbGVhbnVwIHN0cmluZy5cbiAgICBvcyA9IFN0cmluZyhvcyk7XG5cbiAgICBpZiAocGF0dGVybiAmJiBsYWJlbCkge1xuICAgICAgb3MgPSBvcy5yZXBsYWNlKFJlZ0V4cChwYXR0ZXJuLCAnaScpLCBsYWJlbCk7XG4gICAgfVxuXG4gICAgb3MgPSBmb3JtYXQoXG4gICAgICBvcy5yZXBsYWNlKC8gY2UkL2ksICcgQ0UnKVxuICAgICAgICAucmVwbGFjZSgvXFxiaHB3L2ksICd3ZWInKVxuICAgICAgICAucmVwbGFjZSgvXFxiTWFjaW50b3NoXFxiLywgJ01hYyBPUycpXG4gICAgICAgIC5yZXBsYWNlKC9fUG93ZXJQQ1xcYi9pLCAnIE9TJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYihPUyBYKSBbXiBcXGRdKy9pLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFxiTWFjIChPUyBYKVxcYi8sICckMScpXG4gICAgICAgIC5yZXBsYWNlKC9cXC8oXFxkKS8sICcgJDEnKVxuICAgICAgICAucmVwbGFjZSgvXy9nLCAnLicpXG4gICAgICAgIC5yZXBsYWNlKC8oPzogQmVQQ3xbIC5dKmZjWyBcXGQuXSspJC9pLCAnJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYng4NlxcLjY0XFxiL2dpLCAneDg2XzY0JylcbiAgICAgICAgLnJlcGxhY2UoL1xcYihXaW5kb3dzIFBob25lKSBPU1xcYi8sICckMScpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoQ2hyb21lIE9TIFxcdyspIFtcXGQuXStcXGIvLCAnJDEnKVxuICAgICAgICAuc3BsaXQoJyBvbiAnKVswXVxuICAgICk7XG5cbiAgICByZXR1cm4gb3M7XG4gIH1cblxuICAvKipcbiAgICogQW4gaXRlcmF0aW9uIHV0aWxpdHkgZm9yIGFycmF5cyBhbmQgb2JqZWN0cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gZWFjaChvYmplY3QsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG9iamVjdCA/IG9iamVjdC5sZW5ndGggOiAwO1xuXG4gICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID4gLTEgJiYgbGVuZ3RoIDw9IG1heFNhZmVJbnRlZ2VyKSB7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBjYWxsYmFjayhvYmplY3RbaW5kZXhdLCBpbmRleCwgb2JqZWN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yT3duKG9iamVjdCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmltIGFuZCBjb25kaXRpb25hbGx5IGNhcGl0YWxpemUgc3RyaW5nIHZhbHVlcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGZvcm1hdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBmb3JtYXQoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gdHJpbShzdHJpbmcpO1xuICAgIHJldHVybiAvXig/OndlYk9TfGkoPzpPU3xQKSkvLnRlc3Qoc3RyaW5nKVxuICAgICAgPyBzdHJpbmdcbiAgICAgIDogY2FwaXRhbGl6ZShzdHJpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMsIGV4ZWN1dGluZyB0aGUgYGNhbGxiYWNrYCBmb3IgZWFjaC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIGV4ZWN1dGVkIHBlciBvd24gcHJvcGVydHkuXG4gICAqL1xuICBmdW5jdGlvbiBmb3JPd24ob2JqZWN0LCBjYWxsYmFjaykge1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgICBjYWxsYmFjayhvYmplY3Rba2V5XSwga2V5LCBvYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpbnRlcm5hbCBgW1tDbGFzc11dYCBvZiBhIHZhbHVlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGBbW0NsYXNzXV1gLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NPZih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IGNhcGl0YWxpemUodmFsdWUpXG4gICAgICA6IHRvU3RyaW5nLmNhbGwodmFsdWUpLnNsaWNlKDgsIC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIb3N0IG9iamVjdHMgY2FuIHJldHVybiB0eXBlIHZhbHVlcyB0aGF0IGFyZSBkaWZmZXJlbnQgZnJvbSB0aGVpciBhY3R1YWxcbiAgICogZGF0YSB0eXBlLiBUaGUgb2JqZWN0cyB3ZSBhcmUgY29uY2VybmVkIHdpdGggdXN1YWxseSByZXR1cm4gbm9uLXByaW1pdGl2ZVxuICAgKiB0eXBlcyBvZiBcIm9iamVjdFwiLCBcImZ1bmN0aW9uXCIsIG9yIFwidW5rbm93blwiLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgb3duZXIgb2YgdGhlIHByb3BlcnR5LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHByb3BlcnR5IHZhbHVlIGlzIGEgbm9uLXByaW1pdGl2ZSwgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gaXNIb3N0VHlwZShvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgdmFyIHR5cGUgPSBvYmplY3QgIT0gbnVsbCA/IHR5cGVvZiBvYmplY3RbcHJvcGVydHldIDogJ251bWJlcic7XG4gICAgcmV0dXJuICEvXig/OmJvb2xlYW58bnVtYmVyfHN0cmluZ3x1bmRlZmluZWQpJC8udGVzdCh0eXBlKSAmJlxuICAgICAgKHR5cGUgPT0gJ29iamVjdCcgPyAhIW9iamVjdFtwcm9wZXJ0eV0gOiB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmVwYXJlcyBhIHN0cmluZyBmb3IgdXNlIGluIGEgYFJlZ0V4cGAgYnkgbWFraW5nIGh5cGhlbnMgYW5kIHNwYWNlcyBvcHRpb25hbC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHF1YWxpZnkuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBxdWFsaWZpZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gcXVhbGlmeShzdHJpbmcpIHtcbiAgICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvKFsgLV0pKD8hJCkvZywgJyQxPycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgYmFyZS1ib25lcyBgQXJyYXkjcmVkdWNlYCBsaWtlIHV0aWxpdHkgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMgeyp9IFRoZSBhY2N1bXVsYXRlZCByZXN1bHQuXG4gICAqL1xuICBmdW5jdGlvbiByZWR1Y2UoYXJyYXksIGNhbGxiYWNrKSB7XG4gICAgdmFyIGFjY3VtdWxhdG9yID0gbnVsbDtcbiAgICBlYWNoKGFycmF5LCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgYXJyYXkpO1xuICAgIH0pO1xuICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UgZnJvbSBhIHN0cmluZy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHRyaW0uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0cmltbWVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIHRyaW0oc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoL14gK3wgKyQvZywgJycpO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgcGxhdGZvcm0gb2JqZWN0LlxuICAgKlxuICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBbdWE9bmF2aWdhdG9yLnVzZXJBZ2VudF0gVGhlIHVzZXIgYWdlbnQgc3RyaW5nIG9yXG4gICAqICBjb250ZXh0IG9iamVjdC5cbiAgICogQHJldHVybnMge09iamVjdH0gQSBwbGF0Zm9ybSBvYmplY3QuXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZSh1YSkge1xuXG4gICAgLyoqIFRoZSBlbnZpcm9ubWVudCBjb250ZXh0IG9iamVjdC4gKi9cbiAgICB2YXIgY29udGV4dCA9IHJvb3Q7XG5cbiAgICAvKiogVXNlZCB0byBmbGFnIHdoZW4gYSBjdXN0b20gY29udGV4dCBpcyBwcm92aWRlZC4gKi9cbiAgICB2YXIgaXNDdXN0b21Db250ZXh0ID0gdWEgJiYgdHlwZW9mIHVhID09ICdvYmplY3QnICYmIGdldENsYXNzT2YodWEpICE9ICdTdHJpbmcnO1xuXG4gICAgLy8gSnVnZ2xlIGFyZ3VtZW50cy5cbiAgICBpZiAoaXNDdXN0b21Db250ZXh0KSB7XG4gICAgICBjb250ZXh0ID0gdWE7XG4gICAgICB1YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqIEJyb3dzZXIgbmF2aWdhdG9yIG9iamVjdC4gKi9cbiAgICB2YXIgbmF2ID0gY29udGV4dC5uYXZpZ2F0b3IgfHwge307XG5cbiAgICAvKiogQnJvd3NlciB1c2VyIGFnZW50IHN0cmluZy4gKi9cbiAgICB2YXIgdXNlckFnZW50ID0gbmF2LnVzZXJBZ2VudCB8fCAnJztcblxuICAgIHVhIHx8ICh1YSA9IHVzZXJBZ2VudCk7XG5cbiAgICAvKiogVXNlZCB0byBmbGFnIHdoZW4gYHRoaXNCaW5kaW5nYCBpcyB0aGUgW01vZHVsZVNjb3BlXS4gKi9cbiAgICB2YXIgaXNNb2R1bGVTY29wZSA9IGlzQ3VzdG9tQ29udGV4dCB8fCB0aGlzQmluZGluZyA9PSBvbGRSb290O1xuXG4gICAgLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGJyb3dzZXIgaXMgbGlrZSBDaHJvbWUuICovXG4gICAgdmFyIGxpa2VDaHJvbWUgPSBpc0N1c3RvbUNvbnRleHRcbiAgICAgID8gISFuYXYubGlrZUNocm9tZVxuICAgICAgOiAvXFxiQ2hyb21lXFxiLy50ZXN0KHVhKSAmJiAhL2ludGVybmFsfFxcbi9pLnRlc3QodG9TdHJpbmcudG9TdHJpbmcoKSk7XG5cbiAgICAvKiogSW50ZXJuYWwgYFtbQ2xhc3NdXWAgdmFsdWUgc2hvcnRjdXRzLiAqL1xuICAgIHZhciBvYmplY3RDbGFzcyA9ICdPYmplY3QnLFxuICAgICAgICBhaXJSdW50aW1lQ2xhc3MgPSBpc0N1c3RvbUNvbnRleHQgPyBvYmplY3RDbGFzcyA6ICdTY3JpcHRCcmlkZ2luZ1Byb3h5T2JqZWN0JyxcbiAgICAgICAgZW52aXJvQ2xhc3MgPSBpc0N1c3RvbUNvbnRleHQgPyBvYmplY3RDbGFzcyA6ICdFbnZpcm9ubWVudCcsXG4gICAgICAgIGphdmFDbGFzcyA9IChpc0N1c3RvbUNvbnRleHQgJiYgY29udGV4dC5qYXZhKSA/ICdKYXZhUGFja2FnZScgOiBnZXRDbGFzc09mKGNvbnRleHQuamF2YSksXG4gICAgICAgIHBoYW50b21DbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ1J1bnRpbWVPYmplY3QnO1xuXG4gICAgLyoqIERldGVjdCBKYXZhIGVudmlyb25tZW50cy4gKi9cbiAgICB2YXIgamF2YSA9IC9cXGJKYXZhLy50ZXN0KGphdmFDbGFzcykgJiYgY29udGV4dC5qYXZhO1xuXG4gICAgLyoqIERldGVjdCBSaGluby4gKi9cbiAgICB2YXIgcmhpbm8gPSBqYXZhICYmIGdldENsYXNzT2YoY29udGV4dC5lbnZpcm9ubWVudCkgPT0gZW52aXJvQ2xhc3M7XG5cbiAgICAvKiogQSBjaGFyYWN0ZXIgdG8gcmVwcmVzZW50IGFscGhhLiAqL1xuICAgIHZhciBhbHBoYSA9IGphdmEgPyAnYScgOiAnXFx1MDNiMSc7XG5cbiAgICAvKiogQSBjaGFyYWN0ZXIgdG8gcmVwcmVzZW50IGJldGEuICovXG4gICAgdmFyIGJldGEgPSBqYXZhID8gJ2InIDogJ1xcdTAzYjInO1xuXG4gICAgLyoqIEJyb3dzZXIgZG9jdW1lbnQgb2JqZWN0LiAqL1xuICAgIHZhciBkb2MgPSBjb250ZXh0LmRvY3VtZW50IHx8IHt9O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IE9wZXJhIGJyb3dzZXIgKFByZXN0by1iYXNlZCkuXG4gICAgICogaHR0cDovL3d3dy5ob3d0b2NyZWF0ZS5jby51ay9vcGVyYVN0dWZmL29wZXJhT2JqZWN0Lmh0bWxcbiAgICAgKiBodHRwOi8vZGV2Lm9wZXJhLmNvbS9hcnRpY2xlcy92aWV3L29wZXJhLW1pbmktd2ViLWNvbnRlbnQtYXV0aG9yaW5nLWd1aWRlbGluZXMvI29wZXJhbWluaVxuICAgICAqL1xuICAgIHZhciBvcGVyYSA9IGNvbnRleHQub3BlcmFtaW5pIHx8IGNvbnRleHQub3BlcmE7XG5cbiAgICAvKiogT3BlcmEgYFtbQ2xhc3NdXWAuICovXG4gICAgdmFyIG9wZXJhQ2xhc3MgPSByZU9wZXJhLnRlc3Qob3BlcmFDbGFzcyA9IChpc0N1c3RvbUNvbnRleHQgJiYgb3BlcmEpID8gb3BlcmFbJ1tbQ2xhc3NdXSddIDogZ2V0Q2xhc3NPZihvcGVyYSkpXG4gICAgICA/IG9wZXJhQ2xhc3NcbiAgICAgIDogKG9wZXJhID0gbnVsbCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKiogVGVtcG9yYXJ5IHZhcmlhYmxlIHVzZWQgb3ZlciB0aGUgc2NyaXB0J3MgbGlmZXRpbWUuICovXG4gICAgdmFyIGRhdGE7XG5cbiAgICAvKiogVGhlIENQVSBhcmNoaXRlY3R1cmUuICovXG4gICAgdmFyIGFyY2ggPSB1YTtcblxuICAgIC8qKiBQbGF0Zm9ybSBkZXNjcmlwdGlvbiBhcnJheS4gKi9cbiAgICB2YXIgZGVzY3JpcHRpb24gPSBbXTtcblxuICAgIC8qKiBQbGF0Zm9ybSBhbHBoYS9iZXRhIGluZGljYXRvci4gKi9cbiAgICB2YXIgcHJlcmVsZWFzZSA9IG51bGw7XG5cbiAgICAvKiogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgZW52aXJvbm1lbnQgZmVhdHVyZXMgc2hvdWxkIGJlIHVzZWQgdG8gcmVzb2x2ZSB0aGUgcGxhdGZvcm0uICovXG4gICAgdmFyIHVzZUZlYXR1cmVzID0gdWEgPT0gdXNlckFnZW50O1xuXG4gICAgLyoqIFRoZSBicm93c2VyL2Vudmlyb25tZW50IHZlcnNpb24uICovXG4gICAgdmFyIHZlcnNpb24gPSB1c2VGZWF0dXJlcyAmJiBvcGVyYSAmJiB0eXBlb2Ygb3BlcmEudmVyc2lvbiA9PSAnZnVuY3Rpb24nICYmIG9wZXJhLnZlcnNpb24oKTtcblxuICAgIC8qKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIE9TIGVuZHMgd2l0aCBcIi8gVmVyc2lvblwiICovXG4gICAgdmFyIGlzU3BlY2lhbENhc2VkT1M7XG5cbiAgICAvKiBEZXRlY3RhYmxlIGxheW91dCBlbmdpbmVzIChvcmRlciBpcyBpbXBvcnRhbnQpLiAqL1xuICAgIHZhciBsYXlvdXQgPSBnZXRMYXlvdXQoW1xuICAgICAgeyAnbGFiZWwnOiAnRWRnZUhUTUwnLCAncGF0dGVybic6ICdFZGdlJyB9LFxuICAgICAgJ1RyaWRlbnQnLFxuICAgICAgeyAnbGFiZWwnOiAnV2ViS2l0JywgJ3BhdHRlcm4nOiAnQXBwbGVXZWJLaXQnIH0sXG4gICAgICAnaUNhYicsXG4gICAgICAnUHJlc3RvJyxcbiAgICAgICdOZXRGcm9udCcsXG4gICAgICAnVGFzbWFuJyxcbiAgICAgICdLSFRNTCcsXG4gICAgICAnR2Vja28nXG4gICAgXSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIGJyb3dzZXIgbmFtZXMgKG9yZGVyIGlzIGltcG9ydGFudCkuICovXG4gICAgdmFyIG5hbWUgPSBnZXROYW1lKFtcbiAgICAgICdBZG9iZSBBSVInLFxuICAgICAgJ0Fyb3JhJyxcbiAgICAgICdBdmFudCBCcm93c2VyJyxcbiAgICAgICdCcmVhY2gnLFxuICAgICAgJ0NhbWlubycsXG4gICAgICAnRWxlY3Ryb24nLFxuICAgICAgJ0VwaXBoYW55JyxcbiAgICAgICdGZW5uZWMnLFxuICAgICAgJ0Zsb2NrJyxcbiAgICAgICdHYWxlb24nLFxuICAgICAgJ0dyZWVuQnJvd3NlcicsXG4gICAgICAnaUNhYicsXG4gICAgICAnSWNld2Vhc2VsJyxcbiAgICAgICdLLU1lbGVvbicsXG4gICAgICAnS29ucXVlcm9yJyxcbiAgICAgICdMdW5hc2NhcGUnLFxuICAgICAgJ01heHRob24nLFxuICAgICAgeyAnbGFiZWwnOiAnTWljcm9zb2Z0IEVkZ2UnLCAncGF0dGVybic6ICdFZGdlJyB9LFxuICAgICAgJ01pZG9yaScsXG4gICAgICAnTm9vayBCcm93c2VyJyxcbiAgICAgICdQYWxlTW9vbicsXG4gICAgICAnUGhhbnRvbUpTJyxcbiAgICAgICdSYXZlbicsXG4gICAgICAnUmVrb25xJyxcbiAgICAgICdSb2NrTWVsdCcsXG4gICAgICB7ICdsYWJlbCc6ICdTYW1zdW5nIEludGVybmV0JywgJ3BhdHRlcm4nOiAnU2Ftc3VuZ0Jyb3dzZXInIH0sXG4gICAgICAnU2VhTW9ua2V5JyxcbiAgICAgIHsgJ2xhYmVsJzogJ1NpbGsnLCAncGF0dGVybic6ICcoPzpDbG91ZDl8U2lsay1BY2NlbGVyYXRlZCknIH0sXG4gICAgICAnU2xlaXBuaXInLFxuICAgICAgJ1NsaW1Ccm93c2VyJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1NSV2FyZSBJcm9uJywgJ3BhdHRlcm4nOiAnSXJvbicgfSxcbiAgICAgICdTdW5yaXNlJyxcbiAgICAgICdTd2lmdGZveCcsXG4gICAgICAnV2F0ZXJmb3gnLFxuICAgICAgJ1dlYlBvc2l0aXZlJyxcbiAgICAgICdPcGVyYSBNaW5pJyxcbiAgICAgIHsgJ2xhYmVsJzogJ09wZXJhIE1pbmknLCAncGF0dGVybic6ICdPUGlPUycgfSxcbiAgICAgICdPcGVyYScsXG4gICAgICB7ICdsYWJlbCc6ICdPcGVyYScsICdwYXR0ZXJuJzogJ09QUicgfSxcbiAgICAgICdDaHJvbWUnLFxuICAgICAgeyAnbGFiZWwnOiAnQ2hyb21lIE1vYmlsZScsICdwYXR0ZXJuJzogJyg/OkNyaU9TfENyTW8pJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnRmlyZWZveCcsICdwYXR0ZXJuJzogJyg/OkZpcmVmb3h8TWluZWZpZWxkKScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0ZpcmVmb3ggZm9yIGlPUycsICdwYXR0ZXJuJzogJ0Z4aU9TJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnSUUnLCAncGF0dGVybic6ICdJRU1vYmlsZScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0lFJywgJ3BhdHRlcm4nOiAnTVNJRScgfSxcbiAgICAgICdTYWZhcmknXG4gICAgXSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIHByb2R1Y3RzIChvcmRlciBpcyBpbXBvcnRhbnQpLiAqL1xuICAgIHZhciBwcm9kdWN0ID0gZ2V0UHJvZHVjdChbXG4gICAgICB7ICdsYWJlbCc6ICdCbGFja0JlcnJ5JywgJ3BhdHRlcm4nOiAnQkIxMCcgfSxcbiAgICAgICdCbGFja0JlcnJ5JyxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTJywgJ3BhdHRlcm4nOiAnR1QtSTkwMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzInLCAncGF0dGVybic6ICdHVC1JOTEwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTMycsICdwYXR0ZXJuJzogJ0dULUk5MzAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM0JywgJ3BhdHRlcm4nOiAnR1QtSTk1MDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzUnLCAncGF0dGVybic6ICdTTS1HOTAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM2JywgJ3BhdHRlcm4nOiAnU00tRzkyMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNiBFZGdlJywgJ3BhdHRlcm4nOiAnU00tRzkyNScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNycsICdwYXR0ZXJuJzogJ1NNLUc5MzAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzcgRWRnZScsICdwYXR0ZXJuJzogJ1NNLUc5MzUnIH0sXG4gICAgICAnR29vZ2xlIFRWJyxcbiAgICAgICdMdW1pYScsXG4gICAgICAnaVBhZCcsXG4gICAgICAnaVBvZCcsXG4gICAgICAnaVBob25lJyxcbiAgICAgICdLaW5kbGUnLFxuICAgICAgeyAnbGFiZWwnOiAnS2luZGxlIEZpcmUnLCAncGF0dGVybic6ICcoPzpDbG91ZDl8U2lsay1BY2NlbGVyYXRlZCknIH0sXG4gICAgICAnTmV4dXMnLFxuICAgICAgJ05vb2snLFxuICAgICAgJ1BsYXlCb29rJyxcbiAgICAgICdQbGF5U3RhdGlvbiBWaXRhJyxcbiAgICAgICdQbGF5U3RhdGlvbicsXG4gICAgICAnVG91Y2hQYWQnLFxuICAgICAgJ1RyYW5zZm9ybWVyJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1dpaSBVJywgJ3BhdHRlcm4nOiAnV2lpVScgfSxcbiAgICAgICdXaWknLFxuICAgICAgJ1hib3ggT25lJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1hib3ggMzYwJywgJ3BhdHRlcm4nOiAnWGJveCcgfSxcbiAgICAgICdYb29tJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBtYW51ZmFjdHVyZXJzLiAqL1xuICAgIHZhciBtYW51ZmFjdHVyZXIgPSBnZXRNYW51ZmFjdHVyZXIoe1xuICAgICAgJ0FwcGxlJzogeyAnaVBhZCc6IDEsICdpUGhvbmUnOiAxLCAnaVBvZCc6IDEgfSxcbiAgICAgICdBcmNob3MnOiB7fSxcbiAgICAgICdBbWF6b24nOiB7ICdLaW5kbGUnOiAxLCAnS2luZGxlIEZpcmUnOiAxIH0sXG4gICAgICAnQXN1cyc6IHsgJ1RyYW5zZm9ybWVyJzogMSB9LFxuICAgICAgJ0Jhcm5lcyAmIE5vYmxlJzogeyAnTm9vayc6IDEgfSxcbiAgICAgICdCbGFja0JlcnJ5JzogeyAnUGxheUJvb2snOiAxIH0sXG4gICAgICAnR29vZ2xlJzogeyAnR29vZ2xlIFRWJzogMSwgJ05leHVzJzogMSB9LFxuICAgICAgJ0hQJzogeyAnVG91Y2hQYWQnOiAxIH0sXG4gICAgICAnSFRDJzoge30sXG4gICAgICAnTEcnOiB7fSxcbiAgICAgICdNaWNyb3NvZnQnOiB7ICdYYm94JzogMSwgJ1hib3ggT25lJzogMSB9LFxuICAgICAgJ01vdG9yb2xhJzogeyAnWG9vbSc6IDEgfSxcbiAgICAgICdOaW50ZW5kbyc6IHsgJ1dpaSBVJzogMSwgICdXaWknOiAxIH0sXG4gICAgICAnTm9raWEnOiB7ICdMdW1pYSc6IDEgfSxcbiAgICAgICdTYW1zdW5nJzogeyAnR2FsYXh5IFMnOiAxLCAnR2FsYXh5IFMyJzogMSwgJ0dhbGF4eSBTMyc6IDEsICdHYWxheHkgUzQnOiAxIH0sXG4gICAgICAnU29ueSc6IHsgJ1BsYXlTdGF0aW9uJzogMSwgJ1BsYXlTdGF0aW9uIFZpdGEnOiAxIH1cbiAgICB9KTtcblxuICAgIC8qIERldGVjdGFibGUgb3BlcmF0aW5nIHN5c3RlbXMgKG9yZGVyIGlzIGltcG9ydGFudCkuICovXG4gICAgdmFyIG9zID0gZ2V0T1MoW1xuICAgICAgJ1dpbmRvd3MgUGhvbmUnLFxuICAgICAgJ0FuZHJvaWQnLFxuICAgICAgJ0NlbnRPUycsXG4gICAgICB7ICdsYWJlbCc6ICdDaHJvbWUgT1MnLCAncGF0dGVybic6ICdDck9TJyB9LFxuICAgICAgJ0RlYmlhbicsXG4gICAgICAnRmVkb3JhJyxcbiAgICAgICdGcmVlQlNEJyxcbiAgICAgICdHZW50b28nLFxuICAgICAgJ0hhaWt1JyxcbiAgICAgICdLdWJ1bnR1JyxcbiAgICAgICdMaW51eCBNaW50JyxcbiAgICAgICdPcGVuQlNEJyxcbiAgICAgICdSZWQgSGF0JyxcbiAgICAgICdTdVNFJyxcbiAgICAgICdVYnVudHUnLFxuICAgICAgJ1h1YnVudHUnLFxuICAgICAgJ0N5Z3dpbicsXG4gICAgICAnU3ltYmlhbiBPUycsXG4gICAgICAnaHB3T1MnLFxuICAgICAgJ3dlYk9TICcsXG4gICAgICAnd2ViT1MnLFxuICAgICAgJ1RhYmxldCBPUycsXG4gICAgICAnVGl6ZW4nLFxuICAgICAgJ0xpbnV4JyxcbiAgICAgICdNYWMgT1MgWCcsXG4gICAgICAnTWFjaW50b3NoJyxcbiAgICAgICdNYWMnLFxuICAgICAgJ1dpbmRvd3MgOTg7JyxcbiAgICAgICdXaW5kb3dzICdcbiAgICBdKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBsYXlvdXQgZW5naW5lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIGxheW91dCBlbmdpbmUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TGF5b3V0KGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IFJlZ0V4cCgnXFxcXGInICsgKFxuICAgICAgICAgIGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcylcbiAgICAgICAgKSArICdcXFxcYicsICdpJykuZXhlYyh1YSkgJiYgKGd1ZXNzLmxhYmVsIHx8IGd1ZXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBtYW51ZmFjdHVyZXIgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIG9iamVjdCBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIG1hbnVmYWN0dXJlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRNYW51ZmFjdHVyZXIoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICAgICAgLy8gTG9va3VwIHRoZSBtYW51ZmFjdHVyZXIgYnkgcHJvZHVjdCBvciBzY2FuIHRoZSBVQSBmb3IgdGhlIG1hbnVmYWN0dXJlci5cbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCAoXG4gICAgICAgICAgdmFsdWVbcHJvZHVjdF0gfHxcbiAgICAgICAgICB2YWx1ZVsvXlthLXpdKyg/OiArW2Etel0rXFxiKSovaS5leGVjKHByb2R1Y3QpXSB8fFxuICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcXVhbGlmeShrZXkpICsgJyg/OlxcXFxifFxcXFx3KlxcXFxkKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgKSAmJiBrZXk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgYnJvd3NlciBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIGJyb3dzZXIgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXROYW1lKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IFJlZ0V4cCgnXFxcXGInICsgKFxuICAgICAgICAgIGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcylcbiAgICAgICAgKSArICdcXFxcYicsICdpJykuZXhlYyh1YSkgJiYgKGd1ZXNzLmxhYmVsIHx8IGd1ZXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBPUyBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIE9TIG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0T1MoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKTtcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgKHJlc3VsdCA9XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcoPzovW1xcXFxkLl0rfFsgXFxcXHcuXSopJywgJ2knKS5leGVjKHVhKVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgIHJlc3VsdCA9IGNsZWFudXBPUyhyZXN1bHQsIHBhdHRlcm4sIGd1ZXNzLmxhYmVsIHx8IGd1ZXNzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIHByb2R1Y3QgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBwcm9kdWN0IG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0UHJvZHVjdChndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpO1xuICAgICAgICBpZiAoIXJlc3VsdCAmJiAocmVzdWx0ID1cbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyAqXFxcXGQrWy5cXFxcd19dKicsICdpJykuZXhlYyh1YSkgfHxcbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyAqXFxcXHcrLVtcXFxcd10qJywgJ2knKS5leGVjKHVhKSB8fFxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnKD86OyAqKD86W2Etel0rW18tXSk/W2Etel0rXFxcXGQrfFteICgpOy1dKiknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgLy8gU3BsaXQgYnkgZm9yd2FyZCBzbGFzaCBhbmQgYXBwZW5kIHByb2R1Y3QgdmVyc2lvbiBpZiBuZWVkZWQuXG4gICAgICAgICAgaWYgKChyZXN1bHQgPSBTdHJpbmcoKGd1ZXNzLmxhYmVsICYmICFSZWdFeHAocGF0dGVybiwgJ2knKS50ZXN0KGd1ZXNzLmxhYmVsKSkgPyBndWVzcy5sYWJlbCA6IHJlc3VsdCkuc3BsaXQoJy8nKSlbMV0gJiYgIS9bXFxkLl0rLy50ZXN0KHJlc3VsdFswXSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFswXSArPSAnICcgKyByZXN1bHRbMV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENvcnJlY3QgY2hhcmFjdGVyIGNhc2UgYW5kIGNsZWFudXAgc3RyaW5nLlxuICAgICAgICAgIGd1ZXNzID0gZ3Vlc3MubGFiZWwgfHwgZ3Vlc3M7XG4gICAgICAgICAgcmVzdWx0ID0gZm9ybWF0KHJlc3VsdFswXVxuICAgICAgICAgICAgLnJlcGxhY2UoUmVnRXhwKHBhdHRlcm4sICdpJyksIGd1ZXNzKVxuICAgICAgICAgICAgLnJlcGxhY2UoUmVnRXhwKCc7ICooPzonICsgZ3Vlc3MgKyAnW18tXSk/JywgJ2knKSwgJyAnKVxuICAgICAgICAgICAgLnJlcGxhY2UoUmVnRXhwKCcoJyArIGd1ZXNzICsgJylbLV8uXT8oXFxcXHcpJywgJ2knKSwgJyQxICQyJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlcyB0aGUgdmVyc2lvbiB1c2luZyBhbiBhcnJheSBvZiBVQSBwYXR0ZXJucy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGF0dGVybnMgQW4gYXJyYXkgb2YgVUEgcGF0dGVybnMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgdmVyc2lvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRWZXJzaW9uKHBhdHRlcm5zKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKHBhdHRlcm5zLCBmdW5jdGlvbihyZXN1bHQsIHBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCAoUmVnRXhwKHBhdHRlcm4gK1xuICAgICAgICAgICcoPzotW1xcXFxkLl0rL3woPzogZm9yIFtcXFxcdy1dKyk/WyAvLV0pKFtcXFxcZC5dK1teICgpOy9fLV0qKScsICdpJykuZXhlYyh1YSkgfHwgMClbMV0gfHwgbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHBsYXRmb3JtLmRlc2NyaXB0aW9uYCB3aGVuIHRoZSBwbGF0Zm9ybSBvYmplY3QgaXMgY29lcmNlZCB0byBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBuYW1lIHRvU3RyaW5nXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyBgcGxhdGZvcm0uZGVzY3JpcHRpb25gIGlmIGF2YWlsYWJsZSwgZWxzZSBhbiBlbXB0eSBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9TdHJpbmdQbGF0Zm9ybSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uIHx8ICcnO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIENvbnZlcnQgbGF5b3V0IHRvIGFuIGFycmF5IHNvIHdlIGNhbiBhZGQgZXh0cmEgZGV0YWlscy5cbiAgICBsYXlvdXQgJiYgKGxheW91dCA9IFtsYXlvdXRdKTtcblxuICAgIC8vIERldGVjdCBwcm9kdWN0IG5hbWVzIHRoYXQgY29udGFpbiB0aGVpciBtYW51ZmFjdHVyZXIncyBuYW1lLlxuICAgIGlmIChtYW51ZmFjdHVyZXIgJiYgIXByb2R1Y3QpIHtcbiAgICAgIHByb2R1Y3QgPSBnZXRQcm9kdWN0KFttYW51ZmFjdHVyZXJdKTtcbiAgICB9XG4gICAgLy8gQ2xlYW4gdXAgR29vZ2xlIFRWLlxuICAgIGlmICgoZGF0YSA9IC9cXGJHb29nbGUgVFZcXGIvLmV4ZWMocHJvZHVjdCkpKSB7XG4gICAgICBwcm9kdWN0ID0gZGF0YVswXTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IHNpbXVsYXRvcnMuXG4gICAgaWYgKC9cXGJTaW11bGF0b3JcXGIvaS50ZXN0KHVhKSkge1xuICAgICAgcHJvZHVjdCA9IChwcm9kdWN0ID8gcHJvZHVjdCArICcgJyA6ICcnKSArICdTaW11bGF0b3InO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgT3BlcmEgTWluaSA4KyBydW5uaW5nIGluIFR1cmJvL1VuY29tcHJlc3NlZCBtb2RlIG9uIGlPUy5cbiAgICBpZiAobmFtZSA9PSAnT3BlcmEgTWluaScgJiYgL1xcYk9QaU9TXFxiLy50ZXN0KHVhKSkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgncnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZScpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgSUUgTW9iaWxlIDExLlxuICAgIGlmIChuYW1lID09ICdJRScgJiYgL1xcYmxpa2UgaVBob25lIE9TXFxiLy50ZXN0KHVhKSkge1xuICAgICAgZGF0YSA9IHBhcnNlKHVhLnJlcGxhY2UoL2xpa2UgaVBob25lIE9TLywgJycpKTtcbiAgICAgIG1hbnVmYWN0dXJlciA9IGRhdGEubWFudWZhY3R1cmVyO1xuICAgICAgcHJvZHVjdCA9IGRhdGEucHJvZHVjdDtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IGlPUy5cbiAgICBlbHNlIGlmICgvXmlQLy50ZXN0KHByb2R1Y3QpKSB7XG4gICAgICBuYW1lIHx8IChuYW1lID0gJ1NhZmFyaScpO1xuICAgICAgb3MgPSAnaU9TJyArICgoZGF0YSA9IC8gT1MgKFtcXGRfXSspL2kuZXhlYyh1YSkpXG4gICAgICAgID8gJyAnICsgZGF0YVsxXS5yZXBsYWNlKC9fL2csICcuJylcbiAgICAgICAgOiAnJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBLdWJ1bnR1LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0tvbnF1ZXJvcicgJiYgIS9idW50dS9pLnRlc3Qob3MpKSB7XG4gICAgICBvcyA9ICdLdWJ1bnR1JztcbiAgICB9XG4gICAgLy8gRGV0ZWN0IEFuZHJvaWQgYnJvd3NlcnMuXG4gICAgZWxzZSBpZiAoKG1hbnVmYWN0dXJlciAmJiBtYW51ZmFjdHVyZXIgIT0gJ0dvb2dsZScgJiZcbiAgICAgICAgKCgvQ2hyb21lLy50ZXN0KG5hbWUpICYmICEvXFxiTW9iaWxlIFNhZmFyaVxcYi9pLnRlc3QodWEpKSB8fCAvXFxiVml0YVxcYi8udGVzdChwcm9kdWN0KSkpIHx8XG4gICAgICAgICgvXFxiQW5kcm9pZFxcYi8udGVzdChvcykgJiYgL15DaHJvbWUvLnRlc3QobmFtZSkgJiYgL1xcYlZlcnNpb25cXC8vaS50ZXN0KHVhKSkpIHtcbiAgICAgIG5hbWUgPSAnQW5kcm9pZCBCcm93c2VyJztcbiAgICAgIG9zID0gL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpID8gb3MgOiAnQW5kcm9pZCc7XG4gICAgfVxuICAgIC8vIERldGVjdCBTaWxrIGRlc2t0b3AvYWNjZWxlcmF0ZWQgbW9kZXMuXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnU2lsaycpIHtcbiAgICAgIGlmICghL1xcYk1vYmkvaS50ZXN0KHVhKSkge1xuICAgICAgICBvcyA9ICdBbmRyb2lkJztcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICB9XG4gICAgICBpZiAoL0FjY2VsZXJhdGVkICo9ICp0cnVlL2kudGVzdCh1YSkpIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnYWNjZWxlcmF0ZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRGV0ZWN0IFBhbGVNb29uIGlkZW50aWZ5aW5nIGFzIEZpcmVmb3guXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnUGFsZU1vb24nICYmIChkYXRhID0gL1xcYkZpcmVmb3hcXC8oW1xcZC5dKylcXGIvLmV4ZWModWEpKSkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgnaWRlbnRpZnlpbmcgYXMgRmlyZWZveCAnICsgZGF0YVsxXSk7XG4gICAgfVxuICAgIC8vIERldGVjdCBGaXJlZm94IE9TIGFuZCBwcm9kdWN0cyBydW5uaW5nIEZpcmVmb3guXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnRmlyZWZveCcgJiYgKGRhdGEgPSAvXFxiKE1vYmlsZXxUYWJsZXR8VFYpXFxiL2kuZXhlYyh1YSkpKSB7XG4gICAgICBvcyB8fCAob3MgPSAnRmlyZWZveCBPUycpO1xuICAgICAgcHJvZHVjdCB8fCAocHJvZHVjdCA9IGRhdGFbMV0pO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmVzIGZvciBGaXJlZm94L1NhZmFyaS5cbiAgICBlbHNlIGlmICghbmFtZSB8fCAoZGF0YSA9ICEvXFxiTWluZWZpZWxkXFxiL2kudGVzdCh1YSkgJiYgL1xcYig/OkZpcmVmb3h8U2FmYXJpKVxcYi8uZXhlYyhuYW1lKSkpIHtcbiAgICAgIC8vIEVzY2FwZSB0aGUgYC9gIGZvciBGaXJlZm94IDEuXG4gICAgICBpZiAobmFtZSAmJiAhcHJvZHVjdCAmJiAvW1xcLyxdfF5bXihdKz9cXCkvLnRlc3QodWEuc2xpY2UodWEuaW5kZXhPZihkYXRhICsgJy8nKSArIDgpKSkge1xuICAgICAgICAvLyBDbGVhciBuYW1lIG9mIGZhbHNlIHBvc2l0aXZlcy5cbiAgICAgICAgbmFtZSA9IG51bGw7XG4gICAgICB9XG4gICAgICAvLyBSZWFzc2lnbiBhIGdlbmVyaWMgbmFtZS5cbiAgICAgIGlmICgoZGF0YSA9IHByb2R1Y3QgfHwgbWFudWZhY3R1cmVyIHx8IG9zKSAmJlxuICAgICAgICAgIChwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCAvXFxiKD86QW5kcm9pZHxTeW1iaWFuIE9TfFRhYmxldCBPU3x3ZWJPUylcXGIvLnRlc3Qob3MpKSkge1xuICAgICAgICBuYW1lID0gL1thLXpdKyg/OiBIYXQpPy9pLmV4ZWMoL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpID8gb3MgOiBkYXRhKSArICcgQnJvd3Nlcic7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFkZCBDaHJvbWUgdmVyc2lvbiB0byBkZXNjcmlwdGlvbiBmb3IgRWxlY3Ryb24uXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnRWxlY3Ryb24nICYmIChkYXRhID0gKC9cXGJDaHJvbWVcXC8oW1xcZC5dKylcXGIvLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgnQ2hyb21pdW0gJyArIGRhdGEpO1xuICAgIH1cbiAgICAvLyBEZXRlY3Qgbm9uLU9wZXJhIChQcmVzdG8tYmFzZWQpIHZlcnNpb25zIChvcmRlciBpcyBpbXBvcnRhbnQpLlxuICAgIGlmICghdmVyc2lvbikge1xuICAgICAgdmVyc2lvbiA9IGdldFZlcnNpb24oW1xuICAgICAgICAnKD86Q2xvdWQ5fENyaU9TfENyTW98RWRnZXxGeGlPU3xJRU1vYmlsZXxJcm9ufE9wZXJhID9NaW5pfE9QaU9TfE9QUnxSYXZlbnxTYW1zdW5nQnJvd3NlcnxTaWxrKD8hL1tcXFxcZC5dKyQpKScsXG4gICAgICAgICdWZXJzaW9uJyxcbiAgICAgICAgcXVhbGlmeShuYW1lKSxcbiAgICAgICAgJyg/OkZpcmVmb3h8TWluZWZpZWxkfE5ldEZyb250KSdcbiAgICAgIF0pO1xuICAgIH1cbiAgICAvLyBEZXRlY3Qgc3R1YmJvcm4gbGF5b3V0IGVuZ2luZXMuXG4gICAgaWYgKChkYXRhID1cbiAgICAgICAgICBsYXlvdXQgPT0gJ2lDYWInICYmIHBhcnNlRmxvYXQodmVyc2lvbikgPiAzICYmICdXZWJLaXQnIHx8XG4gICAgICAgICAgL1xcYk9wZXJhXFxiLy50ZXN0KG5hbWUpICYmICgvXFxiT1BSXFxiLy50ZXN0KHVhKSA/ICdCbGluaycgOiAnUHJlc3RvJykgfHxcbiAgICAgICAgICAvXFxiKD86TWlkb3JpfE5vb2t8U2FmYXJpKVxcYi9pLnRlc3QodWEpICYmICEvXig/OlRyaWRlbnR8RWRnZUhUTUwpJC8udGVzdChsYXlvdXQpICYmICdXZWJLaXQnIHx8XG4gICAgICAgICAgIWxheW91dCAmJiAvXFxiTVNJRVxcYi9pLnRlc3QodWEpICYmIChvcyA9PSAnTWFjIE9TJyA/ICdUYXNtYW4nIDogJ1RyaWRlbnQnKSB8fFxuICAgICAgICAgIGxheW91dCA9PSAnV2ViS2l0JyAmJiAvXFxiUGxheVN0YXRpb25cXGIoPyEgVml0YVxcYikvaS50ZXN0KG5hbWUpICYmICdOZXRGcm9udCdcbiAgICAgICAgKSkge1xuICAgICAgbGF5b3V0ID0gW2RhdGFdO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgV2luZG93cyBQaG9uZSA3IGRlc2t0b3AgbW9kZS5cbiAgICBpZiAobmFtZSA9PSAnSUUnICYmIChkYXRhID0gKC87ICooPzpYQkxXUHxadW5lV1ApKFxcZCspL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICBuYW1lICs9ICcgTW9iaWxlJztcbiAgICAgIG9zID0gJ1dpbmRvd3MgUGhvbmUgJyArICgvXFwrJC8udGVzdChkYXRhKSA/IGRhdGEgOiBkYXRhICsgJy54Jyk7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFdpbmRvd3MgUGhvbmUgOC54IGRlc2t0b3AgbW9kZS5cbiAgICBlbHNlIGlmICgvXFxiV1BEZXNrdG9wXFxiL2kudGVzdCh1YSkpIHtcbiAgICAgIG5hbWUgPSAnSUUgTW9iaWxlJztcbiAgICAgIG9zID0gJ1dpbmRvd3MgUGhvbmUgOC54JztcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgdmVyc2lvbiB8fCAodmVyc2lvbiA9ICgvXFxicnY6KFtcXGQuXSspLy5leGVjKHVhKSB8fCAwKVsxXSk7XG4gICAgfVxuICAgIC8vIERldGVjdCBJRSAxMSBpZGVudGlmeWluZyBhcyBvdGhlciBicm93c2Vycy5cbiAgICBlbHNlIGlmIChuYW1lICE9ICdJRScgJiYgbGF5b3V0ID09ICdUcmlkZW50JyAmJiAoZGF0YSA9IC9cXGJydjooW1xcZC5dKykvLmV4ZWModWEpKSkge1xuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnaWRlbnRpZnlpbmcgYXMgJyArIG5hbWUgKyAodmVyc2lvbiA/ICcgJyArIHZlcnNpb24gOiAnJykpO1xuICAgICAgfVxuICAgICAgbmFtZSA9ICdJRSc7XG4gICAgICB2ZXJzaW9uID0gZGF0YVsxXTtcbiAgICB9XG4gICAgLy8gTGV2ZXJhZ2UgZW52aXJvbm1lbnQgZmVhdHVyZXMuXG4gICAgaWYgKHVzZUZlYXR1cmVzKSB7XG4gICAgICAvLyBEZXRlY3Qgc2VydmVyLXNpZGUgZW52aXJvbm1lbnRzLlxuICAgICAgLy8gUmhpbm8gaGFzIGEgZ2xvYmFsIGZ1bmN0aW9uIHdoaWxlIG90aGVycyBoYXZlIGEgZ2xvYmFsIG9iamVjdC5cbiAgICAgIGlmIChpc0hvc3RUeXBlKGNvbnRleHQsICdnbG9iYWwnKSkge1xuICAgICAgICBpZiAoamF2YSkge1xuICAgICAgICAgIGRhdGEgPSBqYXZhLmxhbmcuU3lzdGVtO1xuICAgICAgICAgIGFyY2ggPSBkYXRhLmdldFByb3BlcnR5KCdvcy5hcmNoJyk7XG4gICAgICAgICAgb3MgPSBvcyB8fCBkYXRhLmdldFByb3BlcnR5KCdvcy5uYW1lJykgKyAnICcgKyBkYXRhLmdldFByb3BlcnR5KCdvcy52ZXJzaW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTW9kdWxlU2NvcGUgJiYgaXNIb3N0VHlwZShjb250ZXh0LCAnc3lzdGVtJykgJiYgKGRhdGEgPSBbY29udGV4dC5zeXN0ZW1dKVswXSkge1xuICAgICAgICAgIG9zIHx8IChvcyA9IGRhdGFbMF0ub3MgfHwgbnVsbCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGFbMV0gPSBjb250ZXh0LnJlcXVpcmUoJ3JpbmdvL2VuZ2luZScpLnZlcnNpb247XG4gICAgICAgICAgICB2ZXJzaW9uID0gZGF0YVsxXS5qb2luKCcuJyk7XG4gICAgICAgICAgICBuYW1lID0gJ1JpbmdvSlMnO1xuICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgaWYgKGRhdGFbMF0uZ2xvYmFsLnN5c3RlbSA9PSBjb250ZXh0LnN5c3RlbSkge1xuICAgICAgICAgICAgICBuYW1lID0gJ05hcndoYWwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICB0eXBlb2YgY29udGV4dC5wcm9jZXNzID09ICdvYmplY3QnICYmICFjb250ZXh0LnByb2Nlc3MuYnJvd3NlciAmJlxuICAgICAgICAgIChkYXRhID0gY29udGV4dC5wcm9jZXNzKVxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEudmVyc2lvbnMgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS52ZXJzaW9ucy5lbGVjdHJvbiA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdOb2RlICcgKyBkYXRhLnZlcnNpb25zLm5vZGUpO1xuICAgICAgICAgICAgICBuYW1lID0gJ0VsZWN0cm9uJztcbiAgICAgICAgICAgICAgdmVyc2lvbiA9IGRhdGEudmVyc2lvbnMuZWxlY3Ryb247XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhLnZlcnNpb25zLm53ID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ0Nocm9taXVtICcgKyB2ZXJzaW9uLCAnTm9kZSAnICsgZGF0YS52ZXJzaW9ucy5ub2RlKTtcbiAgICAgICAgICAgICAgbmFtZSA9ICdOVy5qcyc7XG4gICAgICAgICAgICAgIHZlcnNpb24gPSBkYXRhLnZlcnNpb25zLm53O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYW1lID0gJ05vZGUuanMnO1xuICAgICAgICAgICAgYXJjaCA9IGRhdGEuYXJjaDtcbiAgICAgICAgICAgIG9zID0gZGF0YS5wbGF0Zm9ybTtcbiAgICAgICAgICAgIHZlcnNpb24gPSAvW1xcZC5dKy8uZXhlYyhkYXRhLnZlcnNpb24pXG4gICAgICAgICAgICB2ZXJzaW9uID0gdmVyc2lvbiA/IHZlcnNpb25bMF0gOiAndW5rbm93bic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJoaW5vKSB7XG4gICAgICAgICAgbmFtZSA9ICdSaGlubyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIERldGVjdCBBZG9iZSBBSVIuXG4gICAgICBlbHNlIGlmIChnZXRDbGFzc09mKChkYXRhID0gY29udGV4dC5ydW50aW1lKSkgPT0gYWlyUnVudGltZUNsYXNzKSB7XG4gICAgICAgIG5hbWUgPSAnQWRvYmUgQUlSJztcbiAgICAgICAgb3MgPSBkYXRhLmZsYXNoLnN5c3RlbS5DYXBhYmlsaXRpZXMub3M7XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgUGhhbnRvbUpTLlxuICAgICAgZWxzZSBpZiAoZ2V0Q2xhc3NPZigoZGF0YSA9IGNvbnRleHQucGhhbnRvbSkpID09IHBoYW50b21DbGFzcykge1xuICAgICAgICBuYW1lID0gJ1BoYW50b21KUyc7XG4gICAgICAgIHZlcnNpb24gPSAoZGF0YSA9IGRhdGEudmVyc2lvbiB8fCBudWxsKSAmJiAoZGF0YS5tYWpvciArICcuJyArIGRhdGEubWlub3IgKyAnLicgKyBkYXRhLnBhdGNoKTtcbiAgICAgIH1cbiAgICAgIC8vIERldGVjdCBJRSBjb21wYXRpYmlsaXR5IG1vZGVzLlxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRvYy5kb2N1bWVudE1vZGUgPT0gJ251bWJlcicgJiYgKGRhdGEgPSAvXFxiVHJpZGVudFxcLyhcXGQrKS9pLmV4ZWModWEpKSkge1xuICAgICAgICAvLyBXZSdyZSBpbiBjb21wYXRpYmlsaXR5IG1vZGUgd2hlbiB0aGUgVHJpZGVudCB2ZXJzaW9uICsgNCBkb2Vzbid0XG4gICAgICAgIC8vIGVxdWFsIHRoZSBkb2N1bWVudCBtb2RlLlxuICAgICAgICB2ZXJzaW9uID0gW3ZlcnNpb24sIGRvYy5kb2N1bWVudE1vZGVdO1xuICAgICAgICBpZiAoKGRhdGEgPSArZGF0YVsxXSArIDQpICE9IHZlcnNpb25bMV0pIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdJRSAnICsgdmVyc2lvblsxXSArICcgbW9kZScpO1xuICAgICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJycpO1xuICAgICAgICAgIHZlcnNpb25bMV0gPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHZlcnNpb24gPSBuYW1lID09ICdJRScgPyBTdHJpbmcodmVyc2lvblsxXS50b0ZpeGVkKDEpKSA6IHZlcnNpb25bMF07XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgSUUgMTEgbWFza2luZyBhcyBvdGhlciBicm93c2Vycy5cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkb2MuZG9jdW1lbnRNb2RlID09ICdudW1iZXInICYmIC9eKD86Q2hyb21lfEZpcmVmb3gpXFxiLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ21hc2tpbmcgYXMgJyArIG5hbWUgKyAnICcgKyB2ZXJzaW9uKTtcbiAgICAgICAgbmFtZSA9ICdJRSc7XG4gICAgICAgIHZlcnNpb24gPSAnMTEuMCc7XG4gICAgICAgIGxheW91dCA9IFsnVHJpZGVudCddO1xuICAgICAgICBvcyA9ICdXaW5kb3dzJztcbiAgICAgIH1cbiAgICAgIG9zID0gb3MgJiYgZm9ybWF0KG9zKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IHByZXJlbGVhc2UgcGhhc2VzLlxuICAgIGlmICh2ZXJzaW9uICYmIChkYXRhID1cbiAgICAgICAgICAvKD86W2FiXXxkcHxwcmV8W2FiXVxcZCtwcmUpKD86XFxkK1xcKz8pPyQvaS5leGVjKHZlcnNpb24pIHx8XG4gICAgICAgICAgLyg/OmFscGhhfGJldGEpKD86ID9cXGQpPy9pLmV4ZWModWEgKyAnOycgKyAodXNlRmVhdHVyZXMgJiYgbmF2LmFwcE1pbm9yVmVyc2lvbikpIHx8XG4gICAgICAgICAgL1xcYk1pbmVmaWVsZFxcYi9pLnRlc3QodWEpICYmICdhJ1xuICAgICAgICApKSB7XG4gICAgICBwcmVyZWxlYXNlID0gL2IvaS50ZXN0KGRhdGEpID8gJ2JldGEnIDogJ2FscGhhJztcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoUmVnRXhwKGRhdGEgKyAnXFxcXCs/JCcpLCAnJykgK1xuICAgICAgICAocHJlcmVsZWFzZSA9PSAnYmV0YScgPyBiZXRhIDogYWxwaGEpICsgKC9cXGQrXFwrPy8uZXhlYyhkYXRhKSB8fCAnJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBGaXJlZm94IE1vYmlsZS5cbiAgICBpZiAobmFtZSA9PSAnRmVubmVjJyB8fCBuYW1lID09ICdGaXJlZm94JyAmJiAvXFxiKD86QW5kcm9pZHxGaXJlZm94IE9TKVxcYi8udGVzdChvcykpIHtcbiAgICAgIG5hbWUgPSAnRmlyZWZveCBNb2JpbGUnO1xuICAgIH1cbiAgICAvLyBPYnNjdXJlIE1heHRob24ncyB1bnJlbGlhYmxlIHZlcnNpb24uXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnTWF4dGhvbicgJiYgdmVyc2lvbikge1xuICAgICAgdmVyc2lvbiA9IHZlcnNpb24ucmVwbGFjZSgvXFwuW1xcZC5dKy8sICcueCcpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgWGJveCAzNjAgYW5kIFhib3ggT25lLlxuICAgIGVsc2UgaWYgKC9cXGJYYm94XFxiL2kudGVzdChwcm9kdWN0KSkge1xuICAgICAgaWYgKHByb2R1Y3QgPT0gJ1hib3ggMzYwJykge1xuICAgICAgICBvcyA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAocHJvZHVjdCA9PSAnWGJveCAzNjAnICYmIC9cXGJJRU1vYmlsZVxcYi8udGVzdCh1YSkpIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnbW9iaWxlIG1vZGUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQWRkIG1vYmlsZSBwb3N0Zml4LlxuICAgIGVsc2UgaWYgKCgvXig/OkNocm9tZXxJRXxPcGVyYSkkLy50ZXN0KG5hbWUpIHx8IG5hbWUgJiYgIXByb2R1Y3QgJiYgIS9Ccm93c2VyfE1vYmkvLnRlc3QobmFtZSkpICYmXG4gICAgICAgIChvcyA9PSAnV2luZG93cyBDRScgfHwgL01vYmkvaS50ZXN0KHVhKSkpIHtcbiAgICAgIG5hbWUgKz0gJyBNb2JpbGUnO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgSUUgcGxhdGZvcm0gcHJldmlldy5cbiAgICBlbHNlIGlmIChuYW1lID09ICdJRScgJiYgdXNlRmVhdHVyZXMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChjb250ZXh0LmV4dGVybmFsID09PSBudWxsKSB7XG4gICAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgncGxhdGZvcm0gcHJldmlldycpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZW1iZWRkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRGV0ZWN0IEJsYWNrQmVycnkgT1MgdmVyc2lvbi5cbiAgICAvLyBodHRwOi8vZG9jcy5ibGFja2JlcnJ5LmNvbS9lbi9kZXZlbG9wZXJzL2RlbGl2ZXJhYmxlcy8xODE2OS9IVFRQX2hlYWRlcnNfc2VudF9ieV9CQl9Ccm93c2VyXzEyMzQ5MTFfMTEuanNwXG4gICAgZWxzZSBpZiAoKC9cXGJCbGFja0JlcnJ5XFxiLy50ZXN0KHByb2R1Y3QpIHx8IC9cXGJCQjEwXFxiLy50ZXN0KHVhKSkgJiYgKGRhdGEgPVxuICAgICAgICAgIChSZWdFeHAocHJvZHVjdC5yZXBsYWNlKC8gKy9nLCAnIConKSArICcvKFsuXFxcXGRdKyknLCAnaScpLmV4ZWModWEpIHx8IDApWzFdIHx8XG4gICAgICAgICAgdmVyc2lvblxuICAgICAgICApKSB7XG4gICAgICBkYXRhID0gW2RhdGEsIC9CQjEwLy50ZXN0KHVhKV07XG4gICAgICBvcyA9IChkYXRhWzFdID8gKHByb2R1Y3QgPSBudWxsLCBtYW51ZmFjdHVyZXIgPSAnQmxhY2tCZXJyeScpIDogJ0RldmljZSBTb2Z0d2FyZScpICsgJyAnICsgZGF0YVswXTtcbiAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgT3BlcmEgaWRlbnRpZnlpbmcvbWFza2luZyBpdHNlbGYgYXMgYW5vdGhlciBicm93c2VyLlxuICAgIC8vIGh0dHA6Ly93d3cub3BlcmEuY29tL3N1cHBvcnQva2Ivdmlldy84NDMvXG4gICAgZWxzZSBpZiAodGhpcyAhPSBmb3JPd24gJiYgcHJvZHVjdCAhPSAnV2lpJyAmJiAoXG4gICAgICAgICAgKHVzZUZlYXR1cmVzICYmIG9wZXJhKSB8fFxuICAgICAgICAgICgvT3BlcmEvLnRlc3QobmFtZSkgJiYgL1xcYig/Ok1TSUV8RmlyZWZveClcXGIvaS50ZXN0KHVhKSkgfHxcbiAgICAgICAgICAobmFtZSA9PSAnRmlyZWZveCcgJiYgL1xcYk9TIFggKD86XFxkK1xcLil7Mix9Ly50ZXN0KG9zKSkgfHxcbiAgICAgICAgICAobmFtZSA9PSAnSUUnICYmIChcbiAgICAgICAgICAgIChvcyAmJiAhL15XaW4vLnRlc3Qob3MpICYmIHZlcnNpb24gPiA1LjUpIHx8XG4gICAgICAgICAgICAvXFxiV2luZG93cyBYUFxcYi8udGVzdChvcykgJiYgdmVyc2lvbiA+IDggfHxcbiAgICAgICAgICAgIHZlcnNpb24gPT0gOCAmJiAhL1xcYlRyaWRlbnRcXGIvLnRlc3QodWEpXG4gICAgICAgICAgKSlcbiAgICAgICAgKSAmJiAhcmVPcGVyYS50ZXN0KChkYXRhID0gcGFyc2UuY2FsbChmb3JPd24sIHVhLnJlcGxhY2UocmVPcGVyYSwgJycpICsgJzsnKSkpICYmIGRhdGEubmFtZSkge1xuICAgICAgLy8gV2hlbiBcImlkZW50aWZ5aW5nXCIsIHRoZSBVQSBjb250YWlucyBib3RoIE9wZXJhIGFuZCB0aGUgb3RoZXIgYnJvd3NlcidzIG5hbWUuXG4gICAgICBkYXRhID0gJ2luZyBhcyAnICsgZGF0YS5uYW1lICsgKChkYXRhID0gZGF0YS52ZXJzaW9uKSA/ICcgJyArIGRhdGEgOiAnJyk7XG4gICAgICBpZiAocmVPcGVyYS50ZXN0KG5hbWUpKSB7XG4gICAgICAgIGlmICgvXFxiSUVcXGIvLnRlc3QoZGF0YSkgJiYgb3MgPT0gJ01hYyBPUycpIHtcbiAgICAgICAgICBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YSA9ICdpZGVudGlmeScgKyBkYXRhO1xuICAgICAgfVxuICAgICAgLy8gV2hlbiBcIm1hc2tpbmdcIiwgdGhlIFVBIGNvbnRhaW5zIG9ubHkgdGhlIG90aGVyIGJyb3dzZXIncyBuYW1lLlxuICAgICAgZWxzZSB7XG4gICAgICAgIGRhdGEgPSAnbWFzaycgKyBkYXRhO1xuICAgICAgICBpZiAob3BlcmFDbGFzcykge1xuICAgICAgICAgIG5hbWUgPSBmb3JtYXQob3BlcmFDbGFzcy5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmFtZSA9ICdPcGVyYSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9cXGJJRVxcYi8udGVzdChkYXRhKSkge1xuICAgICAgICAgIG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXVzZUZlYXR1cmVzKSB7XG4gICAgICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxheW91dCA9IFsnUHJlc3RvJ107XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKGRhdGEpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgV2ViS2l0IE5pZ2h0bHkgYW5kIGFwcHJveGltYXRlIENocm9tZS9TYWZhcmkgdmVyc2lvbnMuXG4gICAgaWYgKChkYXRhID0gKC9cXGJBcHBsZVdlYktpdFxcLyhbXFxkLl0rXFwrPykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIC8vIENvcnJlY3QgYnVpbGQgbnVtYmVyIGZvciBudW1lcmljIGNvbXBhcmlzb24uXG4gICAgICAvLyAoZS5nLiBcIjUzMi41XCIgYmVjb21lcyBcIjUzMi4wNVwiKVxuICAgICAgZGF0YSA9IFtwYXJzZUZsb2F0KGRhdGEucmVwbGFjZSgvXFwuKFxcZCkkLywgJy4wJDEnKSksIGRhdGFdO1xuICAgICAgLy8gTmlnaHRseSBidWlsZHMgYXJlIHBvc3RmaXhlZCB3aXRoIGEgXCIrXCIuXG4gICAgICBpZiAobmFtZSA9PSAnU2FmYXJpJyAmJiBkYXRhWzFdLnNsaWNlKC0xKSA9PSAnKycpIHtcbiAgICAgICAgbmFtZSA9ICdXZWJLaXQgTmlnaHRseSc7XG4gICAgICAgIHByZXJlbGVhc2UgPSAnYWxwaGEnO1xuICAgICAgICB2ZXJzaW9uID0gZGF0YVsxXS5zbGljZSgwLCAtMSk7XG4gICAgICB9XG4gICAgICAvLyBDbGVhciBpbmNvcnJlY3QgYnJvd3NlciB2ZXJzaW9ucy5cbiAgICAgIGVsc2UgaWYgKHZlcnNpb24gPT0gZGF0YVsxXSB8fFxuICAgICAgICAgIHZlcnNpb24gPT0gKGRhdGFbMl0gPSAoL1xcYlNhZmFyaVxcLyhbXFxkLl0rXFwrPykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgICB9XG4gICAgICAvLyBVc2UgdGhlIGZ1bGwgQ2hyb21lIHZlcnNpb24gd2hlbiBhdmFpbGFibGUuXG4gICAgICBkYXRhWzFdID0gKC9cXGJDaHJvbWVcXC8oW1xcZC5dKykvaS5leGVjKHVhKSB8fCAwKVsxXTtcbiAgICAgIC8vIERldGVjdCBCbGluayBsYXlvdXQgZW5naW5lLlxuICAgICAgaWYgKGRhdGFbMF0gPT0gNTM3LjM2ICYmIGRhdGFbMl0gPT0gNTM3LjM2ICYmIHBhcnNlRmxvYXQoZGF0YVsxXSkgPj0gMjggJiYgbGF5b3V0ID09ICdXZWJLaXQnKSB7XG4gICAgICAgIGxheW91dCA9IFsnQmxpbmsnXTtcbiAgICAgIH1cbiAgICAgIC8vIERldGVjdCBKYXZhU2NyaXB0Q29yZS5cbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjc2ODQ3NC9ob3ctY2FuLWktZGV0ZWN0LXdoaWNoLWphdmFzY3JpcHQtZW5naW5lLXY4LW9yLWpzYy1pcy11c2VkLWF0LXJ1bnRpbWUtaW4tYW5kcm9pXG4gICAgICBpZiAoIXVzZUZlYXR1cmVzIHx8ICghbGlrZUNocm9tZSAmJiAhZGF0YVsxXSkpIHtcbiAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnbGlrZSBTYWZhcmknKTtcbiAgICAgICAgZGF0YSA9IChkYXRhID0gZGF0YVswXSwgZGF0YSA8IDQwMCA/IDEgOiBkYXRhIDwgNTAwID8gMiA6IGRhdGEgPCA1MjYgPyAzIDogZGF0YSA8IDUzMyA/IDQgOiBkYXRhIDwgNTM0ID8gJzQrJyA6IGRhdGEgPCA1MzUgPyA1IDogZGF0YSA8IDUzNyA/IDYgOiBkYXRhIDwgNTM4ID8gNyA6IGRhdGEgPCA2MDEgPyA4IDogJzgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJ2xpa2UgQ2hyb21lJyk7XG4gICAgICAgIGRhdGEgPSBkYXRhWzFdIHx8IChkYXRhID0gZGF0YVswXSwgZGF0YSA8IDUzMCA/IDEgOiBkYXRhIDwgNTMyID8gMiA6IGRhdGEgPCA1MzIuMDUgPyAzIDogZGF0YSA8IDUzMyA/IDQgOiBkYXRhIDwgNTM0LjAzID8gNSA6IGRhdGEgPCA1MzQuMDcgPyA2IDogZGF0YSA8IDUzNC4xMCA/IDcgOiBkYXRhIDwgNTM0LjEzID8gOCA6IGRhdGEgPCA1MzQuMTYgPyA5IDogZGF0YSA8IDUzNC4yNCA/IDEwIDogZGF0YSA8IDUzNC4zMCA/IDExIDogZGF0YSA8IDUzNS4wMSA/IDEyIDogZGF0YSA8IDUzNS4wMiA/ICcxMysnIDogZGF0YSA8IDUzNS4wNyA/IDE1IDogZGF0YSA8IDUzNS4xMSA/IDE2IDogZGF0YSA8IDUzNS4xOSA/IDE3IDogZGF0YSA8IDUzNi4wNSA/IDE4IDogZGF0YSA8IDUzNi4xMCA/IDE5IDogZGF0YSA8IDUzNy4wMSA/IDIwIDogZGF0YSA8IDUzNy4xMSA/ICcyMSsnIDogZGF0YSA8IDUzNy4xMyA/IDIzIDogZGF0YSA8IDUzNy4xOCA/IDI0IDogZGF0YSA8IDUzNy4yNCA/IDI1IDogZGF0YSA8IDUzNy4zNiA/IDI2IDogbGF5b3V0ICE9ICdCbGluaycgPyAnMjcnIDogJzI4Jyk7XG4gICAgICB9XG4gICAgICAvLyBBZGQgdGhlIHBvc3RmaXggb2YgXCIueFwiIG9yIFwiK1wiIGZvciBhcHByb3hpbWF0ZSB2ZXJzaW9ucy5cbiAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdICs9ICcgJyArIChkYXRhICs9IHR5cGVvZiBkYXRhID09ICdudW1iZXInID8gJy54JyA6IC9bLitdLy50ZXN0KGRhdGEpID8gJycgOiAnKycpKTtcbiAgICAgIC8vIE9ic2N1cmUgdmVyc2lvbiBmb3Igc29tZSBTYWZhcmkgMS0yIHJlbGVhc2VzLlxuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgKCF2ZXJzaW9uIHx8IHBhcnNlSW50KHZlcnNpb24pID4gNDUpKSB7XG4gICAgICAgIHZlcnNpb24gPSBkYXRhO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBEZXRlY3QgT3BlcmEgZGVza3RvcCBtb2Rlcy5cbiAgICBpZiAobmFtZSA9PSAnT3BlcmEnICYmICAoZGF0YSA9IC9cXGJ6Ym92fHp2YXYkLy5leGVjKG9zKSkpIHtcbiAgICAgIG5hbWUgKz0gJyAnO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICBpZiAoZGF0YSA9PSAnenZhdicpIHtcbiAgICAgICAgbmFtZSArPSAnTWluaSc7XG4gICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmFtZSArPSAnTW9iaWxlJztcbiAgICAgIH1cbiAgICAgIG9zID0gb3MucmVwbGFjZShSZWdFeHAoJyAqJyArIGRhdGEgKyAnJCcpLCAnJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBDaHJvbWUgZGVza3RvcCBtb2RlLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgL1xcYkNocm9tZVxcYi8uZXhlYyhsYXlvdXQgJiYgbGF5b3V0WzFdKSkge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICBuYW1lID0gJ0Nocm9tZSBNb2JpbGUnO1xuICAgICAgdmVyc2lvbiA9IG51bGw7XG5cbiAgICAgIGlmICgvXFxiT1MgWFxcYi8udGVzdChvcykpIHtcbiAgICAgICAgbWFudWZhY3R1cmVyID0gJ0FwcGxlJztcbiAgICAgICAgb3MgPSAnaU9TIDQuMysnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBTdHJpcCBpbmNvcnJlY3QgT1MgdmVyc2lvbnMuXG4gICAgaWYgKHZlcnNpb24gJiYgdmVyc2lvbi5pbmRleE9mKChkYXRhID0gL1tcXGQuXSskLy5leGVjKG9zKSkpID09IDAgJiZcbiAgICAgICAgdWEuaW5kZXhPZignLycgKyBkYXRhICsgJy0nKSA+IC0xKSB7XG4gICAgICBvcyA9IHRyaW0ob3MucmVwbGFjZShkYXRhLCAnJykpO1xuICAgIH1cbiAgICAvLyBBZGQgbGF5b3V0IGVuZ2luZS5cbiAgICBpZiAobGF5b3V0ICYmICEvXFxiKD86QXZhbnR8Tm9vaylcXGIvLnRlc3QobmFtZSkgJiYgKFxuICAgICAgICAvQnJvd3NlcnxMdW5hc2NhcGV8TWF4dGhvbi8udGVzdChuYW1lKSB8fFxuICAgICAgICBuYW1lICE9ICdTYWZhcmknICYmIC9eaU9TLy50ZXN0KG9zKSAmJiAvXFxiU2FmYXJpXFxiLy50ZXN0KGxheW91dFsxXSkgfHxcbiAgICAgICAgL14oPzpBZG9iZXxBcm9yYXxCcmVhY2h8TWlkb3JpfE9wZXJhfFBoYW50b218UmVrb25xfFJvY2t8U2Ftc3VuZyBJbnRlcm5ldHxTbGVpcG5pcnxXZWIpLy50ZXN0KG5hbWUpICYmIGxheW91dFsxXSkpIHtcbiAgICAgIC8vIERvbid0IGFkZCBsYXlvdXQgZGV0YWlscyB0byBkZXNjcmlwdGlvbiBpZiB0aGV5IGFyZSBmYWxzZXkuXG4gICAgICAoZGF0YSA9IGxheW91dFtsYXlvdXQubGVuZ3RoIC0gMV0pICYmIGRlc2NyaXB0aW9uLnB1c2goZGF0YSk7XG4gICAgfVxuICAgIC8vIENvbWJpbmUgY29udGV4dHVhbCBpbmZvcm1hdGlvbi5cbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IFsnKCcgKyBkZXNjcmlwdGlvbi5qb2luKCc7ICcpICsgJyknXTtcbiAgICB9XG4gICAgLy8gQXBwZW5kIG1hbnVmYWN0dXJlciB0byBkZXNjcmlwdGlvbi5cbiAgICBpZiAobWFudWZhY3R1cmVyICYmIHByb2R1Y3QgJiYgcHJvZHVjdC5pbmRleE9mKG1hbnVmYWN0dXJlcikgPCAwKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCdvbiAnICsgbWFudWZhY3R1cmVyKTtcbiAgICB9XG4gICAgLy8gQXBwZW5kIHByb2R1Y3QgdG8gZGVzY3JpcHRpb24uXG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goKC9eb24gLy50ZXN0KGRlc2NyaXB0aW9uW2Rlc2NyaXB0aW9uLmxlbmd0aCAtIDFdKSA/ICcnIDogJ29uICcpICsgcHJvZHVjdCk7XG4gICAgfVxuICAgIC8vIFBhcnNlIHRoZSBPUyBpbnRvIGFuIG9iamVjdC5cbiAgICBpZiAob3MpIHtcbiAgICAgIGRhdGEgPSAvIChbXFxkLitdKykkLy5leGVjKG9zKTtcbiAgICAgIGlzU3BlY2lhbENhc2VkT1MgPSBkYXRhICYmIG9zLmNoYXJBdChvcy5sZW5ndGggLSBkYXRhWzBdLmxlbmd0aCAtIDEpID09ICcvJztcbiAgICAgIG9zID0ge1xuICAgICAgICAnYXJjaGl0ZWN0dXJlJzogMzIsXG4gICAgICAgICdmYW1pbHknOiAoZGF0YSAmJiAhaXNTcGVjaWFsQ2FzZWRPUykgPyBvcy5yZXBsYWNlKGRhdGFbMF0sICcnKSA6IG9zLFxuICAgICAgICAndmVyc2lvbic6IGRhdGEgPyBkYXRhWzFdIDogbnVsbCxcbiAgICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZlcnNpb24gPSB0aGlzLnZlcnNpb247XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmFtaWx5ICsgKCh2ZXJzaW9uICYmICFpc1NwZWNpYWxDYXNlZE9TKSA/ICcgJyArIHZlcnNpb24gOiAnJykgKyAodGhpcy5hcmNoaXRlY3R1cmUgPT0gNjQgPyAnIDY0LWJpdCcgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIC8vIEFkZCBicm93c2VyL09TIGFyY2hpdGVjdHVyZS5cbiAgICBpZiAoKGRhdGEgPSAvXFxiKD86QU1EfElBfFdpbnxXT1d8eDg2X3x4KTY0XFxiL2kuZXhlYyhhcmNoKSkgJiYgIS9cXGJpNjg2XFxiL2kudGVzdChhcmNoKSkge1xuICAgICAgaWYgKG9zKSB7XG4gICAgICAgIG9zLmFyY2hpdGVjdHVyZSA9IDY0O1xuICAgICAgICBvcy5mYW1pbHkgPSBvcy5mYW1pbHkucmVwbGFjZShSZWdFeHAoJyAqJyArIGRhdGEpLCAnJyk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgICAgbmFtZSAmJiAoL1xcYldPVzY0XFxiL2kudGVzdCh1YSkgfHxcbiAgICAgICAgICAodXNlRmVhdHVyZXMgJiYgL1xcdyg/Ojg2fDMyKSQvLnRlc3QobmF2LmNwdUNsYXNzIHx8IG5hdi5wbGF0Zm9ybSkgJiYgIS9cXGJXaW42NDsgeDY0XFxiL2kudGVzdCh1YSkpKVxuICAgICAgKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJzMyLWJpdCcpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBDaHJvbWUgMzkgYW5kIGFib3ZlIG9uIE9TIFggaXMgYWx3YXlzIDY0LWJpdC5cbiAgICBlbHNlIGlmIChcbiAgICAgICAgb3MgJiYgL15PUyBYLy50ZXN0KG9zLmZhbWlseSkgJiZcbiAgICAgICAgbmFtZSA9PSAnQ2hyb21lJyAmJiBwYXJzZUZsb2F0KHZlcnNpb24pID49IDM5XG4gICAgKSB7XG4gICAgICBvcy5hcmNoaXRlY3R1cmUgPSA2NDtcbiAgICB9XG5cbiAgICB1YSB8fCAodWEgPSBudWxsKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF0Zm9ybSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHZhciBwbGF0Zm9ybSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXRmb3JtIGRlc2NyaXB0aW9uLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5kZXNjcmlwdGlvbiA9IHVhO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGJyb3dzZXIncyBsYXlvdXQgZW5naW5lLlxuICAgICAqXG4gICAgICogVGhlIGxpc3Qgb2YgY29tbW9uIGxheW91dCBlbmdpbmVzIGluY2x1ZGU6XG4gICAgICogXCJCbGlua1wiLCBcIkVkZ2VIVE1MXCIsIFwiR2Vja29cIiwgXCJUcmlkZW50XCIgYW5kIFwiV2ViS2l0XCJcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubGF5b3V0ID0gbGF5b3V0ICYmIGxheW91dFswXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9kdWN0J3MgbWFudWZhY3R1cmVyLlxuICAgICAqXG4gICAgICogVGhlIGxpc3Qgb2YgbWFudWZhY3R1cmVycyBpbmNsdWRlOlxuICAgICAqIFwiQXBwbGVcIiwgXCJBcmNob3NcIiwgXCJBbWF6b25cIiwgXCJBc3VzXCIsIFwiQmFybmVzICYgTm9ibGVcIiwgXCJCbGFja0JlcnJ5XCIsXG4gICAgICogXCJHb29nbGVcIiwgXCJIUFwiLCBcIkhUQ1wiLCBcIkxHXCIsIFwiTWljcm9zb2Z0XCIsIFwiTW90b3JvbGFcIiwgXCJOaW50ZW5kb1wiLFxuICAgICAqIFwiTm9raWFcIiwgXCJTYW1zdW5nXCIgYW5kIFwiU29ueVwiXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLm1hbnVmYWN0dXJlciA9IG1hbnVmYWN0dXJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBicm93c2VyL2Vudmlyb25tZW50LlxuICAgICAqXG4gICAgICogVGhlIGxpc3Qgb2YgY29tbW9uIGJyb3dzZXIgbmFtZXMgaW5jbHVkZTpcbiAgICAgKiBcIkNocm9tZVwiLCBcIkVsZWN0cm9uXCIsIFwiRmlyZWZveFwiLCBcIkZpcmVmb3ggZm9yIGlPU1wiLCBcIklFXCIsXG4gICAgICogXCJNaWNyb3NvZnQgRWRnZVwiLCBcIlBoYW50b21KU1wiLCBcIlNhZmFyaVwiLCBcIlNlYU1vbmtleVwiLCBcIlNpbGtcIixcbiAgICAgKiBcIk9wZXJhIE1pbmlcIiBhbmQgXCJPcGVyYVwiXG4gICAgICpcbiAgICAgKiBNb2JpbGUgdmVyc2lvbnMgb2Ygc29tZSBicm93c2VycyBoYXZlIFwiTW9iaWxlXCIgYXBwZW5kZWQgdG8gdGhlaXIgbmFtZTpcbiAgICAgKiBlZy4gXCJDaHJvbWUgTW9iaWxlXCIsIFwiRmlyZWZveCBNb2JpbGVcIiwgXCJJRSBNb2JpbGVcIiBhbmQgXCJPcGVyYSBNb2JpbGVcIlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5uYW1lID0gbmFtZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbHBoYS9iZXRhIHJlbGVhc2UgaW5kaWNhdG9yLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5wcmVyZWxlYXNlID0gcHJlcmVsZWFzZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9kdWN0IGhvc3RpbmcgdGhlIGJyb3dzZXIuXG4gICAgICpcbiAgICAgKiBUaGUgbGlzdCBvZiBjb21tb24gcHJvZHVjdHMgaW5jbHVkZTpcbiAgICAgKlxuICAgICAqIFwiQmxhY2tCZXJyeVwiLCBcIkdhbGF4eSBTNFwiLCBcIkx1bWlhXCIsIFwiaVBhZFwiLCBcImlQb2RcIiwgXCJpUGhvbmVcIiwgXCJLaW5kbGVcIixcbiAgICAgKiBcIktpbmRsZSBGaXJlXCIsIFwiTmV4dXNcIiwgXCJOb29rXCIsIFwiUGxheUJvb2tcIiwgXCJUb3VjaFBhZFwiIGFuZCBcIlRyYW5zZm9ybWVyXCJcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ucHJvZHVjdCA9IHByb2R1Y3Q7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYnJvd3NlcidzIHVzZXIgYWdlbnQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS51YSA9IHVhO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGJyb3dzZXIvZW52aXJvbm1lbnQgdmVyc2lvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0udmVyc2lvbiA9IG5hbWUgJiYgdmVyc2lvbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBvcGVyYXRpbmcgc3lzdGVtLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgcGxhdGZvcm0ub3MgPSBvcyB8fCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIENQVSBhcmNoaXRlY3R1cmUgdGhlIE9TIGlzIGJ1aWx0IGZvci5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIG51bWJlcnxudWxsXG4gICAgICAgKi9cbiAgICAgICdhcmNoaXRlY3R1cmUnOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBmYW1pbHkgb2YgdGhlIE9TLlxuICAgICAgICpcbiAgICAgICAqIENvbW1vbiB2YWx1ZXMgaW5jbHVkZTpcbiAgICAgICAqIFwiV2luZG93c1wiLCBcIldpbmRvd3MgU2VydmVyIDIwMDggUjIgLyA3XCIsIFwiV2luZG93cyBTZXJ2ZXIgMjAwOCAvIFZpc3RhXCIsXG4gICAgICAgKiBcIldpbmRvd3MgWFBcIiwgXCJPUyBYXCIsIFwiVWJ1bnR1XCIsIFwiRGViaWFuXCIsIFwiRmVkb3JhXCIsIFwiUmVkIEhhdFwiLCBcIlN1U0VcIixcbiAgICAgICAqIFwiQW5kcm9pZFwiLCBcImlPU1wiIGFuZCBcIldpbmRvd3MgUGhvbmVcIlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgICAqL1xuICAgICAgJ2ZhbWlseSc6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIHZlcnNpb24gb2YgdGhlIE9TLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgICAqL1xuICAgICAgJ3ZlcnNpb24nOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdGhlIE9TIHN0cmluZy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBPUyBzdHJpbmcuXG4gICAgICAgKi9cbiAgICAgICd0b1N0cmluZyc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ251bGwnOyB9XG4gICAgfTtcblxuICAgIHBsYXRmb3JtLnBhcnNlID0gcGFyc2U7XG4gICAgcGxhdGZvcm0udG9TdHJpbmcgPSB0b1N0cmluZ1BsYXRmb3JtO1xuXG4gICAgaWYgKHBsYXRmb3JtLnZlcnNpb24pIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQodmVyc2lvbik7XG4gICAgfVxuICAgIGlmIChwbGF0Zm9ybS5uYW1lKSB7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KG5hbWUpO1xuICAgIH1cbiAgICBpZiAob3MgJiYgbmFtZSAmJiAhKG9zID09IFN0cmluZyhvcykuc3BsaXQoJyAnKVswXSAmJiAob3MgPT0gbmFtZS5zcGxpdCgnICcpWzBdIHx8IHByb2R1Y3QpKSkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaChwcm9kdWN0ID8gJygnICsgb3MgKyAnKScgOiAnb24gJyArIG9zKTtcbiAgICB9XG4gICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aCkge1xuICAgICAgcGxhdGZvcm0uZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbi5qb2luKCcgJyk7XG4gICAgfVxuICAgIHJldHVybiBwbGF0Zm9ybTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIEV4cG9ydCBwbGF0Zm9ybS5cbiAgdmFyIHBsYXRmb3JtID0gcGFyc2UoKTtcblxuICAvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBjb25kaXRpb24gcGF0dGVybnMgbGlrZSB0aGUgZm9sbG93aW5nOlxuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBFeHBvc2UgcGxhdGZvcm0gb24gdGhlIGdsb2JhbCBvYmplY3QgdG8gcHJldmVudCBlcnJvcnMgd2hlbiBwbGF0Zm9ybSBpc1xuICAgIC8vIGxvYWRlZCBieSBhIHNjcmlwdCB0YWcgaW4gdGhlIHByZXNlbmNlIG9mIGFuIEFNRCBsb2FkZXIuXG4gICAgLy8gU2VlIGh0dHA6Ly9yZXF1aXJlanMub3JnL2RvY3MvZXJyb3JzLmh0bWwjbWlzbWF0Y2ggZm9yIG1vcmUgZGV0YWlscy5cbiAgICByb290LnBsYXRmb3JtID0gcGxhdGZvcm07XG5cbiAgICAvLyBEZWZpbmUgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSBzbyBwbGF0Zm9ybSBjYW4gYmUgYWxpYXNlZCB0aHJvdWdoIHBhdGggbWFwcGluZy5cbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGxhdGZvcm07XG4gICAgfSk7XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGBleHBvcnRzYCBhZnRlciBgZGVmaW5lYCBpbiBjYXNlIGEgYnVpbGQgb3B0aW1pemVyIGFkZHMgYW4gYGV4cG9ydHNgIG9iamVjdC5cbiAgZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSkge1xuICAgIC8vIEV4cG9ydCBmb3IgQ29tbW9uSlMgc3VwcG9ydC5cbiAgICBmb3JPd24ocGxhdGZvcm0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgIGZyZWVFeHBvcnRzW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBFeHBvcnQgdG8gdGhlIGdsb2JhbCBvYmplY3QuXG4gICAgcm9vdC5wbGF0Zm9ybSA9IHBsYXRmb3JtO1xuICB9XG59LmNhbGwodGhpcykpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cbnZhciBfRE9NRXZlbnRTdWJtb2R1bGUgPSByZXF1aXJlKCcuL0RPTUV2ZW50U3VibW9kdWxlJyk7XG5cbnZhciBfRE9NRXZlbnRTdWJtb2R1bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRE9NRXZlbnRTdWJtb2R1bGUpO1xuXG52YXIgX0lucHV0TW9kdWxlMiA9IHJlcXVpcmUoJy4vSW5wdXRNb2R1bGUnKTtcblxudmFyIF9JbnB1dE1vZHVsZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9JbnB1dE1vZHVsZTIpO1xuXG52YXIgX01vdGlvbklucHV0ID0gcmVxdWlyZSgnLi9Nb3Rpb25JbnB1dCcpO1xuXG52YXIgX01vdGlvbklucHV0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX01vdGlvbklucHV0KTtcblxudmFyIF9wbGF0Zm9ybSA9IHJlcXVpcmUoJ3BsYXRmb3JtJyk7XG5cbnZhciBfcGxhdGZvcm0yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGxhdGZvcm0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbi8qKlxuICogQ29udmVydHMgZGVncmVlcyB0byByYWRpYW5zLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWcgLSBBbmdsZSBpbiBkZWdyZWVzLlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBkZWdUb1JhZChkZWcpIHtcbiAgcmV0dXJuIGRlZyAqIE1hdGguUEkgLyAxODA7XG59XG5cbi8qKlxuICogQ29udmVydHMgcmFkaWFucyB0byBkZWdyZWVzLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWQgLSBBbmdsZSBpbiByYWRpYW5zLlxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiByYWRUb0RlZyhyYWQpIHtcbiAgcmV0dXJuIHJhZCAqIDE4MCAvIE1hdGguUEk7XG59XG5cbi8qKlxuICogTm9ybWFsaXplcyBhIDMgeCAzIG1hdHJpeC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcltdfSBtIC0gTWF0cml4IHRvIG5vcm1hbGl6ZSwgcmVwcmVzZW50ZWQgYnkgYW4gYXJyYXkgb2YgbGVuZ3RoIDkuXG4gKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplKG0pIHtcbiAgdmFyIGRldCA9IG1bMF0gKiBtWzRdICogbVs4XSArIG1bMV0gKiBtWzVdICogbVs2XSArIG1bMl0gKiBtWzNdICogbVs3XSAtIG1bMF0gKiBtWzVdICogbVs3XSAtIG1bMV0gKiBtWzNdICogbVs4XSAtIG1bMl0gKiBtWzRdICogbVs2XTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpKyspIHtcbiAgICBtW2ldIC89IGRldDtcbiAgfXJldHVybiBtO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgRXVsZXIgYW5nbGUgYFthbHBoYSwgYmV0YSwgZ2FtbWFdYCB0byB0aGUgVzNDIHNwZWNpZmljYXRpb24sIHdoZXJlOlxuICogLSBgYWxwaGFgIGlzIGluIFswOyArMzYwWztcbiAqIC0gYGJldGFgIGlzIGluIFstMTgwOyArMTgwWztcbiAqIC0gYGdhbW1hYCBpcyBpbiBbLTkwOyArOTBbLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IGV1bGVyQW5nbGUgLSBFdWxlciBhbmdsZSB0byB1bmlmeSwgcmVwcmVzZW50ZWQgYnkgYW4gYXJyYXkgb2YgbGVuZ3RoIDMgKGBbYWxwaGEsIGJldGEsIGdhbW1hXWApLlxuICogQHNlZSB7QGxpbmsgaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfVxuICovXG5mdW5jdGlvbiB1bmlmeShldWxlckFuZ2xlKSB7XG4gIC8vIENmLiBXM0Mgc3BlY2lmaWNhdGlvbiAoaHR0cDovL3czYy5naXRodWIuaW8vZGV2aWNlb3JpZW50YXRpb24vc3BlYy1zb3VyY2Utb3JpZW50YXRpb24uaHRtbClcbiAgLy8gYW5kIEV1bGVyIGFuZ2xlcyBXaWtpcGVkaWEgcGFnZSAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FdWxlcl9hbmdsZXMpLlxuICAvL1xuICAvLyBXM0MgY29udmVudGlvbjogVGFpdOKAk0JyeWFuIGFuZ2xlcyBaLVgnLVknJywgd2hlcmU6XG4gIC8vICAgYWxwaGEgaXMgaW4gWzA7ICszNjBbLFxuICAvLyAgIGJldGEgaXMgaW4gWy0xODA7ICsxODBbLFxuICAvLyAgIGdhbW1hIGlzIGluIFstOTA7ICs5MFsuXG5cbiAgdmFyIGFscGhhSXNWYWxpZCA9IHR5cGVvZiBldWxlckFuZ2xlWzBdID09PSAnbnVtYmVyJztcblxuICB2YXIgX2FscGhhID0gYWxwaGFJc1ZhbGlkID8gZGVnVG9SYWQoZXVsZXJBbmdsZVswXSkgOiAwO1xuICB2YXIgX2JldGEgPSBkZWdUb1JhZChldWxlckFuZ2xlWzFdKTtcbiAgdmFyIF9nYW1tYSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMl0pO1xuXG4gIHZhciBjQSA9IE1hdGguY29zKF9hbHBoYSk7XG4gIHZhciBjQiA9IE1hdGguY29zKF9iZXRhKTtcbiAgdmFyIGNHID0gTWF0aC5jb3MoX2dhbW1hKTtcbiAgdmFyIHNBID0gTWF0aC5zaW4oX2FscGhhKTtcbiAgdmFyIHNCID0gTWF0aC5zaW4oX2JldGEpO1xuICB2YXIgc0cgPSBNYXRoLnNpbihfZ2FtbWEpO1xuXG4gIHZhciBhbHBoYSA9IHZvaWQgMCxcbiAgICAgIGJldGEgPSB2b2lkIDAsXG4gICAgICBnYW1tYSA9IHZvaWQgMDtcblxuICB2YXIgbSA9IFtjQSAqIGNHIC0gc0EgKiBzQiAqIHNHLCAtY0IgKiBzQSwgY0EgKiBzRyArIGNHICogc0EgKiBzQiwgY0cgKiBzQSArIGNBICogc0IgKiBzRywgY0EgKiBjQiwgc0EgKiBzRyAtIGNBICogY0cgKiBzQiwgLWNCICogc0csIHNCLCBjQiAqIGNHXTtcbiAgbm9ybWFsaXplKG0pO1xuXG4gIC8vIFNpbmNlIHdlIHdhbnQgZ2FtbWEgaW4gWy05MDsgKzkwWywgY0cgPj0gMC5cbiAgaWYgKG1bOF0gPiAwKSB7XG4gICAgLy8gQ2FzZSAxOiBtWzhdID4gMCA8PT4gY0IgPiAwICAgICAgICAgICAgICAgICAoYW5kIGNHICE9IDApXG4gICAgLy8gICAgICAgICAgICAgICAgICA8PT4gYmV0YSBpbiBdLXBpLzI7ICtwaS8yWyAoYW5kIGNHICE9IDApXG4gICAgYWxwaGEgPSBNYXRoLmF0YW4yKC1tWzFdLCBtWzRdKTtcbiAgICBiZXRhID0gTWF0aC5hc2luKG1bN10pOyAvLyBhc2luIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkvMiBhbmQgK3BpLzIgPT4gT0tcbiAgICBnYW1tYSA9IE1hdGguYXRhbjIoLW1bNl0sIG1bOF0pO1xuICB9IGVsc2UgaWYgKG1bOF0gPCAwKSB7XG4gICAgLy8gQ2FzZSAyOiBtWzhdIDwgMCA8PT4gY0IgPCAwICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhbmQgY0cgIT0gMClcbiAgICAvLyAgICAgICAgICAgICAgICAgIDw9PiBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXSAoYW5kIGNHICE9IDApXG5cbiAgICAvLyBTaW5jZSBjQiA8IDAgYW5kIGNCIGlzIGluIG1bMV0gYW5kIG1bNF0sIHRoZSBwb2ludCBpcyBmbGlwcGVkIGJ5IDE4MCBkZWdyZWVzLlxuICAgIC8vIEhlbmNlLCB3ZSBoYXZlIHRvIG11bHRpcGx5IGJvdGggYXJndW1lbnRzIG9mIGF0YW4yIGJ5IC0xIGluIG9yZGVyIHRvIHJldmVydFxuICAgIC8vIHRoZSBwb2ludCBpbiBpdHMgb3JpZ2luYWwgcG9zaXRpb24gKD0+IGFub3RoZXIgZmxpcCBieSAxODAgZGVncmVlcykuXG4gICAgYWxwaGEgPSBNYXRoLmF0YW4yKG1bMV0sIC1tWzRdKTtcbiAgICBiZXRhID0gLU1hdGguYXNpbihtWzddKTtcbiAgICBiZXRhICs9IGJldGEgPj0gMCA/IC1NYXRoLlBJIDogTWF0aC5QSTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kIHBpLzIgPT4gbWFrZSBzdXJlIGJldGEgaW4gWy1waTsgLXBpLzJbIFUgXStwaS8yOyArcGldXG4gICAgZ2FtbWEgPSBNYXRoLmF0YW4yKG1bNl0sIC1tWzhdKTsgLy8gc2FtZSByZW1hcmsgYXMgZm9yIGFscGhhLCBtdWx0aXBsaWNhdGlvbiBieSAtMVxuICB9IGVsc2Uge1xuICAgIC8vIENhc2UgMzogbVs4XSA9IDAgPD0+IGNCID0gMCBvciBjRyA9IDBcbiAgICBpZiAobVs2XSA+IDApIHtcbiAgICAgIC8vIFN1YmNhc2UgMTogY0cgPSAwIGFuZCBjQiA+IDBcbiAgICAgIC8vICAgICAgICAgICAgY0cgPSAwIDw9PiBzRyA9IC0xIDw9PiBnYW1tYSA9IC1waS8yID0+IG1bNl0gPSBjQlxuICAgICAgLy8gICAgICAgICAgICBIZW5jZSwgbVs2XSA+IDAgPD0+IGNCID4gMCA8PT4gYmV0YSBpbiBdLXBpLzI7ICtwaS8yW1xuICAgICAgYWxwaGEgPSBNYXRoLmF0YW4yKC1tWzFdLCBtWzRdKTtcbiAgICAgIGJldGEgPSBNYXRoLmFzaW4obVs3XSk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCArcGkvMiA9PiBPS1xuICAgICAgZ2FtbWEgPSAtTWF0aC5QSSAvIDI7XG4gICAgfSBlbHNlIGlmIChtWzZdIDwgMCkge1xuICAgICAgLy8gU3ViY2FzZSAyOiBjRyA9IDAgYW5kIGNCIDwgMFxuICAgICAgLy8gICAgICAgICAgICBjRyA9IDAgPD0+IHNHID0gLTEgPD0+IGdhbW1hID0gLXBpLzIgPT4gbVs2XSA9IGNCXG4gICAgICAvLyAgICAgICAgICAgIEhlbmNlLCBtWzZdIDwgMCA8PT4gY0IgPCAwIDw9PiBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXVxuICAgICAgYWxwaGEgPSBNYXRoLmF0YW4yKG1bMV0sIC1tWzRdKTsgLy8gc2FtZSByZW1hcmsgYXMgZm9yIGFscGhhIGluIGEgY2FzZSBhYm92ZVxuICAgICAgYmV0YSA9IC1NYXRoLmFzaW4obVs3XSk7XG4gICAgICBiZXRhICs9IGJldGEgPj0gMCA/IC1NYXRoLlBJIDogTWF0aC5QSTsgLy8gYXNpbiByZXR1cm5zIGEgbnVtYmVyIGJldHdlZW4gLXBpLzIgYW5kICtwaS8yID0+IG1ha2Ugc3VyZSBiZXRhIGluIFstcGk7IC1waS8yWyBVIF0rcGkvMjsgK3BpXVxuICAgICAgZ2FtbWEgPSAtTWF0aC5QSSAvIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN1YmNhc2UgMzogY0IgPSAwXG4gICAgICAvLyBJbiB0aGUgY2FzZSB3aGVyZSBjb3MoYmV0YSkgPSAwIChpLmUuIGJldGEgPSAtcGkvMiBvciBiZXRhID0gcGkvMiksXG4gICAgICAvLyB3ZSBoYXZlIHRoZSBnaW1iYWwgbG9jayBwcm9ibGVtOiBpbiB0aGF0IGNvbmZpZ3VyYXRpb24sIG9ubHkgdGhlIGFuZ2xlXG4gICAgICAvLyBhbHBoYSArIGdhbW1hIChpZiBiZXRhID0gK3BpLzIpIG9yIGFscGhhIC0gZ2FtbWEgKGlmIGJldGEgPSAtcGkvMilcbiAgICAgIC8vIGFyZSB1bmlxdWVseSBkZWZpbmVkOiBhbHBoYSBhbmQgZ2FtbWEgY2FuIHRha2UgYW4gaW5maW5pdHkgb2YgdmFsdWVzLlxuICAgICAgLy8gRm9yIGNvbnZlbmllbmNlLCBsZXQncyBzZXQgZ2FtbWEgPSAwIChhbmQgdGh1cyBzaW4oZ2FtbWEpID0gMCkuXG4gICAgICAvLyAoQXMgYSBjb25zZXF1ZW5jZSBvZiB0aGUgZ2ltYmFsIGxvY2sgcHJvYmxlbSwgdGhlcmUgaXMgYSBkaXNjb250aW51aXR5XG4gICAgICAvLyBpbiBhbHBoYSBhbmQgZ2FtbWEuKVxuICAgICAgYWxwaGEgPSBNYXRoLmF0YW4yKG1bM10sIG1bMF0pO1xuICAgICAgYmV0YSA9IG1bN10gPiAwID8gTWF0aC5QSSAvIDIgOiAtTWF0aC5QSSAvIDI7XG4gICAgICBnYW1tYSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgcGkgPT4gbWFrZSBzdXJlIHRoYXQgYWxwaGEgaXMgaW4gWzAsIDIqcGlbLlxuICBhbHBoYSArPSBhbHBoYSA8IDAgPyAyICogTWF0aC5QSSA6IDA7XG5cbiAgZXVsZXJBbmdsZVswXSA9IGFscGhhSXNWYWxpZCA/IHJhZFRvRGVnKGFscGhhKSA6IG51bGw7XG4gIGV1bGVyQW5nbGVbMV0gPSByYWRUb0RlZyhiZXRhKTtcbiAgZXVsZXJBbmdsZVsyXSA9IHJhZFRvRGVnKGdhbW1hKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIEV1bGVyIGFuZ2xlIGBbYWxwaGEsIGJldGEsIGdhbW1hXWAgdG8gYSBFdWxlciBhbmdsZSB3aGVyZTpcbiAqIC0gYGFscGhhYCBpcyBpbiBbMDsgKzM2MFs7XG4gKiAtIGBiZXRhYCBpcyBpbiBbLTkwOyArOTBbO1xuICogLSBgZ2FtbWFgIGlzIGluIFstMTgwOyArMTgwWy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcltdfSBldWxlckFuZ2xlIC0gRXVsZXIgYW5nbGUgdG8gY29udmVydCwgcmVwcmVzZW50ZWQgYnkgYW4gYXJyYXkgb2YgbGVuZ3RoIDMgKGBbYWxwaGEsIGJldGEsIGdhbW1hXWApLlxuICovXG5mdW5jdGlvbiB1bmlmeUFsdChldWxlckFuZ2xlKSB7XG4gIC8vIENvbnZlbnRpb24gaGVyZTogVGFpdOKAk0JyeWFuIGFuZ2xlcyBaLVgnLVknJywgd2hlcmU6XG4gIC8vICAgYWxwaGEgaXMgaW4gWzA7ICszNjBbLFxuICAvLyAgIGJldGEgaXMgaW4gWy05MDsgKzkwWyxcbiAgLy8gICBnYW1tYSBpcyBpbiBbLTE4MDsgKzE4MFsuXG5cbiAgdmFyIGFscGhhSXNWYWxpZCA9IHR5cGVvZiBldWxlckFuZ2xlWzBdID09PSAnbnVtYmVyJztcblxuICB2YXIgX2FscGhhID0gYWxwaGFJc1ZhbGlkID8gZGVnVG9SYWQoZXVsZXJBbmdsZVswXSkgOiAwO1xuICB2YXIgX2JldGEgPSBkZWdUb1JhZChldWxlckFuZ2xlWzFdKTtcbiAgdmFyIF9nYW1tYSA9IGRlZ1RvUmFkKGV1bGVyQW5nbGVbMl0pO1xuXG4gIHZhciBjQSA9IE1hdGguY29zKF9hbHBoYSk7XG4gIHZhciBjQiA9IE1hdGguY29zKF9iZXRhKTtcbiAgdmFyIGNHID0gTWF0aC5jb3MoX2dhbW1hKTtcbiAgdmFyIHNBID0gTWF0aC5zaW4oX2FscGhhKTtcbiAgdmFyIHNCID0gTWF0aC5zaW4oX2JldGEpO1xuICB2YXIgc0cgPSBNYXRoLnNpbihfZ2FtbWEpO1xuXG4gIHZhciBhbHBoYSA9IHZvaWQgMCxcbiAgICAgIGJldGEgPSB2b2lkIDAsXG4gICAgICBnYW1tYSA9IHZvaWQgMDtcblxuICB2YXIgbSA9IFtjQSAqIGNHIC0gc0EgKiBzQiAqIHNHLCAtY0IgKiBzQSwgY0EgKiBzRyArIGNHICogc0EgKiBzQiwgY0cgKiBzQSArIGNBICogc0IgKiBzRywgY0EgKiBjQiwgc0EgKiBzRyAtIGNBICogY0cgKiBzQiwgLWNCICogc0csIHNCLCBjQiAqIGNHXTtcbiAgbm9ybWFsaXplKG0pO1xuXG4gIGFscGhhID0gTWF0aC5hdGFuMigtbVsxXSwgbVs0XSk7XG4gIGFscGhhICs9IGFscGhhIDwgMCA/IDIgKiBNYXRoLlBJIDogMDsgLy8gYXRhbjIgcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waSBhbmQgK3BpID0+IG1ha2Ugc3VyZSBhbHBoYSBpcyBpbiBbMCwgMipwaVsuXG4gIGJldGEgPSBNYXRoLmFzaW4obVs3XSk7IC8vIGFzaW4gcmV0dXJucyBhIG51bWJlciBiZXR3ZWVuIC1waS8yIGFuZCBwaS8yID0+IE9LXG4gIGdhbW1hID0gTWF0aC5hdGFuMigtbVs2XSwgbVs4XSk7IC8vIGF0YW4yIHJldHVybnMgYSBudW1iZXIgYmV0d2VlbiAtcGkgYW5kICtwaSA9PiBPS1xuXG4gIGV1bGVyQW5nbGVbMF0gPSBhbHBoYUlzVmFsaWQgPyByYWRUb0RlZyhhbHBoYSkgOiBudWxsO1xuICBldWxlckFuZ2xlWzFdID0gcmFkVG9EZWcoYmV0YSk7XG4gIGV1bGVyQW5nbGVbMl0gPSByYWRUb0RlZyhnYW1tYSk7XG59XG5cbi8qKlxuICogYERldmljZU9yaWVudGF0aW9uTW9kdWxlYCBzaW5nbGV0b24uXG4gKiBUaGUgYERldmljZU9yaWVudGF0aW9uTW9kdWxlYCBzaW5nbGV0b24gcHJvdmlkZXMgdGhlIHJhdyB2YWx1ZXNcbiAqIG9mIHRoZSBvcmllbnRhdGlvbiBwcm92aWRlZCBieSB0aGUgYERldmljZU1vdGlvbmAgZXZlbnQuXG4gKiBJdCBhbHNvIGluc3RhbnRpYXRlIHRoZSBgT3JpZW50YXRpb25gIHN1Ym1vZHVsZSB0aGF0IHVuaWZpZXMgdGhvc2VcbiAqIHZhbHVlcyBhY3Jvc3MgcGxhdGZvcm1zIGJ5IG1ha2luZyB0aGVtIGNvbXBsaWFudCB3aXRoIHtAbGlua1xuICogaHR0cDovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvfHRoZSBXM0Mgc3RhbmRhcmR9ICgqaS5lLipcbiAqIHRoZSBgYWxwaGFgIGFuZ2xlIGJldHdlZW4gYDBgIGFuZCBgMzYwYCBkZWdyZWVzLCB0aGUgYGJldGFgIGFuZ2xlXG4gKiBiZXR3ZWVuIGAtMTgwYCBhbmQgYDE4MGAgZGVncmVlcywgYW5kIGBnYW1tYWAgYmV0d2VlbiBgLTkwYCBhbmRcbiAqIGA5MGAgZGVncmVlcyksIGFzIHdlbGwgYXMgdGhlIGBPcmllbnRhdGlvbkFsdGAgc3VibW9kdWxlcyAod2l0aFxuICogdGhlIGBhbHBoYWAgYW5nbGUgYmV0d2VlbiBgMGAgYW5kIGAzNjBgIGRlZ3JlZXMsIHRoZSBgYmV0YWAgYW5nbGVcbiAqIGJldHdlZW4gYC05MGAgYW5kIGA5MGAgZGVncmVlcywgYW5kIGBnYW1tYWAgYmV0d2VlbiBgLTE4MGAgYW5kXG4gKiBgMTgwYCBkZWdyZWVzKS5cbiAqIFdoZW4gdGhlIGBvcmllbnRhdGlvbmAgcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IHRoZSBzZW5zb3JzLFxuICogdGhpcyBtb2R1bGVzIHRyaWVzIHRvIHJlY2FsY3VsYXRlIGBiZXRhYCBhbmQgYGdhbW1hYCBmcm9tIHRoZVxuICogYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIG1vZHVsZSwgaWYgYXZhaWxhYmxlIChpbiB0aGF0IGNhc2UsXG4gKiB0aGUgYGFscGhhYCBhbmdsZSBpcyBpbXBvc3NpYmxlIHRvIHJldHJpZXZlIHNpbmNlIHRoZSBjb21wYXNzIGlzXG4gKiBub3QgYXZhaWxhYmxlKS5cbiAqXG4gKiBAY2xhc3MgRGV2aWNlTW90aW9uTW9kdWxlXG4gKiBAZXh0ZW5kcyBJbnB1dE1vZHVsZVxuICovXG5cbnZhciBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZSA9IGZ1bmN0aW9uIChfSW5wdXRNb2R1bGUpIHtcbiAgX2luaGVyaXRzKERldmljZU9yaWVudGF0aW9uTW9kdWxlLCBfSW5wdXRNb2R1bGUpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBgRGV2aWNlT3JpZW50YXRpb25gIG1vZHVsZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBmdW5jdGlvbiBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUpO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW9yaWVudGF0aW9uYCBldmVudCBzZW50IGJ5IHRoaXMgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgW251bGwsIG51bGwsIG51bGxdXG4gICAgICovXG4gICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKERldmljZU9yaWVudGF0aW9uTW9kdWxlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUpKS5jYWxsKHRoaXMsICdkZXZpY2VvcmllbnRhdGlvbicpKTtcblxuICAgIF90aGlzLmV2ZW50ID0gW251bGwsIG51bGwsIG51bGxdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBPcmllbnRhdGlvbmAgbW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSBvcmllbnRhdGlvbiBjb21wbGlhbnQgd2l0aCB7QGxpbmtcbiAgICAgKiBodHRwOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC98dGhlIFczQyBzdGFuZGFyZH1cbiAgICAgKiAoYGFscGhhYCBpbiBgWzAsIDM2MF1gLCBiZXRhIGluIGBbLTE4MCwgKzE4MF1gLCBgZ2FtbWFgIGluIGBbLTkwLCArOTBdYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICBfdGhpcy5vcmllbnRhdGlvbiA9IG5ldyBfRE9NRXZlbnRTdWJtb2R1bGUyLmRlZmF1bHQoX3RoaXMsICdvcmllbnRhdGlvbicpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBPcmllbnRhdGlvbkFsdGAgbW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIGFsdGVybmF0aXZlIHZhbHVlcyBvZiB0aGUgb3JpZW50YXRpb25cbiAgICAgKiAoYGFscGhhYCBpbiBgWzAsIDM2MF1gLCBiZXRhIGluIGBbLTkwLCArOTBdYCwgYGdhbW1hYCBpbiBgWy0xODAsICsxODBdYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICBfdGhpcy5vcmllbnRhdGlvbkFsdCA9IG5ldyBfRE9NRXZlbnRTdWJtb2R1bGUyLmRlZmF1bHQoX3RoaXMsICdvcmllbnRhdGlvbkFsdCcpO1xuXG4gICAgLyoqXG4gICAgICogUmVxdWlyZWQgc3VibW9kdWxlcyAvIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IG9yaWVudGF0aW9uIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBvcmllbnRhdGlvbmAgdW5pZmllZCB2YWx1ZXMgYXJlIHJlcXVpcmVkIG9yIG5vdCAoZGVmYXVsdHMgdG8gYGZhbHNlYCkuXG4gICAgICogQHByb3BlcnR5IHtib29sfSBvcmllbnRhdGlvbkFsdCAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBgb3JpZW50YXRpb25BbHRgIHZhbHVlcyBhcmUgcmVxdWlyZWQgb3Igbm90IChkZWZhdWx0cyB0byBgZmFsc2VgKS5cbiAgICAgKi9cbiAgICBfdGhpcy5yZXF1aXJlZCA9IHtcbiAgICAgIG9yaWVudGF0aW9uOiBmYWxzZSxcbiAgICAgIG9yaWVudGF0aW9uQWx0OiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIGZ1bmN0aW9uIG9mIHRoZSBtb2R1bGUncyBwcm9taXNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBzZWUgRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUjaW5pdFxuICAgICAqL1xuICAgIF90aGlzLl9wcm9taXNlUmVzb2x2ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBHcmF2aXR5IHZlY3RvciBjYWxjdWxhdGVkIGZyb20gdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU9yaWVudGF0aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIF90aGlzLl9lc3RpbWF0ZWRHcmF2aXR5ID0gWzAsIDAsIDBdO1xuXG4gICAgX3RoaXMuX3Byb2Nlc3NGdW5jdGlvbiA9IG51bGw7XG4gICAgX3RoaXMuX3Byb2Nlc3MgPSBfdGhpcy5fcHJvY2Vzcy5iaW5kKF90aGlzKTtcbiAgICBfdGhpcy5fZGV2aWNlb3JpZW50YXRpb25DaGVjayA9IF90aGlzLl9kZXZpY2VvcmllbnRhdGlvbkNoZWNrLmJpbmQoX3RoaXMpO1xuICAgIF90aGlzLl9kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyID0gX3RoaXMuX2RldmljZW9yaWVudGF0aW9uTGlzdGVuZXIuYmluZChfdGhpcyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbnNvciBjaGVjayBvbiBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9kdWxlLlxuICAgKiBUaGlzIG1ldGhvZDpcbiAgICogLSBjaGVja3Mgd2hldGhlciB0aGUgYG9yaWVudGF0aW9uYCB2YWx1ZXMgYXJlIHZhbGlkIG9yIG5vdDtcbiAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgb3JpZW50YXRpb24gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkKVxuICAgKiAgIHRyaWVzIHRvIGNhbGN1bGF0ZSB0aGUgb3JpZW50YXRpb24gZnJvbSB0aGVcbiAgICogICBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBGaXJzdCBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGNhdWdodCwgb24gd2hpY2ggdGhlIGNoZWNrIGlzIGRvbmUuXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKERldmljZU9yaWVudGF0aW9uTW9kdWxlLCBbe1xuICAgIGtleTogJ19kZXZpY2VvcmllbnRhdGlvbkNoZWNrJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2RldmljZW9yaWVudGF0aW9uQ2hlY2soZSkge1xuICAgICAgLy8gY2xlYXIgdGltZW91dCAoYW50aS1GaXJlZm94IGJ1ZyBzb2x1dGlvbiwgd2luZG93IGV2ZW50IGRldmljZW9yaWVudGF0aW9uIGJlaW5nIG52ZXIgY2FsbGVkKVxuICAgICAgLy8gc2V0IHRoZSBzZXQgdGltZW91dCBpbiBpbml0KCkgZnVuY3Rpb25cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9jaGVja1RpbWVvdXRJZCk7XG5cbiAgICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG5cbiAgICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBvcmllbnRhdGlvbiBhbmQgYWx0ZXJuYXRpdmUgb3JpZW50YXRpb25cbiAgICAgIHZhciByYXdWYWx1ZXNQcm92aWRlZCA9IHR5cGVvZiBlLmFscGhhID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgZS5iZXRhID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgZS5nYW1tYSA9PT0gJ251bWJlcic7XG4gICAgICB0aGlzLm9yaWVudGF0aW9uLmlzUHJvdmlkZWQgPSByYXdWYWx1ZXNQcm92aWRlZDtcbiAgICAgIHRoaXMub3JpZW50YXRpb25BbHQuaXNQcm92aWRlZCA9IHJhd1ZhbHVlc1Byb3ZpZGVkO1xuXG4gICAgICAvLyBUT0RPKD8pOiBnZXQgcHNldWRvLXBlcmlvZFxuXG4gICAgICAvLyBzd2FwIHRoZSBwcm9jZXNzIGZ1bmN0aW9uIHRvIHRoZVxuICAgICAgdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5fZGV2aWNlb3JpZW50YXRpb25MaXN0ZW5lcjtcblxuICAgICAgLy8gSWYgb3JpZW50YXRpb24gb3IgYWx0ZXJuYXRpdmUgb3JpZW50YXRpb24gYXJlIG5vdCBwcm92aWRlZCBieSByYXcgc2Vuc29ycyBidXQgcmVxdWlyZWQsXG4gICAgICAvLyB0cnkgdG8gY2FsY3VsYXRlIHRoZW0gd2l0aCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXNcbiAgICAgIGlmICh0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uICYmICF0aGlzLm9yaWVudGF0aW9uLmlzUHJvdmlkZWQgfHwgdGhpcy5yZXF1aXJlZC5vcmllbnRhdGlvbkFsdCAmJiAhdGhpcy5vcmllbnRhdGlvbkFsdC5pc1Byb3ZpZGVkKSB0aGlzLl90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2soKTtlbHNlIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudCBjYWxsYmFjay5cbiAgICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSByYXcgYCdkZXZpY2VvcmllbnRhdGlvbidgIHZhbHVlcyxcbiAgICAgKiBhbmQgZW1pdHMgZXZlbnRzIHdpdGggdGhlIHVuaWZpZWQgYG9yaWVudGF0aW9uYCBhbmQgLyBvciB0aGVcbiAgICAgKiBgb3JpZW50YXRpb25BbHRgIHZhbHVlcyBpZiB0aGV5IGFyZSByZXF1aXJlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RGV2aWNlT3JpZW50YXRpb25FdmVudH0gZSAtIGAnZGV2aWNlb3JpZW50YXRpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ19kZXZpY2VvcmllbnRhdGlvbkxpc3RlbmVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2RldmljZW9yaWVudGF0aW9uTGlzdGVuZXIoZSkge1xuICAgICAgLy8gJ2RldmljZW9yaWVudGF0aW9uJyBldmVudCAocmF3IHZhbHVlcylcbiAgICAgIHZhciBvdXRFdmVudCA9IHRoaXMuZXZlbnQ7XG5cbiAgICAgIG91dEV2ZW50WzBdID0gZS5hbHBoYTtcbiAgICAgIG91dEV2ZW50WzFdID0gZS5iZXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmdhbW1hO1xuXG4gICAgICBpZiAodGhpcy5saXN0ZW5lcnMuc2l6ZSA+IDApIHRoaXMuZW1pdChvdXRFdmVudCk7XG5cbiAgICAgIC8vICdvcmllbnRhdGlvbicgZXZlbnQgKHVuaWZpZWQgdmFsdWVzKVxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24ubGlzdGVuZXJzLnNpemUgPiAwICYmIHRoaXMucmVxdWlyZWQub3JpZW50YXRpb24gJiYgdGhpcy5vcmllbnRhdGlvbi5pc1Byb3ZpZGVkKSB7XG4gICAgICAgIC8vIE9uIGlPUywgdGhlIGBhbHBoYWAgdmFsdWUgaXMgaW5pdGlhbGl6ZWQgYXQgYDBgIG9uIHRoZSBmaXJzdCBgZGV2aWNlb3JpZW50YXRpb25gIGV2ZW50XG4gICAgICAgIC8vIHNvIHdlIGtlZXAgdGhhdCByZWZlcmVuY2UgaW4gbWVtb3J5IHRvIGNhbGN1bGF0ZSB0aGUgTm9ydGggbGF0ZXIgb25cbiAgICAgICAgaWYgKCF0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBlLndlYmtpdENvbXBhc3NIZWFkaW5nICYmIF9wbGF0Zm9ybTIuZGVmYXVsdC5vcy5mYW1pbHkgPT09ICdpT1MnKSB0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSA9IGUud2Via2l0Q29tcGFzc0hlYWRpbmc7XG5cbiAgICAgICAgdmFyIF9vdXRFdmVudCA9IHRoaXMub3JpZW50YXRpb24uZXZlbnQ7XG5cbiAgICAgICAgX291dEV2ZW50WzBdID0gZS5hbHBoYTtcbiAgICAgICAgX291dEV2ZW50WzFdID0gZS5iZXRhO1xuICAgICAgICBfb3V0RXZlbnRbMl0gPSBlLmdhbW1hO1xuXG4gICAgICAgIC8vIE9uIGlPUywgcmVwbGFjZSB0aGUgYGFscGhhYCB2YWx1ZSBieSB0aGUgTm9ydGggdmFsdWUgYW5kIHVuaWZ5IHRoZSBhbmdsZXNcbiAgICAgICAgLy8gKHRoZSBkZWZhdWx0IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhbmdsZXMgb24gaU9TIGlzIG5vdCBjb21wbGlhbnQgd2l0aCB0aGUgVzNDIHNwZWNpZmljYXRpb24pXG4gICAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZSAmJiBfcGxhdGZvcm0yLmRlZmF1bHQub3MuZmFtaWx5ID09PSAnaU9TJykge1xuICAgICAgICAgIF9vdXRFdmVudFswXSArPSAzNjAgLSB0aGlzLm9yaWVudGF0aW9uLl93ZWJraXRDb21wYXNzSGVhZGluZ1JlZmVyZW5jZTtcbiAgICAgICAgICB1bmlmeShfb3V0RXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbi5lbWl0KF9vdXRFdmVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vICdvcmllbnRhdGlvbkFsdCcgZXZlbnRcbiAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uQWx0Lmxpc3RlbmVycy5zaXplID4gMCAmJiB0aGlzLnJlcXVpcmVkLm9yaWVudGF0aW9uQWx0ICYmIHRoaXMub3JpZW50YXRpb25BbHQuaXNQcm92aWRlZCkge1xuICAgICAgICAvLyBPbiBpT1MsIHRoZSBgYWxwaGFgIHZhbHVlIGlzIGluaXRpYWxpemVkIGF0IGAwYCBvbiB0aGUgZmlyc3QgYGRldmljZW9yaWVudGF0aW9uYCBldmVudFxuICAgICAgICAvLyBzbyB3ZSBrZWVwIHRoYXQgcmVmZXJlbmNlIGluIG1lbW9yeSB0byBjYWxjdWxhdGUgdGhlIE5vcnRoIGxhdGVyIG9uXG4gICAgICAgIGlmICghdGhpcy5vcmllbnRhdGlvbkFsdC5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgZS53ZWJraXRDb21wYXNzSGVhZGluZyAmJiBfcGxhdGZvcm0yLmRlZmF1bHQub3MuZmFtaWx5ID09PSAnaU9TJykgdGhpcy5vcmllbnRhdGlvbkFsdC5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgPSBlLndlYmtpdENvbXBhc3NIZWFkaW5nO1xuXG4gICAgICAgIHZhciBfb3V0RXZlbnQyID0gdGhpcy5vcmllbnRhdGlvbkFsdC5ldmVudDtcblxuICAgICAgICBfb3V0RXZlbnQyWzBdID0gZS5hbHBoYTtcbiAgICAgICAgX291dEV2ZW50MlsxXSA9IGUuYmV0YTtcbiAgICAgICAgX291dEV2ZW50MlsyXSA9IGUuZ2FtbWE7XG5cbiAgICAgICAgLy8gT24gaU9TLCByZXBsYWNlIHRoZSBgYWxwaGFgIHZhbHVlIGJ5IHRoZSBOb3J0aCB2YWx1ZSBidXQgZG8gbm90IGNvbnZlcnQgdGhlIGFuZ2xlc1xuICAgICAgICAvLyAodGhlIGRlZmF1bHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvbiBpT1MgaXMgY29tcGxpYW50IHdpdGggdGhlIGFsdGVybmF0aXZlIHJlcHJlc2VudGF0aW9uKVxuICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbkFsdC5fd2Via2l0Q29tcGFzc0hlYWRpbmdSZWZlcmVuY2UgJiYgX3BsYXRmb3JtMi5kZWZhdWx0Lm9zLmZhbWlseSA9PT0gJ2lPUycpIHtcbiAgICAgICAgICBfb3V0RXZlbnQyWzBdIC09IHRoaXMub3JpZW50YXRpb25BbHQuX3dlYmtpdENvbXBhc3NIZWFkaW5nUmVmZXJlbmNlO1xuICAgICAgICAgIF9vdXRFdmVudDJbMF0gKz0gX291dEV2ZW50MlswXSA8IDAgPyAzNjAgOiAwOyAvLyBtYWtlIHN1cmUgYGFscGhhYCBpcyBpbiBbMCwgKzM2MFtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9uIEFuZHJvaWQsIHRyYW5zZm9ybSB0aGUgYW5nbGVzIHRvIHRoZSBhbHRlcm5hdGl2ZSByZXByZXNlbnRhdGlvblxuICAgICAgICAvLyAodGhlIGRlZmF1bHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFuZ2xlcyBvbiBBbmRyb2lkIGlzIGNvbXBsaWFudCB3aXRoIHRoZSBXM0Mgc3BlY2lmaWNhdGlvbilcbiAgICAgICAgaWYgKF9wbGF0Zm9ybTIuZGVmYXVsdC5vcy5mYW1pbHkgPT09ICdBbmRyb2lkJykgdW5pZnlBbHQoX291dEV2ZW50Mik7XG5cbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5lbWl0KF9vdXRFdmVudDIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIGBiZXRhYCBhbmQgYGdhbW1hYCBjYW4gYmUgY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdmFsdWVzIG9yIG5vdC5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnX3RyeUFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlGYWxsYmFjaycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2soKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgX01vdGlvbklucHV0Mi5kZWZhdWx0LnJlcXVpcmVNb2R1bGUoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknKS50aGVuKGZ1bmN0aW9uIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KSB7XG4gICAgICAgIGlmIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzVmFsaWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkcgKG1vdGlvbi1pbnB1dCk6IFRoZSAnZGV2aWNlb3JpZW50YXRpb24nIGV2ZW50IGRvZXMgbm90IGV4aXN0IG9yIGRvZXMgbm90IHByb3ZpZGUgdmFsdWVzIGluIHlvdXIgYnJvd3Nlciwgc28gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBkZXZpY2UgaXMgZXN0aW1hdGVkIGZyb20gRGV2aWNlTW90aW9uJ3MgJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknIGV2ZW50LiBTaW5jZSB0aGUgY29tcGFzcyBpcyBub3QgYXZhaWxhYmxlLCBvbmx5IHRoZSBgYmV0YWAgYW5kIGBnYW1tYWAgYW5nbGVzIGFyZSBwcm92aWRlZCAoYGFscGhhYCBpcyBudWxsKS5cIik7XG5cbiAgICAgICAgICBpZiAoX3RoaXMyLnJlcXVpcmVkLm9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICBfdGhpczIub3JpZW50YXRpb24uaXNDYWxjdWxhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzMi5vcmllbnRhdGlvbi5wZXJpb2QgPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZDtcblxuICAgICAgICAgICAgX01vdGlvbklucHV0Mi5kZWZhdWx0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgZnVuY3Rpb24gKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpIHtcbiAgICAgICAgICAgICAgX3RoaXMyLl9jYWxjdWxhdGVCZXRhQW5kR2FtbWFGcm9tQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eShhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChfdGhpczIucmVxdWlyZWQub3JpZW50YXRpb25BbHQpIHtcbiAgICAgICAgICAgIF90aGlzMi5vcmllbnRhdGlvbkFsdC5pc0NhbGN1bGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgX3RoaXMyLm9yaWVudGF0aW9uQWx0LnBlcmlvZCA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkucGVyaW9kO1xuXG4gICAgICAgICAgICBfTW90aW9uSW5wdXQyLmRlZmF1bHQuYWRkTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCBmdW5jdGlvbiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSkge1xuICAgICAgICAgICAgICBfdGhpczIuX2NhbGN1bGF0ZUJldGFBbmRHYW1tYUZyb21BY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHksIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMyLl9wcm9taXNlUmVzb2x2ZShfdGhpczIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBhbmQgZW1pdHMgYGJldGFgIGFuZCBgZ2FtbWFgIHZhbHVlcyBhcyBhIGZhbGxiYWNrIG9mIHRoZSBgb3JpZW50YXRpb25gIGFuZCAvIG9yIGBvcmllbnRhdGlvbkFsdGAgZXZlbnRzLCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgdW5pZmllZCB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IC0gTGF0ZXN0IGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IHJhdyB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtib29sfSBbYWx0PWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHdlIG5lZWQgdGhlIGFsdGVybmF0ZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYW5nbGVzIG9yIG5vdC5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnX2NhbGN1bGF0ZUJldGFBbmRHYW1tYUZyb21BY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2NhbGN1bGF0ZUJldGFBbmRHYW1tYUZyb21BY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpIHtcbiAgICAgIHZhciBhbHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuXG4gICAgICB2YXIgayA9IDAuODtcblxuICAgICAgLy8gTG93IHBhc3MgZmlsdGVyIHRvIGVzdGltYXRlIHRoZSBncmF2aXR5XG4gICAgICB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdID0gayAqIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMF0gKyAoMSAtIGspICogYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICAgIHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMV0gPSBrICogdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsxXSArICgxIC0gaykgKiBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdO1xuICAgICAgdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsyXSA9IGsgKiB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzJdICsgKDEgLSBrKSAqIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl07XG5cbiAgICAgIHZhciBfZ1ggPSB0aGlzLl9lc3RpbWF0ZWRHcmF2aXR5WzBdO1xuICAgICAgdmFyIF9nWSA9IHRoaXMuX2VzdGltYXRlZEdyYXZpdHlbMV07XG4gICAgICB2YXIgX2daID0gdGhpcy5fZXN0aW1hdGVkR3Jhdml0eVsyXTtcblxuICAgICAgdmFyIG5vcm0gPSBNYXRoLnNxcnQoX2dYICogX2dYICsgX2dZICogX2dZICsgX2daICogX2daKTtcblxuICAgICAgX2dYIC89IG5vcm07XG4gICAgICBfZ1kgLz0gbm9ybTtcbiAgICAgIF9nWiAvPSBub3JtO1xuXG4gICAgICAvLyBBZG9wdGluZyB0aGUgZm9sbG93aW5nIGNvbnZlbnRpb25zOlxuICAgICAgLy8gLSBlYWNoIG1hdHJpeCBvcGVyYXRlcyBieSBwcmUtbXVsdGlwbHlpbmcgY29sdW1uIHZlY3RvcnMsXG4gICAgICAvLyAtIGVhY2ggbWF0cml4IHJlcHJlc2VudHMgYW4gYWN0aXZlIHJvdGF0aW9uLFxuICAgICAgLy8gLSBlYWNoIG1hdHJpeCByZXByZXNlbnRzIHRoZSBjb21wb3NpdGlvbiBvZiBpbnRyaW5zaWMgcm90YXRpb25zLFxuICAgICAgLy8gdGhlIHJvdGF0aW9uIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIGNvbXBvc2l0aW9uIG9mIGEgcm90YXRpb25cbiAgICAgIC8vIGFib3V0IHRoZSB4LWF4aXMgYnkgYW4gYW5nbGUgYmV0YSBhbmQgYSByb3RhdGlvbiBhYm91dCB0aGUgeS1heGlzXG4gICAgICAvLyBieSBhbiBhbmdsZSBnYW1tYSBpczpcbiAgICAgIC8vXG4gICAgICAvLyBbIGNvcyhnYW1tYSkgICAgICAgICAgICAgICAsICAwICAgICAgICAgICwgIHNpbihnYW1tYSkgICAgICAgICAgICAgICxcbiAgICAgIC8vICAgc2luKGJldGEpICogc2luKGdhbW1hKSAgICwgIGNvcyhiZXRhKSAgLCAgLWNvcyhnYW1tYSkgKiBzaW4oYmV0YSkgLFxuICAgICAgLy8gICAtY29zKGJldGEpICogc2luKGdhbW1hKSAgLCAgc2luKGJldGEpICAsICBjb3MoYmV0YSkgKiBjb3MoZ2FtbWEpICBdLlxuICAgICAgLy9cbiAgICAgIC8vIEhlbmNlLCB0aGUgcHJvamVjdGlvbiBvZiB0aGUgbm9ybWFsaXplZCBncmF2aXR5IGcgPSBbMCwgMCwgMV1cbiAgICAgIC8vIGluIHRoZSBkZXZpY2UncyByZWZlcmVuY2UgZnJhbWUgY29ycmVzcG9uZHMgdG86XG4gICAgICAvL1xuICAgICAgLy8gZ1ggPSAtY29zKGJldGEpICogc2luKGdhbW1hKSxcbiAgICAgIC8vIGdZID0gc2luKGJldGEpLFxuICAgICAgLy8gZ1ogPSBjb3MoYmV0YSkgKiBjb3MoZ2FtbWEpLFxuICAgICAgLy9cbiAgICAgIC8vIHNvIGJldGEgPSBhc2luKGdZKSBhbmQgZ2FtbWEgPSBhdGFuMigtZ1gsIGdaKS5cblxuICAgICAgLy8gQmV0YSAmIGdhbW1hIGVxdWF0aW9ucyAod2UgYXBwcm94aW1hdGUgW2dYLCBnWSwgZ1pdIGJ5IFtfZ1gsIF9nWSwgX2daXSlcbiAgICAgIHZhciBiZXRhID0gcmFkVG9EZWcoTWF0aC5hc2luKF9nWSkpOyAvLyBiZXRhIGlzIGluIFstcGkvMjsgcGkvMltcbiAgICAgIHZhciBnYW1tYSA9IHJhZFRvRGVnKE1hdGguYXRhbjIoLV9nWCwgX2daKSk7IC8vIGdhbW1hIGlzIGluIFstcGk7IHBpW1xuXG4gICAgICBpZiAoYWx0KSB7XG4gICAgICAgIC8vIEluIHRoYXQgY2FzZSwgdGhlcmUgaXMgbm90aGluZyB0byBkbyBzaW5jZSB0aGUgY2FsY3VsYXRpb25zIGFib3ZlIGdhdmUgdGhlIGFuZ2xlIGluIHRoZSByaWdodCByYW5nZXNcbiAgICAgICAgdmFyIG91dEV2ZW50ID0gdGhpcy5vcmllbnRhdGlvbkFsdC5ldmVudDtcbiAgICAgICAgb3V0RXZlbnRbMF0gPSBudWxsO1xuICAgICAgICBvdXRFdmVudFsxXSA9IGJldGE7XG4gICAgICAgIG91dEV2ZW50WzJdID0gZ2FtbWE7XG5cbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbkFsdC5lbWl0KG91dEV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhlcmUgd2UgaGF2ZSB0byB1bmlmeSB0aGUgYW5nbGVzIHRvIGdldCB0aGUgcmFuZ2VzIGNvbXBsaWFudCB3aXRoIHRoZSBXM0Mgc3BlY2lmaWNhdGlvblxuICAgICAgICB2YXIgX291dEV2ZW50MyA9IHRoaXMub3JpZW50YXRpb24uZXZlbnQ7XG4gICAgICAgIF9vdXRFdmVudDNbMF0gPSBudWxsO1xuICAgICAgICBfb3V0RXZlbnQzWzFdID0gYmV0YTtcbiAgICAgICAgX291dEV2ZW50M1syXSA9IGdhbW1hO1xuICAgICAgICB1bmlmeShfb3V0RXZlbnQzKTtcblxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uLmVtaXQoX291dEV2ZW50Myk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnX3Byb2Nlc3MnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcHJvY2VzcyhkYXRhKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgb2YgdGhlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2luaXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBfZ2V0KERldmljZU9yaWVudGF0aW9uTW9kdWxlLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKERldmljZU9yaWVudGF0aW9uTW9kdWxlLnByb3RvdHlwZSksICdpbml0JywgdGhpcykuY2FsbCh0aGlzLCBmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBfdGhpczMuX3Byb21pc2VSZXNvbHZlID0gcmVzb2x2ZTtcblxuICAgICAgICBpZiAod2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQpIHtcbiAgICAgICAgICBfdGhpczMuX3Byb2Nlc3NGdW5jdGlvbiA9IF90aGlzMy5fZGV2aWNlb3JpZW50YXRpb25DaGVjaztcbiAgICAgICAgICAvLyBmZWF0dXJlIGRldGVjdFxuICAgICAgICAgIGlmICh0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpLnRoZW4oZnVuY3Rpb24gKHBlcm1pc3Npb25TdGF0ZSkge1xuICAgICAgICAgICAgICBpZiAocGVybWlzc2lvblN0YXRlID09PSAnZ3JhbnRlZCcpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCBfdGhpczMuX3Byb2Nlc3MsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgZmFsbGJhY2sgdGltZW91dCBmb3IgRmlyZWZveCAoaXRzIHdpbmRvdyBuZXZlciBjYWxsaW5nIHRoZSBEZXZpY2VPcmllbnRhdGlvbiBldmVudCwgYSBcbiAgICAgICAgICAgICAgICAvLyByZXF1aXJlIG9mIHRoZSBEZXZpY2VPcmllbnRhdGlvbiBzZXJ2aWNlIHdpbGwgcmVzdWx0IGluIHRoZSByZXF1aXJlIHByb21pc2UgbmV2ZXIgYmVpbmcgcmVzb2x2ZWRcbiAgICAgICAgICAgICAgICAvLyBoZW5jZSB0aGUgRXhwZXJpbWVudCBzdGFydCgpIG1ldGhvZCBuZXZlciBjYWxsZWQpXG4gICAgICAgICAgICAgICAgX3RoaXMzLl9jaGVja1RpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoX3RoaXMzKTtcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChjb25zb2xlLmVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIHJlZ3VsYXIgbm9uIGlPUyAxMysgZGV2aWNlc1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgX3RoaXMzLl9wcm9jZXNzLCBmYWxzZSk7XG4gICAgICAgICAgICAvLyBzZXQgZmFsbGJhY2sgdGltZW91dCBmb3IgRmlyZWZveCAoaXRzIHdpbmRvdyBuZXZlciBjYWxsaW5nIHRoZSBEZXZpY2VPcmllbnRhdGlvbiBldmVudCwgYSBcbiAgICAgICAgICAgIC8vIHJlcXVpcmUgb2YgdGhlIERldmljZU9yaWVudGF0aW9uIHNlcnZpY2Ugd2lsbCByZXN1bHQgaW4gdGhlIHJlcXVpcmUgcHJvbWlzZSBuZXZlciBiZWluZyByZXNvbHZlZFxuICAgICAgICAgICAgLy8gaGVuY2UgdGhlIEV4cGVyaW1lbnQgc3RhcnQoKSBtZXRob2QgbmV2ZXIgY2FsbGVkKVxuICAgICAgICAgICAgX3RoaXMzLl9jaGVja1RpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShfdGhpczMpO1xuICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoX3RoaXMzLnJlcXVpcmVkLm9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgX3RoaXMzLl90cnlBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RmFsbGJhY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKF90aGlzMyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEZXZpY2VPcmllbnRhdGlvbk1vZHVsZTtcbn0oX0lucHV0TW9kdWxlMy5kZWZhdWx0KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gbmV3IERldmljZU9yaWVudGF0aW9uTW9kdWxlKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa1JsZG1salpVOXlhV1Z1ZEdGMGFXOXVUVzlrZFd4bExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFoxUnZVbUZrSWl3aVpHVm5JaXdpVFdGMGFDSXNJbEJKSWl3aWNtRmtWRzlFWldjaUxDSnlZV1FpTENKdWIzSnRZV3hwZW1VaUxDSnRJaXdpWkdWMElpd2lhU0lzSW14bGJtZDBhQ0lzSW5WdWFXWjVJaXdpWlhWc1pYSkJibWRzWlNJc0ltRnNjR2hoU1hOV1lXeHBaQ0lzSWw5aGJIQm9ZU0lzSWw5aVpYUmhJaXdpWDJkaGJXMWhJaXdpWTBFaUxDSmpiM01pTENKalFpSXNJbU5ISWl3aWMwRWlMQ0p6YVc0aUxDSnpRaUlzSW5OSElpd2lZV3h3YUdFaUxDSmlaWFJoSWl3aVoyRnRiV0VpTENKaGRHRnVNaUlzSW1GemFXNGlMQ0oxYm1sbWVVRnNkQ0lzSWtSbGRtbGpaVTl5YVdWdWRHRjBhVzl1VFc5a2RXeGxJaXdpWlhabGJuUWlMQ0p2Y21sbGJuUmhkR2x2YmlJc0ltOXlhV1Z1ZEdGMGFXOXVRV3gwSWl3aWNtVnhkV2x5WldRaUxDSmZjSEp2YldselpWSmxjMjlzZG1VaUxDSmZaWE4wYVcxaGRHVmtSM0poZG1sMGVTSXNJbDl3Y205alpYTnpSblZ1WTNScGIyNGlMQ0pmY0hKdlkyVnpjeUlzSW1KcGJtUWlMQ0pmWkdWMmFXTmxiM0pwWlc1MFlYUnBiMjVEYUdWamF5SXNJbDlrWlhacFkyVnZjbWxsYm5SaGRHbHZia3hwYzNSbGJtVnlJaXdpWlNJc0ltTnNaV0Z5VkdsdFpXOTFkQ0lzSWw5amFHVmphMVJwYldWdmRYUkpaQ0lzSW1selVISnZkbWxrWldRaUxDSnlZWGRXWVd4MVpYTlFjbTkyYVdSbFpDSXNJbDkwY25sQlkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNVJtRnNiR0poWTJzaUxDSnZkWFJGZG1WdWRDSXNJbXhwYzNSbGJtVnljeUlzSW5OcGVtVWlMQ0psYldsMElpd2lYM2RsWW10cGRFTnZiWEJoYzNOSVpXRmthVzVuVW1WbVpYSmxibU5sSWl3aWQyVmlhMmwwUTI5dGNHRnpjMGhsWVdScGJtY2lMQ0p2Y3lJc0ltWmhiV2xzZVNJc0luSmxjWFZwY21WTmIyUjFiR1VpTENKMGFHVnVJaXdpWVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVNJc0ltbHpWbUZzYVdRaUxDSmpiMjV6YjJ4bElpd2liRzluSWl3aWFYTkRZV3hqZFd4aGRHVmtJaXdpY0dWeWFXOWtJaXdpWVdSa1RHbHpkR1Z1WlhJaUxDSmZZMkZzWTNWc1lYUmxRbVYwWVVGdVpFZGhiVzFoUm5KdmJVRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIa2lMQ0poYkhRaUxDSnJJaXdpWDJkWUlpd2lYMmRaSWl3aVgyZGFJaXdpYm05eWJTSXNJbk54Y25RaUxDSmtZWFJoSWl3aWNtVnpiMngyWlNJc0luZHBibVJ2ZHlJc0lrUmxkbWxqWlU5eWFXVnVkR0YwYVc5dVJYWmxiblFpTENKeVpYRjFaWE4wVUdWeWJXbHpjMmx2YmlJc0luQmxjbTFwYzNOcGIyNVRkR0YwWlNJc0ltRmtaRVYyWlc1MFRHbHpkR1Z1WlhJaUxDSnpaWFJVYVcxbGIzVjBJaXdpWTJGMFkyZ2lMQ0psY25KdmNpSmRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3p0QlFVRkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPenM3T3pzN096czdRVUZGUVRzN096czdPMEZCVFVFc1UwRkJVMEVzVVVGQlZDeERRVUZyUWtNc1IwRkJiRUlzUlVGQmRVSTdRVUZEY2tJc1UwRkJUMEVzVFVGQlRVTXNTMEZCUzBNc1JVRkJXQ3hIUVVGblFpeEhRVUYyUWp0QlFVTkVPenRCUVVWRU96czdPenM3UVVGTlFTeFRRVUZUUXl4UlFVRlVMRU5CUVd0Q1F5eEhRVUZzUWl4RlFVRjFRanRCUVVOeVFpeFRRVUZQUVN4TlFVRk5MRWRCUVU0c1IwRkJXVWdzUzBGQlMwTXNSVUZCZUVJN1FVRkRSRHM3UVVGRlJEczdPenM3TzBGQlRVRXNVMEZCVTBjc1UwRkJWQ3hEUVVGdFFrTXNRMEZCYmtJc1JVRkJjMEk3UVVGRGNFSXNUVUZCVFVNc1RVRkJUVVFzUlVGQlJTeERRVUZHTEVsQlFVOUJMRVZCUVVVc1EwRkJSaXhEUVVGUUxFZEJRV05CTEVWQlFVVXNRMEZCUml4RFFVRmtMRWRCUVhGQ1FTeEZRVUZGTEVOQlFVWXNTVUZCVDBFc1JVRkJSU3hEUVVGR0xFTkJRVkFzUjBGQlkwRXNSVUZCUlN4RFFVRkdMRU5CUVc1RExFZEJRVEJEUVN4RlFVRkZMRU5CUVVZc1NVRkJUMEVzUlVGQlJTeERRVUZHTEVOQlFWQXNSMEZCWTBFc1JVRkJSU3hEUVVGR0xFTkJRWGhFTEVkQlFTdEVRU3hGUVVGRkxFTkJRVVlzU1VGQlQwRXNSVUZCUlN4RFFVRkdMRU5CUVZBc1IwRkJZMEVzUlVGQlJTeERRVUZHTEVOQlFUZEZMRWRCUVc5R1FTeEZRVUZGTEVOQlFVWXNTVUZCVDBFc1JVRkJSU3hEUVVGR0xFTkJRVkFzUjBGQlkwRXNSVUZCUlN4RFFVRkdMRU5CUVd4SExFZEJRWGxIUVN4RlFVRkZMRU5CUVVZc1NVRkJUMEVzUlVGQlJTeERRVUZHTEVOQlFWQXNSMEZCWTBFc1JVRkJSU3hEUVVGR0xFTkJRVzVKT3p0QlFVVkJMRTlCUVVzc1NVRkJTVVVzU1VGQlNTeERRVUZpTEVWQlFXZENRU3hKUVVGSlJpeEZRVUZGUnl4TlFVRjBRaXhGUVVFNFFrUXNSMEZCT1VJN1FVRkRSVVlzVFVGQlJVVXNRMEZCUml4TFFVRlJSQ3hIUVVGU08wRkJSRVlzUjBGSFFTeFBRVUZQUkN4RFFVRlFPMEZCUTBRN08wRkJSVVE3T3pzN096czdPenRCUVZOQkxGTkJRVk5KTEV0QlFWUXNRMEZCWlVNc1ZVRkJaaXhGUVVFeVFqdEJRVU42UWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVN4TlFVRk5ReXhsUVVGblFpeFBRVUZQUkN4WFFVRlhMRU5CUVZnc1EwRkJVQ3hMUVVGNVFpeFJRVUV2UXpzN1FVRkZRU3hOUVVGTlJTeFRRVUZWUkN4bFFVRmxZaXhUUVVGVFdTeFhRVUZYTEVOQlFWZ3NRMEZCVkN4RFFVRm1MRWRCUVhsRExFTkJRWHBFTzBGQlEwRXNUVUZCVFVjc1VVRkJVV1lzVTBGQlUxa3NWMEZCVnl4RFFVRllMRU5CUVZRc1EwRkJaRHRCUVVOQkxFMUJRVTFKTEZOQlFWTm9RaXhUUVVGVFdTeFhRVUZYTEVOQlFWZ3NRMEZCVkN4RFFVRm1PenRCUVVWQkxFMUJRVTFMTEV0QlFVdG1MRXRCUVV0blFpeEhRVUZNTEVOQlFWTktMRTFCUVZRc1EwRkJXRHRCUVVOQkxFMUJRVTFMTEV0QlFVdHFRaXhMUVVGTFowSXNSMEZCVEN4RFFVRlRTQ3hMUVVGVUxFTkJRVmc3UVVGRFFTeE5RVUZOU3l4TFFVRkxiRUlzUzBGQlMyZENMRWRCUVV3c1EwRkJVMFlzVFVGQlZDeERRVUZZTzBGQlEwRXNUVUZCVFVzc1MwRkJTMjVDTEV0QlFVdHZRaXhIUVVGTUxFTkJRVk5TTEUxQlFWUXNRMEZCV0R0QlFVTkJMRTFCUVUxVExFdEJRVXR5UWl4TFFVRkxiMElzUjBGQlRDeERRVUZUVUN4TFFVRlVMRU5CUVZnN1FVRkRRU3hOUVVGTlV5eExRVUZMZEVJc1MwRkJTMjlDTEVkQlFVd3NRMEZCVTA0c1RVRkJWQ3hEUVVGWU96dEJRVVZCTEUxQlFVbFRMR05CUVVvN1FVRkJRU3hOUVVGWFF5eGhRVUZZTzBGQlFVRXNUVUZCYVVKRExHTkJRV3BDT3p0QlFVVkJMRTFCUVVsd1FpeEpRVUZKTEVOQlEwNVZMRXRCUVV0SExFVkJRVXdzUjBGQlZVTXNTMEZCUzBVc1JVRkJUQ3hIUVVGVlF5eEZRVVJrTEVWQlJVNHNRMEZCUTB3c1JVRkJSQ3hIUVVGTlJTeEZRVVpCTEVWQlIwNUtMRXRCUVV0UExFVkJRVXdzUjBGQlZVb3NTMEZCUzBNc1JVRkJUQ3hIUVVGVlJTeEZRVWhrTEVWQlNVNUlMRXRCUVV0RExFVkJRVXdzUjBGQlZVb3NTMEZCUzAwc1JVRkJUQ3hIUVVGVlF5eEZRVXBrTEVWQlMwNVFMRXRCUVV0RkxFVkJURU1zUlVGTlRrVXNTMEZCUzBjc1JVRkJUQ3hIUVVGVlVDeExRVUZMUnl4RlFVRk1MRWRCUVZWSExFVkJUbVFzUlVGUFRpeERRVUZEU2l4RlFVRkVMRWRCUVUxTExFVkJVRUVzUlVGUlRrUXNSVUZTVFN4RlFWTk9TaXhMUVVGTFF5eEZRVlJETEVOQlFWSTdRVUZYUVdRc1dVRkJWVU1zUTBGQlZqczdRVUZGUVR0QlFVTkJMRTFCUVVsQkxFVkJRVVVzUTBGQlJpeEpRVUZQTEVOQlFWZ3NSVUZCWXp0QlFVTmFPMEZCUTBFN1FVRkRRV3RDTEZsQlFWRjJRaXhMUVVGTE1FSXNTMEZCVEN4RFFVRlhMRU5CUVVOeVFpeEZRVUZGTEVOQlFVWXNRMEZCV2l4RlFVRnJRa0VzUlVGQlJTeERRVUZHTEVOQlFXeENMRU5CUVZJN1FVRkRRVzFDTEZkQlFVOTRRaXhMUVVGTE1rSXNTVUZCVEN4RFFVRlZkRUlzUlVGQlJTeERRVUZHTEVOQlFWWXNRMEZCVUN4RFFVcFpMRU5CU1ZrN1FVRkRlRUp2UWl4WlFVRlJla0lzUzBGQlN6QkNMRXRCUVV3c1EwRkJWeXhEUVVGRGNrSXNSVUZCUlN4RFFVRkdMRU5CUVZvc1JVRkJhMEpCTEVWQlFVVXNRMEZCUml4RFFVRnNRaXhEUVVGU08wRkJRMFFzUjBGT1JDeE5RVTFQTEVsQlFVbEJMRVZCUVVVc1EwRkJSaXhKUVVGUExFTkJRVmdzUlVGQll6dEJRVU51UWp0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CYTBJc1dVRkJVWFpDTEV0QlFVc3dRaXhMUVVGTUxFTkJRVmR5UWl4RlFVRkZMRU5CUVVZc1EwRkJXQ3hGUVVGcFFpeERRVUZEUVN4RlFVRkZMRU5CUVVZc1EwRkJiRUlzUTBGQlVqdEJRVU5CYlVJc1YwRkJUeXhEUVVGRGVFSXNTMEZCU3pKQ0xFbEJRVXdzUTBGQlZYUkNMRVZCUVVVc1EwRkJSaXhEUVVGV0xFTkJRVkk3UVVGRFFXMUNMRmxCUVZOQkxGRkJRVkVzUTBGQlZDeEhRVUZqTEVOQlFVTjRRaXhMUVVGTFF5eEZRVUZ3UWl4SFFVRjVRa1FzUzBGQlMwTXNSVUZCZEVNc1EwRlViVUlzUTBGVGRVSTdRVUZETVVOM1FpeFpRVUZSZWtJc1MwRkJTekJDTEV0QlFVd3NRMEZCVjNKQ0xFVkJRVVVzUTBGQlJpeERRVUZZTEVWQlFXbENMRU5CUVVOQkxFVkJRVVVzUTBGQlJpeERRVUZzUWl4RFFVRlNMRU5CVm0xQ0xFTkJWV003UVVGRGJFTXNSMEZZVFN4TlFWZEJPMEZCUTB3N1FVRkRRU3hSUVVGSlFTeEZRVUZGTEVOQlFVWXNTVUZCVHl4RFFVRllMRVZCUVdNN1FVRkRXanRCUVVOQk8wRkJRMEU3UVVGRFFXdENMR05CUVZGMlFpeExRVUZMTUVJc1MwRkJUQ3hEUVVGWExFTkJRVU55UWl4RlFVRkZMRU5CUVVZc1EwRkJXaXhGUVVGclFrRXNSVUZCUlN4RFFVRkdMRU5CUVd4Q0xFTkJRVkk3UVVGRFFXMUNMR0ZCUVU5NFFpeExRVUZMTWtJc1NVRkJUQ3hEUVVGVmRFSXNSVUZCUlN4RFFVRkdMRU5CUVZZc1EwRkJVQ3hEUVV4WkxFTkJTMWs3UVVGRGVFSnZRaXhqUVVGUkxFTkJRVU42UWl4TFFVRkxReXhGUVVGT0xFZEJRVmNzUTBGQmJrSTdRVUZEUkN4TFFWQkVMRTFCVDA4c1NVRkJTVWtzUlVGQlJTeERRVUZHTEVsQlFVOHNRMEZCV0N4RlFVRmpPMEZCUTI1Q08wRkJRMEU3UVVGRFFUdEJRVU5CYTBJc1kwRkJVWFpDTEV0QlFVc3dRaXhMUVVGTUxFTkJRVmR5UWl4RlFVRkZMRU5CUVVZc1EwRkJXQ3hGUVVGcFFpeERRVUZEUVN4RlFVRkZMRU5CUVVZc1EwRkJiRUlzUTBGQlVpeERRVXB0UWl4RFFVbGpPMEZCUTJwRGJVSXNZVUZCVHl4RFFVRkRlRUlzUzBGQlN6SkNMRWxCUVV3c1EwRkJWWFJDTEVWQlFVVXNRMEZCUml4RFFVRldMRU5CUVZJN1FVRkRRVzFDTEdOQlFWTkJMRkZCUVZFc1EwRkJWQ3hIUVVGakxFTkJRVU40UWl4TFFVRkxReXhGUVVGd1FpeEhRVUY1UWtRc1MwRkJTME1zUlVGQmRFTXNRMEZPYlVJc1EwRk5kVUk3UVVGRE1VTjNRaXhqUVVGUkxFTkJRVU42UWl4TFFVRkxReXhGUVVGT0xFZEJRVmNzUTBGQmJrSTdRVUZEUkN4TFFWSk5MRTFCVVVFN1FVRkRURHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBGelFpeGpRVUZSZGtJc1MwRkJTekJDTEV0QlFVd3NRMEZCVjNKQ0xFVkJRVVVzUTBGQlJpeERRVUZZTEVWQlFXbENRU3hGUVVGRkxFTkJRVVlzUTBGQmFrSXNRMEZCVWp0QlFVTkJiVUlzWVVGQlVXNUNMRVZCUVVVc1EwRkJSaXhKUVVGUExFTkJRVklzUjBGQllVd3NTMEZCUzBNc1JVRkJUQ3hIUVVGVkxFTkJRWFpDTEVkQlFUSkNMRU5CUVVORUxFdEJRVXRETEVWQlFVNHNSMEZCVnl4RFFVRTNRenRCUVVOQmQwSXNZMEZCVVN4RFFVRlNPMEZCUTBRN1FVRkRSanM3UVVGRlJEdEJRVU5CUml4WFFVRlZRU3hSUVVGUkxFTkJRVlFzUjBGQll5eEpRVUZKZGtJc1MwRkJTME1zUlVGQmRrSXNSMEZCTkVJc1EwRkJja003TzBGQlJVRlRMR0ZCUVZjc1EwRkJXQ3hKUVVGcFFrTXNaVUZCWlZRc1UwRkJVM0ZDTEV0QlFWUXNRMEZCWml4SFFVRnBReXhKUVVGc1JEdEJRVU5CWWl4aFFVRlhMRU5CUVZnc1NVRkJaMEpTTEZOQlFWTnpRaXhKUVVGVUxFTkJRV2hDTzBGQlEwRmtMR0ZCUVZjc1EwRkJXQ3hKUVVGblFsSXNVMEZCVTNWQ0xFdEJRVlFzUTBGQmFFSTdRVUZEUkRzN1FVRkZSRHM3T3pzN096czdRVUZSUVN4VFFVRlRSeXhSUVVGVUxFTkJRV3RDYkVJc1ZVRkJiRUlzUlVGQk9FSTdRVUZETlVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRXNUVUZCVFVNc1pVRkJaMElzVDBGQlQwUXNWMEZCVnl4RFFVRllMRU5CUVZBc1MwRkJlVUlzVVVGQkwwTTdPMEZCUlVFc1RVRkJUVVVzVTBGQlZVUXNaVUZCWldJc1UwRkJVMWtzVjBGQlZ5eERRVUZZTEVOQlFWUXNRMEZCWml4SFFVRjVReXhEUVVGNlJEdEJRVU5CTEUxQlFVMUhMRkZCUVZGbUxGTkJRVk5aTEZkQlFWY3NRMEZCV0N4RFFVRlVMRU5CUVdRN1FVRkRRU3hOUVVGTlNTeFRRVUZUYUVJc1UwRkJVMWtzVjBGQlZ5eERRVUZZTEVOQlFWUXNRMEZCWmpzN1FVRkZRU3hOUVVGTlN5eExRVUZMWml4TFFVRkxaMElzUjBGQlRDeERRVUZUU2l4TlFVRlVMRU5CUVZnN1FVRkRRU3hOUVVGTlN5eExRVUZMYWtJc1MwRkJTMmRDTEVkQlFVd3NRMEZCVTBnc1MwRkJWQ3hEUVVGWU8wRkJRMEVzVFVGQlRVc3NTMEZCUzJ4Q0xFdEJRVXRuUWl4SFFVRk1MRU5CUVZOR0xFMUJRVlFzUTBGQldEdEJRVU5CTEUxQlFVMUxMRXRCUVV0dVFpeExRVUZMYjBJc1IwRkJUQ3hEUVVGVFVpeE5RVUZVTEVOQlFWZzdRVUZEUVN4TlFVRk5VeXhMUVVGTGNrSXNTMEZCUzI5Q0xFZEJRVXdzUTBGQlUxQXNTMEZCVkN4RFFVRllPMEZCUTBFc1RVRkJUVk1zUzBGQlMzUkNMRXRCUVV0dlFpeEhRVUZNTEVOQlFWTk9MRTFCUVZRc1EwRkJXRHM3UVVGRlFTeE5RVUZKVXl4alFVRktPMEZCUVVFc1RVRkJWME1zWVVGQldEdEJRVUZCTEUxQlFXbENReXhqUVVGcVFqczdRVUZGUVN4TlFVRkpjRUlzU1VGQlNTeERRVU5PVlN4TFFVRkxSeXhGUVVGTUxFZEJRVlZETEV0QlFVdEZMRVZCUVV3c1IwRkJWVU1zUlVGRVpDeEZRVVZPTEVOQlFVTk1MRVZCUVVRc1IwRkJUVVVzUlVGR1FTeEZRVWRPU2l4TFFVRkxUeXhGUVVGTUxFZEJRVlZLTEV0QlFVdERMRVZCUVV3c1IwRkJWVVVzUlVGSVpDeEZRVWxPU0N4TFFVRkxReXhGUVVGTUxFZEJRVlZLTEV0QlFVdE5MRVZCUVV3c1IwRkJWVU1zUlVGS1pDeEZRVXRPVUN4TFFVRkxSU3hGUVV4RExFVkJUVTVGTEV0QlFVdEhMRVZCUVV3c1IwRkJWVkFzUzBGQlMwY3NSVUZCVEN4SFFVRlZSeXhGUVU1a0xFVkJUMDRzUTBGQlEwb3NSVUZCUkN4SFFVRk5TeXhGUVZCQkxFVkJVVTVFTEVWQlVrMHNSVUZUVGtvc1MwRkJTME1zUlVGVVF5eERRVUZTTzBGQlYwRmtMRmxCUVZWRExFTkJRVlk3TzBGQlJVRnJRaXhWUVVGUmRrSXNTMEZCU3pCQ0xFdEJRVXdzUTBGQlZ5eERRVUZEY2tJc1JVRkJSU3hEUVVGR0xFTkJRVm9zUlVGQmEwSkJMRVZCUVVVc1EwRkJSaXhEUVVGc1FpeERRVUZTTzBGQlEwRnJRaXhYUVVGVlFTeFJRVUZSTEVOQlFWUXNSMEZCWXl4SlFVRkpka0lzUzBGQlMwTXNSVUZCZGtJc1IwRkJORUlzUTBGQmNrTXNRMEZ1UXpSQ0xFTkJiVU5aTzBGQlEzaERkVUlzVTBGQlQzaENMRXRCUVVzeVFpeEpRVUZNTEVOQlFWVjBRaXhGUVVGRkxFTkJRVVlzUTBGQlZpeERRVUZRTEVOQmNFTTBRaXhEUVc5RFNqdEJRVU40UW05Q0xGVkJRVkY2UWl4TFFVRkxNRUlzUzBGQlRDeERRVUZYTEVOQlFVTnlRaXhGUVVGRkxFTkJRVVlzUTBGQldpeEZRVUZyUWtFc1JVRkJSU3hEUVVGR0xFTkJRV3hDTEVOQlFWSXNRMEZ5UXpSQ0xFTkJjVU5MT3p0QlFVVnFRMHNzWVVGQlZ5eERRVUZZTEVsQlFXbENReXhsUVVGbFZDeFRRVUZUY1VJc1MwRkJWQ3hEUVVGbUxFZEJRV2xETEVsQlFXeEVPMEZCUTBGaUxHRkJRVmNzUTBGQldDeEpRVUZuUWxJc1UwRkJVM05DTEVsQlFWUXNRMEZCYUVJN1FVRkRRV1FzWVVGQlZ5eERRVUZZTEVsQlFXZENVaXhUUVVGVGRVSXNTMEZCVkN4RFFVRm9RanRCUVVORU96dEJRVVZFT3pzN096czdPenM3T3pzN096czdPenM3T3pzN096dEpRWE5DVFVrc2RVSTdPenRCUVVWS096czdPenRCUVV0QkxIRkRRVUZqTzBGQlFVRTdPMEZCUjFvN096czdPenM3UVVGSVdTeHJTa0ZEVGl4dFFrRkVUVHM3UVVGVldpeFZRVUZMUXl4TFFVRk1MRWRCUVdFc1EwRkJReXhKUVVGRUxFVkJRVThzU1VGQlVDeEZRVUZoTEVsQlFXSXNRMEZCWWpzN1FVRkZRVHM3T3pzN096czdPMEZCVTBFc1ZVRkJTME1zVjBGQlRDeEhRVUZ0UWl4MVEwRkJORUlzWVVGQk5VSXNRMEZCYmtJN08wRkJSVUU3T3pzN096czdPMEZCVVVFc1ZVRkJTME1zWTBGQlRDeEhRVUZ6UWl4MVEwRkJORUlzWjBKQlFUVkNMRU5CUVhSQ096dEJRVVZCT3pzN096czdPenRCUVZGQkxGVkJRVXRETEZGQlFVd3NSMEZCWjBJN1FVRkRaRVlzYlVKQlFXRXNTMEZFUXp0QlFVVmtReXh6UWtGQlowSTdRVUZHUml4TFFVRm9RanM3UVVGTFFUczdPenM3T3pzN1FVRlJRU3hWUVVGTFJTeGxRVUZNTEVkQlFYVkNMRWxCUVhaQ096dEJRVVZCT3pzN096czdPMEZCVDBFc1ZVRkJTME1zYVVKQlFVd3NSMEZCZVVJc1EwRkJReXhEUVVGRUxFVkJRVWtzUTBGQlNpeEZRVUZQTEVOQlFWQXNRMEZCZWtJN08wRkJSVUVzVlVGQlMwTXNaMEpCUVV3c1IwRkJkMElzU1VGQmVFSTdRVUZEUVN4VlFVRkxReXhSUVVGTUxFZEJRV2RDTEUxQlFVdEJMRkZCUVV3c1EwRkJZME1zU1VGQlpDeFBRVUZvUWp0QlFVTkJMRlZCUVV0RExIVkNRVUZNTEVkQlFTdENMRTFCUVV0QkxIVkNRVUZNTEVOQlFUWkNSQ3hKUVVFM1FpeFBRVUV2UWp0QlFVTkJMRlZCUVV0RkxEQkNRVUZNTEVkQlFXdERMRTFCUVV0QkxEQkNRVUZNTEVOQlFXZERSaXhKUVVGb1F5eFBRVUZzUXp0QlFYQkZXVHRCUVhGRllqczdRVUZGUkRzN096czdPenM3T3pzN096czdORU5CVlhkQ1J5eERMRVZCUVVjN1FVRkRla0k3UVVGRFFUdEJRVU5CUXl4dFFrRkJZU3hMUVVGTFF5eGxRVUZzUWpzN1FVRkZRU3hYUVVGTFF5eFZRVUZNTEVkQlFXdENMRWxCUVd4Q096dEJRVVZCTzBGQlEwRXNWVUZCVFVNc2IwSkJRWE5DTEU5QlFVOUtMRVZCUVVWc1FpeExRVUZVTEV0QlFXMUNMRkZCUVhCQ0xFbEJRV3RETEU5QlFVOXJRaXhGUVVGRmFrSXNTVUZCVkN4TFFVRnJRaXhSUVVGd1JDeEpRVUZyUlN4UFFVRlBhVUlzUlVGQlJXaENMRXRCUVZRc1MwRkJiVUlzVVVGQmFFZzdRVUZEUVN4WFFVRkxUU3hYUVVGTUxFTkJRV2xDWVN4VlFVRnFRaXhIUVVFNFFrTXNhVUpCUVRsQ08wRkJRMEVzVjBGQlMySXNZMEZCVEN4RFFVRnZRbGtzVlVGQmNFSXNSMEZCYVVORExHbENRVUZxUXpzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTEZkQlFVdFVMR2RDUVVGTUxFZEJRWGRDTEV0QlFVdEpMREJDUVVFM1FqczdRVUZGUVR0QlFVTkJPMEZCUTBFc1ZVRkJTeXhMUVVGTFVDeFJRVUZNTEVOQlFXTkdMRmRCUVdRc1NVRkJOa0lzUTBGQlF5eExRVUZMUVN4WFFVRk1MRU5CUVdsQ1lTeFZRVUZvUkN4SlFVRm5SU3hMUVVGTFdDeFJRVUZNTEVOQlFXTkVMR05CUVdRc1NVRkJaME1zUTBGQlF5eExRVUZMUVN4alFVRk1MRU5CUVc5Q1dTeFZRVUY2U0N4RlFVTkZMRXRCUVV0RkxIZERRVUZNTEVkQlJFWXNTMEZIUlN4TFFVRkxXaXhsUVVGTUxFTkJRWEZDTEVsQlFYSkNPMEZCUTBnN08wRkJSVVE3T3pzN096czdPenM3T3l0RFFWRXlRazhzUXl4RlFVRkhPMEZCUXpWQ08wRkJRMEVzVlVGQlNVMHNWMEZCVnl4TFFVRkxha0lzUzBGQmNFSTdPMEZCUlVGcFFpeGxRVUZUTEVOQlFWUXNTVUZCWTA0c1JVRkJSV3hDTEV0QlFXaENPMEZCUTBGM1FpeGxRVUZUTEVOQlFWUXNTVUZCWTA0c1JVRkJSV3BDTEVsQlFXaENPMEZCUTBGMVFpeGxRVUZUTEVOQlFWUXNTVUZCWTA0c1JVRkJSV2hDTEV0QlFXaENPenRCUVVWQkxGVkJRVWtzUzBGQlMzVkNMRk5CUVV3c1EwRkJaVU1zU1VGQlppeEhRVUZ6UWl4RFFVRXhRaXhGUVVORkxFdEJRVXRETEVsQlFVd3NRMEZCVlVnc1VVRkJWanM3UVVGRlJqdEJRVU5CTEZWQlFVa3NTMEZCUzJoQ0xGZEJRVXdzUTBGQmFVSnBRaXhUUVVGcVFpeERRVUV5UWtNc1NVRkJNMElzUjBGQmEwTXNRMEZCYkVNc1NVRkRRU3hMUVVGTGFFSXNVVUZCVEN4RFFVRmpSaXhYUVVSa0xFbEJSVUVzUzBGQlMwRXNWMEZCVEN4RFFVRnBRbUVzVlVGR2NrSXNSVUZIUlR0QlFVTkJPMEZCUTBFN1FVRkRRU3haUVVGSkxFTkJRVU1zUzBGQlMySXNWMEZCVEN4RFFVRnBRbTlDTERoQ1FVRnNRaXhKUVVGdlJGWXNSVUZCUlZjc2IwSkJRWFJFTEVsQlFUaEZMRzFDUVVGVFF5eEZRVUZVTEVOQlFWbERMRTFCUVZvc1MwRkJkVUlzUzBGQmVrY3NSVUZEUlN4TFFVRkxka0lzVjBGQlRDeERRVUZwUW05Q0xEaENRVUZxUWl4SFFVRnJSRllzUlVGQlJWY3NiMEpCUVhCRU96dEJRVVZHTEZsQlFVbE1MRmxCUVZjc1MwRkJTMmhDTEZkQlFVd3NRMEZCYVVKRUxFdEJRV2hET3p0QlFVVkJhVUlzYTBKQlFWTXNRMEZCVkN4SlFVRmpUaXhGUVVGRmJFSXNTMEZCYUVJN1FVRkRRWGRDTEd0Q1FVRlRMRU5CUVZRc1NVRkJZMDRzUlVGQlJXcENMRWxCUVdoQ08wRkJRMEYxUWl4clFrRkJVeXhEUVVGVUxFbEJRV05PTEVWQlFVVm9RaXhMUVVGb1FqczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJTU3hMUVVGTFRTeFhRVUZNTEVOQlFXbENiMElzT0VKQlFXcENMRWxCUVcxRUxHMUNRVUZUUlN4RlFVRlVMRU5CUVZsRExFMUJRVm9zUzBGQmRVSXNTMEZCT1VVc1JVRkJjVVk3UVVGRGJrWlFMRzlDUVVGVExFTkJRVlFzUzBGQlpTeE5RVUZOTEV0QlFVdG9RaXhYUVVGTUxFTkJRV2xDYjBJc09FSkJRWFJETzBGQlEwRXhReXhuUWtGQlRYTkRMRk5CUVU0N1FVRkRSRHM3UVVGRlJDeGhRVUZMYUVJc1YwRkJUQ3hEUVVGcFFtMUNMRWxCUVdwQ0xFTkJRWE5DU0N4VFFVRjBRanRCUVVORU96dEJRVVZFTzBGQlEwRXNWVUZCU1N4TFFVRkxaaXhqUVVGTUxFTkJRVzlDWjBJc1UwRkJjRUlzUTBGQk9FSkRMRWxCUVRsQ0xFZEJRWEZETEVOQlFYSkRMRWxCUTBFc1MwRkJTMmhDTEZGQlFVd3NRMEZCWTBRc1kwRkVaQ3hKUVVWQkxFdEJRVXRCTEdOQlFVd3NRMEZCYjBKWkxGVkJSbmhDTEVWQlIwVTdRVUZEUVR0QlFVTkJPMEZCUTBFc1dVRkJTU3hEUVVGRExFdEJRVXRhTEdOQlFVd3NRMEZCYjBKdFFpdzRRa0ZCY2tJc1NVRkJkVVJXTEVWQlFVVlhMRzlDUVVGNlJDeEpRVUZwUml4dFFrRkJVME1zUlVGQlZDeERRVUZaUXl4TlFVRmFMRXRCUVhWQ0xFdEJRVFZITEVWQlEwVXNTMEZCUzNSQ0xHTkJRVXdzUTBGQmIwSnRRaXc0UWtGQmNFSXNSMEZCY1VSV0xFVkJRVVZYTEc5Q1FVRjJSRHM3UVVGRlJpeFpRVUZKVEN4aFFVRlhMRXRCUVV0bUxHTkJRVXdzUTBGQmIwSkdMRXRCUVc1RE96dEJRVVZCYVVJc2JVSkJRVk1zUTBGQlZDeEpRVUZqVGl4RlFVRkZiRUlzUzBGQmFFSTdRVUZEUVhkQ0xHMUNRVUZUTEVOQlFWUXNTVUZCWTA0c1JVRkJSV3BDTEVsQlFXaENPMEZCUTBGMVFpeHRRa0ZCVXl4RFFVRlVMRWxCUVdOT0xFVkJRVVZvUWl4TFFVRm9RanM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCU1N4TFFVRkxUeXhqUVVGTUxFTkJRVzlDYlVJc09FSkJRWEJDTEVsQlFYTkVMRzFDUVVGVFJTeEZRVUZVTEVOQlFWbERMRTFCUVZvc1MwRkJkVUlzUzBGQmFrWXNSVUZCZFVZN1FVRkRja1pRTEhGQ1FVRlRMRU5CUVZRc1MwRkJaU3hMUVVGTFppeGpRVUZNTEVOQlFXOUNiVUlzT0VKQlFXNURPMEZCUTBGS0xIRkNRVUZUTEVOQlFWUXNTMEZCWjBKQkxGZEJRVk1zUTBGQlZDeEpRVUZqTEVOQlFXWXNSMEZCYjBJc1IwRkJjRUlzUjBGQk1FSXNRMEZCZWtNc1EwRkdjVVlzUTBGRmVrTTdRVUZETjBNN08wRkJSVVE3UVVGRFFUdEJRVU5CTEZsQlFVa3NiVUpCUVZOTkxFVkJRVlFzUTBGQldVTXNUVUZCV2l4TFFVRjFRaXhUUVVFelFpeEZRVU5GTVVJc1UwRkJVMjFDTEZWQlFWUTdPMEZCUlVZc1lVRkJTMllzWTBGQlRDeERRVUZ2UW10Q0xFbEJRWEJDTEVOQlFYbENTQ3hWUVVGNlFqdEJRVU5FTzBGQlEwWTdPMEZCUlVRN096czdPenNyUkVGSE1rTTdRVUZCUVRzN1FVRkRla01zTkVKQlFWbFJMR0ZCUVZvc1EwRkJNRUlzT0VKQlFURkNMRVZCUTBkRExFbEJSRWdzUTBGRFVTeFZRVUZEUXl3MFFrRkJSQ3hGUVVGclF6dEJRVU4wUXl4WlFVRkpRU3cyUWtGQk5rSkRMRTlCUVdwRExFVkJRVEJETzBGQlEzaERReXhyUWtGQlVVTXNSMEZCVWl4RFFVRlpMR2xWUVVGYU96dEJRVVZCTEdOQlFVa3NUMEZCU3pOQ0xGRkJRVXdzUTBGQlkwWXNWMEZCYkVJc1JVRkJLMEk3UVVGRE4wSXNiVUpCUVV0QkxGZEJRVXdzUTBGQmFVSTRRaXhaUVVGcVFpeEhRVUZuUXl4SlFVRm9RenRCUVVOQkxHMUNRVUZMT1VJc1YwRkJUQ3hEUVVGcFFpdENMRTFCUVdwQ0xFZEJRVEJDVEN3MlFrRkJOa0pMTEUxQlFYWkVPenRCUVVWQkxHdERRVUZaUXl4WFFVRmFMRU5CUVhkQ0xEaENRVUY0UWl4RlFVRjNSQ3hWUVVGRFRpdzBRa0ZCUkN4RlFVRnJRenRCUVVONFJpeHhRa0ZCUzA4c2MwUkJRVXdzUTBGQk5FUlFMRFJDUVVFMVJEdEJRVU5FTEdGQlJrUTdRVUZIUkRzN1FVRkZSQ3hqUVVGSkxFOUJRVXQ0UWl4UlFVRk1MRU5CUVdORUxHTkJRV3hDTEVWQlFXdERPMEZCUTJoRExHMUNRVUZMUVN4alFVRk1MRU5CUVc5Q05rSXNXVUZCY0VJc1IwRkJiVU1zU1VGQmJrTTdRVUZEUVN4dFFrRkJTemRDTEdOQlFVd3NRMEZCYjBJNFFpeE5RVUZ3UWl4SFFVRTJRa3dzTmtKQlFUWkNTeXhOUVVFeFJEczdRVUZGUVN4clEwRkJXVU1zVjBGQldpeERRVUYzUWl3NFFrRkJlRUlzUlVGQmQwUXNWVUZCUTA0c05FSkJRVVFzUlVGQmEwTTdRVUZEZUVZc2NVSkJRVXRQTEhORVFVRk1MRU5CUVRSRVVDdzBRa0ZCTlVRc1JVRkJNRVlzU1VGQk1VWTdRVUZEUkN4aFFVWkVPMEZCUjBRN1FVRkRSanM3UVVGRlJDeGxRVUZMZGtJc1pVRkJURHRCUVVORUxFOUJla0pJTzBGQk1FSkVPenRCUVVWRU96czdPenM3T3pzN01rVkJUWFZFZFVJc05FSXNSVUZCTWtNN1FVRkJRU3hWUVVGaVVTeEhRVUZoTEhWRlFVRlFMRXRCUVU4N08wRkJRMmhITEZWQlFVMURMRWxCUVVrc1IwRkJWanM3UVVGRlFUdEJRVU5CTEZkQlFVc3ZRaXhwUWtGQlRDeERRVUYxUWl4RFFVRjJRaXhKUVVFMFFpdENMRWxCUVVrc1MwRkJTeTlDTEdsQ1FVRk1MRU5CUVhWQ0xFTkJRWFpDTEVOQlFVb3NSMEZCWjBNc1EwRkJReXhKUVVGSkswSXNRMEZCVEN4SlFVRlZWQ3cyUWtGQk5rSXNRMEZCTjBJc1EwRkJkRVU3UVVGRFFTeFhRVUZMZEVJc2FVSkJRVXdzUTBGQmRVSXNRMEZCZGtJc1NVRkJORUlyUWl4SlFVRkpMRXRCUVVzdlFpeHBRa0ZCVEN4RFFVRjFRaXhEUVVGMlFpeERRVUZLTEVkQlFXZERMRU5CUVVNc1NVRkJTU3RDTEVOQlFVd3NTVUZCVlZRc05rSkJRVFpDTEVOQlFUZENMRU5CUVhSRk8wRkJRMEVzVjBGQlMzUkNMR2xDUVVGTUxFTkJRWFZDTEVOQlFYWkNMRWxCUVRSQ0swSXNTVUZCU1N4TFFVRkxMMElzYVVKQlFVd3NRMEZCZFVJc1EwRkJka0lzUTBGQlNpeEhRVUZuUXl4RFFVRkRMRWxCUVVrclFpeERRVUZNTEVsQlFWVlVMRFpDUVVFMlFpeERRVUUzUWl4RFFVRjBSVHM3UVVGRlFTeFZRVUZKVlN4TlFVRk5MRXRCUVV0b1F5eHBRa0ZCVEN4RFFVRjFRaXhEUVVGMlFpeERRVUZXTzBGQlEwRXNWVUZCU1dsRExFMUJRVTBzUzBGQlMycERMR2xDUVVGTUxFTkJRWFZDTEVOQlFYWkNMRU5CUVZZN1FVRkRRU3hWUVVGSmEwTXNUVUZCVFN4TFFVRkxiRU1zYVVKQlFVd3NRMEZCZFVJc1EwRkJka0lzUTBGQlZqczdRVUZGUVN4VlFVRk5iVU1zVDBGQlQzUkZMRXRCUVV0MVJTeEpRVUZNTEVOQlFWVktMRTFCUVUxQkxFZEJRVTRzUjBGQldVTXNUVUZCVFVFc1IwRkJiRUlzUjBGQmQwSkRMRTFCUVUxQkxFZEJRWGhETEVOQlFXSTdPMEZCUlVGR0xHRkJRVTlITEVsQlFWQTdRVUZEUVVZc1lVRkJUMFVzU1VGQlVEdEJRVU5CUkN4aFFVRlBReXhKUVVGUU96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3hWUVVGSk9VTXNUMEZCVDNSQ0xGTkJRVk5HTEV0QlFVc3lRaXhKUVVGTUxFTkJRVlY1UXl4SFFVRldMRU5CUVZRc1EwRkJXQ3hEUVhoRFowY3NRMEYzUXpORU8wRkJRM0pETEZWQlFVa3pReXhSUVVGUmRrSXNVMEZCVTBZc1MwRkJTekJDTEV0QlFVd3NRMEZCVnl4RFFVRkRlVU1zUjBGQldpeEZRVUZwUWtVc1IwRkJha0lzUTBGQlZDeERRVUZhTEVOQmVrTm5SeXhEUVhsRGJrUTdPMEZCUlRkRExGVkJRVWxLTEVkQlFVb3NSVUZCVXp0QlFVTlFPMEZCUTBFc1dVRkJTV3hDTEZkQlFWY3NTMEZCUzJZc1kwRkJUQ3hEUVVGdlFrWXNTMEZCYmtNN1FVRkRRV2xDTEdsQ1FVRlRMRU5CUVZRc1NVRkJZeXhKUVVGa08wRkJRMEZCTEdsQ1FVRlRMRU5CUVZRc1NVRkJZM1pDTEVsQlFXUTdRVUZEUVhWQ0xHbENRVUZUTEVOQlFWUXNTVUZCWTNSQ0xFdEJRV1E3TzBGQlJVRXNZVUZCUzA4c1kwRkJUQ3hEUVVGdlFtdENMRWxCUVhCQ0xFTkJRWGxDU0N4UlFVRjZRanRCUVVORUxFOUJVa1FzVFVGUlR6dEJRVU5NTzBGQlEwRXNXVUZCU1VFc1lVRkJWeXhMUVVGTGFFSXNWMEZCVEN4RFFVRnBRa1FzUzBGQmFFTTdRVUZEUVdsQ0xHMUNRVUZUTEVOQlFWUXNTVUZCWXl4SlFVRmtPMEZCUTBGQkxHMUNRVUZUTEVOQlFWUXNTVUZCWTNaQ0xFbEJRV1E3UVVGRFFYVkNMRzFDUVVGVExFTkJRVlFzU1VGQlkzUkNMRXRCUVdRN1FVRkRRV2hDTEdOQlFVMXpReXhWUVVGT096dEJRVVZCTEdGQlFVdG9RaXhYUVVGTUxFTkJRV2xDYlVJc1NVRkJha0lzUTBGQmMwSklMRlZCUVhSQ08wRkJRMFE3UVVGRFJqczdPelpDUVVWUmVVSXNTU3hGUVVGTk8wRkJRMklzVjBGQlMzQkRMR2RDUVVGTUxFTkJRWE5DYjBNc1NVRkJkRUk3UVVGRFJEczdRVUZGUkRzN096czdPenM3TWtKQlMwODdRVUZCUVRzN1FVRkRUQ3h2U2tGQmEwSXNWVUZCUTBNc1QwRkJSQ3hGUVVGaE8wRkJRemRDTEdWQlFVdDJReXhsUVVGTUxFZEJRWFZDZFVNc1QwRkJka0k3TzBGQlJVRXNXVUZCU1VNc1QwRkJUME1zYzBKQlFWZ3NSVUZCYlVNN1FVRkRha01zYVVKQlFVdDJReXhuUWtGQlRDeEhRVUYzUWl4UFFVRkxSeXgxUWtGQk4wSTdRVUZEUVR0QlFVTkJMR05CUVVrc1QwRkJUMjlETEhWQ1FVRjFRa01zYVVKQlFUbENMRXRCUVc5RUxGVkJRWGhFTEVWQlFXOUZPMEZCUTJ4RlJDeHRRMEZCZFVKRExHbENRVUYyUWl4SFFVTkhjRUlzU1VGRVNDeERRVU5STERKQ1FVRnRRanRCUVVOMlFpeHJRa0ZCU1hGQ0xHOUNRVUZ2UWl4VFFVRjRRaXhGUVVGdFF6dEJRVU5xUTBnc2RVSkJRVTlKTEdkQ1FVRlFMRU5CUVhkQ0xHMUNRVUY0UWl4RlFVRTJReXhQUVVGTGVrTXNVVUZCYkVRc1JVRkJORVFzUzBGQk5VUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3gxUWtGQlMwMHNaVUZCVEN4SFFVRjFRbTlETEZkQlFWYzdRVUZCUVN4NVFrRkJUVTRzWlVGQlRqdEJRVUZCTEdsQ1FVRllMRVZCUVdkRExFZEJRV2hETEVOQlFYWkNPMEZCUTBRN1FVRkRSaXhoUVZSSUxFVkJWVWRQTEV0QlZrZ3NRMEZWVTNKQ0xGRkJRVkZ6UWl4TFFWWnFRanRCUVZkRUxGZEJXa1FzVFVGWlR6dEJRVU5NTzBGQlEwRlFMRzFDUVVGUFNTeG5Ra0ZCVUN4RFFVRjNRaXh0UWtGQmVFSXNSVUZCTmtNc1QwRkJTM3BETEZGQlFXeEVMRVZCUVRSRUxFdEJRVFZFTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc2JVSkJRVXROTEdWQlFVd3NSMEZCZFVKdlF5eFhRVUZYTzBGQlFVRXNjVUpCUVUxT0xHVkJRVTQ3UVVGQlFTeGhRVUZZTEVWQlFXZERMRWRCUVdoRExFTkJRWFpDTzBGQlEwUTdRVUZEUml4VFFYWkNSQ3hOUVhWQ1R5eEpRVUZKTEU5QlFVdDRReXhSUVVGTUxFTkJRV05HTEZkQlFXeENMRVZCUVN0Q08wRkJRM0JETEdsQ1FVRkxaU3gzUTBGQlREdEJRVU5FTEZOQlJrMHNUVUZGUVR0QlFVTk1Na0k3UVVGRFJEdEJRVU5HTEU5QkwwSkVPMEZCWjBORU96czdPenM3YTBKQlIxa3NTVUZCU1RWRExIVkNRVUZLTEVVaUxDSm1hV3hsSWpvaVJHVjJhV05sVDNKcFpXNTBZWFJwYjI1TmIyUjFiR1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1JFOU5SWFpsYm5SVGRXSnRiMlIxYkdVZ1puSnZiU0FuTGk5RVQwMUZkbVZ1ZEZOMVltMXZaSFZzWlNjN1hHNXBiWEJ2Y25RZ1NXNXdkWFJOYjJSMWJHVWdabkp2YlNBbkxpOUpibkIxZEUxdlpIVnNaU2M3WEc1cGJYQnZjblFnVFc5MGFXOXVTVzV3ZFhRZ1puSnZiU0FuTGk5TmIzUnBiMjVKYm5CMWRDYzdYRzVwYlhCdmNuUWdjR3hoZEdadmNtMGdabkp2YlNBbmNHeGhkR1p2Y20wbk8xeHVYRzR2S2lwY2JpQXFJRU52Ym5abGNuUnpJR1JsWjNKbFpYTWdkRzhnY21Ga2FXRnVjeTVjYmlBcVhHNGdLaUJBY0dGeVlXMGdlMjUxYldKbGNuMGdaR1ZuSUMwZ1FXNW5iR1VnYVc0Z1pHVm5jbVZsY3k1Y2JpQXFJRUJ5WlhSMWNtNGdlMjUxYldKbGNuMWNiaUFxTDF4dVpuVnVZM1JwYjI0Z1pHVm5WRzlTWVdRb1pHVm5LU0I3WEc0Z0lISmxkSFZ5YmlCa1pXY2dLaUJOWVhSb0xsQkpJQzhnTVRnd08xeHVmVnh1WEc0dktpcGNiaUFxSUVOdmJuWmxjblJ6SUhKaFpHbGhibk1nZEc4Z1pHVm5jbVZsY3k1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnY21Ga0lDMGdRVzVuYkdVZ2FXNGdjbUZrYVdGdWN5NWNiaUFxSUVCeVpYUjFjbTRnZTI1MWJXSmxjbjFjYmlBcUwxeHVablZ1WTNScGIyNGdjbUZrVkc5RVpXY29jbUZrS1NCN1hHNGdJSEpsZEhWeWJpQnlZV1FnS2lBeE9EQWdMeUJOWVhSb0xsQkpPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlFNXZjbTFoYkdsNlpYTWdZU0F6SUhnZ015QnRZWFJ5YVhndVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEpiWFgwZ2JTQXRJRTFoZEhKcGVDQjBieUJ1YjNKdFlXeHBlbVVzSUhKbGNISmxjMlZ1ZEdWa0lHSjVJR0Z1SUdGeWNtRjVJRzltSUd4bGJtZDBhQ0E1TGx4dUlDb2dRSEpsZEhWeWJpQjdiblZ0WW1WeVcxMTlYRzRnS2k5Y2JtWjFibU4wYVc5dUlHNXZjbTFoYkdsNlpTaHRLU0I3WEc0Z0lHTnZibk4wSUdSbGRDQTlJRzFiTUYwZ0tpQnRXelJkSUNvZ2JWczRYU0FySUcxYk1WMGdLaUJ0V3pWZElDb2diVnMyWFNBcklHMWJNbDBnS2lCdFd6TmRJQ29nYlZzM1hTQXRJRzFiTUYwZ0tpQnRXelZkSUNvZ2JWczNYU0F0SUcxYk1WMGdLaUJ0V3pOZElDb2diVnM0WFNBdElHMWJNbDBnS2lCdFd6UmRJQ29nYlZzMlhUdGNibHh1SUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElHMHViR1Z1WjNSb095QnBLeXNwWEc0Z0lDQWdiVnRwWFNBdlBTQmtaWFE3WEc1Y2JpQWdjbVYwZFhKdUlHMDdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1EyOXVkbVZ5ZEhNZ1lTQkZkV3hsY2lCaGJtZHNaU0JnVzJGc2NHaGhMQ0JpWlhSaExDQm5ZVzF0WVYxZ0lIUnZJSFJvWlNCWE0wTWdjM0JsWTJsbWFXTmhkR2x2Yml3Z2QyaGxjbVU2WEc0Z0tpQXRJR0JoYkhCb1lXQWdhWE1nYVc0Z1d6QTdJQ3N6TmpCYk8xeHVJQ29nTFNCZ1ltVjBZV0FnYVhNZ2FXNGdXeTB4T0RBN0lDc3hPREJiTzF4dUlDb2dMU0JnWjJGdGJXRmdJR2x6SUdsdUlGc3RPVEE3SUNzNU1Gc3VYRzRnS2x4dUlDb2dRSEJoY21GdElIdHVkVzFpWlhKYlhYMGdaWFZzWlhKQmJtZHNaU0F0SUVWMWJHVnlJR0Z1WjJ4bElIUnZJSFZ1YVdaNUxDQnlaWEJ5WlhObGJuUmxaQ0JpZVNCaGJpQmhjbkpoZVNCdlppQnNaVzVuZEdnZ015QW9ZRnRoYkhCb1lTd2dZbVYwWVN3Z1oyRnRiV0ZkWUNrdVhHNGdLaUJBYzJWbElIdEFiR2x1YXlCb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk5VVVpOXZjbWxsYm5SaGRHbHZiaTFsZG1WdWRDOTlYRzRnS2k5Y2JtWjFibU4wYVc5dUlIVnVhV1o1S0dWMWJHVnlRVzVuYkdVcElIdGNiaUFnTHk4Z1EyWXVJRmN6UXlCemNHVmphV1pwWTJGMGFXOXVJQ2hvZEhSd09pOHZkek5qTG1kcGRHaDFZaTVwYnk5a1pYWnBZMlZ2Y21sbGJuUmhkR2x2Ymk5emNHVmpMWE52ZFhKalpTMXZjbWxsYm5SaGRHbHZiaTVvZEcxc0tWeHVJQ0F2THlCaGJtUWdSWFZzWlhJZ1lXNW5iR1Z6SUZkcGEybHdaV1JwWVNCd1lXZGxJQ2hvZEhSd09pOHZaVzR1ZDJscmFYQmxaR2xoTG05eVp5OTNhV3RwTDBWMWJHVnlYMkZ1WjJ4bGN5a3VYRzRnSUM4dlhHNGdJQzh2SUZjelF5QmpiMjUyWlc1MGFXOXVPaUJVWVdsMDRvQ1RRbko1WVc0Z1lXNW5iR1Z6SUZvdFdDY3RXU2NuTENCM2FHVnlaVHBjYmlBZ0x5OGdJQ0JoYkhCb1lTQnBjeUJwYmlCYk1Ec2dLek0yTUZzc1hHNGdJQzh2SUNBZ1ltVjBZU0JwY3lCcGJpQmJMVEU0TURzZ0t6RTRNRnNzWEc0Z0lDOHZJQ0FnWjJGdGJXRWdhWE1nYVc0Z1d5MDVNRHNnS3prd1d5NWNibHh1SUNCamIyNXpkQ0JoYkhCb1lVbHpWbUZzYVdRZ1BTQW9kSGx3Wlc5bUlHVjFiR1Z5UVc1bmJHVmJNRjBnUFQwOUlDZHVkVzFpWlhJbktUdGNibHh1SUNCamIyNXpkQ0JmWVd4d2FHRWdQU0FvWVd4d2FHRkpjMVpoYkdsa0lEOGdaR1ZuVkc5U1lXUW9aWFZzWlhKQmJtZHNaVnN3WFNrZ09pQXdLVHRjYmlBZ1kyOXVjM1FnWDJKbGRHRWdQU0JrWldkVWIxSmhaQ2hsZFd4bGNrRnVaMnhsV3pGZEtUdGNiaUFnWTI5dWMzUWdYMmRoYlcxaElEMGdaR1ZuVkc5U1lXUW9aWFZzWlhKQmJtZHNaVnN5WFNrN1hHNWNiaUFnWTI5dWMzUWdZMEVnUFNCTllYUm9MbU52Y3loZllXeHdhR0VwTzF4dUlDQmpiMjV6ZENCalFpQTlJRTFoZEdndVkyOXpLRjlpWlhSaEtUdGNiaUFnWTI5dWMzUWdZMGNnUFNCTllYUm9MbU52Y3loZloyRnRiV0VwTzF4dUlDQmpiMjV6ZENCelFTQTlJRTFoZEdndWMybHVLRjloYkhCb1lTazdYRzRnSUdOdmJuTjBJSE5DSUQwZ1RXRjBhQzV6YVc0b1gySmxkR0VwTzF4dUlDQmpiMjV6ZENCelJ5QTlJRTFoZEdndWMybHVLRjluWVcxdFlTazdYRzVjYmlBZ2JHVjBJR0ZzY0doaExDQmlaWFJoTENCbllXMXRZVHRjYmx4dUlDQnNaWFFnYlNBOUlGdGNiaUFnSUNCalFTQXFJR05ISUMwZ2MwRWdLaUJ6UWlBcUlITkhMRnh1SUNBZ0lDMWpRaUFxSUhOQkxGeHVJQ0FnSUdOQklDb2djMGNnS3lCalJ5QXFJSE5CSUNvZ2MwSXNYRzRnSUNBZ1kwY2dLaUJ6UVNBcklHTkJJQ29nYzBJZ0tpQnpSeXhjYmlBZ0lDQmpRU0FxSUdOQ0xGeHVJQ0FnSUhOQklDb2djMGNnTFNCalFTQXFJR05ISUNvZ2MwSXNYRzRnSUNBZ0xXTkNJQ29nYzBjc1hHNGdJQ0FnYzBJc1hHNGdJQ0FnWTBJZ0tpQmpSMXh1SUNCZE8xeHVJQ0J1YjNKdFlXeHBlbVVvYlNrN1hHNWNiaUFnTHk4Z1UybHVZMlVnZDJVZ2QyRnVkQ0JuWVcxdFlTQnBiaUJiTFRrd095QXJPVEJiTENCalJ5QStQU0F3TGx4dUlDQnBaaUFvYlZzNFhTQStJREFwSUh0Y2JpQWdJQ0F2THlCRFlYTmxJREU2SUcxYk9GMGdQaUF3SUR3OVBpQmpRaUErSURBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNoaGJtUWdZMGNnSVQwZ01DbGNiaUFnSUNBdkx5QWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEdzlQaUJpWlhSaElHbHVJRjB0Y0drdk1qc2dLM0JwTHpKYklDaGhibVFnWTBjZ0lUMGdNQ2xjYmlBZ0lDQmhiSEJvWVNBOUlFMWhkR2d1WVhSaGJqSW9MVzFiTVYwc0lHMWJORjBwTzF4dUlDQWdJR0psZEdFZ1BTQk5ZWFJvTG1GemFXNG9iVnMzWFNrN0lDOHZJR0Z6YVc0Z2NtVjBkWEp1Y3lCaElHNTFiV0psY2lCaVpYUjNaV1Z1SUMxd2FTOHlJR0Z1WkNBcmNHa3ZNaUE5UGlCUFMxeHVJQ0FnSUdkaGJXMWhJRDBnVFdGMGFDNWhkR0Z1TWlndGJWczJYU3dnYlZzNFhTazdYRzRnSUgwZ1pXeHpaU0JwWmlBb2JWczRYU0E4SURBcElIdGNiaUFnSUNBdkx5QkRZWE5sSURJNklHMWJPRjBnUENBd0lEdzlQaUJqUWlBOElEQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdLR0Z1WkNCalJ5QWhQU0F3S1Z4dUlDQWdJQzh2SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEQwK0lHSmxkR0VnYVc0Z1d5MXdhVHNnTFhCcEx6SmJJRlVnWFN0d2FTOHlPeUFyY0dsZElDaGhibVFnWTBjZ0lUMGdNQ2xjYmx4dUlDQWdJQzh2SUZOcGJtTmxJR05DSUR3Z01DQmhibVFnWTBJZ2FYTWdhVzRnYlZzeFhTQmhibVFnYlZzMFhTd2dkR2hsSUhCdmFXNTBJR2x6SUdac2FYQndaV1FnWW5rZ01UZ3dJR1JsWjNKbFpYTXVYRzRnSUNBZ0x5OGdTR1Z1WTJVc0lIZGxJR2hoZG1VZ2RHOGdiWFZzZEdsd2JIa2dZbTkwYUNCaGNtZDFiV1Z1ZEhNZ2IyWWdZWFJoYmpJZ1lua2dMVEVnYVc0Z2IzSmtaWElnZEc4Z2NtVjJaWEowWEc0Z0lDQWdMeThnZEdobElIQnZhVzUwSUdsdUlHbDBjeUJ2Y21sbmFXNWhiQ0J3YjNOcGRHbHZiaUFvUFQ0Z1lXNXZkR2hsY2lCbWJHbHdJR0o1SURFNE1DQmtaV2R5WldWektTNWNiaUFnSUNCaGJIQm9ZU0E5SUUxaGRHZ3VZWFJoYmpJb2JWc3hYU3dnTFcxYk5GMHBPMXh1SUNBZ0lHSmxkR0VnUFNBdFRXRjBhQzVoYzJsdUtHMWJOMTBwTzF4dUlDQWdJR0psZEdFZ0t6MGdLR0psZEdFZ1BqMGdNQ2tnUHlBdFRXRjBhQzVRU1NBNklFMWhkR2d1VUVrN0lDOHZJR0Z6YVc0Z2NtVjBkWEp1Y3lCaElHNTFiV0psY2lCaVpYUjNaV1Z1SUMxd2FTOHlJR0Z1WkNCd2FTOHlJRDArSUcxaGEyVWdjM1Z5WlNCaVpYUmhJR2x1SUZzdGNHazdJQzF3YVM4eVd5QlZJRjByY0drdk1qc2dLM0JwWFZ4dUlDQWdJR2RoYlcxaElEMGdUV0YwYUM1aGRHRnVNaWh0V3paZExDQXRiVnM0WFNrN0lDOHZJSE5oYldVZ2NtVnRZWEpySUdGeklHWnZjaUJoYkhCb1lTd2diWFZzZEdsd2JHbGpZWFJwYjI0Z1lua2dMVEZjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0F2THlCRFlYTmxJRE02SUcxYk9GMGdQU0F3SUR3OVBpQmpRaUE5SURBZ2IzSWdZMGNnUFNBd1hHNGdJQ0FnYVdZZ0tHMWJObDBnUGlBd0tTQjdYRzRnSUNBZ0lDQXZMeUJUZFdKallYTmxJREU2SUdOSElEMGdNQ0JoYm1RZ1kwSWdQaUF3WEc0Z0lDQWdJQ0F2THlBZ0lDQWdJQ0FnSUNBZ0lHTkhJRDBnTUNBOFBUNGdjMGNnUFNBdE1TQThQVDRnWjJGdGJXRWdQU0F0Y0drdk1pQTlQaUJ0V3paZElEMGdZMEpjYmlBZ0lDQWdJQzh2SUNBZ0lDQWdJQ0FnSUNBZ1NHVnVZMlVzSUcxYk5sMGdQaUF3SUR3OVBpQmpRaUErSURBZ1BEMCtJR0psZEdFZ2FXNGdYUzF3YVM4eU95QXJjR2t2TWx0Y2JpQWdJQ0FnSUdGc2NHaGhJRDBnVFdGMGFDNWhkR0Z1TWlndGJWc3hYU3dnYlZzMFhTazdYRzRnSUNBZ0lDQmlaWFJoSUQwZ1RXRjBhQzVoYzJsdUtHMWJOMTBwT3lBdkx5QmhjMmx1SUhKbGRIVnlibk1nWVNCdWRXMWlaWElnWW1WMGQyVmxiaUF0Y0drdk1pQmhibVFnSzNCcEx6SWdQVDRnVDB0Y2JpQWdJQ0FnSUdkaGJXMWhJRDBnTFUxaGRHZ3VVRWtnTHlBeU8xeHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb2JWczJYU0E4SURBcElIdGNiaUFnSUNBZ0lDOHZJRk4xWW1OaGMyVWdNam9nWTBjZ1BTQXdJR0Z1WkNCalFpQThJREJjYmlBZ0lDQWdJQzh2SUNBZ0lDQWdJQ0FnSUNBZ1kwY2dQU0F3SUR3OVBpQnpSeUE5SUMweElEdzlQaUJuWVcxdFlTQTlJQzF3YVM4eUlEMCtJRzFiTmwwZ1BTQmpRbHh1SUNBZ0lDQWdMeThnSUNBZ0lDQWdJQ0FnSUNCSVpXNWpaU3dnYlZzMlhTQThJREFnUEQwK0lHTkNJRHdnTUNBOFBUNGdZbVYwWVNCcGJpQmJMWEJwT3lBdGNHa3ZNbHNnVlNCZEszQnBMekk3SUN0d2FWMWNiaUFnSUNBZ0lHRnNjR2hoSUQwZ1RXRjBhQzVoZEdGdU1paHRXekZkTENBdGJWczBYU2s3SUM4dklITmhiV1VnY21WdFlYSnJJR0Z6SUdadmNpQmhiSEJvWVNCcGJpQmhJR05oYzJVZ1lXSnZkbVZjYmlBZ0lDQWdJR0psZEdFZ1BTQXRUV0YwYUM1aGMybHVLRzFiTjEwcE8xeHVJQ0FnSUNBZ1ltVjBZU0FyUFNBb1ltVjBZU0ErUFNBd0tTQS9JQzFOWVhSb0xsQkpJRG9nVFdGMGFDNVFTVHNnTHk4Z1lYTnBiaUJ5WlhSMWNtNXpJR0VnYm5WdFltVnlJR0psZEhkbFpXNGdMWEJwTHpJZ1lXNWtJQ3R3YVM4eUlEMCtJRzFoYTJVZ2MzVnlaU0JpWlhSaElHbHVJRnN0Y0drN0lDMXdhUzh5V3lCVklGMHJjR2t2TWpzZ0szQnBYVnh1SUNBZ0lDQWdaMkZ0YldFZ1BTQXRUV0YwYUM1UVNTQXZJREk3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDOHZJRk4xWW1OaGMyVWdNem9nWTBJZ1BTQXdYRzRnSUNBZ0lDQXZMeUJKYmlCMGFHVWdZMkZ6WlNCM2FHVnlaU0JqYjNNb1ltVjBZU2tnUFNBd0lDaHBMbVV1SUdKbGRHRWdQU0F0Y0drdk1pQnZjaUJpWlhSaElEMGdjR2t2TWlrc1hHNGdJQ0FnSUNBdkx5QjNaU0JvWVhabElIUm9aU0JuYVcxaVlXd2diRzlqYXlCd2NtOWliR1Z0T2lCcGJpQjBhR0YwSUdOdmJtWnBaM1Z5WVhScGIyNHNJRzl1YkhrZ2RHaGxJR0Z1WjJ4bFhHNGdJQ0FnSUNBdkx5QmhiSEJvWVNBcklHZGhiVzFoSUNocFppQmlaWFJoSUQwZ0szQnBMeklwSUc5eUlHRnNjR2hoSUMwZ1oyRnRiV0VnS0dsbUlHSmxkR0VnUFNBdGNHa3ZNaWxjYmlBZ0lDQWdJQzh2SUdGeVpTQjFibWx4ZFdWc2VTQmtaV1pwYm1Wa09pQmhiSEJvWVNCaGJtUWdaMkZ0YldFZ1kyRnVJSFJoYTJVZ1lXNGdhVzVtYVc1cGRIa2diMllnZG1Gc2RXVnpMbHh1SUNBZ0lDQWdMeThnUm05eUlHTnZiblpsYm1sbGJtTmxMQ0JzWlhRbmN5QnpaWFFnWjJGdGJXRWdQU0F3SUNoaGJtUWdkR2gxY3lCemFXNG9aMkZ0YldFcElEMGdNQ2t1WEc0Z0lDQWdJQ0F2THlBb1FYTWdZU0JqYjI1elpYRjFaVzVqWlNCdlppQjBhR1VnWjJsdFltRnNJR3h2WTJzZ2NISnZZbXhsYlN3Z2RHaGxjbVVnYVhNZ1lTQmthWE5qYjI1MGFXNTFhWFI1WEc0Z0lDQWdJQ0F2THlCcGJpQmhiSEJvWVNCaGJtUWdaMkZ0YldFdUtWeHVJQ0FnSUNBZ1lXeHdhR0VnUFNCTllYUm9MbUYwWVc0eUtHMWJNMTBzSUcxYk1GMHBPMXh1SUNBZ0lDQWdZbVYwWVNBOUlDaHRXemRkSUQ0Z01Da2dQeUJOWVhSb0xsQkpJQzhnTWlBNklDMU5ZWFJvTGxCSklDOGdNanRjYmlBZ0lDQWdJR2RoYlcxaElEMGdNRHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2THlCaGRHRnVNaUJ5WlhSMWNtNXpJR0VnYm5WdFltVnlJR0psZEhkbFpXNGdMWEJwSUdGdVpDQndhU0E5UGlCdFlXdGxJSE4xY21VZ2RHaGhkQ0JoYkhCb1lTQnBjeUJwYmlCYk1Dd2dNaXB3YVZzdVhHNGdJR0ZzY0doaElDczlJQ2hoYkhCb1lTQThJREFwSUQ4Z01pQXFJRTFoZEdndVVFa2dPaUF3TzF4dVhHNGdJR1YxYkdWeVFXNW5iR1ZiTUYwZ1BTQW9ZV3h3YUdGSmMxWmhiR2xrSUQ4Z2NtRmtWRzlFWldjb1lXeHdhR0VwSURvZ2JuVnNiQ2s3WEc0Z0lHVjFiR1Z5UVc1bmJHVmJNVjBnUFNCeVlXUlViMFJsWnloaVpYUmhLVHRjYmlBZ1pYVnNaWEpCYm1kc1pWc3lYU0E5SUhKaFpGUnZSR1ZuS0dkaGJXMWhLVHRjYm4xY2JseHVMeW9xWEc0Z0tpQkRiMjUyWlhKMGN5QmhJRVYxYkdWeUlHRnVaMnhsSUdCYllXeHdhR0VzSUdKbGRHRXNJR2RoYlcxaFhXQWdkRzhnWVNCRmRXeGxjaUJoYm1kc1pTQjNhR1Z5WlRwY2JpQXFJQzBnWUdGc2NHaGhZQ0JwY3lCcGJpQmJNRHNnS3pNMk1GczdYRzRnS2lBdElHQmlaWFJoWUNCcGN5QnBiaUJiTFRrd095QXJPVEJiTzF4dUlDb2dMU0JnWjJGdGJXRmdJR2x6SUdsdUlGc3RNVGd3T3lBck1UZ3dXeTVjYmlBcVhHNGdLaUJBY0dGeVlXMGdlMjUxYldKbGNsdGRmU0JsZFd4bGNrRnVaMnhsSUMwZ1JYVnNaWElnWVc1bmJHVWdkRzhnWTI5dWRtVnlkQ3dnY21Wd2NtVnpaVzUwWldRZ1lua2dZVzRnWVhKeVlYa2diMllnYkdWdVozUm9JRE1nS0dCYllXeHdhR0VzSUdKbGRHRXNJR2RoYlcxaFhXQXBMbHh1SUNvdlhHNW1kVzVqZEdsdmJpQjFibWxtZVVGc2RDaGxkV3hsY2tGdVoyeGxLU0I3WEc0Z0lDOHZJRU52Ym5abGJuUnBiMjRnYUdWeVpUb2dWR0ZwZE9LQWswSnllV0Z1SUdGdVoyeGxjeUJhTFZnbkxWa25KeXdnZDJobGNtVTZYRzRnSUM4dklDQWdZV3h3YUdFZ2FYTWdhVzRnV3pBN0lDc3pOakJiTEZ4dUlDQXZMeUFnSUdKbGRHRWdhWE1nYVc0Z1d5MDVNRHNnS3prd1d5eGNiaUFnTHk4Z0lDQm5ZVzF0WVNCcGN5QnBiaUJiTFRFNE1Ec2dLekU0TUZzdVhHNWNiaUFnWTI5dWMzUWdZV3h3YUdGSmMxWmhiR2xrSUQwZ0tIUjVjR1Z2WmlCbGRXeGxja0Z1WjJ4bFd6QmRJRDA5UFNBbmJuVnRZbVZ5SnlrN1hHNWNiaUFnWTI5dWMzUWdYMkZzY0doaElEMGdLR0ZzY0doaFNYTldZV3hwWkNBL0lHUmxaMVJ2VW1Ga0tHVjFiR1Z5UVc1bmJHVmJNRjBwSURvZ01DazdYRzRnSUdOdmJuTjBJRjlpWlhSaElEMGdaR1ZuVkc5U1lXUW9aWFZzWlhKQmJtZHNaVnN4WFNrN1hHNGdJR052Ym5OMElGOW5ZVzF0WVNBOUlHUmxaMVJ2VW1Ga0tHVjFiR1Z5UVc1bmJHVmJNbDBwTzF4dVhHNGdJR052Ym5OMElHTkJJRDBnVFdGMGFDNWpiM01vWDJGc2NHaGhLVHRjYmlBZ1kyOXVjM1FnWTBJZ1BTQk5ZWFJvTG1OdmN5aGZZbVYwWVNrN1hHNGdJR052Ym5OMElHTkhJRDBnVFdGMGFDNWpiM01vWDJkaGJXMWhLVHRjYmlBZ1kyOXVjM1FnYzBFZ1BTQk5ZWFJvTG5OcGJpaGZZV3h3YUdFcE8xeHVJQ0JqYjI1emRDQnpRaUE5SUUxaGRHZ3VjMmx1S0Y5aVpYUmhLVHRjYmlBZ1kyOXVjM1FnYzBjZ1BTQk5ZWFJvTG5OcGJpaGZaMkZ0YldFcE8xeHVYRzRnSUd4bGRDQmhiSEJvWVN3Z1ltVjBZU3dnWjJGdGJXRTdYRzVjYmlBZ2JHVjBJRzBnUFNCYlhHNGdJQ0FnWTBFZ0tpQmpSeUF0SUhOQklDb2djMElnS2lCelJ5eGNiaUFnSUNBdFkwSWdLaUJ6UVN4Y2JpQWdJQ0JqUVNBcUlITkhJQ3NnWTBjZ0tpQnpRU0FxSUhOQ0xGeHVJQ0FnSUdOSElDb2djMEVnS3lCalFTQXFJSE5DSUNvZ2MwY3NYRzRnSUNBZ1kwRWdLaUJqUWl4Y2JpQWdJQ0J6UVNBcUlITkhJQzBnWTBFZ0tpQmpSeUFxSUhOQ0xGeHVJQ0FnSUMxalFpQXFJSE5ITEZ4dUlDQWdJSE5DTEZ4dUlDQWdJR05DSUNvZ1kwZGNiaUFnWFR0Y2JpQWdibTl5YldGc2FYcGxLRzBwTzF4dVhHNGdJR0ZzY0doaElEMGdUV0YwYUM1aGRHRnVNaWd0YlZzeFhTd2diVnMwWFNrN1hHNGdJR0ZzY0doaElDczlJQ2hoYkhCb1lTQThJREFwSUQ4Z01pQXFJRTFoZEdndVVFa2dPaUF3T3lBdkx5QmhkR0Z1TWlCeVpYUjFjbTV6SUdFZ2JuVnRZbVZ5SUdKbGRIZGxaVzRnTFhCcElHRnVaQ0FyY0drZ1BUNGdiV0ZyWlNCemRYSmxJR0ZzY0doaElHbHpJR2x1SUZzd0xDQXlLbkJwV3k1Y2JpQWdZbVYwWVNBOUlFMWhkR2d1WVhOcGJpaHRXemRkS1RzZ0x5OGdZWE5wYmlCeVpYUjFjbTV6SUdFZ2JuVnRZbVZ5SUdKbGRIZGxaVzRnTFhCcEx6SWdZVzVrSUhCcEx6SWdQVDRnVDB0Y2JpQWdaMkZ0YldFZ1BTQk5ZWFJvTG1GMFlXNHlLQzF0V3paZExDQnRXemhkS1RzZ0x5OGdZWFJoYmpJZ2NtVjBkWEp1Y3lCaElHNTFiV0psY2lCaVpYUjNaV1Z1SUMxd2FTQmhibVFnSzNCcElEMCtJRTlMWEc1Y2JpQWdaWFZzWlhKQmJtZHNaVnN3WFNBOUlDaGhiSEJvWVVselZtRnNhV1FnUHlCeVlXUlViMFJsWnloaGJIQm9ZU2tnT2lCdWRXeHNLVHRjYmlBZ1pYVnNaWEpCYm1kc1pWc3hYU0E5SUhKaFpGUnZSR1ZuS0dKbGRHRXBPMXh1SUNCbGRXeGxja0Z1WjJ4bFd6SmRJRDBnY21Ga1ZHOUVaV2NvWjJGdGJXRXBPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlHQkVaWFpwWTJWUGNtbGxiblJoZEdsdmJrMXZaSFZzWldBZ2MybHVaMnhsZEc5dUxseHVJQ29nVkdobElHQkVaWFpwWTJWUGNtbGxiblJoZEdsdmJrMXZaSFZzWldBZ2MybHVaMnhsZEc5dUlIQnliM1pwWkdWeklIUm9aU0J5WVhjZ2RtRnNkV1Z6WEc0Z0tpQnZaaUIwYUdVZ2IzSnBaVzUwWVhScGIyNGdjSEp2ZG1sa1pXUWdZbmtnZEdobElHQkVaWFpwWTJWTmIzUnBiMjVnSUdWMlpXNTBMbHh1SUNvZ1NYUWdZV3h6YnlCcGJuTjBZVzUwYVdGMFpTQjBhR1VnWUU5eWFXVnVkR0YwYVc5dVlDQnpkV0p0YjJSMWJHVWdkR2hoZENCMWJtbG1hV1Z6SUhSb2IzTmxYRzRnS2lCMllXeDFaWE1nWVdOeWIzTnpJSEJzWVhSbWIzSnRjeUJpZVNCdFlXdHBibWNnZEdobGJTQmpiMjF3YkdsaGJuUWdkMmwwYUNCN1FHeHBibXRjYmlBcUlHaDBkSEE2THk5M2QzY3Vkek11YjNKbkwxUlNMMjl5YVdWdWRHRjBhVzl1TFdWMlpXNTBMM3gwYUdVZ1Z6TkRJSE4wWVc1a1lYSmtmU0FvS21rdVpTNHFYRzRnS2lCMGFHVWdZR0ZzY0doaFlDQmhibWRzWlNCaVpYUjNaV1Z1SUdBd1lDQmhibVFnWURNMk1HQWdaR1ZuY21WbGN5d2dkR2hsSUdCaVpYUmhZQ0JoYm1kc1pWeHVJQ29nWW1WMGQyVmxiaUJnTFRFNE1HQWdZVzVrSUdBeE9EQmdJR1JsWjNKbFpYTXNJR0Z1WkNCZ1oyRnRiV0ZnSUdKbGRIZGxaVzRnWUMwNU1HQWdZVzVrWEc0Z0tpQmdPVEJnSUdSbFozSmxaWE1wTENCaGN5QjNaV3hzSUdGeklIUm9aU0JnVDNKcFpXNTBZWFJwYjI1QmJIUmdJSE4xWW0xdlpIVnNaWE1nS0hkcGRHaGNiaUFxSUhSb1pTQmdZV3h3YUdGZ0lHRnVaMnhsSUdKbGRIZGxaVzRnWURCZ0lHRnVaQ0JnTXpZd1lDQmtaV2R5WldWekxDQjBhR1VnWUdKbGRHRmdJR0Z1WjJ4bFhHNGdLaUJpWlhSM1pXVnVJR0F0T1RCZ0lHRnVaQ0JnT1RCZ0lHUmxaM0psWlhNc0lHRnVaQ0JnWjJGdGJXRmdJR0psZEhkbFpXNGdZQzB4T0RCZ0lHRnVaRnh1SUNvZ1lERTRNR0FnWkdWbmNtVmxjeWt1WEc0Z0tpQlhhR1Z1SUhSb1pTQmdiM0pwWlc1MFlYUnBiMjVnSUhKaGR5QjJZV3gxWlhNZ1lYSmxJRzV2ZENCd2NtOTJhV1JsWkNCaWVTQjBhR1VnYzJWdWMyOXljeXhjYmlBcUlIUm9hWE1nYlc5a2RXeGxjeUIwY21sbGN5QjBieUJ5WldOaGJHTjFiR0YwWlNCZ1ltVjBZV0FnWVc1a0lHQm5ZVzF0WVdBZ1puSnZiU0IwYUdWY2JpQXFJR0JCWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1WUNCdGIyUjFiR1VzSUdsbUlHRjJZV2xzWVdKc1pTQW9hVzRnZEdoaGRDQmpZWE5sTEZ4dUlDb2dkR2hsSUdCaGJIQm9ZV0FnWVc1bmJHVWdhWE1nYVcxd2IzTnphV0pzWlNCMGJ5QnlaWFJ5YVdWMlpTQnphVzVqWlNCMGFHVWdZMjl0Y0dGemN5QnBjMXh1SUNvZ2JtOTBJR0YyWVdsc1lXSnNaU2t1WEc0Z0tseHVJQ29nUUdOc1lYTnpJRVJsZG1salpVMXZkR2x2YmsxdlpIVnNaVnh1SUNvZ1FHVjRkR1Z1WkhNZ1NXNXdkWFJOYjJSMWJHVmNiaUFxTDF4dVkyeGhjM01nUkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVOYjJSMWJHVWdaWGgwWlc1a2N5QkpibkIxZEUxdlpIVnNaU0I3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU55WldGMFpYTWdkR2hsSUdCRVpYWnBZMlZQY21sbGJuUmhkR2x2Ym1BZ2JXOWtkV3hsSUdsdWMzUmhibU5sTGx4dUlDQWdLbHh1SUNBZ0tpQkFZMjl1YzNSeWRXTjBiM0pjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBjblZqZEc5eUtDa2dlMXh1SUNBZ0lITjFjR1Z5S0Nka1pYWnBZMlZ2Y21sbGJuUmhkR2x2YmljcE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dVbUYzSUhaaGJIVmxjeUJqYjIxcGJtY2dabkp2YlNCMGFHVWdZR1JsZG1salpXOXlhV1Z1ZEdGMGFXOXVZQ0JsZG1WdWRDQnpaVzUwSUdKNUlIUm9hWE1nYlc5a2RXeGxMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRSFJvYVhNZ1JHVjJhV05sVDNKcFpXNTBZWFJwYjI1TmIyUjFiR1ZjYmlBZ0lDQWdLaUJBZEhsd1pTQjdiblZ0WW1WeVcxMTlYRzRnSUNBZ0lDb2dRR1JsWm1GMWJIUWdXMjUxYkd3c0lHNTFiR3dzSUc1MWJHeGRYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVsZG1WdWRDQTlJRnR1ZFd4c0xDQnVkV3hzTENCdWRXeHNYVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSb1pTQmdUM0pwWlc1MFlYUnBiMjVnSUcxdlpIVnNaUzVjYmlBZ0lDQWdLaUJRY205MmFXUmxjeUIxYm1sbWFXVmtJSFpoYkhWbGN5QnZaaUIwYUdVZ2IzSnBaVzUwWVhScGIyNGdZMjl0Y0d4cFlXNTBJSGRwZEdnZ2UwQnNhVzVyWEc0Z0lDQWdJQ29nYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2VkZJdmIzSnBaVzUwWVhScGIyNHRaWFpsYm5RdmZIUm9aU0JYTTBNZ2MzUmhibVJoY21SOVhHNGdJQ0FnSUNvZ0tHQmhiSEJvWVdBZ2FXNGdZRnN3TENBek5qQmRZQ3dnWW1WMFlTQnBiaUJnV3kweE9EQXNJQ3N4T0RCZFlDd2dZR2RoYlcxaFlDQnBiaUJnV3kwNU1Dd2dLemt3WFdBcExseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIUm9hWE1nUkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1JFOU5SWFpsYm5SVGRXSnRiMlIxYkdWOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXZjbWxsYm5SaGRHbHZiaUE5SUc1bGR5QkVUMDFGZG1WdWRGTjFZbTF2WkhWc1pTaDBhR2x6TENBbmIzSnBaVzUwWVhScGIyNG5LVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSb1pTQmdUM0pwWlc1MFlYUnBiMjVCYkhSZ0lHMXZaSFZzWlM1Y2JpQWdJQ0FnS2lCUWNtOTJhV1JsY3lCaGJIUmxjbTVoZEdsMlpTQjJZV3gxWlhNZ2IyWWdkR2hsSUc5eWFXVnVkR0YwYVc5dVhHNGdJQ0FnSUNvZ0tHQmhiSEJvWVdBZ2FXNGdZRnN3TENBek5qQmRZQ3dnWW1WMFlTQnBiaUJnV3kwNU1Dd2dLemt3WFdBc0lHQm5ZVzF0WVdBZ2FXNGdZRnN0TVRnd0xDQXJNVGd3WFdBcExseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIUm9hWE1nUkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1JFOU5SWFpsYm5SVGRXSnRiMlIxYkdWOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NXZjbWxsYm5SaGRHbHZia0ZzZENBOUlHNWxkeUJFVDAxRmRtVnVkRk4xWW0xdlpIVnNaU2gwYUdsekxDQW5iM0pwWlc1MFlYUnBiMjVCYkhRbktUdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRkpsY1hWcGNtVmtJSE4xWW0xdlpIVnNaWE1nTHlCbGRtVnVkSE11WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBZEdocGN5QkVaWFpwWTJWUGNtbGxiblJoZEdsdmJrMXZaSFZzWlZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHR2WW1wbFkzUjlYRzRnSUNBZ0lDb2dRSEJ5YjNCbGNuUjVJSHRpYjI5c2ZTQnZjbWxsYm5SaGRHbHZiaUF0SUVsdVpHbGpZWFJsY3lCM2FHVjBhR1Z5SUhSb1pTQmdiM0pwWlc1MFlYUnBiMjVnSUhWdWFXWnBaV1FnZG1Gc2RXVnpJR0Z5WlNCeVpYRjFhWEpsWkNCdmNpQnViM1FnS0dSbFptRjFiSFJ6SUhSdklHQm1ZV3h6WldBcExseHVJQ0FnSUNBcUlFQndjbTl3WlhKMGVTQjdZbTl2YkgwZ2IzSnBaVzUwWVhScGIyNUJiSFFnTFNCSmJtUnBZMkYwWlhNZ2QyaGxkR2hsY2lCMGFHVWdZRzl5YVdWdWRHRjBhVzl1UVd4MFlDQjJZV3gxWlhNZ1lYSmxJSEpsY1hWcGNtVmtJRzl5SUc1dmRDQW9aR1ZtWVhWc2RITWdkRzhnWUdaaGJITmxZQ2t1WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1eVpYRjFhWEpsWkNBOUlIdGNiaUFnSUNBZ0lHOXlhV1Z1ZEdGMGFXOXVPaUJtWVd4elpTeGNiaUFnSUNBZ0lHOXlhV1Z1ZEdGMGFXOXVRV3gwT2lCbVlXeHpaVnh1SUNBZ0lIMDdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJTWlhOdmJIWmxJR1oxYm1OMGFXOXVJRzltSUhSb1pTQnRiMlIxYkdVbmN5QndjbTl0YVhObExseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIUm9hWE1nUkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1puVnVZM1JwYjI1OVhHNGdJQ0FnSUNvZ1FHUmxabUYxYkhRZ2JuVnNiRnh1SUNBZ0lDQXFJRUJ6WldVZ1JHVjJhV05sVDNKcFpXNTBZWFJwYjI1TmIyUjFiR1VqYVc1cGRGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVYM0J5YjIxcGMyVlNaWE52YkhabElEMGdiblZzYkR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFZHlZWFpwZEhrZ2RtVmpkRzl5SUdOaGJHTjFiR0YwWldRZ1puSnZiU0IwYUdVZ1lHRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIbGdJSFZ1YVdacFpXUWdkbUZzZFdWekxseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIUm9hWE1nUkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN2JuVnRZbVZ5VzExOVhHNGdJQ0FnSUNvZ1FHUmxabUYxYkhRZ1d6QXNJREFzSURCZFhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWZaWE4wYVcxaGRHVmtSM0poZG1sMGVTQTlJRnN3TENBd0xDQXdYVHRjYmx4dUlDQWdJSFJvYVhNdVgzQnliMk5sYzNOR2RXNWpkR2x2YmlBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k1ZmNISnZZMlZ6Y3lBOUlIUm9hWE11WDNCeWIyTmxjM011WW1sdVpDaDBhR2x6S1R0Y2JpQWdJQ0IwYUdsekxsOWtaWFpwWTJWdmNtbGxiblJoZEdsdmJrTm9aV05ySUQwZ2RHaHBjeTVmWkdWMmFXTmxiM0pwWlc1MFlYUnBiMjVEYUdWamF5NWlhVzVrS0hSb2FYTXBPMXh1SUNBZ0lIUm9hWE11WDJSbGRtbGpaVzl5YVdWdWRHRjBhVzl1VEdsemRHVnVaWElnUFNCMGFHbHpMbDlrWlhacFkyVnZjbWxsYm5SaGRHbHZia3hwYzNSbGJtVnlMbUpwYm1Rb2RHaHBjeWs3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1UyVnVjMjl5SUdOb1pXTnJJRzl1SUdsdWFYUnBZV3hwZW1GMGFXOXVJRzltSUhSb1pTQnRiMlIxYkdVdVhHNGdJQ0FxSUZSb2FYTWdiV1YwYUc5a09seHVJQ0FnS2lBdElHTm9aV05yY3lCM2FHVjBhR1Z5SUhSb1pTQmdiM0pwWlc1MFlYUnBiMjVnSUhaaGJIVmxjeUJoY21VZ2RtRnNhV1FnYjNJZ2JtOTBPMXh1SUNBZ0tpQXRJQ2hwYmlCMGFHVWdZMkZ6WlNCM2FHVnlaU0J2Y21sbGJuUmhkR2x2YmlCeVlYY2dkbUZzZFdWeklHRnlaU0J1YjNRZ2NISnZkbWxrWldRcFhHNGdJQ0FxSUNBZ2RISnBaWE1nZEc4Z1kyRnNZM1ZzWVhSbElIUm9aU0J2Y21sbGJuUmhkR2x2YmlCbWNtOXRJSFJvWlZ4dUlDQWdLaUFnSUdCaFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNVlDQjFibWxtYVdWa0lIWmhiSFZsY3k1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJoY21GdElIdEVaWFpwWTJWTmIzUnBiMjVGZG1WdWRIMGdaU0F0SUVacGNuTjBJR0FuWkdWMmFXTmxiVzkwYVc5dUoyQWdaWFpsYm5RZ1kyRjFaMmgwTENCdmJpQjNhR2xqYUNCMGFHVWdZMmhsWTJzZ2FYTWdaRzl1WlM1Y2JpQWdJQ292WEc0Z0lGOWtaWFpwWTJWdmNtbGxiblJoZEdsdmJrTm9aV05yS0dVcElIdGNiaUFnSUNBdkx5QmpiR1ZoY2lCMGFXMWxiM1YwSUNoaGJuUnBMVVpwY21WbWIzZ2dZblZuSUhOdmJIVjBhVzl1TENCM2FXNWtiM2NnWlhabGJuUWdaR1YyYVdObGIzSnBaVzUwWVhScGIyNGdZbVZwYm1jZ2JuWmxjaUJqWVd4c1pXUXBYRzRnSUNBZ0x5OGdjMlYwSUhSb1pTQnpaWFFnZEdsdFpXOTFkQ0JwYmlCcGJtbDBLQ2tnWm5WdVkzUnBiMjVjYmlBZ0lDQmpiR1ZoY2xScGJXVnZkWFFvZEdocGN5NWZZMmhsWTJ0VWFXMWxiM1YwU1dRcE8xeHVYRzRnSUNBZ2RHaHBjeTVwYzFCeWIzWnBaR1ZrSUQwZ2RISjFaVHRjYmx4dUlDQWdJQzh2SUZObGJuTnZjaUJoZG1GcGJHRmlhV3hwZEhrZ1ptOXlJSFJvWlNCdmNtbGxiblJoZEdsdmJpQmhibVFnWVd4MFpYSnVZWFJwZG1VZ2IzSnBaVzUwWVhScGIyNWNiaUFnSUNCamIyNXpkQ0J5WVhkV1lXeDFaWE5RY205MmFXUmxaQ0E5SUNnb2RIbHdaVzltSUdVdVlXeHdhR0VnUFQwOUlDZHVkVzFpWlhJbktTQW1KaUFvZEhsd1pXOW1JR1V1WW1WMFlTQTlQVDBnSjI1MWJXSmxjaWNwSUNZbUlDaDBlWEJsYjJZZ1pTNW5ZVzF0WVNBOVBUMGdKMjUxYldKbGNpY3BLVHRjYmlBZ0lDQjBhR2x6TG05eWFXVnVkR0YwYVc5dUxtbHpVSEp2ZG1sa1pXUWdQU0J5WVhkV1lXeDFaWE5RY205MmFXUmxaRHRjYmlBZ0lDQjBhR2x6TG05eWFXVnVkR0YwYVc5dVFXeDBMbWx6VUhKdmRtbGtaV1FnUFNCeVlYZFdZV3gxWlhOUWNtOTJhV1JsWkR0Y2JseHVJQ0FnSUM4dklGUlBSRThvUHlrNklHZGxkQ0J3YzJWMVpHOHRjR1Z5YVc5a1hHNWNiaUFnSUNBdkx5QnpkMkZ3SUhSb1pTQndjbTlqWlhOeklHWjFibU4wYVc5dUlIUnZJSFJvWlZ4dUlDQWdJSFJvYVhNdVgzQnliMk5sYzNOR2RXNWpkR2x2YmlBOUlIUm9hWE11WDJSbGRtbGpaVzl5YVdWdWRHRjBhVzl1VEdsemRHVnVaWEk3WEc1Y2JpQWdJQ0F2THlCSlppQnZjbWxsYm5SaGRHbHZiaUJ2Y2lCaGJIUmxjbTVoZEdsMlpTQnZjbWxsYm5SaGRHbHZiaUJoY21VZ2JtOTBJSEJ5YjNacFpHVmtJR0o1SUhKaGR5QnpaVzV6YjNKeklHSjFkQ0J5WlhGMWFYSmxaQ3hjYmlBZ0lDQXZMeUIwY25rZ2RHOGdZMkZzWTNWc1lYUmxJSFJvWlcwZ2QybDBhQ0JnWVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVdBZ2RXNXBabWxsWkNCMllXeDFaWE5jYmlBZ0lDQnBaaUFvS0hSb2FYTXVjbVZ4ZFdseVpXUXViM0pwWlc1MFlYUnBiMjRnSmlZZ0lYUm9hWE11YjNKcFpXNTBZWFJwYjI0dWFYTlFjbTkyYVdSbFpDa2dmSHdnS0hSb2FYTXVjbVZ4ZFdseVpXUXViM0pwWlc1MFlYUnBiMjVCYkhRZ0ppWWdJWFJvYVhNdWIzSnBaVzUwWVhScGIyNUJiSFF1YVhOUWNtOTJhV1JsWkNrcFhHNGdJQ0FnSUNCMGFHbHpMbDkwY25sQlkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNVJtRnNiR0poWTJzb0tUdGNiaUFnSUNCbGJITmxYRzRnSUNBZ0lDQjBhR2x6TGw5d2NtOXRhWE5sVW1WemIyeDJaU2gwYUdsektUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJnSjJSbGRtbGpaVzl5YVdWdWRHRjBhVzl1SjJBZ1pYWmxiblFnWTJGc2JHSmhZMnN1WEc0Z0lDQXFJRlJvYVhNZ2JXVjBhRzlrSUdWdGFYUnpJR0Z1SUdWMlpXNTBJSGRwZEdnZ2RHaGxJSEpoZHlCZ0oyUmxkbWxqWlc5eWFXVnVkR0YwYVc5dUoyQWdkbUZzZFdWekxGeHVJQ0FnS2lCaGJtUWdaVzFwZEhNZ1pYWmxiblJ6SUhkcGRHZ2dkR2hsSUhWdWFXWnBaV1FnWUc5eWFXVnVkR0YwYVc5dVlDQmhibVFnTHlCdmNpQjBhR1ZjYmlBZ0lDb2dZRzl5YVdWdWRHRjBhVzl1UVd4MFlDQjJZV3gxWlhNZ2FXWWdkR2hsZVNCaGNtVWdjbVZ4ZFdseVpXUXVYRzRnSUNBcVhHNGdJQ0FxSUVCd1lYSmhiU0I3UkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVGZG1WdWRIMGdaU0F0SUdBblpHVjJhV05sYjNKcFpXNTBZWFJwYjI0bllDQmxkbVZ1ZENCMGFHVWdkbUZzZFdWeklHRnlaU0JqWVd4amRXeGhkR1ZrSUdaeWIyMHVYRzRnSUNBcUwxeHVJQ0JmWkdWMmFXTmxiM0pwWlc1MFlYUnBiMjVNYVhOMFpXNWxjaWhsS1NCN1hHNGdJQ0FnTHk4Z0oyUmxkbWxqWlc5eWFXVnVkR0YwYVc5dUp5QmxkbVZ1ZENBb2NtRjNJSFpoYkhWbGN5bGNiaUFnSUNCc1pYUWdiM1YwUlhabGJuUWdQU0IwYUdsekxtVjJaVzUwTzF4dVhHNGdJQ0FnYjNWMFJYWmxiblJiTUYwZ1BTQmxMbUZzY0doaE8xeHVJQ0FnSUc5MWRFVjJaVzUwV3pGZElEMGdaUzVpWlhSaE8xeHVJQ0FnSUc5MWRFVjJaVzUwV3pKZElEMGdaUzVuWVcxdFlUdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxteHBjM1JsYm1WeWN5NXphWHBsSUQ0Z01DbGNiaUFnSUNBZ0lIUm9hWE11WlcxcGRDaHZkWFJGZG1WdWRDazdYRzVjYmlBZ0lDQXZMeUFuYjNKcFpXNTBZWFJwYjI0bklHVjJaVzUwSUNoMWJtbG1hV1ZrSUhaaGJIVmxjeWxjYmlBZ0lDQnBaaUFvZEdocGN5NXZjbWxsYm5SaGRHbHZiaTVzYVhOMFpXNWxjbk11YzJsNlpTQStJREFnSmlaY2JpQWdJQ0FnSUNBZ2RHaHBjeTV5WlhGMWFYSmxaQzV2Y21sbGJuUmhkR2x2YmlBbUpseHVJQ0FnSUNBZ0lDQjBhR2x6TG05eWFXVnVkR0YwYVc5dUxtbHpVSEp2ZG1sa1pXUmNiaUFnSUNBcElIdGNiaUFnSUNBZ0lDOHZJRTl1SUdsUFV5d2dkR2hsSUdCaGJIQm9ZV0FnZG1Gc2RXVWdhWE1nYVc1cGRHbGhiR2w2WldRZ1lYUWdZREJnSUc5dUlIUm9aU0JtYVhKemRDQmdaR1YyYVdObGIzSnBaVzUwWVhScGIyNWdJR1YyWlc1MFhHNGdJQ0FnSUNBdkx5QnpieUIzWlNCclpXVndJSFJvWVhRZ2NtVm1aWEpsYm1ObElHbHVJRzFsYlc5eWVTQjBieUJqWVd4amRXeGhkR1VnZEdobElFNXZjblJvSUd4aGRHVnlJRzl1WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNKcFpXNTBZWFJwYjI0dVgzZGxZbXRwZEVOdmJYQmhjM05JWldGa2FXNW5VbVZtWlhKbGJtTmxJQ1ltSUdVdWQyVmlhMmwwUTI5dGNHRnpjMGhsWVdScGJtY2dKaVlnY0d4aGRHWnZjbTB1YjNNdVptRnRhV3g1SUQwOVBTQW5hVTlUSnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y21sbGJuUmhkR2x2Ymk1ZmQyVmlhMmwwUTI5dGNHRnpjMGhsWVdScGJtZFNaV1psY21WdVkyVWdQU0JsTG5kbFltdHBkRU52YlhCaGMzTklaV0ZrYVc1bk8xeHVYRzRnSUNBZ0lDQnNaWFFnYjNWMFJYWmxiblFnUFNCMGFHbHpMbTl5YVdWdWRHRjBhVzl1TG1WMlpXNTBPMXh1WEc0Z0lDQWdJQ0J2ZFhSRmRtVnVkRnN3WFNBOUlHVXVZV3h3YUdFN1hHNGdJQ0FnSUNCdmRYUkZkbVZ1ZEZzeFhTQTlJR1V1WW1WMFlUdGNiaUFnSUNBZ0lHOTFkRVYyWlc1MFd6SmRJRDBnWlM1bllXMXRZVHRjYmx4dUlDQWdJQ0FnTHk4Z1QyNGdhVTlUTENCeVpYQnNZV05sSUhSb1pTQmdZV3h3YUdGZ0lIWmhiSFZsSUdKNUlIUm9aU0JPYjNKMGFDQjJZV3gxWlNCaGJtUWdkVzVwWm5rZ2RHaGxJR0Z1WjJ4bGMxeHVJQ0FnSUNBZ0x5OGdLSFJvWlNCa1pXWmhkV3gwSUhKbGNISmxjMlZ1ZEdGMGFXOXVJRzltSUhSb1pTQmhibWRzWlhNZ2IyNGdhVTlUSUdseklHNXZkQ0JqYjIxd2JHbGhiblFnZDJsMGFDQjBhR1VnVnpORElITndaV05wWm1sallYUnBiMjRwWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y21sbGJuUmhkR2x2Ymk1ZmQyVmlhMmwwUTI5dGNHRnpjMGhsWVdScGJtZFNaV1psY21WdVkyVWdKaVlnY0d4aGRHWnZjbTB1YjNNdVptRnRhV3g1SUQwOVBTQW5hVTlUSnlrZ2UxeHVJQ0FnSUNBZ0lDQnZkWFJGZG1WdWRGc3dYU0FyUFNBek5qQWdMU0IwYUdsekxtOXlhV1Z1ZEdGMGFXOXVMbDkzWldKcmFYUkRiMjF3WVhOelNHVmhaR2x1WjFKbFptVnlaVzVqWlR0Y2JpQWdJQ0FnSUNBZ2RXNXBabmtvYjNWMFJYWmxiblFwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl5YVdWdWRHRjBhVzl1TG1WdGFYUW9iM1YwUlhabGJuUXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJQ2R2Y21sbGJuUmhkR2x2YmtGc2RDY2daWFpsYm5SY2JpQWdJQ0JwWmlBb2RHaHBjeTV2Y21sbGJuUmhkR2x2YmtGc2RDNXNhWE4wWlc1bGNuTXVjMmw2WlNBK0lEQWdKaVpjYmlBZ0lDQWdJQ0FnZEdocGN5NXlaWEYxYVhKbFpDNXZjbWxsYm5SaGRHbHZia0ZzZENBbUpseHVJQ0FnSUNBZ0lDQjBhR2x6TG05eWFXVnVkR0YwYVc5dVFXeDBMbWx6VUhKdmRtbGtaV1JjYmlBZ0lDQXBJSHRjYmlBZ0lDQWdJQzh2SUU5dUlHbFBVeXdnZEdobElHQmhiSEJvWVdBZ2RtRnNkV1VnYVhNZ2FXNXBkR2xoYkdsNlpXUWdZWFFnWURCZ0lHOXVJSFJvWlNCbWFYSnpkQ0JnWkdWMmFXTmxiM0pwWlc1MFlYUnBiMjVnSUdWMlpXNTBYRzRnSUNBZ0lDQXZMeUJ6YnlCM1pTQnJaV1Z3SUhSb1lYUWdjbVZtWlhKbGJtTmxJR2x1SUcxbGJXOXllU0IwYnlCallXeGpkV3hoZEdVZ2RHaGxJRTV2Y25Sb0lHeGhkR1Z5SUc5dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzSnBaVzUwWVhScGIyNUJiSFF1WDNkbFltdHBkRU52YlhCaGMzTklaV0ZrYVc1blVtVm1aWEpsYm1ObElDWW1JR1V1ZDJWaWEybDBRMjl0Y0dGemMwaGxZV1JwYm1jZ0ppWWdjR3hoZEdadmNtMHViM011Wm1GdGFXeDVJRDA5UFNBbmFVOVRKeWxjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjbWxsYm5SaGRHbHZia0ZzZEM1ZmQyVmlhMmwwUTI5dGNHRnpjMGhsWVdScGJtZFNaV1psY21WdVkyVWdQU0JsTG5kbFltdHBkRU52YlhCaGMzTklaV0ZrYVc1bk8xeHVYRzRnSUNBZ0lDQnNaWFFnYjNWMFJYWmxiblFnUFNCMGFHbHpMbTl5YVdWdWRHRjBhVzl1UVd4MExtVjJaVzUwTzF4dVhHNGdJQ0FnSUNCdmRYUkZkbVZ1ZEZzd1hTQTlJR1V1WVd4d2FHRTdYRzRnSUNBZ0lDQnZkWFJGZG1WdWRGc3hYU0E5SUdVdVltVjBZVHRjYmlBZ0lDQWdJRzkxZEVWMlpXNTBXekpkSUQwZ1pTNW5ZVzF0WVR0Y2JseHVJQ0FnSUNBZ0x5OGdUMjRnYVU5VExDQnlaWEJzWVdObElIUm9aU0JnWVd4d2FHRmdJSFpoYkhWbElHSjVJSFJvWlNCT2IzSjBhQ0IyWVd4MVpTQmlkWFFnWkc4Z2JtOTBJR052Ym5abGNuUWdkR2hsSUdGdVoyeGxjMXh1SUNBZ0lDQWdMeThnS0hSb1pTQmtaV1poZFd4MElISmxjSEpsYzJWdWRHRjBhVzl1SUc5bUlIUm9aU0JoYm1kc1pYTWdiMjRnYVU5VElHbHpJR052YlhCc2FXRnVkQ0IzYVhSb0lIUm9aU0JoYkhSbGNtNWhkR2wyWlNCeVpYQnlaWE5sYm5SaGRHbHZiaWxjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl5YVdWdWRHRjBhVzl1UVd4MExsOTNaV0pyYVhSRGIyMXdZWE56U0dWaFpHbHVaMUpsWm1WeVpXNWpaU0FtSmlCd2JHRjBabTl5YlM1dmN5NW1ZVzFwYkhrZ1BUMDlJQ2RwVDFNbktYdGNiaUFnSUNBZ0lDQWdiM1YwUlhabGJuUmJNRjBnTFQwZ2RHaHBjeTV2Y21sbGJuUmhkR2x2YmtGc2RDNWZkMlZpYTJsMFEyOXRjR0Z6YzBobFlXUnBibWRTWldabGNtVnVZMlU3WEc0Z0lDQWdJQ0FnSUc5MWRFVjJaVzUwV3pCZElDczlJQ2h2ZFhSRmRtVnVkRnN3WFNBOElEQXBJRDhnTXpZd0lEb2dNRHNnTHk4Z2JXRnJaU0J6ZFhKbElHQmhiSEJvWVdBZ2FYTWdhVzRnV3pBc0lDc3pOakJiWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklFOXVJRUZ1WkhKdmFXUXNJSFJ5WVc1elptOXliU0IwYUdVZ1lXNW5iR1Z6SUhSdklIUm9aU0JoYkhSbGNtNWhkR2wyWlNCeVpYQnlaWE5sYm5SaGRHbHZibHh1SUNBZ0lDQWdMeThnS0hSb1pTQmtaV1poZFd4MElISmxjSEpsYzJWdWRHRjBhVzl1SUc5bUlIUm9aU0JoYm1kc1pYTWdiMjRnUVc1a2NtOXBaQ0JwY3lCamIyMXdiR2xoYm5RZ2QybDBhQ0IwYUdVZ1Z6TkRJSE53WldOcFptbGpZWFJwYjI0cFhHNGdJQ0FnSUNCcFppQW9jR3hoZEdadmNtMHViM011Wm1GdGFXeDVJRDA5UFNBblFXNWtjbTlwWkNjcFhHNGdJQ0FnSUNBZ0lIVnVhV1o1UVd4MEtHOTFkRVYyWlc1MEtUdGNibHh1SUNBZ0lDQWdkR2hwY3k1dmNtbGxiblJoZEdsdmJrRnNkQzVsYldsMEtHOTFkRVYyWlc1MEtUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMmhsWTJ0eklIZG9aWFJvWlhJZ1lHSmxkR0ZnSUdGdVpDQmdaMkZ0YldGZ0lHTmhiaUJpWlNCallXeGpkV3hoZEdWa0lHWnliMjBnZEdobElHQmhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVZQ0IyWVd4MVpYTWdiM0lnYm05MExseHVJQ0FnS2k5Y2JpQWdYM1J5ZVVGalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhsR1lXeHNZbUZqYXlncElIdGNiaUFnSUNCTmIzUnBiMjVKYm5CMWRDNXlaWEYxYVhKbFRXOWtkV3hsS0NkaFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUp5bGNiaUFnSUNBZ0lDNTBhR1Z1S0NoaFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdsbUlDaGhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVMbWx6Vm1Gc2FXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpiMnhsTG14dlp5aGNJbGRCVWs1SlRrY2dLRzF2ZEdsdmJpMXBibkIxZENrNklGUm9aU0FuWkdWMmFXTmxiM0pwWlc1MFlYUnBiMjRuSUdWMlpXNTBJR1J2WlhNZ2JtOTBJR1Y0YVhOMElHOXlJR1J2WlhNZ2JtOTBJSEJ5YjNacFpHVWdkbUZzZFdWeklHbHVJSGx2ZFhJZ1luSnZkM05sY2l3Z2MyOGdkR2hsSUc5eWFXVnVkR0YwYVc5dUlHOW1JSFJvWlNCa1pYWnBZMlVnYVhNZ1pYTjBhVzFoZEdWa0lHWnliMjBnUkdWMmFXTmxUVzkwYVc5dUozTWdKMkZqWTJWc1pYSmhkR2x2YmtsdVkyeDFaR2x1WjBkeVlYWnBkSGtuSUdWMlpXNTBMaUJUYVc1alpTQjBhR1VnWTI5dGNHRnpjeUJwY3lCdWIzUWdZWFpoYVd4aFlteGxMQ0J2Ym14NUlIUm9aU0JnWW1WMFlXQWdZVzVrSUdCbllXMXRZV0FnWVc1bmJHVnpJR0Z5WlNCd2NtOTJhV1JsWkNBb1lHRnNjR2hoWUNCcGN5QnVkV3hzS1M1Y0lpazdYRzVjYmlBZ0lDQWdJQ0FnSUNCcFppQW9kR2hwY3k1eVpYRjFhWEpsWkM1dmNtbGxiblJoZEdsdmJpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y21sbGJuUmhkR2x2Ymk1cGMwTmhiR04xYkdGMFpXUWdQU0IwY25WbE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXZjbWxsYm5SaGRHbHZiaTV3WlhKcGIyUWdQU0JoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1TG5CbGNtbHZaRHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdUVzkwYVc5dVNXNXdkWFF1WVdSa1RHbHpkR1Z1WlhJb0oyRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIa25MQ0FvWVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5allXeGpkV3hoZEdWQ1pYUmhRVzVrUjJGdGJXRkdjbTl0UVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVNoaFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxuSmxjWFZwY21Wa0xtOXlhV1Z1ZEdGMGFXOXVRV3gwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtOXlhV1Z1ZEdGMGFXOXVRV3gwTG1selEyRnNZM1ZzWVhSbFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtOXlhV1Z1ZEdGMGFXOXVRV3gwTG5CbGNtbHZaQ0E5SUdGalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhrdWNHVnlhVzlrTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0JOYjNScGIyNUpibkIxZEM1aFpHUk1hWE4wWlc1bGNpZ25ZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlU2NzSUNoaFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgyTmhiR04xYkdGMFpVSmxkR0ZCYm1SSFlXMXRZVVp5YjIxQlkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUtHRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIa3NJSFJ5ZFdVcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVmY0hKdmJXbHpaVkpsYzI5c2RtVW9kR2hwY3lrN1hHNGdJQ0FnSUNCOUtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEWVd4amRXeGhkR1Z6SUdGdVpDQmxiV2wwY3lCZ1ltVjBZV0FnWVc1a0lHQm5ZVzF0WVdBZ2RtRnNkV1Z6SUdGeklHRWdabUZzYkdKaFkyc2diMllnZEdobElHQnZjbWxsYm5SaGRHbHZibUFnWVc1a0lDOGdiM0lnWUc5eWFXVnVkR0YwYVc5dVFXeDBZQ0JsZG1WdWRITXNJR1p5YjIwZ2RHaGxJR0JoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1WUNCMWJtbG1hV1ZrSUhaaGJIVmxjeTVjYmlBZ0lDcGNiaUFnSUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEpiWFgwZ1lXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVTQXRJRXhoZEdWemRDQmdZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlU0J5WVhjZ2RtRnNkV1Z6TGx4dUlDQWdLaUJBY0dGeVlXMGdlMkp2YjJ4OUlGdGhiSFE5Wm1Gc2MyVmRJQzBnU1c1a2FXTmhkR1Z6SUhkb1pYUm9aWElnZDJVZ2JtVmxaQ0IwYUdVZ1lXeDBaWEp1WVhSbElISmxjSEpsYzJWdWRHRjBhVzl1SUc5bUlIUm9aU0JoYm1kc1pYTWdiM0lnYm05MExseHVJQ0FnS2k5Y2JpQWdYMk5oYkdOMWJHRjBaVUpsZEdGQmJtUkhZVzF0WVVaeWIyMUJZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVLR0ZqWTJWc1pYSmhkR2x2YmtsdVkyeDFaR2x1WjBkeVlYWnBkSGtzSUdGc2RDQTlJR1poYkhObEtTQjdYRzRnSUNBZ1kyOXVjM1FnYXlBOUlEQXVPRHRjYmx4dUlDQWdJQzh2SUV4dmR5QndZWE56SUdacGJIUmxjaUIwYnlCbGMzUnBiV0YwWlNCMGFHVWdaM0poZG1sMGVWeHVJQ0FnSUhSb2FYTXVYMlZ6ZEdsdFlYUmxaRWR5WVhacGRIbGJNRjBnUFNCcklDb2dkR2hwY3k1ZlpYTjBhVzFoZEdWa1IzSmhkbWwwZVZzd1hTQXJJQ2d4SUMwZ2F5a2dLaUJoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1V3pCZE8xeHVJQ0FnSUhSb2FYTXVYMlZ6ZEdsdFlYUmxaRWR5WVhacGRIbGJNVjBnUFNCcklDb2dkR2hwY3k1ZlpYTjBhVzFoZEdWa1IzSmhkbWwwZVZzeFhTQXJJQ2d4SUMwZ2F5a2dLaUJoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1V3pGZE8xeHVJQ0FnSUhSb2FYTXVYMlZ6ZEdsdFlYUmxaRWR5WVhacGRIbGJNbDBnUFNCcklDb2dkR2hwY3k1ZlpYTjBhVzFoZEdWa1IzSmhkbWwwZVZzeVhTQXJJQ2d4SUMwZ2F5a2dLaUJoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1V3pKZE8xeHVYRzRnSUNBZ2JHVjBJRjluV0NBOUlIUm9hWE11WDJWemRHbHRZWFJsWkVkeVlYWnBkSGxiTUYwN1hHNGdJQ0FnYkdWMElGOW5XU0E5SUhSb2FYTXVYMlZ6ZEdsdFlYUmxaRWR5WVhacGRIbGJNVjA3WEc0Z0lDQWdiR1YwSUY5bldpQTlJSFJvYVhNdVgyVnpkR2x0WVhSbFpFZHlZWFpwZEhsYk1sMDdYRzVjYmlBZ0lDQmpiMjV6ZENCdWIzSnRJRDBnVFdGMGFDNXpjWEowS0Y5bldDQXFJRjluV0NBcklGOW5XU0FxSUY5bldTQXJJRjluV2lBcUlGOW5XaWs3WEc1Y2JpQWdJQ0JmWjFnZ0x6MGdibTl5YlR0Y2JpQWdJQ0JmWjFrZ0x6MGdibTl5YlR0Y2JpQWdJQ0JmWjFvZ0x6MGdibTl5YlR0Y2JseHVJQ0FnSUM4dklFRmtiM0IwYVc1bklIUm9aU0JtYjJ4c2IzZHBibWNnWTI5dWRtVnVkR2x2Ym5NNlhHNGdJQ0FnTHk4Z0xTQmxZV05vSUcxaGRISnBlQ0J2Y0dWeVlYUmxjeUJpZVNCd2NtVXRiWFZzZEdsd2JIbHBibWNnWTI5c2RXMXVJSFpsWTNSdmNuTXNYRzRnSUNBZ0x5OGdMU0JsWVdOb0lHMWhkSEpwZUNCeVpYQnlaWE5sYm5SeklHRnVJR0ZqZEdsMlpTQnliM1JoZEdsdmJpeGNiaUFnSUNBdkx5QXRJR1ZoWTJnZ2JXRjBjbWw0SUhKbGNISmxjMlZ1ZEhNZ2RHaGxJR052YlhCdmMybDBhVzl1SUc5bUlHbHVkSEpwYm5OcFl5QnliM1JoZEdsdmJuTXNYRzRnSUNBZ0x5OGdkR2hsSUhKdmRHRjBhVzl1SUcxaGRISnBlQ0J5WlhCeVpYTmxiblJwYm1jZ2RHaGxJR052YlhCdmMybDBhVzl1SUc5bUlHRWdjbTkwWVhScGIyNWNiaUFnSUNBdkx5QmhZbTkxZENCMGFHVWdlQzFoZUdseklHSjVJR0Z1SUdGdVoyeGxJR0psZEdFZ1lXNWtJR0VnY205MFlYUnBiMjRnWVdKdmRYUWdkR2hsSUhrdFlYaHBjMXh1SUNBZ0lDOHZJR0o1SUdGdUlHRnVaMnhsSUdkaGJXMWhJR2x6T2x4dUlDQWdJQzh2WEc0Z0lDQWdMeThnV3lCamIzTW9aMkZ0YldFcElDQWdJQ0FnSUNBZ0lDQWdJQ0FnTENBZ01DQWdJQ0FnSUNBZ0lDQXNJQ0J6YVc0b1oyRnRiV0VwSUNBZ0lDQWdJQ0FnSUNBZ0lDQXNYRzRnSUNBZ0x5OGdJQ0J6YVc0b1ltVjBZU2tnS2lCemFXNG9aMkZ0YldFcElDQWdMQ0FnWTI5ektHSmxkR0VwSUNBc0lDQXRZMjl6S0dkaGJXMWhLU0FxSUhOcGJpaGlaWFJoS1NBc1hHNGdJQ0FnTHk4Z0lDQXRZMjl6S0dKbGRHRXBJQ29nYzJsdUtHZGhiVzFoS1NBZ0xDQWdjMmx1S0dKbGRHRXBJQ0FzSUNCamIzTW9ZbVYwWVNrZ0tpQmpiM01vWjJGdGJXRXBJQ0JkTGx4dUlDQWdJQzh2WEc0Z0lDQWdMeThnU0dWdVkyVXNJSFJvWlNCd2NtOXFaV04wYVc5dUlHOW1JSFJvWlNCdWIzSnRZV3hwZW1Wa0lHZHlZWFpwZEhrZ1p5QTlJRnN3TENBd0xDQXhYVnh1SUNBZ0lDOHZJR2x1SUhSb1pTQmtaWFpwWTJVbmN5QnlaV1psY21WdVkyVWdabkpoYldVZ1kyOXljbVZ6Y0c5dVpITWdkRzg2WEc0Z0lDQWdMeTljYmlBZ0lDQXZMeUJuV0NBOUlDMWpiM01vWW1WMFlTa2dLaUJ6YVc0b1oyRnRiV0VwTEZ4dUlDQWdJQzh2SUdkWklEMGdjMmx1S0dKbGRHRXBMRnh1SUNBZ0lDOHZJR2RhSUQwZ1kyOXpLR0psZEdFcElDb2dZMjl6S0dkaGJXMWhLU3hjYmlBZ0lDQXZMMXh1SUNBZ0lDOHZJSE52SUdKbGRHRWdQU0JoYzJsdUtHZFpLU0JoYm1RZ1oyRnRiV0VnUFNCaGRHRnVNaWd0WjFnc0lHZGFLUzVjYmx4dUlDQWdJQzh2SUVKbGRHRWdKaUJuWVcxdFlTQmxjWFZoZEdsdmJuTWdLSGRsSUdGd2NISnZlR2x0WVhSbElGdG5XQ3dnWjFrc0lHZGFYU0JpZVNCYlgyZFlMQ0JmWjFrc0lGOW5XbDBwWEc0Z0lDQWdiR1YwSUdKbGRHRWdQU0J5WVdSVWIwUmxaeWhOWVhSb0xtRnphVzRvWDJkWktTazdJQzh2SUdKbGRHRWdhWE1nYVc0Z1d5MXdhUzh5T3lCd2FTOHlXMXh1SUNBZ0lHeGxkQ0JuWVcxdFlTQTlJSEpoWkZSdlJHVm5LRTFoZEdndVlYUmhiaklvTFY5bldDd2dYMmRhS1NrN0lDOHZJR2RoYlcxaElHbHpJR2x1SUZzdGNHazdJSEJwVzF4dVhHNGdJQ0FnYVdZZ0tHRnNkQ2tnZTF4dUlDQWdJQ0FnTHk4Z1NXNGdkR2hoZENCallYTmxMQ0IwYUdWeVpTQnBjeUJ1YjNSb2FXNW5JSFJ2SUdSdklITnBibU5sSUhSb1pTQmpZV3hqZFd4aGRHbHZibk1nWVdKdmRtVWdaMkYyWlNCMGFHVWdZVzVuYkdVZ2FXNGdkR2hsSUhKcFoyaDBJSEpoYm1kbGMxeHVJQ0FnSUNBZ2JHVjBJRzkxZEVWMlpXNTBJRDBnZEdocGN5NXZjbWxsYm5SaGRHbHZia0ZzZEM1bGRtVnVkRHRjYmlBZ0lDQWdJRzkxZEVWMlpXNTBXekJkSUQwZ2JuVnNiRHRjYmlBZ0lDQWdJRzkxZEVWMlpXNTBXekZkSUQwZ1ltVjBZVHRjYmlBZ0lDQWdJRzkxZEVWMlpXNTBXekpkSUQwZ1oyRnRiV0U3WEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0pwWlc1MFlYUnBiMjVCYkhRdVpXMXBkQ2h2ZFhSRmRtVnVkQ2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDOHZJRWhsY21VZ2QyVWdhR0YyWlNCMGJ5QjFibWxtZVNCMGFHVWdZVzVuYkdWeklIUnZJR2RsZENCMGFHVWdjbUZ1WjJWeklHTnZiWEJzYVdGdWRDQjNhWFJvSUhSb1pTQlhNME1nYzNCbFkybG1hV05oZEdsdmJseHVJQ0FnSUNBZ2JHVjBJRzkxZEVWMlpXNTBJRDBnZEdocGN5NXZjbWxsYm5SaGRHbHZiaTVsZG1WdWREdGNiaUFnSUNBZ0lHOTFkRVYyWlc1MFd6QmRJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lHOTFkRVYyWlc1MFd6RmRJRDBnWW1WMFlUdGNiaUFnSUNBZ0lHOTFkRVYyWlc1MFd6SmRJRDBnWjJGdGJXRTdYRzRnSUNBZ0lDQjFibWxtZVNodmRYUkZkbVZ1ZENrN1hHNWNiaUFnSUNBZ0lIUm9hWE11YjNKcFpXNTBZWFJwYjI0dVpXMXBkQ2h2ZFhSRmRtVnVkQ2s3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnWDNCeWIyTmxjM01vWkdGMFlTa2dlMXh1SUNBZ0lIUm9hWE11WDNCeWIyTmxjM05HZFc1amRHbHZiaWhrWVhSaEtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJKYm1sMGFXRnNhWHBsY3lCdlppQjBhR1VnYlc5a2RXeGxMbHh1SUNBZ0tseHVJQ0FnS2lCQWNtVjBkWEp1SUh0UWNtOXRhWE5sZlZ4dUlDQWdLaTljYmlBZ2FXNXBkQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdjM1Z3WlhJdWFXNXBkQ2dvY21WemIyeDJaU2tnUFQ0Z2UxeHVJQ0FnSUNBZ2RHaHBjeTVmY0hKdmJXbHpaVkpsYzI5c2RtVWdQU0J5WlhOdmJIWmxPMXh1WEc0Z0lDQWdJQ0JwWmlBb2QybHVaRzkzTGtSbGRtbGpaVTl5YVdWdWRHRjBhVzl1UlhabGJuUXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjSEp2WTJWemMwWjFibU4wYVc5dUlEMGdkR2hwY3k1ZlpHVjJhV05sYjNKcFpXNTBZWFJwYjI1RGFHVmphenRjYmlBZ0lDQWdJQ0FnTHk4Z1ptVmhkSFZ5WlNCa1pYUmxZM1JjYmlBZ0lDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCRVpYWnBZMlZQY21sbGJuUmhkR2x2YmtWMlpXNTBMbkpsY1hWbGMzUlFaWEp0YVhOemFXOXVJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJQ0FnUkdWMmFXTmxUM0pwWlc1MFlYUnBiMjVGZG1WdWRDNXlaWEYxWlhOMFVHVnliV2x6YzJsdmJpZ3BYRzRnSUNBZ0lDQWdJQ0FnSUNBdWRHaGxiaWh3WlhKdGFYTnphVzl1VTNSaGRHVWdQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2NHVnliV2x6YzJsdmJsTjBZWFJsSUQwOVBTQW5aM0poYm5SbFpDY3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IzYVc1a2IzY3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25aR1YyYVdObGIzSnBaVzUwWVhScGIyNG5MQ0IwYUdsekxsOXdjbTlqWlhOekxDQm1ZV3h6WlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdjMlYwSUdaaGJHeGlZV05ySUhScGJXVnZkWFFnWm05eUlFWnBjbVZtYjNnZ0tHbDBjeUIzYVc1a2IzY2dibVYyWlhJZ1kyRnNiR2x1WnlCMGFHVWdSR1YyYVdObFQzSnBaVzUwWVhScGIyNGdaWFpsYm5Rc0lHRWdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnY21WeGRXbHlaU0J2WmlCMGFHVWdSR1YyYVdObFQzSnBaVzUwWVhScGIyNGdjMlZ5ZG1salpTQjNhV3hzSUhKbGMzVnNkQ0JwYmlCMGFHVWdjbVZ4ZFdseVpTQndjbTl0YVhObElHNWxkbVZ5SUdKbGFXNW5JSEpsYzI5c2RtVmtYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnYUdWdVkyVWdkR2hsSUVWNGNHVnlhVzFsYm5RZ2MzUmhjblFvS1NCdFpYUm9iMlFnYm1WMlpYSWdZMkZzYkdWa0tWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDJOb1pXTnJWR2x0Wlc5MWRFbGtJRDBnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUJ5WlhOdmJIWmxLSFJvYVhNcExDQTFNREFwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVnh1SUNBZ0lDQWdJQ0FnSUNBZ0xtTmhkR05vS0dOdmJuTnZiR1V1WlhKeWIzSXBPMXh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUM4dklHaGhibVJzWlNCeVpXZDFiR0Z5SUc1dmJpQnBUMU1nTVRNcklHUmxkbWxqWlhOY2JpQWdJQ0FnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblpHVjJhV05sYjNKcFpXNTBZWFJwYjI0bkxDQjBhR2x6TGw5d2NtOWpaWE56TENCbVlXeHpaU2s3WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdjMlYwSUdaaGJHeGlZV05ySUhScGJXVnZkWFFnWm05eUlFWnBjbVZtYjNnZ0tHbDBjeUIzYVc1a2IzY2dibVYyWlhJZ1kyRnNiR2x1WnlCMGFHVWdSR1YyYVdObFQzSnBaVzUwWVhScGIyNGdaWFpsYm5Rc0lHRWdYRzRnSUNBZ0lDQWdJQ0FnTHk4Z2NtVnhkV2x5WlNCdlppQjBhR1VnUkdWMmFXTmxUM0pwWlc1MFlYUnBiMjRnYzJWeWRtbGpaU0IzYVd4c0lISmxjM1ZzZENCcGJpQjBhR1VnY21WeGRXbHlaU0J3Y205dGFYTmxJRzVsZG1WeUlHSmxhVzVuSUhKbGMyOXNkbVZrWEc0Z0lDQWdJQ0FnSUNBZ0x5OGdhR1Z1WTJVZ2RHaGxJRVY0Y0dWeWFXMWxiblFnYzNSaGNuUW9LU0J0WlhSb2IyUWdibVYyWlhJZ1kyRnNiR1ZrS1Z4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11WDJOb1pXTnJWR2x0Wlc5MWRFbGtJRDBnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUJ5WlhOdmJIWmxLSFJvYVhNcExDQTFNREFwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tIUm9hWE11Y21WeGRXbHlaV1F1YjNKcFpXNTBZWFJwYjI0cElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmRISjVRV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlVVpoYkd4aVlXTnJLQ2s3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0J5WlhOdmJIWmxLSFJvYVhNcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcE8xeHVJQ0I5WEc1OVhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHNWxkeUJFWlhacFkyVlBjbWxsYm5SaGRHbHZiazF2WkhWc1pTZ3BPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlOyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9O1xuXG52YXIgX0lucHV0TW9kdWxlMiA9IHJlcXVpcmUoJy4vSW5wdXRNb2R1bGUnKTtcblxudmFyIF9JbnB1dE1vZHVsZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9JbnB1dE1vZHVsZTIpO1xuXG52YXIgX0RPTUV2ZW50U3VibW9kdWxlID0gcmVxdWlyZSgnLi9ET01FdmVudFN1Ym1vZHVsZScpO1xuXG52YXIgX0RPTUV2ZW50U3VibW9kdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0RPTUV2ZW50U3VibW9kdWxlKTtcblxudmFyIF9Nb3Rpb25JbnB1dCA9IHJlcXVpcmUoJy4vTW90aW9uSW5wdXQnKTtcblxudmFyIF9Nb3Rpb25JbnB1dDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Nb3Rpb25JbnB1dCk7XG5cbnZhciBfcGxhdGZvcm0gPSByZXF1aXJlKCdwbGF0Zm9ybScpO1xuXG52YXIgX3BsYXRmb3JtMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BsYXRmb3JtKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG4vKipcbiAqIEdldHMgdGhlIGN1cnJlbnQgbG9jYWwgdGltZSBpbiBzZWNvbmRzLlxuICogVXNlcyBgd2luZG93LnBlcmZvcm1hbmNlLm5vdygpYCBpZiBhdmFpbGFibGUsIGFuZCBgRGF0ZS5ub3coKWAgb3RoZXJ3aXNlLlxuICpcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0TG9jYWxUaW1lKCkge1xuICBpZiAod2luZG93LnBlcmZvcm1hbmNlKSByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMDtcbiAgcmV0dXJuIERhdGUubm93KCkgLyAxMDAwO1xufVxuXG52YXIgY2hyb21lUmVnRXhwID0gL0Nocm9tZS87XG52YXIgdG9EZWcgPSAxODAgLyBNYXRoLlBJO1xuXG4vKipcbiAqIGBEZXZpY2VNb3Rpb25gIG1vZHVsZSBzaW5nbGV0b24uXG4gKiBUaGUgYERldmljZU1vdGlvbk1vZHVsZWAgc2luZ2xldG9uIHByb3ZpZGVzIHRoZSByYXcgdmFsdWVzXG4gKiBvZiB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5LCBhY2NlbGVyYXRpb24sIGFuZCByb3RhdGlvblxuICogcmF0ZSBwcm92aWRlZCBieSB0aGUgYERldmljZU1vdGlvbmAgZXZlbnQuXG4gKiBJdCBhbHNvIGluc3RhbnRpYXRlIHRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsXG4gKiBgQWNjZWxlcmF0aW9uYCBhbmQgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlcyB0aGF0IHVuaWZ5IHRob3NlIHZhbHVlc1xuICogYWNyb3NzIHBsYXRmb3JtcyBieSBtYWtpbmcgdGhlbSBjb21wbGlhbnQgd2l0aCB7QGxpbmtcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSL29yaWVudGF0aW9uLWV2ZW50L3x0aGUgVzNDIHN0YW5kYXJkfS5cbiAqIFdoZW4gcmF3IHZhbHVlcyBhcmUgbm90IHByb3ZpZGVkIGJ5IHRoZSBzZW5zb3JzLCB0aGlzIG1vZHVsZXMgdHJpZXNcbiAqIHRvIHJlY2FsY3VsYXRlIHRoZW0gZnJvbSBhdmFpbGFibGUgdmFsdWVzOlxuICogLSBgYWNjZWxlcmF0aW9uYCBpcyBjYWxjdWxhdGVkIGZyb20gYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgXG4gKiAgIHdpdGggYSBoaWdoLXBhc3MgZmlsdGVyO1xuICogLSAoY29taW5nIHNvb24g4oCUIHdhaXRpbmcgZm9yIGEgYnVnIG9uIENocm9tZSB0byBiZSByZXNvbHZlZClcbiAqICAgYHJvdGF0aW9uUmF0ZWAgaXMgY2FsY3VsYXRlZCBmcm9tIGBvcmllbnRhdGlvbmAuXG4gKlxuICogQGNsYXNzIERldmljZU1vdGlvbk1vZHVsZVxuICogQGV4dGVuZHMgSW5wdXRNb2R1bGVcbiAqL1xuXG52YXIgRGV2aWNlTW90aW9uTW9kdWxlID0gZnVuY3Rpb24gKF9JbnB1dE1vZHVsZSkge1xuICBfaW5oZXJpdHMoRGV2aWNlTW90aW9uTW9kdWxlLCBfSW5wdXRNb2R1bGUpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBgRGV2aWNlTW90aW9uYCBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZnVuY3Rpb24gRGV2aWNlTW90aW9uTW9kdWxlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEZXZpY2VNb3Rpb25Nb2R1bGUpO1xuXG4gICAgLyoqXG4gICAgICogUmF3IHZhbHVlcyBjb21pbmcgZnJvbSB0aGUgYGRldmljZW1vdGlvbmAgZXZlbnQgc2VudCBieSB0aGlzIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF1cbiAgICAgKi9cbiAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoRGV2aWNlTW90aW9uTW9kdWxlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRGV2aWNlTW90aW9uTW9kdWxlKSkuY2FsbCh0aGlzLCAnZGV2aWNlbW90aW9uJykpO1xuXG4gICAgX3RoaXMuZXZlbnQgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIG1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uIGluY2x1ZGluZyBncmF2aXR5LlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqL1xuICAgIF90aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBuZXcgX0RPTUV2ZW50U3VibW9kdWxlMi5kZWZhdWx0KF90aGlzLCAnYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NlbGVyYXRpb25gIHN1Ym1vZHVsZS5cbiAgICAgKiBQcm92aWRlcyB1bmlmaWVkIHZhbHVlcyBvZiB0aGUgYWNjZWxlcmF0aW9uLlxuICAgICAqIEVzdGltYXRlcyB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlcyBmcm9tIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YFxuICAgICAqIHJhdyB2YWx1ZXMgaWYgdGhlIGFjY2VsZXJhdGlvbiByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIG9uIHRoZVxuICAgICAqIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICBfdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgX0RPTUV2ZW50U3VibW9kdWxlMi5kZWZhdWx0KF90aGlzLCAnYWNjZWxlcmF0aW9uJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYFJvdGF0aW9uUmF0ZWAgc3VibW9kdWxlLlxuICAgICAqIFByb3ZpZGVzIHVuaWZpZWQgdmFsdWVzIG9mIHRoZSByb3RhdGlvbiByYXRlLlxuICAgICAqIChjb21pbmcgc29vbiwgd2FpdGluZyBmb3IgYSBidWcgb24gQ2hyb21lIHRvIGJlIHJlc29sdmVkKVxuICAgICAqIEVzdGltYXRlcyB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgZnJvbSBgb3JpZW50YXRpb25gIHZhbHVlcyBpZlxuICAgICAqIHRoZSByb3RhdGlvbiByYXRlIHJhdyB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgb24gdGhlIGRldmljZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKi9cbiAgICBfdGhpcy5yb3RhdGlvblJhdGUgPSBuZXcgX0RPTUV2ZW50U3VibW9kdWxlMi5kZWZhdWx0KF90aGlzLCAncm90YXRpb25SYXRlJyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXF1aXJlZCBzdWJtb2R1bGVzIC8gZXZlbnRzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gYWNjZWxlcmF0aW9uIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGBhY2NlbGVyYXRpb25gIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbH0gcm90YXRpb25SYXRlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzIGFyZSByZXF1aXJlZCBvciBub3QgKGRlZmF1bHRzIHRvIGBmYWxzZWApLlxuICAgICAqL1xuICAgIF90aGlzLnJlcXVpcmVkID0ge1xuICAgICAgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTogZmFsc2UsXG4gICAgICBhY2NlbGVyYXRpb246IGZhbHNlLFxuICAgICAgcm90YXRpb25SYXRlOiBmYWxzZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIGZ1bmN0aW9uIG9mIHRoZSBtb2R1bGUncyBwcm9taXNlLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZU1vdGlvbk1vZHVsZSNpbml0XG4gICAgICovXG4gICAgX3RoaXMuX3Byb21pc2VSZXNvbHZlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFVuaWZ5aW5nIGZhY3RvciBvZiB0aGUgbW90aW9uIGRhdGEgdmFsdWVzIChgMWAgb24gQW5kcm9pZCwgYC0xYCBvbiBpT1MpLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBfdGhpcy5fdW5pZnlNb3Rpb25EYXRhID0gX3BsYXRmb3JtMi5kZWZhdWx0Lm9zLmZhbWlseSA9PT0gJ2lPUycgPyAtMSA6IDE7XG5cbiAgICAvKipcbiAgICAgKiBVbmlmeWluZyBmYWN0b3Igb2YgdGhlIHBlcmlvZCAoYDFgIG9uIEFuZHJvaWQsIGAxYCBvbiBpT1MpLiBpbiBzZWNcbiAgICAgKiBAdG9kbyAtIHVuaWZ5IHdpdGggZS5pbnRlcnZhbCBzcGVjaWZpY2F0aW9uIChpbiBtcykgP1xuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBfdGhpcy5fdW5pZnlQZXJpb2QgPSBfcGxhdGZvcm0yLmRlZmF1bHQub3MuZmFtaWx5ID09PSAnQW5kcm9pZCcgPyAwLjAwMSA6IDE7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlbGVyYXRpb24gY2FsY3VsYXRlZCBmcm9tIHRoZSBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICBfdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvbiA9IFswLCAwLCAwXTtcblxuICAgIC8qKlxuICAgICAqIFRpbWUgY29uc3RhbnQgKGhhbGYtbGlmZSkgb2YgdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGFjY2VsZXJhdGlvbiB2YWx1ZXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHkgcmF3IHZhbHVlcyAoaW4gc2Vjb25kcykuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDAuMVxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIF90aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50ID0gMC4xO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCByYXcgdmFsdWUsIHVzZWQgaW4gdGhlIGhpZ2gtcGFzcyBmaWx0ZXIgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gKGlmIHRoZSBgYWNjZWxlcmF0aW9uYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICBfdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPSBbMCwgMCwgMF07XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGlvbiByYXRlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgb3JpZW50YXRpb24gdmFsdWVzLlxuICAgICAqXG4gICAgICogQHRoaXMgRGV2aWNlTW90aW9uTW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqIEBkZWZhdWx0IFswLCAwLCAwXVxuICAgICAqL1xuICAgIF90aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHZhbHVlLCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gcmF0ZSAgKGlmIHRoZSBgcm90YXRpb25SYXRlYCB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZCBieSBgJ2RldmljZW1vdGlvbidgKS5cbiAgICAgKlxuICAgICAqIEB0aGlzIERldmljZU1vdGlvbk1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBbMCwgMCwgMF1cbiAgICAgKi9cbiAgICBfdGhpcy5fbGFzdE9yaWVudGF0aW9uID0gWzAsIDAsIDBdO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IG9yaWVudGF0aW9uIHRpbWVzdGFtcHMsIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3RhdGlvbiByYXRlIChpZiB0aGUgYHJvdGF0aW9uUmF0ZWAgdmFsdWVzIGFyZSBub3QgcHJvdmlkZWQgYnkgYCdkZXZpY2Vtb3Rpb24nYCkuXG4gICAgICpcbiAgICAgKiBAdGhpcyBEZXZpY2VNb3Rpb25Nb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgWzAsIDAsIDBdXG4gICAgICovXG4gICAgX3RoaXMuX2xhc3RPcmllbnRhdGlvblRpbWVzdGFtcCA9IG51bGw7XG5cbiAgICBfdGhpcy5fcHJvY2Vzc0Z1bmN0aW9uID0gbnVsbDtcbiAgICBfdGhpcy5fcHJvY2VzcyA9IF90aGlzLl9wcm9jZXNzLmJpbmQoX3RoaXMpO1xuICAgIF90aGlzLl9kZXZpY2Vtb3Rpb25DaGVjayA9IF90aGlzLl9kZXZpY2Vtb3Rpb25DaGVjay5iaW5kKF90aGlzKTtcbiAgICBfdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIgPSBfdGhpcy5fZGV2aWNlbW90aW9uTGlzdGVuZXIuYmluZChfdGhpcyk7XG5cbiAgICBfdGhpcy5fY2hlY2tDb3VudGVyID0gMDtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICAvKipcbiAgICogRGVjYXkgZmFjdG9yIG9mIHRoZSBoaWdoLXBhc3MgZmlsdGVyIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgIHJhdyB2YWx1ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhEZXZpY2VNb3Rpb25Nb2R1bGUsIFt7XG4gICAga2V5OiAnX2RldmljZW1vdGlvbkNoZWNrJyxcblxuXG4gICAgLyoqXG4gICAgICogU2Vuc29yIGNoZWNrIG9uIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb2R1bGUuXG4gICAgICogVGhpcyBtZXRob2Q6XG4gICAgICogLSBjaGVja3Mgd2hldGhlciB0aGUgYGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlgLCB0aGUgYGFjY2VsZXJhdGlvbmAsXG4gICAgICogICBhbmQgdGhlIGByb3RhdGlvblJhdGVgIHZhbHVlcyBhcmUgdmFsaWQgb3Igbm90O1xuICAgICAqIC0gZ2V0cyB0aGUgcGVyaW9kIG9mIHRoZSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IGFuZCBzZXRzIHRoZSBwZXJpb2Qgb2ZcbiAgICAgKiAgIHRoZSBgQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBBY2NlbGVyYXRpb25gLCBhbmQgYFJvdGF0aW9uUmF0ZWBcbiAgICAgKiAgIHN1Ym1vZHVsZXM7XG4gICAgICogLSAoaW4gdGhlIGNhc2Ugd2hlcmUgYWNjZWxlcmF0aW9uIHJhdyB2YWx1ZXMgYXJlIG5vdCBwcm92aWRlZClcbiAgICAgKiAgIGluZGljYXRlcyB3aGV0aGVyIHRoZSBhY2NlbGVyYXRpb24gY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGVcbiAgICAgKiAgIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcyBvciBub3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gVGhlIGZpcnN0IGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2F1Z2h0LlxuICAgICAqL1xuICAgIHZhbHVlOiBmdW5jdGlvbiBfZGV2aWNlbW90aW9uQ2hlY2soZSkge1xuICAgICAgLy8gY2xlYXIgdGltZW91dCAoYW50aS1GaXJlZm94IGJ1ZyBzb2x1dGlvbiwgd2luZG93IGV2ZW50IGRldmljZW9yaWVudGF0aW9uIGJlaW5nIG52ZXIgY2FsbGVkKVxuICAgICAgLy8gc2V0IHRoZSBzZXQgdGltZW91dCBpbiBpbml0KCkgZnVuY3Rpb25cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9jaGVja1RpbWVvdXRJZCk7XG5cbiAgICAgIHRoaXMuaXNQcm92aWRlZCA9IHRydWU7XG4gICAgICB0aGlzLnBlcmlvZCA9IGUuaW50ZXJ2YWwgLyAxMDAwO1xuICAgICAgdGhpcy5pbnRlcnZhbCA9IGUuaW50ZXJ2YWw7XG5cbiAgICAgIC8vIFNlbnNvciBhdmFpbGFiaWxpdHkgZm9yIHRoZSBhY2NlbGVyYXRpb24gaW5jbHVkaW5nIGdyYXZpdHlcbiAgICAgIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1Byb3ZpZGVkID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5ICYmIHR5cGVvZiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogPT09ICdudW1iZXInO1xuICAgICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnBlcmlvZCA9IGUuaW50ZXJ2YWwgKiB0aGlzLl91bmlmeVBlcmlvZDtcblxuICAgICAgLy8gU2Vuc29yIGF2YWlsYWJpbGl0eSBmb3IgdGhlIGFjY2VsZXJhdGlvblxuICAgICAgdGhpcy5hY2NlbGVyYXRpb24uaXNQcm92aWRlZCA9IGUuYWNjZWxlcmF0aW9uICYmIHR5cGVvZiBlLmFjY2VsZXJhdGlvbi54ID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgZS5hY2NlbGVyYXRpb24ueSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGUuYWNjZWxlcmF0aW9uLnogPT09ICdudW1iZXInO1xuICAgICAgdGhpcy5hY2NlbGVyYXRpb24ucGVyaW9kID0gZS5pbnRlcnZhbCAqIHRoaXMuX3VuaWZ5UGVyaW9kO1xuXG4gICAgICAvLyBTZW5zb3IgYXZhaWxhYmlsaXR5IGZvciB0aGUgcm90YXRpb24gcmF0ZVxuICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNQcm92aWRlZCA9IGUucm90YXRpb25SYXRlICYmIHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5hbHBoYSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGUucm90YXRpb25SYXRlLmJldGEgPT09ICdudW1iZXInICYmIHR5cGVvZiBlLnJvdGF0aW9uUmF0ZS5nYW1tYSA9PT0gJ251bWJlcic7XG4gICAgICB0aGlzLnJvdGF0aW9uUmF0ZS5wZXJpb2QgPSBlLmludGVydmFsICogdGhpcy5fdW5pZnlQZXJpb2Q7XG5cbiAgICAgIC8vIGluIGZpcmVmb3ggYW5kcm9pZCwgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSByZXRyaWV2ZSBudWxsIHZhbHVlc1xuICAgICAgLy8gb24gdGhlIGZpcnN0IGNhbGxiYWNrLiBzbyB3YWl0IGEgc2Vjb25kIGNhbGwgdG8gYmUgc3VyZS5cbiAgICAgIGlmIChfcGxhdGZvcm0yLmRlZmF1bHQub3MuZmFtaWx5ID09PSAnQW5kcm9pZCcgJiYgL0ZpcmVmb3gvLnRlc3QoX3BsYXRmb3JtMi5kZWZhdWx0Lm5hbWUpICYmIHRoaXMuX2NoZWNrQ291bnRlciA8IDEpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tDb3VudGVyKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBub3cgdGhhdCB0aGUgc2Vuc29ycyBhcmUgY2hlY2tlZCwgcmVwbGFjZSB0aGUgcHJvY2VzcyBmdW5jdGlvbiB3aXRoXG4gICAgICAgIC8vIHRoZSBmaW5hbCBsaXN0ZW5lclxuICAgICAgICB0aGlzLl9wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLl9kZXZpY2Vtb3Rpb25MaXN0ZW5lcjtcblxuICAgICAgICAvLyBpZiBhY2NlbGVyYXRpb24gaXMgbm90IHByb3ZpZGVkIGJ5IHJhdyBzZW5zb3JzLCBpbmRpY2F0ZSB3aGV0aGVyIGl0XG4gICAgICAgIC8vIGNhbiBiZSBjYWxjdWxhdGVkIHdpdGggYGFjY2VsZXJhdGlvbmluY2x1ZGluZ2dyYXZpdHlgIG9yIG5vdFxuICAgICAgICBpZiAoIXRoaXMuYWNjZWxlcmF0aW9uLmlzUHJvdmlkZWQpIHRoaXMuYWNjZWxlcmF0aW9uLmlzQ2FsY3VsYXRlZCA9IHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5pc1Byb3ZpZGVkO1xuXG4gICAgICAgIC8vIFdBUk5JTkdcbiAgICAgICAgLy8gVGhlIGxpbmVzIG9mIGNvZGUgYmVsb3cgYXJlIGNvbW1lbnRlZCBiZWNhdXNlIG9mIGEgYnVnIG9mIENocm9tZVxuICAgICAgICAvLyBvbiBzb21lIEFuZHJvaWQgZGV2aWNlcywgd2hlcmUgJ2RldmljZW1vdGlvbicgZXZlbnRzIGFyZSBub3Qgc2VudFxuICAgICAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgICAgLy8gbGlzdGVuZXIuIEhlcmUsIHRoZSBfdHJ5T3JpZW50YXRpb25GYWxsYmFjayBtZXRob2Qgd291bGQgYWRkIGFcbiAgICAgICAgLy8gJ2RldmljZW9yaWVudGF0aW9uJyBsaXN0ZW5lciBhbmQgYmxvY2sgYWxsIHN1YnNlcXVlbnQgJ2RldmljZW1vdGlvbidcbiAgICAgICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAgICAgLy8gQ2hyb21lIGlzIGNvcnJlY3RlZC5cblxuICAgICAgICAvLyBpZiAodGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUgJiYgIXRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWQpXG4gICAgICAgIC8vICAgdGhpcy5fdHJ5T3JpZW50YXRpb25GYWxsYmFjaygpO1xuICAgICAgICAvLyBlbHNlXG4gICAgICAgIHRoaXMuX3Byb21pc2VSZXNvbHZlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgY2FsbGJhY2suXG4gICAgICogVGhpcyBtZXRob2QgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgcmF3IGAnZGV2aWNlbW90aW9uJ2AgdmFsdWVzLCBhbmQgZW1pdHNcbiAgICAgKiBldmVudHMgd2l0aCB0aGUgdW5pZmllZCBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAsIGBhY2NlbGVyYXRpb25gLFxuICAgICAqIGFuZCAvIG9yIGByb3RhdGlvblJhdGVgIHZhbHVlcyBpZiB0aGV5IGFyZSByZXF1aXJlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnX2RldmljZW1vdGlvbkxpc3RlbmVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2RldmljZW1vdGlvbkxpc3RlbmVyKGUpIHtcbiAgICAgIC8vICdkZXZpY2Vtb3Rpb24nIGV2ZW50IChyYXcgdmFsdWVzKVxuICAgICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPiAwKSB0aGlzLl9lbWl0RGV2aWNlTW90aW9uRXZlbnQoZSk7XG5cbiAgICAgIC8vIGFsZXJ0KGAke3RoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5saXN0ZW5lcnMuc2l6ZX0gLVxuICAgICAgLy8gICAgICR7dGhpcy5yZXF1aXJlZC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5fSAtXG4gICAgICAvLyAgICAgJHt0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZH1cbiAgICAgIC8vIGApO1xuXG4gICAgICAvLyAnYWNjZWxlcmF0aW9uJyBldmVudCAodW5pZmllZCB2YWx1ZXMpXG4gICAgICBpZiAodGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lmxpc3RlbmVycy5zaXplID4gMCAmJiB0aGlzLnJlcXVpcmVkLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgJiYgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmlzVmFsaWQpIHtcbiAgICAgICAgdGhpcy5fZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKTtcbiAgICAgIH1cblxuICAgICAgLy8gJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgYWNjZWxlcmF0aW9uIGhhcHBlbnMgaW4gdGhlXG4gICAgICAvLyAgYF9lbWl0QWNjZWxlcmF0aW9uYCBtZXRob2QsIHNvIHdlIGNoZWNrIGlmIHRoaXMuYWNjZWxlcmF0aW9uLmlzVmFsaWRcbiAgICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5saXN0ZW5lcnMuc2l6ZSA+IDAgJiYgdGhpcy5yZXF1aXJlZC5hY2NlbGVyYXRpb24gJiYgdGhpcy5hY2NlbGVyYXRpb24uaXNWYWxpZCkge1xuICAgICAgICB0aGlzLl9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSk7XG4gICAgICB9XG5cbiAgICAgIC8vICdyb3RhdGlvblJhdGUnIGV2ZW50ICh1bmlmaWVkIHZhbHVlcylcbiAgICAgIC8vIHRoZSBmYWxsYmFjayBjYWxjdWxhdGlvbiBvZiB0aGUgcm90YXRpb24gcmF0ZSBkb2VzIE5PVCBoYXBwZW4gaW4gdGhlXG4gICAgICAvLyBgX2VtaXRSb3RhdGlvblJhdGVgIG1ldGhvZCwgc28gd2Ugb25seSBjaGVjayBpZiB0aGlzLnJvdGF0aW9uUmF0ZS5pc1Byb3ZpZGVkXG4gICAgICBpZiAodGhpcy5yb3RhdGlvblJhdGUubGlzdGVuZXJzLnNpemUgPiAwICYmIHRoaXMucmVxdWlyZWQucm90YXRpb25SYXRlICYmIHRoaXMucm90YXRpb25SYXRlLmlzUHJvdmlkZWQpIHtcbiAgICAgICAgdGhpcy5fZW1pdFJvdGF0aW9uUmF0ZUV2ZW50KGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVtaXRzIHRoZSBgJ2RldmljZW1vdGlvbidgIHJhdyB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0RldmljZU1vdGlvbkV2ZW50fSBlIC0gYCdkZXZpY2Vtb3Rpb24nYCBldmVudCB0aGUgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20uXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ19lbWl0RGV2aWNlTW90aW9uRXZlbnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZW1pdERldmljZU1vdGlvbkV2ZW50KGUpIHtcbiAgICAgIHZhciBvdXRFdmVudCA9IHRoaXMuZXZlbnQ7XG5cbiAgICAgIGlmIChlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpIHtcbiAgICAgICAgb3V0RXZlbnRbMF0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbiAgICAgICAgb3V0RXZlbnRbMV0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueTtcbiAgICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuejtcbiAgICAgIH1cblxuICAgICAgaWYgKGUuYWNjZWxlcmF0aW9uKSB7XG4gICAgICAgIG91dEV2ZW50WzNdID0gZS5hY2NlbGVyYXRpb24ueDtcbiAgICAgICAgb3V0RXZlbnRbNF0gPSBlLmFjY2VsZXJhdGlvbi55O1xuICAgICAgICBvdXRFdmVudFs1XSA9IGUuYWNjZWxlcmF0aW9uLno7XG4gICAgICB9XG5cbiAgICAgIGlmIChlLnJvdGF0aW9uUmF0ZSkge1xuICAgICAgICBvdXRFdmVudFs2XSA9IGUucm90YXRpb25SYXRlLmFscGhhO1xuICAgICAgICBvdXRFdmVudFs3XSA9IGUucm90YXRpb25SYXRlLmJldGE7XG4gICAgICAgIG91dEV2ZW50WzhdID0gZS5yb3RhdGlvblJhdGUuZ2FtbWE7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdChvdXRFdmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW1pdHMgdGhlIGBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5YCB1bmlmaWVkIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBgJ2RldmljZW1vdGlvbidgIGV2ZW50IHRoZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnX2VtaXRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5RXZlbnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZW1pdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlFdmVudChlKSB7XG4gICAgICB2YXIgb3V0RXZlbnQgPSB0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuZXZlbnQ7XG5cbiAgICAgIG91dEV2ZW50WzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICBvdXRFdmVudFsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcblxuICAgICAgdGhpcy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LmVtaXQob3V0RXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVtaXRzIHRoZSBgYWNjZWxlcmF0aW9uYCB1bmlmaWVkIHZhbHVlcy5cbiAgICAgKiBXaGVuIHRoZSBgYWNjZWxlcmF0aW9uYCByYXcgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlLCB0aGUgbWV0aG9kXG4gICAgICogYWxzbyBjYWxjdWxhdGVzIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGVcbiAgICAgKiBgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eWAgcmF3IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RGV2aWNlTW90aW9uRXZlbnR9IGUgLSBUaGUgYCdkZXZpY2Vtb3Rpb24nYCBldmVudC5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnX2VtaXRBY2NlbGVyYXRpb25FdmVudCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0QWNjZWxlcmF0aW9uRXZlbnQoZSkge1xuICAgICAgdmFyIG91dEV2ZW50ID0gdGhpcy5hY2NlbGVyYXRpb24uZXZlbnQ7XG5cbiAgICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbi5pc1Byb3ZpZGVkKSB7XG4gICAgICAgIC8vIElmIHJhdyBhY2NlbGVyYXRpb24gdmFsdWVzIGFyZSBwcm92aWRlZFxuICAgICAgICBvdXRFdmVudFswXSA9IGUuYWNjZWxlcmF0aW9uLnggKiB0aGlzLl91bmlmeU1vdGlvbkRhdGE7XG4gICAgICAgIG91dEV2ZW50WzFdID0gZS5hY2NlbGVyYXRpb24ueSAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YTtcbiAgICAgICAgb3V0RXZlbnRbMl0gPSBlLmFjY2VsZXJhdGlvbi56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuaXNWYWxpZCkge1xuICAgICAgICAvLyBPdGhlcndpc2UsIGlmIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgdmFsdWVzIGFyZSBwcm92aWRlZCxcbiAgICAgICAgLy8gZXN0aW1hdGUgdGhlIGFjY2VsZXJhdGlvbiB3aXRoIGEgaGlnaC1wYXNzIGZpbHRlclxuICAgICAgICB2YXIgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IFtlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAqIHRoaXMuX3VuaWZ5TW90aW9uRGF0YSwgZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgKiB0aGlzLl91bmlmeU1vdGlvbkRhdGEsIGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56ICogdGhpcy5fdW5pZnlNb3Rpb25EYXRhXTtcbiAgICAgICAgdmFyIGsgPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXk7XG5cbiAgICAgICAgLy8gSGlnaC1wYXNzIGZpbHRlciB0byBlc3RpbWF0ZSB0aGUgYWNjZWxlcmF0aW9uICh3aXRob3V0IHRoZSBncmF2aXR5KVxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdID0gKDEgKyBrKSAqIDAuNSAqIChhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdIC0gdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMF0pICsgayAqIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMF07XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV0gPSAoMSArIGspICogMC41ICogKGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0gLSB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsxXSkgKyBrICogdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsxXTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXSA9ICgxICsgaykgKiAwLjUgKiAoYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSAtIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzJdKSArIGsgKiB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzJdO1xuXG4gICAgICAgIHRoaXMuX2xhc3RBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzBdID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVswXTtcbiAgICAgICAgdGhpcy5fbGFzdEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMV0gPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5WzFdO1xuICAgICAgICB0aGlzLl9sYXN0QWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVsyXSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlbMl07XG5cbiAgICAgICAgb3V0RXZlbnRbMF0gPSB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uWzBdO1xuICAgICAgICBvdXRFdmVudFsxXSA9IHRoaXMuX2NhbGN1bGF0ZWRBY2NlbGVyYXRpb25bMV07XG4gICAgICAgIG91dEV2ZW50WzJdID0gdGhpcy5fY2FsY3VsYXRlZEFjY2VsZXJhdGlvblsyXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hY2NlbGVyYXRpb24uZW1pdChvdXRFdmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW1pdHMgdGhlIGByb3RhdGlvblJhdGVgIHVuaWZpZWQgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtEZXZpY2VNb3Rpb25FdmVudH0gZSAtIGAnZGV2aWNlbW90aW9uJ2AgZXZlbnQgdGhlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdfZW1pdFJvdGF0aW9uUmF0ZUV2ZW50JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VtaXRSb3RhdGlvblJhdGVFdmVudChlKSB7XG4gICAgICB2YXIgb3V0RXZlbnQgPSB0aGlzLnJvdGF0aW9uUmF0ZS5ldmVudDtcblxuICAgICAgLy8gSW4gYWxsIHBsYXRmb3Jtcywgcm90YXRpb24gYXhlcyBhcmUgbWVzc2VkIHVwIGFjY29yZGluZyB0byB0aGUgc3BlY1xuICAgICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2RldmljZW9yaWVudGF0aW9uL3NwZWMtc291cmNlLW9yaWVudGF0aW9uLmh0bWxcbiAgICAgIC8vXG4gICAgICAvLyBnYW1tYSBzaG91bGQgYmUgYWxwaGFcbiAgICAgIC8vIGFscGhhIHNob3VsZCBiZSBiZXRhXG4gICAgICAvLyBiZXRhIHNob3VsZCBiZSBnYW1tYVxuXG4gICAgICBvdXRFdmVudFswXSA9IGUucm90YXRpb25SYXRlLmdhbW1hO1xuICAgICAgb3V0RXZlbnRbMV0gPSBlLnJvdGF0aW9uUmF0ZS5hbHBoYSwgb3V0RXZlbnRbMl0gPSBlLnJvdGF0aW9uUmF0ZS5iZXRhO1xuXG4gICAgICAvLyBDaHJvbWUgQW5kcm9pZCByZXRyaWV2ZSB2YWx1ZXMgdGhhdCBhcmUgaW4gcmFkL3NcbiAgICAgIC8vIGNmLiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD01NDE2MDdcbiAgICAgIC8vXG4gICAgICAvLyBGcm9tIHNwZWM6IFwiVGhlIHJvdGF0aW9uUmF0ZSBhdHRyaWJ1dGUgbXVzdCBiZSBpbml0aWFsaXplZCB3aXRoIHRoZSByYXRlXG4gICAgICAvLyBvZiByb3RhdGlvbiBvZiB0aGUgaG9zdGluZyBkZXZpY2UgaW4gc3BhY2UuIEl0IG11c3QgYmUgZXhwcmVzc2VkIGFzIHRoZVxuICAgICAgLy8gcmF0ZSBvZiBjaGFuZ2Ugb2YgdGhlIGFuZ2xlcyBkZWZpbmVkIGluIHNlY3Rpb24gNC4xIGFuZCBtdXN0IGJlIGV4cHJlc3NlZFxuICAgICAgLy8gaW4gZGVncmVlcyBwZXIgc2Vjb25kIChkZWcvcykuXCJcbiAgICAgIC8vXG4gICAgICAvLyBmaXhlZCBzaW5jZSBDaHJvbWUgNjVcbiAgICAgIC8vIGNmLiBodHRwczovL2dpdGh1Yi5jb20vaW1tZXJzaXZlLXdlYi93ZWJ2ci1wb2x5ZmlsbC9pc3N1ZXMvMzA3XG4gICAgICBpZiAoX3BsYXRmb3JtMi5kZWZhdWx0Lm9zLmZhbWlseSA9PT0gJ0FuZHJvaWQnICYmIGNocm9tZVJlZ0V4cC50ZXN0KF9wbGF0Zm9ybTIuZGVmYXVsdC5uYW1lKSAmJiBwYXJzZUludChfcGxhdGZvcm0yLmRlZmF1bHQudmVyc2lvbi5zcGxpdCgnLicpWzBdKSA8IDY1KSB7XG4gICAgICAgIG91dEV2ZW50WzBdICo9IHRvRGVnO1xuICAgICAgICBvdXRFdmVudFsxXSAqPSB0b0RlZywgb3V0RXZlbnRbMl0gKj0gdG9EZWc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucm90YXRpb25SYXRlLmVtaXQob3V0RXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgYW5kIGVtaXRzIHRoZSBgcm90YXRpb25SYXRlYCB1bmlmaWVkIHZhbHVlcyBmcm9tIHRoZSBgb3JpZW50YXRpb25gIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IG9yaWVudGF0aW9uIC0gTGF0ZXN0IGBvcmllbnRhdGlvbmAgcmF3IHZhbHVlcy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9jYWxjdWxhdGVSb3RhdGlvblJhdGVGcm9tT3JpZW50YXRpb24ob3JpZW50YXRpb24pIHtcbiAgICAgIHZhciBub3cgPSBnZXRMb2NhbFRpbWUoKTtcbiAgICAgIHZhciBrID0gMC44OyAvLyBUT0RPOiBpbXByb3ZlIGxvdyBwYXNzIGZpbHRlciAoZnJhbWVzIGFyZSBub3QgcmVndWxhcilcbiAgICAgIHZhciBhbHBoYUlzVmFsaWQgPSB0eXBlb2Ygb3JpZW50YXRpb25bMF0gPT09ICdudW1iZXInO1xuXG4gICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wKSB7XG4gICAgICAgIHZhciByQWxwaGEgPSBudWxsO1xuICAgICAgICB2YXIgckJldGEgPSB2b2lkIDA7XG4gICAgICAgIHZhciByR2FtbWEgPSB2b2lkIDA7XG5cbiAgICAgICAgdmFyIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IDA7XG4gICAgICAgIHZhciBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IDA7XG4gICAgICAgIHZhciBnYW1tYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAwO1xuXG4gICAgICAgIHZhciBkZWx0YVQgPSBub3cgLSB0aGlzLl9sYXN0T3JpZW50YXRpb25UaW1lc3RhbXA7XG5cbiAgICAgICAgaWYgKGFscGhhSXNWYWxpZCkge1xuICAgICAgICAgIC8vIGFscGhhIGRpc2NvbnRpbnVpdHkgKCszNjAgLT4gMCBvciAwIC0+ICszNjApXG4gICAgICAgICAgaWYgKHRoaXMuX2xhc3RPcmllbnRhdGlvblswXSA+IDMyMCAmJiBvcmllbnRhdGlvblswXSA8IDQwKSBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IgPSAzNjA7ZWxzZSBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdIDwgNDAgJiYgb3JpZW50YXRpb25bMF0gPiAzMjApIGFscGhhRGlzY29udGludWl0eUZhY3RvciA9IC0zNjA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBiZXRhIGRpc2NvbnRpbnVpdHkgKCsxODAgLT4gLTE4MCBvciAtMTgwIC0+ICsxODApXG4gICAgICAgIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPiAxNDAgJiYgb3JpZW50YXRpb25bMV0gPCAtMTQwKSBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IDM2MDtlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPCAtMTQwICYmIG9yaWVudGF0aW9uWzFdID4gMTQwKSBiZXRhRGlzY29udGludWl0eUZhY3RvciA9IC0zNjA7XG5cbiAgICAgICAgLy8gZ2FtbWEgZGlzY29udGludWl0aWVzICgrMTgwIC0+IC0xODAgb3IgLTE4MCAtPiArMTgwKVxuICAgICAgICBpZiAodGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdID4gNTAgJiYgb3JpZW50YXRpb25bMl0gPCAtNTApIGdhbW1hRGlzY29udGludWl0eUZhY3RvciA9IDE4MDtlbHNlIGlmICh0aGlzLl9sYXN0T3JpZW50YXRpb25bMl0gPCAtNTAgJiYgb3JpZW50YXRpb25bMl0gPiA1MCkgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yID0gLTE4MDtcblxuICAgICAgICBpZiAoZGVsdGFUID4gMCkge1xuICAgICAgICAgIC8vIExvdyBwYXNzIGZpbHRlciB0byBzbW9vdGggdGhlIGRhdGFcbiAgICAgICAgICBpZiAoYWxwaGFJc1ZhbGlkKSByQWxwaGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVswXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMF0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMF0gKyBhbHBoYURpc2NvbnRpbnVpdHlGYWN0b3IpIC8gZGVsdGFUO1xuXG4gICAgICAgICAgckJldGEgPSBrICogdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSArICgxIC0gaykgKiAob3JpZW50YXRpb25bMV0gLSB0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gKyBiZXRhRGlzY29udGludWl0eUZhY3RvcikgLyBkZWx0YVQ7XG4gICAgICAgICAgckdhbW1hID0gayAqIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gKyAoMSAtIGspICogKG9yaWVudGF0aW9uWzJdIC0gdGhpcy5fbGFzdE9yaWVudGF0aW9uWzJdICsgZ2FtbWFEaXNjb250aW51aXR5RmFjdG9yKSAvIGRlbHRhVDtcblxuICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMF0gPSByQWxwaGE7XG4gICAgICAgICAgdGhpcy5fY2FsY3VsYXRlZFJvdGF0aW9uUmF0ZVsxXSA9IHJCZXRhO1xuICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRSb3RhdGlvblJhdGVbMl0gPSByR2FtbWE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiByZXNhbXBsZSB0aGUgZW1pc3Npb24gcmF0ZSB0byBtYXRjaCB0aGUgZGV2aWNlbW90aW9uIHJhdGVcbiAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuZW1pdCh0aGlzLl9jYWxjdWxhdGVkUm90YXRpb25SYXRlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uVGltZXN0YW1wID0gbm93O1xuICAgICAgdGhpcy5fbGFzdE9yaWVudGF0aW9uWzBdID0gb3JpZW50YXRpb25bMF07XG4gICAgICB0aGlzLl9sYXN0T3JpZW50YXRpb25bMV0gPSBvcmllbnRhdGlvblsxXTtcbiAgICAgIHRoaXMuX2xhc3RPcmllbnRhdGlvblsyXSA9IG9yaWVudGF0aW9uWzJdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSByb3RhdGlvbiByYXRlIGNhbiBiZSBjYWxjdWxhdGVkIGZyb20gdGhlIGBvcmllbnRhdGlvbmAgdmFsdWVzIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEB0b2RvIC0gdGhpcyBzaG91bGQgYmUgcmV2aWV3ZWQgdG8gY29tcGx5IHdpdGggdGhlIGF4aXMgb3JkZXIgZGVmaW5lZFxuICAgICAqICBpbiB0aGUgc3BlY1xuICAgICAqL1xuICAgIC8vIFdBUk5JTkdcbiAgICAvLyBUaGUgbGluZXMgb2YgY29kZSBiZWxvdyBhcmUgY29tbWVudGVkIGJlY2F1c2Ugb2YgYSBidWcgb2YgQ2hyb21lXG4gICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAvLyBvciBjYXVnaHQgaWYgdGhlIGxpc3RlbmVyIGlzIHNldCB1cCBhZnRlciBhICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAvLyBsaXN0ZW5lci4gSGVyZSwgdGhlIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrIG1ldGhvZCB3b3VsZCBhZGQgYVxuICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgLy8gZXZlbnRzIG9uIHRoZXNlIGRldmljZXMuIENvbW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBvbmNlIHRoZSBidWcgb2ZcbiAgICAvLyBDaHJvbWUgaXMgY29ycmVjdGVkLlxuICAgIC8vIF90cnlPcmllbnRhdGlvbkZhbGxiYWNrKCkge1xuICAgIC8vICAgTW90aW9uSW5wdXQucmVxdWlyZU1vZHVsZSgnb3JpZW50YXRpb24nKVxuICAgIC8vICAgICAudGhlbigob3JpZW50YXRpb24pID0+IHtcbiAgICAvLyAgICAgICBpZiAob3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coYFxuICAgIC8vICAgICAgICAgICBXQVJOSU5HIChtb3Rpb24taW5wdXQpOiBUaGUgJ2RldmljZW1vdGlvbicgZXZlbnQgZG9lcyBub3QgZXhpc3RzIG9yXG4gICAgLy8gICAgICAgICAgIGRvZXMgbm90IHByb3ZpZGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgaW4geW91ciBicm93c2VyLCBzbyB0aGUgcm90YXRpb25cbiAgICAvLyAgICAgICAgICAgcmF0ZSBvZiB0aGUgZGV2aWNlIGlzIGVzdGltYXRlZCBmcm9tIHRoZSAnb3JpZW50YXRpb24nLCBjYWxjdWxhdGVkXG4gICAgLy8gICAgICAgICAgIGZyb20gdGhlICdkZXZpY2VvcmllbnRhdGlvbicgZXZlbnQuIFNpbmNlIHRoZSBjb21wYXNzIG1pZ2h0IG5vdFxuICAgIC8vICAgICAgICAgICBiZSBhdmFpbGFibGUsIG9ubHkgXFxgYmV0YVxcYCBhbmQgXFxgZ2FtbWFcXGAgYW5nbGVzIG1heSBiZSBwcm92aWRlZFxuICAgIC8vICAgICAgICAgICAoXFxgYWxwaGFcXGAgd291bGQgYmUgbnVsbCkuYFxuICAgIC8vICAgICAgICAgKTtcblxuICAgIC8vICAgICAgICAgdGhpcy5yb3RhdGlvblJhdGUuaXNDYWxjdWxhdGVkID0gdHJ1ZTtcblxuICAgIC8vICAgICAgICAgTW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ29yaWVudGF0aW9uJywgKG9yaWVudGF0aW9uKSA9PiB7XG4gICAgLy8gICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVJvdGF0aW9uUmF0ZUZyb21PcmllbnRhdGlvbihvcmllbnRhdGlvbik7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgICB9XG5cbiAgICAvLyAgICAgICB0aGlzLl9wcm9taXNlUmVzb2x2ZSh0aGlzKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfVxuXG4gIH0sIHtcbiAgICBrZXk6ICdfcHJvY2VzcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9wcm9jZXNzKGRhdGEpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NGdW5jdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBvZiB0aGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7cHJvbWlzZX1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaW5pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgcmV0dXJuIF9nZXQoRGV2aWNlTW90aW9uTW9kdWxlLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKERldmljZU1vdGlvbk1vZHVsZS5wcm90b3R5cGUpLCAnaW5pdCcsIHRoaXMpLmNhbGwodGhpcywgZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgX3RoaXMyLl9wcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICAgICAgaWYgKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudCkge1xuICAgICAgICAgIF90aGlzMi5fcHJvY2Vzc0Z1bmN0aW9uID0gX3RoaXMyLl9kZXZpY2Vtb3Rpb25DaGVjaztcbiAgICAgICAgICAvLyBmZWF0dXJlIGRldGVjdFxuICAgICAgICAgIGlmICh0eXBlb2YgRGV2aWNlTW90aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIERldmljZU1vdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKCkudGhlbihmdW5jdGlvbiAocGVybWlzc2lvblN0YXRlKSB7XG4gICAgICAgICAgICAgIGlmIChwZXJtaXNzaW9uU3RhdGUgPT09ICdncmFudGVkJykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCBfdGhpczIuX3Byb2Nlc3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChjb25zb2xlLmVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIHJlZ3VsYXIgbm9uIGlPUyAxMysgZGV2aWNlc1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIF90aGlzMi5fcHJvY2Vzcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2V0IGZhbGxiYWNrIHRpbWVvdXQgZm9yIEZpcmVmb3ggZGVza3RvcCAoaXRzIHdpbmRvdyBuZXZlciBjYWxsaW5nIHRoZSBEZXZpY2VPcmllbnRhdGlvbiBldmVudCwgYVxuICAgICAgICAgIC8vIHJlcXVpcmUgb2YgdGhlIERldmljZU9yaWVudGF0aW9uIHNlcnZpY2Ugd2lsbCByZXN1bHQgaW4gdGhlIHJlcXVpcmUgcHJvbWlzZSBuZXZlciBiZWluZyByZXNvbHZlZFxuICAgICAgICAgIC8vIGhlbmNlIHRoZSBFeHBlcmltZW50IHN0YXJ0KCkgbWV0aG9kIG5ldmVyIGNhbGxlZClcbiAgICAgICAgICAvLyA+IG5vdGUgMDIvMDIvMjAxODogdGhpcyBzZWVtcyB0byBjcmVhdGUgcHJvYmxlbXMgd2l0aCBpcG9kcyB0aGF0XG4gICAgICAgICAgLy8gZG9uJ3QgaGF2ZSBlbm91Z2ggdGltZSB0byBzdGFydCAoc29tZXRpbWVzKSwgaGVuY2UgY3JlYXRpbmcgZmFsc2VcbiAgICAgICAgICAvLyBuZWdhdGl2ZS4gU28gd2Ugb25seSBhcHBseSB0byBGaXJlZm94IGRlc2t0b3AgYW5kIHB1dCBhIHJlYWxseVxuICAgICAgICAgIC8vIGxhcmdlIHZhbHVlICg0c2VjKSBqdXN0IGluIGNhc2UuXG4gICAgICAgICAgaWYgKF9wbGF0Zm9ybTIuZGVmYXVsdC5uYW1lID09PSAnRmlyZWZveCcgJiYgX3BsYXRmb3JtMi5kZWZhdWx0Lm9zLmZhbWlseSAhPT0gJ0FuZHJvaWQnICYmIF9wbGF0Zm9ybTIuZGVmYXVsdC5vcy5mYW1pbHkgIT09ICdpT1MnKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1ttb3Rpb24taW5wdXRdIHJlZ2lzdGVyIHRpbWVyIGZvciBGaXJlZm94IGRlc2t0b3AnKTtcbiAgICAgICAgICAgIF90aGlzMi5fY2hlY2tUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoX3RoaXMyKTtcbiAgICAgICAgICAgIH0sIDQgKiAxMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXQVJOSU5HXG4gICAgICAgIC8vIFRoZSBsaW5lcyBvZiBjb2RlIGJlbG93IGFyZSBjb21tZW50ZWQgYmVjYXVzZSBvZiBhIGJ1ZyBvZiBDaHJvbWVcbiAgICAgICAgLy8gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHdoZXJlICdkZXZpY2Vtb3Rpb24nIGV2ZW50cyBhcmUgbm90IHNlbnRcbiAgICAgICAgLy8gb3IgY2F1Z2h0IGlmIHRoZSBsaXN0ZW5lciBpcyBzZXQgdXAgYWZ0ZXIgYSAnZGV2aWNlb3JpZW50YXRpb24nXG4gICAgICAgIC8vIGxpc3RlbmVyLiBIZXJlLCB0aGUgX3RyeU9yaWVudGF0aW9uRmFsbGJhY2sgbWV0aG9kIHdvdWxkIGFkZCBhXG4gICAgICAgIC8vICdkZXZpY2VvcmllbnRhdGlvbicgbGlzdGVuZXIgYW5kIGJsb2NrIGFsbCBzdWJzZXF1ZW50ICdkZXZpY2Vtb3Rpb24nXG4gICAgICAgIC8vIGV2ZW50cyBvbiB0aGVzZSBkZXZpY2VzLiBDb21tZW50cyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0aGUgYnVnIG9mXG4gICAgICAgIC8vIENocm9tZSBpcyBjb3JyZWN0ZWQuXG5cbiAgICAgICAgLy8gZWxzZSBpZiAodGhpcy5yZXF1aXJlZC5yb3RhdGlvblJhdGUpXG4gICAgICAgIC8vIHRoaXMuX3RyeU9yaWVudGF0aW9uRmFsbGJhY2soKTtcblxuICAgICAgICBlbHNlIHJlc29sdmUoX3RoaXMyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ19jYWxjdWxhdGVkQWNjZWxlcmF0aW9uRGVjYXknLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIE1hdGguZXhwKC0yICogTWF0aC5QSSAqIHRoaXMuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS5wZXJpb2QgLyB0aGlzLl9jYWxjdWxhdGVkQWNjZWxlcmF0aW9uVGltZUNvbnN0YW50KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRGV2aWNlTW90aW9uTW9kdWxlO1xufShfSW5wdXRNb2R1bGUzLmRlZmF1bHQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBuZXcgRGV2aWNlTW90aW9uTW9kdWxlKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa1JsZG1salpVMXZkR2x2YmsxdlpIVnNaUzVxY3lKZExDSnVZVzFsY3lJNld5Sm5aWFJNYjJOaGJGUnBiV1VpTENKM2FXNWtiM2NpTENKd1pYSm1iM0p0WVc1alpTSXNJbTV2ZHlJc0lrUmhkR1VpTENKamFISnZiV1ZTWldkRmVIQWlMQ0owYjBSbFp5SXNJazFoZEdnaUxDSlFTU0lzSWtSbGRtbGpaVTF2ZEdsdmJrMXZaSFZzWlNJc0ltVjJaVzUwSWl3aVlXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVTSXNJbUZqWTJWc1pYSmhkR2x2YmlJc0luSnZkR0YwYVc5dVVtRjBaU0lzSW5KbGNYVnBjbVZrSWl3aVgzQnliMjFwYzJWU1pYTnZiSFpsSWl3aVgzVnVhV1o1VFc5MGFXOXVSR0YwWVNJc0ltOXpJaXdpWm1GdGFXeDVJaXdpWDNWdWFXWjVVR1Z5YVc5a0lpd2lYMk5oYkdOMWJHRjBaV1JCWTJObGJHVnlZWFJwYjI0aUxDSmZZMkZzWTNWc1lYUmxaRUZqWTJWc1pYSmhkR2x2YmxScGJXVkRiMjV6ZEdGdWRDSXNJbDlzWVhOMFFXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVTSXNJbDlqWVd4amRXeGhkR1ZrVW05MFlYUnBiMjVTWVhSbElpd2lYMnhoYzNSUGNtbGxiblJoZEdsdmJpSXNJbDlzWVhOMFQzSnBaVzUwWVhScGIyNVVhVzFsYzNSaGJYQWlMQ0pmY0hKdlkyVnpjMFoxYm1OMGFXOXVJaXdpWDNCeWIyTmxjM01pTENKaWFXNWtJaXdpWDJSbGRtbGpaVzF2ZEdsdmJrTm9aV05ySWl3aVgyUmxkbWxqWlcxdmRHbHZia3hwYzNSbGJtVnlJaXdpWDJOb1pXTnJRMjkxYm5SbGNpSXNJbVVpTENKamJHVmhjbFJwYldWdmRYUWlMQ0pmWTJobFkydFVhVzFsYjNWMFNXUWlMQ0pwYzFCeWIzWnBaR1ZrSWl3aWNHVnlhVzlrSWl3aWFXNTBaWEoyWVd3aUxDSjRJaXdpZVNJc0lub2lMQ0poYkhCb1lTSXNJbUpsZEdFaUxDSm5ZVzF0WVNJc0luUmxjM1FpTENKdVlXMWxJaXdpYVhORFlXeGpkV3hoZEdWa0lpd2liR2x6ZEdWdVpYSnpJaXdpYzJsNlpTSXNJbDlsYldsMFJHVjJhV05sVFc5MGFXOXVSWFpsYm5RaUxDSnBjMVpoYkdsa0lpd2lYMlZ0YVhSQlkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNVJYWmxiblFpTENKZlpXMXBkRUZqWTJWc1pYSmhkR2x2YmtWMlpXNTBJaXdpWDJWdGFYUlNiM1JoZEdsdmJsSmhkR1ZGZG1WdWRDSXNJbTkxZEVWMlpXNTBJaXdpWlcxcGRDSXNJbXNpTENKZlkyRnNZM1ZzWVhSbFpFRmpZMlZzWlhKaGRHbHZia1JsWTJGNUlpd2ljR0Z5YzJWSmJuUWlMQ0oyWlhKemFXOXVJaXdpYzNCc2FYUWlMQ0p2Y21sbGJuUmhkR2x2YmlJc0ltRnNjR2hoU1hOV1lXeHBaQ0lzSW5KQmJIQm9ZU0lzSW5KQ1pYUmhJaXdpY2tkaGJXMWhJaXdpWVd4d2FHRkVhWE5qYjI1MGFXNTFhWFI1Um1GamRHOXlJaXdpWW1WMFlVUnBjMk52Ym5ScGJuVnBkSGxHWVdOMGIzSWlMQ0puWVcxdFlVUnBjMk52Ym5ScGJuVnBkSGxHWVdOMGIzSWlMQ0prWld4MFlWUWlMQ0prWVhSaElpd2ljbVZ6YjJ4MlpTSXNJa1JsZG1salpVMXZkR2x2YmtWMlpXNTBJaXdpY21WeGRXVnpkRkJsY20xcGMzTnBiMjRpTENKMGFHVnVJaXdpY0dWeWJXbHpjMmx2YmxOMFlYUmxJaXdpWVdSa1JYWmxiblJNYVhOMFpXNWxjaUlzSW1OaGRHTm9JaXdpWTI5dWMyOXNaU0lzSW1WeWNtOXlJaXdpZDJGeWJpSXNJbk5sZEZScGJXVnZkWFFpTENKbGVIQWlYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN1FVRkJRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenM3T3pzN096czdPMEZCUlVFN096czdPenRCUVUxQkxGTkJRVk5CTEZsQlFWUXNSMEZCZDBJN1FVRkRkRUlzVFVGQlNVTXNUMEZCVDBNc1YwRkJXQ3hGUVVORkxFOUJRVTlFTEU5QlFVOURMRmRCUVZBc1EwRkJiVUpETEVkQlFXNUNMRXRCUVRKQ0xFbEJRV3hETzBGQlEwWXNVMEZCVDBNc1MwRkJTMFFzUjBGQlRDeExRVUZoTEVsQlFYQkNPMEZCUTBRN08wRkJSVVFzU1VGQlRVVXNaVUZCWlN4UlFVRnlRanRCUVVOQkxFbEJRVTFETEZGQlFWRXNUVUZCVFVNc1MwRkJTME1zUlVGQmVrSTdPMEZCUlVFN096czdPenM3T3pzN096czdPenM3T3pzN08wbEJiVUpOUXl4clFqczdPMEZCUlVvN096czdPMEZCUzBFc1owTkJRV003UVVGQlFUczdRVUZIV2pzN096czdPenRCUVVoWkxIZEpRVU5PTEdOQlJFMDdPMEZCVlZvc1ZVRkJTME1zUzBGQlRDeEhRVUZoTEVOQlFVTXNTVUZCUkN4RlFVRlBMRWxCUVZBc1JVRkJZU3hKUVVGaUxFVkJRVzFDTEVsQlFXNUNMRVZCUVhsQ0xFbEJRWHBDTEVWQlFTdENMRWxCUVM5Q0xFVkJRWEZETEVsQlFYSkRMRVZCUVRKRExFbEJRVE5ETEVWQlFXbEVMRWxCUVdwRUxFTkJRV0k3TzBGQlJVRTdPenM3T3pzN1FVRlBRU3hWUVVGTFF5dzBRa0ZCVEN4SFFVRnZReXgxUTBGQk5FSXNPRUpCUVRWQ0xFTkJRWEJET3p0QlFVVkJPenM3T3pzN096czdPMEZCVlVFc1ZVRkJTME1zV1VGQlRDeEhRVUZ2UWl4MVEwRkJORUlzWTBGQk5VSXNRMEZCY0VJN08wRkJSVUU3T3pzN096czdPenM3UVVGVlFTeFZRVUZMUXl4WlFVRk1MRWRCUVc5Q0xIVkRRVUUwUWl4alFVRTFRaXhEUVVGd1FqczdRVUZGUVRzN096czdPenM3TzBGQlUwRXNWVUZCUzBNc1VVRkJUQ3hIUVVGblFqdEJRVU5rU0N4dlEwRkJPRUlzUzBGRWFFSTdRVUZGWkVNc2IwSkJRV01zUzBGR1FUdEJRVWRrUXl4dlFrRkJZenRCUVVoQkxFdEJRV2hDT3p0QlFVMUJPenM3T3pzN096dEJRVkZCTEZWQlFVdEZMR1ZCUVV3c1IwRkJkVUlzU1VGQmRrSTdPMEZCUlVFN096czdPenRCUVUxQkxGVkJRVXRETEdkQ1FVRk1MRWRCUVhsQ0xHMUNRVUZUUXl4RlFVRlVMRU5CUVZsRExFMUJRVm9zUzBGQmRVSXNTMEZCZUVJc1IwRkJhVU1zUTBGQlF5eERRVUZzUXl4SFFVRnpReXhEUVVFNVJEczdRVUZGUVRzN096czdPenRCUVU5QkxGVkJRVXRETEZsQlFVd3NSMEZCY1VJc2JVSkJRVk5HTEVWQlFWUXNRMEZCV1VNc1RVRkJXaXhMUVVGMVFpeFRRVUY0UWl4SFFVRnhReXhMUVVGeVF5eEhRVUUyUXl4RFFVRnFSVHM3UVVGRlFUczdPenM3T3p0QlFVOUJMRlZCUVV0RkxIVkNRVUZNTEVkQlFTdENMRU5CUVVNc1EwRkJSQ3hGUVVGSkxFTkJRVW9zUlVGQlR5eERRVUZRTEVOQlFTOUNPenRCUVVWQk96czdPenM3T3p0QlFWRkJMRlZCUVV0RExHMURRVUZNTEVkQlFUSkRMRWRCUVRORE96dEJRVVZCT3pzN096czdPMEZCVDBFc1ZVRkJTME1zYVVOQlFVd3NSMEZCZVVNc1EwRkJReXhEUVVGRUxFVkJRVWtzUTBGQlNpeEZRVUZQTEVOQlFWQXNRMEZCZWtNN08wRkJSVUU3T3pzN096czdRVUZQUVN4VlFVRkxReXgxUWtGQlRDeEhRVUVyUWl4RFFVRkRMRU5CUVVRc1JVRkJTU3hEUVVGS0xFVkJRVThzUTBGQlVDeERRVUV2UWpzN1FVRkZRVHM3T3pzN096dEJRVTlCTEZWQlFVdERMR2RDUVVGTUxFZEJRWGRDTEVOQlFVTXNRMEZCUkN4RlFVRkpMRU5CUVVvc1JVRkJUeXhEUVVGUUxFTkJRWGhDT3p0QlFVVkJPenM3T3pzN08wRkJUMEVzVlVGQlMwTXNlVUpCUVV3c1IwRkJhVU1zU1VGQmFrTTdPMEZCUlVFc1ZVRkJTME1zWjBKQlFVd3NSMEZCZDBJc1NVRkJlRUk3UVVGRFFTeFZRVUZMUXl4UlFVRk1MRWRCUVdkQ0xFMUJRVXRCTEZGQlFVd3NRMEZCWTBNc1NVRkJaQ3hQUVVGb1FqdEJRVU5CTEZWQlFVdERMR3RDUVVGTUxFZEJRVEJDTEUxQlFVdEJMR3RDUVVGTUxFTkJRWGRDUkN4SlFVRjRRaXhQUVVFeFFqdEJRVU5CTEZWQlFVdEZMSEZDUVVGTUxFZEJRVFpDTEUxQlFVdEJMSEZDUVVGTUxFTkJRVEpDUml4SlFVRXpRaXhQUVVFM1FqczdRVUZGUVN4VlFVRkxSeXhoUVVGTUxFZEJRWEZDTEVOQlFYSkNPMEZCYmtwWk8wRkJiMHBpT3p0QlFVVkVPenM3T3pzN096czdPenM3UVVGVlFUczdPenM3T3pzN096czdPenM3ZFVOQlkyMUNReXhETEVWQlFVYzdRVUZEY0VJN1FVRkRRVHRCUVVOQlF5eHRRa0ZCWVN4TFFVRkxReXhsUVVGc1FqczdRVUZGUVN4WFFVRkxReXhWUVVGTUxFZEJRV3RDTEVsQlFXeENPMEZCUTBFc1YwRkJTME1zVFVGQlRDeEhRVUZqU2l4RlFVRkZTeXhSUVVGR0xFZEJRV0VzU1VGQk0wSTdRVUZEUVN4WFFVRkxRU3hSUVVGTUxFZEJRV2RDVEN4RlFVRkZTeXhSUVVGc1FqczdRVUZGUVR0QlFVTkJMRmRCUVVzeFFpdzBRa0ZCVEN4RFFVRnJRM2RDTEZWQlFXeERMRWRCUTBWSUxFVkJRVVZ5UWl3MFFrRkJSaXhKUVVORExFOUJRVTl4UWl4RlFVRkZja0lzTkVKQlFVWXNRMEZCSzBJeVFpeERRVUYwUXl4TFFVRTBReXhSUVVRM1F5eEpRVVZETEU5QlFVOU9MRVZCUVVWeVFpdzBRa0ZCUml4RFFVRXJRalJDTEVOQlFYUkRMRXRCUVRSRExGRkJSamRETEVsQlIwTXNUMEZCVDFBc1JVRkJSWEpDTERSQ1FVRkdMRU5CUVN0Q05rSXNRMEZCZEVNc1MwRkJORU1zVVVGS0wwTTdRVUZOUVN4WFFVRkxOMElzTkVKQlFVd3NRMEZCYTBONVFpeE5RVUZzUXl4SFFVRXlRMG9zUlVGQlJVc3NVVUZCUml4SFFVRmhMRXRCUVV0c1FpeFpRVUUzUkRzN1FVRkZRVHRCUVVOQkxGZEJRVXRRTEZsQlFVd3NRMEZCYTBKMVFpeFZRVUZzUWl4SFFVTkZTQ3hGUVVGRmNFSXNXVUZCUml4SlFVTkRMRTlCUVU5dlFpeEZRVUZGY0VJc1dVRkJSaXhEUVVGbE1FSXNRMEZCZEVJc1MwRkJORUlzVVVGRU4wSXNTVUZGUXl4UFFVRlBUaXhGUVVGRmNFSXNXVUZCUml4RFFVRmxNa0lzUTBGQmRFSXNTMEZCTkVJc1VVRkdOMElzU1VGSFF5eFBRVUZQVUN4RlFVRkZjRUlzV1VGQlJpeERRVUZsTkVJc1EwRkJkRUlzUzBGQk5FSXNVVUZLTDBJN1FVRk5RU3hYUVVGTE5VSXNXVUZCVEN4RFFVRnJRbmRDTEUxQlFXeENMRWRCUVRKQ1NpeEZRVUZGU3l4UlFVRkdMRWRCUVdFc1MwRkJTMnhDTEZsQlFUZERPenRCUVVWQk8wRkJRMEVzVjBGQlMwNHNXVUZCVEN4RFFVRnJRbk5DTEZWQlFXeENMRWRCUTBWSUxFVkJRVVZ1UWl4WlFVRkdMRWxCUTBNc1QwRkJUMjFDTEVWQlFVVnVRaXhaUVVGR0xFTkJRV1UwUWl4TFFVRjBRaXhMUVVGblF5eFJRVVJxUXl4SlFVVkRMRTlCUVU5VUxFVkJRVVZ1UWl4WlFVRkdMRU5CUVdVMlFpeEpRVUYwUWl4TFFVRm5ReXhSUVVacVF5eEpRVWRETEU5QlFVOVdMRVZCUVVWdVFpeFpRVUZHTEVOQlFXVTRRaXhMUVVGMFFpeExRVUZuUXl4UlFVcHVRenRCUVUxQkxGZEJRVXM1UWl4WlFVRk1MRU5CUVd0Q2RVSXNUVUZCYkVJc1IwRkJNa0pLTEVWQlFVVkxMRkZCUVVZc1IwRkJZU3hMUVVGTGJFSXNXVUZCTjBNN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZWQlEwVXNiVUpCUVZOR0xFVkJRVlFzUTBGQldVTXNUVUZCV2l4TFFVRjFRaXhUUVVGMlFpeEpRVU5CTEZWQlFWVXdRaXhKUVVGV0xFTkJRV1VzYlVKQlFWTkRMRWxCUVhoQ0xFTkJSRUVzU1VGRlFTeExRVUZMWkN4aFFVRk1MRWRCUVhGQ0xFTkJTSFpDTEVWQlNVVTdRVUZEUVN4aFFVRkxRU3hoUVVGTU8wRkJRMFFzVDBGT1JDeE5RVTFQTzBGQlEwdzdRVUZEUVR0QlFVTkJMR0ZCUVV0TUxHZENRVUZNTEVkQlFYZENMRXRCUVV0SkxIRkNRVUUzUWpzN1FVRkZRVHRCUVVOQk8wRkJRMEVzV1VGQlNTeERRVUZETEV0QlFVdHNRaXhaUVVGTUxFTkJRV3RDZFVJc1ZVRkJka0lzUlVGRFJTeExRVUZMZGtJc1dVRkJUQ3hEUVVGclFtdERMRmxCUVd4Q0xFZEJRV2xETEV0QlFVdHVReXcwUWtGQlRDeERRVUZyUTNkQ0xGVkJRVzVGT3p0QlFVVkdPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEVzWVVGQlMzQkNMR1ZCUVV3c1EwRkJjVUlzU1VGQmNrSTdRVUZEUkR0QlFVTkdPenRCUVVWRU96czdPenM3T3pzN096c3dRMEZSYzBKcFFpeERMRVZCUVVjN1FVRkRka0k3UVVGRFFTeFZRVUZKTEV0QlFVdGxMRk5CUVV3c1EwRkJaVU1zU1VGQlppeEhRVUZ6UWl4RFFVRXhRaXhGUVVORkxFdEJRVXRETEhOQ1FVRk1MRU5CUVRSQ2FrSXNRMEZCTlVJN08wRkJSVVk3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3hWUVVGSkxFdEJRVXR5UWl3MFFrRkJUQ3hEUVVGclEyOURMRk5CUVd4RExFTkJRVFJEUXl4SlFVRTFReXhIUVVGdFJDeERRVUZ1UkN4SlFVTkJMRXRCUVV0c1F5eFJRVUZNTEVOQlFXTklMRFJDUVVSa0xFbEJSVUVzUzBGQlMwRXNORUpCUVV3c1EwRkJhME4xUXl4UFFVWjBReXhGUVVkRk8wRkJRMEVzWVVGQlMwTXNjME5CUVV3c1EwRkJORU51UWl4RFFVRTFRenRCUVVORU96dEJRVVZFTzBGQlEwRTdRVUZEUVR0QlFVTkJMRlZCUVVrc1MwRkJTM0JDTEZsQlFVd3NRMEZCYTBKdFF5eFRRVUZzUWl4RFFVRTBRa01zU1VGQk5VSXNSMEZCYlVNc1EwRkJia01zU1VGRFFTeExRVUZMYkVNc1VVRkJUQ3hEUVVGalJpeFpRVVJrTEVsQlJVRXNTMEZCUzBFc1dVRkJUQ3hEUVVGclFuTkRMRTlCUm5SQ0xFVkJSMFU3UVVGRFFTeGhRVUZMUlN4elFrRkJUQ3hEUVVFMFFuQkNMRU5CUVRWQ08wRkJRMFE3TzBGQlJVUTdRVUZEUVR0QlFVTkJPMEZCUTBFc1ZVRkJTU3hMUVVGTGJrSXNXVUZCVEN4RFFVRnJRbXRETEZOQlFXeENMRU5CUVRSQ1F5eEpRVUUxUWl4SFFVRnRReXhEUVVGdVF5eEpRVU5CTEV0QlFVdHNReXhSUVVGTUxFTkJRV05FTEZsQlJHUXNTVUZGUVN4TFFVRkxRU3haUVVGTUxFTkJRV3RDYzBJc1ZVRkdkRUlzUlVGSFJUdEJRVU5CTEdGQlFVdHJRaXh6UWtGQlRDeERRVUUwUW5KQ0xFTkJRVFZDTzBGQlEwUTdRVUZEUmpzN1FVRkZSRHM3T3pzN096czdNa05CUzNWQ1FTeERMRVZCUVVjN1FVRkRlRUlzVlVGQlNYTkNMRmRCUVZjc1MwRkJTelZETEV0QlFYQkNPenRCUVVWQkxGVkJRVWx6UWl4RlFVRkZja0lzTkVKQlFVNHNSVUZCYjBNN1FVRkRiRU15UXl4cFFrRkJVeXhEUVVGVUxFbEJRV04wUWl4RlFVRkZja0lzTkVKQlFVWXNRMEZCSzBJeVFpeERRVUUzUXp0QlFVTkJaMElzYVVKQlFWTXNRMEZCVkN4SlFVRmpkRUlzUlVGQlJYSkNMRFJDUVVGR0xFTkJRU3RDTkVJc1EwRkJOME03UVVGRFFXVXNhVUpCUVZNc1EwRkJWQ3hKUVVGamRFSXNSVUZCUlhKQ0xEUkNRVUZHTEVOQlFTdENOa0lzUTBGQk4wTTdRVUZEUkRzN1FVRkZSQ3hWUVVGSlVpeEZRVUZGY0VJc1dVRkJUaXhGUVVGdlFqdEJRVU5zUWpCRExHbENRVUZUTEVOQlFWUXNTVUZCWTNSQ0xFVkJRVVZ3UWl4WlFVRkdMRU5CUVdVd1FpeERRVUUzUWp0QlFVTkJaMElzYVVKQlFWTXNRMEZCVkN4SlFVRmpkRUlzUlVGQlJYQkNMRmxCUVVZc1EwRkJaVEpDTEVOQlFUZENPMEZCUTBGbExHbENRVUZUTEVOQlFWUXNTVUZCWTNSQ0xFVkJRVVZ3UWl4WlFVRkdMRU5CUVdVMFFpeERRVUUzUWp0QlFVTkVPenRCUVVWRUxGVkJRVWxTTEVWQlFVVnVRaXhaUVVGT0xFVkJRVzlDTzBGQlEyeENlVU1zYVVKQlFWTXNRMEZCVkN4SlFVRmpkRUlzUlVGQlJXNUNMRmxCUVVZc1EwRkJaVFJDTEV0QlFUZENPMEZCUTBGaExHbENRVUZUTEVOQlFWUXNTVUZCWTNSQ0xFVkJRVVZ1UWl4WlFVRkdMRU5CUVdVMlFpeEpRVUUzUWp0QlFVTkJXU3hwUWtGQlV5eERRVUZVTEVsQlFXTjBRaXhGUVVGRmJrSXNXVUZCUml4RFFVRmxPRUlzUzBGQk4wSTdRVUZEUkRzN1FVRkZSQ3hYUVVGTFdTeEpRVUZNTEVOQlFWVkVMRkZCUVZZN1FVRkRSRHM3UVVGRlJEczdPenM3T3pzN01rUkJTM1ZEZEVJc1F5eEZRVUZITzBGQlEzaERMRlZCUVVselFpeFhRVUZYTEV0QlFVc3pReXcwUWtGQlRDeERRVUZyUTBRc1MwRkJha1E3TzBGQlJVRTBReXhsUVVGVExFTkJRVlFzU1VGQlkzUkNMRVZCUVVWeVFpdzBRa0ZCUml4RFFVRXJRakpDTEVOQlFTOUNMRWRCUVcxRExFdEJRVXQwUWl4blFrRkJkRVE3UVVGRFFYTkRMR1ZCUVZNc1EwRkJWQ3hKUVVGamRFSXNSVUZCUlhKQ0xEUkNRVUZHTEVOQlFTdENORUlzUTBGQkwwSXNSMEZCYlVNc1MwRkJTM1pDTEdkQ1FVRjBSRHRCUVVOQmMwTXNaVUZCVXl4RFFVRlVMRWxCUVdOMFFpeEZRVUZGY2tJc05FSkJRVVlzUTBGQkswSTJRaXhEUVVFdlFpeEhRVUZ0UXl4TFFVRkxlRUlzWjBKQlFYUkVPenRCUVVWQkxGZEJRVXRNTERSQ1FVRk1MRU5CUVd0RE5FTXNTVUZCYkVNc1EwRkJkVU5FTEZGQlFYWkRPMEZCUTBRN08wRkJSVVE3T3pzN096czdPenM3T3pKRFFWRjFRblJDTEVNc1JVRkJSenRCUVVONFFpeFZRVUZKYzBJc1YwRkJWeXhMUVVGTE1VTXNXVUZCVEN4RFFVRnJRa1lzUzBGQmFrTTdPMEZCUlVFc1ZVRkJTU3hMUVVGTFJTeFpRVUZNTEVOQlFXdENkVUlzVlVGQmRFSXNSVUZCYTBNN1FVRkRhRU03UVVGRFFXMUNMR2xDUVVGVExFTkJRVlFzU1VGQlkzUkNMRVZCUVVWd1FpeFpRVUZHTEVOQlFXVXdRaXhEUVVGbUxFZEJRVzFDTEV0QlFVdDBRaXhuUWtGQmRFTTdRVUZEUVhORExHbENRVUZUTEVOQlFWUXNTVUZCWTNSQ0xFVkJRVVZ3UWl4WlFVRkdMRU5CUVdVeVFpeERRVUZtTEVkQlFXMUNMRXRCUVV0MlFpeG5Ra0ZCZEVNN1FVRkRRWE5ETEdsQ1FVRlRMRU5CUVZRc1NVRkJZM1JDTEVWQlFVVndRaXhaUVVGR0xFTkJRV1UwUWl4RFFVRm1MRWRCUVcxQ0xFdEJRVXQ0UWl4blFrRkJkRU03UVVGRFJDeFBRVXhFTEUxQlMwOHNTVUZCU1N4TFFVRkxUQ3cwUWtGQlRDeERRVUZyUTNWRExFOUJRWFJETEVWQlFTdERPMEZCUTNCRU8wRkJRMEU3UVVGRFFTeFpRVUZOZGtNc0swSkJRU3RDTEVOQlEyNURjVUlzUlVGQlJYSkNMRFJDUVVGR0xFTkJRU3RDTWtJc1EwRkJMMElzUjBGQmJVTXNTMEZCUzNSQ0xHZENRVVJNTEVWQlJXNURaMElzUlVGQlJYSkNMRFJDUVVGR0xFTkJRU3RDTkVJc1EwRkJMMElzUjBGQmJVTXNTMEZCUzNaQ0xHZENRVVpNTEVWQlIyNURaMElzUlVGQlJYSkNMRFJDUVVGR0xFTkJRU3RDTmtJc1EwRkJMMElzUjBGQmJVTXNTMEZCUzNoQ0xHZENRVWhNTEVOQlFYSkRPMEZCUzBFc1dVRkJUWGRETEVsQlFVa3NTMEZCUzBNc05FSkJRV1k3TzBGQlJVRTdRVUZEUVN4aFFVRkxja01zZFVKQlFVd3NRMEZCTmtJc1EwRkJOMElzU1VGQmEwTXNRMEZCUXl4SlFVRkpiME1zUTBGQlRDeEpRVUZWTEVkQlFWWXNTVUZCYVVJM1F5dzJRa0ZCTmtJc1EwRkJOMElzU1VGQmEwTXNTMEZCUzFjc2FVTkJRVXdzUTBGQmRVTXNRMEZCZGtNc1EwRkJia1FzU1VGQlowZHJReXhKUVVGSkxFdEJRVXR3UXl4MVFrRkJUQ3hEUVVFMlFpeERRVUUzUWl4RFFVRjBTVHRCUVVOQkxHRkJRVXRCTEhWQ1FVRk1MRU5CUVRaQ0xFTkJRVGRDTEVsQlFXdERMRU5CUVVNc1NVRkJTVzlETEVOQlFVd3NTVUZCVlN4SFFVRldMRWxCUVdsQ04wTXNOa0pCUVRaQ0xFTkJRVGRDTEVsQlFXdERMRXRCUVV0WExHbERRVUZNTEVOQlFYVkRMRU5CUVhaRExFTkJRVzVFTEVsQlFXZEhhME1zU1VGQlNTeExRVUZMY0VNc2RVSkJRVXdzUTBGQk5rSXNRMEZCTjBJc1EwRkJkRWs3UVVGRFFTeGhRVUZMUVN4MVFrRkJUQ3hEUVVFMlFpeERRVUUzUWl4SlFVRnJReXhEUVVGRExFbEJRVWx2UXl4RFFVRk1MRWxCUVZVc1IwRkJWaXhKUVVGcFFqZERMRFpDUVVFMlFpeERRVUUzUWl4SlFVRnJReXhMUVVGTFZ5eHBRMEZCVEN4RFFVRjFReXhEUVVGMlF5eERRVUZ1UkN4SlFVRm5SMnRETEVsQlFVa3NTMEZCUzNCRExIVkNRVUZNTEVOQlFUWkNMRU5CUVRkQ0xFTkJRWFJKT3p0QlFVVkJMR0ZCUVV0RkxHbERRVUZNTEVOQlFYVkRMRU5CUVhaRExFbEJRVFJEV0N3MlFrRkJOa0lzUTBGQk4wSXNRMEZCTlVNN1FVRkRRU3hoUVVGTFZ5eHBRMEZCVEN4RFFVRjFReXhEUVVGMlF5eEpRVUUwUTFnc05rSkJRVFpDTEVOQlFUZENMRU5CUVRWRE8wRkJRMEVzWVVGQlMxY3NhVU5CUVV3c1EwRkJkVU1zUTBGQmRrTXNTVUZCTkVOWUxEWkNRVUUyUWl4RFFVRTNRaXhEUVVFMVF6czdRVUZGUVRKRExHbENRVUZUTEVOQlFWUXNTVUZCWXl4TFFVRkxiRU1zZFVKQlFVd3NRMEZCTmtJc1EwRkJOMElzUTBGQlpEdEJRVU5CYTBNc2FVSkJRVk1zUTBGQlZDeEpRVUZqTEV0QlFVdHNReXgxUWtGQlRDeERRVUUyUWl4RFFVRTNRaXhEUVVGa08wRkJRMEZyUXl4cFFrRkJVeXhEUVVGVUxFbEJRV01zUzBGQlMyeERMSFZDUVVGTUxFTkJRVFpDTEVOQlFUZENMRU5CUVdRN1FVRkRSRHM3UVVGRlJDeFhRVUZMVWl4WlFVRk1MRU5CUVd0Q01rTXNTVUZCYkVJc1EwRkJkVUpFTEZGQlFYWkNPMEZCUTBRN08wRkJSVVE3T3pzN096czdPekpEUVV0MVFuUkNMRU1zUlVGQlJ6dEJRVU40UWl4VlFVRkpjMElzVjBGQlZ5eExRVUZMZWtNc1dVRkJUQ3hEUVVGclFrZ3NTMEZCYWtNN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk5FTXNaVUZCVXl4RFFVRlVMRWxCUVdOMFFpeEZRVUZGYmtJc1dVRkJSaXhEUVVGbE9FSXNTMEZCTjBJN1FVRkRRVmNzWlVGQlV5eERRVUZVTEVsQlFXTjBRaXhGUVVGRmJrSXNXVUZCUml4RFFVRmxORUlzUzBGQk4wSXNSVUZEUVdFc1UwRkJVeXhEUVVGVUxFbEJRV04wUWl4RlFVRkZia0lzV1VGQlJpeERRVUZsTmtJc1NVRkVOMEk3TzBGQlIwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4VlFVTkZMRzFDUVVGVGVrSXNSVUZCVkN4RFFVRlpReXhOUVVGYUxFdEJRWFZDTEZOQlFYWkNMRWxCUTBGaUxHRkJRV0YxUXl4SlFVRmlMRU5CUVd0Q0xHMUNRVUZUUXl4SlFVRXpRaXhEUVVSQkxFbEJSVUZoTEZOQlFWTXNiVUpCUVZORExFOUJRVlFzUTBGQmFVSkRMRXRCUVdwQ0xFTkJRWFZDTEVkQlFYWkNMRVZCUVRSQ0xFTkJRVFZDTEVOQlFWUXNTVUZCTWtNc1JVRklOME1zUlVGSlJUdEJRVU5CVGl4cFFrRkJVeXhEUVVGVUxFdEJRV1ZvUkN4TFFVRm1PMEZCUTBGblJDeHBRa0ZCVXl4RFFVRlVMRXRCUVdWb1JDeExRVUZtTEVWQlEwRm5SQ3hUUVVGVExFTkJRVlFzUzBGQlpXaEVMRXRCUkdZN1FVRkZSRHM3UVVGRlJDeFhRVUZMVHl4WlFVRk1MRU5CUVd0Q01FTXNTVUZCYkVJc1EwRkJkVUpFTEZGQlFYWkNPMEZCUTBRN08wRkJSVVE3T3pzN096czdPekJFUVV0elEwOHNWeXhGUVVGaE8wRkJRMnBFTEZWQlFVMHhSQ3hOUVVGTlNDeGpRVUZhTzBGQlEwRXNWVUZCVFhkRUxFbEJRVWtzUjBGQlZpeERRVVpwUkN4RFFVVnNRenRCUVVObUxGVkJRVTFOTEdWQlFXZENMRTlCUVU5RUxGbEJRVmtzUTBGQldpeERRVUZRTEV0QlFUQkNMRkZCUVdoRU96dEJRVVZCTEZWQlFVa3NTMEZCUzNCRExIbENRVUZVTEVWQlFXOURPMEZCUTJ4RExGbEJRVWx6UXl4VFFVRlRMRWxCUVdJN1FVRkRRU3haUVVGSlF5eGpRVUZLTzBGQlEwRXNXVUZCU1VNc1pVRkJTanM3UVVGRlFTeFpRVUZKUXl3eVFrRkJNa0lzUTBGQkwwSTdRVUZEUVN4WlFVRkpReXd3UWtGQk1FSXNRMEZCT1VJN1FVRkRRU3haUVVGSlF5d3lRa0ZCTWtJc1EwRkJMMEk3TzBGQlJVRXNXVUZCVFVNc1UwRkJVMnhGTEUxQlFVMHNTMEZCUzNOQ0xIbENRVUV4UWpzN1FVRkZRU3haUVVGSmNVTXNXVUZCU2l4RlFVRnJRanRCUVVOb1FqdEJRVU5CTEdOQlFVa3NTMEZCUzNSRExHZENRVUZNTEVOQlFYTkNMRU5CUVhSQ0xFbEJRVEpDTEVkQlFUTkNMRWxCUVd0RGNVTXNXVUZCV1N4RFFVRmFMRWxCUVdsQ0xFVkJRWFpFTEVWQlEwVkxMREpDUVVFeVFpeEhRVUV6UWl4RFFVUkdMRXRCUlVzc1NVRkJTU3hMUVVGTE1VTXNaMEpCUVV3c1EwRkJjMElzUTBGQmRFSXNTVUZCTWtJc1JVRkJNMElzU1VGQmFVTnhReXhaUVVGWkxFTkJRVm9zU1VGQmFVSXNSMEZCZEVRc1JVRkRTRXNzTWtKQlFUSkNMRU5CUVVNc1IwRkJOVUk3UVVGRFNEczdRVUZGUkR0QlFVTkJMRmxCUVVrc1MwRkJTekZETEdkQ1FVRk1MRU5CUVhOQ0xFTkJRWFJDTEVsQlFUSkNMRWRCUVROQ0xFbEJRV3REY1VNc1dVRkJXU3hEUVVGYUxFbEJRV2xDTEVOQlFVTXNSMEZCZUVRc1JVRkRSVTBzTUVKQlFUQkNMRWRCUVRGQ0xFTkJSRVlzUzBGRlN5eEpRVUZKTEV0QlFVc3pReXhuUWtGQlRDeERRVUZ6UWl4RFFVRjBRaXhKUVVFeVFpeERRVUZETEVkQlFUVkNMRWxCUVcxRGNVTXNXVUZCV1N4RFFVRmFMRWxCUVdsQ0xFZEJRWGhFTEVWQlEwaE5MREJDUVVFd1FpeERRVUZETEVkQlFUTkNPenRCUVVWR08wRkJRMEVzV1VGQlNTeExRVUZMTTBNc1owSkJRVXdzUTBGQmMwSXNRMEZCZEVJc1NVRkJNa0lzUlVGQk0wSXNTVUZCYVVOeFF5eFpRVUZaTEVOQlFWb3NTVUZCYVVJc1EwRkJReXhGUVVGMlJDeEZRVU5GVHl3eVFrRkJNa0lzUjBGQk0wSXNRMEZFUml4TFFVVkxMRWxCUVVrc1MwRkJTelZETEdkQ1FVRk1MRU5CUVhOQ0xFTkJRWFJDTEVsQlFUSkNMRU5CUVVNc1JVRkJOVUlzU1VGQmEwTnhReXhaUVVGWkxFTkJRVm9zU1VGQmFVSXNSVUZCZGtRc1JVRkRTRThzTWtKQlFUSkNMRU5CUVVNc1IwRkJOVUk3TzBGQlJVWXNXVUZCU1VNc1UwRkJVeXhEUVVGaUxFVkJRV2RDTzBGQlEyUTdRVUZEUVN4alFVRkpVQ3haUVVGS0xFVkJRMFZETEZOQlFWTlFMRWxCUVVrc1MwRkJTMnBETEhWQ1FVRk1MRU5CUVRaQ0xFTkJRVGRDTEVOQlFVb3NSMEZCYzBNc1EwRkJReXhKUVVGSmFVTXNRMEZCVEN4TFFVRlhTeXhaUVVGWkxFTkJRVm9zU1VGQmFVSXNTMEZCUzNKRExHZENRVUZNTEVOQlFYTkNMRU5CUVhSQ0xFTkJRV3BDTEVkQlFUUkRNRU1zZDBKQlFYWkVMRWxCUVcxR1J5eE5RVUZzU1RzN1FVRkZSa3dzYTBKQlFWRlNMRWxCUVVrc1MwRkJTMnBETEhWQ1FVRk1MRU5CUVRaQ0xFTkJRVGRDTEVOQlFVb3NSMEZCYzBNc1EwRkJReXhKUVVGSmFVTXNRMEZCVEN4TFFVRlhTeXhaUVVGWkxFTkJRVm9zU1VGQmFVSXNTMEZCUzNKRExHZENRVUZNTEVOQlFYTkNMRU5CUVhSQ0xFTkJRV3BDTEVkQlFUUkRNa01zZFVKQlFYWkVMRWxCUVd0R1JTeE5RVUZvU1R0QlFVTkJTaXh0UWtGQlUxUXNTVUZCU1N4TFFVRkxha01zZFVKQlFVd3NRMEZCTmtJc1EwRkJOMElzUTBGQlNpeEhRVUZ6UXl4RFFVRkRMRWxCUVVscFF5eERRVUZNTEV0QlFWZExMRmxCUVZrc1EwRkJXaXhKUVVGcFFpeExRVUZMY2tNc1owSkJRVXdzUTBGQmMwSXNRMEZCZEVJc1EwRkJha0lzUjBGQk5FTTBReXgzUWtGQmRrUXNTVUZCYlVaRExFMUJRV3hKT3p0QlFVVkJMR1ZCUVVzNVF5eDFRa0ZCVEN4RFFVRTJRaXhEUVVFM1FpeEpRVUZyUTNkRExFMUJRV3hETzBGQlEwRXNaVUZCUzNoRExIVkNRVUZNTEVOQlFUWkNMRU5CUVRkQ0xFbEJRV3REZVVNc1MwRkJiRU03UVVGRFFTeGxRVUZMZWtNc2RVSkJRVXdzUTBGQk5rSXNRMEZCTjBJc1NVRkJhME13UXl4TlFVRnNRenRCUVVORU96dEJRVVZFTzBGQlEwRXNZVUZCUzNCRUxGbEJRVXdzUTBGQmEwSXdReXhKUVVGc1FpeERRVUYxUWl4TFFVRkxhRU1zZFVKQlFUVkNPMEZCUTBRN08wRkJSVVFzVjBGQlMwVXNlVUpCUVV3c1IwRkJhVU4wUWl4SFFVRnFRenRCUVVOQkxGZEJRVXR4UWl4blFrRkJUQ3hEUVVGelFpeERRVUYwUWl4SlFVRXlRbkZETEZsQlFWa3NRMEZCV2l4RFFVRXpRanRCUVVOQkxGZEJRVXR5UXl4blFrRkJUQ3hEUVVGelFpeERRVUYwUWl4SlFVRXlRbkZETEZsQlFWa3NRMEZCV2l4RFFVRXpRanRCUVVOQkxGZEJRVXR5UXl4blFrRkJUQ3hEUVVGelFpeERRVUYwUWl4SlFVRXlRbkZETEZsQlFWa3NRMEZCV2l4RFFVRXpRanRCUVVORU96dEJRVVZFT3pzN096czdRVUZOUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdPenMyUWtGRlUxTXNTU3hGUVVGTk8wRkJRMklzVjBGQlN6VkRMR2RDUVVGTUxFTkJRWE5DTkVNc1NVRkJkRUk3UVVGRFJEczdRVUZGUkRzN096czdPenM3TWtKQlMwODdRVUZCUVRzN1FVRkRUQ3d3U1VGQmEwSXNWVUZCUTBNc1QwRkJSQ3hGUVVGaE8wRkJRemRDTEdWQlFVdDRSQ3hsUVVGTUxFZEJRWFZDZDBRc1QwRkJka0k3TzBGQlJVRXNXVUZCU1hSRkxFOUJRVTkxUlN4cFFrRkJXQ3hGUVVFNFFqdEJRVU0xUWl4cFFrRkJTemxETEdkQ1FVRk1MRWRCUVhkQ0xFOUJRVXRITEd0Q1FVRTNRanRCUVVOQk8wRkJRMEVzWTBGQlNTeFBRVUZQTWtNc2EwSkJRV3RDUXl4cFFrRkJla0lzUzBGQkswTXNWVUZCYmtRc1JVRkJLMFE3UVVGRE4wUkVMRGhDUVVGclFrTXNhVUpCUVd4Q0xFZEJRMGRETEVsQlJFZ3NRMEZEVVN3eVFrRkJiVUk3UVVGRGRrSXNhMEpCUVVsRExHOUNRVUZ2UWl4VFFVRjRRaXhGUVVGdFF6dEJRVU5xUXpGRkxIVkNRVUZQTWtVc1owSkJRVkFzUTBGQmQwSXNZMEZCZUVJc1JVRkJkME1zVDBGQlMycEVMRkZCUVRkRE8wRkJRMFE3UVVGRFJpeGhRVXhJTEVWQlRVZHJSQ3hMUVU1SUxFTkJUVk5ETEZGQlFWRkRMRXRCVG1wQ08wRkJUMFFzVjBGU1JDeE5RVkZQTzBGQlEwdzdRVUZEUVRsRkxHMUNRVUZQTWtVc1owSkJRVkFzUTBGQmQwSXNZMEZCZUVJc1JVRkJkME1zVDBGQlMycEVMRkZCUVRkRE8wRkJRMFE3TzBGQlJVUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeGpRVUZKTEcxQ1FVRlRhMElzU1VGQlZDeExRVUZyUWl4VFFVRnNRaXhKUVVOR0xHMUNRVUZUTlVJc1JVRkJWQ3hEUVVGWlF5eE5RVUZhTEV0QlFYVkNMRk5CUkhKQ0xFbEJSVVlzYlVKQlFWTkVMRVZCUVZRc1EwRkJXVU1zVFVGQldpeExRVUYxUWl4TFFVWjZRaXhGUVVkRk8wRkJRMEUwUkN4dlFrRkJVVVVzU1VGQlVpeERRVUZoTEcxRVFVRmlPMEZCUTBFc2JVSkJRVXM1UXl4bFFVRk1MRWRCUVhWQ0swTXNWMEZCVnp0QlFVRkJMSEZDUVVGTlZpeGxRVUZPTzBGQlFVRXNZVUZCV0N4RlFVRm5ReXhKUVVGSkxFbEJRWEJETEVOQlFYWkNPMEZCUTBRN1FVRkRSanM3UVVGRlJEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCTVVOQkxHRkJOa05GUVR0QlFVTklMRTlCYWtSRU8wRkJhMFJFT3pzN2QwSkJNV0ZyUXp0QlFVTnFReXhoUVVGUGFFVXNTMEZCU3pKRkxFZEJRVXdzUTBGQlV5eERRVUZETEVOQlFVUXNSMEZCU3pORkxFdEJRVXRETEVWQlFWWXNSMEZCWlN4TFFVRkxSeXcwUWtGQlRDeERRVUZyUTNsQ0xFMUJRV3BFTEVkQlFUQkVMRXRCUVV0bUxHMURRVUY0UlN4RFFVRlFPMEZCUTBRN096czdPenRyUWtFeVlWa3NTVUZCU1Zvc2EwSkJRVW9zUlNJc0ltWnBiR1VpT2lKRVpYWnBZMlZOYjNScGIyNU5iMlIxYkdVdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpwYlhCdmNuUWdTVzV3ZFhSTmIyUjFiR1VnWm5KdmJTQW5MaTlKYm5CMWRFMXZaSFZzWlNjN1hHNXBiWEJ2Y25RZ1JFOU5SWFpsYm5SVGRXSnRiMlIxYkdVZ1puSnZiU0FuTGk5RVQwMUZkbVZ1ZEZOMVltMXZaSFZzWlNjN1hHNXBiWEJ2Y25RZ1RXOTBhVzl1U1c1d2RYUWdabkp2YlNBbkxpOU5iM1JwYjI1SmJuQjFkQ2M3WEc1cGJYQnZjblFnY0d4aGRHWnZjbTBnWm5KdmJTQW5jR3hoZEdadmNtMG5PMXh1WEc0dktpcGNiaUFxSUVkbGRITWdkR2hsSUdOMWNuSmxiblFnYkc5allXd2dkR2x0WlNCcGJpQnpaV052Ym1SekxseHVJQ29nVlhObGN5QmdkMmx1Wkc5M0xuQmxjbVp2Y20xaGJtTmxMbTV2ZHlncFlDQnBaaUJoZG1GcGJHRmliR1VzSUdGdVpDQmdSR0YwWlM1dWIzY29LV0FnYjNSb1pYSjNhWE5sTGx4dUlDcGNiaUFxSUVCeVpYUjFjbTRnZTI1MWJXSmxjbjFjYmlBcUwxeHVablZ1WTNScGIyNGdaMlYwVEc5allXeFVhVzFsS0NrZ2UxeHVJQ0JwWmlBb2QybHVaRzkzTG5CbGNtWnZjbTFoYm1ObEtWeHVJQ0FnSUhKbGRIVnliaUIzYVc1a2IzY3VjR1Z5Wm05eWJXRnVZMlV1Ym05M0tDa2dMeUF4TURBd08xeHVJQ0J5WlhSMWNtNGdSR0YwWlM1dWIzY29LU0F2SURFd01EQTdYRzU5WEc1Y2JtTnZibk4wSUdOb2NtOXRaVkpsWjBWNGNDQTlJQzlEYUhKdmJXVXZPMXh1WTI5dWMzUWdkRzlFWldjZ1BTQXhPREFnTHlCTllYUm9MbEJKTzF4dVhHNHZLaXBjYmlBcUlHQkVaWFpwWTJWTmIzUnBiMjVnSUcxdlpIVnNaU0J6YVc1bmJHVjBiMjR1WEc0Z0tpQlVhR1VnWUVSbGRtbGpaVTF2ZEdsdmJrMXZaSFZzWldBZ2MybHVaMnhsZEc5dUlIQnliM1pwWkdWeklIUm9aU0J5WVhjZ2RtRnNkV1Z6WEc0Z0tpQnZaaUIwYUdVZ1lXTmpaV3hsY21GMGFXOXVJR2x1WTJ4MVpHbHVaeUJuY21GMmFYUjVMQ0JoWTJObGJHVnlZWFJwYjI0c0lHRnVaQ0J5YjNSaGRHbHZibHh1SUNvZ2NtRjBaU0J3Y205MmFXUmxaQ0JpZVNCMGFHVWdZRVJsZG1salpVMXZkR2x2Ym1BZ1pYWmxiblF1WEc0Z0tpQkpkQ0JoYkhOdklHbHVjM1JoYm5ScFlYUmxJSFJvWlNCZ1FXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVXQXNYRzRnS2lCZ1FXTmpaV3hsY21GMGFXOXVZQ0JoYm1RZ1lGSnZkR0YwYVc5dVVtRjBaV0FnYzNWaWJXOWtkV3hsY3lCMGFHRjBJSFZ1YVdaNUlIUm9iM05sSUhaaGJIVmxjMXh1SUNvZ1lXTnliM056SUhCc1lYUm1iM0p0Y3lCaWVTQnRZV3RwYm1jZ2RHaGxiU0JqYjIxd2JHbGhiblFnZDJsMGFDQjdRR3hwYm10Y2JpQXFJR2gwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MMVJTTDI5eWFXVnVkR0YwYVc5dUxXVjJaVzUwTDN4MGFHVWdWek5ESUhOMFlXNWtZWEprZlM1Y2JpQXFJRmRvWlc0Z2NtRjNJSFpoYkhWbGN5QmhjbVVnYm05MElIQnliM1pwWkdWa0lHSjVJSFJvWlNCelpXNXpiM0p6TENCMGFHbHpJRzF2WkhWc1pYTWdkSEpwWlhOY2JpQXFJSFJ2SUhKbFkyRnNZM1ZzWVhSbElIUm9aVzBnWm5KdmJTQmhkbUZwYkdGaWJHVWdkbUZzZFdWek9seHVJQ29nTFNCZ1lXTmpaV3hsY21GMGFXOXVZQ0JwY3lCallXeGpkV3hoZEdWa0lHWnliMjBnWUdGalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhsZ1hHNGdLaUFnSUhkcGRHZ2dZU0JvYVdkb0xYQmhjM01nWm1sc2RHVnlPMXh1SUNvZ0xTQW9ZMjl0YVc1bklITnZiMjRnNG9DVUlIZGhhWFJwYm1jZ1ptOXlJR0VnWW5WbklHOXVJRU5vY205dFpTQjBieUJpWlNCeVpYTnZiSFpsWkNsY2JpQXFJQ0FnWUhKdmRHRjBhVzl1VW1GMFpXQWdhWE1nWTJGc1kzVnNZWFJsWkNCbWNtOXRJR0J2Y21sbGJuUmhkR2x2Ym1BdVhHNGdLbHh1SUNvZ1FHTnNZWE56SUVSbGRtbGpaVTF2ZEdsdmJrMXZaSFZzWlZ4dUlDb2dRR1Y0ZEdWdVpITWdTVzV3ZFhSTmIyUjFiR1ZjYmlBcUwxeHVZMnhoYzNNZ1JHVjJhV05sVFc5MGFXOXVUVzlrZFd4bElHVjRkR1Z1WkhNZ1NXNXdkWFJOYjJSMWJHVWdlMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRjbVZoZEdWeklIUm9aU0JnUkdWMmFXTmxUVzkwYVc5dVlDQnRiMlIxYkdVZ2FXNXpkR0Z1WTJVdVhHNGdJQ0FxWEc0Z0lDQXFJRUJqYjI1emRISjFZM1J2Y2x4dUlDQWdLaTljYmlBZ1kyOXVjM1J5ZFdOMGIzSW9LU0I3WEc0Z0lDQWdjM1Z3WlhJb0oyUmxkbWxqWlcxdmRHbHZiaWNwTzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1VtRjNJSFpoYkhWbGN5QmpiMjFwYm1jZ1puSnZiU0IwYUdVZ1lHUmxkbWxqWlcxdmRHbHZibUFnWlhabGJuUWdjMlZ1ZENCaWVTQjBhR2x6SUcxdlpIVnNaUzVjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFJRUIwYUdseklFUmxkbWxqWlUxdmRHbHZiazF2WkhWc1pWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0dWRXMWlaWEpiWFgxY2JpQWdJQ0FnS2lCQVpHVm1ZWFZzZENCYmJuVnNiQ3dnYm5Wc2JDd2diblZzYkN3Z2JuVnNiQ3dnYm5Wc2JDd2diblZzYkN3Z2JuVnNiQ3dnYm5Wc2JDd2diblZzYkYxY2JpQWdJQ0FnS2k5Y2JpQWdJQ0IwYUdsekxtVjJaVzUwSUQwZ1cyNTFiR3dzSUc1MWJHd3NJRzUxYkd3c0lHNTFiR3dzSUc1MWJHd3NJRzUxYkd3c0lHNTFiR3dzSUc1MWJHd3NJRzUxYkd4ZE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dWR2hsSUdCQlkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNVlDQnRiMlIxYkdVdVhHNGdJQ0FnSUNvZ1VISnZkbWxrWlhNZ2RXNXBabWxsWkNCMllXeDFaWE1nYjJZZ2RHaGxJR0ZqWTJWc1pYSmhkR2x2YmlCcGJtTnNkV1JwYm1jZ1ozSmhkbWwwZVM1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCMGFHbHpJRVJsZG1salpVMXZkR2x2YmsxdlpIVnNaVnh1SUNBZ0lDQXFJRUIwZVhCbElIdEVUMDFGZG1WdWRGTjFZbTF2WkhWc1pYMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbUZqWTJWc1pYSmhkR2x2YmtsdVkyeDFaR2x1WjBkeVlYWnBkSGtnUFNCdVpYY2dSRTlOUlhabGJuUlRkV0p0YjJSMWJHVW9kR2hwY3l3Z0oyRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIa25LVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSb1pTQmdRV05qWld4bGNtRjBhVzl1WUNCemRXSnRiMlIxYkdVdVhHNGdJQ0FnSUNvZ1VISnZkbWxrWlhNZ2RXNXBabWxsWkNCMllXeDFaWE1nYjJZZ2RHaGxJR0ZqWTJWc1pYSmhkR2x2Ymk1Y2JpQWdJQ0FnS2lCRmMzUnBiV0YwWlhNZ2RHaGxJR0ZqWTJWc1pYSmhkR2x2YmlCMllXeDFaWE1nWm5KdmJTQmdZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlV0JjYmlBZ0lDQWdLaUJ5WVhjZ2RtRnNkV1Z6SUdsbUlIUm9aU0JoWTJObGJHVnlZWFJwYjI0Z2NtRjNJSFpoYkhWbGN5QmhjbVVnYm05MElHRjJZV2xzWVdKc1pTQnZiaUIwYUdWY2JpQWdJQ0FnS2lCa1pYWnBZMlV1WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBZEdocGN5QkVaWFpwWTJWTmIzUnBiMjVOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1JFOU5SWFpsYm5SVGRXSnRiMlIxYkdWOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWhZMk5sYkdWeVlYUnBiMjRnUFNCdVpYY2dSRTlOUlhabGJuUlRkV0p0YjJSMWJHVW9kR2hwY3l3Z0oyRmpZMlZzWlhKaGRHbHZiaWNwTzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1ZHaGxJR0JTYjNSaGRHbHZibEpoZEdWZ0lITjFZbTF2WkhWc1pTNWNiaUFnSUNBZ0tpQlFjbTkyYVdSbGN5QjFibWxtYVdWa0lIWmhiSFZsY3lCdlppQjBhR1VnY205MFlYUnBiMjRnY21GMFpTNWNiaUFnSUNBZ0tpQW9ZMjl0YVc1bklITnZiMjRzSUhkaGFYUnBibWNnWm05eUlHRWdZblZuSUc5dUlFTm9jbTl0WlNCMGJ5QmlaU0J5WlhOdmJIWmxaQ2xjYmlBZ0lDQWdLaUJGYzNScGJXRjBaWE1nZEdobElISnZkR0YwYVc5dUlISmhkR1VnZG1Gc2RXVnpJR1p5YjIwZ1lHOXlhV1Z1ZEdGMGFXOXVZQ0IyWVd4MVpYTWdhV1pjYmlBZ0lDQWdLaUIwYUdVZ2NtOTBZWFJwYjI0Z2NtRjBaU0J5WVhjZ2RtRnNkV1Z6SUdGeVpTQnViM1FnWVhaaGFXeGhZbXhsSUc5dUlIUm9aU0JrWlhacFkyVXVYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFkR2hwY3lCRVpYWnBZMlZOYjNScGIyNU5iMlIxYkdWY2JpQWdJQ0FnS2lCQWRIbHdaU0I3UkU5TlJYWmxiblJUZFdKdGIyUjFiR1Y5WEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1eWIzUmhkR2x2YmxKaGRHVWdQU0J1WlhjZ1JFOU5SWFpsYm5SVGRXSnRiMlIxYkdVb2RHaHBjeXdnSjNKdmRHRjBhVzl1VW1GMFpTY3BPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVW1WeGRXbHlaV1FnYzNWaWJXOWtkV3hsY3lBdklHVjJaVzUwY3k1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCMGFHbHpJRVJsZG1salpVMXZkR2x2YmsxdlpIVnNaVnh1SUNBZ0lDQXFJRUIwZVhCbElIdHZZbXBsWTNSOVhHNGdJQ0FnSUNvZ1FIQnliM0JsY25SNUlIdGliMjlzZlNCaFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUlDMGdTVzVrYVdOaGRHVnpJSGRvWlhSb1pYSWdkR2hsSUdCaFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNVlDQjFibWxtYVdWa0lIWmhiSFZsY3lCaGNtVWdjbVZ4ZFdseVpXUWdiM0lnYm05MElDaGtaV1poZFd4MGN5QjBieUJnWm1Gc2MyVmdLUzVjYmlBZ0lDQWdLaUJBY0hKdmNHVnlkSGtnZTJKdmIyeDlJR0ZqWTJWc1pYSmhkR2x2YmlBdElFbHVaR2xqWVhSbGN5QjNhR1YwYUdWeUlIUm9aU0JnWVdOalpXeGxjbUYwYVc5dVlDQjFibWxtYVdWa0lIWmhiSFZsY3lCaGNtVWdjbVZ4ZFdseVpXUWdiM0lnYm05MElDaGtaV1poZFd4MGN5QjBieUJnWm1Gc2MyVmdLUzVjYmlBZ0lDQWdLaUJBY0hKdmNHVnlkSGtnZTJKdmIyeDlJSEp2ZEdGMGFXOXVVbUYwWlNBdElFbHVaR2xqWVhSbGN5QjNhR1YwYUdWeUlIUm9aU0JnY205MFlYUnBiMjVTWVhSbFlDQjFibWxtYVdWa0lIWmhiSFZsY3lCaGNtVWdjbVZ4ZFdseVpXUWdiM0lnYm05MElDaGtaV1poZFd4MGN5QjBieUJnWm1Gc2MyVmdLUzVjYmlBZ0lDQWdLaTljYmlBZ0lDQjBhR2x6TG5KbGNYVnBjbVZrSUQwZ2UxeHVJQ0FnSUNBZ1lXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVUb2dabUZzYzJVc1hHNGdJQ0FnSUNCaFkyTmxiR1Z5WVhScGIyNDZJR1poYkhObExGeHVJQ0FnSUNBZ2NtOTBZWFJwYjI1U1lYUmxPaUJtWVd4elpWeHVJQ0FnSUgwN1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlNaWE52YkhabElHWjFibU4wYVc5dUlHOW1JSFJvWlNCdGIyUjFiR1VuY3lCd2NtOXRhWE5sTGx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUhSb2FYTWdSR1YyYVdObFRXOTBhVzl1VFc5a2RXeGxYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UyWjFibU4wYVc5dWZWeHVJQ0FnSUNBcUlFQmtaV1poZFd4MElHNTFiR3hjYmlBZ0lDQWdLaUJBYzJWbElFUmxkbWxqWlUxdmRHbHZiazF2WkhWc1pTTnBibWwwWEc0Z0lDQWdJQ292WEc0Z0lDQWdkR2hwY3k1ZmNISnZiV2x6WlZKbGMyOXNkbVVnUFNCdWRXeHNPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVlc1cFpubHBibWNnWm1GamRHOXlJRzltSUhSb1pTQnRiM1JwYjI0Z1pHRjBZU0IyWVd4MVpYTWdLR0F4WUNCdmJpQkJibVJ5YjJsa0xDQmdMVEZnSUc5dUlHbFBVeWt1WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBZEdocGN5QkVaWFpwWTJWTmIzUnBiMjVOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN2JuVnRZbVZ5ZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVgzVnVhV1o1VFc5MGFXOXVSR0YwWVNBOUlDaHdiR0YwWm05eWJTNXZjeTVtWVcxcGJIa2dQVDA5SUNkcFQxTW5LU0EvSUMweElEb2dNVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZWdWFXWjVhVzVuSUdaaFkzUnZjaUJ2WmlCMGFHVWdjR1Z5YVc5a0lDaGdNV0FnYjI0Z1FXNWtjbTlwWkN3Z1lERmdJRzl1SUdsUFV5a3VJR2x1SUhObFkxeHVJQ0FnSUNBcUlFQjBiMlJ2SUMwZ2RXNXBabmtnZDJsMGFDQmxMbWx1ZEdWeWRtRnNJSE53WldOcFptbGpZWFJwYjI0Z0tHbHVJRzF6S1NBL1hHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWRHaHBjeUJFWlhacFkyVk5iM1JwYjI1TmIyUjFiR1ZjYmlBZ0lDQWdLaUJBZEhsd1pTQjdiblZ0WW1WeWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVYM1Z1YVdaNVVHVnlhVzlrSUQwZ0tIQnNZWFJtYjNKdExtOXpMbVpoYldsc2VTQTlQVDBnSjBGdVpISnZhV1FuS1NBL0lEQXVNREF4SURvZ01UdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUZqWTJWc1pYSmhkR2x2YmlCallXeGpkV3hoZEdWa0lHWnliMjBnZEdobElHQmhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVZQ0J5WVhjZ2RtRnNkV1Z6TGx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUhSb2FYTWdSR1YyYVdObFRXOTBhVzl1VFc5a2RXeGxYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UyNTFiV0psY2x0ZGZWeHVJQ0FnSUNBcUlFQmtaV1poZFd4MElGc3dMQ0F3TENBd1hWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhSb2FYTXVYMk5oYkdOMWJHRjBaV1JCWTJObGJHVnlZWFJwYjI0Z1BTQmJNQ3dnTUN3Z01GMDdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJVYVcxbElHTnZibk4wWVc1MElDaG9ZV3htTFd4cFptVXBJRzltSUhSb1pTQm9hV2RvTFhCaGMzTWdabWxzZEdWeUlIVnpaV1FnZEc4Z2MyMXZiM1JvSUhSb1pTQmhZMk5sYkdWeVlYUnBiMjRnZG1Gc2RXVnpJR05oYkdOMWJHRjBaV1FnWm5KdmJTQjBhR1VnWVdOalpXeGxjbUYwYVc5dUlHbHVZMngxWkdsdVp5Qm5jbUYyYVhSNUlISmhkeUIyWVd4MVpYTWdLR2x1SUhObFkyOXVaSE1wTGx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUhSb2FYTWdSR1YyYVdObFRXOTBhVzl1VFc5a2RXeGxYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2UyNTFiV0psY24xY2JpQWdJQ0FnS2lCQVpHVm1ZWFZzZENBd0xqRmNiaUFnSUNBZ0tpQkFZMjl1YzNSaGJuUmNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbDlqWVd4amRXeGhkR1ZrUVdOalpXeGxjbUYwYVc5dVZHbHRaVU52Ym5OMFlXNTBJRDBnTUM0eE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dUR0YwWlhOMElHQmhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVZQ0J5WVhjZ2RtRnNkV1VzSUhWelpXUWdhVzRnZEdobElHaHBaMmd0Y0dGemN5Qm1hV3gwWlhJZ2RHOGdZMkZzWTNWc1lYUmxJSFJvWlNCaFkyTmxiR1Z5WVhScGIyNGdLR2xtSUhSb1pTQmdZV05qWld4bGNtRjBhVzl1WUNCMllXeDFaWE1nWVhKbElHNXZkQ0J3Y205MmFXUmxaQ0JpZVNCZ0oyUmxkbWxqWlcxdmRHbHZiaWRnS1M1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCMGFHbHpJRVJsZG1salpVMXZkR2x2YmsxdlpIVnNaVnh1SUNBZ0lDQXFJRUIwZVhCbElIdHVkVzFpWlhKYlhYMWNiaUFnSUNBZ0tpQkFaR1ZtWVhWc2RDQmJNQ3dnTUN3Z01GMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGFHbHpMbDlzWVhOMFFXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVTQTlJRnN3TENBd0xDQXdYVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZKdmRHRjBhVzl1SUhKaGRHVWdZMkZzWTNWc1lYUmxaQ0JtY205dElIUm9aU0J2Y21sbGJuUmhkR2x2YmlCMllXeDFaWE11WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBZEdocGN5QkVaWFpwWTJWTmIzUnBiMjVOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN2JuVnRZbVZ5VzExOVhHNGdJQ0FnSUNvZ1FHUmxabUYxYkhRZ1d6QXNJREFzSURCZFhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWZZMkZzWTNWc1lYUmxaRkp2ZEdGMGFXOXVVbUYwWlNBOUlGc3dMQ0F3TENBd1hUdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRXhoZEdWemRDQnZjbWxsYm5SaGRHbHZiaUIyWVd4MVpTd2dkWE5sWkNCMGJ5QmpZV3hqZFd4aGRHVWdkR2hsSUhKdmRHRjBhVzl1SUhKaGRHVWdJQ2hwWmlCMGFHVWdZSEp2ZEdGMGFXOXVVbUYwWldBZ2RtRnNkV1Z6SUdGeVpTQnViM1FnY0hKdmRtbGtaV1FnWW5rZ1lDZGtaWFpwWTJWdGIzUnBiMjRuWUNrdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWRHaHBjeUJFWlhacFkyVk5iM1JwYjI1TmIyUjFiR1ZjYmlBZ0lDQWdLaUJBZEhsd1pTQjdiblZ0WW1WeVcxMTlYRzRnSUNBZ0lDb2dRR1JsWm1GMWJIUWdXekFzSURBc0lEQmRYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVmYkdGemRFOXlhV1Z1ZEdGMGFXOXVJRDBnV3pBc0lEQXNJREJkTzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1RHRjBaWE4wSUc5eWFXVnVkR0YwYVc5dUlIUnBiV1Z6ZEdGdGNITXNJSFZ6WldRZ2RHOGdZMkZzWTNWc1lYUmxJSFJvWlNCeWIzUmhkR2x2YmlCeVlYUmxJQ2hwWmlCMGFHVWdZSEp2ZEdGMGFXOXVVbUYwWldBZ2RtRnNkV1Z6SUdGeVpTQnViM1FnY0hKdmRtbGtaV1FnWW5rZ1lDZGtaWFpwWTJWdGIzUnBiMjRuWUNrdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWRHaHBjeUJFWlhacFkyVk5iM1JwYjI1TmIyUjFiR1ZjYmlBZ0lDQWdLaUJBZEhsd1pTQjdiblZ0WW1WeVcxMTlYRzRnSUNBZ0lDb2dRR1JsWm1GMWJIUWdXekFzSURBc0lEQmRYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RHaHBjeTVmYkdGemRFOXlhV1Z1ZEdGMGFXOXVWR2x0WlhOMFlXMXdJRDBnYm5Wc2JEdGNibHh1SUNBZ0lIUm9hWE11WDNCeWIyTmxjM05HZFc1amRHbHZiaUE5SUc1MWJHdzdYRzRnSUNBZ2RHaHBjeTVmY0hKdlkyVnpjeUE5SUhSb2FYTXVYM0J5YjJObGMzTXVZbWx1WkNoMGFHbHpLVHRjYmlBZ0lDQjBhR2x6TGw5a1pYWnBZMlZ0YjNScGIyNURhR1ZqYXlBOUlIUm9hWE11WDJSbGRtbGpaVzF2ZEdsdmJrTm9aV05yTG1KcGJtUW9kR2hwY3lrN1hHNGdJQ0FnZEdocGN5NWZaR1YyYVdObGJXOTBhVzl1VEdsemRHVnVaWElnUFNCMGFHbHpMbDlrWlhacFkyVnRiM1JwYjI1TWFYTjBaVzVsY2k1aWFXNWtLSFJvYVhNcE8xeHVYRzRnSUNBZ2RHaHBjeTVmWTJobFkydERiM1Z1ZEdWeUlEMGdNRHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCRVpXTmhlU0JtWVdOMGIzSWdiMllnZEdobElHaHBaMmd0Y0dGemN5Qm1hV3gwWlhJZ2RYTmxaQ0IwYnlCallXeGpkV3hoZEdVZ2RHaGxJR0ZqWTJWc1pYSmhkR2x2YmlCbWNtOXRJSFJvWlNCZ1lXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVXQWdjbUYzSUhaaGJIVmxjeTVjYmlBZ0lDcGNiaUFnSUNvZ1FIUjVjR1VnZTI1MWJXSmxjbjFjYmlBZ0lDb2dRSEpsWVdSdmJteDVYRzRnSUNBcUwxeHVJQ0JuWlhRZ1gyTmhiR04xYkdGMFpXUkJZMk5sYkdWeVlYUnBiMjVFWldOaGVTZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1RXRjBhQzVsZUhBb0xUSWdLaUJOWVhSb0xsQkpJQ29nZEdocGN5NWhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVMbkJsY21sdlpDQXZJSFJvYVhNdVgyTmhiR04xYkdGMFpXUkJZMk5sYkdWeVlYUnBiMjVVYVcxbFEyOXVjM1JoYm5RcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRk5sYm5OdmNpQmphR1ZqYXlCdmJpQnBibWwwYVdGc2FYcGhkR2x2YmlCdlppQjBhR1VnYlc5a2RXeGxMbHh1SUNBZ0tpQlVhR2x6SUcxbGRHaHZaRHBjYmlBZ0lDb2dMU0JqYUdWamEzTWdkMmhsZEdobGNpQjBhR1VnWUdGalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhsZ0xDQjBhR1VnWUdGalkyVnNaWEpoZEdsdmJtQXNYRzRnSUNBcUlDQWdZVzVrSUhSb1pTQmdjbTkwWVhScGIyNVNZWFJsWUNCMllXeDFaWE1nWVhKbElIWmhiR2xrSUc5eUlHNXZkRHRjYmlBZ0lDb2dMU0JuWlhSeklIUm9aU0J3WlhKcGIyUWdiMllnZEdobElHQW5aR1YyYVdObGJXOTBhVzl1SjJBZ1pYWmxiblFnWVc1a0lITmxkSE1nZEdobElIQmxjbWx2WkNCdlpseHVJQ0FnS2lBZ0lIUm9aU0JnUVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVdBc0lHQkJZMk5sYkdWeVlYUnBiMjVnTENCaGJtUWdZRkp2ZEdGMGFXOXVVbUYwWldCY2JpQWdJQ29nSUNCemRXSnRiMlIxYkdWek8xeHVJQ0FnS2lBdElDaHBiaUIwYUdVZ1kyRnpaU0IzYUdWeVpTQmhZMk5sYkdWeVlYUnBiMjRnY21GM0lIWmhiSFZsY3lCaGNtVWdibTkwSUhCeWIzWnBaR1ZrS1Z4dUlDQWdLaUFnSUdsdVpHbGpZWFJsY3lCM2FHVjBhR1Z5SUhSb1pTQmhZMk5sYkdWeVlYUnBiMjRnWTJGdUlHSmxJR05oYkdOMWJHRjBaV1FnWm5KdmJTQjBhR1ZjYmlBZ0lDb2dJQ0JnWVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVdBZ2RXNXBabWxsWkNCMllXeDFaWE1nYjNJZ2JtOTBMbHh1SUNBZ0tseHVJQ0FnS2lCQWNHRnlZVzBnZTBSbGRtbGpaVTF2ZEdsdmJrVjJaVzUwZlNCbElDMGdWR2hsSUdacGNuTjBJR0FuWkdWMmFXTmxiVzkwYVc5dUoyQWdaWFpsYm5RZ1kyRjFaMmgwTGx4dUlDQWdLaTljYmlBZ1gyUmxkbWxqWlcxdmRHbHZia05vWldOcktHVXBJSHRjYmlBZ0lDQXZMeUJqYkdWaGNpQjBhVzFsYjNWMElDaGhiblJwTFVacGNtVm1iM2dnWW5WbklITnZiSFYwYVc5dUxDQjNhVzVrYjNjZ1pYWmxiblFnWkdWMmFXTmxiM0pwWlc1MFlYUnBiMjRnWW1WcGJtY2diblpsY2lCallXeHNaV1FwWEc0Z0lDQWdMeThnYzJWMElIUm9aU0J6WlhRZ2RHbHRaVzkxZENCcGJpQnBibWwwS0NrZ1puVnVZM1JwYjI1Y2JpQWdJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2RHaHBjeTVmWTJobFkydFVhVzFsYjNWMFNXUXBPMXh1WEc0Z0lDQWdkR2hwY3k1cGMxQnliM1pwWkdWa0lEMGdkSEoxWlR0Y2JpQWdJQ0IwYUdsekxuQmxjbWx2WkNBOUlHVXVhVzUwWlhKMllXd2dMeUF4TURBd08xeHVJQ0FnSUhSb2FYTXVhVzUwWlhKMllXd2dQU0JsTG1sdWRHVnlkbUZzTzF4dVhHNGdJQ0FnTHk4Z1UyVnVjMjl5SUdGMllXbHNZV0pwYkdsMGVTQm1iM0lnZEdobElHRmpZMlZzWlhKaGRHbHZiaUJwYm1Oc2RXUnBibWNnWjNKaGRtbDBlVnh1SUNBZ0lIUm9hWE11WVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVM1cGMxQnliM1pwWkdWa0lEMGdLRnh1SUNBZ0lDQWdaUzVoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1SUNZbVhHNGdJQ0FnSUNBb2RIbHdaVzltSUdVdVlXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVTNTRJRDA5UFNBbmJuVnRZbVZ5SnlrZ0ppWmNiaUFnSUNBZ0lDaDBlWEJsYjJZZ1pTNWhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVMbmtnUFQwOUlDZHVkVzFpWlhJbktTQW1KbHh1SUNBZ0lDQWdLSFI1Y0dWdlppQmxMbUZqWTJWc1pYSmhkR2x2YmtsdVkyeDFaR2x1WjBkeVlYWnBkSGt1ZWlBOVBUMGdKMjUxYldKbGNpY3BYRzRnSUNBZ0tUdGNiaUFnSUNCMGFHbHpMbUZqWTJWc1pYSmhkR2x2YmtsdVkyeDFaR2x1WjBkeVlYWnBkSGt1Y0dWeWFXOWtJRDBnWlM1cGJuUmxjblpoYkNBcUlIUm9hWE11WDNWdWFXWjVVR1Z5YVc5a08xeHVYRzRnSUNBZ0x5OGdVMlZ1YzI5eUlHRjJZV2xzWVdKcGJHbDBlU0JtYjNJZ2RHaGxJR0ZqWTJWc1pYSmhkR2x2Ymx4dUlDQWdJSFJvYVhNdVlXTmpaV3hsY21GMGFXOXVMbWx6VUhKdmRtbGtaV1FnUFNBb1hHNGdJQ0FnSUNCbExtRmpZMlZzWlhKaGRHbHZiaUFtSmx4dUlDQWdJQ0FnS0hSNWNHVnZaaUJsTG1GalkyVnNaWEpoZEdsdmJpNTRJRDA5UFNBbmJuVnRZbVZ5SnlrZ0ppWmNiaUFnSUNBZ0lDaDBlWEJsYjJZZ1pTNWhZMk5sYkdWeVlYUnBiMjR1ZVNBOVBUMGdKMjUxYldKbGNpY3BJQ1ltWEc0Z0lDQWdJQ0FvZEhsd1pXOW1JR1V1WVdOalpXeGxjbUYwYVc5dUxub2dQVDA5SUNkdWRXMWlaWEluS1Z4dUlDQWdJQ2s3WEc0Z0lDQWdkR2hwY3k1aFkyTmxiR1Z5WVhScGIyNHVjR1Z5YVc5a0lEMGdaUzVwYm5SbGNuWmhiQ0FxSUhSb2FYTXVYM1Z1YVdaNVVHVnlhVzlrTzF4dVhHNGdJQ0FnTHk4Z1UyVnVjMjl5SUdGMllXbHNZV0pwYkdsMGVTQm1iM0lnZEdobElISnZkR0YwYVc5dUlISmhkR1ZjYmlBZ0lDQjBhR2x6TG5KdmRHRjBhVzl1VW1GMFpTNXBjMUJ5YjNacFpHVmtJRDBnS0Z4dUlDQWdJQ0FnWlM1eWIzUmhkR2x2YmxKaGRHVWdKaVpjYmlBZ0lDQWdJQ2gwZVhCbGIyWWdaUzV5YjNSaGRHbHZibEpoZEdVdVlXeHdhR0VnUFQwOUlDZHVkVzFpWlhJbktTQW1KbHh1SUNBZ0lDQWdLSFI1Y0dWdlppQmxMbkp2ZEdGMGFXOXVVbUYwWlM1aVpYUmhJQ0E5UFQwZ0oyNTFiV0psY2ljcElDWW1YRzRnSUNBZ0lDQW9kSGx3Wlc5bUlHVXVjbTkwWVhScGIyNVNZWFJsTG1kaGJXMWhJRDA5UFNBbmJuVnRZbVZ5SnlsY2JpQWdJQ0FwTzF4dUlDQWdJSFJvYVhNdWNtOTBZWFJwYjI1U1lYUmxMbkJsY21sdlpDQTlJR1V1YVc1MFpYSjJZV3dnS2lCMGFHbHpMbDkxYm1sbWVWQmxjbWx2WkR0Y2JseHVJQ0FnSUM4dklHbHVJR1pwY21WbWIzZ2dZVzVrY205cFpDd2dZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlU0J5WlhSeWFXVjJaU0J1ZFd4c0lIWmhiSFZsYzF4dUlDQWdJQzh2SUc5dUlIUm9aU0JtYVhKemRDQmpZV3hzWW1GamF5NGdjMjhnZDJGcGRDQmhJSE5sWTI5dVpDQmpZV3hzSUhSdklHSmxJSE4xY21VdVhHNGdJQ0FnYVdZZ0tGeHVJQ0FnSUNBZ2NHeGhkR1p2Y20wdWIzTXVabUZ0YVd4NUlEMDlQU0FuUVc1a2NtOXBaQ2NnSmlaY2JpQWdJQ0FnSUM5R2FYSmxabTk0THk1MFpYTjBLSEJzWVhSbWIzSnRMbTVoYldVcElDWW1YRzRnSUNBZ0lDQjBhR2x6TGw5amFHVmphME52ZFc1MFpYSWdQQ0F4WEc0Z0lDQWdLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOWphR1ZqYTBOdmRXNTBaWElyS3p0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdMeThnYm05M0lIUm9ZWFFnZEdobElITmxibk52Y25NZ1lYSmxJR05vWldOclpXUXNJSEpsY0d4aFkyVWdkR2hsSUhCeWIyTmxjM01nWm5WdVkzUnBiMjRnZDJsMGFGeHVJQ0FnSUNBZ0x5OGdkR2hsSUdacGJtRnNJR3hwYzNSbGJtVnlYRzRnSUNBZ0lDQjBhR2x6TGw5d2NtOWpaWE56Um5WdVkzUnBiMjRnUFNCMGFHbHpMbDlrWlhacFkyVnRiM1JwYjI1TWFYTjBaVzVsY2p0Y2JseHVJQ0FnSUNBZ0x5OGdhV1lnWVdOalpXeGxjbUYwYVc5dUlHbHpJRzV2ZENCd2NtOTJhV1JsWkNCaWVTQnlZWGNnYzJWdWMyOXljeXdnYVc1a2FXTmhkR1VnZDJobGRHaGxjaUJwZEZ4dUlDQWdJQ0FnTHk4Z1kyRnVJR0psSUdOaGJHTjFiR0YwWldRZ2QybDBhQ0JnWVdOalpXeGxjbUYwYVc5dWFXNWpiSFZrYVc1blozSmhkbWwwZVdBZ2IzSWdibTkwWEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11WVdOalpXeGxjbUYwYVc5dUxtbHpVSEp2ZG1sa1pXUXBYRzRnSUNBZ0lDQWdJSFJvYVhNdVlXTmpaV3hsY21GMGFXOXVMbWx6UTJGc1kzVnNZWFJsWkNBOUlIUm9hWE11WVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVM1cGMxQnliM1pwWkdWa08xeHVYRzRnSUNBZ0lDQXZMeUJYUVZKT1NVNUhYRzRnSUNBZ0lDQXZMeUJVYUdVZ2JHbHVaWE1nYjJZZ1kyOWtaU0JpWld4dmR5QmhjbVVnWTI5dGJXVnVkR1ZrSUdKbFkyRjFjMlVnYjJZZ1lTQmlkV2NnYjJZZ1EyaHliMjFsWEc0Z0lDQWdJQ0F2THlCdmJpQnpiMjFsSUVGdVpISnZhV1FnWkdWMmFXTmxjeXdnZDJobGNtVWdKMlJsZG1salpXMXZkR2x2YmljZ1pYWmxiblJ6SUdGeVpTQnViM1FnYzJWdWRGeHVJQ0FnSUNBZ0x5OGdiM0lnWTJGMVoyaDBJR2xtSUhSb1pTQnNhWE4wWlc1bGNpQnBjeUJ6WlhRZ2RYQWdZV1owWlhJZ1lTQW5aR1YyYVdObGIzSnBaVzUwWVhScGIyNG5YRzRnSUNBZ0lDQXZMeUJzYVhOMFpXNWxjaTRnU0dWeVpTd2dkR2hsSUY5MGNubFBjbWxsYm5SaGRHbHZia1poYkd4aVlXTnJJRzFsZEdodlpDQjNiM1ZzWkNCaFpHUWdZVnh1SUNBZ0lDQWdMeThnSjJSbGRtbGpaVzl5YVdWdWRHRjBhVzl1SnlCc2FYTjBaVzVsY2lCaGJtUWdZbXh2WTJzZ1lXeHNJSE4xWW5ObGNYVmxiblFnSjJSbGRtbGpaVzF2ZEdsdmJpZGNiaUFnSUNBZ0lDOHZJR1YyWlc1MGN5QnZiaUIwYUdWelpTQmtaWFpwWTJWekxpQkRiMjF0Wlc1MGN5QjNhV3hzSUdKbElISmxiVzkyWldRZ2IyNWpaU0IwYUdVZ1luVm5JRzltWEc0Z0lDQWdJQ0F2THlCRGFISnZiV1VnYVhNZ1kyOXljbVZqZEdWa0xseHVYRzRnSUNBZ0lDQXZMeUJwWmlBb2RHaHBjeTV5WlhGMWFYSmxaQzV5YjNSaGRHbHZibEpoZEdVZ0ppWWdJWFJvYVhNdWNtOTBZWFJwYjI1U1lYUmxMbWx6VUhKdmRtbGtaV1FwWEc0Z0lDQWdJQ0F2THlBZ0lIUm9hWE11WDNSeWVVOXlhV1Z1ZEdGMGFXOXVSbUZzYkdKaFkyc29LVHRjYmlBZ0lDQWdJQzh2SUdWc2MyVmNiaUFnSUNBZ0lIUm9hWE11WDNCeWIyMXBjMlZTWlhOdmJIWmxLSFJvYVhNcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQmdKMlJsZG1salpXMXZkR2x2YmlkZ0lHVjJaVzUwSUdOaGJHeGlZV05yTGx4dUlDQWdLaUJVYUdseklHMWxkR2h2WkNCbGJXbDBjeUJoYmlCbGRtVnVkQ0IzYVhSb0lIUm9aU0J5WVhjZ1lDZGtaWFpwWTJWdGIzUnBiMjRuWUNCMllXeDFaWE1zSUdGdVpDQmxiV2wwYzF4dUlDQWdLaUJsZG1WdWRITWdkMmwwYUNCMGFHVWdkVzVwWm1sbFpDQmdZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlV0FzSUdCaFkyTmxiR1Z5WVhScGIyNWdMRnh1SUNBZ0tpQmhibVFnTHlCdmNpQmdjbTkwWVhScGIyNVNZWFJsWUNCMllXeDFaWE1nYVdZZ2RHaGxlU0JoY21VZ2NtVnhkV2x5WldRdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3WVhKaGJTQjdSR1YyYVdObFRXOTBhVzl1UlhabGJuUjlJR1VnTFNCZ0oyUmxkbWxqWlcxdmRHbHZiaWRnSUdWMlpXNTBJSFJvWlNCMllXeDFaWE1nWVhKbElHTmhiR04xYkdGMFpXUWdabkp2YlM1Y2JpQWdJQ292WEc0Z0lGOWtaWFpwWTJWdGIzUnBiMjVNYVhOMFpXNWxjaWhsS1NCN1hHNGdJQ0FnTHk4Z0oyUmxkbWxqWlcxdmRHbHZiaWNnWlhabGJuUWdLSEpoZHlCMllXeDFaWE1wWEc0Z0lDQWdhV1lnS0hSb2FYTXViR2x6ZEdWdVpYSnpMbk5wZW1VZ1BpQXdLVnh1SUNBZ0lDQWdkR2hwY3k1ZlpXMXBkRVJsZG1salpVMXZkR2x2YmtWMlpXNTBLR1VwTzF4dVhHNGdJQ0FnTHk4Z1lXeGxjblFvWUNSN2RHaHBjeTVoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1TG14cGMzUmxibVZ5Y3k1emFYcGxmU0F0WEc0Z0lDQWdMeThnSUNBZ0lDUjdkR2hwY3k1eVpYRjFhWEpsWkM1aFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNWZTQXRYRzRnSUNBZ0x5OGdJQ0FnSUNSN2RHaHBjeTVoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1TG1selZtRnNhV1I5WEc0Z0lDQWdMeThnWUNrN1hHNWNiaUFnSUNBdkx5QW5ZV05qWld4bGNtRjBhVzl1SnlCbGRtVnVkQ0FvZFc1cFptbGxaQ0IyWVd4MVpYTXBYRzRnSUNBZ2FXWWdLSFJvYVhNdVlXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVTNXNhWE4wWlc1bGNuTXVjMmw2WlNBK0lEQWdKaVpjYmlBZ0lDQWdJQ0FnZEdocGN5NXlaWEYxYVhKbFpDNWhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVJQ1ltWEc0Z0lDQWdJQ0FnSUhSb2FYTXVZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlUzVwYzFaaGJHbGtYRzRnSUNBZ0tTQjdYRzRnSUNBZ0lDQjBhR2x6TGw5bGJXbDBRV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlVVYyWlc1MEtHVXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJQ2RoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1SnlCbGRtVnVkQ0FvZFc1cFptbGxaQ0IyWVd4MVpYTXBYRzRnSUNBZ0x5OGdkR2hsSUdaaGJHeGlZV05ySUdOaGJHTjFiR0YwYVc5dUlHOW1JSFJvWlNCaFkyTmxiR1Z5WVhScGIyNGdhR0Z3Y0dWdWN5QnBiaUIwYUdWY2JpQWdJQ0F2THlBZ1lGOWxiV2wwUVdOalpXeGxjbUYwYVc5dVlDQnRaWFJvYjJRc0lITnZJSGRsSUdOb1pXTnJJR2xtSUhSb2FYTXVZV05qWld4bGNtRjBhVzl1TG1selZtRnNhV1JjYmlBZ0lDQnBaaUFvZEdocGN5NWhZMk5sYkdWeVlYUnBiMjR1YkdsemRHVnVaWEp6TG5OcGVtVWdQaUF3SUNZbVhHNGdJQ0FnSUNBZ0lIUm9hWE11Y21WeGRXbHlaV1F1WVdOalpXeGxjbUYwYVc5dUlDWW1YRzRnSUNBZ0lDQWdJSFJvYVhNdVlXTmpaV3hsY21GMGFXOXVMbWx6Vm1Gc2FXUmNiaUFnSUNBcElIdGNiaUFnSUNBZ0lIUm9hWE11WDJWdGFYUkJZMk5sYkdWeVlYUnBiMjVGZG1WdWRDaGxLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUFuY205MFlYUnBiMjVTWVhSbEp5QmxkbVZ1ZENBb2RXNXBabWxsWkNCMllXeDFaWE1wWEc0Z0lDQWdMeThnZEdobElHWmhiR3hpWVdOcklHTmhiR04xYkdGMGFXOXVJRzltSUhSb1pTQnliM1JoZEdsdmJpQnlZWFJsSUdSdlpYTWdUazlVSUdoaGNIQmxiaUJwYmlCMGFHVmNiaUFnSUNBdkx5QmdYMlZ0YVhSU2IzUmhkR2x2YmxKaGRHVmdJRzFsZEdodlpDd2djMjhnZDJVZ2IyNXNlU0JqYUdWamF5QnBaaUIwYUdsekxuSnZkR0YwYVc5dVVtRjBaUzVwYzFCeWIzWnBaR1ZrWEc0Z0lDQWdhV1lnS0hSb2FYTXVjbTkwWVhScGIyNVNZWFJsTG14cGMzUmxibVZ5Y3k1emFYcGxJRDRnTUNBbUpseHVJQ0FnSUNBZ0lDQjBhR2x6TG5KbGNYVnBjbVZrTG5KdmRHRjBhVzl1VW1GMFpTQW1KbHh1SUNBZ0lDQWdJQ0IwYUdsekxuSnZkR0YwYVc5dVVtRjBaUzVwYzFCeWIzWnBaR1ZrWEc0Z0lDQWdLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOWxiV2wwVW05MFlYUnBiMjVTWVhSbFJYWmxiblFvWlNrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFVnRhWFJ6SUhSb1pTQmdKMlJsZG1salpXMXZkR2x2YmlkZ0lISmhkeUIyWVd4MVpYTXVYRzRnSUNBcVhHNGdJQ0FxSUVCd1lYSmhiU0I3UkdWMmFXTmxUVzkwYVc5dVJYWmxiblI5SUdVZ0xTQmdKMlJsZG1salpXMXZkR2x2YmlkZ0lHVjJaVzUwSUhSb1pTQjJZV3gxWlhNZ1lYSmxJR05oYkdOMWJHRjBaV1FnWm5KdmJTNWNiaUFnSUNvdlhHNGdJRjlsYldsMFJHVjJhV05sVFc5MGFXOXVSWFpsYm5Rb1pTa2dlMXh1SUNBZ0lHeGxkQ0J2ZFhSRmRtVnVkQ0E5SUhSb2FYTXVaWFpsYm5RN1hHNWNiaUFnSUNCcFppQW9aUzVoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1S1NCN1hHNGdJQ0FnSUNCdmRYUkZkbVZ1ZEZzd1hTQTlJR1V1WVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVM1NE8xeHVJQ0FnSUNBZ2IzVjBSWFpsYm5SYk1WMGdQU0JsTG1GalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhrdWVUdGNiaUFnSUNBZ0lHOTFkRVYyWlc1MFd6SmRJRDBnWlM1aFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUxubzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLR1V1WVdOalpXeGxjbUYwYVc5dUtTQjdYRzRnSUNBZ0lDQnZkWFJGZG1WdWRGc3pYU0E5SUdVdVlXTmpaV3hsY21GMGFXOXVMbmc3WEc0Z0lDQWdJQ0J2ZFhSRmRtVnVkRnMwWFNBOUlHVXVZV05qWld4bGNtRjBhVzl1TG5rN1hHNGdJQ0FnSUNCdmRYUkZkbVZ1ZEZzMVhTQTlJR1V1WVdOalpXeGxjbUYwYVc5dUxubzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLR1V1Y205MFlYUnBiMjVTWVhSbEtTQjdYRzRnSUNBZ0lDQnZkWFJGZG1WdWRGczJYU0E5SUdVdWNtOTBZWFJwYjI1U1lYUmxMbUZzY0doaE8xeHVJQ0FnSUNBZ2IzVjBSWFpsYm5SYk4xMGdQU0JsTG5KdmRHRjBhVzl1VW1GMFpTNWlaWFJoTzF4dUlDQWdJQ0FnYjNWMFJYWmxiblJiT0YwZ1BTQmxMbkp2ZEdGMGFXOXVVbUYwWlM1bllXMXRZVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TG1WdGFYUW9iM1YwUlhabGJuUXBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVWdGFYUnpJSFJvWlNCZ1lXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVXQWdkVzVwWm1sbFpDQjJZV3gxWlhNdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3WVhKaGJTQjdSR1YyYVdObFRXOTBhVzl1UlhabGJuUjlJR1VnTFNCZ0oyUmxkbWxqWlcxdmRHbHZiaWRnSUdWMlpXNTBJSFJvWlNCMllXeDFaWE1nWVhKbElHTmhiR04xYkdGMFpXUWdabkp2YlM1Y2JpQWdJQ292WEc0Z0lGOWxiV2wwUVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVVWMlpXNTBLR1VwSUh0Y2JpQWdJQ0JzWlhRZ2IzVjBSWFpsYm5RZ1BTQjBhR2x6TG1GalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhrdVpYWmxiblE3WEc1Y2JpQWdJQ0J2ZFhSRmRtVnVkRnN3WFNBOUlHVXVZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlUzU0SUNvZ2RHaHBjeTVmZFc1cFpubE5iM1JwYjI1RVlYUmhPMXh1SUNBZ0lHOTFkRVYyWlc1MFd6RmRJRDBnWlM1aFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUxua2dLaUIwYUdsekxsOTFibWxtZVUxdmRHbHZia1JoZEdFN1hHNGdJQ0FnYjNWMFJYWmxiblJiTWwwZ1BTQmxMbUZqWTJWc1pYSmhkR2x2YmtsdVkyeDFaR2x1WjBkeVlYWnBkSGt1ZWlBcUlIUm9hWE11WDNWdWFXWjVUVzkwYVc5dVJHRjBZVHRjYmx4dUlDQWdJSFJvYVhNdVlXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVTNWxiV2wwS0c5MWRFVjJaVzUwS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkZiV2wwY3lCMGFHVWdZR0ZqWTJWc1pYSmhkR2x2Ym1BZ2RXNXBabWxsWkNCMllXeDFaWE11WEc0Z0lDQXFJRmRvWlc0Z2RHaGxJR0JoWTJObGJHVnlZWFJwYjI1Z0lISmhkeUIyWVd4MVpYTWdZWEpsSUc1dmRDQmhkbUZwYkdGaWJHVXNJSFJvWlNCdFpYUm9iMlJjYmlBZ0lDb2dZV3h6YnlCallXeGpkV3hoZEdWeklIUm9aU0JoWTJObGJHVnlZWFJwYjI0Z1puSnZiU0IwYUdWY2JpQWdJQ29nWUdGalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhsZ0lISmhkeUIyWVd4MVpYTXVYRzRnSUNBcVhHNGdJQ0FxSUVCd1lYSmhiU0I3UkdWMmFXTmxUVzkwYVc5dVJYWmxiblI5SUdVZ0xTQlVhR1VnWUNka1pYWnBZMlZ0YjNScGIyNG5ZQ0JsZG1WdWRDNWNiaUFnSUNvdlhHNGdJRjlsYldsMFFXTmpaV3hsY21GMGFXOXVSWFpsYm5Rb1pTa2dlMXh1SUNBZ0lHeGxkQ0J2ZFhSRmRtVnVkQ0E5SUhSb2FYTXVZV05qWld4bGNtRjBhVzl1TG1WMlpXNTBPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVZV05qWld4bGNtRjBhVzl1TG1selVISnZkbWxrWldRcElIdGNiaUFnSUNBZ0lDOHZJRWxtSUhKaGR5QmhZMk5sYkdWeVlYUnBiMjRnZG1Gc2RXVnpJR0Z5WlNCd2NtOTJhV1JsWkZ4dUlDQWdJQ0FnYjNWMFJYWmxiblJiTUYwZ1BTQmxMbUZqWTJWc1pYSmhkR2x2Ymk1NElDb2dkR2hwY3k1ZmRXNXBabmxOYjNScGIyNUVZWFJoTzF4dUlDQWdJQ0FnYjNWMFJYWmxiblJiTVYwZ1BTQmxMbUZqWTJWc1pYSmhkR2x2Ymk1NUlDb2dkR2hwY3k1ZmRXNXBabmxOYjNScGIyNUVZWFJoTzF4dUlDQWdJQ0FnYjNWMFJYWmxiblJiTWwwZ1BTQmxMbUZqWTJWc1pYSmhkR2x2Ymk1NklDb2dkR2hwY3k1ZmRXNXBabmxOYjNScGIyNUVZWFJoTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvZEdocGN5NWhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVMbWx6Vm1Gc2FXUXBJSHRjYmlBZ0lDQWdJQzh2SUU5MGFHVnlkMmx6WlN3Z2FXWWdZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlU0IyWVd4MVpYTWdZWEpsSUhCeWIzWnBaR1ZrTEZ4dUlDQWdJQ0FnTHk4Z1pYTjBhVzFoZEdVZ2RHaGxJR0ZqWTJWc1pYSmhkR2x2YmlCM2FYUm9JR0VnYUdsbmFDMXdZWE56SUdacGJIUmxjbHh1SUNBZ0lDQWdZMjl1YzNRZ1lXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVTQTlJRnRjYmlBZ0lDQWdJQ0FnWlM1aFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNUxuZ2dLaUIwYUdsekxsOTFibWxtZVUxdmRHbHZia1JoZEdFc1hHNGdJQ0FnSUNBZ0lHVXVZV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlUzU1SUNvZ2RHaHBjeTVmZFc1cFpubE5iM1JwYjI1RVlYUmhMRnh1SUNBZ0lDQWdJQ0JsTG1GalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhrdWVpQXFJSFJvYVhNdVgzVnVhV1o1VFc5MGFXOXVSR0YwWVZ4dUlDQWdJQ0FnWFR0Y2JpQWdJQ0FnSUdOdmJuTjBJR3NnUFNCMGFHbHpMbDlqWVd4amRXeGhkR1ZrUVdOalpXeGxjbUYwYVc5dVJHVmpZWGs3WEc1Y2JpQWdJQ0FnSUM4dklFaHBaMmd0Y0dGemN5Qm1hV3gwWlhJZ2RHOGdaWE4wYVcxaGRHVWdkR2hsSUdGalkyVnNaWEpoZEdsdmJpQW9kMmwwYUc5MWRDQjBhR1VnWjNKaGRtbDBlU2xjYmlBZ0lDQWdJSFJvYVhNdVgyTmhiR04xYkdGMFpXUkJZMk5sYkdWeVlYUnBiMjViTUYwZ1BTQW9NU0FySUdzcElDb2dNQzQxSUNvZ0tHRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIbGJNRjBnTFNCMGFHbHpMbDlzWVhOMFFXTmpaV3hsY21GMGFXOXVTVzVqYkhWa2FXNW5SM0poZG1sMGVWc3dYU2tnS3lCcklDb2dkR2hwY3k1ZlkyRnNZM1ZzWVhSbFpFRmpZMlZzWlhKaGRHbHZibHN3WFR0Y2JpQWdJQ0FnSUhSb2FYTXVYMk5oYkdOMWJHRjBaV1JCWTJObGJHVnlZWFJwYjI1Yk1WMGdQU0FvTVNBcklHc3BJQ29nTUM0MUlDb2dLR0ZqWTJWc1pYSmhkR2x2YmtsdVkyeDFaR2x1WjBkeVlYWnBkSGxiTVYwZ0xTQjBhR2x6TGw5c1lYTjBRV05qWld4bGNtRjBhVzl1U1c1amJIVmthVzVuUjNKaGRtbDBlVnN4WFNrZ0t5QnJJQ29nZEdocGN5NWZZMkZzWTNWc1lYUmxaRUZqWTJWc1pYSmhkR2x2YmxzeFhUdGNiaUFnSUNBZ0lIUm9hWE11WDJOaGJHTjFiR0YwWldSQlkyTmxiR1Z5WVhScGIyNWJNbDBnUFNBb01TQXJJR3NwSUNvZ01DNDFJQ29nS0dGalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhsYk1sMGdMU0IwYUdsekxsOXNZWE4wUVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVZzeVhTa2dLeUJySUNvZ2RHaHBjeTVmWTJGc1kzVnNZWFJsWkVGalkyVnNaWEpoZEdsdmJsc3lYVHRjYmx4dUlDQWdJQ0FnZEdocGN5NWZiR0Z6ZEVGalkyVnNaWEpoZEdsdmJrbHVZMngxWkdsdVowZHlZWFpwZEhsYk1GMGdQU0JoWTJObGJHVnlZWFJwYjI1SmJtTnNkV1JwYm1kSGNtRjJhWFI1V3pCZE8xeHVJQ0FnSUNBZ2RHaHBjeTVmYkdGemRFRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIbGJNVjBnUFNCaFkyTmxiR1Z5WVhScGIyNUpibU5zZFdScGJtZEhjbUYyYVhSNVd6RmRPMXh1SUNBZ0lDQWdkR2hwY3k1ZmJHRnpkRUZqWTJWc1pYSmhkR2x2YmtsdVkyeDFaR2x1WjBkeVlYWnBkSGxiTWwwZ1BTQmhZMk5sYkdWeVlYUnBiMjVKYm1Oc2RXUnBibWRIY21GMmFYUjVXekpkTzF4dVhHNGdJQ0FnSUNCdmRYUkZkbVZ1ZEZzd1hTQTlJSFJvYVhNdVgyTmhiR04xYkdGMFpXUkJZMk5sYkdWeVlYUnBiMjViTUYwN1hHNGdJQ0FnSUNCdmRYUkZkbVZ1ZEZzeFhTQTlJSFJvYVhNdVgyTmhiR04xYkdGMFpXUkJZMk5sYkdWeVlYUnBiMjViTVYwN1hHNGdJQ0FnSUNCdmRYUkZkbVZ1ZEZzeVhTQTlJSFJvYVhNdVgyTmhiR04xYkdGMFpXUkJZMk5sYkdWeVlYUnBiMjViTWwwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NWhZMk5sYkdWeVlYUnBiMjR1WlcxcGRDaHZkWFJGZG1WdWRDazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUlcxcGRITWdkR2hsSUdCeWIzUmhkR2x2YmxKaGRHVmdJSFZ1YVdacFpXUWdkbUZzZFdWekxseHVJQ0FnS2x4dUlDQWdLaUJBY0dGeVlXMGdlMFJsZG1salpVMXZkR2x2YmtWMlpXNTBmU0JsSUMwZ1lDZGtaWFpwWTJWdGIzUnBiMjRuWUNCbGRtVnVkQ0IwYUdVZ2RtRnNkV1Z6SUdGeVpTQmpZV3hqZFd4aGRHVmtJR1p5YjIwdVhHNGdJQ0FxTDF4dUlDQmZaVzFwZEZKdmRHRjBhVzl1VW1GMFpVVjJaVzUwS0dVcElIdGNiaUFnSUNCc1pYUWdiM1YwUlhabGJuUWdQU0IwYUdsekxuSnZkR0YwYVc5dVVtRjBaUzVsZG1WdWREdGNibHh1SUNBZ0lDOHZJRWx1SUdGc2JDQndiR0YwWm05eWJYTXNJSEp2ZEdGMGFXOXVJR0Y0WlhNZ1lYSmxJRzFsYzNObFpDQjFjQ0JoWTJOdmNtUnBibWNnZEc4Z2RHaGxJSE53WldOY2JpQWdJQ0F2THlCb2RIUndjem92TDNjell5NW5hWFJvZFdJdWFXOHZaR1YyYVdObGIzSnBaVzUwWVhScGIyNHZjM0JsWXkxemIzVnlZMlV0YjNKcFpXNTBZWFJwYjI0dWFIUnRiRnh1SUNBZ0lDOHZYRzRnSUNBZ0x5OGdaMkZ0YldFZ2MyaHZkV3hrSUdKbElHRnNjR2hoWEc0Z0lDQWdMeThnWVd4d2FHRWdjMmh2ZFd4a0lHSmxJR0psZEdGY2JpQWdJQ0F2THlCaVpYUmhJSE5vYjNWc1pDQmlaU0JuWVcxdFlWeHVYRzRnSUNBZ2IzVjBSWFpsYm5SYk1GMGdQU0JsTG5KdmRHRjBhVzl1VW1GMFpTNW5ZVzF0WVR0Y2JpQWdJQ0J2ZFhSRmRtVnVkRnN4WFNBOUlHVXVjbTkwWVhScGIyNVNZWFJsTG1Gc2NHaGhMRnh1SUNBZ0lHOTFkRVYyWlc1MFd6SmRJRDBnWlM1eWIzUmhkR2x2YmxKaGRHVXVZbVYwWVR0Y2JseHVJQ0FnSUM4dklFTm9jbTl0WlNCQmJtUnliMmxrSUhKbGRISnBaWFpsSUhaaGJIVmxjeUIwYUdGMElHRnlaU0JwYmlCeVlXUXZjMXh1SUNBZ0lDOHZJR05tTGlCb2RIUndjem92TDJKMVozTXVZMmh5YjIxcGRXMHViM0puTDNBdlkyaHliMjFwZFcwdmFYTnpkV1Z6TDJSbGRHRnBiRDlwWkQwMU5ERTJNRGRjYmlBZ0lDQXZMMXh1SUNBZ0lDOHZJRVp5YjIwZ2MzQmxZem9nWENKVWFHVWdjbTkwWVhScGIyNVNZWFJsSUdGMGRISnBZblYwWlNCdGRYTjBJR0psSUdsdWFYUnBZV3hwZW1Wa0lIZHBkR2dnZEdobElISmhkR1ZjYmlBZ0lDQXZMeUJ2WmlCeWIzUmhkR2x2YmlCdlppQjBhR1VnYUc5emRHbHVaeUJrWlhacFkyVWdhVzRnYzNCaFkyVXVJRWwwSUcxMWMzUWdZbVVnWlhod2NtVnpjMlZrSUdGeklIUm9aVnh1SUNBZ0lDOHZJSEpoZEdVZ2IyWWdZMmhoYm1kbElHOW1JSFJvWlNCaGJtZHNaWE1nWkdWbWFXNWxaQ0JwYmlCelpXTjBhVzl1SURRdU1TQmhibVFnYlhWemRDQmlaU0JsZUhCeVpYTnpaV1JjYmlBZ0lDQXZMeUJwYmlCa1pXZHlaV1Z6SUhCbGNpQnpaV052Ym1RZ0tHUmxaeTl6S1M1Y0lseHVJQ0FnSUM4dlhHNGdJQ0FnTHk4Z1ptbDRaV1FnYzJsdVkyVWdRMmh5YjIxbElEWTFYRzRnSUNBZ0x5OGdZMll1SUdoMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5cGJXMWxjbk5wZG1VdGQyVmlMM2RsWW5aeUxYQnZiSGxtYVd4c0wybHpjM1ZsY3k4ek1EZGNiaUFnSUNCcFppQW9YRzRnSUNBZ0lDQndiR0YwWm05eWJTNXZjeTVtWVcxcGJIa2dQVDA5SUNkQmJtUnliMmxrSnlBbUpseHVJQ0FnSUNBZ1kyaHliMjFsVW1WblJYaHdMblJsYzNRb2NHeGhkR1p2Y20wdWJtRnRaU2tnSmlaY2JpQWdJQ0FnSUhCaGNuTmxTVzUwS0hCc1lYUm1iM0p0TG5abGNuTnBiMjR1YzNCc2FYUW9KeTRuS1Zzd1hTa2dQQ0EyTlZ4dUlDQWdJQ2tnZTF4dUlDQWdJQ0FnYjNWMFJYWmxiblJiTUYwZ0tqMGdkRzlFWldjN1hHNGdJQ0FnSUNCdmRYUkZkbVZ1ZEZzeFhTQXFQU0IwYjBSbFp5eGNiaUFnSUNBZ0lHOTFkRVYyWlc1MFd6SmRJQ285SUhSdlJHVm5PMXh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11Y205MFlYUnBiMjVTWVhSbExtVnRhWFFvYjNWMFJYWmxiblFwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTmhiR04xYkdGMFpYTWdZVzVrSUdWdGFYUnpJSFJvWlNCZ2NtOTBZWFJwYjI1U1lYUmxZQ0IxYm1sbWFXVmtJSFpoYkhWbGN5Qm1jbTl0SUhSb1pTQmdiM0pwWlc1MFlYUnBiMjVnSUhaaGJIVmxjeTVjYmlBZ0lDcGNiaUFnSUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEpiWFgwZ2IzSnBaVzUwWVhScGIyNGdMU0JNWVhSbGMzUWdZRzl5YVdWdWRHRjBhVzl1WUNCeVlYY2dkbUZzZFdWekxseHVJQ0FnS2k5Y2JpQWdYMk5oYkdOMWJHRjBaVkp2ZEdGMGFXOXVVbUYwWlVaeWIyMVBjbWxsYm5SaGRHbHZiaWh2Y21sbGJuUmhkR2x2YmlrZ2UxeHVJQ0FnSUdOdmJuTjBJRzV2ZHlBOUlHZGxkRXh2WTJGc1ZHbHRaU2dwTzF4dUlDQWdJR052Ym5OMElHc2dQU0F3TGpnN0lDOHZJRlJQUkU4NklHbHRjSEp2ZG1VZ2JHOTNJSEJoYzNNZ1ptbHNkR1Z5SUNobWNtRnRaWE1nWVhKbElHNXZkQ0J5WldkMWJHRnlLVnh1SUNBZ0lHTnZibk4wSUdGc2NHaGhTWE5XWVd4cFpDQTlJQ2gwZVhCbGIyWWdiM0pwWlc1MFlYUnBiMjViTUYwZ1BUMDlJQ2R1ZFcxaVpYSW5LVHRjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbDlzWVhOMFQzSnBaVzUwWVhScGIyNVVhVzFsYzNSaGJYQXBJSHRjYmlBZ0lDQWdJR3hsZENCeVFXeHdhR0VnUFNCdWRXeHNPMXh1SUNBZ0lDQWdiR1YwSUhKQ1pYUmhPMXh1SUNBZ0lDQWdiR1YwSUhKSFlXMXRZVHRjYmx4dUlDQWdJQ0FnYkdWMElHRnNjR2hoUkdselkyOXVkR2x1ZFdsMGVVWmhZM1J2Y2lBOUlEQTdYRzRnSUNBZ0lDQnNaWFFnWW1WMFlVUnBjMk52Ym5ScGJuVnBkSGxHWVdOMGIzSWdQU0F3TzF4dUlDQWdJQ0FnYkdWMElHZGhiVzFoUkdselkyOXVkR2x1ZFdsMGVVWmhZM1J2Y2lBOUlEQTdYRzVjYmlBZ0lDQWdJR052Ym5OMElHUmxiSFJoVkNBOUlHNXZkeUF0SUhSb2FYTXVYMnhoYzNSUGNtbGxiblJoZEdsdmJsUnBiV1Z6ZEdGdGNEdGNibHh1SUNBZ0lDQWdhV1lnS0dGc2NHaGhTWE5XWVd4cFpDa2dlMXh1SUNBZ0lDQWdJQ0F2THlCaGJIQm9ZU0JrYVhOamIyNTBhVzUxYVhSNUlDZ3JNell3SUMwK0lEQWdiM0lnTUNBdFBpQXJNell3S1Z4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1ZmJHRnpkRTl5YVdWdWRHRjBhVzl1V3pCZElENGdNekl3SUNZbUlHOXlhV1Z1ZEdGMGFXOXVXekJkSUR3Z05EQXBYRzRnSUNBZ0lDQWdJQ0FnWVd4d2FHRkVhWE5qYjI1MGFXNTFhWFI1Um1GamRHOXlJRDBnTXpZd08xeHVJQ0FnSUNBZ0lDQmxiSE5sSUdsbUlDaDBhR2x6TGw5c1lYTjBUM0pwWlc1MFlYUnBiMjViTUYwZ1BDQTBNQ0FtSmlCdmNtbGxiblJoZEdsdmJsc3dYU0ErSURNeU1DbGNiaUFnSUNBZ0lDQWdJQ0JoYkhCb1lVUnBjMk52Ym5ScGJuVnBkSGxHWVdOMGIzSWdQU0F0TXpZd08xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJpWlhSaElHUnBjMk52Ym5ScGJuVnBkSGtnS0NzeE9EQWdMVDRnTFRFNE1DQnZjaUF0TVRnd0lDMCtJQ3N4T0RBcFhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1ZmJHRnpkRTl5YVdWdWRHRjBhVzl1V3pGZElENGdNVFF3SUNZbUlHOXlhV1Z1ZEdGMGFXOXVXekZkSUR3Z0xURTBNQ2xjYmlBZ0lDQWdJQ0FnWW1WMFlVUnBjMk52Ym5ScGJuVnBkSGxHWVdOMGIzSWdQU0F6TmpBN1hHNGdJQ0FnSUNCbGJITmxJR2xtSUNoMGFHbHpMbDlzWVhOMFQzSnBaVzUwWVhScGIyNWJNVjBnUENBdE1UUXdJQ1ltSUc5eWFXVnVkR0YwYVc5dVd6RmRJRDRnTVRRd0tWeHVJQ0FnSUNBZ0lDQmlaWFJoUkdselkyOXVkR2x1ZFdsMGVVWmhZM1J2Y2lBOUlDMHpOakE3WEc1Y2JpQWdJQ0FnSUM4dklHZGhiVzFoSUdScGMyTnZiblJwYm5WcGRHbGxjeUFvS3pFNE1DQXRQaUF0TVRnd0lHOXlJQzB4T0RBZ0xUNGdLekU0TUNsY2JpQWdJQ0FnSUdsbUlDaDBhR2x6TGw5c1lYTjBUM0pwWlc1MFlYUnBiMjViTWwwZ1BpQTFNQ0FtSmlCdmNtbGxiblJoZEdsdmJsc3lYU0E4SUMwMU1DbGNiaUFnSUNBZ0lDQWdaMkZ0YldGRWFYTmpiMjUwYVc1MWFYUjVSbUZqZEc5eUlEMGdNVGd3TzF4dUlDQWdJQ0FnWld4elpTQnBaaUFvZEdocGN5NWZiR0Z6ZEU5eWFXVnVkR0YwYVc5dVd6SmRJRHdnTFRVd0lDWW1JRzl5YVdWdWRHRjBhVzl1V3pKZElENGdOVEFwWEc0Z0lDQWdJQ0FnSUdkaGJXMWhSR2x6WTI5dWRHbHVkV2wwZVVaaFkzUnZjaUE5SUMweE9EQTdYRzVjYmlBZ0lDQWdJR2xtSUNoa1pXeDBZVlFnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUV4dmR5QndZWE56SUdacGJIUmxjaUIwYnlCemJXOXZkR2dnZEdobElHUmhkR0ZjYmlBZ0lDQWdJQ0FnYVdZZ0tHRnNjR2hoU1hOV1lXeHBaQ2xjYmlBZ0lDQWdJQ0FnSUNCeVFXeHdhR0VnUFNCcklDb2dkR2hwY3k1ZlkyRnNZM1ZzWVhSbFpGSnZkR0YwYVc5dVVtRjBaVnN3WFNBcklDZ3hJQzBnYXlrZ0tpQW9iM0pwWlc1MFlYUnBiMjViTUYwZ0xTQjBhR2x6TGw5c1lYTjBUM0pwWlc1MFlYUnBiMjViTUYwZ0t5QmhiSEJvWVVScGMyTnZiblJwYm5WcGRIbEdZV04wYjNJcElDOGdaR1ZzZEdGVU8xeHVYRzRnSUNBZ0lDQWdJSEpDWlhSaElEMGdheUFxSUhSb2FYTXVYMk5oYkdOMWJHRjBaV1JTYjNSaGRHbHZibEpoZEdWYk1WMGdLeUFvTVNBdElHc3BJQ29nS0c5eWFXVnVkR0YwYVc5dVd6RmRJQzBnZEdocGN5NWZiR0Z6ZEU5eWFXVnVkR0YwYVc5dVd6RmRJQ3NnWW1WMFlVUnBjMk52Ym5ScGJuVnBkSGxHWVdOMGIzSXBJQzhnWkdWc2RHRlVPMXh1SUNBZ0lDQWdJQ0J5UjJGdGJXRWdQU0JySUNvZ2RHaHBjeTVmWTJGc1kzVnNZWFJsWkZKdmRHRjBhVzl1VW1GMFpWc3lYU0FySUNneElDMGdheWtnS2lBb2IzSnBaVzUwWVhScGIyNWJNbDBnTFNCMGFHbHpMbDlzWVhOMFQzSnBaVzUwWVhScGIyNWJNbDBnS3lCbllXMXRZVVJwYzJOdmJuUnBiblZwZEhsR1lXTjBiM0lwSUM4Z1pHVnNkR0ZVTzF4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDJOaGJHTjFiR0YwWldSU2IzUmhkR2x2YmxKaGRHVmJNRjBnUFNCeVFXeHdhR0U3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMk5oYkdOMWJHRjBaV1JTYjNSaGRHbHZibEpoZEdWYk1WMGdQU0J5UW1WMFlUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlkyRnNZM1ZzWVhSbFpGSnZkR0YwYVc5dVVtRjBaVnN5WFNBOUlISkhZVzF0WVR0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdWRTlFVHpvZ2NtVnpZVzF3YkdVZ2RHaGxJR1Z0YVhOemFXOXVJSEpoZEdVZ2RHOGdiV0YwWTJnZ2RHaGxJR1JsZG1salpXMXZkR2x2YmlCeVlYUmxYRzRnSUNBZ0lDQjBhR2x6TG5KdmRHRjBhVzl1VW1GMFpTNWxiV2wwS0hSb2FYTXVYMk5oYkdOMWJHRjBaV1JTYjNSaGRHbHZibEpoZEdVcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVYMnhoYzNSUGNtbGxiblJoZEdsdmJsUnBiV1Z6ZEdGdGNDQTlJRzV2ZHp0Y2JpQWdJQ0IwYUdsekxsOXNZWE4wVDNKcFpXNTBZWFJwYjI1Yk1GMGdQU0J2Y21sbGJuUmhkR2x2Ymxzd1hUdGNiaUFnSUNCMGFHbHpMbDlzWVhOMFQzSnBaVzUwWVhScGIyNWJNVjBnUFNCdmNtbGxiblJoZEdsdmJsc3hYVHRjYmlBZ0lDQjBhR2x6TGw5c1lYTjBUM0pwWlc1MFlYUnBiMjViTWwwZ1BTQnZjbWxsYm5SaGRHbHZibHN5WFR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRhR1ZqYTNNZ2QyaGxkR2hsY2lCMGFHVWdjbTkwWVhScGIyNGdjbUYwWlNCallXNGdZbVVnWTJGc1kzVnNZWFJsWkNCbWNtOXRJSFJvWlNCZ2IzSnBaVzUwWVhScGIyNWdJSFpoYkhWbGN5QnZjaUJ1YjNRdVhHNGdJQ0FxWEc0Z0lDQXFJRUIwYjJSdklDMGdkR2hwY3lCemFHOTFiR1FnWW1VZ2NtVjJhV1YzWldRZ2RHOGdZMjl0Y0d4NUlIZHBkR2dnZEdobElHRjRhWE1nYjNKa1pYSWdaR1ZtYVc1bFpGeHVJQ0FnS2lBZ2FXNGdkR2hsSUhOd1pXTmNiaUFnSUNvdlhHNGdJQzh2SUZkQlVrNUpUa2RjYmlBZ0x5OGdWR2hsSUd4cGJtVnpJRzltSUdOdlpHVWdZbVZzYjNjZ1lYSmxJR052YlcxbGJuUmxaQ0JpWldOaGRYTmxJRzltSUdFZ1luVm5JRzltSUVOb2NtOXRaVnh1SUNBdkx5QnZiaUJ6YjIxbElFRnVaSEp2YVdRZ1pHVjJhV05sY3l3Z2QyaGxjbVVnSjJSbGRtbGpaVzF2ZEdsdmJpY2daWFpsYm5SeklHRnlaU0J1YjNRZ2MyVnVkRnh1SUNBdkx5QnZjaUJqWVhWbmFIUWdhV1lnZEdobElHeHBjM1JsYm1WeUlHbHpJSE5sZENCMWNDQmhablJsY2lCaElDZGtaWFpwWTJWdmNtbGxiblJoZEdsdmJpZGNiaUFnTHk4Z2JHbHpkR1Z1WlhJdUlFaGxjbVVzSUhSb1pTQmZkSEo1VDNKcFpXNTBZWFJwYjI1R1lXeHNZbUZqYXlCdFpYUm9iMlFnZDI5MWJHUWdZV1JrSUdGY2JpQWdMeThnSjJSbGRtbGpaVzl5YVdWdWRHRjBhVzl1SnlCc2FYTjBaVzVsY2lCaGJtUWdZbXh2WTJzZ1lXeHNJSE4xWW5ObGNYVmxiblFnSjJSbGRtbGpaVzF2ZEdsdmJpZGNiaUFnTHk4Z1pYWmxiblJ6SUc5dUlIUm9aWE5sSUdSbGRtbGpaWE11SUVOdmJXMWxiblJ6SUhkcGJHd2dZbVVnY21WdGIzWmxaQ0J2Ym1ObElIUm9aU0JpZFdjZ2IyWmNiaUFnTHk4Z1EyaHliMjFsSUdseklHTnZjbkpsWTNSbFpDNWNiaUFnTHk4Z1gzUnllVTl5YVdWdWRHRjBhVzl1Um1Gc2JHSmhZMnNvS1NCN1hHNGdJQzh2SUNBZ1RXOTBhVzl1U1c1d2RYUXVjbVZ4ZFdseVpVMXZaSFZzWlNnbmIzSnBaVzUwWVhScGIyNG5LVnh1SUNBdkx5QWdJQ0FnTG5Sb1pXNG9LRzl5YVdWdWRHRjBhVzl1S1NBOVBpQjdYRzRnSUM4dklDQWdJQ0FnSUdsbUlDaHZjbWxsYm5SaGRHbHZiaTVwYzFaaGJHbGtLU0I3WEc0Z0lDOHZJQ0FnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvWUZ4dUlDQXZMeUFnSUNBZ0lDQWdJQ0FnVjBGU1RrbE9SeUFvYlc5MGFXOXVMV2x1Y0hWMEtUb2dWR2hsSUNka1pYWnBZMlZ0YjNScGIyNG5JR1YyWlc1MElHUnZaWE1nYm05MElHVjRhWE4wY3lCdmNseHVJQ0F2THlBZ0lDQWdJQ0FnSUNBZ1pHOWxjeUJ1YjNRZ2NISnZkbWxrWlNCeWIzUmhkR2x2YmlCeVlYUmxJSFpoYkhWbGN5QnBiaUI1YjNWeUlHSnliM2R6WlhJc0lITnZJSFJvWlNCeWIzUmhkR2x2Ymx4dUlDQXZMeUFnSUNBZ0lDQWdJQ0FnY21GMFpTQnZaaUIwYUdVZ1pHVjJhV05sSUdseklHVnpkR2x0WVhSbFpDQm1jbTl0SUhSb1pTQW5iM0pwWlc1MFlYUnBiMjRuTENCallXeGpkV3hoZEdWa1hHNGdJQzh2SUNBZ0lDQWdJQ0FnSUNCbWNtOXRJSFJvWlNBblpHVjJhV05sYjNKcFpXNTBZWFJwYjI0bklHVjJaVzUwTGlCVGFXNWpaU0IwYUdVZ1kyOXRjR0Z6Y3lCdGFXZG9kQ0J1YjNSY2JpQWdMeThnSUNBZ0lDQWdJQ0FnSUdKbElHRjJZV2xzWVdKc1pTd2diMjVzZVNCY1hHQmlaWFJoWEZ4Z0lHRnVaQ0JjWEdCbllXMXRZVnhjWUNCaGJtZHNaWE1nYldGNUlHSmxJSEJ5YjNacFpHVmtYRzRnSUM4dklDQWdJQ0FnSUNBZ0lDQW9YRnhnWVd4d2FHRmNYR0FnZDI5MWJHUWdZbVVnYm5Wc2JDa3VZRnh1SUNBdkx5QWdJQ0FnSUNBZ0lDazdYRzVjYmlBZ0x5OGdJQ0FnSUNBZ0lDQjBhR2x6TG5KdmRHRjBhVzl1VW1GMFpTNXBjME5oYkdOMWJHRjBaV1FnUFNCMGNuVmxPMXh1WEc0Z0lDOHZJQ0FnSUNBZ0lDQWdUVzkwYVc5dVNXNXdkWFF1WVdSa1RHbHpkR1Z1WlhJb0oyOXlhV1Z1ZEdGMGFXOXVKeXdnS0c5eWFXVnVkR0YwYVc5dUtTQTlQaUI3WEc0Z0lDOHZJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxsOWpZV3hqZFd4aGRHVlNiM1JoZEdsdmJsSmhkR1ZHY205dFQzSnBaVzUwWVhScGIyNG9iM0pwWlc1MFlYUnBiMjRwTzF4dUlDQXZMeUFnSUNBZ0lDQWdJSDBwTzF4dUlDQXZMeUFnSUNBZ0lDQjlYRzVjYmlBZ0x5OGdJQ0FnSUNBZ2RHaHBjeTVmY0hKdmJXbHpaVkpsYzI5c2RtVW9kR2hwY3lrN1hHNGdJQzh2SUNBZ0lDQjlLVHRjYmlBZ0x5OGdmVnh1WEc0Z0lGOXdjbTlqWlhOektHUmhkR0VwSUh0Y2JpQWdJQ0IwYUdsekxsOXdjbTlqWlhOelJuVnVZM1JwYjI0b1pHRjBZU2s3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1NXNXBkR2xoYkdsNlpYTWdiMllnZEdobElHMXZaSFZzWlM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEpsZEhWeWJpQjdjSEp2YldselpYMWNiaUFnSUNvdlhHNGdJR2x1YVhRb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhOMWNHVnlMbWx1YVhRb0tISmxjMjlzZG1VcElEMCtJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzQnliMjFwYzJWU1pYTnZiSFpsSUQwZ2NtVnpiMngyWlR0Y2JseHVJQ0FnSUNBZ2FXWWdLSGRwYm1SdmR5NUVaWFpwWTJWTmIzUnBiMjVGZG1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxsOXdjbTlqWlhOelJuVnVZM1JwYjI0Z1BTQjBhR2x6TGw5a1pYWnBZMlZ0YjNScGIyNURhR1ZqYXp0Y2JpQWdJQ0FnSUNBZ0x5OGdabVZoZEhWeVpTQmtaWFJsWTNSY2JpQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQkVaWFpwWTJWTmIzUnBiMjVGZG1WdWRDNXlaWEYxWlhOMFVHVnliV2x6YzJsdmJpQTlQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJRVJsZG1salpVMXZkR2x2YmtWMlpXNTBMbkpsY1hWbGMzUlFaWEp0YVhOemFXOXVLQ2xjYmlBZ0lDQWdJQ0FnSUNBZ0lDNTBhR1Z1S0hCbGNtMXBjM05wYjI1VGRHRjBaU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaHdaWEp0YVhOemFXOXVVM1JoZEdVZ1BUMDlJQ2RuY21GdWRHVmtKeWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2RrWlhacFkyVnRiM1JwYjI0bkxDQjBhR2x6TGw5d2NtOWpaWE56S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdmU2xjYmlBZ0lDQWdJQ0FnSUNBZ0lDNWpZWFJqYUNoamIyNXpiMnhsTG1WeWNtOXlLVHRjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBdkx5Qm9ZVzVrYkdVZ2NtVm5kV3hoY2lCdWIyNGdhVTlUSURFekt5QmtaWFpwWTJWelhHNGdJQ0FnSUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyUmxkbWxqWlcxdmRHbHZiaWNzSUhSb2FYTXVYM0J5YjJObGMzTXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdjMlYwSUdaaGJHeGlZV05ySUhScGJXVnZkWFFnWm05eUlFWnBjbVZtYjNnZ1pHVnphM1J2Y0NBb2FYUnpJSGRwYm1SdmR5QnVaWFpsY2lCallXeHNhVzVuSUhSb1pTQkVaWFpwWTJWUGNtbGxiblJoZEdsdmJpQmxkbVZ1ZEN3Z1lWeHVJQ0FnSUNBZ0lDQXZMeUJ5WlhGMWFYSmxJRzltSUhSb1pTQkVaWFpwWTJWUGNtbGxiblJoZEdsdmJpQnpaWEoyYVdObElIZHBiR3dnY21WemRXeDBJR2x1SUhSb1pTQnlaWEYxYVhKbElIQnliMjFwYzJVZ2JtVjJaWElnWW1WcGJtY2djbVZ6YjJ4MlpXUmNiaUFnSUNBZ0lDQWdMeThnYUdWdVkyVWdkR2hsSUVWNGNHVnlhVzFsYm5RZ2MzUmhjblFvS1NCdFpYUm9iMlFnYm1WMlpYSWdZMkZzYkdWa0tWeHVJQ0FnSUNBZ0lDQXZMeUErSUc1dmRHVWdNREl2TURJdk1qQXhPRG9nZEdocGN5QnpaV1Z0Y3lCMGJ5QmpjbVZoZEdVZ2NISnZZbXhsYlhNZ2QybDBhQ0JwY0c5a2N5QjBhR0YwWEc0Z0lDQWdJQ0FnSUM4dklHUnZiaWQwSUdoaGRtVWdaVzV2ZFdkb0lIUnBiV1VnZEc4Z2MzUmhjblFnS0hOdmJXVjBhVzFsY3lrc0lHaGxibU5sSUdOeVpXRjBhVzVuSUdaaGJITmxYRzRnSUNBZ0lDQWdJQzh2SUc1bFoyRjBhWFpsTGlCVGJ5QjNaU0J2Ym14NUlHRndjR3g1SUhSdklFWnBjbVZtYjNnZ1pHVnphM1J2Y0NCaGJtUWdjSFYwSUdFZ2NtVmhiR3g1WEc0Z0lDQWdJQ0FnSUM4dklHeGhjbWRsSUhaaGJIVmxJQ2cwYzJWaktTQnFkWE4wSUdsdUlHTmhjMlV1WEc0Z0lDQWdJQ0FnSUdsbUlDaHdiR0YwWm05eWJTNXVZVzFsSUQwOVBTQW5SbWx5WldadmVDY2dKaVpjYmlBZ0lDQWdJQ0FnSUNCd2JHRjBabTl5YlM1dmN5NW1ZVzFwYkhrZ0lUMDlJQ2RCYm1SeWIybGtKeUFtSmx4dUlDQWdJQ0FnSUNBZ0lIQnNZWFJtYjNKdExtOXpMbVpoYldsc2VTQWhQVDBnSjJsUFV5ZGNiaUFnSUNBZ0lDQWdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1M1lYSnVLQ2RiYlc5MGFXOXVMV2x1Y0hWMFhTQnlaV2RwYzNSbGNpQjBhVzFsY2lCbWIzSWdSbWx5WldadmVDQmtaWE5yZEc5d0p5azdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NWZZMmhsWTJ0VWFXMWxiM1YwU1dRZ1BTQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lISmxjMjlzZG1Vb2RHaHBjeWtzSURRZ0tpQXhNREF3S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJYUVZKT1NVNUhYRzRnSUNBZ0lDQXZMeUJVYUdVZ2JHbHVaWE1nYjJZZ1kyOWtaU0JpWld4dmR5QmhjbVVnWTI5dGJXVnVkR1ZrSUdKbFkyRjFjMlVnYjJZZ1lTQmlkV2NnYjJZZ1EyaHliMjFsWEc0Z0lDQWdJQ0F2THlCdmJpQnpiMjFsSUVGdVpISnZhV1FnWkdWMmFXTmxjeXdnZDJobGNtVWdKMlJsZG1salpXMXZkR2x2YmljZ1pYWmxiblJ6SUdGeVpTQnViM1FnYzJWdWRGeHVJQ0FnSUNBZ0x5OGdiM0lnWTJGMVoyaDBJR2xtSUhSb1pTQnNhWE4wWlc1bGNpQnBjeUJ6WlhRZ2RYQWdZV1owWlhJZ1lTQW5aR1YyYVdObGIzSnBaVzUwWVhScGIyNG5YRzRnSUNBZ0lDQXZMeUJzYVhOMFpXNWxjaTRnU0dWeVpTd2dkR2hsSUY5MGNubFBjbWxsYm5SaGRHbHZia1poYkd4aVlXTnJJRzFsZEdodlpDQjNiM1ZzWkNCaFpHUWdZVnh1SUNBZ0lDQWdMeThnSjJSbGRtbGpaVzl5YVdWdWRHRjBhVzl1SnlCc2FYTjBaVzVsY2lCaGJtUWdZbXh2WTJzZ1lXeHNJSE4xWW5ObGNYVmxiblFnSjJSbGRtbGpaVzF2ZEdsdmJpZGNiaUFnSUNBZ0lDOHZJR1YyWlc1MGN5QnZiaUIwYUdWelpTQmtaWFpwWTJWekxpQkRiMjF0Wlc1MGN5QjNhV3hzSUdKbElISmxiVzkyWldRZ2IyNWpaU0IwYUdVZ1luVm5JRzltWEc0Z0lDQWdJQ0F2THlCRGFISnZiV1VnYVhNZ1kyOXljbVZqZEdWa0xseHVYRzRnSUNBZ0lDQXZMeUJsYkhObElHbG1JQ2gwYUdsekxuSmxjWFZwY21Wa0xuSnZkR0YwYVc5dVVtRjBaU2xjYmlBZ0lDQWdJQzh2SUhSb2FYTXVYM1J5ZVU5eWFXVnVkR0YwYVc5dVJtRnNiR0poWTJzb0tUdGNibHh1SUNBZ0lDQWdaV3h6WlZ4dUlDQWdJQ0FnSUNCeVpYTnZiSFpsS0hSb2FYTXBPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRzVsZHlCRVpYWnBZMlZOYjNScGIyNU5iMlIxYkdVb0tUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9zbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9IHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgcmV0dXJuIGFycjsgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHsgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTsgfSBlbHNlIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH0gfTsgfSgpO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cbnZhciBfSW5wdXRNb2R1bGUyID0gcmVxdWlyZSgnLi9JbnB1dE1vZHVsZScpO1xuXG52YXIgX0lucHV0TW9kdWxlMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0lucHV0TW9kdWxlMik7XG5cbnZhciBfTW90aW9uSW5wdXQgPSByZXF1aXJlKCcuL01vdGlvbklucHV0Jyk7XG5cbnZhciBfTW90aW9uSW5wdXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTW90aW9uSW5wdXQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbi8qKlxuICogRW5lcmd5IG1vZHVsZSBzaW5nbGV0b24uXG4gKiBUaGUgZW5lcmd5IG1vZHVsZSBzaW5nbGV0b24gcHJvdmlkZXMgZW5lcmd5IHZhbHVlcyAoYmV0d2VlbiAwIGFuZCAxKVxuICogYmFzZWQgb24gdGhlIGFjY2VsZXJhdGlvbiBhbmQgdGhlIHJvdGF0aW9uIHJhdGUgb2YgdGhlIGRldmljZS5cbiAqIFRoZSBwZXJpb2Qgb2YgdGhlIGVuZXJneSB2YWx1ZXMgaXMgdGhlIHNhbWUgYXMgdGhlIHBlcmlvZCBvZiB0aGVcbiAqIGFjY2VsZXJhdGlvbiBhbmQgdGhlIHJvdGF0aW9uIHJhdGUgdmFsdWVzLlxuICpcbiAqIEBjbGFzcyBFbmVyZ3lNb2R1bGVcbiAqIEBleHRlbmRzIElucHV0TW9kdWxlXG4gKi9cbnZhciBFbmVyZ3lNb2R1bGUgPSBmdW5jdGlvbiAoX0lucHV0TW9kdWxlKSB7XG4gIF9pbmhlcml0cyhFbmVyZ3lNb2R1bGUsIF9JbnB1dE1vZHVsZSk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGVuZXJneSBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZnVuY3Rpb24gRW5lcmd5TW9kdWxlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFbmVyZ3lNb2R1bGUpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY29udGFpbmluZyB0aGUgdmFsdWUgb2YgdGhlIGVuZXJneSwgc2VudCBieSB0aGUgZW5lcmd5IG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChFbmVyZ3lNb2R1bGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihFbmVyZ3lNb2R1bGUpKS5jYWxsKHRoaXMsICdlbmVyZ3knKSk7XG5cbiAgICBfdGhpcy5ldmVudCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWNjZWxlcmF0aW9uIG1vZHVsZSwgdXNlZCBpbiB0aGUgY2FsY3VsYXRpb24gb2YgdGhlIGVuZXJneS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtET01FdmVudFN1Ym1vZHVsZX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICogQHNlZSBEZXZpY2Vtb3Rpb25Nb2R1bGVcbiAgICAgKi9cbiAgICBfdGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExhdGVzdCBhY2NlbGVyYXRpb24gdmFsdWUgc2VudCBieSB0aGUgYWNjZWxlcmF0aW9uIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgX3RoaXMuX2FjY2VsZXJhdGlvblZhbHVlcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIHZhbHVlIHJlYWNoZWQgYnkgdGhlIGFjY2VsZXJhdGlvbiBtYWduaXR1ZGUsIGNsaXBwZWQgYXQgYHRoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZVRocmVzaG9sZGAuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDkuODFcbiAgICAgKi9cbiAgICBfdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlQ3VycmVudE1heCA9IDEgKiA5LjgxO1xuXG4gICAgLyoqXG4gICAgICogQ2xpcHBpbmcgdmFsdWUgb2YgdGhlIGFjY2VsZXJhdGlvbiBtYWduaXR1ZGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDIwXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgX3RoaXMuX2FjY2VsZXJhdGlvbk1hZ25pdHVkZVRocmVzaG9sZCA9IDQgKiA5LjgxO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJvdGF0aW9uIHJhdGUgbW9kdWxlLCB1c2VkIGluIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGUgZW5lcmd5LlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge0RPTUV2ZW50U3VibW9kdWxlfVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKiBAc2VlIERldmljZW1vdGlvbk1vZHVsZVxuICAgICAqL1xuICAgIF90aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGF0ZXN0IHJvdGF0aW9uIHJhdGUgdmFsdWUgc2VudCBieSB0aGUgcm90YXRpb24gcmF0ZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIF90aGlzLl9yb3RhdGlvblJhdGVWYWx1ZXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSB2YWx1ZSByZWFjaGVkIGJ5IHRoZSByb3RhdGlvbiByYXRlIG1hZ25pdHVkZSwgY2xpcHBlZCBhdCBgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlVGhyZXNob2xkYC5cbiAgICAgKlxuICAgICAqIEB0aGlzIEVuZXJneU1vZHVsZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGRlZmF1bHQgNDAwXG4gICAgICovXG4gICAgX3RoaXMuX3JvdGF0aW9uUmF0ZU1hZ25pdHVkZUN1cnJlbnRNYXggPSA0MDA7XG5cbiAgICAvKipcbiAgICAgKiBDbGlwcGluZyB2YWx1ZSBvZiB0aGUgcm90YXRpb24gcmF0ZSBtYWduaXR1ZGUuXG4gICAgICpcbiAgICAgKiBAdGhpcyBFbmVyZ3lNb2R1bGVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDYwMFxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIF90aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVUaHJlc2hvbGQgPSA2MDA7XG5cbiAgICAvKipcbiAgICAgKiBUaW1lIGNvbnN0YW50IChoYWxmLWxpZmUpIG9mIHRoZSBsb3ctcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGVuZXJneSB2YWx1ZXMgKGluIHNlY29uZHMpLlxuICAgICAqXG4gICAgICogQHRoaXMgRW5lcmd5TW9kdWxlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwLjFcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBfdGhpcy5fZW5lcmd5VGltZUNvbnN0YW50ID0gMC4xO1xuXG4gICAgX3RoaXMuX29uQWNjZWxlcmF0aW9uID0gX3RoaXMuX29uQWNjZWxlcmF0aW9uLmJpbmQoX3RoaXMpO1xuICAgIF90aGlzLl9vblJvdGF0aW9uUmF0ZSA9IF90aGlzLl9vblJvdGF0aW9uUmF0ZS5iaW5kKF90aGlzKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICAvKipcbiAgICogRGVjYXkgZmFjdG9yIG9mIHRoZSBsb3ctcGFzcyBmaWx0ZXIgdXNlZCB0byBzbW9vdGggdGhlIGVuZXJneSB2YWx1ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhFbmVyZ3lNb2R1bGUsIFt7XG4gICAga2V5OiAnaW5pdCcsXG5cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIG9mIHRoZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBfZ2V0KEVuZXJneU1vZHVsZS5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihFbmVyZ3lNb2R1bGUucHJvdG90eXBlKSwgJ2luaXQnLCB0aGlzKS5jYWxsKHRoaXMsIGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIC8vIFRoZSBlbmVyZ3kgbW9kdWxlIHJlcXVpcmVzIHRoZSBhY2NlbGVyYXRpb24gYW5kIHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZXNcbiAgICAgICAgUHJvbWlzZS5hbGwoW19Nb3Rpb25JbnB1dDIuZGVmYXVsdC5yZXF1aXJlTW9kdWxlKCdhY2NlbGVyYXRpb24nKSwgX01vdGlvbklucHV0Mi5kZWZhdWx0LnJlcXVpcmVNb2R1bGUoJ3JvdGF0aW9uUmF0ZScpXSkudGhlbihmdW5jdGlvbiAobW9kdWxlcykge1xuICAgICAgICAgIHZhciBfbW9kdWxlcyA9IF9zbGljZWRUb0FycmF5KG1vZHVsZXMsIDIpLFxuICAgICAgICAgICAgICBhY2NlbGVyYXRpb24gPSBfbW9kdWxlc1swXSxcbiAgICAgICAgICAgICAgcm90YXRpb25SYXRlID0gX21vZHVsZXNbMV07XG5cbiAgICAgICAgICBfdGhpczIuX2FjY2VsZXJhdGlvbk1vZHVsZSA9IGFjY2VsZXJhdGlvbjtcbiAgICAgICAgICBfdGhpczIuX3JvdGF0aW9uUmF0ZU1vZHVsZSA9IHJvdGF0aW9uUmF0ZTtcbiAgICAgICAgICBfdGhpczIuaXNDYWxjdWxhdGVkID0gX3RoaXMyLl9hY2NlbGVyYXRpb25Nb2R1bGUuaXNWYWxpZCB8fCBfdGhpczIuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkO1xuXG4gICAgICAgICAgaWYgKF90aGlzMi5fYWNjZWxlcmF0aW9uTW9kdWxlLmlzVmFsaWQpIF90aGlzMi5wZXJpb2QgPSBfdGhpczIuX2FjY2VsZXJhdGlvbk1vZHVsZS5wZXJpb2Q7ZWxzZSBpZiAoX3RoaXMyLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZCkgX3RoaXMyLnBlcmlvZCA9IF90aGlzMi5fcm90YXRpb25SYXRlTW9kdWxlLnBlcmlvZDtcblxuICAgICAgICAgIHJlc29sdmUoX3RoaXMyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdhZGRMaXN0ZW5lcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgICBpZiAodGhpcy5saXN0ZW5lcnMuc2l6ZSA9PT0gMCkge1xuICAgICAgICBpZiAodGhpcy5fYWNjZWxlcmF0aW9uTW9kdWxlLmlzVmFsaWQpIHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5hZGRMaXN0ZW5lcih0aGlzLl9vbkFjY2VsZXJhdGlvbik7XG4gICAgICAgIGlmICh0aGlzLl9yb3RhdGlvblJhdGVNb2R1bGUuaXNWYWxpZCkgdGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLmFkZExpc3RlbmVyKHRoaXMuX29uUm90YXRpb25SYXRlKTtcbiAgICAgIH1cblxuICAgICAgX2dldChFbmVyZ3lNb2R1bGUucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRW5lcmd5TW9kdWxlLnByb3RvdHlwZSksICdhZGRMaXN0ZW5lcicsIHRoaXMpLmNhbGwodGhpcywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3JlbW92ZUxpc3RlbmVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICAgIF9nZXQoRW5lcmd5TW9kdWxlLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEVuZXJneU1vZHVsZS5wcm90b3R5cGUpLCAncmVtb3ZlTGlzdGVuZXInLCB0aGlzKS5jYWxsKHRoaXMsIGxpc3RlbmVyKTtcblxuICAgICAgaWYgKHRoaXMubGlzdGVuZXJzLnNpemUgPT09IDApIHtcbiAgICAgICAgaWYgKHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5pc1ZhbGlkKSB0aGlzLl9hY2NlbGVyYXRpb25Nb2R1bGUucmVtb3ZlTGlzdGVuZXIodGhpcy5fb25BY2NlbGVyYXRpb24pO1xuICAgICAgICBpZiAodGhpcy5fcm90YXRpb25SYXRlTW9kdWxlLmlzVmFsaWQpIHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5yZW1vdmVMaXN0ZW5lcih0aGlzLl9vblJvdGF0aW9uUmF0ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWNjZWxlcmF0aW9uIHZhbHVlcyBoYW5kbGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gYWNjZWxlcmF0aW9uIC0gTGF0ZXN0IGFjY2VsZXJhdGlvbiB2YWx1ZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnX29uQWNjZWxlcmF0aW9uJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gX29uQWNjZWxlcmF0aW9uKGFjY2VsZXJhdGlvbikge1xuICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzID0gYWNjZWxlcmF0aW9uO1xuXG4gICAgICAvLyBJZiB0aGUgcm90YXRpb24gcmF0ZSB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUsIHdlIGNhbGN1bGF0ZSB0aGUgZW5lcmd5IHJpZ2h0IGF3YXkuXG4gICAgICBpZiAoIXRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKSB0aGlzLl9jYWxjdWxhdGVFbmVyZ3koKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGlvbiByYXRlIHZhbHVlcyBoYW5kbGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gcm90YXRpb25SYXRlIC0gTGF0ZXN0IHJvdGF0aW9uIHJhdGUgdmFsdWUuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ19vblJvdGF0aW9uUmF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9vblJvdGF0aW9uUmF0ZShyb3RhdGlvblJhdGUpIHtcbiAgICAgIHRoaXMuX3JvdGF0aW9uUmF0ZVZhbHVlcyA9IHJvdGF0aW9uUmF0ZTtcblxuICAgICAgLy8gV2Uga25vdyB0aGF0IHRoZSBhY2NlbGVyYXRpb24gYW5kIHJvdGF0aW9uIHJhdGUgdmFsdWVzIGNvbWluZyBmcm9tIHRoZVxuICAgICAgLy8gc2FtZSBgZGV2aWNlbW90aW9uYCBldmVudCBhcmUgc2VudCBpbiB0aGF0IG9yZGVyIChhY2NlbGVyYXRpb24gPiByb3RhdGlvbiByYXRlKVxuICAgICAgLy8gc28gd2hlbiB0aGUgcm90YXRpb24gcmF0ZSBpcyBwcm92aWRlZCwgd2UgY2FsY3VsYXRlIHRoZSBlbmVyZ3kgdmFsdWUgb2YgdGhlXG4gICAgICAvLyBsYXRlc3QgYGRldmljZW1vdGlvbmAgZXZlbnQgd2hlbiB3ZSByZWNlaXZlIHRoZSByb3RhdGlvbiByYXRlIHZhbHVlcy5cbiAgICAgIHRoaXMuX2NhbGN1bGF0ZUVuZXJneSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVuZXJneSBjYWxjdWxhdGlvbjogZW1pdHMgYW4gZW5lcmd5IHZhbHVlIGJldHdlZW4gMCBhbmQgMS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGNoZWNrcyBpZiB0aGUgYWNjZWxlcmF0aW9uIG1vZHVsZXMgaXMgdmFsaWQuIElmIHRoYXQgaXMgdGhlIGNhc2UsXG4gICAgICogaXQgY2FsY3VsYXRlcyBhbiBlc3RpbWF0aW9uIG9mIHRoZSBlbmVyZ3kgKGJldHdlZW4gMCBhbmQgMSkgYmFzZWQgb24gdGhlIHJhdGlvXG4gICAgICogb2YgdGhlIGN1cnJlbnQgYWNjZWxlcmF0aW9uIG1hZ25pdHVkZSBhbmQgdGhlIG1heGltdW0gYWNjZWxlcmF0aW9uIG1hZ25pdHVkZVxuICAgICAqIHJlYWNoZWQgc28gZmFyIChjbGlwcGVkIGF0IHRoZSBgdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlVGhyZXNob2xkYCB2YWx1ZSkuXG4gICAgICogKFdlIHVzZSB0aGlzIHRyaWNrIHRvIGdldCB1bmlmb3JtIGJlaGF2aW9ycyBhbW9uZyBkZXZpY2VzLiBJZiB3ZSBjYWxjdWxhdGVkXG4gICAgICogdGhlIHJhdGlvIGJhc2VkIG9uIGEgZml4ZWQgdmFsdWUgaW5kZXBlbmRlbnQgb2Ygd2hhdCB0aGUgZGV2aWNlIGlzIGNhcGFibGUgb2ZcbiAgICAgKiBwcm92aWRpbmcsIHdlIGNvdWxkIGdldCBpbmNvbnNpc3RlbnQgYmVoYXZpb3JzLiBGb3IgaW5zdGFuY2UsIHRoZSBkZXZpY2VzXG4gICAgICogd2hvc2UgYWNjZWxlcm9tZXRlcnMgYXJlIGxpbWl0ZWQgYXQgMmcgd291bGQgYWx3YXlzIHByb3ZpZGUgdmVyeSBsb3cgdmFsdWVzXG4gICAgICogY29tcGFyZWQgdG8gZGV2aWNlcyB3aXRoIGFjY2VsZXJvbWV0ZXJzIGNhcGFibGUgb2YgbWVhc3VyaW5nIDRnIGFjY2VsZXJhdGlvbnMuKVxuICAgICAqIFRoZSBzYW1lIGNoZWNrcyBhbmQgY2FsY3VsYXRpb25zIGFyZSBtYWRlIG9uIHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZS5cbiAgICAgKiBGaW5hbGx5LCB0aGUgZW5lcmd5IHZhbHVlIGlzIHRoZSBtYXhpbXVtIGJldHdlZW4gdGhlIGVuZXJneSB2YWx1ZSBlc3RpbWF0ZWRcbiAgICAgKiBmcm9tIHRoZSBhY2NlbGVyYXRpb24sIGFuZCB0aGUgb25lIGVzdGltYXRlZCBmcm9tIHRoZSByb3RhdGlvbiByYXRlLiBJdCBpc1xuICAgICAqIHNtb290aGVkIHRocm91Z2ggYSBsb3ctcGFzcyBmaWx0ZXIuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ19jYWxjdWxhdGVFbmVyZ3knLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfY2FsY3VsYXRlRW5lcmd5KCkge1xuICAgICAgdmFyIGFjY2VsZXJhdGlvbkVuZXJneSA9IDA7XG4gICAgICB2YXIgcm90YXRpb25SYXRlRW5lcmd5ID0gMDtcblxuICAgICAgLy8gQ2hlY2sgdGhlIGFjY2VsZXJhdGlvbiBtb2R1bGUgYW5kIGNhbGN1bGF0ZSBhbiBlc3RpbWF0aW9uIG9mIHRoZSBlbmVyZ3kgdmFsdWUgZnJvbSB0aGUgbGF0ZXN0IGFjY2VsZXJhdGlvbiB2YWx1ZVxuICAgICAgaWYgKHRoaXMuX2FjY2VsZXJhdGlvbk1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgICAgIHZhciBhWCA9IHRoaXMuX2FjY2VsZXJhdGlvblZhbHVlc1swXTtcbiAgICAgICAgdmFyIGFZID0gdGhpcy5fYWNjZWxlcmF0aW9uVmFsdWVzWzFdO1xuICAgICAgICB2YXIgYVogPSB0aGlzLl9hY2NlbGVyYXRpb25WYWx1ZXNbMl07XG4gICAgICAgIHZhciBhY2NlbGVyYXRpb25NYWduaXR1ZGUgPSBNYXRoLnNxcnQoYVggKiBhWCArIGFZICogYVkgKyBhWiAqIGFaKTtcblxuICAgICAgICAvLyBTdG9yZSB0aGUgbWF4aW11bSBhY2NlbGVyYXRpb24gbWFnbml0dWRlIHJlYWNoZWQgc28gZmFyLCBjbGlwcGVkIGF0IGB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVUaHJlc2hvbGRgXG4gICAgICAgIGlmICh0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVDdXJyZW50TWF4IDwgYWNjZWxlcmF0aW9uTWFnbml0dWRlKSB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVDdXJyZW50TWF4ID0gTWF0aC5taW4oYWNjZWxlcmF0aW9uTWFnbml0dWRlLCB0aGlzLl9hY2NlbGVyYXRpb25NYWduaXR1ZGVUaHJlc2hvbGQpO1xuICAgICAgICAvLyBUT0RPKD8pOiByZW1vdmUgb3VsaWVycyAtLS0gb24gc29tZSBBbmRyb2lkIGRldmljZXMsIHRoZSBtYWduaXR1ZGUgaXMgdmVyeSBoaWdoIG9uIGEgZmV3IGlzb2xhdGVkIGRhdGFwb2ludHMsXG4gICAgICAgIC8vIHdoaWNoIG1ha2UgdGhlIHRocmVzaG9sZCB2ZXJ5IGhpZ2ggYXMgd2VsbCA9PiB0aGUgZW5lcmd5IHJlbWFpbnMgYXJvdW5kIDAuNSwgZXZlbiB3aGVuIHlvdSBzaGFrZSB2ZXJ5IGhhcmQuXG5cbiAgICAgICAgYWNjZWxlcmF0aW9uRW5lcmd5ID0gTWF0aC5taW4oYWNjZWxlcmF0aW9uTWFnbml0dWRlIC8gdGhpcy5fYWNjZWxlcmF0aW9uTWFnbml0dWRlQ3VycmVudE1heCwgMSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIHRoZSByb3RhdGlvbiByYXRlIG1vZHVsZSBhbmQgY2FsY3VsYXRlIGFuIGVzdGltYXRpb24gb2YgdGhlIGVuZXJneSB2YWx1ZSBmcm9tIHRoZSBsYXRlc3Qgcm90YXRpb24gcmF0ZSB2YWx1ZVxuICAgICAgaWYgKHRoaXMuX3JvdGF0aW9uUmF0ZU1vZHVsZS5pc1ZhbGlkKSB7XG4gICAgICAgIHZhciByQSA9IHRoaXMuX3JvdGF0aW9uUmF0ZVZhbHVlc1swXTtcbiAgICAgICAgdmFyIHJCID0gdGhpcy5fcm90YXRpb25SYXRlVmFsdWVzWzFdO1xuICAgICAgICB2YXIgckcgPSB0aGlzLl9yb3RhdGlvblJhdGVWYWx1ZXNbMl07XG4gICAgICAgIHZhciByb3RhdGlvblJhdGVNYWduaXR1ZGUgPSBNYXRoLnNxcnQockEgKiByQSArIHJCICogckIgKyByRyAqIHJHKTtcblxuICAgICAgICAvLyBTdG9yZSB0aGUgbWF4aW11bSByb3RhdGlvbiByYXRlIG1hZ25pdHVkZSByZWFjaGVkIHNvIGZhciwgY2xpcHBlZCBhdCBgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlVGhyZXNob2xkYFxuICAgICAgICBpZiAodGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlQ3VycmVudE1heCA8IHJvdGF0aW9uUmF0ZU1hZ25pdHVkZSkgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlQ3VycmVudE1heCA9IE1hdGgubWluKHJvdGF0aW9uUmF0ZU1hZ25pdHVkZSwgdGhpcy5fcm90YXRpb25SYXRlTWFnbml0dWRlVGhyZXNob2xkKTtcblxuICAgICAgICByb3RhdGlvblJhdGVFbmVyZ3kgPSBNYXRoLm1pbihyb3RhdGlvblJhdGVNYWduaXR1ZGUgLyB0aGlzLl9yb3RhdGlvblJhdGVNYWduaXR1ZGVDdXJyZW50TWF4LCAxKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVuZXJneSA9IE1hdGgubWF4KGFjY2VsZXJhdGlvbkVuZXJneSwgcm90YXRpb25SYXRlRW5lcmd5KTtcblxuICAgICAgLy8gTG93LXBhc3MgZmlsdGVyIHRvIHNtb290aCB0aGUgZW5lcmd5IHZhbHVlc1xuICAgICAgdmFyIGsgPSB0aGlzLl9lbmVyZ3lEZWNheTtcbiAgICAgIHRoaXMuZXZlbnQgPSBrICogdGhpcy5ldmVudCArICgxIC0gaykgKiBlbmVyZ3k7XG5cbiAgICAgIC8vIEVtaXQgdGhlIGVuZXJneSB2YWx1ZVxuICAgICAgdGhpcy5lbWl0KHRoaXMuZXZlbnQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ19lbmVyZ3lEZWNheScsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gTWF0aC5leHAoLTIgKiBNYXRoLlBJICogdGhpcy5wZXJpb2QgLyB0aGlzLl9lbmVyZ3lUaW1lQ29uc3RhbnQpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBFbmVyZ3lNb2R1bGU7XG59KF9JbnB1dE1vZHVsZTMuZGVmYXVsdCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IG5ldyBFbmVyZ3lNb2R1bGUoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrVnVaWEpuZVUxdlpIVnNaUzVxY3lKZExDSnVZVzFsY3lJNld5SkZibVZ5WjNsTmIyUjFiR1VpTENKbGRtVnVkQ0lzSWw5aFkyTmxiR1Z5WVhScGIyNU5iMlIxYkdVaUxDSmZZV05qWld4bGNtRjBhVzl1Vm1Gc2RXVnpJaXdpWDJGalkyVnNaWEpoZEdsdmJrMWhaMjVwZEhWa1pVTjFjbkpsYm5STllYZ2lMQ0pmWVdOalpXeGxjbUYwYVc5dVRXRm5ibWwwZFdSbFZHaHlaWE5vYjJ4a0lpd2lYM0p2ZEdGMGFXOXVVbUYwWlUxdlpIVnNaU0lzSWw5eWIzUmhkR2x2YmxKaGRHVldZV3gxWlhNaUxDSmZjbTkwWVhScGIyNVNZWFJsVFdGbmJtbDBkV1JsUTNWeWNtVnVkRTFoZUNJc0lsOXliM1JoZEdsdmJsSmhkR1ZOWVdkdWFYUjFaR1ZVYUhKbGMyaHZiR1FpTENKZlpXNWxjbWQ1VkdsdFpVTnZibk4wWVc1MElpd2lYMjl1UVdOalpXeGxjbUYwYVc5dUlpd2lZbWx1WkNJc0lsOXZibEp2ZEdGMGFXOXVVbUYwWlNJc0luSmxjMjlzZG1VaUxDSlFjbTl0YVhObElpd2lZV3hzSWl3aWNtVnhkV2x5WlUxdlpIVnNaU0lzSW5Sb1pXNGlMQ0p0YjJSMWJHVnpJaXdpWVdOalpXeGxjbUYwYVc5dUlpd2ljbTkwWVhScGIyNVNZWFJsSWl3aWFYTkRZV3hqZFd4aGRHVmtJaXdpYVhOV1lXeHBaQ0lzSW5CbGNtbHZaQ0lzSW14cGMzUmxibVZ5SWl3aWJHbHpkR1Z1WlhKeklpd2ljMmw2WlNJc0ltRmtaRXhwYzNSbGJtVnlJaXdpY21WdGIzWmxUR2x6ZEdWdVpYSWlMQ0pmWTJGc1kzVnNZWFJsUlc1bGNtZDVJaXdpWVdOalpXeGxjbUYwYVc5dVJXNWxjbWQ1SWl3aWNtOTBZWFJwYjI1U1lYUmxSVzVsY21kNUlpd2lZVmdpTENKaFdTSXNJbUZhSWl3aVlXTmpaV3hsY21GMGFXOXVUV0ZuYm1sMGRXUmxJaXdpVFdGMGFDSXNJbk54Y25RaUxDSnRhVzRpTENKeVFTSXNJbkpDSWl3aWNrY2lMQ0p5YjNSaGRHbHZibEpoZEdWTllXZHVhWFIxWkdVaUxDSmxibVZ5WjNraUxDSnRZWGdpTENKcklpd2lYMlZ1WlhKbmVVUmxZMkY1SWl3aVpXMXBkQ0lzSW1WNGNDSXNJbEJKSWwwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGQlFUczdPenRCUVVOQk96czdPenM3T3pzN096czdRVUZGUVRzN096czdPenM3T3p0SlFWVk5RU3haT3pzN1FVRkZTanM3T3pzN1FVRkxRU3d3UWtGQll6dEJRVUZCT3p0QlFVZGFPenM3T3pzN08wRkJTRmtzTkVoQlEwNHNVVUZFVFRzN1FVRlZXaXhWUVVGTFF5eExRVUZNTEVkQlFXRXNRMEZCWWpzN1FVRkZRVHM3T3pzN096czdRVUZSUVN4VlFVRkxReXh0UWtGQlRDeEhRVUV5UWl4SlFVRXpRanM3UVVGRlFUczdPenM3T3p0QlFVOUJMRlZCUVV0RExHMUNRVUZNTEVkQlFUSkNMRWxCUVROQ096dEJRVVZCT3pzN096czdPMEZCVDBFc1ZVRkJTME1zWjBOQlFVd3NSMEZCZDBNc1NVRkJTU3hKUVVFMVF6czdRVUZGUVRzN096czdPenM3UVVGUlFTeFZRVUZMUXl3clFrRkJUQ3hIUVVGMVF5eEpRVUZKTEVsQlFUTkRPenRCUVVWQk96czdPenM3T3p0QlFWRkJMRlZCUVV0RExHMUNRVUZNTEVkQlFUSkNMRWxCUVROQ096dEJRVVZCT3pzN096czdPMEZCVDBFc1ZVRkJTME1zYlVKQlFVd3NSMEZCTWtJc1NVRkJNMEk3TzBGQlJVRTdPenM3T3pzN1FVRlBRU3hWUVVGTFF5eG5RMEZCVEN4SFFVRjNReXhIUVVGNFF6czdRVUZGUVRzN096czdPenM3UVVGUlFTeFZRVUZMUXl3clFrRkJUQ3hIUVVGMVF5eEhRVUYyUXpzN1FVRkZRVHM3T3pzN096czdRVUZSUVN4VlFVRkxReXh0UWtGQlRDeEhRVUV5UWl4SFFVRXpRanM3UVVGRlFTeFZRVUZMUXl4bFFVRk1MRWRCUVhWQ0xFMUJRVXRCTEdWQlFVd3NRMEZCY1VKRExFbEJRWEpDTEU5QlFYWkNPMEZCUTBFc1ZVRkJTME1zWlVGQlRDeEhRVUYxUWl4TlFVRkxRU3hsUVVGTUxFTkJRWEZDUkN4SlFVRnlRaXhQUVVGMlFqdEJRVzVIV1R0QlFXOUhZanM3UVVGRlJEczdPenM3T3pzN096czdPMEZCVlVFN096czdPekpDUVV0UE8wRkJRVUU3TzBGQlEwd3NPRWhCUVd0Q0xGVkJRVU5GTEU5QlFVUXNSVUZCWVR0QlFVTTNRanRCUVVOQlF5eG5Ra0ZCVVVNc1IwRkJVaXhEUVVGWkxFTkJRVU1zYzBKQlFWbERMR0ZCUVZvc1EwRkJNRUlzWTBGQk1VSXNRMEZCUkN4RlFVRTBReXh6UWtGQldVRXNZVUZCV2l4RFFVRXdRaXhqUVVFeFFpeERRVUUxUXl4RFFVRmFMRVZCUTBkRExFbEJSRWdzUTBGRFVTeFZRVUZEUXl4UFFVRkVMRVZCUVdFN1FVRkJRU3gzUTBGRGIwSkJMRTlCUkhCQ08wRkJRVUVzWTBGRFZrTXNXVUZFVlR0QlFVRkJMR05CUTBsRExGbEJSRW83TzBGQlIycENMR2xDUVVGTGJrSXNiVUpCUVV3c1IwRkJNa0pyUWl4WlFVRXpRanRCUVVOQkxHbENRVUZMWkN4dFFrRkJUQ3hIUVVFeVFtVXNXVUZCTTBJN1FVRkRRU3hwUWtGQlMwTXNXVUZCVEN4SFFVRnZRaXhQUVVGTGNFSXNiVUpCUVV3c1EwRkJlVUp4UWl4UFFVRjZRaXhKUVVGdlF5eFBRVUZMYWtJc2JVSkJRVXdzUTBGQmVVSnBRaXhQUVVGcVJqczdRVUZGUVN4alFVRkpMRTlCUVV0eVFpeHRRa0ZCVEN4RFFVRjVRbkZDTEU5QlFUZENMRVZCUTBVc1QwRkJTME1zVFVGQlRDeEhRVUZqTEU5QlFVdDBRaXh0UWtGQlRDeERRVUY1UW5OQ0xFMUJRWFpETEVOQlJFWXNTMEZGU3l4SlFVRkpMRTlCUVV0c1FpeHRRa0ZCVEN4RFFVRjVRbWxDTEU5QlFUZENMRVZCUTBnc1QwRkJTME1zVFVGQlRDeEhRVUZqTEU5QlFVdHNRaXh0UWtGQlRDeERRVUY1UW10Q0xFMUJRWFpET3p0QlFVVkdWanRCUVVORUxGTkJaRWc3UVVGbFJDeFBRV3BDUkR0QlFXdENSRHM3TzJkRFFVVlhWeXhSTEVWQlFWVTdRVUZEY0VJc1ZVRkJTU3hMUVVGTFF5eFRRVUZNTEVOQlFXVkRMRWxCUVdZc1MwRkJkMElzUTBGQk5VSXNSVUZCSzBJN1FVRkROMElzV1VGQlNTeExRVUZMZWtJc2JVSkJRVXdzUTBGQmVVSnhRaXhQUVVFM1FpeEZRVU5GTEV0QlFVdHlRaXh0UWtGQlRDeERRVUY1UWpCQ0xGZEJRWHBDTEVOQlFYRkRMRXRCUVV0cVFpeGxRVUV4UXp0QlFVTkdMRmxCUVVrc1MwRkJTMHdzYlVKQlFVd3NRMEZCZVVKcFFpeFBRVUUzUWl4RlFVTkZMRXRCUVV0cVFpeHRRa0ZCVEN4RFFVRjVRbk5DTEZkQlFYcENMRU5CUVhGRExFdEJRVXRtTEdWQlFURkRPMEZCUTBnN08wRkJSVVFzT0VoQlFXdENXU3hSUVVGc1FqdEJRVU5FT3pzN2JVTkJSV05CTEZFc1JVRkJWVHRCUVVOMlFpeHBTVUZCY1VKQkxGRkJRWEpDT3p0QlFVVkJMRlZCUVVrc1MwRkJTME1zVTBGQlRDeERRVUZsUXl4SlFVRm1MRXRCUVhkQ0xFTkJRVFZDTEVWQlFTdENPMEZCUXpkQ0xGbEJRVWtzUzBGQlMzcENMRzFDUVVGTUxFTkJRWGxDY1VJc1QwRkJOMElzUlVGRFJTeExRVUZMY2tJc2JVSkJRVXdzUTBGQmVVSXlRaXhqUVVGNlFpeERRVUYzUXl4TFFVRkxiRUlzWlVGQk4wTTdRVUZEUml4WlFVRkpMRXRCUVV0TUxHMUNRVUZNTEVOQlFYbENhVUlzVDBGQk4wSXNSVUZEUlN4TFFVRkxha0lzYlVKQlFVd3NRMEZCZVVKMVFpeGpRVUY2UWl4RFFVRjNReXhMUVVGTGFFSXNaVUZCTjBNN1FVRkRTRHRCUVVOR096dEJRVVZFT3pzN096czdPenR2UTBGTFowSlBMRmtzUlVGQll6dEJRVU0xUWl4WFFVRkxha0lzYlVKQlFVd3NSMEZCTWtKcFFpeFpRVUV6UWpzN1FVRkZRVHRCUVVOQkxGVkJRVWtzUTBGQlF5eExRVUZMWkN4dFFrRkJUQ3hEUVVGNVFtbENMRTlCUVRsQ0xFVkJRMFVzUzBGQlMwOHNaMEpCUVV3N1FVRkRTRHM3UVVGRlJEczdPenM3T3pzN2IwTkJTMmRDVkN4WkxFVkJRV003UVVGRE5VSXNWMEZCUzJRc2JVSkJRVXdzUjBGQk1rSmpMRmxCUVROQ096dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1YwRkJTMU1zWjBKQlFVdzdRVUZEUkRzN1FVRkZSRHM3T3pzN096czdPenM3T3pzN096czdPenM3ZFVOQmFVSnRRanRCUVVOcVFpeFZRVUZKUXl4eFFrRkJjVUlzUTBGQmVrSTdRVUZEUVN4VlFVRkpReXh4UWtGQmNVSXNRMEZCZWtJN08wRkJSVUU3UVVGRFFTeFZRVUZKTEV0QlFVczVRaXh0UWtGQlRDeERRVUY1UW5GQ0xFOUJRVGRDTEVWQlFYTkRPMEZCUTNCRExGbEJRVWxWTEV0QlFVc3NTMEZCU3psQ0xHMUNRVUZNTEVOQlFYbENMRU5CUVhwQ0xFTkJRVlE3UVVGRFFTeFpRVUZKSzBJc1MwRkJTeXhMUVVGTEwwSXNiVUpCUVV3c1EwRkJlVUlzUTBGQmVrSXNRMEZCVkR0QlFVTkJMRmxCUVVsblF5eExRVUZMTEV0QlFVdG9ReXh0UWtGQlRDeERRVUY1UWl4RFFVRjZRaXhEUVVGVU8wRkJRMEVzV1VGQlNXbERMSGRDUVVGM1FrTXNTMEZCUzBNc1NVRkJUQ3hEUVVGVlRDeExRVUZMUVN4RlFVRk1MRWRCUVZWRExFdEJRVXRCTEVWQlFXWXNSMEZCYjBKRExFdEJRVXRCTEVWQlFXNURMRU5CUVRWQ096dEJRVVZCTzBGQlEwRXNXVUZCU1N4TFFVRkxMMElzWjBOQlFVd3NSMEZCZDBOblF5eHhRa0ZCTlVNc1JVRkRSU3hMUVVGTGFFTXNaME5CUVV3c1IwRkJkME5wUXl4TFFVRkxSU3hIUVVGTUxFTkJRVk5JTEhGQ1FVRlVMRVZCUVdkRExFdEJRVXN2UWl3clFrRkJja01zUTBGQmVFTTdRVUZEUmp0QlFVTkJPenRCUVVWQk1FSXNOa0pCUVhGQ1RTeExRVUZMUlN4SFFVRk1MRU5CUVZOSUxIZENRVUYzUWl4TFFVRkxhRU1zWjBOQlFYUkRMRVZCUVhkRkxFTkJRWGhGTEVOQlFYSkNPMEZCUTBRN08wRkJSVVE3UVVGRFFTeFZRVUZKTEV0QlFVdEZMRzFDUVVGTUxFTkJRWGxDYVVJc1QwRkJOMElzUlVGQmMwTTdRVUZEY0VNc1dVRkJTV2xDTEV0QlFVc3NTMEZCUzJwRExHMUNRVUZNTEVOQlFYbENMRU5CUVhwQ0xFTkJRVlE3UVVGRFFTeFpRVUZKYTBNc1MwRkJTeXhMUVVGTGJFTXNiVUpCUVV3c1EwRkJlVUlzUTBGQmVrSXNRMEZCVkR0QlFVTkJMRmxCUVVsdFF5eExRVUZMTEV0QlFVdHVReXh0UWtGQlRDeERRVUY1UWl4RFFVRjZRaXhEUVVGVU8wRkJRMEVzV1VGQlNXOURMSGRDUVVGM1FrNHNTMEZCUzBNc1NVRkJUQ3hEUVVGVlJTeExRVUZMUVN4RlFVRk1MRWRCUVZWRExFdEJRVXRCTEVWQlFXWXNSMEZCYjBKRExFdEJRVXRCTEVWQlFXNURMRU5CUVRWQ096dEJRVVZCTzBGQlEwRXNXVUZCU1N4TFFVRkxiRU1zWjBOQlFVd3NSMEZCZDBOdFF5eHhRa0ZCTlVNc1JVRkRSU3hMUVVGTGJrTXNaME5CUVV3c1IwRkJkME0yUWl4TFFVRkxSU3hIUVVGTUxFTkJRVk5KTEhGQ1FVRlVMRVZCUVdkRExFdEJRVXRzUXl3clFrRkJja01zUTBGQmVFTTdPMEZCUlVaMVFpdzJRa0ZCY1VKTExFdEJRVXRGTEVkQlFVd3NRMEZCVTBrc2QwSkJRWGRDTEV0QlFVdHVReXhuUTBGQmRFTXNSVUZCZDBVc1EwRkJlRVVzUTBGQmNrSTdRVUZEUkRzN1FVRkZSQ3hWUVVGSmIwTXNVMEZCVTFBc1MwRkJTMUVzUjBGQlRDeERRVUZUWkN4clFrRkJWQ3hGUVVFMlFrTXNhMEpCUVRkQ0xFTkJRV0k3TzBGQlJVRTdRVUZEUVN4VlFVRk5ZeXhKUVVGSkxFdEJRVXRETEZsQlFXWTdRVUZEUVN4WFFVRkxPVU1zUzBGQlRDeEhRVUZoTmtNc1NVRkJTU3hMUVVGTE4wTXNTMEZCVkN4SFFVRnBRaXhEUVVGRExFbEJRVWsyUXl4RFFVRk1MRWxCUVZWR0xFMUJRWGhET3p0QlFVVkJPMEZCUTBFc1YwRkJTMGtzU1VGQlRDeERRVUZWTEV0QlFVc3ZReXhMUVVGbU8wRkJRMFE3T3p0M1FrRXpTV3RDTzBGQlEycENMR0ZCUVU5dlF5eExRVUZMV1N4SFFVRk1MRU5CUVZNc1EwRkJReXhEUVVGRUxFZEJRVXRhTEV0QlFVdGhMRVZCUVZZc1IwRkJaU3hMUVVGTE1VSXNUVUZCY0VJc1IwRkJOa0lzUzBGQlMyUXNiVUpCUVRORExFTkJRVkE3UVVGRFJEczdPenM3TzJ0Q1FUUkpXU3hKUVVGSlZpeFpRVUZLTEVVaUxDSm1hV3hsSWpvaVJXNWxjbWQ1VFc5a2RXeGxMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUVsdWNIVjBUVzlrZFd4bElHWnliMjBnSnk0dlNXNXdkWFJOYjJSMWJHVW5PMXh1YVcxd2IzSjBJRzF2ZEdsdmJrbHVjSFYwSUdaeWIyMGdKeTR2VFc5MGFXOXVTVzV3ZFhRbk8xeHVYRzR2S2lwY2JpQXFJRVZ1WlhKbmVTQnRiMlIxYkdVZ2MybHVaMnhsZEc5dUxseHVJQ29nVkdobElHVnVaWEpuZVNCdGIyUjFiR1VnYzJsdVoyeGxkRzl1SUhCeWIzWnBaR1Z6SUdWdVpYSm5lU0IyWVd4MVpYTWdLR0psZEhkbFpXNGdNQ0JoYm1RZ01TbGNiaUFxSUdKaGMyVmtJRzl1SUhSb1pTQmhZMk5sYkdWeVlYUnBiMjRnWVc1a0lIUm9aU0J5YjNSaGRHbHZiaUJ5WVhSbElHOW1JSFJvWlNCa1pYWnBZMlV1WEc0Z0tpQlVhR1VnY0dWeWFXOWtJRzltSUhSb1pTQmxibVZ5WjNrZ2RtRnNkV1Z6SUdseklIUm9aU0J6WVcxbElHRnpJSFJvWlNCd1pYSnBiMlFnYjJZZ2RHaGxYRzRnS2lCaFkyTmxiR1Z5WVhScGIyNGdZVzVrSUhSb1pTQnliM1JoZEdsdmJpQnlZWFJsSUhaaGJIVmxjeTVjYmlBcVhHNGdLaUJBWTJ4aGMzTWdSVzVsY21kNVRXOWtkV3hsWEc0Z0tpQkFaWGgwWlc1a2N5QkpibkIxZEUxdlpIVnNaVnh1SUNvdlhHNWpiR0Z6Y3lCRmJtVnlaM2xOYjJSMWJHVWdaWGgwWlc1a2N5QkpibkIxZEUxdlpIVnNaU0I3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU55WldGMFpYTWdkR2hsSUdWdVpYSm5lU0J0YjJSMWJHVWdhVzV6ZEdGdVkyVXVYRzRnSUNBcVhHNGdJQ0FxSUVCamIyNXpkSEoxWTNSdmNseHVJQ0FnS2k5Y2JpQWdZMjl1YzNSeWRXTjBiM0lvS1NCN1hHNGdJQ0FnYzNWd1pYSW9KMlZ1WlhKbmVTY3BPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUlhabGJuUWdZMjl1ZEdGcGJtbHVaeUIwYUdVZ2RtRnNkV1VnYjJZZ2RHaGxJR1Z1WlhKbmVTd2djMlZ1ZENCaWVTQjBhR1VnWlc1bGNtZDVJRzF2WkhWc1pTNWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQjBhR2x6SUVWdVpYSm5lVTF2WkhWc1pWeHVJQ0FnSUNBcUlFQjBlWEJsSUh0dWRXMWlaWEo5WEc0Z0lDQWdJQ29nUUdSbFptRjFiSFFnTUZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVpYWmxiblFnUFNBd08xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dWR2hsSUdGalkyVnNaWEpoZEdsdmJpQnRiMlIxYkdVc0lIVnpaV1FnYVc0Z2RHaGxJR05oYkdOMWJHRjBhVzl1SUc5bUlIUm9aU0JsYm1WeVoza3VYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFkR2hwY3lCRmJtVnlaM2xOYjJSMWJHVmNiaUFnSUNBZ0tpQkFkSGx3WlNCN1JFOU5SWFpsYm5SVGRXSnRiMlIxYkdWOVhHNGdJQ0FnSUNvZ1FHUmxabUYxYkhRZ2JuVnNiRnh1SUNBZ0lDQXFJRUJ6WldVZ1JHVjJhV05sYlc5MGFXOXVUVzlrZFd4bFhHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWZZV05qWld4bGNtRjBhVzl1VFc5a2RXeGxJRDBnYm5Wc2JEdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRXhoZEdWemRDQmhZMk5sYkdWeVlYUnBiMjRnZG1Gc2RXVWdjMlZ1ZENCaWVTQjBhR1VnWVdOalpXeGxjbUYwYVc5dUlHMXZaSFZzWlM1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCMGFHbHpJRVZ1WlhKbmVVMXZaSFZzWlZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHR1ZFcxaVpYSmJYWDFjYmlBZ0lDQWdLaUJBWkdWbVlYVnNkQ0J1ZFd4c1hHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWZZV05qWld4bGNtRjBhVzl1Vm1Gc2RXVnpJRDBnYm5Wc2JEdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRTFoZUdsdGRXMGdkbUZzZFdVZ2NtVmhZMmhsWkNCaWVTQjBhR1VnWVdOalpXeGxjbUYwYVc5dUlHMWhaMjVwZEhWa1pTd2dZMnhwY0hCbFpDQmhkQ0JnZEdocGN5NWZZV05qWld4bGNtRjBhVzl1VFdGbmJtbDBkV1JsVkdoeVpYTm9iMnhrWUM1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCMGFHbHpJRVZ1WlhKbmVVMXZaSFZzWlZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHR1ZFcxaVpYSjlYRzRnSUNBZ0lDb2dRR1JsWm1GMWJIUWdPUzQ0TVZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVgyRmpZMlZzWlhKaGRHbHZiazFoWjI1cGRIVmtaVU4xY25KbGJuUk5ZWGdnUFNBeElDb2dPUzQ0TVR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFTnNhWEJ3YVc1bklIWmhiSFZsSUc5bUlIUm9aU0JoWTJObGJHVnlZWFJwYjI0Z2JXRm5ibWwwZFdSbExseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIUm9hWE1nUlc1bGNtZDVUVzlrZFd4bFhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTI1MWJXSmxjbjFjYmlBZ0lDQWdLaUJBWkdWbVlYVnNkQ0F5TUZ4dUlDQWdJQ0FxSUVCamIyNXpkR0Z1ZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVgyRmpZMlZzWlhKaGRHbHZiazFoWjI1cGRIVmtaVlJvY21WemFHOXNaQ0E5SURRZ0tpQTVMamd4TzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1ZHaGxJSEp2ZEdGMGFXOXVJSEpoZEdVZ2JXOWtkV3hsTENCMWMyVmtJR2x1SUhSb1pTQmpZV3hqZFd4aGRHbHZiaUJ2WmlCMGFHVWdaVzVsY21kNUxseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIUm9hWE1nUlc1bGNtZDVUVzlrZFd4bFhHNGdJQ0FnSUNvZ1FIUjVjR1VnZTBSUFRVVjJaVzUwVTNWaWJXOWtkV3hsZlZ4dUlDQWdJQ0FxSUVCa1pXWmhkV3gwSUc1MWJHeGNiaUFnSUNBZ0tpQkFjMlZsSUVSbGRtbGpaVzF2ZEdsdmJrMXZaSFZzWlZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVgzSnZkR0YwYVc5dVVtRjBaVTF2WkhWc1pTQTlJRzUxYkd3N1hHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQk1ZWFJsYzNRZ2NtOTBZWFJwYjI0Z2NtRjBaU0IyWVd4MVpTQnpaVzUwSUdKNUlIUm9aU0J5YjNSaGRHbHZiaUJ5WVhSbElHMXZaSFZzWlM1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCMGFHbHpJRVZ1WlhKbmVVMXZaSFZzWlZ4dUlDQWdJQ0FxSUVCMGVYQmxJSHR1ZFcxaVpYSmJYWDFjYmlBZ0lDQWdLaUJBWkdWbVlYVnNkQ0J1ZFd4c1hHNGdJQ0FnSUNvdlhHNGdJQ0FnZEdocGN5NWZjbTkwWVhScGIyNVNZWFJsVm1Gc2RXVnpJRDBnYm5Wc2JEdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRTFoZUdsdGRXMGdkbUZzZFdVZ2NtVmhZMmhsWkNCaWVTQjBhR1VnY205MFlYUnBiMjRnY21GMFpTQnRZV2R1YVhSMVpHVXNJR05zYVhCd1pXUWdZWFFnWUhSb2FYTXVYM0p2ZEdGMGFXOXVVbUYwWlUxaFoyNXBkSFZrWlZSb2NtVnphRzlzWkdBdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWRHaHBjeUJGYm1WeVozbE5iMlIxYkdWY2JpQWdJQ0FnS2lCQWRIbHdaU0I3Ym5WdFltVnlmVnh1SUNBZ0lDQXFJRUJrWldaaGRXeDBJRFF3TUZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJvYVhNdVgzSnZkR0YwYVc5dVVtRjBaVTFoWjI1cGRIVmtaVU4xY25KbGJuUk5ZWGdnUFNBME1EQTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJEYkdsd2NHbHVaeUIyWVd4MVpTQnZaaUIwYUdVZ2NtOTBZWFJwYjI0Z2NtRjBaU0J0WVdkdWFYUjFaR1V1WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBZEdocGN5QkZibVZ5WjNsTmIyUjFiR1ZjYmlBZ0lDQWdLaUJBZEhsd1pTQjdiblZ0WW1WeWZWeHVJQ0FnSUNBcUlFQmtaV1poZFd4MElEWXdNRnh1SUNBZ0lDQXFJRUJqYjI1emRHRnVkRnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11WDNKdmRHRjBhVzl1VW1GMFpVMWhaMjVwZEhWa1pWUm9jbVZ6YUc5c1pDQTlJRFl3TUR0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGUnBiV1VnWTI5dWMzUmhiblFnS0doaGJHWXRiR2xtWlNrZ2IyWWdkR2hsSUd4dmR5MXdZWE56SUdacGJIUmxjaUIxYzJWa0lIUnZJSE50YjI5MGFDQjBhR1VnWlc1bGNtZDVJSFpoYkhWbGN5QW9hVzRnYzJWamIyNWtjeWt1WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBZEdocGN5QkZibVZ5WjNsTmIyUjFiR1ZjYmlBZ0lDQWdLaUJBZEhsd1pTQjdiblZ0WW1WeWZWeHVJQ0FnSUNBcUlFQmtaV1poZFd4MElEQXVNVnh1SUNBZ0lDQXFJRUJqYjI1emRHRnVkRnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUm9hWE11WDJWdVpYSm5lVlJwYldWRGIyNXpkR0Z1ZENBOUlEQXVNVHRjYmx4dUlDQWdJSFJvYVhNdVgyOXVRV05qWld4bGNtRjBhVzl1SUQwZ2RHaHBjeTVmYjI1QlkyTmxiR1Z5WVhScGIyNHVZbWx1WkNoMGFHbHpLVHRjYmlBZ0lDQjBhR2x6TGw5dmJsSnZkR0YwYVc5dVVtRjBaU0E5SUhSb2FYTXVYMjl1VW05MFlYUnBiMjVTWVhSbExtSnBibVFvZEdocGN5azdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUkdWallYa2dabUZqZEc5eUlHOW1JSFJvWlNCc2IzY3RjR0Z6Y3lCbWFXeDBaWElnZFhObFpDQjBieUJ6Ylc5dmRHZ2dkR2hsSUdWdVpYSm5lU0IyWVd4MVpYTXVYRzRnSUNBcVhHNGdJQ0FxSUVCMGVYQmxJSHR1ZFcxaVpYSjlYRzRnSUNBcUlFQnlaV0ZrYjI1c2VWeHVJQ0FnS2k5Y2JpQWdaMlYwSUY5bGJtVnlaM2xFWldOaGVTZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1RXRjBhQzVsZUhBb0xUSWdLaUJOWVhSb0xsQkpJQ29nZEdocGN5NXdaWEpwYjJRZ0x5QjBhR2x6TGw5bGJtVnlaM2xVYVcxbFEyOXVjM1JoYm5RcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWx1YVhScFlXeHBlbVZ6SUc5bUlIUm9aU0J0YjJSMWJHVXVYRzRnSUNBcVhHNGdJQ0FxSUVCeVpYUjFjbTRnZTFCeWIyMXBjMlY5WEc0Z0lDQXFMMXh1SUNCcGJtbDBLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQnpkWEJsY2k1cGJtbDBLQ2h5WlhOdmJIWmxLU0E5UGlCN1hHNGdJQ0FnSUNBdkx5QlVhR1VnWlc1bGNtZDVJRzF2WkhWc1pTQnlaWEYxYVhKbGN5QjBhR1VnWVdOalpXeGxjbUYwYVc5dUlHRnVaQ0IwYUdVZ2NtOTBZWFJwYjI0Z2NtRjBaU0J0YjJSMWJHVnpYRzRnSUNBZ0lDQlFjbTl0YVhObExtRnNiQ2hiYlc5MGFXOXVTVzV3ZFhRdWNtVnhkV2x5WlUxdlpIVnNaU2duWVdOalpXeGxjbUYwYVc5dUp5a3NJRzF2ZEdsdmJrbHVjSFYwTG5KbGNYVnBjbVZOYjJSMWJHVW9KM0p2ZEdGMGFXOXVVbUYwWlNjcFhTbGNiaUFnSUNBZ0lDQWdMblJvWlc0b0tHMXZaSFZzWlhNcElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JiWVdOalpXeGxjbUYwYVc5dUxDQnliM1JoZEdsdmJsSmhkR1ZkSUQwZ2JXOWtkV3hsY3p0Y2JseHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgyRmpZMlZzWlhKaGRHbHZiazF2WkhWc1pTQTlJR0ZqWTJWc1pYSmhkR2x2Ymp0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5eWIzUmhkR2x2YmxKaGRHVk5iMlIxYkdVZ1BTQnliM1JoZEdsdmJsSmhkR1U3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVwYzBOaGJHTjFiR0YwWldRZ1BTQjBhR2x6TGw5aFkyTmxiR1Z5WVhScGIyNU5iMlIxYkdVdWFYTldZV3hwWkNCOGZDQjBhR2x6TGw5eWIzUmhkR2x2YmxKaGRHVk5iMlIxYkdVdWFYTldZV3hwWkR0Y2JseHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbDloWTJObGJHVnlZWFJwYjI1TmIyUjFiR1V1YVhOV1lXeHBaQ2xjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11Y0dWeWFXOWtJRDBnZEdocGN5NWZZV05qWld4bGNtRjBhVzl1VFc5a2RXeGxMbkJsY21sdlpEdGNiaUFnSUNBZ0lDQWdJQ0JsYkhObElHbG1JQ2gwYUdsekxsOXliM1JoZEdsdmJsSmhkR1ZOYjJSMWJHVXVhWE5XWVd4cFpDbGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjR1Z5YVc5a0lEMGdkR2hwY3k1ZmNtOTBZWFJwYjI1U1lYUmxUVzlrZFd4bExuQmxjbWx2WkR0Y2JseHVJQ0FnSUNBZ0lDQWdJSEpsYzI5c2RtVW9kR2hwY3lrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnWVdSa1RHbHpkR1Z1WlhJb2JHbHpkR1Z1WlhJcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1c2FYTjBaVzVsY25NdWMybDZaU0E5UFQwZ01Da2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVYMkZqWTJWc1pYSmhkR2x2YmsxdlpIVnNaUzVwYzFaaGJHbGtLVnh1SUNBZ0lDQWdJQ0IwYUdsekxsOWhZMk5sYkdWeVlYUnBiMjVOYjJSMWJHVXVZV1JrVEdsemRHVnVaWElvZEdocGN5NWZiMjVCWTJObGJHVnlZWFJwYjI0cE8xeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVgzSnZkR0YwYVc5dVVtRjBaVTF2WkhWc1pTNXBjMVpoYkdsa0tWeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5eWIzUmhkR2x2YmxKaGRHVk5iMlIxYkdVdVlXUmtUR2x6ZEdWdVpYSW9kR2hwY3k1ZmIyNVNiM1JoZEdsdmJsSmhkR1VwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSE4xY0dWeUxtRmtaRXhwYzNSbGJtVnlLR3hwYzNSbGJtVnlLVHRjYmlBZ2ZWeHVYRzRnSUhKbGJXOTJaVXhwYzNSbGJtVnlLR3hwYzNSbGJtVnlLU0I3WEc0Z0lDQWdjM1Z3WlhJdWNtVnRiM1psVEdsemRHVnVaWElvYkdsemRHVnVaWElwTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11YkdsemRHVnVaWEp6TG5OcGVtVWdQVDA5SURBcElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxsOWhZMk5sYkdWeVlYUnBiMjVOYjJSMWJHVXVhWE5XWVd4cFpDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZllXTmpaV3hsY21GMGFXOXVUVzlrZFd4bExuSmxiVzkyWlV4cGMzUmxibVZ5S0hSb2FYTXVYMjl1UVdOalpXeGxjbUYwYVc5dUtUdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxsOXliM1JoZEdsdmJsSmhkR1ZOYjJSMWJHVXVhWE5XWVd4cFpDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmNtOTBZWFJwYjI1U1lYUmxUVzlrZFd4bExuSmxiVzkyWlV4cGMzUmxibVZ5S0hSb2FYTXVYMjl1VW05MFlYUnBiMjVTWVhSbEtUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRV05qWld4bGNtRjBhVzl1SUhaaGJIVmxjeUJvWVc1a2JHVnlMbHh1SUNBZ0tseHVJQ0FnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbHRkZlNCaFkyTmxiR1Z5WVhScGIyNGdMU0JNWVhSbGMzUWdZV05qWld4bGNtRjBhVzl1SUhaaGJIVmxMbHh1SUNBZ0tpOWNiaUFnWDI5dVFXTmpaV3hsY21GMGFXOXVLR0ZqWTJWc1pYSmhkR2x2YmlrZ2UxeHVJQ0FnSUhSb2FYTXVYMkZqWTJWc1pYSmhkR2x2YmxaaGJIVmxjeUE5SUdGalkyVnNaWEpoZEdsdmJqdGNibHh1SUNBZ0lDOHZJRWxtSUhSb1pTQnliM1JoZEdsdmJpQnlZWFJsSUhaaGJIVmxjeUJoY21VZ2JtOTBJR0YyWVdsc1lXSnNaU3dnZDJVZ1kyRnNZM1ZzWVhSbElIUm9aU0JsYm1WeVoza2djbWxuYUhRZ1lYZGhlUzVjYmlBZ0lDQnBaaUFvSVhSb2FYTXVYM0p2ZEdGMGFXOXVVbUYwWlUxdlpIVnNaUzVwYzFaaGJHbGtLVnh1SUNBZ0lDQWdkR2hwY3k1ZlkyRnNZM1ZzWVhSbFJXNWxjbWQ1S0NrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbTkwWVhScGIyNGdjbUYwWlNCMllXeDFaWE1nYUdGdVpHeGxjaTVjYmlBZ0lDcGNiaUFnSUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEpiWFgwZ2NtOTBZWFJwYjI1U1lYUmxJQzBnVEdGMFpYTjBJSEp2ZEdGMGFXOXVJSEpoZEdVZ2RtRnNkV1V1WEc0Z0lDQXFMMXh1SUNCZmIyNVNiM1JoZEdsdmJsSmhkR1VvY205MFlYUnBiMjVTWVhSbEtTQjdYRzRnSUNBZ2RHaHBjeTVmY205MFlYUnBiMjVTWVhSbFZtRnNkV1Z6SUQwZ2NtOTBZWFJwYjI1U1lYUmxPMXh1WEc0Z0lDQWdMeThnVjJVZ2EyNXZkeUIwYUdGMElIUm9aU0JoWTJObGJHVnlZWFJwYjI0Z1lXNWtJSEp2ZEdGMGFXOXVJSEpoZEdVZ2RtRnNkV1Z6SUdOdmJXbHVaeUJtY205dElIUm9aVnh1SUNBZ0lDOHZJSE5oYldVZ1lHUmxkbWxqWlcxdmRHbHZibUFnWlhabGJuUWdZWEpsSUhObGJuUWdhVzRnZEdoaGRDQnZjbVJsY2lBb1lXTmpaV3hsY21GMGFXOXVJRDRnY205MFlYUnBiMjRnY21GMFpTbGNiaUFnSUNBdkx5QnpieUIzYUdWdUlIUm9aU0J5YjNSaGRHbHZiaUJ5WVhSbElHbHpJSEJ5YjNacFpHVmtMQ0IzWlNCallXeGpkV3hoZEdVZ2RHaGxJR1Z1WlhKbmVTQjJZV3gxWlNCdlppQjBhR1ZjYmlBZ0lDQXZMeUJzWVhSbGMzUWdZR1JsZG1salpXMXZkR2x2Ym1BZ1pYWmxiblFnZDJobGJpQjNaU0J5WldObGFYWmxJSFJvWlNCeWIzUmhkR2x2YmlCeVlYUmxJSFpoYkhWbGN5NWNiaUFnSUNCMGFHbHpMbDlqWVd4amRXeGhkR1ZGYm1WeVoza29LVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCRmJtVnlaM2tnWTJGc1kzVnNZWFJwYjI0NklHVnRhWFJ6SUdGdUlHVnVaWEpuZVNCMllXeDFaU0JpWlhSM1pXVnVJREFnWVc1a0lERXVYRzRnSUNBcVhHNGdJQ0FxSUZSb2FYTWdiV1YwYUc5a0lHTm9aV05yY3lCcFppQjBhR1VnWVdOalpXeGxjbUYwYVc5dUlHMXZaSFZzWlhNZ2FYTWdkbUZzYVdRdUlFbG1JSFJvWVhRZ2FYTWdkR2hsSUdOaGMyVXNYRzRnSUNBcUlHbDBJR05oYkdOMWJHRjBaWE1nWVc0Z1pYTjBhVzFoZEdsdmJpQnZaaUIwYUdVZ1pXNWxjbWQ1SUNoaVpYUjNaV1Z1SURBZ1lXNWtJREVwSUdKaGMyVmtJRzl1SUhSb1pTQnlZWFJwYjF4dUlDQWdLaUJ2WmlCMGFHVWdZM1Z5Y21WdWRDQmhZMk5sYkdWeVlYUnBiMjRnYldGbmJtbDBkV1JsSUdGdVpDQjBhR1VnYldGNGFXMTFiU0JoWTJObGJHVnlZWFJwYjI0Z2JXRm5ibWwwZFdSbFhHNGdJQ0FxSUhKbFlXTm9aV1FnYzI4Z1ptRnlJQ2hqYkdsd2NHVmtJR0YwSUhSb1pTQmdkR2hwY3k1ZllXTmpaV3hsY21GMGFXOXVUV0ZuYm1sMGRXUmxWR2h5WlhOb2IyeGtZQ0IyWVd4MVpTa3VYRzRnSUNBcUlDaFhaU0IxYzJVZ2RHaHBjeUIwY21samF5QjBieUJuWlhRZ2RXNXBabTl5YlNCaVpXaGhkbWx2Y25NZ1lXMXZibWNnWkdWMmFXTmxjeTRnU1dZZ2QyVWdZMkZzWTNWc1lYUmxaRnh1SUNBZ0tpQjBhR1VnY21GMGFXOGdZbUZ6WldRZ2IyNGdZU0JtYVhobFpDQjJZV3gxWlNCcGJtUmxjR1Z1WkdWdWRDQnZaaUIzYUdGMElIUm9aU0JrWlhacFkyVWdhWE1nWTJGd1lXSnNaU0J2Wmx4dUlDQWdLaUJ3Y205MmFXUnBibWNzSUhkbElHTnZkV3hrSUdkbGRDQnBibU52Ym5OcGMzUmxiblFnWW1Wb1lYWnBiM0p6TGlCR2IzSWdhVzV6ZEdGdVkyVXNJSFJvWlNCa1pYWnBZMlZ6WEc0Z0lDQXFJSGRvYjNObElHRmpZMlZzWlhKdmJXVjBaWEp6SUdGeVpTQnNhVzFwZEdWa0lHRjBJREpuSUhkdmRXeGtJR0ZzZDJGNWN5QndjbTkyYVdSbElIWmxjbmtnYkc5M0lIWmhiSFZsYzF4dUlDQWdLaUJqYjIxd1lYSmxaQ0IwYnlCa1pYWnBZMlZ6SUhkcGRHZ2dZV05qWld4bGNtOXRaWFJsY25NZ1kyRndZV0pzWlNCdlppQnRaV0Z6ZFhKcGJtY2dOR2NnWVdOalpXeGxjbUYwYVc5dWN5NHBYRzRnSUNBcUlGUm9aU0J6WVcxbElHTm9aV05yY3lCaGJtUWdZMkZzWTNWc1lYUnBiMjV6SUdGeVpTQnRZV1JsSUc5dUlIUm9aU0J5YjNSaGRHbHZiaUJ5WVhSbElHMXZaSFZzWlM1Y2JpQWdJQ29nUm1sdVlXeHNlU3dnZEdobElHVnVaWEpuZVNCMllXeDFaU0JwY3lCMGFHVWdiV0Y0YVcxMWJTQmlaWFIzWldWdUlIUm9aU0JsYm1WeVoza2dkbUZzZFdVZ1pYTjBhVzFoZEdWa1hHNGdJQ0FxSUdaeWIyMGdkR2hsSUdGalkyVnNaWEpoZEdsdmJpd2dZVzVrSUhSb1pTQnZibVVnWlhOMGFXMWhkR1ZrSUdaeWIyMGdkR2hsSUhKdmRHRjBhVzl1SUhKaGRHVXVJRWwwSUdselhHNGdJQ0FxSUhOdGIyOTBhR1ZrSUhSb2NtOTFaMmdnWVNCc2IzY3RjR0Z6Y3lCbWFXeDBaWEl1WEc0Z0lDQXFMMXh1SUNCZlkyRnNZM1ZzWVhSbFJXNWxjbWQ1S0NrZ2UxeHVJQ0FnSUd4bGRDQmhZMk5sYkdWeVlYUnBiMjVGYm1WeVoza2dQU0F3TzF4dUlDQWdJR3hsZENCeWIzUmhkR2x2YmxKaGRHVkZibVZ5WjNrZ1BTQXdPMXh1WEc0Z0lDQWdMeThnUTJobFkyc2dkR2hsSUdGalkyVnNaWEpoZEdsdmJpQnRiMlIxYkdVZ1lXNWtJR05oYkdOMWJHRjBaU0JoYmlCbGMzUnBiV0YwYVc5dUlHOW1JSFJvWlNCbGJtVnlaM2tnZG1Gc2RXVWdabkp2YlNCMGFHVWdiR0YwWlhOMElHRmpZMlZzWlhKaGRHbHZiaUIyWVd4MVpWeHVJQ0FnSUdsbUlDaDBhR2x6TGw5aFkyTmxiR1Z5WVhScGIyNU5iMlIxYkdVdWFYTldZV3hwWkNrZ2UxeHVJQ0FnSUNBZ2JHVjBJR0ZZSUQwZ2RHaHBjeTVmWVdOalpXeGxjbUYwYVc5dVZtRnNkV1Z6V3pCZE8xeHVJQ0FnSUNBZ2JHVjBJR0ZaSUQwZ2RHaHBjeTVmWVdOalpXeGxjbUYwYVc5dVZtRnNkV1Z6V3pGZE8xeHVJQ0FnSUNBZ2JHVjBJR0ZhSUQwZ2RHaHBjeTVmWVdOalpXeGxjbUYwYVc5dVZtRnNkV1Z6V3pKZE8xeHVJQ0FnSUNBZ2JHVjBJR0ZqWTJWc1pYSmhkR2x2YmsxaFoyNXBkSFZrWlNBOUlFMWhkR2d1YzNGeWRDaGhXQ0FxSUdGWUlDc2dZVmtnS2lCaFdTQXJJR0ZhSUNvZ1lWb3BPMXh1WEc0Z0lDQWdJQ0F2THlCVGRHOXlaU0IwYUdVZ2JXRjRhVzExYlNCaFkyTmxiR1Z5WVhScGIyNGdiV0ZuYm1sMGRXUmxJSEpsWVdOb1pXUWdjMjhnWm1GeUxDQmpiR2x3Y0dWa0lHRjBJR0IwYUdsekxsOWhZMk5sYkdWeVlYUnBiMjVOWVdkdWFYUjFaR1ZVYUhKbGMyaHZiR1JnWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVmWVdOalpXeGxjbUYwYVc5dVRXRm5ibWwwZFdSbFEzVnljbVZ1ZEUxaGVDQThJR0ZqWTJWc1pYSmhkR2x2YmsxaFoyNXBkSFZrWlNsY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmWVdOalpXeGxjbUYwYVc5dVRXRm5ibWwwZFdSbFEzVnljbVZ1ZEUxaGVDQTlJRTFoZEdndWJXbHVLR0ZqWTJWc1pYSmhkR2x2YmsxaFoyNXBkSFZrWlN3Z2RHaHBjeTVmWVdOalpXeGxjbUYwYVc5dVRXRm5ibWwwZFdSbFZHaHlaWE5vYjJ4a0tUdGNiaUFnSUNBZ0lDOHZJRlJQUkU4b1B5azZJSEpsYlc5MlpTQnZkV3hwWlhKeklDMHRMU0J2YmlCemIyMWxJRUZ1WkhKdmFXUWdaR1YyYVdObGN5d2dkR2hsSUcxaFoyNXBkSFZrWlNCcGN5QjJaWEo1SUdocFoyZ2diMjRnWVNCbVpYY2dhWE52YkdGMFpXUWdaR0YwWVhCdmFXNTBjeXhjYmlBZ0lDQWdJQzh2SUhkb2FXTm9JRzFoYTJVZ2RHaGxJSFJvY21WemFHOXNaQ0IyWlhKNUlHaHBaMmdnWVhNZ2QyVnNiQ0E5UGlCMGFHVWdaVzVsY21kNUlISmxiV0ZwYm5NZ1lYSnZkVzVrSURBdU5Td2daWFpsYmlCM2FHVnVJSGx2ZFNCemFHRnJaU0IyWlhKNUlHaGhjbVF1WEc1Y2JpQWdJQ0FnSUdGalkyVnNaWEpoZEdsdmJrVnVaWEpuZVNBOUlFMWhkR2d1YldsdUtHRmpZMlZzWlhKaGRHbHZiazFoWjI1cGRIVmtaU0F2SUhSb2FYTXVYMkZqWTJWc1pYSmhkR2x2YmsxaFoyNXBkSFZrWlVOMWNuSmxiblJOWVhnc0lERXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJRU5vWldOcklIUm9aU0J5YjNSaGRHbHZiaUJ5WVhSbElHMXZaSFZzWlNCaGJtUWdZMkZzWTNWc1lYUmxJR0Z1SUdWemRHbHRZWFJwYjI0Z2IyWWdkR2hsSUdWdVpYSm5lU0IyWVd4MVpTQm1jbTl0SUhSb1pTQnNZWFJsYzNRZ2NtOTBZWFJwYjI0Z2NtRjBaU0IyWVd4MVpWeHVJQ0FnSUdsbUlDaDBhR2x6TGw5eWIzUmhkR2x2YmxKaGRHVk5iMlIxYkdVdWFYTldZV3hwWkNrZ2UxeHVJQ0FnSUNBZ2JHVjBJSEpCSUQwZ2RHaHBjeTVmY205MFlYUnBiMjVTWVhSbFZtRnNkV1Z6V3pCZE8xeHVJQ0FnSUNBZ2JHVjBJSEpDSUQwZ2RHaHBjeTVmY205MFlYUnBiMjVTWVhSbFZtRnNkV1Z6V3pGZE8xeHVJQ0FnSUNBZ2JHVjBJSEpISUQwZ2RHaHBjeTVmY205MFlYUnBiMjVTWVhSbFZtRnNkV1Z6V3pKZE8xeHVJQ0FnSUNBZ2JHVjBJSEp2ZEdGMGFXOXVVbUYwWlUxaFoyNXBkSFZrWlNBOUlFMWhkR2d1YzNGeWRDaHlRU0FxSUhKQklDc2dja0lnS2lCeVFpQXJJSEpISUNvZ2NrY3BPMXh1WEc0Z0lDQWdJQ0F2THlCVGRHOXlaU0IwYUdVZ2JXRjRhVzExYlNCeWIzUmhkR2x2YmlCeVlYUmxJRzFoWjI1cGRIVmtaU0J5WldGamFHVmtJSE52SUdaaGNpd2dZMnhwY0hCbFpDQmhkQ0JnZEdocGN5NWZjbTkwWVhScGIyNVNZWFJsVFdGbmJtbDBkV1JsVkdoeVpYTm9iMnhrWUZ4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11WDNKdmRHRjBhVzl1VW1GMFpVMWhaMjVwZEhWa1pVTjFjbkpsYm5STllYZ2dQQ0J5YjNSaGRHbHZibEpoZEdWTllXZHVhWFIxWkdVcFhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKdmRHRjBhVzl1VW1GMFpVMWhaMjVwZEhWa1pVTjFjbkpsYm5STllYZ2dQU0JOWVhSb0xtMXBiaWh5YjNSaGRHbHZibEpoZEdWTllXZHVhWFIxWkdVc0lIUm9hWE11WDNKdmRHRjBhVzl1VW1GMFpVMWhaMjVwZEhWa1pWUm9jbVZ6YUc5c1pDazdYRzVjYmlBZ0lDQWdJSEp2ZEdGMGFXOXVVbUYwWlVWdVpYSm5lU0E5SUUxaGRHZ3ViV2x1S0hKdmRHRjBhVzl1VW1GMFpVMWhaMjVwZEhWa1pTQXZJSFJvYVhNdVgzSnZkR0YwYVc5dVVtRjBaVTFoWjI1cGRIVmtaVU4xY25KbGJuUk5ZWGdzSURFcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUd4bGRDQmxibVZ5WjNrZ1BTQk5ZWFJvTG0xaGVDaGhZMk5sYkdWeVlYUnBiMjVGYm1WeVoza3NJSEp2ZEdGMGFXOXVVbUYwWlVWdVpYSm5lU2s3WEc1Y2JpQWdJQ0F2THlCTWIzY3RjR0Z6Y3lCbWFXeDBaWElnZEc4Z2MyMXZiM1JvSUhSb1pTQmxibVZ5WjNrZ2RtRnNkV1Z6WEc0Z0lDQWdZMjl1YzNRZ2F5QTlJSFJvYVhNdVgyVnVaWEpuZVVSbFkyRjVPMXh1SUNBZ0lIUm9hWE11WlhabGJuUWdQU0JySUNvZ2RHaHBjeTVsZG1WdWRDQXJJQ2d4SUMwZ2F5a2dLaUJsYm1WeVozazdYRzVjYmlBZ0lDQXZMeUJGYldsMElIUm9aU0JsYm1WeVoza2dkbUZzZFdWY2JpQWdJQ0IwYUdsekxtVnRhWFFvZEdocGN5NWxkbVZ1ZENrN1hHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2JtVjNJRVZ1WlhKbmVVMXZaSFZzWlNncE8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX01vdGlvbklucHV0ID0gcmVxdWlyZSgnLi9Nb3Rpb25JbnB1dCcpO1xuXG52YXIgX01vdGlvbklucHV0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX01vdGlvbklucHV0KTtcblxudmFyIF9EZXZpY2VPcmllbnRhdGlvbk1vZHVsZSA9IHJlcXVpcmUoJy4vRGV2aWNlT3JpZW50YXRpb25Nb2R1bGUnKTtcblxudmFyIF9EZXZpY2VPcmllbnRhdGlvbk1vZHVsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9EZXZpY2VPcmllbnRhdGlvbk1vZHVsZSk7XG5cbnZhciBfRGV2aWNlTW90aW9uTW9kdWxlID0gcmVxdWlyZSgnLi9EZXZpY2VNb3Rpb25Nb2R1bGUnKTtcblxudmFyIF9EZXZpY2VNb3Rpb25Nb2R1bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRGV2aWNlTW90aW9uTW9kdWxlKTtcblxudmFyIF9FbmVyZ3lNb2R1bGUgPSByZXF1aXJlKCcuL0VuZXJneU1vZHVsZScpO1xuXG52YXIgX0VuZXJneU1vZHVsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9FbmVyZ3lNb2R1bGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIFRoZSBtb3Rpb24gaW5wdXQgbW9kdWxlIGNhbiBiZSB1c2VkIGFzIGZvbGxvd3NcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ21vdGlvbi1pbnB1dCc7XG4gKiBjb25zdCByZXF1aXJlZEV2ZW50cyA9IDtcbiAqXG4gKiBtb3Rpb25JbnB1dFxuICogIC5pbml0KFsnYWNjZWxlcmF0aW9uJywgJ29yaWVudGF0aW9uJywgJ2VuZXJneSddKVxuICogIC50aGVuKChbYWNjZWxlcmF0aW9uLCBvcmllbnRhdGlvbiwgZW5lcmd5XSkgPT4ge1xuICogICAgaWYgKGFjY2VsZXJhdGlvbi5pc1ZhbGlkKSB7XG4gKiAgICAgIGFjY2VsZXJhdGlvbi5hZGRMaXN0ZW5lcigoZGF0YSkgPT4ge1xuICogICAgICAgIGNvbnNvbGUubG9nKCdhY2NlbGVyYXRpb24nLCBkYXRhKTtcbiAqICAgICAgICAvLyBkbyBzb21ldGhpbmcgd2l0aCB0aGUgYWNjZWxlcmF0aW9uIHZhbHVlc1xuICogICAgICB9KTtcbiAqICAgIH1cbiAqXG4gKiAgICAvLyAuLi5cbiAqICB9KTtcbiAqL1xuX01vdGlvbklucHV0Mi5kZWZhdWx0LmFkZE1vZHVsZSgnZGV2aWNlbW90aW9uJywgX0RldmljZU1vdGlvbk1vZHVsZTIuZGVmYXVsdCk7XG5fTW90aW9uSW5wdXQyLmRlZmF1bHQuYWRkTW9kdWxlKCdkZXZpY2VvcmllbnRhdGlvbicsIF9EZXZpY2VPcmllbnRhdGlvbk1vZHVsZTIuZGVmYXVsdCk7XG5fTW90aW9uSW5wdXQyLmRlZmF1bHQuYWRkTW9kdWxlKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgX0RldmljZU1vdGlvbk1vZHVsZTIuZGVmYXVsdC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KTtcbl9Nb3Rpb25JbnB1dDIuZGVmYXVsdC5hZGRNb2R1bGUoJ2FjY2VsZXJhdGlvbicsIF9EZXZpY2VNb3Rpb25Nb2R1bGUyLmRlZmF1bHQuYWNjZWxlcmF0aW9uKTtcbl9Nb3Rpb25JbnB1dDIuZGVmYXVsdC5hZGRNb2R1bGUoJ3JvdGF0aW9uUmF0ZScsIF9EZXZpY2VNb3Rpb25Nb2R1bGUyLmRlZmF1bHQucm90YXRpb25SYXRlKTtcbl9Nb3Rpb25JbnB1dDIuZGVmYXVsdC5hZGRNb2R1bGUoJ29yaWVudGF0aW9uJywgX0RldmljZU9yaWVudGF0aW9uTW9kdWxlMi5kZWZhdWx0Lm9yaWVudGF0aW9uKTtcbl9Nb3Rpb25JbnB1dDIuZGVmYXVsdC5hZGRNb2R1bGUoJ29yaWVudGF0aW9uQWx0JywgX0RldmljZU9yaWVudGF0aW9uTW9kdWxlMi5kZWZhdWx0Lm9yaWVudGF0aW9uQWx0KTtcbl9Nb3Rpb25JbnB1dDIuZGVmYXVsdC5hZGRNb2R1bGUoJ2VuZXJneScsIF9FbmVyZ3lNb2R1bGUyLmRlZmF1bHQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBfTW90aW9uSW5wdXQyLmRlZmF1bHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbWx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1Ga1pFMXZaSFZzWlNJc0ltRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIa2lMQ0poWTJObGJHVnlZWFJwYjI0aUxDSnliM1JoZEdsdmJsSmhkR1VpTENKdmNtbGxiblJoZEdsdmJpSXNJbTl5YVdWdWRHRjBhVzl1UVd4MElsMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdRVUZ2UWtFN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN096dEJRWFpDUVRzN096czdPenM3T3pzN096czdPenM3T3pzN1FVRjVRa0VzYzBKQlFWbEJMRk5CUVZvc1EwRkJjMElzWTBGQmRFSTdRVUZEUVN4elFrRkJXVUVzVTBGQldpeERRVUZ6UWl4dFFrRkJkRUk3UVVGRFFTeHpRa0ZCV1VFc1UwRkJXaXhEUVVGelFpdzRRa0ZCZEVJc1JVRkJjMFFzTmtKQlFXMUNReXcwUWtGQmVrVTdRVUZEUVN4elFrRkJXVVFzVTBGQldpeERRVUZ6UWl4alFVRjBRaXhGUVVGelF5dzJRa0ZCYlVKRkxGbEJRWHBFTzBGQlEwRXNjMEpCUVZsR0xGTkJRVm9zUTBGQmMwSXNZMEZCZEVJc1JVRkJjME1zTmtKQlFXMUNSeXhaUVVGNlJEdEJRVU5CTEhOQ1FVRlpTQ3hUUVVGYUxFTkJRWE5DTEdGQlFYUkNMRVZCUVhGRExHdERRVUYzUWtrc1YwRkJOMFE3UVVGRFFTeHpRa0ZCV1Vvc1UwRkJXaXhEUVVGelFpeG5Ra0ZCZEVJc1JVRkJkME1zYTBOQlFYZENTeXhqUVVGb1JUdEJRVU5CTEhOQ1FVRlpUQ3hUUVVGYUxFTkJRWE5DTEZGQlFYUkNJaXdpWm1sc1pTSTZJbWx1WkdWNExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJVYUdVZ2JXOTBhVzl1SUdsdWNIVjBJRzF2WkhWc1pTQmpZVzRnWW1VZ2RYTmxaQ0JoY3lCbWIyeHNiM2R6WEc0Z0tseHVJQ29nUUdWNFlXMXdiR1ZjYmlBcUlHbHRjRzl5ZENCdGIzUnBiMjVKYm5CMWRDQm1jbTl0SUNkdGIzUnBiMjR0YVc1d2RYUW5PMXh1SUNvZ1kyOXVjM1FnY21WeGRXbHlaV1JGZG1WdWRITWdQU0E3WEc0Z0tseHVJQ29nYlc5MGFXOXVTVzV3ZFhSY2JpQXFJQ0F1YVc1cGRDaGJKMkZqWTJWc1pYSmhkR2x2Ymljc0lDZHZjbWxsYm5SaGRHbHZiaWNzSUNkbGJtVnlaM2tuWFNsY2JpQXFJQ0F1ZEdobGJpZ29XMkZqWTJWc1pYSmhkR2x2Yml3Z2IzSnBaVzUwWVhScGIyNHNJR1Z1WlhKbmVWMHBJRDArSUh0Y2JpQXFJQ0FnSUdsbUlDaGhZMk5sYkdWeVlYUnBiMjR1YVhOV1lXeHBaQ2tnZTF4dUlDb2dJQ0FnSUNCaFkyTmxiR1Z5WVhScGIyNHVZV1JrVEdsemRHVnVaWElvS0dSaGRHRXBJRDArSUh0Y2JpQXFJQ0FnSUNBZ0lDQmpiMjV6YjJ4bExteHZaeWduWVdOalpXeGxjbUYwYVc5dUp5d2daR0YwWVNrN1hHNGdLaUFnSUNBZ0lDQWdMeThnWkc4Z2MyOXRaWFJvYVc1bklIZHBkR2dnZEdobElHRmpZMlZzWlhKaGRHbHZiaUIyWVd4MVpYTmNiaUFxSUNBZ0lDQWdmU2s3WEc0Z0tpQWdJQ0I5WEc0Z0tseHVJQ29nSUNBZ0x5OGdMaTR1WEc0Z0tpQWdmU2s3WEc0Z0tpOWNibWx0Y0c5eWRDQnRiM1JwYjI1SmJuQjFkQ0JtY205dElDY3VMMDF2ZEdsdmJrbHVjSFYwSnp0Y2JtbHRjRzl5ZENCa1pYWnBZMlZ2Y21sbGJuUmhkR2x2YmsxdlpIVnNaU0JtY205dElDY3VMMFJsZG1salpVOXlhV1Z1ZEdGMGFXOXVUVzlrZFd4bEp6dGNibWx0Y0c5eWRDQmtaWFpwWTJWdGIzUnBiMjVOYjJSMWJHVWdabkp2YlNBbkxpOUVaWFpwWTJWTmIzUnBiMjVOYjJSMWJHVW5PMXh1YVcxd2IzSjBJR1Z1WlhKbmVTQm1jbTl0SUNjdUwwVnVaWEpuZVUxdlpIVnNaU2M3WEc1Y2JtMXZkR2x2YmtsdWNIVjBMbUZrWkUxdlpIVnNaU2duWkdWMmFXTmxiVzkwYVc5dUp5d2daR1YyYVdObGJXOTBhVzl1VFc5a2RXeGxLVHRjYm0xdmRHbHZia2x1Y0hWMExtRmtaRTF2WkhWc1pTZ25aR1YyYVdObGIzSnBaVzUwWVhScGIyNG5MQ0JrWlhacFkyVnZjbWxsYm5SaGRHbHZiazF2WkhWc1pTazdYRzV0YjNScGIyNUpibkIxZEM1aFpHUk5iMlIxYkdVb0oyRmpZMlZzWlhKaGRHbHZia2x1WTJ4MVpHbHVaMGR5WVhacGRIa25MQ0JrWlhacFkyVnRiM1JwYjI1TmIyUjFiR1V1WVdOalpXeGxjbUYwYVc5dVNXNWpiSFZrYVc1blIzSmhkbWwwZVNrN1hHNXRiM1JwYjI1SmJuQjFkQzVoWkdSTmIyUjFiR1VvSjJGalkyVnNaWEpoZEdsdmJpY3NJR1JsZG1salpXMXZkR2x2YmsxdlpIVnNaUzVoWTJObGJHVnlZWFJwYjI0cE8xeHViVzkwYVc5dVNXNXdkWFF1WVdSa1RXOWtkV3hsS0NkeWIzUmhkR2x2YmxKaGRHVW5MQ0JrWlhacFkyVnRiM1JwYjI1TmIyUjFiR1V1Y205MFlYUnBiMjVTWVhSbEtUdGNibTF2ZEdsdmJrbHVjSFYwTG1Ga1pFMXZaSFZzWlNnbmIzSnBaVzUwWVhScGIyNG5MQ0JrWlhacFkyVnZjbWxsYm5SaGRHbHZiazF2WkhWc1pTNXZjbWxsYm5SaGRHbHZiaWs3WEc1dGIzUnBiMjVKYm5CMWRDNWhaR1JOYjJSMWJHVW9KMjl5YVdWdWRHRjBhVzl1UVd4MEp5d2daR1YyYVdObGIzSnBaVzUwWVhScGIyNU5iMlIxYkdVdWIzSnBaVzUwWVhScGIyNUJiSFFwTzF4dWJXOTBhVzl1U1c1d2RYUXVZV1JrVFc5a2RXeGxLQ2RsYm1WeVoza25MQ0JsYm1WeVoza3BPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0J0YjNScGIyNUpibkIxZER0Y2JpSmRmUT09IiwiaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ21vdGlvbi1pbnB1dCc7XG5cbmZ1bmN0aW9uIHNldHVwT3ZlcmxheShpZCwgaGFzQnV0dG9uID0gdHJ1ZSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHtpZH0tb3ZlcmxheWApO1xuICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuXG4gICAgaWYgKGNhbGxiYWNrKVxuICAgICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgaWYgKGhhc0J1dHRvbikge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2lkfS1idXR0b25gKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ29wZW4nKSk7XG4gIH0gZWxzZSB7XG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gIH1cblxuICByZXR1cm4gb3ZlcmxheTtcbn1cblxuZnVuY3Rpb24gc2V0dXBNb3Rpb25JbnB1dChtb2R1bGVOYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVqZWN0KCdjYW5ub3QgZmluZCBhbnkgbW90aW9uIHNlbnNvcnMnKTtcbiAgICB9LCA1MDApXG5cbiAgICBjb25zdCBpbml0TW90aW9uSW5wdXQgPSAoKSA9PiB7XG4gICAgICBtb3Rpb25JbnB1dC5pbml0KG1vZHVsZU5hbWUpXG4gICAgICAgIC50aGVuKChtb2R1bGVzKSA9PiB7XG4gICAgICAgICAgY29uc3QgW21vdGlvbk1vZHVsZV0gPSBtb2R1bGVzO1xuXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG4gICAgICAgICAgaWYgKG1vdGlvbk1vZHVsZSAmJiBtb3Rpb25Nb2R1bGUuaXNWYWxpZClcbiAgICAgICAgICAgIHJlc29sdmUobW90aW9uTW9kdWxlKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZWplY3QoJ2Nhbm5vdCBnZXQgcmVxdWVzdGVkIG1vdGlvbiBzZW5zb3Igc3RyZWFtJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIERldmljZU1vdGlvbkV2ZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgRGV2aWNlTW90aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuICAgICAgRGV2aWNlTW90aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKVxuICAgICAgICAudGhlbihmdW5jdGlvbihwZXJtaXNzaW9uU3RhdGUpIHtcbiAgICAgICAgICBpZiAocGVybWlzc2lvblN0YXRlID09PSAnZ3JhbnRlZCcpIHtcbiAgICAgICAgICAgIGluaXRNb3Rpb25JbnB1dCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICByZWplY3QoJ2FjY2VzcyB0byBtb3Rpb24gc2Vuc29ycyBkZW5pZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKChlKSA9PiByZWplY3QoJ2Nhbm5vdCBhY2Nlc3MgbW90aW9uIHNlbnNvcnMnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXRNb3Rpb25JbnB1dCgpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc3VtZUF1ZGlvQ29udGV4dChhdWRpb0NvbnRleHQpIHtcbiAgaWYgKGF1ZGlvQ29udGV4dCkge1xuICAgIGlmIChhdWRpb0NvbnRleHQuc3RhdGUgPT09ICdzdXNwZW5kZWQnKSB7XG4gICAgICByZXR1cm4gYXVkaW9Db250ZXh0LnJlc3VtZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnYXVkaW8gdW5hdmFpbGFibGUnKTtcbiAgfVxufVxuXG5leHBvcnQgeyBzZXR1cE92ZXJsYXksIHNldHVwTW90aW9uSW5wdXQsIHJlc3VtZUF1ZGlvQ29udGV4dCB9O1xuIiwiaW1wb3J0IHsgc2V0dXBPdmVybGF5IH0gZnJvbSAnLi91dGlscy9oZWxwZXJzJztcblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgc2V0dXBPdmVybGF5KCdoZWxwJyk7XG4gIHNldHVwT3ZlcmxheSgnaW5mbycpO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG1haW4pO1xuIl0sIm5hbWVzIjpbIlByb21pc2UiLCJldmVudCIsImxpc3RlbmVycyIsIm9iamVjdFR5cGVzIiwicm9vdCIsIndpbmRvdyIsIm9sZFJvb3QiLCJmcmVlRXhwb3J0cyIsImV4cG9ydHMiLCJmcmVlTW9kdWxlIiwibW9kdWxlIiwibm9kZVR5cGUiLCJmcmVlR2xvYmFsIiwiZ2xvYmFsIiwic2VsZiIsIm1heFNhZmVJbnRlZ2VyIiwiTWF0aCIsInBvdyIsInJlT3BlcmEiLCJ0aGlzQmluZGluZyIsIm9iamVjdFByb3RvIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJ0b1N0cmluZyIsImNhcGl0YWxpemUiLCJzdHJpbmciLCJTdHJpbmciLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiY2xlYW51cE9TIiwib3MiLCJwYXR0ZXJuIiwibGFiZWwiLCJkYXRhIiwidGVzdCIsImV4ZWMiLCJyZXBsYWNlIiwiUmVnRXhwIiwiZm9ybWF0Iiwic3BsaXQiLCJlYWNoIiwib2JqZWN0IiwiY2FsbGJhY2siLCJpbmRleCIsImxlbmd0aCIsImZvck93biIsInRyaW0iLCJrZXkiLCJjYWxsIiwiZ2V0Q2xhc3NPZiIsInZhbHVlIiwiaXNIb3N0VHlwZSIsInByb3BlcnR5IiwidHlwZSIsInF1YWxpZnkiLCJyZWR1Y2UiLCJhcnJheSIsImFjY3VtdWxhdG9yIiwicGFyc2UiLCJ1YSIsImNvbnRleHQiLCJpc0N1c3RvbUNvbnRleHQiLCJuYXYiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJpc01vZHVsZVNjb3BlIiwibGlrZUNocm9tZSIsIm9iamVjdENsYXNzIiwiYWlyUnVudGltZUNsYXNzIiwiZW52aXJvQ2xhc3MiLCJqYXZhQ2xhc3MiLCJqYXZhIiwicGhhbnRvbUNsYXNzIiwicmhpbm8iLCJlbnZpcm9ubWVudCIsImFscGhhIiwiYmV0YSIsImRvYyIsImRvY3VtZW50Iiwib3BlcmEiLCJvcGVyYW1pbmkiLCJvcGVyYUNsYXNzIiwiYXJjaCIsImRlc2NyaXB0aW9uIiwicHJlcmVsZWFzZSIsInVzZUZlYXR1cmVzIiwidmVyc2lvbiIsImlzU3BlY2lhbENhc2VkT1MiLCJsYXlvdXQiLCJnZXRMYXlvdXQiLCJuYW1lIiwiZ2V0TmFtZSIsInByb2R1Y3QiLCJnZXRQcm9kdWN0IiwibWFudWZhY3R1cmVyIiwiZ2V0TWFudWZhY3R1cmVyIiwiZ2V0T1MiLCJndWVzc2VzIiwicmVzdWx0IiwiZ3Vlc3MiLCJnZXRWZXJzaW9uIiwicGF0dGVybnMiLCJ0b1N0cmluZ1BsYXRmb3JtIiwicHVzaCIsInVuc2hpZnQiLCJpbmRleE9mIiwicGFyc2VGbG9hdCIsImxhbmciLCJTeXN0ZW0iLCJnZXRQcm9wZXJ0eSIsInN5c3RlbSIsInJlcXVpcmUiLCJqb2luIiwiZSIsInByb2Nlc3MiLCJicm93c2VyIiwidmVyc2lvbnMiLCJlbGVjdHJvbiIsIm5vZGUiLCJudyIsInBsYXRmb3JtIiwicnVudGltZSIsImZsYXNoIiwiQ2FwYWJpbGl0aWVzIiwicGhhbnRvbSIsIm1ham9yIiwibWlub3IiLCJwYXRjaCIsImRvY3VtZW50TW9kZSIsInRvRml4ZWQiLCJhcHBNaW5vclZlcnNpb24iLCJleHRlcm5hbCIsInBhcnNlSW50IiwiZmFtaWx5IiwiYXJjaGl0ZWN0dXJlIiwiY3B1Q2xhc3MiLCJ0aGlzIiwiZ2FtbWEiLCJyYWRUb0RlZyIsImV1bGVyQW5nbGUiLCJvcmllbnRhdGlvbiIsInJhd1ZhbHVlc1Byb3ZpZGVkIiwib3V0RXZlbnQiLCJhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IiwiYWxwaGFJc1ZhbGlkIiwiRGV2aWNlTW90aW9uRXZlbnQiLCJjb21tb25qc0hlbHBlcnMuY3JlYXRlQ29tbW9uanNNb2R1bGUiLCJzZXR1cE92ZXJsYXkiLCJpZCIsImhhc0J1dHRvbiIsIm92ZXJsYXkiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJi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Ozs7Ozs7Ozs7Ozs7OztFQW9DQSxVQUFBLFdBQUEsS0FBQSxhQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0NFLE1BQUEsR0FBQSxFQUFBO0VBQ0EsTUFBQSxLQUFBLEVBQUEsK0JBQUEsRUFBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnR0EsY0FBSSx1QkFBQSxHQUFKLENBQUE7Ozs7OztFQWFFLGdCQUFJQyxLQUFKLGdCQUFJQSxFQUFBQSxPQUFBQSx1QkFBSixpQ0FBQTs7Ozs7O0VBUUEsY0FBQSxxQkFBQSxDQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxFQUFBLHdCQUFBLEdBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxLQUFBLGdCQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxJQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBLEVBQUEsd0JBQUEsR0FBQSxDQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBb0VFQyxNQUFBQSxHQUFBQSxFQUFBQTs7OztpQkFBQUEsS0FBQUEsa0JBQUFBLENBQUFBLFNBQUFBLENBQUFBLFNBQUFBLElBQUFBLE1BQUFBLENBQUFBLGNBQUFBLENBQUFBLGtCQUFBQSxDQUFBQSxTQUFBQSxHQUFBQSxRQUFBQSxLQUFBQSxDQUFBQSxJQUFBQSxDQUFBQSxJQUFBQSxFQUFBQSxVQUFBQSxPQUFBQSxFQUFBQTs7OztFQVVELFlBQUEsTUFBQSxDQUFBLGdCQUFBLEdBQUEsTUFBQSxDQUFBLGtCQUFBOzs7OztFQUtELGtCQUFBLE1BQUEsQ0FBQSxnQkFBQSxDQUFBLGNBQUEsRUFBQSxNQUFBLENBQUEsUUFBQTs7RUFFQSxpQkFBQSxNQUFBLE9BQUEs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
