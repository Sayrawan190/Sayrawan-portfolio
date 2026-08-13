# Portfolio + Dashboard

A React rewrite of the original portfolio site. It keeps the original dark
purple/cyan theme and layout, but every piece of content (profile, skills,
projects, experience, certificates) is now stored as data and editable from a
built-in `/dashboard` page — no more editing HTML by hand.

## What changed from the original site

- Same visual design, colors, fonts, spacing, cards, and section layout —
  carried over from `style.css` almost unchanged.
- Content is no longer hard-coded in `index.html` / `app.js`. It now lives in
  `localStorage`, with the original content as the default the very first
  time the site loads.
- A `/dashboard` route was added with forms to add, edit, and delete every
  section of the site.
- English/Arabic language toggle still works the same way (the globe button),
  now driven by React state instead of manually swapping `data-i18n` text.

## Project structure

```
src/
  main.jsx                Entry point
  App.jsx                 Router + global providers
  index.css               Theme (carried over) + dashboard styles
  data/
    defaultData.js         Default content (mirrors the original site)
    uiText.js               Static interface text (nav labels, buttons, etc.)
  context/
    LangContext.jsx         Language state (en/ar) + persistence
    DataContext.jsx         All portfolio data + CRUD, persisted to localStorage
    ToastContext.jsx         "Saved" notifications in the dashboard
  utils/
    storage.js, id.js, field.js, useRevealOnScroll.js
  components/               Public-facing portfolio sections
    Header, Hero, About, Skills, Projects, Experience, Certificates, Contact
  pages/
    PortfolioPage.jsx        Assembles the public site
    DashboardPage.jsx        Dashboard routing
  dashboard/
    DashboardLayout.jsx      Sidebar + page frame
    ProfileEditor.jsx
    SkillsEditor.jsx
    ProjectsEditor.jsx
    ExperienceEditor.jsx
    CertificatesEditor.jsx
    components/              Shared dashboard building blocks
      LocalizedField.jsx      Paired EN/AR text input
      ImageInput.jsx           URL field + file upload (stored as base64)
      FormModal.jsx            Add/edit modal
      ConfirmDialog.jsx        Delete confirmation
```

## How to run it

You need Node.js 18+ installed.

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

To build a production version you can upload to any static host:

```bash
npm run build
```

This creates a `dist/` folder — upload its contents anywhere that serves
static files (GitHub Pages, Netlify, Vercel, a plain web host, etc.). The app
uses hash-based routing (`/#/dashboard`), so it works correctly even on hosts
with no server-side routing configuration.

## How to open the dashboard

Click the **Dashboard** button in the site's top navigation, or go directly
to `/#/dashboard` in the browser.

From there:
- **Profile** — photo, name, headline, intro text, About Me, CV link, social
  links, phone, and the "quick summary" bullet points.
- **Skills** — add/rename/delete categories, and add/edit/delete skills
  inside each one.
- **Projects** — add/edit/delete project cards (name, description,
  technologies, image, link). Cards with a link open it in a new tab when
  clicked on the public site.
- **Experience** — add/edit/delete timeline entries, with a "Present"
  checkbox for ongoing roles.
- **Certificates** — add/edit/delete certificates, each openable in a modal
  on the public site.

Every save shows a small "Changes saved" confirmation and updates the public
site immediately (open two tabs to see it live).

## Images

For photos, project images, and certificate images you can either:
- Paste a direct image URL, or
- Use the **Upload** button to pick a file from your computer — it's
  converted to a data URL and stored in `localStorage` (keep uploads under
  ~1.5MB each so you don't run into browser storage limits).

## Data storage & resetting

Everything is stored in the browser's `localStorage` under two keys:
`portfolio_data_v1` (content) and `portfolio_lang_v1` (language). This means:
- Data is per-browser, not shared between devices, and isn't backed up
  anywhere automatically.
- Clearing your browser data will remove it.

To reset everything back to the original default content, go to
**Dashboard -> Profile** and use the **"Reset to defaults"** button at the
bottom (it asks for confirmation first). You can also do this manually from
the browser console:

```js
localStorage.removeItem("portfolio_data_v1");
location.reload();
```

## Connecting a real backend later

All reads/writes go through `src/context/DataContext.jsx` and
`src/utils/storage.js`. To move to a real backend, you'd replace the
`loadJSON` / `saveJSON` calls in `DataContext.jsx` with API calls (e.g.
`fetch`) — the rest of the app (all the editors and portfolio components)
doesn't need to change, since they only ever talk to `useData()`.
