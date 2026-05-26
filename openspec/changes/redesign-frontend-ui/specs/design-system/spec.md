## ADDED Requirements

### Requirement: Color palette
The design system SHALL define a full neutral gray palette (50–950) and indigo accent palette (50–950) as CSS variables via Tailwind v4 `@theme` directive.

#### Scenario: Gray palette available
- **WHEN** a component uses `bg-gray-100` or `text-gray-900`
- **THEN** the corresponding CSS variable resolves to the correct hex value from the neutral palette

#### Scenario: Indigo accent available
- **WHEN** a component uses `bg-indigo-600` or `text-indigo-500`
- **THEN** the corresponding CSS variable resolves to the correct hex value from the indigo palette

### Requirement: Shadow scale
The design system SHALL define a shadow scale (sm, md, lg, xl, 2xl) using CSS variables in `@theme`.

#### Scenario: Shadow utilities work
- **WHEN** a component uses `shadow-sm` or `shadow-lg`
- **THEN** the browser renders the corresponding box-shadow value

### Requirement: Border radius scale
The design system SHALL define a border radius scale (sm, md, lg, xl, 2xl, full) using CSS variables in `@theme`.

#### Scenario: Radius utilities work
- **WHEN** a component uses `rounded-lg` or `rounded-xl`
- **THEN** the browser renders the corresponding border-radius value

### Requirement: Font families
The design system SHALL define Inter as the primary sans-serif font family and JetBrains Mono as the monospace font family via `@theme`.

#### Scenario: Sans-serif font applies
- **WHEN** the app renders body text
- **THEN** the font-family resolves to Inter (or system sans-serif fallback)

### Requirement: Transition tokens
The design system SHALL define default transition duration and easing curve via CSS variables.

#### Scenario: Transitions are smooth
- **WHEN** a hover state triggers a color or background change
- **THEN** the transition uses the defined duration and easing curve
