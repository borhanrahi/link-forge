## ADDED Requirements

### Requirement: Collapsible sidebar
The Sidebar SHALL support expanded (w-64) and collapsed (w-16) modes via a toggle button. Navigation items SHALL show only icons in collapsed mode, with tooltips on hover.

#### Scenario: Sidebar collapses on toggle click
- **WHEN** the collapse toggle button (<) is clicked
- **THEN** the sidebar width animates from 256px to 64px, labels disappear, and the toggle icon rotates

#### Scenario: Sidebar expands on toggle click
- **WHEN** the collapse toggle button (>) is clicked
- **THEN** the sidebar width animates from 64px to 256px, labels reappear

#### Scenario: Collapsed nav shows tooltip
- **WHEN** the sidebar is collapsed and user hovers a nav icon
- **THEN** a tooltip appears with the nav item label

### Requirement: Active nav item styling
The currently active navigation item SHALL have a subtle gray background and indigo text color. Inactive items SHALL have gray text and hover background.

#### Scenario: Active nav item highlighted
- **WHEN** the current pathname matches a nav item's href
- **THEN** that item shows `bg-gray-100` background and `text-indigo-600` icon/text

### Requirement: Header with user menu
The Header SHALL display a user avatar on the right side. Clicking the avatar opens a DropdownMenu with profile link, settings, theme toggle, and sign out.

#### Scenario: Header renders user menu
- **WHEN** the dashboard layout renders
- **THEN** the header shows the app logo/name on the left and user avatar on the right

#### Scenario: User menu dropdown works
- **WHEN** the user avatar is clicked
- **THEN** a dropdown appears with: Profile, Settings, Sign out

### Requirement: Desktop sidebar layout
On desktop (> 768px), the sidebar SHALL be fixed on the left with the main content area offset by the sidebar width.

#### Scenario: Desktop layout renders
- **WHEN** the viewport is > 768px
- **THEN** sidebar is fixed left, main content has `ml-64` (or `ml-16` when collapsed)

### Requirement: Mobile drawer sidebar
On mobile (< 768px), the sidebar SHALL be hidden by default and slide in as an overlay drawer when triggered by a hamburger button in the header.

#### Scenario: Mobile sidebar opens as drawer
- **WHEN** the hamburger button is clicked on mobile viewport
- **THEN** the sidebar slides in from the left with a backdrop overlay

#### Scenario: Mobile sidebar closes
- **WHEN** the backdrop is clicked or a nav item is selected
- **THEN** the sidebar slides out and the backdrop disappears
