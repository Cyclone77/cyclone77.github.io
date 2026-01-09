# Requirements Document

## Introduction

This document defines the requirements for redesigning the blog UI to adopt a brutalist/cyberpunk aesthetic inspired by the reference designs. The redesign transforms the current clean, modern UI into a bold, experimental tech-lab style with sharp corners, monospace typography, matrix-green accents, and horizontal scrolling article cards on the homepage.

## Glossary

- **Brutalist_UI**: A design style characterized by sharp corners (0px border-radius), bold borders, high contrast, and raw aesthetic
- **Matrix_Green**: The primary accent color (#00FF41) used throughout the design
- **Duotone_Filter**: A CSS filter effect that converts images to grayscale with a colored overlay
- **Horizontal_Scroll_Container**: A full-viewport-height container that scrolls horizontally to display article cards
- **Article_Card**: A large card component (85vw width) displaying article information in a two-column grid layout
- **Brutal_Shadow**: A hard-edged box shadow effect (e.g., 4px 4px 0px 0px rgba(0,0,0,1))
- **Reading_Progress_Bar**: A fixed top bar showing the current reading progress in the article detail page
- **Mind_Map_Mode**: An overlay feature in the article detail page showing article structure as connected nodes
- **Radial_Menu**: A floating action button that expands to show additional navigation options
- **Split_Layout**: The article detail page layout with a dark sidebar (1/3) and light content area (2/3)

## Requirements

### Requirement 1: Design System Foundation

**User Story:** As a developer, I want a consistent brutalist design system, so that all UI components share the same visual language.

#### Acceptance Criteria

1. THE Tailwind_Config SHALL define the primary color as Matrix_Green (#00FF41)
2. THE Tailwind_Config SHALL define background-light as #F0F0F0 and background-dark as #0A0A0A
3. THE Tailwind_Config SHALL configure default border-radius as 0px for brutalist sharp corners
4. THE Tailwind_Config SHALL define brutal shadow utilities (brutal: 4px 4px 0px 0px rgba(0,0,0,1))
5. THE Tailwind_Config SHALL configure JetBrains Mono as the primary display and mono font family
6. WHEN dark mode is active, THE System SHALL use white borders instead of black borders
7. THE Index_CSS SHALL include the duotone image filter styles for article cover images

### Requirement 2: Navigation Header Redesign

**User Story:** As a user, I want a cyberpunk-styled navigation header, so that I can navigate the site with a consistent brutalist aesthetic.

#### Acceptance Criteria

1. THE Header SHALL be fixed at the top with a 4px bottom border (black in light mode, white in dark mode)
2. THE Header SHALL have a semi-transparent background with backdrop blur effect
3. THE Logo_Area SHALL display the site name in a Matrix_Green background box with black text and 2px black border
4. THE Header SHALL display a system status text "System Status: Operational" on desktop screens
5. WHEN the theme toggle is clicked, THE Header SHALL switch between light and dark modes
6. THE Navigation_Links SHALL use uppercase text with underline decoration on hover using Matrix_Green
7. THE Search_Icon SHALL be displayed in the header for triggering search functionality

### Requirement 3: Homepage Horizontal Scroll Layout

**User Story:** As a user, I want to browse articles through horizontal scrolling cards, so that I can have an immersive browsing experience.

#### Acceptance Criteria

1. THE Homepage SHALL display a full-viewport-height horizontal scroll container
2. THE Horizontal_Scroll_Container SHALL use CSS scroll-snap for smooth card-to-card navigation
3. EACH Article_Card SHALL occupy 85vw width with 5vw right margin
4. THE Article_Card SHALL use a two-column grid layout (image left, content right) on large screens
5. THE Article_Card SHALL have a 4px border (black in light mode, white in dark mode) with Brutal_Shadow
6. THE Article_Image SHALL apply the duotone filter effect with a colored overlay based on article category
7. THE Article_Image SHALL display an ID badge (e.g., "ID: 001 // FEATURED") in the top-left corner
8. THE Article_Content_Area SHALL display tags with brutalist styling (filled primary color or bordered)
9. THE Article_Title SHALL use uppercase text with extra-bold weight and tight leading
10. THE Article_Description SHALL have a 4px left border in the category accent color
11. THE Read_Button SHALL use brutalist styling with Brutal_Shadow and active state translation effect
12. THE Article_Metadata SHALL display date and read time in monospace format (e.g., "STAMP: 2026.01.06 // 11_MIN_READ")

### Requirement 4: Homepage Fixed Elements

**User Story:** As a user, I want quick access to subscription and navigation features, so that I can interact with the site without leaving the current view.

#### Acceptance Criteria

1. THE Subscribe_Widget SHALL be fixed at the bottom-left corner of the viewport
2. THE Subscribe_Widget SHALL have a black background with Matrix_Green accents and Brutal_Shadow
3. THE Subscribe_Widget SHALL include an email input field and join button with brutalist styling
4. THE Radial_Menu SHALL be fixed at the bottom-right corner of the viewport
5. THE Radial_Menu SHALL display a Matrix_Green circular button with a plus icon
6. WHEN the user hovers over the Radial_Menu, THE System SHALL expand to show additional navigation buttons
7. THE Radial_Menu_Items SHALL animate outward in a radial pattern on hover
8. THE Background SHALL display a subtle grid pattern overlay for the tech aesthetic

### Requirement 5: Article Detail Page Split Layout

**User Story:** As a user, I want to read articles in an immersive split-screen layout, so that I can focus on the content while having metadata visible.

#### Acceptance Criteria

1. THE Article_Detail_Page SHALL use a split layout with 1/3 dark sidebar and 2/3 light content area
2. THE Sidebar SHALL have a dark background (#0A0A0A) with a 4px right border
3. THE Sidebar_Image SHALL occupy 2/3 of the sidebar height with duotone filter applied
4. THE Sidebar_Image SHALL have a gradient overlay fading to the dark background
5. THE Sidebar_Metadata SHALL display date, author, and tags in Matrix_Green monospace text
6. THE Sidebar_Metadata SHALL use a grid layout with labeled fields (STAMP_DATE, AUTHOR_ID, TAG_DIRECTORY)
7. THE Content_Area SHALL have a light background (#F5F5F5) with comfortable reading typography
8. THE Content_Area SHALL use Inter font for body text and JetBrains Mono for headings and code

### Requirement 6: Article Detail Page Header Elements

**User Story:** As a user, I want visual indicators of my reading progress and quick navigation options, so that I can track my progress and navigate efficiently.

#### Acceptance Criteria

1. THE Reading_Progress_Bar SHALL be fixed at the top of the viewport (height: 32px, black background)
2. THE Reading_Progress_Bar SHALL display progress as segmented blocks with Matrix_Green fill
3. THE Reading_Progress_Bar SHALL show percentage text (e.g., "50%_BUFFERED") in monospace
4. THE Back_Button SHALL be fixed at the top-right with Matrix_Green background and Brutal_Shadow
5. THE Back_Button SHALL display "BACK_TO_ARCHIVE" text with an arrow icon
6. THE Mind_Map_Toggle SHALL be fixed at the top-center with white background and Brutal_Shadow
7. WHEN the Mind_Map_Toggle is clicked, THE System SHALL display the Mind_Map_Overlay

### Requirement 7: Article Content Styling

**User Story:** As a user, I want article content styled with brutalist typography, so that the reading experience matches the overall design aesthetic.

#### Acceptance Criteria

1. THE Article_Title SHALL use extra-large uppercase text (6xl-8xl) with tight tracking and leading
2. THE Article_Title SHALL include a decorative striped text effect for emphasis
3. THE Article_Intro SHALL have an 8px left border in black with italic styling
4. THE Section_Headings SHALL use monospace font with numbered prefixes (e.g., "01. THE_NATIVE_ATTRIBUTE")
5. THE Code_Blocks SHALL have a dark background (#1E1E1E) with 2px black border and Brutal_Shadow
6. THE Code_Block_Header SHALL display file name and window control dots (red, yellow, green)
7. THE Code_Block_Footer SHALL include action buttons (EXECUTE(COPY), EXECUTE(RUN)) in monospace
8. THE Blockquotes SHALL have a distinct brutalist styling with border and background

### Requirement 8: Mind Map Overlay Feature

**User Story:** As a user, I want to view the article structure as a mind map, so that I can understand the content hierarchy and navigate to sections.

#### Acceptance Criteria

1. WHEN the Mind_Map_Toggle is activated, THE Mind_Map_Overlay SHALL appear with a fade-in animation
2. THE Mind_Map_Overlay SHALL blur and dim the background content
3. THE Mind_Map_Overlay SHALL display the article topic as a central glass-morphism node
4. THE Mind_Map_Overlay SHALL display section headings as connected satellite nodes
5. THE Satellite_Nodes SHALL be clickable and navigate to the corresponding section
6. THE Mind_Map_Overlay SHALL display SVG connection lines between nodes
7. THE Close_Button SHALL be displayed at the bottom center to dismiss the overlay
8. WHEN a satellite node is clicked, THE System SHALL close the overlay and scroll to that section

### Requirement 9: Floating Action Elements

**User Story:** As a user, I want floating action buttons on the article page, so that I can quickly access common actions.

#### Acceptance Criteria

1. THE Radial_Menu SHALL be fixed at the bottom-right corner of the article detail page
2. THE Radial_Menu SHALL expand on hover to show home, terminal, and settings buttons
3. THE Radial_Menu_Items SHALL have white backgrounds with black borders and Brutal_Shadow
4. WHEN a Radial_Menu_Item is hovered, THE System SHALL change its background to Matrix_Green
5. THE Main_FAB SHALL rotate 45 degrees when the menu is expanded

### Requirement 10: Visual Effects and Animations

**User Story:** As a user, I want subtle visual effects and animations, so that the interface feels dynamic and engaging.

#### Acceptance Criteria

1. THE System SHALL apply a subtle noise texture overlay across all pages
2. THE Article_Images SHALL scale up on hover with a smooth transition (duration: 700ms)
3. THE Brutal_Shadow_Buttons SHALL translate on active state to simulate a press effect
4. THE Radial_Menu_Items SHALL animate with cubic-bezier easing when expanding
5. THE Mind_Map_Nodes SHALL scale up on hover with a smooth transition
6. THE Reading_Progress_Bar SHALL update in real-time as the user scrolls through the article

### Requirement 11: Responsive Design

**User Story:** As a user, I want the brutalist design to work on all screen sizes, so that I can browse on mobile and desktop devices.

#### Acceptance Criteria

1. THE Article_Card SHALL stack vertically (image on top, content below) on mobile screens
2. THE Article_Card_Image SHALL have a bottom border instead of right border on mobile
3. THE Header_Navigation_Links SHALL be hidden on mobile screens
4. THE System_Status_Text SHALL be hidden on mobile screens
5. THE Split_Layout SHALL stack vertically on mobile with sidebar content above main content
6. THE Subscribe_Widget SHALL remain visible and functional on mobile screens

### Requirement 12: Dark Mode Support

**User Story:** As a user, I want full dark mode support, so that I can browse comfortably in low-light environments.

#### Acceptance Criteria

1. WHEN dark mode is active, THE Background SHALL change to #0A0A0A
2. WHEN dark mode is active, THE Borders SHALL change from black to white
3. WHEN dark mode is active, THE Brutal_Shadow SHALL use white color instead of black
4. WHEN dark mode is active, THE Article_Cards SHALL use zinc-900 background
5. THE Theme_Toggle SHALL persist the user's preference in localStorage
6. THE System SHALL respect the user's system preference on initial load
