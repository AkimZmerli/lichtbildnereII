import * as THREE from 'three';
import { gsap } from 'gsap';

export interface FlipbookEngineOptions {
  container: HTMLElement;
  images: string[];
  onPageChange?: (page: number) => void;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  onLoadProgress?: (progress: number) => void;
}

export interface PageTexture {
  texture: THREE.Texture;
  aspectRatio: number;
  dimensions: { width: number; height: number };
}

export class FlipbookEngine {
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private container: HTMLElement;
  
  private pages: THREE.Mesh[] = [];
  private textures: PageTexture[] = [];
  private currentPage = 0;
  private isAnimating = false;
  
  private options: FlipbookEngineOptions;
  private animationId?: number;
  
  // Lighting
  private ambientLight?: THREE.AmbientLight;
  private directionalLight?: THREE.DirectionalLight;
  
  // Raycaster for interactions
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  
  // Bound event handlers for proper cleanup
  private boundMouseDown: (event: MouseEvent) => void;
  private boundMouseMove: (event: MouseEvent) => void;
  private boundTouchStart: (event: TouchEvent) => void;
  private boundTouchMove: (event: TouchEvent) => void;
  private boundWindowResize: () => void;

  constructor(options: FlipbookEngineOptions) {
    console.log('Initializing FlipbookEngine with options:', options);
    this.options = options;
    this.container = options.container;
    
    // Bind event handlers
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundTouchStart = this.onTouchStart.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
    this.boundWindowResize = this.onWindowResize.bind(this);
    
    this.scene = new THREE.Scene();
    this.setupCamera();
    this.setupRenderer();
    // Removed lighting setup - not needed for MeshBasicMaterial
    this.bindEvents();
    
    this.loadTextures()
      .then(() => {
        console.log('Textures loaded, creating pages...');
        this.createPages();
        this.animate();
      })
      .catch((error) => {
        console.error('Failed to initialize flipbook:', error);
        // Show error state or fallback
      });
  }

  private setupCamera(): void {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000); // Reduced FOV for larger pages
    this.camera.position.set(0, 0, 10); // Optimal distance for viewing
    this.camera.lookAt(0, 0, 0);
  }

  private setupRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false, // Changed to false for opaque rendering
      powerPreference: "high-performance",
      preserveDrawingBuffer: true, // Preserve buffer for accurate colors
      premultipliedAlpha: false // Disable premultiplied alpha
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Disabled shadows - not needed for MeshBasicMaterial
    this.renderer.shadowMap.enabled = false;
    // No tone mapping to maintain original photo colors
    this.renderer.toneMapping = THREE.NoToneMapping;
    // Don't apply any color space conversion
    // @ts-ignore - Disable color management completely
    this.renderer.outputEncoding = THREE.LinearEncoding;
    
    // Set clear color to pure black
    this.renderer.setClearColor(0x000000, 1);
    
    this.container.appendChild(this.renderer.domElement);
  }

  // Removed lighting setup - MeshBasicMaterial doesn't need lights
  // private setupLighting(): void {
  //   Lighting removed to preserve original image colors
  // }

  private async loadTextures(): Promise<void> {
    console.log('Starting to load textures:', this.options.images);
    const loader = new THREE.TextureLoader();
    const loadPromises: Promise<PageTexture>[] = [];

    this.options.images.forEach((imagePath, index) => {
      const promise = new Promise<PageTexture>((resolve, reject) => {
        console.log(`Loading image ${index + 1}/${this.options.images.length}:`, imagePath);
        
        loader.load(
          imagePath,
          (texture) => {
            console.log(`✓ Loaded image ${index + 1}/${this.options.images.length}:`, imagePath);
            
            // Validate texture
            if (!texture.image || texture.image.width === 0 || texture.image.height === 0) {
              console.error(`✗ Invalid texture dimensions for ${imagePath}:`, texture.image);
              reject(new Error(`Invalid image dimensions: ${imagePath}`));
              return;
            }
            
            // Optimize texture settings
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBAFormat; // Use RGBA instead of RGB
            // Set encoding to linear to avoid gamma correction
            // @ts-ignore
            texture.encoding = THREE.LinearEncoding;
            texture.generateMipmaps = false;
            texture.flipY = false; // Prevent texture flipping issues
            texture.needsUpdate = true; // Force update

            const pageTexture: PageTexture = {
              texture,
              aspectRatio: texture.image.width / texture.image.height,
              dimensions: {
                width: texture.image.width,
                height: texture.image.height
              }
            };

            resolve(pageTexture);
            
            // Update loading progress
            const progress = (index + 1) / this.options.images.length;
            console.log(`🔄 Loading progress: ${Math.round(progress * 100)}% (${index + 1}/${this.options.images.length})`);
            this.options.onLoadProgress?.(progress);
          },
          (progress) => {
            // Loading progress for individual image  
            if (progress.total > 0) {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              console.log(`📥 Loading ${imagePath}: ${percent}%`);
            }
          },
          (error) => {
            console.error(`✗ Failed to load image ${index + 1}:`, imagePath);
            console.error('Error details:', error);
            reject(new Error(`Failed to load ${imagePath}: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        );
      });
      
      loadPromises.push(promise);
    });

    try {
      this.textures = await Promise.all(loadPromises);
      console.log('✓ All textures loaded successfully');
    } catch (error) {
      console.error('Failed to load textures:', error);
      throw error;
    }
  }

  private createPages(): void {
    // Calculate optimal page size based on container and textures
    const containerAspect = this.container.clientWidth / this.container.clientHeight;
    const baseWidth = 7; // Much larger base width for pages
    const baseHeight = 9; // Much larger base height for pages
    
    // Create book structure with proper spreads
    // Page 0: Cover (right side only)
    // Page 1-2: First spread (left|right)
    // Page 3-4: Second spread (left|right)
    // etc.

    this.textures.forEach((pageTexture, index) => {
      // Cover page is wider
      const width = index === 0 ? baseWidth * 1.2 : baseWidth;
      const height = baseHeight;

      // Create geometry with high subdivision for smooth bending
      const geometry = new THREE.PlaneGeometry(width, height, 32, 32);
      
      // Use custom unlit shader to bypass color management
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: pageTexture.texture }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying vec2 vUv;
          
          void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            
            // Apply a darkening factor to match HTML rendering
            // This compensates for WebGL's inherent brightening
            float darkenFactor = 0.85; // Adjust this value as needed
            texColor.rgb *= darkenFactor;
            
            gl_FragColor = texColor;
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: true
      });

      const page = new THREE.Mesh(geometry, material);
      
      // Position pages in a stack
      page.position.z = -index * 0.001; // Slight offset for depth
      // Shadows disabled - not needed for MeshBasicMaterial
      page.castShadow = false;
      page.receiveShadow = false;
      
      // Initially hide all pages except the first
      if (index > 0) {
        page.visible = false;
      }

      this.pages.push(page);
      this.scene.add(page);
    });
  }

  private getVertexShader(): string {
    return `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      uniform float uBend;
      uniform float uTime;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Create realistic page bend based on X position
        float bendAmount = uBend * sin(pos.x * 3.14159 * 0.5 + 1.57079);
        pos.z += bendAmount * 0.15;
        
        // Add subtle wave motion for realism during animation
        pos.z += sin(pos.x * 10.0 + uTime) * 0.005 * abs(uBend);
        
        vNormal = normalMatrix * normal;
        vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;
  }

  private getFragmentShader(): string {
    return `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      uniform sampler2D uTexture;
      uniform float uBend;
      uniform vec3 uLightPosition;

      void main() {
        vec4 textureColor = texture2D(uTexture, vUv);
        
        // Simple lighting calculation
        vec3 lightDirection = normalize(uLightPosition - vPosition);
        float lightIntensity = max(dot(normalize(vNormal), lightDirection), 0.5);
        
        // Ensure we don't make it too dark
        lightIntensity = max(lightIntensity, 0.7);
        
        gl_FragColor = vec4(textureColor.rgb * lightIntensity, textureColor.a);
        
        // Debug: show solid color if texture fails
        if (textureColor.a < 0.1) {
          gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Magenta for debugging
        }
      }
    `;
  }

  private bindEvents(): void {
    // Mouse events
    this.container.addEventListener('mousedown', this.boundMouseDown);
    this.container.addEventListener('mousemove', this.boundMouseMove);
    
    // Touch events
    this.container.addEventListener('touchstart', this.boundTouchStart);
    this.container.addEventListener('touchmove', this.boundTouchMove);
    
    // Resize events
    window.addEventListener('resize', this.boundWindowResize);
  }

  private onMouseDown(event: MouseEvent): void {
    if (this.isAnimating) return;

    this.updateMousePosition(event.clientX, event.clientY);
    this.handleInteraction();
  }

  private onMouseMove(event: MouseEvent): void {
    this.updateMousePosition(event.clientX, event.clientY);
  }

  private onTouchStart(event: TouchEvent): void {
    if (this.isAnimating || event.touches.length !== 1) return;

    const touch = event.touches[0];
    this.updateMousePosition(touch.clientX, touch.clientY);
    this.handleInteraction();
  }

  private onTouchMove(event: TouchEvent): void {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    this.updateMousePosition(touch.clientX, touch.clientY);
  }

  private updateMousePosition(clientX: number, clientY: number): void {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  private handleInteraction(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.pages);

    if (intersects.length > 0) {
      // Determine if click is on left or right side of page
      const intersect = intersects[0];
      const uv = intersect.uv;
      
      if (uv && uv.x < 0.5) {
        // Left side - go to previous page
        this.prevPage();
      } else {
        // Right side - go to next page
        this.nextPage();
      }
    }
  }

  public nextPage(): void {
    if (this.isAnimating || this.currentPage >= this.pages.length - 1) return;
    
    this.isAnimating = true;
    this.options.onAnimationStart?.();
    
    const currentPageMesh = this.pages[this.currentPage];
    const nextPageMesh = this.pages[this.currentPage + 1];
    
    // Show next page
    nextPageMesh.visible = true;
    nextPageMesh.position.z = currentPageMesh.position.z - 0.001;
    
    // Animate page turn
    const timeline = gsap.timeline({
      onComplete: () => {
        this.currentPage++;
        this.isAnimating = false;
        this.options.onPageChange?.(this.currentPage);
        this.options.onAnimationEnd?.();
        
        // Hide previous page
        currentPageMesh.visible = false;
        
        // Reset bend values (only for shader materials)
        if (currentPageMesh.material instanceof THREE.ShaderMaterial && currentPageMesh.material.uniforms?.uBend) {
          currentPageMesh.material.uniforms.uBend.value = 0;
        }
      }
    });

    // Simple page change for MeshBasicMaterial (no shader uniforms)
    if (currentPageMesh.material instanceof THREE.ShaderMaterial && currentPageMesh.material.uniforms?.uBend) {
      // Bend and rotate for shader material
      timeline.to(currentPageMesh.material.uniforms.uBend, {
        value: 1.0,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      // Simple rotation for basic material
      // Skip opacity animation since MeshBasicMaterial doesn't have opacity property
    }

    timeline.to(currentPageMesh.rotation, {
      y: -Math.PI,
      duration: 0.6,
      ease: "power2.inOut"
    }, "-=0.2");
  }

  public prevPage(): void {
    if (this.isAnimating || this.currentPage <= 0) return;
    
    this.isAnimating = true;
    this.options.onAnimationStart?.();
    
    const currentPageMesh = this.pages[this.currentPage];
    const prevPageMesh = this.pages[this.currentPage - 1];
    
    // Show previous page
    prevPageMesh.visible = true;
    prevPageMesh.rotation.y = -Math.PI; // Start rotated
    
    // Animate page turn back
    const timeline = gsap.timeline({
      onComplete: () => {
        this.currentPage--;
        this.isAnimating = false;
        this.options.onPageChange?.(this.currentPage);
        this.options.onAnimationEnd?.();
        
        // Hide current page
        currentPageMesh.visible = false;
        
        // Reset bend values (only for shader materials)
        if (prevPageMesh.material instanceof THREE.ShaderMaterial && prevPageMesh.material.uniforms?.uBend) {
          prevPageMesh.material.uniforms.uBend.value = 0;
        }
      }
    });

    // Simple page change for MeshBasicMaterial (no shader uniforms)  
    if (prevPageMesh.material instanceof THREE.ShaderMaterial && prevPageMesh.material.uniforms?.uBend) {
      // Bend and rotate for shader material
      timeline.to(prevPageMesh.material.uniforms.uBend, {
        value: -1.0,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      // Simple rotation for basic material
      // Skip opacity animation since MeshBasicMaterial doesn't have opacity property
    }

    timeline.to(prevPageMesh.rotation, {
      y: 0,
      duration: 0.6,
      ease: "power2.inOut"
    }, "-=0.2");
  }

  public goToPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.pages.length || pageIndex === this.currentPage) return;
    
    // For now, just jump to page (could add multi-page animation later)
    this.pages[this.currentPage].visible = false;
    this.currentPage = pageIndex;
    this.pages[this.currentPage].visible = true;
    this.pages[this.currentPage].rotation.y = 0;
    
    this.options.onPageChange?.(this.currentPage);
  }

  private onWindowResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    // Early exit if disposed
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }
    
    try {
      // Update time uniform for subtle animations (only for shader materials)
      const time = Date.now() * 0.001;
      this.pages.forEach(page => {
        if (page.material instanceof THREE.ShaderMaterial && page.material.uniforms?.uTime) {
          page.material.uniforms.uTime.value = time;
        }
      });
      
      this.renderer.render(this.scene, this.camera);
    } catch (error) {
      console.error('Animation error:', error);
      // Stop animation on error
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  public dispose(): void {
    console.log('🧹 Disposing FlipbookEngine...');
    
    try {
      // Stop animation loop first
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = undefined;
      }

      // Clean up pages and materials
      this.pages.forEach((page, index) => {
        try {
          if (page.material instanceof THREE.ShaderMaterial) {
            // Dispose uniforms
            Object.values(page.material.uniforms).forEach(uniform => {
              if (uniform.value && typeof uniform.value.dispose === 'function') {
                uniform.value.dispose();
              }
            });
          }
          // Dispose material (works for both ShaderMaterial and MeshBasicMaterial)
          const material = page.material;
          if (Array.isArray(material)) {
            material.forEach(mat => mat.dispose());
          } else {
            material.dispose();
          }
          page.geometry.dispose();
          this.scene.remove(page);
        } catch (error) {
          console.warn(`Failed to dispose page ${index}:`, error);
        }
      });
      
      // Clean up textures
      this.textures.forEach(({ texture }, index) => {
        try {
          texture.dispose();
        } catch (error) {
          console.warn(`Failed to dispose texture ${index}:`, error);
        }
      });
      
      // Lights cleanup removed - no lights in use anymore
      
      // Clear arrays
      this.pages = [];
      this.textures = [];
      
      // Dispose renderer and WebGL context
      if (this.renderer) {
        // Force context loss to prevent memory leaks
        const gl = this.renderer.getContext();
        if (gl && gl.getExtension('WEBGL_lose_context')) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
        
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        
        // Remove DOM element safely
        if (this.renderer.domElement && 
            this.container && 
            this.container.contains(this.renderer.domElement)) {
          this.container.removeChild(this.renderer.domElement);
        }
      }
      
      // Remove event listeners
      if (this.container) {
        this.container.removeEventListener('mousedown', this.boundMouseDown);
        this.container.removeEventListener('mousemove', this.boundMouseMove);
        this.container.removeEventListener('touchstart', this.boundTouchStart);
        this.container.removeEventListener('touchmove', this.boundTouchMove);
      }
      
      if (this.boundWindowResize) {
        window.removeEventListener('resize', this.boundWindowResize);
      }
      
      console.log('✅ FlipbookEngine disposed successfully');
    } catch (error) {
      console.error('❌ Error during FlipbookEngine disposal:', error);
    }
  }

  // Getters
  public getCurrentPage(): number { return this.currentPage; }
  public getTotalPages(): number { return this.pages.length; }
  public getIsAnimating(): boolean { return this.isAnimating; }
}