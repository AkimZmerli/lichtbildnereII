# Complete Developer Guide - Valentin Mici Portfolio

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Deep Dive](#architecture-deep-dive)
3. [Setup & Development](#setup--development)
4. [Core Systems](#core-systems)
5. [Component Patterns](#component-patterns)
6. [Data Flow & State Management](#data-flow--state-management)
7. [Performance Optimization](#performance-optimization)
8. [Common Development Tasks](#common-development-tasks)
9. [Debugging & Troubleshooting](#debugging--troubleshooting)
10. [Deployment & Production](#deployment--production)

## Project Overview

### What This Project Is
An artist portfolio website for Valentin Mici featuring:
- **Interactive galleries** with masonry/grid layouts
- **3D flipbook experience** using WebGL and CSS transforms
- **Exhibition timeline** with chronological display
- **Responsive design** optimized for mobile and desktop
- **Performance-first** approach with static generation

### Technology Stack
```
Frontend Framework:    Next.js 15 (App Router)
Language:             TypeScript (strict mode)
Styling:              Tailwind CSS + CSS Modules
Animation:            Framer Motion + GSAP
3D Graphics:          Three.js (flipbook)
Video:                Mux Player
Storage:              Vercel Blob
Package Manager:      pnpm (required)
Deployment:           Vercel
```

### Project Metrics
- **Bundle Size**: ~165KB first load JS
- **Performance**: Optimized for mobile-first
- **Static Pages**: 15 pre-rendered routes
- **Image Optimization**: Automatic WebP conversion
- **Accessibility**: WCAG compliant

## Architecture Deep Dive

### File System Organization

```
portfolio-project/
├── src/
│   ├── app/                    # Next.js App Router (pages & routing)
│   │   ├── gallery/           
│   │   │   ├── human/page.tsx         # Human photography gallery
│   │   │   ├── non-human/page.tsx     # Non-human works gallery  
│   │   │   ├── exhibition/page.tsx    # Exhibition documentation
│   │   │   └── non-human-backup/      # Backup gallery route
│   │   ├── socialbook/page.tsx        # 3D flipbook experience
│   │   ├── tankstelle/page.tsx        # 3D exhibition space
│   │   ├── zwoelftausend/page.tsx     # Special exhibition
│   │   ├── about-exhibition/page.tsx   # Exhibition info page
│   │   ├── datenschutz/page.tsx       # Privacy policy
│   │   ├── impressum/page.tsx         # Legal notice
│   │   ├── layout.tsx                 # Root layout with metadata
│   │   ├── page.tsx                   # Homepage
│   │   ├── icon.svg                   # App favicon
│   │   └── styles.css                 # Global styles
│   ├── features/               # Feature-based modules (vertical slices)
│   │   ├── home/              
│   │   │   ├── components/
│   │   │   │   ├── Hero.tsx                    # Main hero section
│   │   │   │   ├── Works.tsx                   # Featured works preview
│   │   │   │   ├── CinematicHeroScroll.tsx     # Scroll-triggered animations
│   │   │   │   └── ClientHero.tsx              # Client-side hero wrapper
│   │   │   └── services/
│   │   │       ├── hero/
│   │   │       │   ├── getSlides.ts            # Exhibition slides data
│   │   │       │   └── getHeroImage.ts         # Hero image management
│   │   │       └── works/
│   │   │           └── getWorksPreviewData.ts  # Featured works data
│   │   ├── gallery/
│   │   │   ├── components/
│   │   │   │   ├── DesktopGallery.tsx          # Desktop grid layout
│   │   │   │   ├── MobileGallery.tsx           # Mobile swipe gallery
│   │   │   │   ├── MasonryGallery.tsx          # Pinterest-style layout
│   │   │   │   ├── GalleryImage.tsx            # Optimized image component
│   │   │   │   ├── GalleryNavigation.tsx       # Gallery controls
│   │   │   │   └── layout/
│   │   │   │       └── GalleryLayout.tsx       # Gallery page wrapper
│   │   │   ├── hooks/
│   │   │   │   └── useGalleryTracking.ts       # Analytics & tracking
│   │   │   └── services/
│   │   │       └── galleryData.ts              # Data fetching & filtering
│   │   ├── exhibition/
│   │   │   ├── components/
│   │   │   │   ├── Exhibition.tsx              # Main exhibition timeline
│   │   │   │   └── ExhibitionList.tsx          # Animated exhibition items
│   │   │   └── services/
│   │   │       └── getExhibitionImages.ts      # Exhibition data
│   │   ├── social-book/
│   │   │   ├── components/
│   │   │   │   └── SocialBook.tsx              # Social book wrapper
│   │   │   ├── services/
│   │   │   │   └── getSocialBookData.ts        # Social book data
│   │   │   └── flipbook/                       # 3D Flipbook System
│   │   │       ├── components/
│   │   │       │   ├── CSSFlipbook.tsx         # Main flipbook component
│   │   │       │   ├── FlipbookModal.tsx       # Fullscreen modal
│   │   │       │   ├── ImageComparison.tsx     # Before/after comparisons
│   │   │       │   ├── flipbook.css            # Core flipbook styles
│   │   │       │   ├── flipbook-blur.css       # Blur animations
│   │   │       │   ├── flipbook-clippath.css   # Clip path animations
│   │   │       │   └── flipbook-segments.css   # Page segments
│   │   │       ├── hooks/
│   │   │       │   ├── useFlipbook.ts          # Main flipbook logic
│   │   │       │   └── useBookSpread.ts        # Page spread calculations
│   │   │       └── services/
│   │   │           ├── FlipbookEngine.ts       # WebGL rendering engine
│   │   │           └── BookSpreadEngine.ts     # Page layout engine
│   │   ├── shared/                    # Shared feature components
│   │   │   ├── components/
│   │   │   │   └── CinematicHeroV2.tsx        # Updated hero component
│   │   │   └── services/
│   │   │       └── gallery/
│   │   │           └── getGallerySettings.ts   # Gallery configuration
│   │   └── video-showcase/
│   │       └── components/
│   │           └── DisplayMovie.tsx            # Video display component
│   ├── shared/                 # Global shared utilities
│   │   ├── layout/
│   │   │   ├── Header.tsx              # Main navigation header
│   │   │   ├── HeaderDesktop.tsx       # Desktop navigation
│   │   │   ├── Footer.tsx              # Site footer
│   │   │   └── BurgerMenu.tsx          # Mobile menu
│   │   └── ui/
│   │       ├── ImageWithLoader.tsx     # Image with loading states
│   │       ├── LoadingSpinner.tsx      # Loading indicator
│   │       └── ImagesSlideshow.tsx     # Image slideshow component
│   ├── lib/                    # Utility functions & configurations
│   │   └── utils.ts            # Helper functions
│   ├── types/                  # TypeScript type definitions
│   │   ├── gallery.ts          # Gallery-related types
│   │   ├── api.ts              # API response types
│   │   └── mux-player.d.ts     # Mux player type definitions
│   └── styles/                 # Additional stylesheets
├── public/                     # Static assets
├── docs/                       # Documentation
├── scripts/                    # Build & utility scripts
└── config files               # Package.json, tsconfig, etc.
```

### Architectural Principles

#### 1. Feature-Based Architecture (Vertical Slices)
Each feature contains all its related code:
```typescript
// ✅ Good: Feature encapsulation
features/gallery/
├── components/     # UI components
├── hooks/         # React hooks
├── services/      # Business logic
└── types/         # Feature types (avoid - use global types/)

// ❌ Avoid: Horizontal layering
components/gallery/
hooks/gallery/  
services/gallery/
```

#### 2. Dependency Direction
```typescript
// ✅ Dependencies flow inward
app/ → features/ → shared/ → lib/ → types/

// ❌ Avoid circular dependencies
features/gallery/ ↔ features/social-book/  // Bad
```

#### 3. Import Strategy
```typescript
// Absolute imports for cross-feature
import { GalleryImage } from '@/types/gallery'
import Header from '@/shared/layout/Header'

// Relative imports within feature
import { useFlipbook } from '../hooks/useFlipbook'
import FlipbookModal from './FlipbookModal'
```

## Setup & Development

### Prerequisites
```bash
# Required versions
Node.js: ^18.20.2 || >=20.9.0
pnpm: ^9 || ^10

# Check versions
node --version
pnpm --version
```

### Environment Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd portfolio-project

# 2. Install dependencies (must use pnpm)
pnpm install

# 3. Environment variables
cp .env.example .env.local

# Required in .env.local:
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_key
```

### Development Commands
```bash
# Development
pnpm dev              # Start development server (localhost:3000)
pnpm devsafe         # Clean build + dev (fixes cache issues)

# Building
pnpm build           # Production build
pnpm build:next      # Next.js build only
pnpm start           # Start production server

# Code Quality
pnpm lint            # ESLint + TypeScript checking
pnpm lint --fix      # Auto-fix ESLint issues

# Asset Management
pnpm upload:previews  # Upload preview images to Blob
pnpm upload:all      # Upload all assets to Blob
pnpm convert:webp    # Convert images to WebP format
```

### Development Workflow
```bash
# 1. Start development
pnpm dev

# 2. Make changes
# Edit files in src/

# 3. Test changes
# Browser automatically reloads
# Check console for errors

# 4. Build verification
pnpm build

# 5. Commit changes
git add .
git commit -m "descriptive message"
git push
```

## Core Systems

### 1. Gallery System (`src/features/gallery/`)

#### Purpose & Features
- **Multi-layout support**: Grid (desktop), swipe (mobile), masonry
- **Image optimization**: WebP conversion, lazy loading, responsive sizing
- **Performance**: Virtual scrolling for large galleries
- **Analytics**: User interaction tracking
- **Accessibility**: Keyboard navigation, alt text, focus management

#### Key Components

**DesktopGallery.tsx** - Grid layout for desktop
```typescript
interface GalleryProps {
  images: GalleryImage[]
  title: string
  alternateGalleryLink: string
  galleryType?: 'human' | 'non-human' | 'exhibition'
}

// Features:
// - CSS Grid layout
// - Lightbox integration
// - Keyboard navigation (arrow keys)
// - Image preloading
// - Error boundaries
```

**MobileGallery.tsx** - Touch-optimized mobile experience
```typescript
// Features:
// - Swipe gestures (left/right)
// - Pull-to-refresh
// - Infinite scroll
// - Touch feedback
// - Optimized for Safari mobile
// - Reduced image quality for performance
```

**MasonryGallery.tsx** - Pinterest-style layout
```typescript
// Features:
// - Dynamic column count based on screen size
// - Maintains aspect ratios
// - Smooth animations
// - Intersection Observer for loading
```

#### Data Flow
```typescript
// 1. Page component fetches data
const images = await getGalleryImages('human')

// 2. Gallery component renders layout
<DesktopGallery 
  images={images}
  title="Human Photography"
  alternateGalleryLink="/gallery/non-human"
/>

// 3. Individual images handle loading states
<GalleryImage 
  image={image}
  priority={index < 4}  // Prioritize above-fold images
  onLoad={() => handleImageLoad()}
/>

// 4. Analytics tracking
useGalleryTracking({
  galleryType: 'human',
  imageCount: images.length
})
```

#### Gallery Types & Routing
```typescript
// Route structure
/gallery/human          → Human photography
/gallery/non-human      → Non-human works  
/gallery/exhibition     → Exhibition documentation
/gallery/non-human-backup → Backup route (A/B testing)

// Data sources
getGalleryImages(type: GalleryType): Promise<GalleryImage[]>
// - Fetches from Vercel Blob storage
// - Filters by gallery type
// - Applies image optimizations
// - Handles error states
```

### 2. 3D Flipbook System (`src/features/social-book/flipbook/`)

#### Architecture Overview
The flipbook uses a hybrid approach combining CSS 3D transforms with WebGL for optimal performance:

```
Browser Support Strategy:
├── Modern browsers: Full WebGL + CSS 3D
├── Safari mobile: Reduced quality CSS 3D
├── Older browsers: Fallback to static images
└── No JS: Static image grid
```

#### Core Components

**CSSFlipbook.tsx** - Main flipbook engine
```typescript
interface FlipbookOptions {
  images: FlipbookImage[]
  width: number
  height: number
  autoFlip?: boolean
  flipSpeed?: number
  disableZoom?: boolean
}

// Key features:
// - Page turning animations
// - Zoom and pan controls  
// - Keyboard shortcuts (arrow keys, spacebar)
// - Touch gestures
// - Safari optimization
// - Error recovery
```

**FlipbookEngine.ts** - WebGL rendering
```typescript
class FlipbookEngine {
  // Manages:
  // - WebGL context and shaders
  // - Texture loading and caching
  // - 3D transformations
  // - Performance monitoring
  // - Memory management
  
  initializeWebGL(): boolean
  loadTexture(image: HTMLImageElement): WebGLTexture
  renderPage(pageIndex: number, transform: Matrix4): void
  dispose(): void  // Cleanup WebGL resources
}
```

**BookSpreadEngine.ts** - Page layout calculations
```typescript
class BookSpreadEngine {
  // Calculates:
  // - Page spreads (single vs double pages)
  // - Aspect ratios and sizing
  // - Reading order (left-to-right)
  // - Page boundaries
  
  calculateSpread(pageIndex: number): PageSpread
  getPageDimensions(page: FlipbookImage): Dimensions
  isSpreadPage(pageIndex: number): boolean
}
```

#### Performance Optimizations

**Safari Mobile Optimizations**:
```typescript
// Detect Safari and reduce quality
const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

if (isSafariBrowser && window.innerWidth < 768) {
  // Reduce texture quality
  textureQuality = 0.5
  // Disable complex animations
  enableAdvancedEffects = false
  // Use CSS transforms only
  useWebGL = false
}
```

**Memory Management**:
```typescript
// Lazy loading of page textures
const loadPageTexture = useCallback((pageIndex: number) => {
  // Only load visible pages + 2 adjacent
  const visibleRange = [pageIndex - 1, pageIndex, pageIndex + 1]
  
  // Unload distant pages
  Object.keys(loadedTextures).forEach(index => {
    if (!visibleRange.includes(parseInt(index))) {
      unloadTexture(index)
    }
  })
}, [pageIndex])
```

**Animation Performance**:
```css
/* Use transform and opacity only */
.flipbook-page {
  transform: translate3d(0, 0, 0); /* Force GPU acceleration */
  backface-visibility: hidden;     /* Optimize repaints */
  perspective: 1000px;             /* Enable 3D context */
}

/* Avoid animating expensive properties */
.page-turn {
  /* ✅ Good - GPU accelerated */
  transform: rotateY(180deg);
  opacity: 0.8;
  
  /* ❌ Avoid - causes reflows */
  /* width: 50%; */
  /* left: 100px; */
}
```

#### Flipbook State Management
```typescript
interface FlipbookState {
  currentPage: number
  totalPages: number
  isFlipping: boolean
  isZoomed: boolean
  zoomLevel: number
  panOffset: { x: number, y: number }
  isFullscreen: boolean
  autoFlipEnabled: boolean
  flipDirection: 'forward' | 'backward'
}

// State transitions
const flipToPage = useCallback((targetPage: number) => {
  if (isFlipping) return  // Prevent concurrent flips
  
  setIsFlipping(true)
  
  // Animate page turn
  await animatePageTurn(currentPage, targetPage)
  
  setCurrentPage(targetPage)
  setIsFlipping(false)
}, [currentPage, isFlipping])
```

### 3. Exhibition System (`src/features/exhibition/`)

#### Purpose
Display chronological exhibition history with:
- **Timeline view**: Sorted by year (oldest to newest)
- **Interactive expansion**: Additional details on click
- **Navigation links**: Direct links to related galleries
- **Special exhibitions**: Featured interactive experiences

#### Data Structure
```typescript
interface Slide {
  id: string
  label: string  // Format: "YEAR • TITLE • VENUE • TYPE"
  images?: ExhibitionImage[]
  description?: string
  galleryLink?: string
  interactiveLink?: string
}

// Example:
{
  id: "2023-tankstelle",
  label: "2023 • First Solo Exhibition • Tankstelle Projektraum • Solo Show",
  images: [...],
  description: "Interactive 3D scan of my first exhibition",
  interactiveLink: "/tankstelle"
}
```

#### Component Behavior

**Exhibition.tsx** - Main container
```typescript
// 1. Fetch exhibition data
const slides = await getSlides()

// 2. Sort by year (earliest first)
const sortedSlides = slides.sort((a, b) => {
  const yearA = parseInt(a.label.match(/\d+/)?.[0] || '0', 10)
  const yearB = parseInt(b.label.match(/\d+/)?.[0] || '0', 10)
  return yearA - yearB
})

// 3. Render with staggered animations
<ExhibitionList slides={sortedSlides} />
```

**ExhibitionList.tsx** - Interactive timeline
```typescript
// Features:
// - Staggered entrance animations (50ms delay per item)
// - Expandable sections with smooth height transitions
// - Hover effects with micro-interactions
// - Mobile-optimized layout (multi-line on small screens)
// - Special treatment for featured exhibitions

// Animation configuration:
const smoothEasing = [0.4, 0, 0.2, 1]  // Material Design easing
const staggerDelay = 0.05               // 50ms between items
```

#### Mobile Optimization
```typescript
// Desktop: Single line display
"2023 • First Solo Exhibition • Tankstelle Projektraum • Solo Show"

// Mobile: Multi-line format
<div className="md:hidden">
  <div>2023 • First Solo Exhibition</div>
  <div className="text-xs text-neutral-400">
    Tankstelle Projektraum • Solo Show
  </div>
</div>
```

### 4. Hero System (`src/features/home/`)

#### Purpose & Features
- **Dynamic content**: Rotating hero images and content
- **Scroll interactions**: GSAP-powered scroll animations
- **Performance**: Optimized image loading and caching
- **Responsive**: Adapts to all screen sizes

#### Component Architecture

**Hero.tsx** - Main hero container
```typescript
interface HeroProps {
  initialSlides: Slide[]
  heroImage: string
}

// Features:
// - Server-side data fetching
// - Client-side interactivity
// - Image preloading
// - Error boundaries
```

**CinematicHeroScroll.tsx** - Scroll animations
```typescript
// GSAP ScrollTrigger implementation
useEffect(() => {
  const ctx = gsap.context(() => {
    // Parallax background
    gsap.to('.hero-background', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-container',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
    
    // Fade out hero content
    gsap.to('.hero-content', {
      opacity: 0,
      y: -100,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.hero-container',
        start: 'top top',
        end: 'bottom center',
        scrub: 1
      }
    })
  })
  
  return () => ctx.revert()  // Cleanup
}, [])
```

#### Data Services

**getSlides.ts** - Exhibition data fetching
```typescript
export async function getSlides(): Promise<Slide[]> {
  // Fetches from static data or CMS
  // Transforms data for UI consumption
  // Handles caching and error states
  
  return [
    {
      id: "2023-exhibition",
      label: "2023 • Title • Venue • Type",
      images: await getSlideImages("2023-exhibition")
    }
    // ...
  ]
}
```

**getHeroImage.ts** - Hero image management
```typescript
export async function getHeroImage(): Promise<string> {
  // Returns optimized hero image URL
  // Handles different screen sizes
  // Manages caching strategy
  
  const images = {
    desktop: '/images/hero-desktop.webp',
    mobile: '/images/hero-mobile.webp'
  }
  
  return images.desktop  // Server-side default
}
```

## Component Patterns

### 1. Server vs Client Components

#### When to Use Server Components (Default)
```typescript
// ✅ Data fetching
export default async function GalleryPage() {
  const images = await getGalleryImages('human')  // Server-side
  return <DesktopGallery images={images} />
}

// ✅ Static content
export default function AboutPage() {
  return (
    <div>
      <h1>About the Artist</h1>
      {/* Static content */}
    </div>
  )
}
```

#### When to Use Client Components
```typescript
'use client'  // Required directive

// ✅ Interactive state
const [isOpen, setIsOpen] = useState(false)

// ✅ Event handlers
const handleClick = () => setIsOpen(!isOpen)

// ✅ Browser APIs
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// ✅ Third-party libraries with hooks
import { useAnimation } from 'framer-motion'
```

### 2. Loading States & Suspense

#### Implementation Pattern
```typescript
// Page level
export default async function GalleryPage() {
  return (
    <Suspense fallback={<GalleryLoadingSkeleton />}>
      <GalleryContent />
    </Suspense>
  )
}

// Component level
function GalleryImage({ src, alt }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  return (
    <div className="relative">
      {isLoading && <ImageSkeleton />}
      {hasError && <ImageErrorFallback />}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        className={isLoading ? 'opacity-0' : 'opacity-100'}
      />
    </div>
  )
}
```

### 3. Error Boundaries

#### Implementation
```typescript
'use client'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}

export function ErrorBoundary({ children, fallback: Fallback }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    if (error) {
      console.error('ErrorBoundary caught an error:', error)
    }
  }, [error])
  
  if (error) {
    return Fallback ? <Fallback error={error} /> : <DefaultErrorFallback />
  }
  
  return <>{children}</>
}

// Usage
<ErrorBoundary fallback={GalleryErrorFallback}>
  <GalleryContent />
</ErrorBoundary>
```

### 4. Performance Optimization Patterns

#### Image Optimization
```typescript
// ✅ Use Next.js Image component
import Image from 'next/image'

<Image
  src={src}
  alt={alt}
  width={800}
  height={600}
  priority={isAboveFold}        // Prioritize above-fold images
  placeholder="blur"            // Show blur while loading
  blurDataURL="data:image/..."  // Low-quality placeholder
  sizes="(max-width: 768px) 100vw, 50vw"  // Responsive sizing
/>

// ✅ Lazy loading for galleries
<Image
  src={src}
  alt={alt}
  loading={index < 4 ? 'eager' : 'lazy'}  // Load first 4 immediately
/>
```

#### Component Memoization
```typescript
// ✅ Memo for expensive renders
const GalleryImage = memo(function GalleryImage({ image, onLoad }: Props) {
  // Expensive rendering logic
  return <Image ... />
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.image.url === nextProps.image.url
})

// ✅ useMemo for expensive calculations
const processedImages = useMemo(() => {
  return images
    .filter(img => img.visible)
    .map(img => ({
      ...img,
      aspectRatio: img.width / img.height
    }))
}, [images])

// ✅ useCallback for stable references
const handleImageLoad = useCallback((imageId: string) => {
  setLoadedImages(prev => new Set([...prev, imageId]))
}, [])
```

### 5. Animation Patterns

#### Framer Motion Patterns
```typescript
// ✅ Reusable animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Usage
<motion.div variants={staggerContainer} initial="initial" animate="animate">
  {items.map((item, index) => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### GSAP Integration
```typescript
// ✅ Proper GSAP cleanup
useEffect(() => {
  const ctx = gsap.context(() => {
    // GSAP animations
    gsap.to('.element', { opacity: 1, duration: 1 })
  })
  
  return () => ctx.revert()  // Important: cleanup
}, [])

// ✅ ScrollTrigger patterns
useEffect(() => {
  ScrollTrigger.create({
    trigger: '.trigger-element',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => console.log('entered'),
    onLeave: () => console.log('left'),
    onUpdate: (self) => console.log('progress:', self.progress)
  })
  
  return () => ScrollTrigger.killAll()
}, [])
```

## Data Flow & State Management

### 1. Server-Side Data Fetching

#### Page Level Data Fetching
```typescript
// app/gallery/[type]/page.tsx
interface PageProps {
  params: { type: string }
}

export default async function GalleryPage({ params }: PageProps) {
  // Server-side data fetching
  const images = await getGalleryImages(params.type as GalleryType)
  const settings = await getGallerySettings(params.type)
  
  // Error handling
  if (!images.length) {
    notFound()  // Return 404
  }
  
  return (
    <GalleryLayout>
      <DesktopGallery 
        images={images}
        settings={settings}
      />
    </GalleryLayout>
  )
}

// Generate static params for ISR
export async function generateStaticParams() {
  return [
    { type: 'human' },
    { type: 'non-human' },
    { type: 'exhibition' }
  ]
}
```

#### Data Service Patterns
```typescript
// services/galleryData.ts
export async function getGalleryImages(type: GalleryType): Promise<GalleryImage[]> {
  try {
    // Fetch from Vercel Blob or API
    const response = await fetch(`${BLOB_BASE_URL}/galleries/${type}`)
    const data = await response.json()
    
    // Transform and validate data
    return data.images.map(transformGalleryImage).filter(Boolean)
    
  } catch (error) {
    console.error(`Failed to fetch ${type} gallery:`, error)
    
    // Return fallback data or empty array
    return []
  }
}

function transformGalleryImage(raw: any): GalleryImage | null {
  // Validate required fields
  if (!raw.url || !raw.alt) return null
  
  return {
    url: raw.url,
    alt: raw.alt,
    width: raw.width || 800,
    height: raw.height || 600,
    // ... other transformations
  }
}
```

### 2. Client-Side State Management

#### Local Component State
```typescript
function GalleryComponent() {
  // Simple state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Derived state
  const currentImage = images[currentIndex]
  const hasNext = currentIndex < images.length - 1
  const hasPrev = currentIndex > 0
  
  // State updates
  const nextImage = useCallback(() => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [hasNext])
}
```

#### Complex State with useReducer
```typescript
// For flipbook state management
interface FlipbookState {
  currentPage: number
  totalPages: number
  isFlipping: boolean
  isZoomed: boolean
  zoomLevel: number
  panOffset: { x: number, y: number }
}

type FlipbookAction = 
  | { type: 'SET_PAGE', page: number }
  | { type: 'START_FLIP' }
  | { type: 'END_FLIP' }
  | { type: 'SET_ZOOM', level: number }
  | { type: 'SET_PAN', offset: { x: number, y: number } }

function flipbookReducer(state: FlipbookState, action: FlipbookAction): FlipbookState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.page }
    case 'START_FLIP':
      return { ...state, isFlipping: true }
    case 'END_FLIP':
      return { ...state, isFlipping: false }
    // ... other cases
    default:
      return state
  }
}

function useFlipbook(images: FlipbookImage[]) {
  const [state, dispatch] = useReducer(flipbookReducer, {
    currentPage: 0,
    totalPages: images.length,
    isFlipping: false,
    isZoomed: false,
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 }
  })
  
  const flipToPage = useCallback((page: number) => {
    if (state.isFlipping) return
    
    dispatch({ type: 'START_FLIP' })
    
    // Animate page turn
    setTimeout(() => {
      dispatch({ type: 'SET_PAGE', page })
      dispatch({ type: 'END_FLIP' })
    }, 500)
  }, [state.isFlipping])
  
  return { state, flipToPage, dispatch }
}
```

### 3. Global State (Context)

#### Theme Context Example
```typescript
// contexts/ThemeContext.tsx
interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  
  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])
  
  // Persist theme preference
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      setIsDark(saved === 'dark')
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

## Performance Optimization

### 1. Image Optimization Strategy

#### Next.js Image Component Configuration
```typescript
// next.config.js
const nextConfig = {
  images: {
    domains: ['your-blob-domain.vercel-storage.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

#### Responsive Image Implementation
```typescript
function ResponsiveGalleryImage({ image }: { image: GalleryImage }) {
  return (
    <Image
      src={image.url}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={generateBlurDataURL(image.width, image.height)}
      className="object-cover transition-opacity duration-300"
    />
  )
}

function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  // Create simple gradient blur
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(1, '#e5e7eb')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL()
}
```

### 2. Bundle Optimization

#### Code Splitting Strategies
```typescript
// Dynamic imports for heavy components
const FlipbookModal = dynamic(() => import('./FlipbookModal'), {
  ssr: false,  // Client-side only
  loading: () => <FlipbookLoadingSkeleton />
})

// Conditional loading
function SocialBookPage() {
  const [showFlipbook, setShowFlipbook] = useState(false)
  
  return (
    <div>
      <button onClick={() => setShowFlipbook(true)}>
        Open Flipbook
      </button>
      
      {showFlipbook && (
        <FlipbookModal onClose={() => setShowFlipbook(false)} />
      )}
    </div>
  )
}
```

#### Tree Shaking Optimization
```typescript
// ✅ Import only what you need
import { motion } from 'framer-motion'  // Only motion
import { gsap } from 'gsap'             // Only core GSAP

// ❌ Avoid importing entire libraries
import * as FramerMotion from 'framer-motion'  // Imports everything
import _ from 'lodash'                          // Entire lodash
```

### 3. Runtime Performance

#### Virtual Scrolling for Large Galleries
```typescript
import { FixedSizeGrid as Grid } from 'react-window'

function VirtualizedGallery({ images }: { images: GalleryImage[] }) {
  const ITEM_SIZE = 300
  const GUTTER_SIZE = 20
  
  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * COLUMNS + columnIndex
    const image = images[index]
    
    if (!image) return null
    
    return (
      <div style={{
        ...style,
        left: style.left + GUTTER_SIZE,
        top: style.top + GUTTER_SIZE,
        width: style.width - GUTTER_SIZE,
        height: style.height - GUTTER_SIZE,
      }}>
        <GalleryImage image={image} />
      </div>
    )
  }
  
  return (
    <Grid
      columnCount={COLUMNS}
      columnWidth={ITEM_SIZE + GUTTER_SIZE}
      height={600}
      rowCount={Math.ceil(images.length / COLUMNS)}
      rowHeight={ITEM_SIZE + GUTTER_SIZE}
      width={800}
    >
      {Cell}
    </Grid>
  )
}
```

#### Intersection Observer for Lazy Loading
```typescript
function useIntersectionObserver(
  elementRef: RefObject<Element>,
  { threshold = 0.1, root = null, rootMargin = '50px' }: IntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold, root, rootMargin }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin])
  
  return isIntersecting
}

// Usage
function LazyImage({ src, alt }: ImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(imageRef, {
    rootMargin: '100px'  // Load 100px before entering viewport
  })
  
  return (
    <div ref={imageRef}>
      {isVisible ? (
        <Image src={src} alt={alt} />
      ) : (
        <ImagePlaceholder />
      )}
    </div>
  )
}
```

### 4. Memory Management

#### Cleanup Patterns
```typescript
function FlipbookComponent() {
  const engineRef = useRef<FlipbookEngine | null>(null)
  
  useEffect(() => {
    // Initialize WebGL engine
    engineRef.current = new FlipbookEngine()
    engineRef.current.initialize()
    
    return () => {
      // Cleanup WebGL resources
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [])
  
  useEffect(() => {
    // Event listeners
    const handleResize = () => {
      engineRef.current?.resize()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
}
```

#### Texture Management in WebGL
```typescript
class FlipbookEngine {
  private textures = new Map<string, WebGLTexture>()
  private maxTextures = 10  // Limit memory usage
  
  loadTexture(url: string): Promise<WebGLTexture> {
    // Check if already loaded
    if (this.textures.has(url)) {
      return Promise.resolve(this.textures.get(url)!)
    }
    
    // Clean up old textures if at limit
    if (this.textures.size >= this.maxTextures) {
      this.evictOldestTexture()
    }
    
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        const texture = this.createTexture(image)
        this.textures.set(url, texture)
        resolve(texture)
      }
      image.onerror = reject
      image.src = url
    })
  }
  
  private evictOldestTexture() {
    const [firstKey] = this.textures.keys()
    const texture = this.textures.get(firstKey)
    
    if (texture) {
      this.gl.deleteTexture(texture)
      this.textures.delete(firstKey)
    }
  }
  
  dispose() {
    // Clean up all textures
    this.textures.forEach(texture => {
      this.gl.deleteTexture(texture)
    })
    this.textures.clear()
  }
}
```

## Common Development Tasks

### 1. Adding a New Gallery Type

#### Step 1: Update Types
```typescript
// src/types/gallery.ts
export type GalleryType = 'human' | 'non-human' | 'exhibition' | 'new-type'

export interface GalleryMetadata {
  type: GalleryType
  title: string
  description: string
  alternateGalleryLink: string
}
```

#### Step 2: Create Route
```typescript
// src/app/gallery/new-type/page.tsx
export default async function NewTypeGalleryPage() {
  const images = await getGalleryImages('new-type')
  const metadata = await getGalleryMetadata('new-type')
  
  return (
    <GalleryLayout>
      <DesktopGallery 
        images={images}
        title={metadata.title}
        alternateGalleryLink={metadata.alternateGalleryLink}
        galleryType="new-type"
      />
    </GalleryLayout>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'New Type Gallery - Valentin Mici',
    description: 'Description of new gallery type',
  }
}
```

#### Step 3: Update Data Service
```typescript
// src/features/gallery/services/galleryData.ts
export async function getGalleryImages(type: GalleryType): Promise<GalleryImage[]> {
  switch (type) {
    case 'human':
      return await fetchHumanGallery()
    case 'non-human':
      return await fetchNonHumanGallery()
    case 'exhibition':
      return await fetchExhibitionGallery()
    case 'new-type':  // Add new case
      return await fetchNewTypeGallery()
    default:
      throw new Error(`Unknown gallery type: ${type}`)
  }
}

async function fetchNewTypeGallery(): Promise<GalleryImage[]> {
  // Implement data fetching logic
  const response = await fetch('/api/galleries/new-type')
  const data = await response.json()
  return data.images
}
```

#### Step 4: Update Navigation
```typescript
// src/shared/layout/Header.tsx or navigation component
const galleryLinks = [
  { href: '/gallery/human', label: 'Human' },
  { href: '/gallery/non-human', label: 'Non-Human' },
  { href: '/gallery/exhibition', label: 'Exhibition' },
  { href: '/gallery/new-type', label: 'New Type' },  // Add link
]
```

### 2. Adding a New Feature Module

#### Step 1: Create Feature Directory
```bash
mkdir -p src/features/new-feature/{components,hooks,services}
```

#### Step 2: Create Core Component
```typescript
// src/features/new-feature/components/NewFeature.tsx
interface NewFeatureProps {
  data: NewFeatureData[]
}

export default function NewFeature({ data }: NewFeatureProps) {
  return (
    <div className="new-feature">
      {data.map(item => (
        <NewFeatureItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function NewFeatureItem({ item }: { item: NewFeatureData }) {
  // Component implementation
}
```

#### Step 3: Add Data Service
```typescript
// src/features/new-feature/services/getNewFeatureData.ts
export interface NewFeatureData {
  id: string
  title: string
  description: string
  // ... other properties
}

export async function getNewFeatureData(): Promise<NewFeatureData[]> {
  try {
    // Fetch from API or static data
    const response = await fetch('/api/new-feature')
    const data = await response.json()
    
    // Validate and transform data
    return data.map(transformNewFeatureItem).filter(Boolean)
    
  } catch (error) {
    console.error('Failed to fetch new feature data:', error)
    return []
  }
}

function transformNewFeatureItem(raw: any): NewFeatureData | null {
  if (!raw.id || !raw.title) return null
  
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description || '',
    // ... transform other fields
  }
}
```

#### Step 4: Create Hook (if needed)
```typescript
// src/features/new-feature/hooks/useNewFeature.ts
export function useNewFeature(initialData: NewFeatureData[]) {
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const refreshData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newData = await getNewFeatureData()
      setData(newData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return {
    data,
    isLoading,
    error,
    refreshData
  }
}
```

#### Step 5: Create Page Route
```typescript
// src/app/new-feature/page.tsx
import NewFeature from '@/features/new-feature/components/NewFeature'
import { getNewFeatureData } from '@/features/new-feature/services/getNewFeatureData'

export default async function NewFeaturePage() {
  const data = await getNewFeatureData()
  
  return (
    <main>
      <h1>New Feature</h1>
      <NewFeature data={data} />
    </main>
  )
}

export const metadata = {
  title: 'New Feature - Valentin Mici',
  description: 'Description of the new feature',
}
```

### 3. Implementing Animations

#### Basic Framer Motion Animation
```typescript
import { motion } from 'framer-motion'

// Define reusable variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

function AnimatedList({ items }: { items: any[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={fadeInUp}
          custom={index}
        >
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

#### Complex GSAP Animation
```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function useScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const ctx = gsap.context(() => {
      // Parallax effect
      gsap.to('.parallax-element', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
      
      // Fade in elements on scroll
      gsap.fromTo('.fade-in-element', 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: container,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, container)
    
    return () => ctx.revert()
  }, [])
  
  return containerRef
}
```

### 4. Working with Images and Assets

#### Image Upload Script
```typescript
// scripts/upload-images.ts
import { put } from '@vercel/blob'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

async function uploadImages(directory: string, prefix: string) {
  const files = readdirSync(directory)
  
  for (const file of files) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue
    
    const filePath = join(directory, file)
    const fileContent = readFileSync(filePath)
    
    const blob = await put(`${prefix}/${file}`, fileContent, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
    
    console.log(`Uploaded: ${file} -> ${blob.url}`)
  }
}

// Usage
uploadImages('./public/images/gallery', 'gallery/human')
```

#### WebP Conversion Script
```typescript
// scripts/convert-to-webp.ts
import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

async function convertToWebP(inputDir: string, outputDir: string) {
  const files = readdirSync(inputDir)
  
  for (const file of files) {
    const inputPath = join(inputDir, file)
    const stat = statSync(inputPath)
    
    if (!stat.isFile()) continue
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue
    
    const outputFileName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    const outputPath = join(outputDir, outputFileName)
    
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
    
    console.log(`Converted: ${file} -> ${outputFileName}`)
  }
}
```

#### Dynamic Image Generation
```typescript
// Generate placeholder images for development
function generatePlaceholderImage(width: number, height: number, text: string): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return ''
  
  canvas.width = width
  canvas.height = height
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Text
  ctx.fillStyle = 'white'
  ctx.font = `${Math.min(width, height) / 10}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  
  return canvas.toDataURL('image/jpeg', 0.8)
}
```

## Debugging & Troubleshooting

### 1. Common Issues & Solutions

#### Build Failures

**Import Path Issues**:
```bash
# Error: Cannot find module '@/features/...'
# Solution: Check tsconfig.json paths configuration

# tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Type Errors**:
```typescript
// Error: Type 'undefined' is not assignable to type 'GalleryImage[]'
// Solution: Add proper type guards and default values

function processGalleryData(data: unknown): GalleryImage[] {
  if (!Array.isArray(data)) {
    console.warn('Gallery data is not an array:', data)
    return []
  }
  
  return data.filter((item): item is GalleryImage => {
    return typeof item === 'object' && 
           item !== null && 
           'url' in item && 
           'alt' in item
  })
}
```

**Missing Environment Variables**:
```typescript
// Error: Process.env.BLOB_READ_WRITE_TOKEN is undefined
// Solution: Add environment validation

function validateEnv() {
  const required = ['BLOB_READ_WRITE_TOKEN', 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY']
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }
}

validateEnv()  // Call early in app initialization
```

#### Runtime Issues

**Memory Leaks in WebGL**:
```typescript
// Problem: WebGL textures not cleaned up
// Solution: Proper disposal pattern

class FlipbookEngine {
  private disposed = false
  
  dispose() {
    if (this.disposed) return
    
    // Clean up all WebGL resources
    this.textures.forEach(texture => {
      this.gl.deleteTexture(texture)
    })
    
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
    
    this.disposed = true
  }
}

// Usage with cleanup
useEffect(() => {
  const engine = new FlipbookEngine()
  
  return () => {
    engine.dispose()  // Always cleanup
  }
}, [])
```

**Safari Mobile Performance**:
```typescript
// Problem: Flipbook is slow on Safari mobile
// Solution: Browser-specific optimizations

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
const isMobile = window.innerWidth < 768

if (isSafari && isMobile) {
  // Reduce quality and effects
  const optimizations = {
    textureQuality: 0.5,
    enableBlur: false,
    enableShadows: false,
    useWebGL: false  // Fall back to CSS transforms
  }
}
```

**Image Loading Failures**:
```typescript
// Problem: Images fail to load from Blob storage
// Solution: Retry mechanism with exponential backoff

async function loadImageWithRetry(src: string, maxRetries = 3): Promise<HTMLImageElement> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    } catch (error) {
      if (attempt === maxRetries) throw error
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('Max retries exceeded')
}
```

### 2. Debug Tools & Logging

#### Development Debugging
```typescript
// Debug utility for development
function createDebugLogger(namespace: string) {
  const isEnabled = process.env.NODE_ENV === 'development'
  
  return {
    log: (message: string, ...args: any[]) => {
      if (isEnabled) {
        console.log(`[${namespace}] ${message}`, ...args)
      }
    },
    
    error: (message: string, error?: Error) => {
      if (isEnabled) {
        console.error(`[${namespace}] ${message}`, error)
      }
    },
    
    time: (label: string) => {
      if (isEnabled) {
        console.time(`[${namespace}] ${label}`)
      }
    },
    
    timeEnd: (label: string) => {
      if (isEnabled) {
        console.timeEnd(`[${namespace}] ${label}`)
      }
    }
  }
}

// Usage
const debug = createDebugLogger('FlipbookEngine')
debug.time('texture loading')
// ... texture loading code
debug.timeEnd('texture loading')
```

#### Performance Monitoring
```typescript
// Performance monitoring utility
function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes(componentName)) {
          console.log(`${componentName} performance:`, {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          })
        }
      }
    })
    
    observer.observe({ entryTypes: ['measure'] })
    
    return () => observer.disconnect()
  }, [componentName])
  
  const measurePerformance = useCallback((operationName: string, operation: () => void) => {
    const startMark = `${componentName}-${operationName}-start`
    const endMark = `${componentName}-${operationName}-end`
    const measureName = `${componentName}-${operationName}`
    
    performance.mark(startMark)
    operation()
    performance.mark(endMark)
    performance.measure(measureName, startMark, endMark)
  }, [componentName])
  
  return { measurePerformance }
}
```

#### Error Tracking
```typescript
// Error tracking service
class ErrorTracker {
  private errors: Array<{ error: Error, context: string, timestamp: Date }> = []
  
  track(error: Error, context: string) {
    this.errors.push({
      error,
      context,
      timestamp: new Date()
    })
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToTrackingService(error, context)
    } else {
      console.error(`[${context}]`, error)
    }
  }
  
  private sendToTrackingService(error: Error, context: string) {
    // Send to Sentry, LogRocket, etc.
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(console.error)
  }
  
  getRecentErrors(minutes = 5) {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    return this.errors.filter(entry => entry.timestamp > cutoff)
  }
}

// Global error tracker instance
export const errorTracker = new ErrorTracker()

// Usage in components
try {
  // Risky operation
  await loadFlipbookTextures()
} catch (error) {
  errorTracker.track(error as Error, 'FlipbookEngine.loadTextures')
  // Handle error gracefully
}
```

### 3. Browser-Specific Debugging

#### Safari Debugging
```typescript
// Safari-specific debug utilities
function createSafariDebugger() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  
  if (!isSafari) return null
  
  return {
    checkWebGLSupport() {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      
      console.log('Safari WebGL Support:', {
        supported: !!gl,
        version: gl?.getParameter(gl.VERSION),
        vendor: gl?.getParameter(gl.VENDOR),
        renderer: gl?.getParameter(gl.RENDERER)
      })
      
      return !!gl
    },
    
    checkMemoryUsage() {
      if ('memory' in performance) {
        console.log('Safari Memory Usage:', {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        })
      }
    },
    
    logTouchEvents() {
      const events = ['touchstart', 'touchmove', 'touchend']
      
      events.forEach(event => {
        document.addEventListener(event, (e) => {
          console.log(`Safari Touch Event: ${event}`, {
            touches: e.touches.length,
            changedTouches: e.changedTouches.length,
            target: e.target
          })
        }, { passive: true })
      })
    }
  }
}

// Use in development
if (process.env.NODE_ENV === 'development') {
  const safariDebugger = createSafariDebugger()
  safariDebugger?.checkWebGLSupport()
  safariDebugger?.logTouchEvents()
}
```

#### Chrome DevTools Integration
```typescript
// DevTools integration for flipbook debugging
function setupFlipbookDevtools() {
  if (typeof window === 'undefined') return
  
  // Add global debugging functions
  (window as any).flipbookDebug = {
    getState() {
      // Return current flipbook state
    },
    
    jumpToPage(page: number) {
      // Force jump to specific page
    },
    
    toggleWebGL() {
      // Switch between WebGL and CSS rendering
    },
    
    dumpTextures() {
      // Log all loaded textures
    },
    
    simulateError(type: string) {
      // Simulate different error conditions
    }
  }
  
  console.log('Flipbook debug tools available at window.flipbookDebug')
}
```

## Deployment & Production

### 1. Build Process

#### Production Build Configuration
```typescript
// next.config.js
const nextConfig = {
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  // Image optimization
  images: {
    domains: ['your-blob-domain.vercel-storage.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000  // 1 year
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/gallery',
        destination: '/gallery/human',
        permanent: true
      }
    ]
  }
}
```

#### Environment Variables for Production
```bash
# .env.production
BLOB_READ_WRITE_TOKEN=prod_blob_token
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=prod_recaptcha_key
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX
NEXT_PUBLIC_APP_URL=https://valentinmici.com

# Build-time optimization
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--no-deprecation
```

### 2. Vercel Deployment

#### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

#### Deployment Checklist
```bash
# Pre-deployment checklist
□ Environment variables configured in Vercel dashboard
□ Domain and SSL configured
□ Build passes locally: pnpm build
□ No TypeScript errors: pnpm lint
□ Images optimized and uploaded to Blob storage
□ Performance tested on mobile and desktop
□ Error tracking configured
□ Analytics configured

# Deployment commands
pnpm build              # Local build test
git push origin main    # Trigger deployment
```

### 3. Performance Monitoring

#### Web Vitals Tracking
```typescript
// src/lib/analytics.ts
export function reportWebVitals(metric: any) {
  // Send to analytics service
  if (process.env.NEXT_PUBLIC_GA_ID) {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true
    })
  }
  
  // Send to custom analytics
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric)
  }).catch(console.error)
}

// Usage in _app.tsx
export { reportWebVitals }
```

#### Lighthouse Optimization Targets
```bash
Performance Score: >90
Accessibility: >95
Best Practices: >90
SEO: >95

Key Metrics:
- First Contentful Paint: <2.5s
- Largest Contentful Paint: <4s
- First Input Delay: <100ms
- Cumulative Layout Shift: <0.1
```

### 4. Maintenance & Updates

#### Update Strategy
```bash
# Regular maintenance schedule
□ Weekly: Dependency updates (patch versions)
□ Monthly: Minor version updates
□ Quarterly: Major version updates
□ As needed: Security updates

# Update commands
pnpm update --latest    # Update all dependencies
pnpm audit              # Check for vulnerabilities
pnpm build              # Test build after updates
```

#### Monitoring & Alerting
```typescript
// Health check endpoint
// src/app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    blobStorage: await checkBlobStorage(),
    webgl: await checkWebGLSupport(),
    memory: process.memoryUsage(),
    uptime: process.uptime()
  }
  
  const isHealthy = Object.values(checks).every(check => 
    typeof check === 'boolean' ? check : true
  )
  
  return Response.json(
    { status: isHealthy ? 'healthy' : 'unhealthy', checks },
    { status: isHealthy ? 200 : 500 }
  )
}
```

This comprehensive guide provides the foundation for understanding, developing, and maintaining the Valentin Mici portfolio codebase. Refer to specific sections as needed, and always test changes thoroughly before deploying to production.