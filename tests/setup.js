// setup.js
import { config } from '@vue/test-utils';

// 屏蔽所有 Vue 的警告
config.warnHandler = () => {};
config.errorHandler = () => {};

// 屏蔽所有 console.warn
global.console.warn = jest.fn();
global.console.log = jest.fn();
global.console.error = jest.fn();