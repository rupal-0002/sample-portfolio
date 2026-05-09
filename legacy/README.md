# Modern Portfolio Website

A clean, responsive, and modern portfolio website designed for a Computer Science & AI student. Built with semantic HTML5, CSS3, and Vanilla JavaScript.

## 🚀 Features

- **Responsive Design**: Mobile-first approach, fully responsive on all viewport sizes perfectly.
- **Dark Theme**: Sleek dark UI with an electric blue (`#00BFFF`) accent color to fit the AI/tech aesthetic.
- **Smooth Animations**: Implementing `Intersection Observer API` for performant scroll-based fade-in effects.
- **Zero External JS Libraries**: Lightweight relying purely on Vanilla Javascript for form validation, mobile menu, and animations.
- **Easily Configurable**: HTML structure is easy to modify and replace with your information.

## 📁 Project Structure

```text
portfolio/
├── index.html       # Main HTML file containing all sections
├── css/
│   └── style.css    # All styling, variables, and responsive media queries
├── js/
│   └── main.js      # Intersection Observer, mobile nav, and form validation logic
└── assets/          # Directory to store images and icons (empty by default)
```

## 🛠️ Setup & Customization

This project uses placeholder data. To make it your own, open `index.html` and search for the following sections to update:

1. **Brand/Logo**: Look for `<a href="#hero" class="logo">Dev<span>AI</span></a>`.
2. **Hero Section**: Replace `[Your Name]` and the tagline text.
3. **About Section**: 
   - Update `[University Name]` and the bio text.
   - Replace the `src` attribute of the profile image with your own photo.
4. **Skills**: Add or remove `skill-item` divs. The icons are provided via Font Awesome (e.g., `<i class="fab fa-python"></i>`).
5. **Projects**: For each `project-card`:
   - Replace the image `src`.
   - Update title, description, and tags.
   - Update the repo and demo links.
6. **Education**: Update `[University Name Placeholder]` and coursework. Add more `timeline-item` divs for additional experiences.
7. **Contact**: Replace `your.email@example.com` and update the `href` on the social media links.

## 🎨 Theme Customization

To change the color theme, open `css/style.css` and modify the CSS variables at the top of the file:

```css
:root {
    --bg-color-main: #0B0F19; 
    --bg-color-secondary: #1A2235;
    --accent-color: #00BFFF; /* Change this for a different accent! */
}
```

## 🌐 Running Locally

You do not need an asset bundler or complex local server. Simply double-click `index.html` to open it in your browser, or if using an editor like VS Code, use an extension like **Live Server**. Python users can run `python -m http.server 3000` inside this directory.

## 📄 License
This complete project template is open-sourced and free to use for personal portfolios.
