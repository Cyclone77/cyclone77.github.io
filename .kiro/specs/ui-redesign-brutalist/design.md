# Design Document: Brutalist UI Redesign

## Overview

This design document outlines the technical implementation for transforming the blog's UI from a clean, modern aesthetic to a bold brutalist/cyberpunk style. The redesign introduces horizontal scrolling article cards on the homepage, a split-layout article detail page with reading progress tracking, and consistent brutalist design elements throughout.

The implementation leverages the existing React + TypeScript + Tailwind CSS stack while introducing new design tokens, components, and layout patterns inspired by the reference designs.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  App.tsx                                                         │
│  ├── ThemeContext (dark/light mode)                             │
│  ├── Layout                                                      │
│  │   ├── BrutalistHeader                                        │
│  │   ├── NoiseOverlay                                           │
│  │   └── Page Content                                           │
│  └── Routes                                                      │
│      ├── HomePage (horizontal scroll)                           │
│      └── ArticleDetailPage (split layout)                       │
├─────────────────────────────────────────────────────────────────┤
│                        Component Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Shared Components:                                              │
│  ├── BrutalistButton                                            │
│  ├── BrutalistCard                                              │
│  ├── DuotoneImage                                               │
│  ├── RadialMenu                                                 │
│  └── SubscribeWidget                                            │
│                                                                  │
│  Page-Specific Components:                                       │
│  ├── HorizontalScrollContainer                                  │
│  ├── ArticleCard (homepage)                                     │
│  ├── SplitLayout                                                │
│  ├── ReadingProgressBar                                         │
│  ├── MindMapOverlay                                             │
│  └── ArticleSidebar                                             │
├─────────────────────────────────────────────────────────────────┤
│                        Style Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  tailwind.config.js (design tokens)                             │
│  src/index.css (custom utilities, animations)                   │
└─────────────────────────────────────────────────────────────────┘
```

### Design Token Strategy

The brutalist design system is built on these core tokens:

| Token Category | Light Mode | Dark Mode |
|----------------|------------|-----------|
| Primary | #00FF41 (Matrix Green) | #00FF41 |
| Background | #F0F0F0 | #0A0A0A |
| Surface | #FFFFFF | #18181B (zinc-900) |
| Border | #000000 | #FFFFFF |
| Text Primary | #000000 | #FFFFFF |
| Text Secondary | rgba(0,0,0,0.6) | rgba(255,255,255,0.6) |

### Shadow System

```css
/* Brutal shadows - hard-edged, no blur */
brutal: 4px 4px 0px 0px rgba(0,0,0,1)
brutal-hover: 8px 8px 0px 0px rgba(0,0,0,1)
brutal-white: 4px 4px 0px 0px rgba(255,255,255,1)
```

## Components and Interfaces

### 1. Design System Configuration

#### tailwind.config.js Updates

```typescript
// Brutalist design tokens
const brutalistConfig = {
  colors: {
    primary: "#00FF41",
    "background-light": "#F0F0F0",
    "background-dark": "#0A0A0A",
    "surface-light": "#FFFFFF",
    "surface-dark": "#18181B",
  },
  fontFamily: {
    display: ["'JetBrains Mono'", "monospace"],
    mono: ["'JetBrains Mono'", "monospace"],
    body: ["'Inter'", "sans-serif"],
  },
  borderRadius: {
    DEFAULT: "0px",
    // Keep some rounded options for specific use cases
    full: "9999px",
  },
  boxShadow: {
    brutal: "4px 4px 0px 0px rgba(0,0,0,1)",
    "brutal-hover": "8px 8px 0px 0px rgba(0,0,0,1)",
    "brutal-white": "4px 4px 0px 0px rgba(255,255,255,1)",
  },
};
```

### 2. BrutalistHeader Component

```typescript
interface BrutalistHeaderProps {
  onSearchClick: () => void;
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
}

// Features:
// - Fixed position with backdrop blur
// - 4px bottom border (black/white based on theme)
// - Logo in Matrix Green box
// - System status text (desktop only)
// - Navigation links with underline hover effect
// - Theme toggle and search icons
```

### 3. HorizontalScrollContainer Component

```typescript
interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

// CSS Properties:
// - display: flex
// - overflow-x: auto
// - scroll-snap-type: x mandatory
// - height: 100vh (minus header)
// - Hide scrollbar with CSS
```

### 4. ArticleCard Component (Homepage)

```typescript
interface ArticleCardProps {
  article: Article;
  index: number;
  accentColor?: string;
}

// Layout:
// - Width: 85vw with 5vw right margin
// - Two-column grid (image | content) on desktop
// - Stacked layout on mobile
// - 4px border with brutal shadow
// - Scroll-snap-align: center
```

### 5. DuotoneImage Component

```typescript
interface DuotoneImageProps {
  src: string;
  alt: string;
  overlayColor?: string;
  className?: string;
}

// CSS Filter:
// filter: grayscale(100%) contrast(120%) brightness(80%) sepia(50%) hue-rotate(80deg)
// Colored overlay with mix-blend-mode: multiply
```

### 6. RadialMenu Component

```typescript
interface RadialMenuItem {
  icon: string;
  label: string;
  onClick: () => void;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  position?: 'bottom-right' | 'bottom-left';
}

// Animation:
// - Items start at center (transform: translate(0, 0))
// - On hover, items animate outward in radial pattern
// - Main button rotates 45deg
// - Uses cubic-bezier easing
```

### 7. SubscribeWidget Component

```typescript
interface SubscribeWidgetProps {
  position?: 'fixed' | 'inline';
}

// Styling:
// - Black background with Matrix Green accents
// - 2px primary border with brutal shadow
// - Compact layout for fixed position
// - Monospace typography
```

### 8. SplitLayout Component (Article Detail)

```typescript
interface SplitLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

// Layout:
// - Sidebar: 1/3 width, dark background (#0A0A0A)
// - Content: 2/3 width, light background (#F5F5F5)
// - 4px border between sections
// - Stacks vertically on mobile
```

### 9. ArticleSidebar Component

```typescript
interface ArticleSidebarProps {
  article: Article;
  coverImage: string;
}

// Sections:
// - Cover image (2/3 height) with duotone filter
// - Gradient overlay fading to dark
// - Metadata grid (date, author, tags)
// - Matrix Green monospace text
// - Security status footer
```

### 10. ReadingProgressBar Component

```typescript
interface ReadingProgressBarProps {
  progress: number; // 0-100
}

// Features:
// - Fixed at top, 32px height, black background
// - Segmented progress blocks (4 segments)
// - Matrix Green fill for completed segments
// - Percentage text display
// - Updates on scroll
```

### 11. MindMapOverlay Component

```typescript
interface MindMapNode {
  id: string;
  label: string;
  type: 'center' | 'satellite';
  targetId?: string; // For navigation
}

interface MindMapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: MindMapNode[];
  onNodeClick: (targetId: string) => void;
}

// Features:
// - Full-screen overlay with blur backdrop
// - Central node with glass-morphism effect
// - Satellite nodes positioned radially
// - SVG connection lines
// - Click to navigate to section
```

### 12. BrutalistCodeBlock Component

```typescript
interface BrutalistCodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

// Features:
// - Dark background (#1E1E1E)
// - 2px black border with brutal shadow
// - Header with window dots and filename
// - Footer with action buttons
// - Syntax highlighting
```

### 13. NoiseOverlay Component

```typescript
// Simple component that renders an SVG noise texture
// Fixed position, pointer-events: none
// Low opacity (3-5%) for subtle effect
```

## Data Models

### Extended Article Interface

```typescript
interface Article {
  id: number;
  number?: number;
  title: string;
  description: string;
  content?: string;
  coverImage?: string;
  date: string;
  createdAt?: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
  tags?: string[];
  categories?: string[];
  displays?: string[];
  url?: string;
  // New field for brutalist design
  accentColor?: string; // Category-based accent color
}
```

### Theme Configuration

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    background: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  shadows: {
    brutal: string;
    brutalHover: string;
  };
}
```

### Mind Map Node Structure

```typescript
interface MindMapNode {
  id: string;
  label: string;
  type: 'center' | 'satellite' | 'tag';
  position?: { x: number; y: number };
  targetId?: string;
}
```

### Reading Progress State

```typescript
interface ReadingProgressState {
  progress: number;
  currentSection: string;
  totalSections: number;
  completedSections: number;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following correctness properties have been identified for property-based testing:

### Property 1: Dark Mode Styling Consistency

*For any* UI element with a border or brutal shadow, when dark mode is active, the border color should be white (#FFFFFF) and shadows should use white instead of black.

**Validates: Requirements 1.6, 12.2, 12.3**

### Property 2: Theme Toggle and Persistence

*For any* theme state (light or dark), clicking the theme toggle should result in the opposite theme being active, and the new preference should be persisted to localStorage.

**Validates: Requirements 2.5, 12.5**

### Property 3: Article Card Dimension Consistency

*For any* article card rendered in the horizontal scroll container, the card width should be 85vw and the right margin should be 5vw.

**Validates: Requirements 3.3**

### Property 4: Article Metadata Format Consistency

*For any* article with a date and read time, the metadata display should follow the monospace format pattern "STAMP: YYYY.MM.DD // XX_MIN_READ".

**Validates: Requirements 3.12**

### Property 5: Sidebar Metadata Display Completeness

*For any* article displayed in the detail page, the sidebar metadata section should display all required fields: date (STAMP_DATE), author (AUTHOR_ID), and tags (TAG_DIRECTORY).

**Validates: Requirements 5.5**

### Property 6: Reading Progress Accuracy

*For any* scroll position in the article detail page, the reading progress bar percentage should accurately reflect the scroll position as a percentage of total scrollable content (within ±2% tolerance).

**Validates: Requirements 6.3, 10.6**

### Property 7: Mind Map Toggle Visibility

*For any* state of the mind map toggle, clicking it should toggle the visibility of the mind map overlay (visible becomes hidden, hidden becomes visible).

**Validates: Requirements 6.7**

### Property 8: Section Heading Format Consistency

*For any* section heading (h2) in the article content, it should be rendered with monospace font and a numbered prefix in the format "XX. HEADING_TEXT" where XX is a zero-padded number.

**Validates: Requirements 7.4**

### Property 9: Mind Map Node Generation

*For any* article with section headings, the mind map overlay should generate exactly one satellite node for each h2 heading in the article content, plus one central node for the article topic.

**Validates: Requirements 8.4**

### Property 10: Mind Map Navigation Behavior

*For any* satellite node in the mind map overlay, clicking it should close the overlay and scroll the page to the corresponding section heading.

**Validates: Requirements 8.8**

## Error Handling

### Theme Context Errors

- **Missing ThemeProvider**: Components should gracefully handle missing theme context by defaulting to light mode
- **localStorage unavailable**: Theme persistence should fail silently and use in-memory state
- **Invalid stored theme**: Should default to system preference or light mode

### Image Loading Errors

- **Failed image load**: DuotoneImage component should display a fallback placeholder
- **Missing cover image**: Article cards should render without the image section
- **Slow image load**: Show skeleton/shimmer animation during load

### Scroll and Progress Errors

- **Missing scroll container**: ReadingProgressBar should show 0% progress
- **Invalid scroll calculations**: Clamp progress values between 0-100%
- **Rapid scroll events**: Debounce progress updates to prevent performance issues

### Mind Map Errors

- **No headings found**: Display message "No sections available" in overlay
- **Invalid heading IDs**: Skip navigation for headings without valid IDs
- **Missing target element**: Log warning and keep overlay open

### Data Errors

- **Missing article data**: Show "Article not found" state
- **Malformed article content**: Render raw content without markdown processing
- **Missing metadata fields**: Display "Unknown" or hide the field

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **Component Rendering Tests**
   - Header renders with correct structure and styling
   - ArticleCard renders with all required elements
   - DuotoneImage applies correct filter CSS
   - RadialMenu expands/collapses correctly
   - ReadingProgressBar displays correct segments

2. **Theme Tests**
   - Theme toggle changes document class
   - localStorage is updated on theme change
   - System preference is detected on initial load

3. **Layout Tests**
   - HorizontalScrollContainer has correct CSS properties
   - SplitLayout proportions are correct (1/3, 2/3)
   - Responsive breakpoints apply correct styles

4. **Interaction Tests**
   - Mind map toggle opens/closes overlay
   - Satellite node click triggers navigation
   - Radial menu hover expands items

### Property-Based Tests

Property-based tests will use a testing library (e.g., fast-check for TypeScript) to verify universal properties:

**Configuration**: Each property test should run minimum 100 iterations.

**Tag Format**: Each test should be tagged with:
`Feature: ui-redesign-brutalist, Property {number}: {property_text}`

1. **Property 1 Test**: Generate random UI elements with borders, verify dark mode applies white borders
2. **Property 2 Test**: Generate random sequences of theme toggles, verify state consistency
3. **Property 3 Test**: Generate random article data, verify card dimensions
4. **Property 4 Test**: Generate random dates and read times, verify format output
5. **Property 5 Test**: Generate random article metadata, verify all fields displayed
6. **Property 6 Test**: Generate random scroll positions, verify progress accuracy
7. **Property 7 Test**: Generate random toggle sequences, verify visibility state
8. **Property 8 Test**: Generate random heading text, verify format output
9. **Property 9 Test**: Generate random article content with headings, verify node count
10. **Property 10 Test**: Generate random node clicks, verify navigation behavior

### Integration Tests

1. **Full Page Rendering**: Verify homepage and article detail page render completely
2. **Navigation Flow**: Verify navigation between pages maintains state
3. **Theme Persistence**: Verify theme persists across page reloads
4. **Scroll Behavior**: Verify horizontal scroll snap works correctly

### Visual Regression Tests

Consider using tools like Playwright or Cypress for visual regression testing to catch unintended style changes in the brutalist design system.
