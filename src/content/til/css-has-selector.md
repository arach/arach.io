---
author: Sathiyaseelan Ravi
pubDatetime: 2025-01-13T09:00:00Z
title: CSS :has() selector
tags:
  - css
  - web
description: The CSS :has() selector allows parent selection and conditional styling
---

The CSS `:has()` pseudo-class is a game-changer that finally brings "parent selectors" to CSS!

## Basic Usage

Select a parent based on its children:

```css
/* Style a div that contains an img */
div:has(img) {
  border: 2px solid blue;
}

/* Style a form that has an invalid input */
form:has(input:invalid) {
  border: 2px solid red;
}
```

## Sibling Selection

You can also use it for sibling relationships:

```css
/* Style an h1 that's followed by a subtitle */
h1:has(+ .subtitle) {
  margin-bottom: 0.5rem;
}

/* Hide labels that are followed by empty inputs */
label:has(+ input:placeholder-shown) {
  opacity: 0.5;
}
```

## Complex Conditions

Combine with other selectors for powerful queries:

```css
/* Article cards with images get different layout */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* Navigation with active submenu */
nav:has(.submenu .active) {
  background: var(--highlight-color);
}
```

## Real-World Example

```css
/* Highlight the whole row when checkbox is checked */
tr:has(input[type="checkbox"]:checked) {
  background-color: #e3f2fd;
}

/* Different layout for posts with featured images */
article:has(.featured-image) {
  padding-top: 0;
}
article:not(:has(.featured-image)) {
  padding-top: 2rem;
}
```

## Browser Support

As of 2024, `:has()` is supported in all modern browsers. For older browsers, use it as progressive enhancement or provide JavaScript fallbacks.

This selector dramatically reduces the need for JavaScript-based conditional styling!