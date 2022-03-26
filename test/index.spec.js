'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { beforeEach, afterEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../src/server');

global.expect = expect;
global.it = it;
global.describe = describe;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.init = init;