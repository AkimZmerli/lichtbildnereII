# Custom Three.js Flipbook Technical Architecture Plan

## Problem Statement

Commercial 3D flipbook libraries (FlipHTML5, Flipsnack, DearFlip, etc.) all suffer from the same fundamental limitation: they use **fixed aspect ratio engines** that stretch content to fit predetermined page dimensions. This causes image distortion and unusual proportions.

Three.js implementations naturally respect actual image dimensions through **texture-mapped PlaneGeometry**, but existing React integrations are limited or have jQuery dependencies that conflict with modern React applications.

**Solution**: Build a custom React + Three.js flipbook that preserves image aspect ratios while delivering premium 3D page-turning effects.

## Current Project Analysis

### Existing Stack
- **Framework**: Next.js 15.3.0 + React 19.1.0 + TypeScript
- **Animation**: Framer Motion 12.7.4 (excellent foundation)
- **Styling**: TailwindCSS 4.1.3
- **Architecture**: Feature-based structure already established
- **CMS**: PayloadCMS for content management

### Required Dependencies
```json
{
  "three": "^0.170.0",
  "@types/three": "^0.170.0",
  "gsap": "^3.12.5",
  "@react-three/fiber": "^8.17.10" // Optional: React-Three integration
}
```

## Technical Architecture

### 1. File Structure
```
src/features/3d-flipbook/
├── components/
│   ├── FlipbookCanvas.tsx       # Main Three.js container
│   ├── FlipbookPage.tsx         # Individual page component
│   ├── FlipbookControls.tsx     # Navigation controls
│   ├── FlipbookLoader.tsx       # Loading state
│   └── FlipbookPreloader.tsx    # Image preloader
├── hooks/
│   ├── useFlipbook.ts           # Main flipbook logic
│   ├── usePageGeometry.ts       # Dynamic geometry creation
│   ├── usePageTurning.ts        # Animation handling
│   ├── useTextureLoader.ts      # Image loading & caching
│   └── useInteractions.ts       # Mouse/touch events
├── services/
│   ├── FlipbookEngine.ts        # Core Three.js engine
│   ├── GeometryManager.ts       # PlaneGeometry calculations
│   ├── TextureManager.ts        # Image loading & optimization
│   ├── AnimationController.ts   # Page turning animations
│   └── InteractionHandler.ts    # User input processing
├── shaders/
│   ├── pageVertex.glsl          # Vertex shader for page bending
│   ├── pageFragment.glsl        # Fragment shader for materials
│   └── shadowVertex.glsl        # Shadow effects
└── types/
    └── flipbook.ts              # TypeScript definitions
```

### 2. Core Classes Architecture

#### GeometryManager - Dynamic Aspect Ratio Preservation
```typescript
class GeometryManager {
  createPageGeometry(texture: THREE.Texture, maxWidth: number): THREE.PlaneGeometry {
    const aspectRatio = texture.image.width / texture.image.height;
    const width = Math.min(maxWidth, texture.image.width / 100); // Scale factor
    const height = width / aspectRatio;
    
    // High subdivision for smooth bending animations
    return new THREE.PlaneGeometry(width, height, 32, 32);
  }

  calculateBookDimensions(textures: THREE.Texture[]): BookDimensions {
    const maxWidth = Math.max(...textures.map(t => t.image.width));
    const maxHeight = Math.max(...textures.map(t => t.image.height));
    
    return {
      standardWidth: maxWidth / 100,
      standardHeight: maxHeight / 100,
      aspectRatio: maxWidth / maxHeight
    };
  }
}
```

#### TextureManager - Optimized Image Loading
```typescript
class TextureManager {
  private textureCache = new Map<string, THREE.Texture>();
  private loader = new THREE.TextureLoader();

  async loadTexture(imagePath: string): Promise<PageTexture> {
    if (this.textureCache.has(imagePath)) {
      return this.textureCache.get(imagePath)!;
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        imagePath,
        (texture) => {
          // Optimize texture settings
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.format = THREE.RGBFormat;
          texture.generateMipmaps = false;

          const pageTexture: PageTexture = {
            texture,
            aspectRatio: texture.image.width / texture.image.height,
            dimensions: { 
              width: texture.image.width, 
              height: texture.image.height 
            }
          };

          this.textureCache.set(imagePath, pageTexture);
          resolve(pageTexture);
        },
        undefined,
        reject
      );
    });
  }

  preloadTextures(imagePaths: string[]): Promise<PageTexture[]> {
    return Promise.all(imagePaths.map(path => this.loadTexture(path)));
  }
}
```

#### AnimationController - Realistic Page Turning
```typescript
class PageTurningController {
  private scene: THREE.Scene;
  private timeline?: gsap.core.Timeline;

  animatePageTurn(
    page: THREE.Mesh, 
    direction: 'next' | 'prev',
    onComplete?: () => void
  ): void {
    this.timeline = gsap.timeline({ onComplete });
    
    const targetRotation = direction === 'next' ? -Math.PI : 0;
    const bendDirection = direction === 'next' ? 1 : -1;

    // Phase 1: Start bending the page
    this.timeline.to(page.material.uniforms.uBend, {
      value: bendDirection * 0.3,
      duration: 0.2,
      ease: "power2.out"
    });

    // Phase 2: Continue bending while rotating
    this.timeline.to(page.material.uniforms.uBend, {
      value: bendDirection * 1.0,
      duration: 0.3,
      ease: "power2.inOut"
    }, "-=0.1");

    this.timeline.to(page.rotation, {
      y: targetRotation * 0.7,
      duration: 0.4,
      ease: "power2.inOut"
    }, "-=0.3");

    // Phase 3: Complete the turn and flatten
    this.timeline.to(page.rotation, {
      y: targetRotation,
      duration: 0.3,
      ease: "power2.inOut"
    });

    this.timeline.to(page.material.uniforms.uBend, {
      value: 0,
      duration: 0.2,
      ease: "power2.inOut"
    }, "-=0.1");
  }
}
```

### 3. Shader System for Realistic Effects

#### Vertex Shader - Page Bending
```glsl
varying vec2 vUv;
varying vec3 vNormal;
uniform float uBend;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Create realistic page bend based on X position
  float bendAmount = uBend * sin(pos.x * 3.14159 * 0.5 + 1.57079);
  pos.z += bendAmount * 0.1;
  
  // Add subtle wave motion for realism
  pos.z += sin(pos.x * 10.0 + uTime) * 0.002 * uBend;
  
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

#### Fragment Shader - Material & Lighting
```glsl
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D uTexture;
uniform float uBend;
uniform vec3 uLightPosition;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  
  // Calculate lighting based on page bend
  vec3 lightDirection = normalize(uLightPosition);
  float lightIntensity = max(dot(vNormal, lightDirection), 0.3);
  
  // Add shadow effect during page turn
  float shadow = 1.0 - (abs(uBend) * 0.3);
  lightIntensity *= shadow;
  
  gl_FragColor = vec4(textureColor.rgb * lightIntensity, textureColor.a);
}
```

### 4. React Component Integration

#### Main Flipbook Component
```typescript
interface Flipbook3DProps {
  images: string[];
  initialPage?: number;
  maxWidth?: number;
  onPageChange?: (page: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const Flipbook3D: React.FC<Flipbook3DProps> = ({
  images,
  initialPage = 0,
  maxWidth = 800,
  onPageChange,
  autoPlay = false,
  autoPlayInterval = 3000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    currentPage, 
    totalPages, 
    nextPage, 
    prevPage,
    goToPage,
    isAnimating,
    loadProgress
  } = useFlipbook({
    images,
    initialPage,
    maxWidth,
    onPageChange
  });

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useInteractions({
    onNextPage: nextPage,
    onPrevPage: prevPage,
    disabled: isAnimating
  });

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
      {isLoading && (
        <FlipbookLoader progress={loadProgress} />
      )}
      
      <canvas 
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      <FlipbookControls 
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={nextPage}
        onPrev={prevPage}
        onGoToPage={goToPage}
        disabled={isAnimating}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      />
    </div>
  );
};
```

#### Custom Hooks

##### useFlipbook Hook
```typescript
interface UseFlipbookOptions {
  images: string[];
  initialPage: number;
  maxWidth: number;
  onPageChange?: (page: number) => void;
}

export const useFlipbook = (options: UseFlipbookOptions) => {
  const [currentPage, setCurrentPage] = useState(options.initialPage);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const engineRef = useRef<FlipbookEngine | null>(null);
  
  useEffect(() => {
    engineRef.current = new FlipbookEngine({
      onPageChange: (page) => {
        setCurrentPage(page);
        options.onPageChange?.(page);
      },
      onAnimationStart: () => setIsAnimating(true),
      onAnimationEnd: () => setIsAnimating(false),
      onLoadProgress: setLoadProgress
    });

    return () => {
      engineRef.current?.dispose();
    };
  }, []);

  const nextPage = useCallback(() => {
    if (!isAnimating && currentPage < options.images.length - 1) {
      engineRef.current?.turnToPage(currentPage + 1);
    }
  }, [currentPage, isAnimating, options.images.length]);

  const prevPage = useCallback(() => {
    if (!isAnimating && currentPage > 0) {
      engineRef.current?.turnToPage(currentPage - 1);
    }
  }, [currentPage, isAnimating]);

  return {
    currentPage,
    totalPages: options.images.length,
    nextPage,
    prevPage,
    goToPage: (page: number) => engineRef.current?.turnToPage(page),
    isAnimating,
    loadProgress
  };
};
```

### 5. Performance Optimization Strategies

#### Memory Management
- **Texture Pooling**: Reuse textures across page instances
- **Geometry Instancing**: Share geometry for pages with identical aspect ratios
- **Automatic Disposal**: Clean up unused resources when pages are far from view
- **Level of Detail (LOD)**: Use lower resolution textures for distant pages

#### Loading Optimization
- **Progressive Loading**: Load visible pages first, then preload adjacent pages
- **Image Optimization**: Automatically resize and compress images
- **Caching Strategy**: Browser cache + in-memory cache for textures
- **Lazy Loading**: Only initialize Three.js scene when component is visible

#### Rendering Performance
- **Frustum Culling**: Only render pages visible to camera
- **Texture Compression**: Use appropriate texture formats (WebP, AVIF)
- **Animation Optimization**: Use requestAnimationFrame and GPU acceleration
- **Scene Optimization**: Minimize draw calls through batching

### 6. Advanced Features

#### Touch Gestures
- **Swipe to Turn**: Natural touch interactions
- **Pinch to Zoom**: Zoom into page details
- **Drag to Peek**: Peek at next/previous page
- **Double Tap**: Auto-fit page to screen

#### Visual Effects
- **Realistic Shadows**: Dynamic shadows based on lighting
- **Paper Texture**: Subtle paper grain overlay
- **Page Curl**: Advanced page corner curling
- **Depth of Field**: Blur background pages for focus

#### Accessibility
- **Keyboard Navigation**: Arrow keys, space, enter
- **Screen Reader Support**: Proper ARIA labels
- **High Contrast Mode**: Accessibility compliance
- **Reduced Motion**: Respect user motion preferences

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Three.js dependencies and basic scene
- [ ] Implement GeometryManager with aspect ratio preservation
- [ ] Create TextureManager with caching system
- [ ] Build basic React component structure

### Phase 2: Core Features (Week 3-4)
- [ ] Implement page turning animations with shaders
- [ ] Add mouse/touch interaction handling
- [ ] Create navigation controls
- [ ] Implement preloading system

### Phase 3: Polish & Optimization (Week 5-6)
- [ ] Performance optimization and memory management
- [ ] Add advanced visual effects (shadows, lighting)
- [ ] Implement accessibility features
- [ ] Cross-browser testing and compatibility

### Phase 4: Integration (Week 7)
- [ ] Integrate with existing portfolio gallery
- [ ] PayloadCMS integration for dynamic content
- [ ] Mobile responsiveness testing
- [ ] Final polish and deployment

## Expected Outcomes

### Technical Benefits
- **Perfect Aspect Ratio Preservation**: No image stretching or distortion
- **Premium Visual Quality**: Realistic 3D page turning effects
- **Optimal Performance**: GPU-accelerated animations, efficient memory usage
- **Modern Architecture**: TypeScript, React 19, clean code structure

### User Experience Benefits
- **Natural Interactions**: Intuitive touch and mouse gestures
- **Smooth Animations**: 60fps page turning with physics-based motion
- **Responsive Design**: Works perfectly on all devices and screen sizes
- **Accessibility Compliant**: Full keyboard navigation and screen reader support

### Business Value
- **Unique Differentiation**: Custom solution that commercial libraries can't match
- **Brand Premium**: Reflects high-quality, attention-to-detail approach
- **Future-Proof**: Built with modern technologies, easy to maintain and extend
- **Performance Advantage**: Faster loading and smoother experience than competitors

## Cost Estimation

### Development Time
- **Senior Three.js Developer**: 6-7 weeks @ $150-200/hour
- **Total Estimated Hours**: 240-280 hours
- **Estimated Cost Range**: $36,000 - $56,000

### Alternative Approach
- **Freelance Specialist**: $25,000 - $35,000 (4-5 weeks)
- **Agency Development**: $45,000 - $70,000 (includes design/testing)
- **Open Source Contribution**: Partner with Three.js community for shared development

This custom solution will deliver a **premium, pixel-perfect 3D flipbook** that preserves image dimensions while providing smooth, realistic page-turning animations - exactly what no commercial solution can currently offer.