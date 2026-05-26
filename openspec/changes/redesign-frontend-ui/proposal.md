## Why

The frontend is functionally complete but visually bare-bones — minimal CSS variables, no design system, basic components, and a sparse layout. The current KPI cards use colored icon backgrounds (indigo-100/green-100) that look dated, the landing page has no visual hierarchy, and there are zero micro-interactions. For a SaaS product in the link-management space, the UI needs to feel polished and trustworthy to convert visitors and retain dashboard users.

## What Changes

- **Expanded design tokens**: Full color palette, shadow scale, radius scale, transition tokens, font families in CSS variables
- **Rebuilt UI component library**: Button, Input, Card, Badge, Avatar, DropdownMenu, Tabs, Skeleton, Table, Select — following a clean, neutral aesthetic with proper focus rings, hover states, and animation
- **Layout shell redesign**: Collapsible sidebar, proper header with search + user dropdown, workspace switcher, mobile-responsive adaptation
- **Dashboard pages polish**: All 10 dashboard pages restyled — clean KPI metrics with no colored backgrounds, proper tables, empty states, loading skeletons
- **Landing page redesign**: Professional hero with clear value prop, feature sections with minimal iconography, no gradient backgrounds
- **Micro-interactions**: Subtle hover/focus transitions, skeleton loaders, toast animations, page transitions

## Capabilities

### New Capabilities
- `design-system`: Design tokens (CSS variables, color palette, shadows, radii, transitions) and theme configuration
- `ui-components`: Reusable component library — Button, Input, Card, Badge, Avatar, DropdownMenu, Tabs, Skeleton, Table, Select, Dialog
- `layout-shell`: Sidebar, Header, workspace switcher, collapsed/expanded modes, responsive behavior
- `landing-page`: Professional landing page with hero, features section, footer
- `dashboard-pages`: Styled dashboard pages — Links, Analytics, Bio Pages, QR Codes, Domains, Team, Billing, Settings

### Modified Capabilities
- _(none — no existing spec-level capabilities are changing)_

## Impact

- **Frontend only**: All changes are in `frontend/` — no backend modifications
- **Tailwind v4 CSS-first config**: Currently no `tailwind.config.ts` (v4 uses CSS `@theme` directive) — will add theme variables in `globals.css`
- **CSS variables**: Expanding `:root` in `globals.css` — existing tokens renamed/migrated
- **Component API**: Existing `Button`, `Input`, `Card`, `Badge` APIs maintained but restyled; new components added
- **Layout**: `Sidebar` and `Header` redesigned — `DashboardLayout` wrapper updated
- **All pages**: Styling changes only — data fetching logic, hooks, and mock data untouched
