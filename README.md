# mail

A responsive, unified email dashboard built with React, Vite, Tailwind CSS, React Router, Lenis, and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. For a production build, run `npm run build`.

## What's included

- Sign in, sign up, and forgot password screens with client-side validation and password visibility.
- A unified inbox with 20 sample messages each for Gmail, iCloud, and Outlook.
- Account and folder filtering, search, sorting, unread and attachment views, and bulk actions.
- Message details, star/save, read status, archive, trash, reply, forward, drafts, and compose with To/CC/BCC and attachment selection.
- Favorites, saved messages, and all sample attachments in the right-side cards.
- A fixed-height dashboard with smooth, scrollbar-free scrolling inside the sidebar, mail, files, and quick-access cards.
- Responsive layouts, mobile navigation, loading and empty states, and light/dark themes with an 820 ms curved wave reveal, persisted preferences, reduced-motion support, and guarded rapid toggling.

## Verification

Run `npm test` for the theme transition and mail workflow checks. Run `npm run build` to generate the production app.

Component tests cover combined and individual account filtering, bulk archive and restore, draft editing and sending, attachment removal, account creation, theme persistence, snapshot timing, overlapping toggles, fallback behavior, and wave coverage at 320, 768, 1024, and 1440 px. These tests do not replace visual browser checks of layout or Lenis scrolling.

This is a frontend demo. Messages, account preferences, and drafts are saved in browser local storage. Files you attach are stored locally in IndexedDB and can be downloaded again, including after a reload. Seeded attachments offer explicitly labeled sample notes downloads. Adding an account does not sign in to a provider, and sending only updates the demo Sent folder. Live OAuth, sync, and delivery require a backend.
