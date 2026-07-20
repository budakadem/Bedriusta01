# BedriLanding Specification

## Overview
- Target file: `src/App.tsx`
- Interaction model: static landing page with anchor navigation, hover/press feedback, responsive layout.

## Visual Direction
- Dark premium restaurant landing page.
- Palette: burgundy `#741b15`, deep wine `#170a08`, cream `#fff7df`, warm sand `#ead5ac`, ember `#c46632`, black-brown `#0c0705`.
- Typography: Heebo for headings/body, Karla for spaced labels and nav.

## Sections
- Header: fixed translucent cream/dark bar depending visual context, central brand image.
- Hero: full first viewport, two-column desktop, stacked mobile, large editorial heading.
- Story: portrait and short Turkish brand copy.
- Menu: four repeated tiles, no branch/location cards.
- Craft: three compact proof items.
- Contact: reservation CTA and service details.
- Footer: required addition with navigation, hours, social/contact.

## Responsive Behavior
- Mobile first.
- At widths below 760px, nav links collapse into a compact label and sections stack.
- All fixed-width values are constrained by `maxWidth` and percentage widths.
- Images use stable aspect ratios and `resizeMode: cover/contain`.
