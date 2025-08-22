const fs = require('fs');
const path = require('path');

class TestReportGenerator {
  constructor() {
    this.results = [];
  }

  addResult(testCase, actualResult, passed) {
    this.results.push({
      testId: testCase.testId,
      description: testCase.description,
      username: testCase.username,
      expectedResult: testCase.expectedResult,
      actualResult: actualResult,
      passed: passed,
      timestamp: new Date().toISOString()
    });
  }

  generateHTMLReport() {
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = this.results.filter(r => r.passed === false).length;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Login Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        .passed { color: green; }
        .failed { color: red; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>🧪 Login Test Results</h1>
    
    <div class="summary">
        <h3>📊 Summary</h3>
        <p><strong>Total Tests:</strong> ${this.results.length}</p>
        <p><strong>Passed:</strong> <span class="passed">${passedTests}</span></p>
        <p><strong>Failed:</strong> <span class="failed">${failedTests}</span></p>
        <p><strong>Success Rate:</strong> ${((passedTests/this.results.length)*100).toFixed(2)}%</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Test ID</th>
                <th>Description</th>
                <th>Username</th>
                <th>Expected</th>
                <th>Actual</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${this.results.map(result => `
                <tr>
                    <td>${result.testId}</td>
                    <td>${result.description}</td>
                    <td>${result.username || 'N/A'}</td>
                    <td>${result.expectedResult}</td>
                    <td>${result.actualResult}</td>
                    <td class="${result.passed ? 'passed' : 'failed'}">
                        ${result.passed ? '✅ PASS' : '❌ FAIL'}
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;

    fs.writeFileSync('test-results/login-test-report.html', html);
    console.log('📊 HTML report generated: test-results/login-test-report.html');
  }
}

module.exports = TestReportGenerator;