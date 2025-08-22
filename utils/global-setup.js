const { chromium } = require('@playwright/test');
const { ApiHelper } = require('./api-helper');
const { TestUtils } = require('./test-utils');
const fs = require('fs').promises;
const path = require('path');

/**
 * Global setup function that runs once before all tests
 */
async function globalSetup(config) {
  console.log('🚀 Starting global setup...');

  // Create necessary directories
  const directories = [
    'auth',
    'downloads',
    'screenshots/actual',
    'screenshots/expected',
    'screenshots/diff',
    'test-results'
  ];

  for (const dir of directories) {
    await TestUtils.createDirectory(dir);
  }

  // Clean up old test results
  if (process.env.CLEAN_RESULTS === 'true') {
    console.log('🧹 Cleaning old test results...');
    try {
      await fs.rm('test-results', { recursive: true, force: true });
      await fs.rm('screenshots/actual', { recursive: true, force: true });
      await fs.rm('screenshots/diff', { recursive: true, force: true });
    } catch (error) {
      console.warn('Warning: Could not clean some directories', error.message);
    }
  }

  // Wait for API to be ready
  if (process.env.WAIT_FOR_API === 'true') {
    console.log('⏳ Waiting for API to be ready...');
    const api = new ApiHelper();
    await api.waitForApi();
    console.log('✅ API is ready');
  }

  // Setup test data via API
  if (process.env.SETUP_TEST_DATA === 'true') {
    console.log('📊 Setting up test data...');
    const api = new ApiHelper();
  
    try {
      // Create test users
      const users = Array.from({ length: 5 }, () => TestUtils.generateUser());
      for (const user of users) {
        await api.createUser(user);
      }
    
      // Store test data
      await TestUtils.writeJsonFile('test-data/generated-users.json', users);
    
      console.log('✅ Test data setup complete');
    } catch (error) {
      console.error('❌ Failed to setup test data:', error.message);
    }
  }

  // Perform authentication and save state
  if (process.env.SETUP_AUTH === 'true') {
    console.log('🔐 Setting up authentication...');
  
    const browser = await chromium.launch();
    const context = await browser.newContext({
      baseURL: config.use.baseURL
    });
    const page = await context.newPage();
  
    try {
      // Login as regular user
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', process.env.TEST_USER_EMAIL);
      await page.fill('[data-testid="password-input"]', process.env.TEST_USER_PASSWORD);
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('**/dashboard');
    
      // Save user auth state
      await context.storageState({ path: 'auth/user.json' });
      console.log('✅ User authentication saved');
    
      // Clear and login as admin
      await context.clearCookies();
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', process.env.TEST_ADMIN_EMAIL);
      await page.fill('[data-testid="password-input"]', process.env.TEST_ADMIN_PASSWORD);
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('**/dashboard');
    
      // Save admin auth state
      await context.storageState({ path: 'auth/admin.json' });
      console.log('✅ Admin authentication saved');
    
    } catch (error) {
      console.error('❌ Authentication setup failed:', error.message);
    } finally {
      await browser.close();
    }
  }

  // Store global config for tests
  process.env.TEST_RUN_ID = Date.now().toString();
  process.env.TEST_START_TIME = new Date().toISOString();

  console.log('✅ Global setup complete');
  console.log(`📝 Test Run ID: ${process.env.TEST_RUN_ID}`);
}

module.exports = globalSetup;