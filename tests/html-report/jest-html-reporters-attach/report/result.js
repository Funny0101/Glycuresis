window.jest_html_reporters_callback__({"numFailedTestSuites":1,"numFailedTests":1,"numPassedTestSuites":0,"numPassedTests":4,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":0,"numTodoTests":0,"numTotalTestSuites":1,"numTotalTests":5,"startTime":1718456824018,"success":false,"testResults":[{"numFailingTests":1,"numPassingTests":4,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1718456826138,"runtime":805,"slow":false,"start":1718456825333},"testFilePath":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\tests\\unit\\BloodSugarChart.spec.js","failureMessage":"\u001b[1m\u001b[31m  \u001b[1m● \u001b[22m\u001b[1mBloodSugarChart.vue › should fetch and update blood sugar data correctly\u001b[39m\u001b[22m\n\n    \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoEqual\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // deep equality\u001b[22m\n\n    \u001b[32m- Expected  - 5\u001b[39m\n    \u001b[31m+ Received  + 1\u001b[39m\n\n    \u001b[32m- Array [\u001b[39m\n    \u001b[32m-   \"2023-12-16 15:30:30\",\u001b[39m\n    \u001b[32m-   \"2023-12-16 16:30:30\",\u001b[39m\n    \u001b[32m-   \"2023-12-16 17:30:30\",\u001b[39m\n    \u001b[32m- ]\u001b[39m\n    \u001b[31m+ Array []\u001b[39m\n\u001b[2m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 169 |\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 170 |\u001b[39m         \u001b[90m// 验证 xData 和 yData 是否正确更新\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[2m\u001b[39m\u001b[90m 171 |\u001b[39m         expect(wrapper\u001b[33m.\u001b[39mvm\u001b[33m.\u001b[39mxData)\u001b[33m.\u001b[39mtoEqual([\u001b[32m'2023-12-16 15:30:30'\u001b[39m\u001b[33m,\u001b[39m \u001b[32m'2023-12-16 16:30:30'\u001b[39m\u001b[33m,\u001b[39m \u001b[32m'2023-12-16 17:30:30'\u001b[39m])\u001b[33m;\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m     |\u001b[39m                                  \u001b[31m\u001b[1m^\u001b[22m\u001b[2m\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 172 |\u001b[39m         expect(wrapper\u001b[33m.\u001b[39mvm\u001b[33m.\u001b[39myData)\u001b[33m.\u001b[39mtoEqual([\u001b[35m15.3\u001b[39m\u001b[33m,\u001b[39m \u001b[35m12.5\u001b[39m\u001b[33m,\u001b[39m \u001b[35m14.8\u001b[39m])\u001b[33m;\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 173 |\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 174 |\u001b[39m         \u001b[90m// 验证图表设置是否正确调用\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Object.<anonymous> (\u001b[22m\u001b[2m\u001b[0m\u001b[36mtests/unit/BloodSugarChart.spec.js\u001b[39m\u001b[0m\u001b[2m:171:34)\u001b[22m\u001b[2m\u001b[22m\n","testResults":[{"ancestorTitles":["BloodSugarChart.vue"],"duration":33,"failureMessages":[],"fullName":"BloodSugarChart.vue should render BloodSugarChart component","status":"passed","title":"should render BloodSugarChart component"},{"ancestorTitles":["BloodSugarChart.vue"],"duration":11,"failureMessages":[],"fullName":"BloodSugarChart.vue should fetch records when mounted","status":"passed","title":"should fetch records when mounted"},{"ancestorTitles":["BloodSugarChart.vue"],"duration":13,"failureMessages":[],"fullName":"BloodSugarChart.vue should format startDateTime correctly","status":"passed","title":"should format startDateTime correctly"},{"ancestorTitles":["BloodSugarChart.vue"],"duration":8,"failureMessages":[],"fullName":"BloodSugarChart.vue should format endDateTime correctly","status":"passed","title":"should format endDateTime correctly"},{"ancestorTitles":["BloodSugarChart.vue"],"duration":13,"failureMessages":["Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoEqual\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // deep equality\u001b[22m\n\n\u001b[32m- Expected  - 5\u001b[39m\n\u001b[31m+ Received  + 1\u001b[39m\n\n\u001b[32m- Array [\u001b[39m\n\u001b[32m-   \"2023-12-16 15:30:30\",\u001b[39m\n\u001b[32m-   \"2023-12-16 16:30:30\",\u001b[39m\n\u001b[32m-   \"2023-12-16 17:30:30\",\u001b[39m\n\u001b[32m- ]\u001b[39m\n\u001b[31m+ Array []\u001b[39m\n    at Object.<anonymous> (D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\tests\\unit\\BloodSugarChart.spec.js:171:34)"],"fullName":"BloodSugarChart.vue should fetch and update blood sugar data correctly","status":"failed","title":"should fetch and update blood sugar data correctly"}]}],"config":{"bail":0,"changedFilesWithAncestor":false,"collectCoverage":false,"collectCoverageFrom":["src/**/*.{js,jsx,ts,tsx,vue}","!src/**/*.d.ts"],"coverageDirectory":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\coverage","coverageProvider":"v8","coverageReporters":["json","lcov","text","text-summary","clover"],"coverageThreshold":{"global":{"branches":80,"functions":80,"lines":80,"statements":80}},"detectLeaks":false,"detectOpenHandles":false,"errorOnDeprecated":false,"expand":false,"findRelatedTests":false,"forceExit":false,"json":false,"lastCommit":false,"listTests":false,"logHeapUsage":false,"maxConcurrency":5,"maxWorkers":15,"noStackTrace":false,"nonFlagArgs":["tests/unit/BloodSugarChart.spec.js"],"notify":false,"notifyMode":"failure-change","onlyChanged":false,"onlyFailures":false,"passWithNoTests":false,"projects":[],"reporters":[["default",{}],["D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\node_modules\\jest-html-reporters\\index.js",{"publicPath":"<rootDir>/tests/html-report","filename":"report.html","expand":true}]],"rootDir":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis","runTestsByPath":false,"skipFilter":false,"testFailureExitCode":1,"testPathPattern":"tests\\\\unit\\\\BloodSugarChart.spec.js","testSequencer":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\node_modules\\@jest\\test-sequencer\\build\\index.js","updateSnapshot":"new","useStderr":false,"verbose":true,"watch":false,"watchAll":false,"watchPlugins":[{"config":{},"path":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\node_modules\\jest-watch-typeahead\\build\\file_name_plugin\\plugin.js"},{"config":{},"path":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\node_modules\\jest-watch-typeahead\\build\\test_name_plugin\\plugin.js"}],"watchman":true},"endTime":1718456826171,"_reporterOptions":{"publicPath":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis/tests/html-report","filename":"report.html","expand":true,"pageTitle":"","hideIcon":false,"testCommand":"","openReport":false,"failureMessageOnly":0,"enableMergeData":false,"dataMergeLevel":1,"inlineSource":false,"urlForTestFiles":"","darkTheme":false,"includeConsoleLog":false,"stripSkippedTest":false},"logInfoMapping":{},"attachInfos":{}})