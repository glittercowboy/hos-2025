# Heart of Sound - Course Website

This is a clean, modern website for the "Heart of Sound" music production course. The site is designed to be easily editable and mobile-responsive.

## File Structure

- `index.html`: The main HTML file containing all content and structure
- `styles.css`: All styling with clear comments and organized sections
- `script.js`: JavaScript for animations and interactivity
- `/images`: Directory for all images (you will need to add your own)
- `/fonts`: Directory for custom fonts (you will need to add your own)

## How to Edit

### Content

To modify the content, simply edit the `index.html` file. The file is well-commented with sections like:

```html
<!-- #1 Hero Section (1 column - 12 blocks wide) -->
<!-- #2 Two Types of Artist Section (2 columns - 6 blocks each, 12 blocks total) -->
<!-- etc. -->
```

Each section is clearly labeled to help you find what you need to edit.

### Block Width System

The website uses a 12-block grid system that allows different sections to have different widths:

- **8 blocks wide** (`width-8`): Narrower sections for better readability (used for text-heavy sections)
- **10 blocks wide** (`width-10`): Medium-width sections (used for two-column layouts with 5 blocks each)
- **12 blocks wide** (`width-12`): Full-width sections (used for large layouts like the hero or 3-column sections)

To change a section's width, modify the container class in the HTML:

```html
<div class="container width-8">  <!-- 8 blocks wide -->
<div class="container width-10"> <!-- 10 blocks wide -->
<div class="container width-12"> <!-- 12 blocks wide (full width) -->
```

### Styling

The website uses a dynamic styling system that makes it easy to change colors, fonts, and sizes across the entire site from a few central locations:

#### Colors

To change the website colors, edit the variables at the top of `styles.css`:

```css
:root {
    --color-black: #1d1d1d;
    --color-white: #efefef;
    --color-accent: #e6ac55;
    --color-secondary: #35482a;
    --color-tertiary: #e2725b;
    /* ... */
}
```

#### Block Widths

To adjust the maximum width of the site or the block width proportions:

```css
:root {
    --max-site-width: 1440px; /* Maximum width of the entire site */
    --block-width: calc(var(--max-site-width) / 12); /* Width of a single block */
    --container-width-12: var(--max-site-width); /* 12 blocks wide (full width) */
    --container-width-10: calc(var(--block-width) * 10); /* 10 blocks wide */
    --container-width-8: calc(var(--block-width) * 8); /* 8 blocks wide */
    /* ... */
}
```

#### Font Sizes

To adjust font sizes across the site, edit these variables:

```css
:root {
    --font-size-base: 16px;
    --font-size-ratio: 1.25; /* Major third ratio */
    /* ... */
}
```

- The `--font-size-base` is the base font size (default: 16px)
- The `--font-size-ratio` is the major third scale ratio (default: 1.25)

All headings and text automatically scale based on these two values.

### Custom Fonts

To add your custom Canela Text font:

1. Place the font files in the `/fonts` directory
2. Uncomment the `@font-face` declaration at the bottom of `styles.css`
3. Update the paths if necessary

## Mobile Responsiveness

The website is fully mobile-responsive. The breakpoints are:

- Tablets: 992px
- Mobile: 576px

The CSS automatically adjusts layouts, font sizes, and spacing for different screen sizes.

## Features

- Clean, modern design following your specifications
- 12-block grid system with adjustable section widths (8, 10, and 12 blocks)
- No drop shadows or rounded corners
- Card padding of at least 20px
- Full caps for all headers
- Major third font size ratio
- Easy to adjust global styling variables
- Subtle button hover animations (color change + scale)
- Section fade-in animations on scroll
- Alternating section background colors
- Proper vertical padding for sections
- Mobile-optimized design

## Adding Images

Place all your images in the `/images` directory and update the `src` attributes in the HTML as needed:

```html
<img src="images/your-image.jpg" alt="Description">
```

## Questions

If you have any questions about how to edit or customize this website, please refer to the comments in the code files or reach out for further assistance. 