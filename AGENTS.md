# Repository Instructions

## Setup

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Product scope

SettleKit is a frontend product prototype for helping newcomers think through possible healthcare coverage gaps when moving to the United States. It is an educational planning interface, not an insurer, broker, medical provider, immigration service, or professional-advice system.

## Key files

- `src/main.tsx`: React entry point.
- `src/app/App.tsx`: application shell.
- `src/app/components/LandingPage.tsx`: navigation, product story, scroll experience, and marketing sections.
- `src/app/components/DashboardTool.tsx`: interactive planning dashboard.
- `src/styles/index.css`: Tailwind and global styling.
- `index.html`: metadata, structured data, and application root.
- `docs/images/settlekit-readme-hero.svg`: repository presentation asset.
- `public/robots.txt` and `public/llms.txt`: crawler and machine-readable product information.

## Evidence and safety rules

- Source every factual claim about coverage, waiting periods, eligibility, prices, debt, savings, or outcomes.
- Record jurisdiction, source, and verification date.
- Treat current metrics and testimonials as placeholders unless proven otherwise.
- Never present educational scenarios as personalized insurance, medical, legal, immigration, tax, or financial advice.
- Do not collect sensitive health, visa, employment, or financial information without a reviewed privacy and retention model.

## Engineering conventions

- Keep dashboard assumptions centralized and visible.
- Separate factual content from decorative marketing copy.
- Prefer typed scenario data over duplicated literals.
- Preserve reduced-motion fallbacks for scroll effects.
- Keep the landing page usable when animations fail or are disabled.
- Do not add a backend until data requirements and compliance boundaries are defined.

## Accessibility

- Preserve semantic headings and keyboard navigation.
- Ensure the mobile menu does not trap focus.
- Keep motion optional.
- Do not hide essential claims or disclaimers inside animated-only states.
- Maintain readable contrast and touch targets.

## Verification

Before meaningful changes:

1. Run `npm run build`.
2. Test navigation and dashboard interactions.
3. Test mouse, keyboard, touch, and reduced-motion behavior.
4. Review mobile layouts.
5. Validate metadata and structured data.
6. Audit every numeric and testimonial claim.
7. Confirm CTAs do not imply that a prototype is a live service.
8. Verify privacy and terms before collecting any user data.

## Do not

- Do not claim verified insurance eligibility or pricing.
- Do not publish placeholder testimonials as real.
- Do not imply guaranteed savings, approval, or coverage.
- Do not present the repository hero as a browser screenshot.
- Do not deploy sensitive-data collection without legal and security review.