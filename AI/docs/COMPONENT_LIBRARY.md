# Component Library

This document provides an overview of the React components used in the frontend of the portfolio project.

## Component Organization

The components are organized into the following categories within the `src/app/(frontend)/components/` directory:

-   **`galleries/`**: Components related to the photography galleries.
-   **`layout/`**: Components that define the overall page structure.
-   **`sections/`**: Components that represent different sections of a page.
-   **`ui/`**: General-purpose, reusable UI components.
-   **`utils/`**: Utility components and functions.

## Component Index

### Galleries (`galleries/`)

-   **`DesktopGallery.tsx`**: The gallery view for desktop devices, featuring horizontal scrolling.
-   **`MobileGallery.tsx`**: The gallery view for mobile devices, with touch-based navigation.
-   **`MasonryGallery.tsx`**: A masonry-style grid layout for displaying a collection of images.
-   **`GalleryImage.tsx`**: A component for displaying a single image within a gallery.
-   **`GalleryNavigation.tsx`**: Navigation controls for the galleries.
-   **`layout/GalleryLayout.tsx`**: The layout wrapper for gallery pages.

### Layout (`layout/`)

-   **`Header.tsx`**: The main site header.
-   **`HeaderDesktop.tsx`**: The desktop version of the header.
-   **`HeaderActive.tsx`**: The header state when a menu is active.
-   **`Footer.tsx`**: The site footer.
-   **`BurgerMenu.tsx`**: The hamburger menu icon for mobile navigation.

### Sections (`sections/`)

-   **`Hero.tsx`**: The main hero section for the homepage.
-   **`CinematicHero.tsx`**: A hero section with a cinematic feel.
-   **`ClientHero.tsx`**: A hero section for client-focused pages.
-   **`About.tsx`**: The "About" section of the portfolio.
-   **`Works.tsx`**: A section for displaying a collection of works.
-   **`Exhibition.tsx`**: A section for displaying a single exhibition.
-   **`ExhibitionList.tsx`**: A list of exhibitions.
-   **`SocialBook.tsx`**: The section for the interactive social book.
-   **`DisplayMovie.tsx`**: A section for displaying a movie with the Mux Player.
-   **`HiddenGem.tsx`**: A section for highlighting a "hidden gem".
-   **`Blank.tsx`**: A blank section component.

### UI (`ui/`)

-   **`ImageWithLoader.tsx`**: An image component that displays a loader while the image is loading.
-   **`ImageHoverEffect.tsx`**: An image component with a hover effect.
-   **`Menu.tsx`**: A menu component.
-   **`SlideDropdown.tsx`**: A dropdown menu with a slide animation.

### Utils (`utils/`)

-   **`scrollHandler.tsx`**: A component for handling scroll events.
-   **`scrollToSection.tsx`**: A utility for scrolling to a specific section of a page.

### Root Components

-   **`ImagesSlideshow.tsx`**: A slideshow component for images.
