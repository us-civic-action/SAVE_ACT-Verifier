
# System Architecture & Workflows: SAVE Act Verifier

> *Reference documentation for the US Civic Action `SAVE_ACT-Verifier` application.*

## 1. System Overview

The **SAVE Act Verifier** is a client-side Single Page Application (SPA) built to help users verify their voter eligibility under the SAVE Act of 2026.

* **Type:** Static Web Application (SPA)
* **Core Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (via CDN in `index.html`) + Lucide React Icons
* **Hosting:** GitHub Pages via GitHub Actions

### Key Architectural Decisions

1. **Zero-Knowledge / Privacy-First:**
    * There is **no backend database**.
    * All eligibility logic runs entirely in the user's browser (`App.tsx`).
    * User inputs (state selection, answers) are stored in React state only and wiped on refresh.
    * Accessibility preferences are persisted in `localStorage`.

2. **Shared Theming:**
    * The application shares a visual identity with the **Legislate** app (US Civic Action).
    * It uses specific color palettes (`nh-green`, `granite`, `freedom-blue`) defined in the Tailwind configuration within `index.html`.
    * The Header component is synchronized with the main US Civic Action platform.

3. **Cross-Linking:**
    * Contains reciprocal links to the **US Civic Action App** (Legislate) in the "Projects" dropdown.

---

## 2. Workflows

### A. Development Workflow

To run the application locally:

1. **Install Dependencies:**

    ```bash
    npm install
    ```

2. **Start Dev Server:**

    ```bash
    npm run dev
    ```

    * Access at: `http://localhost:3000` (or `http://localhost:5173`)

### B. Deployment Workflow

The application is deployed automatically to **GitHub Pages** whenever changes are pushed to the `main` branch. This logic is defined in `.github/workflows/deploy.yml`.

* **Trigger:** Push to `main` branch.
* **CI/CD Tool:** GitHub Actions.
* **Configuration File:** `.github/workflows/deploy.yml`

**Process:**

1. **Checkout:** The action checks out the code.
2. **Build:** Runs `npm run build` (Vite build).
    * *Note:* `vite.config.ts` handles the base path logic. It detects if it's running on Vercel or GitHub Pages and adjusts the `base` URL accordingly (`/SAVE_ACT-Verifier/` for GitHub Pages).
3. **Upload:** Uploads the `dist/` folder as a build artifact.
4. **Deploy:** Publishes the artifact to GitHub Pages.

### C. Theming & Styling Workflow

Styles are managed differently than a standard Tailwind setup to allow for easy "drop-in" usage without a complex build step for CSS.

* **Configuration:** The Tailwind configuration is **inline** within `index.html` (script tag).
  * *Why?* Allows for rapid prototyping and runtime adjustments without a PostCSS build step.
* **Dark Mode:** Implemented via the `class` strategy. The `App.tsx` component toggles the `.dark` class on the `<html>` document element based on user preference.
* **Fonts:** Uses `Inter` via Google Fonts CDN.

---

## 3. Directory Structure

* **/src**
  * `App.tsx`: Main application logic, routing (state-based view switching), and UI rendering.
  * `constants.ts`: distinct "database" file containing state rules, questions, and document lists. **Edit this to update eligibility logic.**
  * `assets/`: Images and static resources.
* `vite.config.ts`:/ Configuration for the Vite build tool. Key variable: `base`.
* `.github/workflows`: Contains the CI/CD pipeline definitions.

## 4. Troubleshooting

* **Deployment 404s:**
  * Ensure the `base` in `vite.config.ts` matches the repository name (`/SAVE_ACT-Verifier/`).
  * Check `deploy.yml` to ensure it is targeting the correct branch (`main`).

* **Styling Issues:**
  * Since Tailwind is loaded via CDN, custom utility classes must be defined in the `tailwind.config` script tag in `index.html`, not a `tailwind.config.js` file.

---
*Maintained by US Civic Action Engineering*
