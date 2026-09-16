---
name: Tactile Precision Dark
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#dac2b1'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#a28d7d'
  outline-variant: '#544436'
  surface-tint: '#ffb779'
  primary: '#ffb97c'
  on-primary: '#4c2700'
  primary-container: '#f49638'
  on-primary-container: '#633500'
  inverse-primary: '#8e4e00'
  secondary: '#c8c6c7'
  on-secondary: '#303031'
  secondary-container: '#49494a'
  on-secondary-container: '#bab8b9'
  tertiary: '#4ad8ff'
  on-tertiary: '#003542'
  tertiary-container: '#00bce3'
  on-tertiary-container: '#004757'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc1'
  primary-fixed-dim: '#ffb779'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6c3a00'
  secondary-fixed: '#e5e2e3'
  secondary-fixed-dim: '#c8c6c7'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474647'
  tertiary-fixed: '#b4ebff'
  tertiary-fixed-dim: '#43d6fe'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e5f'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
This design system utilizes a sophisticated **Dark Neumorphic** aesthetic, blending mechanical precision with digital luxury. The style emphasizes physical interaction through subtle extrusion and recession of UI elements, suggesting a high-end hardware interface. The target audience includes professionals in fintech, engineering, and design who value technical depth and sensory feedback. The emotional response is one of grounded authority, reliability, and tactile satisfaction. All components appear as if they are milled from a single, dark matte substrate, illuminated by a warm, high-energy orange accent.

## Colors
The palette is centered on a "Deep Carbon" foundation. The primary background is a true near-black, while surfaces and containers use a slightly elevated dark gray to enable neumorphic shadow depth. 

- **Primary (#F49638):** Used sparingly for critical actions, active states, and high-priority indicators. 
- **Surface Strategy:** Layers are defined by light and shadow rather than high-contrast color shifts.
- **Accessibility:** Text colors are strictly enforced to maintain a 7:1 contrast ratio for body text and 4.5:1 for large display text against the dark substrate.

## Typography
The typography uses **Hanken Grotesk** exclusively to maintain a sharp, contemporary, and engineered feel. 

- **Headlines:** Set with tighter letter spacing and heavier weights to feel "stamped" into the interface.
- **Body:** Generous line height ensures readability against the dark background.
- **Labels:** Uppercase styling is used for technical data points and secondary metadata to mimic industrial labeling.

## Layout & Spacing
The layout follows a strict 8px grid system, reinforcing the "Precision" narrative. 

- **Grid:** A 12-column fluid grid on desktop, collapsing to a 4-column grid on mobile.
- **Consistency:** Padding within cards and containers must always be a multiple of 8px to maintain vertical rhythm.
- **Safe Areas:** Large margins (48px+) on desktop are encouraged to let the neumorphic forms breathe and prevent the interface from feeling cluttered.

## Elevation & Depth
Elevation is achieved through **Neumorphism** adjusted for dark mode. Instead of traditional drop shadows, elements use dual-source light simulation:

- **Top-Left Highlight:** A subtle `1px` or `2px` spread shadow using a lighter gray (`#2A2A2B`) at 50-80% opacity.
- **Bottom-Right Shadow:** A deeper, soft shadow using pure black (`#000000`) at 100% opacity.
- **Recessed States:** For inputs and pressed buttons, the shadows are reversed (Inner Shadows) to simulate the element being pushed into the surface.
- **Flat Surfaces:** Used for lowest-level background; all interactive components must sit at a minimum of Level 1 elevation.

## Shapes
In accordance with the "Round Eight" specification, this design system uses a base radius of **0.5rem (8px)**.

- **Standard Elements:** Buttons, inputs, and small cards use the `8px` radius.
- **Large Containers:** Modals and feature cards use `16px` (rounded-lg) or `24px` (rounded-xl) to soften the technical aesthetic.
- **Consistency:** Sharp corners are prohibited; every edge should feel machined and finished.

## Components
- **Buttons:** Primary buttons use the `#F49638` accent with dark text for maximum contrast. Secondary buttons are neumorphic "extrusions" with light gray text. Active/Pressed states must switch to an "inset" shadow.
- **Inputs:** Use recessed (inner shadow) styling to suggest a physical cavity. The cursor and focus ring use the Primary accent.
- **Chips:** Flat surfaces with a subtle 1px border (`#2A2A2B`) to distinguish them from the main background without adding heavy elevation.
- **Cards:** Must feature the dual-shadow neumorphic effect. Content inside cards should be padded at `24px`.
- **Lists:** Separated by thin, low-opacity lines (`rgba(255,255,255,0.05)`) rather than heavy borders.
- **Progress Indicators:** High-contrast `#F49638` bars against a recessed track to emphasize the technical "instrument" feel.