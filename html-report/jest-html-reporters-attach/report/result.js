window.jest_html_reporters_callback__({"numFailedTestSuites":1,"numFailedTests":2,"numPassedTestSuites":0,"numPassedTests":20,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":0,"numTodoTests":0,"numTotalTestSuites":1,"numTotalTests":22,"startTime":1718198341822,"success":false,"testResults":[{"numFailingTests":2,"numPassingTests":20,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1718198363011,"runtime":19819,"slow":true,"start":1718198343192},"testFilePath":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\tests\\unit\\DietRecord.spec.js","failureMessage":"\u001b[1m\u001b[31m  \u001b[1m● \u001b[22m\u001b[1mDietRecord.vue › correctly handles failed image upload\u001b[39m\u001b[22m\n\n    ReferenceError: ElMessage is not defined\n\u001b[2m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 483 |\u001b[39m             } \u001b[36mcatch\u001b[39m (error) {\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 484 |\u001b[39m                 console\u001b[33m.\u001b[39merror(\u001b[32m'操作失败'\u001b[39m\u001b[33m,\u001b[39m error)\u001b[33m;\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[2m\u001b[39m\u001b[90m 485 |\u001b[39m                 \u001b[33mElMessage\u001b[39m({\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m     |\u001b[39m                 \u001b[31m\u001b[1m^\u001b[22m\u001b[2m\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 486 |\u001b[39m                     dangerouslyUseHTMLString\u001b[33m:\u001b[39m \u001b[36mtrue\u001b[39m\u001b[33m,\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 487 |\u001b[39m                     message\u001b[33m:\u001b[39m \u001b[32m'<strong>图片识别失败</strong><br/>请稍后重试'\u001b[39m\u001b[33m,\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 488 |\u001b[39m                     type\u001b[33m:\u001b[39m \u001b[32m'error'\u001b[39m\u001b[33m,\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Proxy.uploadImage (\u001b[22m\u001b[2msrc/views/DietRecord.vue\u001b[2m:485:17)\u001b[22m\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Object.<anonymous> (\u001b[22m\u001b[2m\u001b[0m\u001b[36mtests/unit/DietRecord.spec.js\u001b[39m\u001b[0m\u001b[2m:316:9)\u001b[22m\u001b[2m\u001b[22m\n\n\u001b[1m\u001b[31m  \u001b[1m● \u001b[22m\u001b[1mDietRecord.vue › correctly handles failed saveDiet\u001b[39m\u001b[22m\n\n    \u001b[2mexpect(\u001b[22m\u001b[31mjest.fn()\u001b[39m\u001b[2m).\u001b[22mtoHaveBeenCalledWith\u001b[2m(\u001b[22m\u001b[32m...expected\u001b[39m\u001b[2m)\u001b[22m\n\n    Expected: \u001b[32m\"保存失败\"\u001b[39m, \u001b[32m[Error: Failed to save detail]\u001b[39m\n    Received\n           1: \u001b[31m\"操作失败\"\u001b[39m, \u001b[31m[Error: Upload failed]\u001b[39m\n           2: \u001b[31m\"Error fetching data:\"\u001b[39m, \u001b[31m[Error: Request failed]\u001b[39m\n           3: \u001b[31m\"Error fetching data:\"\u001b[39m, \u001b[31m[Error: Request failed]\u001b[39m\n\n    Number of calls: \u001b[31m7\u001b[39m\n\u001b[2m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 481 |\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 482 |\u001b[39m         \u001b[90m// 断言是否正确处理了错误\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[2m\u001b[39m\u001b[90m 483 |\u001b[39m         expect(consoleErrorSpy)\u001b[33m.\u001b[39mtoHaveBeenCalledWith(\u001b[32m'保存失败'\u001b[39m\u001b[33m,\u001b[39m error)\u001b[33m;\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m     |\u001b[39m                                 \u001b[31m\u001b[1m^\u001b[22m\u001b[2m\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 484 |\u001b[39m     })\u001b[33m;\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 485 |\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 486 |\u001b[39m     it(\u001b[32m'correctly clears the addedFoodList'\u001b[39m\u001b[33m,\u001b[39m \u001b[36masync\u001b[39m () \u001b[33m=>\u001b[39m {\u001b[0m\u001b[22m\n\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Object.<anonymous> (\u001b[22m\u001b[2m\u001b[0m\u001b[36mtests/unit/DietRecord.spec.js\u001b[39m\u001b[0m\u001b[2m:483:33)\u001b[22m\u001b[2m\u001b[22m\n","testResults":[{"ancestorTitles":["DietRecord.vue"],"duration":897,"failureMessages":[],"fullName":"DietRecord.vue correctly click right button","status":"passed","title":"correctly click right button"},{"ancestorTitles":["DietRecord.vue"],"duration":939,"failureMessages":[],"fullName":"DietRecord.vue correctly click close button","status":"passed","title":"correctly click close button"},{"ancestorTitles":["DietRecord.vue"],"duration":922,"failureMessages":[],"fullName":"DietRecord.vue correctly confirm","status":"passed","title":"correctly confirm"},{"ancestorTitles":["DietRecord.vue"],"duration":677,"failureMessages":[],"fullName":"DietRecord.vue correctly updates the currentDay computed property","status":"passed","title":"correctly updates the currentDay computed property"},{"ancestorTitles":["DietRecord.vue"],"duration":658,"failureMessages":[],"fullName":"DietRecord.vue correctly fetches tags from API","status":"passed","title":"correctly fetches tags from API"},{"ancestorTitles":["DietRecord.vue"],"duration":1086,"failureMessages":[],"fullName":"DietRecord.vue correctly switches query when switching tags","status":"passed","title":"correctly switches query when switching tags"},{"ancestorTitles":["DietRecord.vue"],"duration":1059,"failureMessages":[],"fullName":"DietRecord.vue correctly updates component state after successful data retrieval","status":"passed","title":"correctly updates component state after successful data retrieval"},{"ancestorTitles":["DietRecord.vue"],"duration":901,"failureMessages":[],"fullName":"DietRecord.vue correctly handles errors when data retrieval fails","status":"passed","title":"correctly handles errors when data retrieval fails"},{"ancestorTitles":["DietRecord.vue"],"duration":952,"failureMessages":[],"fullName":"DietRecord.vue correctly handles successful image upload","status":"passed","title":"correctly handles successful image upload"},{"ancestorTitles":["DietRecord.vue"],"duration":651,"failureMessages":["ReferenceError: ElMessage is not defined\n    at Proxy.uploadImage (D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\src\\views\\DietRecord.vue:485:17)\n    at Object.<anonymous> (D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\tests\\unit\\DietRecord.spec.js:316:9)"],"fullName":"DietRecord.vue correctly handles failed image upload","status":"failed","title":"correctly handles failed image upload"},{"ancestorTitles":["DietRecord.vue"],"duration":665,"failureMessages":[],"fullName":"DietRecord.vue correctly handles upload choice when no image is selected","status":"passed","title":"correctly handles upload choice when no image is selected"},{"ancestorTitles":["DietRecord.vue"],"duration":670,"failureMessages":[],"fullName":"DietRecord.vue correctly handles upload choice when no food is selected","status":"passed","title":"correctly handles upload choice when no food is selected"},{"ancestorTitles":["DietRecord.vue"],"duration":830,"failureMessages":[],"fullName":"DietRecord.vue correctly handles successful upload choice","status":"passed","title":"correctly handles successful upload choice"},{"ancestorTitles":["DietRecord.vue"],"duration":924,"failureMessages":[],"fullName":"DietRecord.vue correctly handles successful saveDiet","status":"passed","title":"correctly handles successful saveDiet"},{"ancestorTitles":["DietRecord.vue"],"duration":925,"failureMessages":["Error: \u001b[2mexpect(\u001b[22m\u001b[31mjest.fn()\u001b[39m\u001b[2m).\u001b[22mtoHaveBeenCalledWith\u001b[2m(\u001b[22m\u001b[32m...expected\u001b[39m\u001b[2m)\u001b[22m\n\nExpected: \u001b[32m\"保存失败\"\u001b[39m, \u001b[32m[Error: Failed to save detail]\u001b[39m\nReceived\n       1: \u001b[31m\"操作失败\"\u001b[39m, \u001b[31m[Error: Upload failed]\u001b[39m\n       2: \u001b[31m\"Error fetching data:\"\u001b[39m, \u001b[31m[Error: Request failed]\u001b[39m\n       3: \u001b[31m\"Error fetching data:\"\u001b[39m, \u001b[31m[Error: Request failed]\u001b[39m\n\nNumber of calls: \u001b[31m7\u001b[39m\n    at Object.<anonymous> (D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\tests\\unit\\DietRecord.spec.js:483:33)"],"fullName":"DietRecord.vue correctly handles failed saveDiet","status":"failed","title":"correctly handles failed saveDiet"},{"ancestorTitles":["DietRecord.vue"],"duration":849,"failureMessages":[],"fullName":"DietRecord.vue correctly clears the addedFoodList","status":"passed","title":"correctly clears the addedFoodList"},{"ancestorTitles":["DietRecord.vue"],"duration":638,"failureMessages":[],"fullName":"DietRecord.vue correctly updates whetherShowFoodDetails and selectedFood","status":"passed","title":"correctly updates whetherShowFoodDetails and selectedFood"},{"ancestorTitles":["DietRecord.vue"],"duration":921,"failureMessages":[],"fullName":"DietRecord.vue correctly updates whetherShowFoodDetails to false","status":"passed","title":"correctly updates whetherShowFoodDetails to false"},{"ancestorTitles":["DietRecord.vue"],"duration":844,"failureMessages":[],"fullName":"DietRecord.vue correctly saves selected food to addedFoodList","status":"passed","title":"correctly saves selected food to addedFoodList"},{"ancestorTitles":["DietRecord.vue"],"duration":664,"failureMessages":[],"fullName":"DietRecord.vue correctly sets check_save to true if dietItemsCount is not zero","status":"passed","title":"correctly sets check_save to true if dietItemsCount is not zero"},{"ancestorTitles":["DietRecord.vue"],"duration":463,"failureMessages":[],"fullName":"DietRecord.vue correctly sets check_save to false if dietItemsCount is zero","status":"passed","title":"correctly sets check_save to false if dietItemsCount is zero"},{"ancestorTitles":["DietRecord.vue"],"duration":642,"failureMessages":[],"fullName":"DietRecord.vue correctly updates currentWeight when the value changes","status":"passed","title":"correctly updates currentWeight when the value changes"}]}],"config":{"bail":0,"changedFilesWithAncestor":false,"collectCoverage":false,"collectCoverageFrom":["src/**/*.{js,jsx,ts,tsx,vue}","!src/**/*.d.ts"],"coverageDirectory":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\coverage","coverageProvider":"v8","coverageReporters":["json","lcov","text","clover"],"coverageThreshold":{"global":{"branches":80,"functions":80,"lines":80,"statements":80}},"detectLeaks":false,"detectOpenHandles":false,"errorOnDeprecated":false,"expand":false,"findRelatedTests":false,"forceExit":false,"json":false,"lastCommit":false,"listTests":false,"logHeapUsage":false,"maxConcurrency":5,"maxWorkers":15,"noStackTrace":false,"nonFlagArgs":[],"notify":false,"notifyMode":"failure-change","onlyChanged":false,"onlyFailures":false,"passWithNoTests":false,"projects":[],"reporters":[["default",{}],["D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\node_modules\\jest-html-reporters\\index.js",{"publicPath":"./html-report","filename":"report.html","expand":true}]],"rootDir":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis","runTestsByPath":false,"skipFilter":false,"testFailureExitCode":1,"testPathPattern":"","testSequencer":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\node_modules\\@jest\\test-sequencer\\build\\index.js","updateSnapshot":"new","useStderr":false,"verbose":true,"watch":false,"watchAll":false,"watchPlugins":[{"config":{},"path":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\node_modules\\jest-watch-typeahead\\build\\file_name_plugin\\plugin.js"},{"config":{},"path":"D:\\Documents\\大三下\\专业方向综合\\Glycuresis\\node_modules\\jest-watch-typeahead\\build\\test_name_plugin\\plugin.js"}],"watchman":true},"endTime":1718198363052,"_reporterOptions":{"publicPath":"./html-report","filename":"report.html","expand":true,"pageTitle":"","hideIcon":false,"testCommand":"","openReport":false,"failureMessageOnly":0,"enableMergeData":false,"dataMergeLevel":1,"inlineSource":false,"urlForTestFiles":"","darkTheme":false,"includeConsoleLog":false,"stripSkippedTest":false},"logInfoMapping":{},"attachInfos":{}})