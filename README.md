# Licensing Florida — Site Rebuild

Clean rebuild of the saved theme export into a **Licensing Florida** website for clinics and medical locations.

## Quick Start

Open the site locally:

```bash
cd site
python3 -m http.server 8080
```

Then visit: http://localhost:8080

Or simply open `site/index.html` in your browser.

## Project Structure

```
site/
├── index.html              # Main landing page
├── css/styles.css          # Clean, responsive styles
├── js/main.js              # Mobile menu, FAQ, contact form
├── assets/images/          # Healthcare images from original theme
└── content/
    └── licensing-checklist.md   # Organized licensing steps from your notes

_archive/original-export/   # Old saved NP Collaborator files (tracking scripts, minified bundles)
```

## What Changed

| Before | After |
|--------|-------|
| Messy browser save of NP Collaborator | Clean Licensing Florida branding |
| 22+ tracking/analytics scripts | Zero third-party scripts |
| Minified React bundle (not editable) | Simple HTML/CSS you can edit |
| UUID image filenames | Organized `assets/images/` folder |
| Empty placeholder files | Removed to `_archive/` |

## Your Licensing Content (Organized)

**Step 1 — Business:** Certificate of Use, WASD, DERM, Miami-Dade Business Tax (LBT), Municipal COU

**Step 2 — Medical Clinic:** HCA Standard/Exempt, Medicare, Medicaid, CLIA Lab, additional licenses & staffing

Full details: `site/content/licensing-checklist.md`

## Next Steps for You

1. Replace placeholder email (`info@licensingflorida.com`) with your real contact
2. Add your logo (replace the "LF" text mark in the header)
3. Connect the contact form to a backend (Formspree, Netlify Forms, etc.)
4. Deploy to Vercel, Netlify, or any static host

## Design Notes

Visual style inspired by the original theme:
- Primary blue: `#4052FF`
- Accent: `#00A3FF`
- Success green: `#22C55E`
- Clean healthcare aesthetic with gradient hero
