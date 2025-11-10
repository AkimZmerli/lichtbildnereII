# Architecture Decisions - Vertical Slice Migration

## Decision Context

The codebase originally followed a horizontal layer architecture with features organized by technical concerns (components, services, types). This led to:

- Business logic scattered across multiple directories
- Difficult feature discovery and maintenance
- Mixed concerns in "shared" directories
- Legacy Payload CMS structure remnants

## Decision: Adopt Vertical Slice Architecture

### What is Vertical Slice Architecture?

Vertical slice architecture organizes code by business capabilities rather than technical layers. Each "slice" contains all the layers it needs:

```
feature/
├── components/     # UI layer
├── services/       # Data layer  
├── hooks/          # Logic layer
└── types/          # Local types
```

## Architecture Decision Records (ADRs)

### ADR-001: Directory Structure

**Decision:** Use `features-new/` for vertical slices with business-focused names.

**Context:** 
- Next.js conflicts with `pages/` directory name
- Need clear business domain boundaries
- Want to preserve existing structure during migration

**Structure:**
```
src/
├── features-new/           # Vertical slices
│   ├── home/              # Homepage functionality
│   ├── gallery/           # Image gallery management
│   ├── exhibition/        # Exhibition-specific features
│   └── social-book/       # Social book with flipbook
├── shared/                # True shared utilities
│   ├── ui/               # Pure UI components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── utils/            # Shared utilities
├── lib/                   # External integrations
└── types/                 # Global type definitions
```

**Consequences:**
- ✅ Clear feature boundaries
- ✅ Self-contained business logic
- ✅ Easier onboarding for new developers
- ⚠️ Requires discipline to prevent feature coupling

### ADR-002: Responsive Component Organization

**Decision:** Keep responsive variants within the same feature slice.

**Context:** 
- Gallery has distinct Desktop/Mobile components
- Different UX patterns but same business purpose
- Alternative: Create separate responsive slices

**Chosen approach:**
```
features-new/gallery/
├── components/
│   ├── DesktopGallery.tsx    # Desktop-specific UX
│   ├── MobileGallery.tsx     # Mobile-specific UX
│   └── GalleryView.tsx       # Orchestrator component
```

**Alternatives considered:**
- Separate `desktop/` and `mobile/` feature slices
- Single responsive component with conditional rendering

**Consequences:**
- ✅ Business logic stays together
- ✅ Easy to coordinate between variants
- ✅ Clear responsive strategy
- ⚠️ Larger feature directories

### ADR-003: CSS and Asset Organization

**Decision:** Preserve complex CSS structures exactly as-is within feature slices.

**Context:**
- Flipbook has 5 CSS files with Safari-specific fallbacks
- Critical browser compatibility code
- Motion blur animations and 3D transforms

**Approach:**
```
features-new/social-book/flipbook/
├── components/
│   ├── flipbook.css           # Base styles
│   ├── flipbook-blur.css      # Motion blur effects
│   ├── flipbook-segments.css  # Advanced effects
│   ├── flipbook-clippath.css  # Clipping paths
│   └── flipbook-blur.css      # Safari fallbacks
```

**Consequences:**
- ✅ Zero functionality loss
- ✅ Safari optimizations preserved
- ✅ Co-located with related components
- ✅ Clear ownership of CSS

### ADR-004: Type Organization

**Decision:** Centralized global types with feature-specific types in slices.

**Context:**
- Some types used across multiple features (GalleryImage)
- Feature-specific types should stay local
- Need to avoid circular dependencies

**Structure:**
```
src/
├── types/
│   ├── gallery.ts     # Shared across features
│   └── api.ts         # API response types
└── features-new/
    └── feature/
        └── types/     # Feature-specific types
```

**Consequences:**
- ✅ Clear type ownership
- ✅ Prevents circular imports
- ✅ Shared types discoverable
- ⚠️ Need discipline about what goes where

### ADR-005: Import Strategy

**Decision:** Use absolute imports with clear prefixes.

**Context:**
- Relative imports become complex with deep nesting
- Need clear distinction between features and shared code
- TypeScript path mapping available

**Strategy:**
```typescript
// Feature imports
import Component from '@/features-new/gallery/components/Component'

// Shared imports  
import Button from '@/shared/ui/Button'

// External integrations
import { getImageUrl } from '@/lib/blob'

// Global types
import { GalleryImage } from '@/types/gallery'
```

**Consequences:**
- ✅ Clear import intentions
- ✅ Easy refactoring
- ✅ IDE auto-completion
- ⚠️ Longer import paths

### ADR-006: Legacy Code Handling

**Decision:** Gradual migration with preserved functionality.

**Context:**
- Working production application
- Complex component dependencies
- Need to maintain build stability

**Approach:**
1. Create new structure alongside old
2. Move features one slice at a time
3. Update imports systematically
4. Remove old structure only after validation

**Consequences:**
- ✅ Zero downtime migration
- ✅ Functionality preserved
- ✅ Rollback possible at any step
- ⚠️ Temporary code duplication

## Design Principles

### 1. Feature Independence
Each vertical slice should be as self-contained as possible:
- Own components, services, hooks
- Local types when not shared
- Clear external dependencies

### 2. Shared Code Minimalism  
Only truly reusable code belongs in `shared/`:
- Pure UI components (no business logic)
- Layout components used across features
- Utility functions used by multiple features
- Context providers for app-wide state

### 3. Business Domain Focus
Features organized by what users do, not technical layers:
- `gallery/` - "I want to view photos"
- `social-book/` - "I want to read the book"  
- `exhibition/` - "I want to learn about exhibitions"
- `home/` - "I want an overview of the site"

### 4. Progressive Enhancement
Preserve advanced functionality like CSS fallbacks:
- Safari-specific optimizations maintained
- Progressive enhancement patterns preserved
- Complex animations kept intact

## Anti-Patterns to Avoid

### ❌ Cross-Feature Imports
```typescript
// BAD: Feature importing from another feature
import GalleryUtil from '@/features-new/gallery/utils/helper'

// GOOD: Use shared utility or duplicate if simple
import { formatDate } from '@/shared/utils/date'
```

### ❌ Shared Business Logic
```typescript
// BAD: Business logic in shared
shared/services/userGalleryPreferences.ts

// GOOD: Business logic in feature
features-new/gallery/services/galleryPreferences.ts
```

### ❌ God Components
```typescript
// BAD: Component handling multiple business concerns
shared/components/GalleryExhibitionSocialManager.tsx

// GOOD: Feature-specific components
features-new/gallery/components/GalleryView.tsx
features-new/exhibition/components/ExhibitionView.tsx
```

## Migration Guidelines

### When Adding New Features
1. Create new vertical slice in `features-new/`
2. Include all necessary layers (components, services, hooks)
3. Use shared utilities for truly reusable code
4. Add types to global `types/` only if cross-feature

### When Modifying Existing Features  
1. Keep changes within the feature boundary
2. Extract to shared only if used by multiple features
3. Prefer feature-specific solutions over premature abstraction

### When Refactoring Shared Code
1. Ensure it's truly used by multiple features
2. Remove business logic from shared utilities
3. Prefer pure functions and UI components

## Future Considerations

### Potential Improvements
1. **Automated boundary enforcement** - ESLint rules preventing cross-feature imports
2. **Feature documentation** - README in each feature directory
3. **Component showcase** - Storybook for shared UI components
4. **Bundle analysis** - Monitor feature size and dependencies

### Scaling Strategies
1. **Feature teams** - Assign team ownership to feature slices
2. **Micro-frontends** - Consider for very large features
3. **Shared component library** - Extract to separate package when mature
4. **API boundaries** - Define clear data contracts between features

## Conclusion

The vertical slice architecture provides:
- ✅ **Clear ownership** - Each feature is self-contained
- ✅ **Better discoverability** - Related code is co-located  
- ✅ **Reduced coupling** - Features don't depend on each other
- ✅ **Easier maintenance** - Changes stay within feature boundaries
- ✅ **Preserved functionality** - All existing features work unchanged

This architecture positions the codebase for sustainable growth while maintaining the complex functionality that makes the application unique.