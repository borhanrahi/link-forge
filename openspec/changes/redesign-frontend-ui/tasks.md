## 1. Design Tokens (globals.css)

- [x] 1.1 Expand `:root` with full gray palette (50–950) via `@theme` directive
- [x] 1.2 Add indigo accent palette (50–950) via `@theme`
- [x] 1.3 Define shadow scale (sm, md, lg, xl, 2xl)
- [x] 1.4 Define border radius scale (sm, md, lg, xl, 2xl, full)
- [x] 1.5 Set Inter as default font family and JetBrains Mono as monospace
- [x] 1.6 Define transition tokens (duration, easing)
- [x] 1.7 Add semantic color tokens (background, foreground, card, card-foreground, border, muted, muted-foreground, primary, primary-foreground, ring)
- [x] 1.8 Add dark mode overrides for all tokens using `@media (prefers-color-scheme: dark)`

## 2. UI Components

- [x] 2.1 Redesign Button — clean up padding, focus rings, active states, disabled opacity
- [x] 2.2 Redesign Input — consistent h-10, focus ring, error state, disabled state
- [x] 2.3 Redesign Card — subtle shadow, optional hover lift effect via `hover` prop
- [x] 2.4 Redesign Badge — add variants (default, success, warning, danger, info)
- [x] 2.5 Build Avatar component — image + initials fallback, sm/md/lg sizes
- [x] 2.6 Build DropdownMenu — click toggle, positioned panel, outside-click + Escape close
- [x] 2.7 Build Skeleton — pulse animation, className for dimensions
- [x] 2.8 Build Tabs — horizontal tab bar with active indicator, content panels
- [x] 2.9 Build Select — styled native select matching Input styling
- [x] 2.10 Build Dialog — centered modal with backdrop, Escape/backdrop close, animation

## 3. Layout Shell

- [x] 3.1 Add collapsed/expanded state management to Sidebar
- [x] 3.2 Implement collapse toggle button with icon rotation
- [x] 3.3 Style collapsed mode — icons only, tooltips, w-16 width
- [x] 3.4 Style active nav item — gray background + indigo text (no colored backgrounds)
- [x] 3.5 Redesign Header — user avatar right side, app name left side
- [x] 3.6 Wire user avatar to DropdownMenu (Profile, Settings, Sign out)
- [x] 3.7 Implement mobile drawer — hidden by default, slide-over with backdrop
- [x] 3.8 Add hamburger toggle button for mobile in header
- [x] 3.9 Update DashboardLayout to handle sidebar state and mobile mode

## 4. Dashboard Pages

- [x] 4.1 Redesign dashboard home page — clean KPI cards (no colored icon backgrounds), recent links list with proper styling
- [x] 4.2 Redesign Links list page — clean table rows, create-form styling, status badges
- [x] 4.3 Redesign Analytics page — metric cards, date range selector, link performance bars with proper styling
- [x] 4.4 Redesign Bio Pages page — grid cards with hover effects, create-form styling
- [x] 4.5 Redesign QR Codes page — grid/list styling
- [x] 4.6 Redesign Domains page — list styling
- [x] 4.7 Redesign Team page — member list styling
- [x] 4.8 Redesign Billing page — plan cards, invoice list
- [x] 4.9 Redesign Settings page — section styling
- [x] 4.10 Add empty state components to pages that need them
- [x] 4.11 Replace "Loading..." text with Skeleton components on all pages
- [x] 4.12 Add link detail, analytics detail, bio-page editor pages

## 5. Landing Page

- [x] 5.1 Redesign hero section — centered headline, subtitle, two CTAs, no gradients
- [x] 5.2 Redesign feature section — responsive grid with subtle hover cards
- [x] 5.3 Redesign landing nav bar — logo, links, sign in, get started button
- [x] 5.4 Redesign landing footer — links, copyright
- [x] 5.5 Update Features sub-page styling
- [x] 5.6 Update Pricing sub-page styling

## 6. Polish

- [ ] 6.1 Verify all dark mode styles render correctly
- [ ] 6.2 Test responsive layout at mobile, tablet, desktop breakpoints
- [ ] 6.3 Test sidebar collapse/expand on desktop
- [ ] 6.4 Test mobile drawer open/close
- [ ] 6.5 Run `npm run dev` and confirm no TypeScript or build errors
