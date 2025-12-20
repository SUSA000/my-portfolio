# Personal Portfolio Website

A professional, responsive, and accessible single-page portfolio built with HTML, CSS, and vanilla JavaScript.

## Features
- Responsive layout (mobile-first)
- Semantic HTML and ARIA attributes
- Dark/light theme toggle (with persistence)
- Dynamic project section loaded from JSON
- Accessible, validated contact form
- Scroll-to-top button
- Modular, customizable styles

## Project Structure
```
Porthfoliosite/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   ├── img/            # Place profile.jpg, favicon.png, og-image.jpg here
│   └── data/
│       └── projects.json
└── README.md
```

## Getting Started
1. Clone or download the repository.
2. Open in VS Code.
3. Add your images to `assets/img/`:
   - `profile.jpg` (square headshot ~600x600)
   - `favicon.png` (32x32)
   - `og-image.jpg` (Open Graph preview ~1200x630)
4. Update meta tags in `index.html` (title, description, URLs, social links).
5. Edit `projects.json` with your real projects.

## Running Locally
You can simply open `index.html` in a browser. For fetch-based features (projects JSON) some browsers block local file fetch. Use a simple local server.

### PowerShell (Windows)
```
# Python 3 installed
python -m http.server 5500
# or if Python 3.11+ may be py instead
py -m http.server 5500

# Node (if installed)
npx serve .
```
Visit: http://localhost:5500

### VS Code Extension Alternative
Install "Live Server" extension and click "Go Live" on `index.html`.

## Customization
- Replace placeholder text ("Your Name") in `index.html`.
- Adjust color palette in `:root` (and `.dark-theme`) inside `styles.css`.
- Add/remove skill items in the Skills list.
- Add timeline items in Experience section (`index.html`).
- Extend projects fields in `projects.json` (e.g., add `image` and render in JS).

## Deployment
### GitHub Pages
1. Commit and push to a GitHub repository.
2. In repo settings, enable Pages (select `main` branch root).
3. Your site becomes available at `https://username.github.io/reponame`.

### Netlify
1. Drag and drop the folder into Netlify dashboard or connect repository.
2. Netlify auto deploys. Configure site name & domain.

### Vercel
1. Import repository in Vercel dashboard.
2. Deploy as a static project.

## Performance Tips
- Compress images (WebP or optimized JPEG/PNG).
- Inline critical CSS for above-the-fold content if needed.
- Use `loading="lazy"` for non-critical images.
- Add a `service-worker.js` for asset caching (future enhancement).

## Accessibility Checklist
- Ensure sufficient color contrast (test dark/light modes).
- Test keyboard navigation (Tab through links and form fields).
- Use screen reader (NVDA/VoiceOver) to verify landmark & heading structure.

## Future Improvements
- Add project filtering by tags.
- Add blog section (Markdown -> static HTML).
- Service worker + offline caching.
- Contact form backend (Formspree, Netlify Forms, API endpoint).
- Unit tests for form validation logic.
- Add CI workflow (GitHub Actions) for linting & deployment.

## License
MIT License – Feel free to use and adapt.

## Author
Built by Your Name. Connect on [LinkedIn](https://linkedin.com/in/yourusername) or [GitHub](https://github.com/yourusername).
