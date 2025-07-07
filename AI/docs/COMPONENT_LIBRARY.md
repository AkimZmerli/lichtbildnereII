# Component Library Reference

A comprehensive guide to all React components in the portfolio project, organized by feature using Vertical Slice Architecture (VSA).

## Quick Reference

| Component | Feature | Purpose | Key Props |
|-----------|---------|---------|-----------|
| `DesktopGallery` | Gallery Management | Horizontal scrolling gallery for desktop | `images`, `title`, `alternateGalleryLink` |
| `MobileGallery` | Gallery Management | Touch-based gallery for mobile | `images`, `title`, `alternateGalleryLink` |
| `DisplayMovie` | Video Showcase | Mux video player component | Video playback props |
| `SocialBook` | Social Book | Social book display section | Content props |
| `Header` | Shared | Main site navigation | Navigation props |
| `Hero` | Shared | Homepage hero section | `mobileUrl`, `desktopUrl`, `altText` |
| `ImageWithLoader` | Shared UI | Image with loading state | `image`, `priority`, `onLoad` |

---

## Component Architecture

### VSA Directory Structure

```
src/features/
├── gallery-management/
│   ├── components/
│   │   ├── DesktopGallery.tsx
│   │   ├── MobileGallery.tsx
│   │   ├── MasonryGallery.tsx
│   │   ├── GalleryImage.tsx
│   │   ├── GalleryNavigation.tsx
│   │   └── types/
│   │       └── gallery.ts
│   ├── hooks/
│   │   └── useSwipe.tsx
│   └── services/
│       └── galleryData.ts
├── video-showcase/
│   └── components/
│       └── DisplayMovie.tsx
├── social-book/
│   └── components/
│       └── SocialBook.tsx
└── shared/
    ├── components/
    │   ├── Header.tsx
    │   ├── HeaderActive.tsx
    │   ├── HeaderDesktop.tsx
    │   ├── Footer.tsx
    │   ├── Hero.tsx
    │   ├── ClientHero.tsx
    │   ├── CinematicHero.tsx
    │   ├── Exhibition.tsx
    │   ├── ExhibitionList.tsx
    │   ├── About.tsx
    │   ├── Works.tsx
    │   ├── HiddenGem.tsx
    │   ├── Blank.tsx
    │   ├── BurgerMenu.tsx
    │   └── ImagesSlideshow.tsx
    ├── ui/
    │   ├── ImageWithLoader.tsx
    │   ├── ImageHoverEffect.tsx
    │   ├── Menu.tsx
    │   └── SlideDropdown.tsx
    ├── services/
    │   └── hero/
    │       ├── getHeroImage.ts
    │       └── getSlides.ts
    └── utils/
        ├── scrollHandler.tsx
        └── scrollToSection.tsx
```

### Import Pattern

All imports now use the `@/features` pattern:
```typescript
import { DesktopGallery } from '@/features/gallery-management/components/DesktopGallery';
import Header from '@/features/shared/components/Header';
import { ImageWithLoader } from '@/features/shared/ui/ImageWithLoader';
```

---

## Gallery Management Feature

### DesktopGallery

**Purpose**: Horizontal scrolling gallery optimized for desktop viewing with keyboard navigation.

**Location**: `src/features/gallery-management/components/DesktopGallery.tsx`

**Props**:
```typescript
interface GalleryProps {
  images: GalleryImage[];
  title: string;
  alternateGalleryLink: string;
}

interface GalleryImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}
```

**Usage Example**:
```tsx
import DesktopGallery from '@/features/gallery-management/components/DesktopGallery';

function GalleryPage() {
  return (
    <DesktopGallery
      images={galleryImages}
      title="Human"
      alternateGalleryLink="/gallery/non-human"
    />
  );
}
```

**Key Features**:
- Horizontal scroll with momentum
- Keyboard navigation (arrow keys)
- Touch/swipe support
- Progress bar indicator
- Smooth transitions (2s duration)
- UI auto-hide after 2.5s

---

### MobileGallery

**Purpose**: Touch-optimized gallery with swipe gestures for mobile devices.

**Location**: `src/features/gallery-management/components/MobileGallery.tsx`

**Props**: Same as DesktopGallery

**Usage Example**:
```tsx
import MobileGallery from '@/features/gallery-management/components/MobileGallery';

function GalleryPage() {
  return (
    <MobileGallery
      images={galleryImages}
      title="Human"
      alternateGalleryLink="/gallery/non-human"
    />
  );
}
```

**Key Features**:
- Touch swipe navigation
- Single image view
- Navigation buttons
- Masonry grid view option
- Image counter display

---

### MasonryGallery

**Purpose**: Pinterest-style masonry grid layout for image collections.

**Location**: `src/features/gallery-management/components/MasonryGallery.tsx`

**Props**:
```typescript
interface MasonryGalleryProps {
  images: GalleryImage[];
  title: string;
  alternateGalleryLink?: string;
  onBack?: () => void;
}
```

**Key Features**:
- 2-column masonry layout
- Framer Motion animations
- Hover effects on images
- Back navigation support

---

### GalleryImage

**Purpose**: Individual gallery image component with loading states.

**Location**: `src/features/gallery-management/components/GalleryImage.tsx`

**Props**:
```typescript
interface GalleryImageProps {
  image: GalleryImage;
  priority?: boolean;
  onLoad?: () => void;
}
```

**Features**:
- Loading animation
- Fade-in effect
- Uses shared ImageWithLoader

---

### Gallery Data Service

**Purpose**: Fetches and transforms gallery data from PayloadCMS or test data.

**Location**: `src/features/gallery-management/services/galleryData.ts`

**Key Functions**:
```typescript
// Get gallery images by type
export const getGalleryImages = async (
  type: 'human' | 'non-human'
): Promise<GalleryImage[]>

// Check if using test data
export const isUsingTestData = (): boolean
```

---

## Video Showcase Feature

### DisplayMovie

**Purpose**: Video player component using Mux for streaming.

**Location**: `src/features/video-showcase/components/DisplayMovie.tsx`

**Implementation**: Currently integrated in page components. Mux Player integration for video streaming.

---

## Social Book Feature

### SocialBook

**Purpose**: Social book section display component.

**Location**: `src/features/social-book/components/SocialBook.tsx`

**Features**:
- Book preview display
- Interactive elements
- Responsive layout

---

## Shared Components

### Layout Components

#### Header

**Purpose**: Main site navigation header.

**Location**: `src/features/shared/components/Header.tsx`

**Features**:
- Responsive design
- Burger menu for mobile
- Active state management
- Smooth transitions

#### Footer

**Purpose**: Site footer with links and information.

**Location**: `src/features/shared/components/Footer.tsx`

#### BurgerMenu

**Purpose**: Mobile navigation menu.

**Location**: `src/features/shared/components/BurgerMenu.tsx`

**Props**:
```typescript
interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### Section Components

#### Hero

**Purpose**: Homepage hero section with responsive images.

**Location**: `src/features/shared/components/Hero.tsx`

**Features**:
- Server-side data fetching
- Responsive image loading
- Delegates to ClientHero

#### Exhibition

**Purpose**: Exhibition listing section.

**Location**: `src/features/shared/components/Exhibition.tsx`

**Features**:
- Async data loading
- Expandable exhibition items
- Image slideshow integration

#### Works

**Purpose**: Portfolio works showcase section.

**Location**: `src/features/shared/components/Works.tsx`

### UI Components

#### ImageWithLoader

**Purpose**: Image component with loading states.

**Location**: `src/features/shared/ui/ImageWithLoader.tsx`

**Props**:
```typescript
interface GalleryImageProps {
  image: GalleryImage;
  priority?: boolean;
  onLoad?: () => void;
}
```

**Features**:
- Loading placeholder
- Fade-in animation
- Next.js Image optimization

#### ImageHoverEffect

**Purpose**: Image with hover animation effects.

**Location**: `src/features/shared/ui/ImageHoverEffect.tsx`

### Utility Components

#### ScrollHandler

**Purpose**: Global scroll behavior management.

**Location**: `src/features/shared/utils/scrollHandler.tsx`

**Features**:
- Smooth scrolling
- Scroll position tracking
- Performance optimized

#### ScrollToSection

**Purpose**: Smooth scroll to page sections.

**Location**: `src/features/shared/utils/scrollToSection.tsx`

---

## Component Patterns

### Data Fetching Pattern

```typescript
// Server Component
async function GalleryPage() {
  const images = await getGalleryImages('human');
  return <DesktopGallery images={images} />;
}

// Client Component with useEffect
function ClientGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  
  useEffect(() => {
    getGalleryImages('human').then(setImages);
  }, []);
  
  return <DesktopGallery images={images} />;
}
```

### Responsive Component Pattern

```typescript
// Conditional rendering based on device
const isMobile = useMediaQuery('(max-width: 768px)');

return isMobile ? (
  <MobileGallery {...props} />
) : (
  <DesktopGallery {...props} />
);
```

### Animation Pattern

```typescript
// Using Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <Component />
</motion.div>
```

---

## TypeScript Types

### Core Gallery Types

```typescript
// Gallery image structure
interface GalleryImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// Gallery props
interface GalleryProps {
  images: GalleryImage[];
  title: string;
  alternateGalleryLink: string;
}

// Payload CMS types
interface PayloadGalleryItem {
  id: string;
  image: PayloadImage;
}

interface PayloadImage {
  filename: string;
  alt: string;
  url: string;
}
```

---

## Best Practices

### 1. Feature Organization
- Keep all related code within the feature folder
- Use clear, descriptive component names
- Export types from feature's types folder

### 2. Import Management
- Use absolute imports with @/features
- Group imports by feature
- Keep shared imports separate

### 3. Component Design
- Make components pure when possible
- Use TypeScript for all props
- Provide sensible defaults
- Document complex logic

### 4. Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images with Next.js Image
- Use dynamic imports for heavy components

---

## Migration Notes

The component library has been migrated from a horizontal (type-based) structure to a vertical (feature-based) structure following VSA principles. All import paths have been updated to use the new structure.

**Key Changes**:
1. Components moved from `/app/(frontend)/components` to `/features/[feature-name]/components`
2. Shared components moved to `/features/shared`
3. All imports updated to use `@/features` pattern
4. Clear feature boundaries established

---

**Last Updated**: July 7, 2025  
**Architecture**: Vertical Slice Architecture (VSA)  
**TypeScript**: Strict mode enabled