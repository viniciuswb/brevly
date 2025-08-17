# Brevly Design System Styleguide

This document outlines the design system for Brevly, a URL shortener service. The design tokens and components defined here ensure consistency across the application.

## Colors

### Blue (Primary)
- **blue-base**: `#2C46B1` - Primary brand color
- **blue-dark**: `#2C4091` - Darker variant for hover states and emphasis

### Grayscale
- **white**: `#FFFFFF` - Primary background and text on dark surfaces
- **gray-100**: `#F9F9FB` - Light background surfaces
- **gray-200**: `#E4E6EC` - Subtle borders and dividers
- **gray-300**: `#CDCFD5` - Muted borders and inactive elements
- **gray-400**: `#74798B` - Secondary text and icons
- **gray-500**: `#4D505C` - Primary text on light surfaces
- **gray-600**: `#1F2025` - High contrast text and dark elements

### Additional Gray Variants
- **gray-950**: `#E1E1E6` - Alternative light gray
- **black**: `#000000` - Maximum contrast text
- **gray-100 (Dark)**: `#09090A` - Very dark surface
- **gray-200 (Dark)**: `#121214` - Dark surface variant

### Feedback
- **danger**: `#B12C4D` - Error states, destructive actions, and warnings

## Typography

**Font Family**: Open Sans
- Available at [Google Fonts](https://fonts.google.com/specimen/Open+Sans)

### Text Scales

| Name | Size | Line Height | Weight | Case | Usage |
|------|------|-------------|---------|------|-------|
| **Text XL** | 24px | 32px | Bold (700) | Default | Main headings, page titles |
| **Text LG** | 18px | 24px | Bold (700) | Default | Section headings, subheadings |
| **Text MD** | 14px | 18px | SemiBold (600) | Default | Button text, form labels |
| **Text SM** | 12px | 16px | Regular (400) & SemiBold (600) | Default | Body text, descriptions |
| **Text XS** | 10px | 14px | Regular (400) | Uppercase | Captions, metadata |

## Icons

The design system uses **Phosphor Icons** for consistent iconography.
- Icon library: [Phosphor Icons](https://phosphoricons.com/)
- Standard size: 32px (2rem)

### Available Icons
- **Copy** - For copying URLs and text
- **Trash** - For delete actions
- **Warning** - For error states and alerts
- **DownloadSimple** - For export and download actions
- **Link** - For URL-related features

## Brand Assets

### Logo
- **Full Logo**: `brev.ly` with custom styling in Quicksand Bold font
- **Logo Icon**: Standalone logo mark for compact spaces
- **404 Graphic**: Custom 404 error page illustration

### Logo Usage
- Primary color: `#2C46B1` (blue-base)
- Font: Quicksand Bold
- Minimum size: Ensure readability at small sizes

## Implementation Notes

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-blue-base: #2C46B1;
  --color-blue-dark: #2C4091;
  --color-white: #FFFFFF;
  --color-gray-100: #F9F9FB;
  --color-gray-200: #E4E6EC;
  --color-gray-300: #CDCFD5;
  --color-gray-400: #74798B;
  --color-gray-500: #4D505C;
  --color-gray-600: #1F2025;
  --color-danger: #B12C4D;
  
  /* Typography */
  --font-family: 'Open Sans', sans-serif;
  --text-xl: 700 24px/32px var(--font-family);
  --text-lg: 700 18px/24px var(--font-family);
  --text-md: 600 14px/18px var(--font-family);
  --text-sm: 400 12px/16px var(--font-family);
  --text-xs: 400 10px/14px var(--font-family);
}
```

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          base: '#2C46B1',
          dark: '#2C4091',
        },
        gray: {
          100: '#F9F9FB',
          200: '#E4E6EC',
          300: '#CDCFD5',
          400: '#74798B',
          500: '#4D505C',
          600: '#1F2025',
        },
        danger: '#B12C4D',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'text-xl': ['24px', '32px'],
        'text-lg': ['18px', '24px'],
        'text-md': ['14px', '18px'],
        'text-sm': ['12px', '16px'],
        'text-xs': ['10px', '14px'],
      },
    },
  },
}
```

## Accessibility

- Ensure sufficient color contrast ratios (WCAG AA)
- Use semantic HTML elements
- Provide alternative text for icons when used without labels
- Test with screen readers and keyboard navigation

## Usage Guidelines

1. **Color Usage**: Use blue-base for primary actions, gray-500 for body text, and danger for error states
2. **Typography**: Maintain hierarchy with Text XL for main headings down to Text XS for metadata
3. **Icons**: Use consistently sized icons (32px standard) with proper spacing
4. **Spacing**: Follow 8px grid system for consistent spacing and alignment

## Component Styles

### Button Component

The button component supports primary and secondary variants with different states.

#### Primary Button
- **Default**: Background `#2C46B1` (blue-base), white text
- **Hover**: Background `#2C4091` (blue-dark), white text
- **Disabled**: Background `#A5B3E0` (50% opacity blue-base), white text

#### Secondary Button
- **Default**: Transparent background, `#2C46B1` border, blue text
- **Hover**: Light blue background `#F0F4FF`, blue border and text
- **Disabled**: Transparent background, `#A5B3E0` border and text

```css
/* Primary Button */
.btn-primary {
  background-color: #2C46B1;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font: 600 14px/18px 'Open Sans', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #2C4091;
}

.btn-primary:disabled {
  background-color: #A5B3E0;
  cursor: not-allowed;
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: #2C46B1;
  border: 1px solid #2C46B1;
  padding: 12px 24px;
  border-radius: 8px;
  font: 600 14px/18px 'Open Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #F0F4FF;
}

.btn-secondary:disabled {
  color: #A5B3E0;
  border-color: #A5B3E0;
  cursor: not-allowed;
}
```

### Icon Button Component

Icon-only buttons for actions like copy, delete, or settings.

- **Default**: Transparent background, gray icon `#7C7C8A`
- **Hover**: Light gray background `#F9F9FB`, darker icon `#4D505C`

```css
.btn-icon {
  background-color: transparent;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #7C7C8A;
}

.btn-icon:hover {
  background-color: #F9F9FB;
  color: #4D505C;
}
```

### Input Component

Text input with support for different states including error handling.

#### States
- **Empty/Default**: Light gray border `#E4E6EC`, placeholder text `#74798B`
- **Empty/Active**: Blue border `#2C46B1`, focused state
- **Empty/Error**: Red border `#B12C4D`, error message below
- **Filled/Default**: Same as empty but with content
- **Filled/Active**: Same as empty active but with content
- **Filled/Error**: Same as empty error but with content

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E4E6EC;
  border-radius: 8px;
  font: 400 14px/18px 'Open Sans', sans-serif;
  color: #1F2025;
  background-color: #FFFFFF;
  transition: border-color 0.2s ease;
}

.input::placeholder {
  color: #74798B;
}

.input:focus {
  outline: none;
  border-color: #2C46B1;
  box-shadow: 0 0 0 3px rgba(44, 70, 177, 0.1);
}

.input.error {
  border-color: #B12C4D;
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(177, 44, 77, 0.1);
}

.input-error-message {
  color: #B12C4D;
  font: 400 12px/16px 'Open Sans', sans-serif;
  margin-top: 4px;
}
```

### Tailwind CSS Classes

For projects using Tailwind CSS, here are the equivalent utility classes:

#### Button Classes
```html
<!-- Primary Button -->
<button class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
  Button Text
</button>

<!-- Secondary Button -->
<button class="bg-transparent hover:bg-blue-50 border border-blue-600 text-blue-600 disabled:text-blue-300 disabled:border-blue-300 font-semibold py-3 px-6 rounded-lg transition-all">
  Button Text
</button>

<!-- Icon Button -->
<button class="bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-600 p-2 rounded-md transition-all">
  <svg class="w-5 h-5"><!-- icon --></svg>
</button>
```

#### Input Classes
```html
<!-- Default Input -->
<input class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-3 focus:ring-blue-100 placeholder-gray-400 transition-all" 
       placeholder="Enter text...">

<!-- Error Input -->
<input class="w-full px-4 py-3 border border-red-500 rounded-lg focus:border-red-500 focus:ring-3 focus:ring-red-100 placeholder-gray-400 transition-all">
<p class="text-red-500 text-sm mt-1">Error message</p>
```