import { expect } from '@playwright/test';
import { parsePrice } from '../utils/helpers.js';
import { scrollToEnd } from '../utils/helpers.js';

export class SearchResultsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.airlineFilterContainer = this.page.getByTestId('airline-filter-list');
    this.endOfResults = this.page.getByText('End of Search Results');
    this.cards = page.locator('[data-testid^="flight_card_"]');
    this.selectButtonIn = (card) => card.locator('[data-testid="select-button"]', { hasText: 'Select' }).first();
  }

  async filterByAirline(airlineName) {
    const selectPlane = this.airlineFilterContainer.getByText(airlineName);
    // await selectPlane.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState('networkidle');
    await selectPlane.click({ force: true });
    // Optionally wait for cards to refresh
}
async getAllPrices() {
    const count = await this.cards.count();
    const prices = [];
    for (let i = 0; i < count; i++) {
      const card = this.cards.nth(i);
      const priceText = await card.locator('[data-testid="price-section"] .font-bold p').textContent();
      prices.push(Number((priceText ?? '').replace(/[^\d]/g, '')));
    }
    return prices;
  }

  async clickLastCardSelect() {
    await this.cards.first().waitFor({ state: 'visible' });
    const last = this.cards.nth(await this.cards.count() - 1);
    await last.scrollIntoViewIfNeeded();
    await this.selectButtonIn(last).click();
  }

  async deselectAndSelectAgain(){
    await this.page.getByTestId('airline-filter-list').locator('div').filter({ hasText: 'US Bangla Airlines৳' }).first().click();
    await this.page.getByTestId('airline-filter-list').locator('div').filter({ hasText: 'Novo Air৳' }).first().click();
    return await this.getAllPrices();
  }

async scrollUntilEndOfResults() {
  while (true) {
    try {
      await this.endOfResults.waitFor({ state: 'visible', timeout: 1000 });
      
      // Wait for network to be idle
      await this.page.waitForLoadState('networkidle');
      break; // Found it, exit loop
      
    } catch (error) {
      // Element not found yet, scroll down
      await this.page.evaluate(() => {
        window.scrollBy(0, 500); // Scroll down 500px
      });
      
      // Wait a bit for content to load
      await this.page.waitForTimeout(1000);
    }
  }
}

  async getPricesForAirline(airlineName) {
    const cards = this.flightCardByAirline(airlineName);
    const count = await cards.count();
    const prices = [];
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const priceText = await this.priceInCard(card).innerText();
      prices.push(parsePrice(priceText));
    }
    return prices;
  }

  async selectLastFlightForAirline(airlineName) {
    const cards = this.flightCardByAirline(airlineName);
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);
    const lastCard = cards.nth(total - 1);
    await lastCard.scrollIntoViewIfNeeded();
    await this.selectButtonInCard(lastCard).click();
  }

  async expectSignInModalVisible() {
    await expect(this.signInModal).toBeVisible({ timeout: 15000 });
  }

  async closeSignIn() {
    if (await this.closeSignInButton.isVisible().catch(() => false)) {
      await this.closeSignInButton.click();
      await expect(this.signInModal).toBeHidden();
    } else {
      // fallback: close new tab or modal overlay
      await this.page.keyboard.press('Escape').catch(() => {});
    }
  }
}