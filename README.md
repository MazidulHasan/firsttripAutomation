This project contains a full, executable Playwright (JavaScript) UI + API automation framework for FirstTrip flight search.

├─ src/
│  ├─ pages/
│  │  ├─ base.page.js
│  │  ├─ flightSearch.page.js
│  │  └─ searchResults.page.js
│  ├─ utils/
│  │  ├─ config.js
│  │  ├─ helpers.js
│  │  └─ waiters.js
│  └─ testData/
│     └─ searchCriteria.json
├─ tests/
│  ├─ ui/
│  │  └─ flight-search.spec.js
├─ playwright.config.js
├─ package.json
└─ README.md


Framework Structure and Design Reasoning
Playwright Test runner:
Parallel execution, fixtures, built-in tracing, screenshots, HTML reports.

Page Object Model (POM):
src/pages/base.page.js: common actions (click/fill/check/uncheck), waits (network idle, element stable), scrolling, screenshot, popup handling.

src/pages/flightSearch.page.js: From/To inputs, travellers, class dropdown, and robust date-picker selection (static, two-month view, dynamic navigation using React Datepicker aria-labels).
src/pages/searchResults.page.js: Airline filter handling, price extraction, selecting last flight, popup/login checks.

Utilities:
config.js: central URLs and shared settings.
helpers.js: parsePrice and small helpers.
Test Data:
searchCriteria.json for input values (from/to, date, class, airline names), promoting reusability and clarity.
Selector strategy:
Prefer accessible selectors (getByRole, getByLabel, getByTestId) for resilience over brittle CSS chains.
Stability:
Explicit waits for calendars, scroll stabilization for infinite lists, and element bounding box stability before clicking reduce flakes on dynamic SPA UIs.
Reporting:
Playwright HTML report included by default.
