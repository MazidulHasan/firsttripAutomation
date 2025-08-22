// src/pages/base.page.js
import { expect } from '@playwright/test';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {object} opts
   * @param {number} opts.timeout
   */
  constructor(page, { timeout = 30_000 } = {}) {
    this.page = page;
    this.timeout = timeout;
  }

  // --- Core navigation ---
  async navigate(url = '') {
    await this.page.goto(url, { timeout: this.timeout, waitUntil: 'domcontentloaded' });
  }

  async waitForNetworkIdle(timeout = this.timeout) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  // --- Locator helpers ---
  locator(target) {
    // Allow passing either a string selector or a Locator
    return typeof target === 'string' ? this.page.locator(target) : target;
  }

  getByRole(role, options) {
    return this.page.getByRole(role, options);
  }

  getByText(text, options) {
    return this.page.getByText(text, options);
  }

  getByTestId(testId) {
    return this.page.getByTestId(testId);
  }

  // --- Element actions ---
  async waitForElement(target, options = {}) {
    const loc = this.locator(target);
    await loc.waitFor({ state: 'visible', timeout: this.timeout, ...options });
    return loc;
  }

  async click(target, options = {}) {
    const loc = await this.waitForElement(target);
    await loc.click({ timeout: this.timeout, ...options });
  }

  async fill(target, text, options = {}) {
    const loc = await this.waitForElement(target);
    await loc.fill(text, { timeout: this.timeout, ...options });
  }

  async type(target, text, options = {}) {
    const loc = await this.waitForElement(target);
    await loc.type(text, { timeout: this.timeout, ...options });
  }

  async press(target, key, options = {}) {
    const loc = await this.waitForElement(target);
    await loc.press(key, { timeout: this.timeout, ...options });
  }

  async selectOption(target, values, options = {}) {
    const loc = await this.waitForElement(target);
    await loc.selectOption(values, { timeout: this.timeout, ...options });
  }

  async hover(target, options = {}) {
    const loc = await this.waitForElement(target);
    await loc.hover({ timeout: this.timeout, ...options });
  }

  async check(target, options = {}) {
    const loc = await this.waitForElement(target);
    await loc.check({ timeout: this.timeout, ...options });
  }

  async uncheck(target, options = {}) {
    const loc = await this.waitForElement(target);
    await loc.uncheck({ timeout: this.timeout, ...options });
  }

  // --- Reads & assertions ---
  async getText(target) {
    const loc = await this.waitForElement(target);
    return await loc.textContent({ timeout: this.timeout });
  }

  async getInputValue(target) {
    const loc = await this.waitForElement(target);
    return await loc.inputValue({ timeout: this.timeout });
  }

  async isVisible(target, timeout = 5_000) {
    try {
      const loc = this.locator(target);
      await loc.waitFor({ state: 'visible', timeout });
      return await loc.isVisible();
    } catch {
      return false;
    }
  }

  async isHidden(target, timeout = 5_000) {
    try {
      const loc = this.locator(target);
      await loc.waitFor({ state: 'hidden', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async expectVisible(target, to = this.timeout) {
    await expect(this.locator(target)).toBeVisible({ timeout: to });
  }

  async expectHidden(target, to = this.timeout) {
    await expect(this.locator(target)).toBeHidden({ timeout: to });
  }

  // --- Page state ---
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded', { timeout: this.timeout });
  }

  async getTitle() {
    return this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  // --- Viewport & scroll ---
  async scrollToElement(target) {
    await this.locator(target).scrollIntoViewIfNeeded();
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // --- Screenshots & attachments ---
  async takeScreenshot(name, { fullPage = true } = {}) {
    // Respect Playwright's outputDir; path here is fine for local browsing
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage,
    });
  }

  // --- Windows / Popups ---
  async waitForPopup(action, timeout = this.timeout) {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout }),
      action(),
    ]);
    await popup.waitForLoadState();
    return popup;
  }
}