const fs = require('fs').promises;
const path = require('path');
const { faker } = require('@faker-js/faker');

/**
 * Test utility functions
 */
class TestUtils {
  /**
   * Generate random test data
   */
  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: false }),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
      },
      dateOfBirth: faker.date.past({ years: 30 }),
      avatar: faker.image.avatar()
    };
  }

  static generateProduct() {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      inStock: faker.datatype.boolean(),
      quantity: faker.number.int({ min: 0, max: 100 }),
      images: Array.from({ length: 3 }, () => faker.image.url())
    };
  }

  static generateOrder() {
    return {
      orderId: faker.string.uuid(),
      customerEmail: faker.internet.email(),
      items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: parseFloat(faker.commerce.price())
      })),
      total: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      createdAt: faker.date.recent()
    };
  }

  /**
   * File operations
   */
  static async readJsonFile(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const data = await fs.readFile(absolutePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading JSON file ${filePath}:`, error);
      throw error;
    }
  }

  static async writeJsonFile(filePath, data) {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.writeFile(absolutePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing JSON file ${filePath}:`, error);
      throw error;
    }
  }

  static async fileExists(filePath) {
    try {
      await fs.access(path.resolve(filePath));
      return true;
    } catch {
      return false;
    }
  }

  static async createDirectory(dirPath) {
    try {
      await fs.mkdir(path.resolve(dirPath), { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error);
      throw error;
    }
  }

  /**
   * Wait utilities
   */
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async waitUntil(condition, timeout = 30000, interval = 100) {
    const startTime = Date.now();
  
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await this.wait(interval);
    }
  
    throw new Error(`Timeout waiting for condition after ${timeout}ms`);
  }

  /**
   * Retry utilities
   */
  static async retry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.wait(delay);
      }
    }
  }

  /**
   * Date utilities
   */
  static formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
  
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }

  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * String utilities
   */
  static generateRandomString(length = 10) {
    return faker.string.alphanumeric(length);
  }

  static generateRandomEmail() {
    return `test_${Date.now()}@example.com`;
  }

  static generateRandomPhone() {
    return faker.phone.number('###-###-####');
  }

  /**
   * Validation utilities
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone);
  }

  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Environment utilities
   */
  static getEnvVar(name, defaultValue = '') {
    return process.env[name] || defaultValue;
  }

  static isCI() {
    return process.env.CI === 'true';
  }

  static isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  static isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Test data cleanup
   */
  static async cleanupTestData(page) {
    // Clean up cookies
    await page.context().clearCookies();
  
    // Clean up local storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Screenshot utilities
   */
  static async compareScreenshots(actual, expected, threshold = 0.1) {
    // This would integrate with a visual regression tool
    // Placeholder for visual comparison logic
    return true;
  }

  /**
   * Performance utilities
   */
  static async measurePerformance(page, actionFn) {
    const startTime = Date.now();
    const metrics = await page.evaluate(() => performance.getEntriesByType('navigation')[0]);
  
    await actionFn();
  
    const endTime = Date.now();
    const duration = endTime - startTime;
  
    return {
      duration,
      metrics,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { TestUtils };