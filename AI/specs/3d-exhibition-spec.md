# 3D Exhibition Viewer Specification

## Overview
Interactive 3D exhibition viewer that displays immersive Sketchfab scans of physical exhibition spaces. This feature allows remote visitors to experience art exhibitions virtually with full 3D navigation and exploration capabilities.

## User Stories
- As an art enthusiast, I want to virtually explore exhibition spaces so that I can experience the artwork placement and spatial context
- As a remote visitor, I want to navigate 3D exhibition scans so that I can view exhibitions I cannot physically attend
- As a gallery visitor, I want to revisit exhibition spaces after they close so that I can reflect on the experience
- As an artist, I want to showcase my exhibition space in 3D so that viewers can understand the spatial relationship of my work

## Functional Requirements

### Must Have
- [ ] Display Sketchfab 3D models in responsive iframe container
- [ ] Support fullscreen viewing with VR/AR capabilities when available
- [ ] Provide consistent layout with site header and footer
- [ ] Include exhibition title with distinctive typography and spacing
- [ ] Offer clear navigation back to related content
- [ ] Ensure responsive design across all device sizes
- [ ] Load 3D content with appropriate fallbacks for slow connections

### Should Have  
- [ ] Loading states and progress indicators for 3D content
- [ ] Error handling for failed Sketchfab embeds
- [ ] Keyboard navigation support for accessibility
- [ ] Option to mute/unmute audio if 3D model includes sound
- [ ] Social sharing capabilities for 3D exhibitions

### Could Have
- [ ] Multiple viewing modes (guided tour, free exploration)
- [ ] Hotspots with additional information overlays
- [ ] Integration with gallery item details
- [ ] Comparison view between multiple exhibition scans
- [ ] Bookmarking of specific viewpoints within 3D space

## Technical Requirements

### Performance
- 3D model must load within 10 seconds on standard broadband
- Interface must remain responsive during 3D content loading
- Support for progressive loading of 3D content quality
- Optimized for mobile devices with touch navigation

### Integration
- **Sketchfab API**: Embed 3D models with full feature support
- **PayloadCMS Collection**: Exhibition3D collection for managing 3D content
- **Next.js Routing**: Dynamic routes for multiple exhibitions (e.g., `/exhibition/[slug]`)
- **Responsive Design**: Tailwind CSS classes for mobile-first approach

### Dependencies
- Sketchfab embed permissions and API access
- Modern browser support for WebGL and 3D rendering
- HTTPS requirement for VR/AR features
- iframe security policies configured

## User Interface

### User Flow
1. User navigates to 3D exhibition page (e.g., `/tankstelle`)
2. Page loads with exhibition title and loading state
3. Sketchfab 3D model loads in responsive container
4. User can interact with 3D model (rotate, zoom, explore)
5. User can enter fullscreen mode for immersive viewing
6. User can navigate back to related exhibition content

### Components Needed
- **Exhibition3DViewer**: Main container component for 3D display
- **SketchfabEmbed**: Wrapper for Sketchfab iframe with responsive sizing
- **Exhibition3DHeader**: Styled title component with custom typography
- **LoadingState**: Loading indicator during 3D content initialization
- **ErrorFallback**: Error display when 3D content fails to load

### Layout Structure
Header (site navigation)
├── Exhibition Title (large, spaced typography)
├── 3D Viewer Container (responsive, aspect ratio maintained)
│   └── Sketchfab Iframe (full interaction capabilities)
├── Navigation Controls (back link, related actions)
└── Footer (site footer)


## Data Requirements

### PayloadCMS Collections

#### Exhibition3D Collection
```typescript
{
  slug: string                    // URL identifier (e.g., "tankstelle")
  title: string                   // Display title
  sketchfabModelId: string       // Sketchfab model identifier
  sketchfabEmbedUrl: string      // Full embed URL
  description?: richText          // Optional exhibition description
  relatedExhibition?: relationship // Link to main exhibition content
  isActive: boolean              // Whether exhibition is publicly viewable
  displayOrder?: number          // Ordering for multiple exhibitions
  metaDescription?: string       // SEO description
}
```

## API Endpoints
- `GET /api/exhibitions-3d` - List all active 3D exhibitions
- `GET /api/exhibitions-3d/[slug]` - Get specific 3D exhibition data

## Acceptance Criteria

### Definition of Done
- [ ] 3D exhibition displays correctly across desktop, tablet, mobile
- [ ] Sketchfab integration works with all supported features (fullscreen, VR)
- [ ] Loading states provide clear feedback to users
- [ ] Error handling gracefully manages failed 3D content
- [ ] Typography matches design specifications (tracking, spacing)
- [ ] Navigation flow integrates with existing site architecture
- [ ] Performance meets specified loading time requirements
- [ ] Accessibility features support keyboard and screen reader navigation

### Testing Requirements
- **Unit Tests**: Component rendering and prop handling
- **Integration Tests**: Sketchfab iframe loading and interaction
- **Visual Tests**: Responsive layout across device sizes
- **Performance Tests**: Loading time measurements
- **Accessibility Tests**: Keyboard navigation and screen reader compatibility
- **User Tests**: Intuitive 3D navigation and overall experience

## Implementation Notes

### Technical Approach
- Use Next.js dynamic routing for scalable multiple exhibitions
- Implement lazy loading for 3D content to improve initial page performance
- Utilize Intersection Observer for loading optimization
- Consider Progressive Web App features for mobile experience

### Current Implementation Analysis
The existing `/tankstelle` route demonstrates:
- ✅ Responsive iframe container with proper aspect ratios
- ✅ Sketchfab embed with full feature permissions
- ✅ Consistent site layout integration
- ✅ Mobile-optimized sizing (300px → 600px height scaling)
- ✅ Proper iframe security attributes

### Enhancement Opportunities
- **Generalization**: Convert from hardcoded to CMS-driven content
- **Multiple Exhibitions**: Support for additional 3D exhibition spaces
- **Enhanced Loading**: Progress indicators and better error states
- **Accessibility**: Improved keyboard navigation and ARIA labels

### Constraints
- **Sketchfab Dependency**: Relies on external service availability
- **Device Capability**: 3D performance varies significantly across devices
- **Bandwidth Sensitivity**: Large 3D models may not work well on slow connections
- **Browser Support**: WebGL and modern browser features required

## Related Documents
- `docs/sketchfab-integration.md` - Technical integration details
- `docs/3d-performance-optimization.md` - Performance best practices
- `specs/exhibition-cms-spec.md` - Related CMS functionality
- `tasks/3d-viewer-migration.md` - Implementation task breakdown

## Future Enhancements
- Support for multiple 3D models per exhibition
- Integration with gallery items for contextual viewing
- Virtual reality mode optimization
- Audio guide integration within 3D space
- Social features (sharing viewpoints, commenting on spaces)