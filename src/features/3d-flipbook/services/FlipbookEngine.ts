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
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  
  private pages: THREE.Mesh[] = [];
  private textures: PageTexture[] = [];
  private currentPage = 0;
  private isAnimating = false;
  
  private options: FlipbookEngineOptions;
  private animationController?: any; // Will implement animation controller
  
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
    this.setupLighting();
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
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }

  private setupRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    this.container.appendChild(this.renderer.domElement);
  }

  private setupLighting(): void {
    // Ambient light for overall illumination
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    // Directional light for realistic shadows and highlights
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    this.directionalLight.position.set(5, 5, 5);
    this.directionalLight.castShadow = true;
    
    // Shadow settings
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.1;
    this.directionalLight.shadow.camera.far = 50;
    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.bottom = -10;
    
    this.scene.add(this.directionalLight);
  }

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
            console.log(`✓ Loaded image ${index + 1}:`, imagePath);
            
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

            resolve(pageTexture);
            
            // Update loading progress
            const progress = (index + 1) / this.options.images.length;
            console.log(`Loading progress: ${Math.round(progress * 100)}%`);
            this.options.onLoadProgress?.(progress);
          },
          (progress) => {
            // Loading progress for individual image
            console.log(`Loading ${imagePath}:`, Math.round((progress.loaded / progress.total) * 100) + '%');
          },
          (error) => {
            console.error(`✗ Failed to load image ${index + 1}:`, imagePath, error);
            reject(error);
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
    // Calculate optimal page size based on textures
    const maxWidth = Math.max(...this.textures.map(t => t.dimensions.width));
    const maxHeight = Math.max(...this.textures.map(t => t.dimensions.height));
    const standardWidth = Math.min(3, maxWidth / 1000); // Scale down for 3D scene

    this.textures.forEach((pageTexture, index) => {
      const width = standardWidth;
      const height = width / pageTexture.aspectRatio;

      // Create geometry with high subdivision for smooth bending
      const geometry = new THREE.PlaneGeometry(width, height, 32, 32);
      
      // Create custom shader material for page bending effects
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: pageTexture.texture },
          uBend: { value: 0.0 },
          uTime: { value: 0.0 },
          uLightPosition: { value: new THREE.Vector3(5, 5, 5) }
        },
        vertexShader: this.getVertexShader(),
        fragmentShader: this.getFragmentShader(),
        transparent: true,
        side: THREE.DoubleSide
      });

      const page = new THREE.Mesh(geometry, material);
      
      // Position pages in a stack
      page.position.z = -index * 0.001; // Slight offset for depth
      page.castShadow = true;
      page.receiveShadow = true;
      
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
        
        // Calculate lighting
        vec3 lightDirection = normalize(uLightPosition - vPosition);
        float lightIntensity = max(dot(normalize(vNormal), lightDirection), 0.3);
        
        // Add shadow effect during page turn
        float shadow = 1.0 - (abs(uBend) * 0.2);
        lightIntensity *= shadow;
        
        // Add subtle paper texture effect
        float paper = 1.0 + sin(vUv.x * 100.0) * sin(vUv.y * 100.0) * 0.02;
        
        gl_FragColor = vec4(textureColor.rgb * lightIntensity * paper, textureColor.a);
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
        
        // Reset bend values
        (currentPageMesh.material as THREE.ShaderMaterial).uniforms.uBend.value = 0;
      }
    });

    // Bend and rotate the current page
    timeline.to((currentPageMesh.material as THREE.ShaderMaterial).uniforms.uBend, {
      value: 1.0,
      duration: 0.3,
      ease: "power2.out"
    });

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
        
        // Reset bend values
        (prevPageMesh.material as THREE.ShaderMaterial).uniforms.uBend.value = 0;
      }
    });

    // Bend and rotate back
    timeline.to((prevPageMesh.material as THREE.ShaderMaterial).uniforms.uBend, {
      value: -1.0,
      duration: 0.3,
      ease: "power2.out"
    });

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
    requestAnimationFrame(this.animate.bind(this));
    
    // Update time uniform for subtle animations
    const time = Date.now() * 0.001;
    this.pages.forEach(page => {
      if (page.material instanceof THREE.ShaderMaterial) {
        page.material.uniforms.uTime.value = time;
      }
    });
    
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    // Clean up resources
    this.pages.forEach(page => {
      if (page.material instanceof THREE.ShaderMaterial) {
        page.material.dispose();
      }
      page.geometry.dispose();
      this.scene.remove(page);
    });
    
    this.textures.forEach(({ texture }) => {
      texture.dispose();
    });
    
    // Dispose renderer and remove DOM element safely
    if (this.renderer) {
      this.renderer.dispose();
      
      // Check if the DOM element exists and is actually a child before removing
      if (this.renderer.domElement && 
          this.container && 
          this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    
    // Remove event listeners using bound functions
    if (this.container) {
      this.container.removeEventListener('mousedown', this.boundMouseDown);
      this.container.removeEventListener('mousemove', this.boundMouseMove);
      this.container.removeEventListener('touchstart', this.boundTouchStart);
      this.container.removeEventListener('touchmove', this.boundTouchMove);
    }
    
    if (this.boundWindowResize) {
      window.removeEventListener('resize', this.boundWindowResize);
    }
  }

  // Getters
  public getCurrentPage(): number { return this.currentPage; }
  public getTotalPages(): number { return this.pages.length; }
  public getIsAnimating(): boolean { return this.isAnimating; }
}