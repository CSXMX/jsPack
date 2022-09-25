(function (modules) {
  function require(moduleId) {
    const [fn, map] = modules[moduleId]

    function localRequire(name) {
      return require(map[name])
    }
    const module = {
      exports: {}
    }
    fn(localRequire, module, module.exports)
    return module.exports
  }
  require('src/entry.js')
})({
  'src/entry.js': [
    function (require, module, exports) {
      "use strict";

      var _ = require("./3.js");

      var _2 = require("./1.js");

      var _3 = require("./2.js");

      (0, _.print)();
      console.log('城');
      console.log(_2.msg1, _3.msg2, _2.msg1);
    },
    {
      "./3.js": "src/3.js",
      "./1.js": "src/1.js",
      "./2.js": "src/2.js"
    },
  ],
  'src/3.js': [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.msg3 = void 0;
      exports.print = print;

      function print() {
        console.log('同');
      }

      var msg3 = "同城";
      exports.msg3 = msg3;
    },
    undefined,
  ],
  'src/1.js': [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.msg1 = void 0;
      console.log('5');
      var msg1 = "hello";
      exports.msg1 = msg1;
    },
    undefined,
  ],
  'src/2.js': [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.msg2 = void 0;
      console.log('8');
      var msg2 = ",58";
      exports.msg2 = msg2;
    },
    undefined,
  ],
})