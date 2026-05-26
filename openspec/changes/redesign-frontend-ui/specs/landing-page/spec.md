## ADDED Requirements

### Requirement: Hero section
The landing page hero SHALL display a centered headline, supporting subtitle, and two CTA buttons (primary solid + outline). The background SHALL be solid white (light) or solid near-black (dark) — NO gradients.

#### Scenario: Hero renders properly
- **WHEN** the landing page loads at `/`
- **THEN** a centered hero section appears with a large bold headline, a descriptive subtitle, and two CTA buttons

### Requirement: Feature section
The landing page SHALL display 3–6 feature cards in a responsive grid. Each card SHALL show an icon, heading, and description. Cards SHALL have subtle hover effects.

#### Scenario: Feature grid renders
- **WHEN** the landing page scrolls past the hero
- **THEN** a section appears with 3–6 feature cards in a responsive grid (1 col mobile, 3 col desktop)

#### Scenario: Feature card hover
- **WHEN** hovering a feature card
- **THEN** the card subtly lifts (translateY) and increases shadow

### Requirement: Navigation bar
The landing page SHALL have a fixed top nav bar with logo, nav links (Features, Pricing), Sign in link, and Get Started button.

#### Scenario: Landing nav renders
- **WHEN** the landing page loads
- **THEN** the top nav bar is visible with all navigation elements

### Requirement: Footer
The landing page SHALL have a footer with copyright, product links, and social links.

#### Scenario: Footer renders
- **WHEN** the landing page loads
- **THEN** a footer section appears at the bottom with content links and copyright
