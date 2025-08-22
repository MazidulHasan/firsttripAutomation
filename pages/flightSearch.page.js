import { expect } from '@playwright/test';
import { config } from '../utils/config.js';

export class FlightSearchPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchButton = this.page.getByTestId('search-flight-button');
    this.fromCity = this.page.getByTestId('departure-airport-input-form-1');
    this.toCity = this.page.getByTestId('destination-airport-input-form-1');
    this.departureDate = this.page.locator('button').filter({ hasText: 'Departure' });
    this.returnDate = this.page.getByTestId('flight-return-date-selector');
    this.traveller = this.page.getByText('1 Traveller');
    this.adultAdd = this.page.getByTestId('adult-number-add-button').getByAltText('image'); 
    this.sept23 = this.page.getByLabel('Choose Tuesday, September 23rd,');
  }

  async goto() {
    await this.page.goto(config.urls.flightSearch);
    await expect(this.searchButton).toBeVisible();
  }

  async fillFromLocation(city) {
    await this.fromCity.click();
    await this.fromCity.fill(city);
    // await this.page.keyboard.press('Enter');
    await this.page.getByText(`${city}, BangladeshShah Amanat International AirportCGP`).click();
  }

  async fillToLocation(city) {
    await this.toCity.click();
    await this.toCity.fill(city);
    await this.page.getByText(`${city}, BangladeshHazrat Shahjalal International AirportDAC`).click();
  }

  async selectDepartureDate() {
    await this.departureDate.click();
    await this.sept23.click();
  }

  async selectRetrurnDate() {
    await this.returnDate.click();
    await this.sept23.click();
  }

  async setTravellersAdults(count) {
    await this.traveller.click();
    let current = 1;
    while (current < count) {
      await this.adultAdd.click();
      current++;
    }
  }

  async selectClass(value) {
    await this.classDropdown.click();
    const option = this.page.getByRole('option', { name: new RegExp(value, 'i') })
      .or(this.page.locator(`text=${value}`));
    await option.first().click();
  }

  async search() {
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

// function formatOrdinal(n) {
//   const s = ['th', 'st', 'nd', 'rd'];
//   const v = n % 100;
//   return n + (s[(v - 20) % 10] || s[v] || s[0]);
// }

// function buildAriaLabel(date) {
//   const months = [
//     'January','February','March','April','May','June',
//     'July','August','September','October','November','December'
//   ];
//   const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

//   const weekday = weekdays[date.getDay()];
//   const month = months[date.getMonth()];
//   const day = date.getDate();
//   const ord = formatOrdinal(day);
//   const year = date.getFullYear();

//   // Matches aria-label="Choose Tuesday, September 23rd, 2025"
//   return `Choose ${weekday}, ${month} ${ord}, ${year}`;
// }

// async function isTargetMonthVisible(page, monthName, year) {
//   const header = page.locator('.react-datepicker__current-month', { hasText: `${monthName} ${year}` });
//   return header.isVisible().catch(() => false);
// }

// async function selectDepartureDateDynamic(page, targetDate) {
//   // 1) Open calendar
//   await page.locator('button').filter({ hasText: 'Departure' }).click();
//   await page.locator('.react-datepicker').waitFor({ state: 'visible' });

//   // 2) Navigate months until target month/year is visible
//   const months = [
//     'January','February','March','April','May','June',
//     'July','August','September','October','November','December'
//   ];
//   const targetMonthName = months[targetDate.getMonth()];
//   const targetYear = targetDate.getFullYear();

//   const nextButton = page.locator('button.react-datepicker__navigation--next[aria-label="Next Month"]');

//   for (let i = 0; i < 24; i++) {
//     if (await isTargetMonthVisible(page, targetMonthName, targetYear)) break;
//     await nextButton.click();
//     // Wait for header to update
//     await page.waitForTimeout(150);
//   }

//   // 3) Click date using aria-label
//   const ariaLabel = buildAriaLabel(targetDate);
//   await page.getByLabel(ariaLabel).click();
// }
}