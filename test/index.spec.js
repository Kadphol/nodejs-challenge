'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { before, after, beforeEach, afterEach, describe, it } = exports.lab = Lab.script();
const { init, start } = require('../src/server');

global.expect = expect;
global.it = it;
global.describe = describe;
global.before = before;
global.after = after;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.init = init;
global.start = start;