## Documentation Update Triggers

When VSA migration begins, AI assistants should update these docs:

### High Impact Changes Needed:
- **COMPONENT_LIBRARY.md** - Complete restructure needed
- **ARCHITECTURE.md** - Directory structure sections
- **REPO_GUIDE.md** - Navigation and file organization

### Medium Impact:
- **SETUP.md** - Development workflow updates
- **API.md** - Minimal changes (PayloadCMS structure unchanged)

### Triggers for Documentation Updates:
1. **When** `/src/app/(frontend)/components/` structure changes
2. **When** new `/src/features/` directory is created
3. **When** components are moved between directories
4. **When** import paths change significantly

## VSA-Ready Documentation Structure

### Current Structure to Migrate:
components/
├── galleries/
├── layout/
├── sections/
└── ui/

### Future VSA Structure:
features/
├── gallery-management/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── video-showcase/
├── social-book/
└── shared/
└── ui/

# Vertical Slice Architecture Transition Context

## When to Update Documentation

**IMPORTANT**: If you see any of these changes in the codebase, documentation needs major updates:

### Trigger Signals:
- New `/src/features/` directory appears
- Components moved from `/components/galleries/` to `/features/gallery-management/`
- Import statements change from `@/components/` to `@/features/`
- New feature-based directory structure

### What to Update:
1. **Component Library docs** - Completely restructure around features
2. **Architecture docs** - Update directory explanations
3. **Setup guides** - Update import examples and file paths
4. **Navigation guides** - Update "where to find things"

### How to Handle:
1. **Ask first**: "I notice VSA structure - should I update docs?"
2. **Update systematically**: Don't just patch, restructure properly
3. **Maintain examples**: Ensure all code examples reflect new structure
4. **Update navigation**: Fix all internal links and references

## 🔄 Architecture Evolution Alert

**For AI Assistants**: Before making any changes, check for these signals:

### VSA Migration Indicators:
- [ ] Does `/src/features/` directory exist?
- [ ] Are components organized by feature instead of type?
- [ ] Do import paths use `@/features/` instead of `@/components/`?

**If YES to any above**: Documentation needs major updates. Ask human before proceeding.

### Pre-Update Checklist:
1. **Identify scope**: Which docs need changes?
2. **Plan migration**: Feature-based instead of component-type-based
3. **Update examples**: All code snippets need new paths
4. **Fix navigation**: Update all internal links
5. **Preserve intent**: Keep the quality, change the structure

```
// /ai/scripts/detect-vsa.ts (future)
export function detectVSAStructure(): boolean {
  // Check if VSA structure exists
  const fsExists = (path: string) => {
    try { return require('fs').existsSync(path); } 
    catch { return false; }
  };
  
  return fsExists('./src/features') || 
         fsExists('./src/app/(frontend)/features');
}

export function getDocumentationUpdateNeeds() {
  if (detectVSAStructure()) {
    return {
      priority: 'HIGH',
      docsToUpdate: [
        'COMPONENT_LIBRARY.md',
        'ARCHITECTURE.md', 
        'REPO_GUIDE.md'
      ],
      reason: 'VSA structure detected - documentation structure needs major updates'
    };
  }
  return { priority: 'NONE' };
}
```
### When VSA happens use Simple Command Pattern:
"VSA Migration Complete: 
- Components are now in /src/features/[feature-name]/components/
- Update all docs to reflect feature-based organization
- Maintain current quality and comprehensiveness
- Update all code examples with new import paths
- Restructure component docs around features, not component types"

### Feature Mapping Reference
| Current Location | Future VSA Location | Feature Name |
|------------------|-------------------|--------------|
| `components/galleries/` | `features/gallery-management/` | Gallery Management |
| `components/sections/DisplayMovie.tsx` | `features/video-showcase/` | Video Showcase |
| `components/sections/SocialBook.tsx` | `features/social-book/` | Social Book |
| `components/ui/` | `features/shared/ui/` | Shared UI Components |

### Recommended Update Order
1. **ARCHITECTURE.md** first (provides new mental model)
2. **REPO_GUIDE.md** second (updates navigation)
3. **COMPONENT_LIBRARY.md** third (most complex restructure)
4. **SETUP.md** last (workflow updates)

### Post-Migration Validation
After updating docs, AI should verify:
- [ ] All internal links work
- [ ] All code examples use correct import paths
- [ ] All file references point to actual locations
- [ ] Navigation sections reflect new structure

```
export function getSpecificUpdateNeeds() {
  const updates = [];
  
  if (fsExists('./src/features/gallery-management/')) {
    updates.push('Update COMPONENT_LIBRARY.md gallery section');
  }
  
  if (fsExists('./src/features/video-showcase/')) {
    updates.push('Update DisplayMovie component docs');
  }
  
  // More specific feature detection...
  
  return updates;
}
```
