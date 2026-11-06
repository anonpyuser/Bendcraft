# Bendcraft — Conduit & Trade Calculator

A mobile-friendly field calculator for electricians. Bendcraft is a static HTML/CSS/JavaScript application with no server or build dependencies.

## Features

- Offset, rolling offset, 3-point and 4-point saddle, 90° stub-up, back-to-back 90s, kick 90, and segmented bend calculations
- Inches and millimeters, with fractional-inch display
- Construction calculator for feet, inches, fractions, conversions, area, volume, rise/run, and equal spacing
- Saved bend calculations and calculator tape using your browser's local storage
- iPhone-friendly layout and **Add to Home Screen** support
- Persistent bottom navigation between Home, Bending Calculator, and Workman's Calculator, with the active tab highlighted
- A dedicated Home hub for launching existing and future field tools
- Built-in touch keypad for both calculators with large number buttons, backspace, clear, next-field navigation, and one-tap common fractions (plus optional sixteenths)
- Unit-entry buttons in the trade calculator; on touchscreens, measurement fields use the app keypad instead of invoking the phone keyboard

## Run locally

Open `home.html` to start from the app hub, or open `index.html` for the bending calculator. For full browser features (especially clipboard, manifest, and installability), run a local static web server or host the site with HTTPS.

## Publish with GitHub Pages

1. Create a GitHub repository named `Bendcraft` and upload the **files in this folder** to its root (not the ZIP itself).
2. On GitHub, open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**. Select the `main` branch, `/ (root)`, and click **Save**.
4. Once deployment completes, the repository URL will typically be `https://YOUR-USERNAME.github.io/Bendcraft/`.
5. On iPhone, open the site in Safari and choose **Share → Add to Home Screen**. Installed Bendcraft opens the Home hub; the bottom bar switches between tools.

The site uses relative file paths, so it works at a GitHub Pages project URL as well as the root of a domain.

## Files

| File | Purpose |
| --- | --- |
| `home.html` | App launcher/home hub for current and future tools |\n| `app-tabs.css` | Shared fixed bottom navigation with iPhone safe-area support |\n| `index.html` | Conduit-bending calculator interface |
| `app.js` | Bend calculation logic and saved calculations |
| `calculator.html` | Construction calculator interface |
| `trade-math.js` | Mixed-unit measurement math |
| `trade-ui.js` | Construction calculator interactions and tape |
| `measurement-keypad.js` | Shared touch-first number, unit, and quick-fraction entry |\n| `measurement-keypad.css` | Shared keypad layout and tap-target styling |\n| `manifest.json` | Web app metadata |
| `.nojekyll` | Bypass unnecessary Jekyll processing on GitHub Pages |

## Field accuracy

Calculations use theoretical centerline geometry unless otherwise noted. Confirm bender take-up, shoe radius, star/arrow conventions, minimum spacing, and job-specific requirements with the actual tool and manufacturer before fabricating conduit.

## Data privacy

Saved calculations reside in browser storage on the device where they were entered. They are not synced between devices or stored in GitHub.