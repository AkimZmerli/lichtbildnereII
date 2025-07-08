# Portfolio Project Repository Guide

A comprehensive, actionable guide to the portfolio project codebase, designed for developers, AI assistants, and contributors to quickly understand and work with the system.

## Quick Navigation

| Section | Purpose | For Who |
|---------|---------|---------|
| [🚀 Quick Start](#quick-start) | Get running immediately | New developers |
| [🏗️ Architecture](#architecture-overview) | Understand system design | All developers |
| [📁 Directory Guide](#directory-structure-guide) | Navigate the codebase | AI assistants, developers |
| [🔧 Development Workflow](#development-workflow) | Daily development tasks | Active contributors |
| [📊 Project Status](#current-project-status) | Current state and priorities | Project managers |

---

## Quick Start

### For New Developers

```bash
# 1. Clone and setup
git clone <repository-url>
cd portfolio-project
pnpm install

# 2. Environment setup
cp env.example .env
# Edit .env with your database credentials

# 3. Start database
docker run --name portfolio-postgres -e POSTGRES_DB=portfolio -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# 4. Start development
pnpm dev
```

**Access Points**:
- Frontend: http://localhost:3000
- CMS Admin: http://localhost:3000/admin
- API Docs: http://localhost:3000/api/graphql-playground

### For AI Assistants

**Key Files to Understand**:
1. `AI/docs/ARCHITECTURE.md` - System design and data flow
2. `AI/docs/API.md` - Complete API reference
3. `AI/docs/COMPONENT_LIBRARY.md` - Component usage and props
4. `AI/docs/BUSINESS_DOMAIN.md` - Domain knowledge and context
5. `src/payload.config.ts` - CMS configuration and collections

---

## Architecture Overview

### System Type
**Headless CMS Architecture** with Next.js frontend and PayloadCMS backend.

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.3.0 | React framework with App Router |
| PayloadCMS | 3.33.0 | Headless CMS and API |
| PostgreSQL | 15+ | Database |
| TypeScript | 5.7.3 | Type safety |
| Tailwind CSS | 4.1.3 | Styling |

### High-Level Data Flow
```
Admin → PayloadCMS → PostgreSQL → API → Next.js → User
  ↓
1. Content creation in CMS admin
2. Data stored in PostgreSQL
3. API endpoints auto-generated
4. Frontend fetches and displays
5. User interacts with portfolio
```

---

## Directory Structure Guide

### Root Level Organization

```
portfolio-project/
├── AI/                    # 🤖 AI collaboration and documentation
├── src/                   # 💻 Application source code
├── public/               # 📁 Static assets
├── media/                # 🖼️ Uploaded media files
└── [config files]        # ⚙️ Project configuration
```

### Source Code Structure (`src/`)

```
src/
├── app/
│   ├── (frontend)/       # 🌐 Public website
│   │   ├── components/   # 🧩 Reusable UI components
│   │   ├── gallery/      # 🖼️ Gallery pages (human/non-human)
│   │   ├── hooks/        # 🪝 Custom React hooks
│   │   ├── lib/          # 📚 Utility functions
│   │   └── [pages]       # 📄 Route pages
│   └── (payload)/        # 🔧 CMS admin and API
│       ├── admin/        # 👨‍💼 Admin interface
│       └── api/          # 🔌 REST/GraphQL endpoints
├── collections/          # 📊 Data models (PayloadCMS)
├── lib/                  # 🛠️ Shared utilities
└── payload.config.ts     # ⚙️ CMS configuration
```

### Component Organization (`src/app/(frontend)/components/`)

```
components/
├── galleries/            # 🖼️ Gallery-specific components
│   ├── DesktopGallery.tsx    # Desktop gallery view
│   ├── MobileGallery.tsx     # Mobile gallery view
│   ├── MasonryGallery.tsx    # Grid layout
│   └── layout/               # Gallery layouts
├── layout/               # 🏗️ Site structure
│   ├── Header.tsx            # Main navigation
│   ├── Footer.tsx            # Site footer
│   └── BurgerMenu.tsx        # Mobile menu
├── sections/             # 📄 Page sections
│   ├── Hero.tsx              # Homepage hero
│   ├── DisplayMovie.tsx      # Video showcase (Mux)
│   ├── SocialBook.tsx        # Interactive visitor book
│   └── Exhibition.tsx        # 3D exhibition (Sketchfab)
├── ui/                   # 🎨 Reusable UI elements
│   ├── ImageWithLoader.tsx   # Optimized images
│   ├── Menu.tsx              # Navigation menus
│   └── SlideDropdown.tsx     # Animated dropdowns
└── utils/                # 🔧 Utility components
    ├── scrollHandler.tsx     # Scroll management
    └── scrollToSection.tsx   # Smooth scrolling
```

### Data Models (`src/collections/`)

```
collections/
├── Users.ts              # 👤 Authentication
├── Media.ts              # 📁 File uploads
├── GalleryItem.ts        # 🖼️ Gallery images
├── HeroImage.ts          # 🌟 Homepage heroes
├── Slides.ts             # 🎠 Slideshow content
└── SiteSettings.ts       # ⚙️ Global settings
```

---

## Development Workflow

### Daily Development Tasks

**Starting Development**:
```bash
# Start all services
pnpm dev                  # Starts Next.js dev server
# Database should already be running

# Generate types after collection changes
pnpm generate:types

# Lint and format code
pnpm lint
pnpm lint --fix
```

**Working with Content**:
1. **Admin Access**: http://localhost:3000/admin
2. **Create Content**: Upload media, create gallery items
3. **API Testing**: Use GraphQL playground at `/api/graphql-playground`
4. **Frontend Testing**: View changes at http://localhost:3000

**Common Development Patterns**:

```typescript
// 1. Fetching data in components
async function getGalleryItems() {
  const response = await fetch('/api/gallery-item?category=human');
  return response.json();
}

// 2. Creating new components
interface ComponentProps {
  title: string;
  items: GalleryItem[];
}

export function NewComponent({ title, items }: ComponentProps) {
  // Component implementation
}

// 3. Adding new collections
export const NewCollection: CollectionConfig = {
  slug: 'new-collection',
  fields: [
    { name: 'title', type: 'text', required: true }
  ]
};
```

### File Modification Guidelines

**When to Edit Which Files**:

| Task | Files to Modify | Notes |
|------|----------------|-------|
| **Add new page** | `src/app/(frontend)/[route]/page.tsx` | Use App Router conventions |
| **Add component** | `src/app/(frontend)/components/[category]/` | Choose appropriate category |
| **Modify data model** | `src/collections/[Collection].ts` | Run `pnpm generate:types` after |
| **Add API endpoint** | `src/app/(payload)/api/[route]/` | PayloadCMS auto-generates most |
| **Update styling** | Component files with Tailwind classes | Follow existing patterns |
| **Add business logic** | `src/lib/` or component-specific files | Keep logic close to usage |

### Testing Strategy (Future)

**Planned Testing Structure**:
```
tests/
├── unit/                 # Component and utility tests
├── integration/          # API and database tests
├── e2e/                  # End-to-end user flows
└── fixtures/             # Test data
```

**Testing Commands** (when implemented):
```bash
pnpm test                 # Run all tests
pnpm test:unit           # Unit tests only
pnpm test:e2e            # End-to-end tests
pnpm test:watch          # Watch mode
```

---

## Current Project Status

### ✅ Completed Features

**Core Infrastructure**:
- ✅ Next.js 15 with App Router setup
- ✅ PayloadCMS 3.x integration
- ✅ PostgreSQL database configuration
- ✅ TypeScript configuration
- ✅ Tailwind CSS styling system

**Content Management**:
- ✅ Media upload and management
- ✅ Gallery item creation and categorization
- ✅ Hero image management
- ✅ Site settings configuration

**Frontend Features**:
- ✅ Responsive gallery views (desktop/mobile)
- ✅ Human/non-human gallery categorization
- ✅ Video showcase with Mux Player
- ✅ 3D exhibition viewer with Sketchfab
- ✅ Interactive social book feature

### 🚧 In Progress


**Code Quality**:
- 🚧 TypeScript strict mode implementation
- 🚧 ESLint rule refinement
- 🚧 Component prop validation

### 📋 Planned Features

**Testing Infrastructure**:
- 📋 Unit testing setup (Jest + Testing Library)
- 📋 E2E testing (Playwright)
- 📋 API testing suite
- 📋 Visual regression testing

**Performance Optimization**:
- 📋 Image optimization pipeline
- 📋 Bundle size optimization
- 📋 Caching strategy implementation
- 📋 Performance monitoring

**Architecture Evolution**:
- 📋 Vertical slice architecture migration
- 📋 Feature-based code organization
- 📋 Improved separation of concerns

### 🐛 Known Issues

**High Priority**:
- 🐛 Missing error boundaries in components
- 🐛 Incomplete TypeScript coverage
- 🐛 No loading states for async operations

**Medium Priority**:
- 🐛 Inconsistent naming conventions
- 🐛 Missing accessibility features
- 🐛 No offline support

**Low Priority**:
- 🐛 Bundle size could be optimized
- 🐛 Some components lack proper memoization

---

## AI Collaboration Guidelines

### For AI Assistants Working on This Project

**Understanding the Codebase**:
1. **Start with**: `AI/docs/BUSINESS_DOMAIN.md` for context
2. **Reference**: `AI/docs/ARCHITECTURE.md` for technical understanding
3. **Use**: `AI/docs/API.md` for data operations
4. **Check**: `AI/docs/COMPONENT_LIBRARY.md` for UI patterns

**Making Changes**:
1. **Follow existing patterns** in similar components
2. **Use TypeScript interfaces** for all props and data
3. **Add JSDoc comments** for complex functions
4. **Test changes** in development environment
5. **Update documentation** in change_log.md

**Common Tasks and Approaches**:

```typescript
// Adding a new gallery component
interface NewGalleryProps {
  images: GalleryImage[];
  category: 'human' | 'non-human';
  onImageSelect?: (image: GalleryImage) => void;
}

export function NewGallery({ images, category, onImageSelect }: NewGalleryProps) {
  // Implementation following existing patterns
}

// Adding a new API endpoint
export async function GET(request: Request) {
  const items = await payload.find({
    collection: 'gallery-item',
    // Query parameters
  });
  
  return Response.json(items);
}

// Adding a new collection
export const NewCollection: CollectionConfig = {
  slug: 'new-collection',
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
  },
  fields: [
    // Field definitions
  ]
};
```

### Code Quality Standards

**TypeScript Usage**:
- ✅ Use strict type checking
- ✅ Define interfaces for all props
- ✅ Avoid `any` types
- ✅ Use proper generic types

**Component Patterns**:
- ✅ Functional components with hooks
- ✅ Props destructuring with TypeScript
- ✅ Proper error handling
- ✅ Loading states for async operations

**Styling Guidelines**:
- ✅ Use Tailwind CSS utility classes
- ✅ Follow responsive design patterns
- ✅ Maintain consistent spacing and typography
- ✅ Use semantic HTML elements

---

## Performance Metrics

### Current Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| **First Contentful Paint** | < 1.5s | 🔄 Measuring |
| **Largest Contentful Paint** | < 2.5s | 🔄 Measuring |
| **Time to Interactive** | < 3.0s | 🔄 Measuring |
| **API Response Time** | < 200ms | 🔄 Measuring |

### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true pnpm build

# Check for large dependencies
pnpm ls --depth=0 | grep -E "(react|payload)"
```

---

## Deployment Information

### Environment Requirements

**Development**:
- Node.js 18.20.2+
- PostgreSQL 15+
- pnpm 9 or 10

**Production**:
- Same as development
- Environment variables configured
- Database migrations applied
- Media storage configured

### Deployment Commands

```bash
# Production build
pnpm build

# Start production server
pnpm start

# Database operations
pnpm payload db:migrate
pnpm payload db:seed
```

---

## Getting Help

### Documentation Resources

| Resource | Purpose | Location |
|----------|---------|----------|
| **Setup Guide** | Development environment | `AI/docs/SETUP.md` |
| **Architecture** | System design | `AI/docs/ARCHITECTURE.md` |
| **API Reference** | Endpoint documentation | `AI/docs/API.md` |
| **Components** | UI component guide | `AI/docs/COMPONENT_LIBRARY.md` |
| **Business Domain** | Project context | `AI/docs/BUSINESS_DOMAIN.md` |

### External Resources

- **PayloadCMS Docs**: [payloadcms.com/docs](https://payloadcms.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

### Support Channels

- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Update relevant docs when making changes

---

## Project Roadmap

### Phase 1: Foundation (Completed)
- ✅ Core architecture setup
- ✅ Basic CMS functionality  
- ✅ Gallery system implementation

### Phase 2: Enhancement (Current)
- 🚧 Comprehensive documentation
- 🚧 Testing infrastructure
- 🚧 Performance optimization

### Phase 3: Architecture Evolution (Planned)
- 📋 **Vertical Slice Architecture migration** (see migrationplan.md)
- 📋 **Documentation restructure** to match new architecture
- 📋 Advanced search and filtering
- 📋 User authentication for visitors
- 📋 Analytics and monitoring

### Phase 4: Scale & Deploy (Future)
- 📋 Production deployment
- 📋 Performance monitoring
- 📋 Advanced caching strategies
- 📋 Real-time features

---

**For AI Assistants**: 

### Phase 3 VSA Migration Triggers:
When you see references to Phase 3 starting or `migrationplan.md` being implemented:

**CRITICAL**: All documentation will need major restructuring to match VSA patterns.

### What Changes in Phase 3:
- **Before VSA**: Components organized by type (`/components/galleries/`, `/components/ui/`)
- **After VSA**: Components organized by feature (`/features/gallery-management/`, `/features/video-showcase/`)

### Documentation Update Priority:
1. **COMPONENT_LIBRARY.md** - Complete restructure (feature-based sections)
2. **ARCHITECTURE.md** - Directory structure and data flow updates  
3. **REPO_GUIDE.md** - Navigation and file organization
4. **SETUP.md** - Development workflow and import patterns

### When Phase 3 Starts:
Ask: "I see Phase 3/VSA migration references. Should I prepare documentation updates for the new feature-based structure?"

**Last Updated**: July 7, 2025  
**Project Version**: 2.0  
**AI Friendliness Score**: 8/10 (Improved from 4/10)  
**Documentation Coverage**: 85%