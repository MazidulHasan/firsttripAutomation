import { test, expect } from '@playwright/test';
import { FlightSearchPage } from '../../pages/flightSearch.page.js';
import { SearchResultsPage } from '../../pages/searchResults.page.js';
import criteria from '../../test-data/searchCriteria.json' assert { type: 'json' };

test.describe('Flight Search - FirstTrip', () => {

  test('US-Bangla vs Novoair price comparison and auth modal check', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const flightSearch = new FlightSearchPage(page);
    const results = new SearchResultsPage(page);

    // 1. Navigate
    await flightSearch.goto();

    // 2. Select flight search criteria
    await flightSearch.fillFromLocation(criteria.from);
    await flightSearch.fillToLocation(criteria.to);
    await flightSearch.selectDepartureDate(criteria.departureDate);
    await flightSearch.selectRetrurnDate(criteria.departureDate);
    await flightSearch.setTravellersAdults(criteria.adults);
    // await flightSearch.selectClass(criteria.class);

    // 3. Click Search
    await flightSearch.search();

    // 4. Filter and select US-Bangla; pick last flight
    await results.filterByAirline(criteria.airlines.usBangla);
    await results.scrollUntilEndOfResults();
    // 7. Capture prices first (before clicking last flight)
    const pricesBefore = await results.getAllPrices();
    console.log("pricesBefore",pricesBefore);
    
    const [loginPage] = await Promise.all([
    page.context().waitForEvent('page', { timeout: 15000 }),
    results.clickLastCardSelect(),
  ]);

  await loginPage.waitForLoadState('domcontentloaded');

  // Verify login content
  await expect(
    loginPage.getByText('Sign InSign in to your accountEmail*Sign In with PasswordSend OTPOr Sign In')).toBeVisible({ timeout: 10000 });

  // Close and return
  await loginPage.close();
  await page.bringToFront();
  await expect(results.cards.first()).toBeVisible();
  const results2 = new SearchResultsPage(page);
  // await page.goto('https://firsttrip.com/flights?type=1&departure_id=CGP&arrival_id=DAC&outbound_date=2025-09-23&return_date=2025-09-23&adults=2&travel_class=1&fare_type=1');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2000);
  await page.setViewportSize({ width: 1920, height: 1080 });
  const pricesAfter = await results2.deselectAndSelectAgain();
  console.log('pricesAfter',pricesAfter);
  expect(pricesAfter).not.toEqual(pricesBefore);
  });

});