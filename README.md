# LIGHTNYU — Private Members’ Club

This repository reconstructs the **original public ACTA website** from the user-owned source at https://ikhnaie.anatoliim.chatgpt.site/ as a standalone static frontend. It replaces the earlier starter mock-up and retains the homepage’s layout, public messaging, product journey, example workspace, and login presentation.

## Included

- `index.html` — original ACTA launch page structure, waitlist presentation, live countdown (19 Dec 2026), Send → Deliver → Prove → Reply journey, use-case sections, and calls to action
- `demo.html` — example correspondence/process dashboard with temporary browser-session interactions (select, create, edit, delete, record delivery and replies)
- `login.html` — ACTA login presentation. Secure login links to the existing ACTA service.
- `site.css` — site layout styles recovered from the existing public site (includes Tailwind CSS, MIT licence notice)
- `overrides.css` — requested blue rebrand and removal of decorative header glyph
- `app.js` — countdown, navigation, form handoff, scroll reveal, temporary example-workspace interactions
- `favicon.svg` — LIGHTNYU favicon

## Start

Open `index.html` locally or serve the repository with a static server:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. Static deployment to GitHub Pages or Cloudflare Pages is possible; there is no framework build step.

## Functional scope and important limitations

This is a **frontend reconstruction**, not a migration of the original hosted server or user data. The GitHub version does not have its own authentication provider, database, email-delivery service, waitlist subscription endpoint, or blockchain records. The example workspace is fictional; changes are temporary and stored in browser session storage. The waitlist button intentionally directs users to the live ACTA website rather than falsely claiming that an email was registered. Login also opens the original hosted ACTA service; login sessions cannot be used on the static copy. For a separate, production-ready ACTA backend, those services must be set up under the new deployment.

### Source

The public website was inspected on 19 November 2026. Original backend code and protected account pages were not accessible. Its visual design, copy and public sample data have been reproduced for the owner in this repository.
