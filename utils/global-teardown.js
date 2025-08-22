const { ApiHelper } = require('./api-helper');
const { TestUtils } = require('./test-utils');
const fs = require('fs').promises;
const path = require('path');

/**
 * Global teardown function that runs once after all tests
 */
async function globalTeardown(config) {
  console.log('🧹 Starting global teardown...');

  // Clean up test data via API
  if (process.env.CLEANUP_TEST_DATA === 'true') {
    console.log('🗑️ Cleaning up test data...');
    const api = new ApiHelper();
  
    try {
      // Clean up test users created during setup
      const usersFile = 'test-data/generated-users.json';
      if (await TestUtils.fileExists(usersFile)) {
        const users = await TestUtils.readJsonFile(usersFile);
        for (const user of users) {
          try {
            await api.deleteUser(user.id);
          } catch (error) {
            console.warn(`Could not delete user ${user.email}:`, error.message);
          }
        }
      
        // Remove the generated users file
        await fs.unlink(path.resolve(usersFile));
      }
    
      console.log('✅ Test data cleanup complete');
    } catch (error) {
      console.error('❌ Failed to cleanup test data:', error.message);
    }
  }

  // Archive test results
  if (process.env.ARCHIVE_RESULTS === 'true') {
    console.log('📦 Archiving test results...');
  
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveDir = `test-results/archive/${timestamp}`;
  
    try {
      await TestUtils.createDirectory(archiveDir);
    
      // Copy current results to archive
      const resultsFiles = [
        'test-results/results.json',
        'test-results/results.xml',
        'test-results/html-report'
      ];
    
      for (const file of resultsFiles) {
        if (await TestUtils.fileExists(file)) {
          const fileName = path.basename(file);
          await fs.cp(
            path.resolve(file),
            path.resolve(archiveDir, fileName),
            { recursive: true }
          );
        }
      }
    
      console.log(`✅ Results archived to ${archiveDir}`);
    } catch (error) {
      console.error('❌ Failed to archive results:', error.message);
    }
  }

  // Generate summary report
  if (process.env.GENERATE_SUMMARY === 'true') {
    console.log('📊 Generating test summary...');
  
    try {
      const resultsFile = 'test-results/results.json';
      if (await TestUtils.fileExists(resultsFile)) {
        const results = await TestUtils.readJsonFile(resultsFile);
      
        const summary = {
          runId: process.env.TEST_RUN_ID,
          startTime: process.env.TEST_START_TIME,
          endTime: new Date().toISOString(),
          duration: Date.now() - parseInt(process.env.TEST_RUN_ID),
          totalTests: results.suites?.length || 0,
          passed: results.stats?.expected || 0,
          failed: results.stats?.unexpected || 0,
          skipped: results.stats?.skipped || 0,
          flaky: results.stats?.flaky || 0
        };
      
        await TestUtils.writeJsonFile('test-results/summary.json', summary);
      
        console.log('📈 Test Summary:');
        console.log(`   Total: ${summary.totalTests}`);
        console.log(`   ✅ Passed: ${summary.passed}`);
        console.log(`   ❌ Failed: ${summary.failed}`);
        console.log(`   ⏭️ Skipped: ${summary.skipped}`);
        console.log(`   🔄 Flaky: ${summary.flaky}`);
      }
    } catch (error) {
      console.error('❌ Failed to generate summary:', error.message);
    }
  }

  // Send notifications
  if (process.env.SEND_NOTIFICATIONS === 'true') {
    console.log('📧 Sending notifications...');
  
    // This would integrate with Slack, Teams, or email
    // Placeholder for notification logic
  
    console.log('✅ Notifications sent');
  }

  // Clean up temporary files
  if (process.env.CLEANUP_TEMP === 'true') {
    console.log('🗑️ Cleaning temporary files...');
  
    try {
      await fs.rm('downloads', { recursive: true, force: true });
      await TestUtils.createDirectory('downloads');
    
      console.log('✅ Temporary files cleaned');
    } catch (error) {
      console.warn('Warning: Could not clean temporary files', error.message);
    }
  }

  console.log('✅ Global teardown complete');

  // Exit with appropriate code
  const failedTests = parseInt(process.env.FAILED_TESTS || '0');
  if (failedTests > 0 && process.env.CI === 'true') {
    process.exit(1);
  }
}

module.exports = globalTeardown;