## ADDED Requirements

### Requirement: KPI metric cards
Dashboard metric cards SHALL display a large number, a subtle label below it, and an optional trend indicator. No colored icon backgrounds or decorative elements SHALL appear inside metric cards.

#### Scenario: KPI card renders cleanly
- **WHEN** a metric card renders on the dashboard
- **THEN** it shows a large bold number, a small gray label beneath it, and no colored icon backgrounds

### Requirement: Links list page
The Links page SHALL display links in a clean table/list format with link title, short URL, click count, status badge, and creation date. Each row SHALL be clickable to navigate to the link detail page.

#### Scenario: Links list renders
- **WHEN** the Links page loads
- **THEN** links display in rows with title, short code, clicks, status, and date

### Requirement: Analytics page
The Analytics page SHALL show metric cards at the top and a link performance list below with click count bars. It SHALL include a date range selector.

#### Scenario: Analytics page renders
- **WHEN** the Analytics page loads
- **THEN** it shows 4 metric cards and a link performance list with horizontal click bars

### Requirement: Bio pages grid
The Bio Pages page SHALL display bio pages in a responsive card grid. Each card SHALL show title, slug, click count, block count, and published/draft status.

#### Scenario: Bio pages grid renders
- **WHEN** the Bio Pages page loads
- **THEN** bio pages display in a responsive card grid with title, slug, stats, and status

### Requirement: Empty states
Pages with no data SHALL display a centered empty state with an icon, title, description, and action button (where applicable).

#### Scenario: Empty state renders
- **WHEN** a page has no data
- **THEN** a centered empty state component appears with icon, title, description, and optional CTA

### Requirement: Loading states
Pages that fetch data SHALL display Skeleton components while loading, styled to match the final layout dimensions.

#### Scenario: Loading skeleton renders
- **WHEN** data is loading
- **THEN** skeleton placeholders appear (not text like "Loading...")
