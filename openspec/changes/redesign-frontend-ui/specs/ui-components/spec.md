## ADDED Requirements

### Requirement: Button component
The Button component SHALL support variants: default, outline, ghost, destructive. Each variant SHALL have proper hover, focus-visible, active, and disabled states. Focus-visible SHALL show a ring. Disabled SHALL reduce opacity to 50% and disable pointer events.

#### Scenario: Default variant renders correctly
- **WHEN** a Button with `variant="default"` renders
- **THEN** it has a solid indigo-600 background, white text, indigo-700 hover, and focus-visible ring

#### Scenario: Outline variant renders correctly
- **WHEN** a Button with `variant="outline"` renders
- **THEN** it has a transparent background, border, hover background, and focus-visible ring

#### Scenario: Disabled button is non-interactive
- **WHEN** a Button has the `disabled` attribute
- **THEN** it has opacity-50, no pointer events, and no hover effect

### Requirement: Input component
The Input component SHALL support a label, error state, and placeholder. It SHALL have a focus ring and disabled state.

#### Scenario: Input with label renders
- **WHEN** an Input with a `label` prop renders
- **THEN** a `<label>` element appears above the input with the label text

#### Scenario: Input with error renders
- **WHEN** an Input with an `error` prop renders
- **THEN** the input border turns red and an error message appears below

#### Scenario: Input focus state
- **WHEN** the input receives focus
- **THEN** it shows a focus ring (ring-2 ring-indigo-500)

### Requirement: Card component
The Card component SHALL render a container with border, background, rounded corners, and shadow. Optional `hover` prop adds hover lift effect.

#### Scenario: Default card renders
- **WHEN** a Card renders
- **THEN** it has a white background, light border, rounded-xl corners, and subtle shadow

#### Scenario: Card with hover effect
- **WHEN** a Card with `hover` prop renders
- **THEN** it lifts on hover via translateY(-1px) and increased shadow

### Requirement: Badge component
The Badge component SHALL support variants: default, success, warning, danger, info. Each variant SHALL have appropriate background and text colors.

#### Scenario: Success badge renders
- **WHEN** a Badge with `variant="success"` renders
- **THEN** it has a green background tint and green text

#### Scenario: Warning badge renders
- **WHEN** a Badge with `variant="warning"` renders
- **THEN** it has an amber background tint and amber text

### Requirement: Avatar component
The Avatar component SHALL render a user avatar with fallback to initials. It SHALL support sm, md, lg sizes.

#### Scenario: Avatar with image
- **WHEN** an Avatar with a `src` prop renders
- **THEN** it shows the image inside a rounded-full container

#### Scenario: Avatar fallback initials
- **WHEN** an Avatar with `name="John Doe"` but no `src` renders
- **THEN** it shows "JD" initials centered in the circle

### Requirement: DropdownMenu component
The DropdownMenu component SHALL render a trigger button and a positioned menu panel. The panel SHALL appear on click, close on outside click or Escape key.

#### Scenario: Dropdown opens on click
- **WHEN** the trigger is clicked
- **THEN** the menu panel appears below the trigger with z-50

#### Scenario: Dropdown closes on outside click
- **WHEN** the menu is open and user clicks outside
- **THEN** the menu closes

### Requirement: Skeleton component
The Skeleton component SHALL render a pulsing placeholder for loading states. It SHALL support `className` for dimensions.

#### Scenario: Skeleton renders with animation
- **WHEN** a Skeleton renders
- **THEN** it shows a gray rounded rectangle with a pulse animation

### Requirement: Tabs component
The Tabs component SHALL render a horizontal tab bar with active tab indicator. Clicking a tab switches the visible content panel.

#### Scenario: Tabs switch content
- **WHEN** a tab is clicked
- **THEN** that tab becomes active (with underline/bottom border) and the corresponding panel renders

### Requirement: Select component
The Select component SHALL render a styled native `<select>` with consistent styling matching Input.

#### Scenario: Select renders options
- **WHEN** a Select renders with options
- **THEN** it shows a styled dropdown with the same height, border, and focus ring as Input

### Requirement: Dialog component
The Dialog component SHALL render a modal overlay with a centered content panel. It SHALL close on backdrop click and Escape key.

#### Scenario: Dialog opens and closes
- **WHEN** the Dialog trigger is clicked
- **THEN** a backdrop overlay and centered modal panel animate in

#### Scenario: Dialog closes on Escape
- **WHEN** Escape is pressed while dialog is open
- **THEN** the dialog closes
