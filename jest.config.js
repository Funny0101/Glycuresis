module.exports = {
  // 保留现有的 preset 配置
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',

  // 指定测试文件的匹配模式
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

  // 指定需要生成覆盖率报告的文件目录
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx,vue}', '!src/**/*.d.ts'],

  // 覆盖率报告的输出目录
  coverageDirectory: 'coverage',

  // 配置报告的输出格式
  coverageReporters: ['json', 'lcov', 'text', 'text-summary', 'clover'],

  // 指定测试环境
  testEnvironment: 'jsdom',

  // 配置忽略的文件或目录
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // 配置测试初始化文件
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // 配置覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // 指定需要在测试过程中收集覆盖率的文件类型
  coverageProvider: 'v8',

  // 配置测试报告生成器
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: '<rootDir>/tests/html-report',
      filename: 'report.html',
      expand: true,
    }],
  ],
};
