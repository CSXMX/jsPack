
      (function(modules) {
        var cachedModules = {};
        function require(moduleId) {
          if (cachedModules[moduleId]) return cachedModules[moduleId].exports;
          const [fn, map] = modules[moduleId]
          const module = cachedModules[moduleId] = {exports: {}}
          fn((name)=>require(map[name]), module, module.exports)
          return module.exports
        }
        require('src/entry.js')
      })({'src/entry.js': [
        function(require, module, exports) {
          "use strict";

var _ = require("./3.js");

var _2 = require("./1.js");

var _3 = require("./2.js");

(0, _.print)();
console.log('城');
console.log(_2.msg1, _3.msg2, _.msg3);
        },
        {"./3.js":"src/3.js","./1.js":"src/1.js","./2.js":"src/2.js"},
      ],'src/3.js': [
        function(require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.msg3 = void 0;
exports.print = print;

var _ = require("./1.js");

function print() {
  console.log('同');
}

console.log(_.xunhuan1);
var msg3 = "同城";
exports.msg3 = msg3;
        },
        {"./1.js":"src/1.js"},
      ],'src/1.js': [
        function(require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xunhuan1 = exports.msg1 = void 0;

var _ = require("./2.js");

console.log('5');
console.log(_.xunhuan2);
var msg1 = "hello";
exports.msg1 = msg1;
var xunhuan1 = "1";
exports.xunhuan1 = xunhuan1;
        },
        {"./2.js":"src/2.js"},
      ],'src/2.js': [
        function(require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xunhuan2 = exports.msg2 = void 0;

var _ = require("./1.js");

console.log(_.xunhuan1);
console.log('8');
var xunhuan2 = "2";
exports.xunhuan2 = xunhuan2;
var msg2 = ",58";
exports.msg2 = msg2;
        },
        {"./1.js":"src/1.js"},
      ],})
    