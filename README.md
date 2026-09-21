# Licences in Florida

Private backup of the public website and admin console. This repo is **not** connected to Vercel, so pushes do not change https://licencesinflorida.com.

## Folders

```
site/    Public website (HTML/CSS)
admin/   Operations console (Next.js)
```

## Run locally

Website:

```bash
cd site
python3 -m http.server 8080
```

Admin:

```bash
cd admin
npm install
npm run dev
```

Then open http://localhost:8080 and http://localhost:3000/admin/login.

## Submit a change from another computer (pull request)

1. Ask the repo owner to invite your GitHub username as a collaborator.
2. Clone the repo and create a branch — do not commit straight to `main`:

```bash
git clone https://github.com/Marketing1527/licences-in-florida.git
cd licences-in-florida
git checkout -b your-name/short-description
```

3. Make your edits, then commit and push the branch:

```bash
git add -A
git commit -m "Describe why you made the change"
git push -u origin HEAD
```

4. Open a pull request: https://github.com/Marketing1527/licences-in-florida/compare
5. The owner reviews it and merges. Only a merge to `main` should be treated as approved.

Never commit `.env.local`, passwords, or `node_modules`.
