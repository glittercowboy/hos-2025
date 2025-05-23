# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Heart of Sound is a static HTML/CSS/JavaScript website for a 12-week music production course. This is a pure frontend site with no build process or backend dependencies.

## Architecture

### File Structure
- Main pages: `index.html` (landing), `apply.html` (application form)
- Styles: `assets/css/` - Uses CSS variables for theming, custom grid system
- Scripts: `assets/js/` - Vanilla JavaScript, no frameworks
- Images: `assets/images/` - Organized by purpose (brand-logos, clients-photos, etc.)

### Key Technical Patterns

**CSS Architecture**
- CSS Variables defined in `:root` for colors, spacing, typography
- 12-block custom grid system (`.width-8`, `.width-10`, `.width-12`)
- Mobile breakpoints: 576px, 992px
- Separate mobile fixes file for responsive overrides

**JavaScript Approach**
- Event-driven vanilla JS
- Progressive enhancement (animations, smooth scrolling)
- LocalStorage for form state persistence
- No build tools or transpilation needed

**Form Handling**
- Formspree integration for application submissions
- Multi-step form with progress tracking
- Facebook Pixel for conversion tracking

## Development Workflow

### Making Changes
Since this is a static site, simply edit files directly:
1. Edit HTML/CSS/JS files with any text editor
2. Open `index.html` in a browser to preview changes
3. Test responsive design at 576px and 992px breakpoints

### Common Tasks
- **Add new sections**: Follow existing section patterns in index.html
- **Update styles**: Maintain CSS variable usage for consistency
- **Add images**: Place in appropriate `assets/images/` subdirectory
- **Modify forms**: Update both HTML and corresponding JS validation

### Testing
- No automated tests - manual browser testing required
- Check cross-browser compatibility (Chrome, Firefox, Safari)
- Verify mobile responsiveness using browser dev tools

## Important Conventions

**Typography Hierarchy**
- Hero h1: Canela font family
- All other headings: Inter font family
- Body text: Inter for general content

**Component Patterns**
- Cards: `.card` class with consistent padding/shadow
- Sections: Alternating background colors using `.section-black`
- Buttons: `.button` and `.button-gold` classes
- Grid layouts: Use existing `.width-*` classes

**Image Handling**
- Use WebP format where possible
- Implement lazy loading for below-fold images
- Maintain organized subdirectories in `assets/images/`

## Development Guidance

- Commit with a descriptive message after completing each task I ask you to.