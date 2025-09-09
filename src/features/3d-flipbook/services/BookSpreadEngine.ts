import * as THREE from 'three';
import { gsap } from 'gsap';

export interface BookSpreadEngineOptions {
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

interface BookPage {
  mesh: THREE.Mesh;
  isLeftPage: boolean;
  pageNumber: number;
  spreadIndex: number;
}

export class BookSpreadEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  
  private spreads: BookPage[][] = [];
  private textures: PageTexture[] = [];
  private currentSpread = 0;
  private isAnimating = false;
  
  private options: BookSpreadEngineOptions;
  private animationId?: number;
  
  // Page dimensions - increased by 220% for better visibility
  private pageWidth = 13.2; // 6 * 2.2
  private pageHeight = 17.6; // 8 * 2.2
  
  // Lighting
  private ambientLight?: THREE.AmbientLight;
  private directionalLight?: THREE.DirectionalLight;
  
  // Book group
  private bookGroup: THREE.Group;
  
  // Bound event handlers
  private boundWindowResize: () => void;

  constructor(options: BookSpreadEngineOptions) {
    console.log('Initializing BookSpreadEngine with options:', options);
    this.options = options;
    this.container = options.container;
    
    // Bind event handlers
    this.boundWindowResize = this.onWindowResize.bind(this);
    
    this.scene = new THREE.Scene();
    this.bookGroup = new THREE.Group();
    this.scene.add(this.bookGroup);
    
    this.setupCamera();
    this.setupRenderer();
    this.setupLighting();
    this.bindEvents();
    
    this.loadTextures()
      .then(() => {
        console.log('Textures loaded, creating book spreads...');
        this.createBookSpreads();
        this.animate();
      })
      .catch((error) => {
        console.error('Failed to initialize book:', error);
      });
  }

  private setupCamera(): void {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 40); // Moved camera back more to accommodate much larger pages
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
    
    this.container.appendChild(this.renderer.domElement);
  }

  private setupLighting(): void {
    // Ambient light for overall illumination
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    // Directional light for realistic shadows and highlights
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(5, 5, 5);
    this.directionalLight.castShadow = true;
    
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
            console.log(`✓ Loaded image ${index + 1}/${this.options.images.length}:`, imagePath);
            
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBAFormat;
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
            this.options.onLoadProgress?.(progress);
          },
          undefined,
          (error) => {
            console.error(`✗ Failed to load image ${index + 1}:`, imagePath, error);
            reject(error);
          }
        );
      });
      
      loadPromises.push(promise);
    });

    this.textures = await Promise.all(loadPromises);
    console.log('✓ All textures loaded successfully');
  }

  private createBookSpreads(): void {
    // No cover - start directly with spreads (two pages each)
    for (let i = 0; i < this.textures.length; i += 2) {
      const spread: BookPage[] = [];
      const spreadIndex = Math.floor(i / 2);
      
      // Left page
      if (this.textures[i]) {
        const leftGeometry = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight, 32, 32);
        const leftMaterial = new THREE.MeshBasicMaterial({
          map: this.textures[i].texture,
          side: THREE.DoubleSide
        });
        
        const leftPage = new THREE.Mesh(leftGeometry, leftMaterial);
        leftPage.position.x = -this.pageWidth / 2;
        leftPage.castShadow = true;
        leftPage.receiveShadow = true;
        leftPage.visible = spreadIndex === 0; // Show first spread initially
        
        spread.push({
          mesh: leftPage,
          isLeftPage: true,
          pageNumber: i,
          spreadIndex
        });
        
        this.bookGroup.add(leftPage);
      }
      
      // Right page
      if (this.textures[i + 1]) {
        const rightGeometry = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight, 32, 32);
        const rightMaterial = new THREE.MeshBasicMaterial({
          map: this.textures[i + 1].texture,
          side: THREE.DoubleSide
        });
        
        const rightPage = new THREE.Mesh(rightGeometry, rightMaterial);
        rightPage.position.x = this.pageWidth / 2;
        rightPage.castShadow = true;
        rightPage.receiveShadow = true;
        rightPage.visible = spreadIndex === 0; // Show first spread initially
        
        spread.push({
          mesh: rightPage,
          isLeftPage: false,
          pageNumber: i + 1,
          spreadIndex
        });
        
        this.bookGroup.add(rightPage);
      }
      
      if (spread.length > 0) {
        this.spreads.push(spread);
      }
    }
    
    console.log(`Created ${this.spreads.length} spreads`);
  }

  public nextPage(): void {
    if (this.isAnimating || this.currentSpread >= this.spreads.length - 1) return;
    
    this.isAnimating = true;
    this.options.onAnimationStart?.();
    
    const currentSpreadPages = this.spreads[this.currentSpread];
    const nextSpreadPages = this.spreads[this.currentSpread + 1];
    
    // Show next spread pages
    nextSpreadPages.forEach(page => {
      page.mesh.visible = true;
      page.mesh.position.z = -0.01; // Slightly behind current pages
    });
    
    // Animate page turn
    const timeline = gsap.timeline({
      onComplete: () => {
        this.currentSpread++;
        this.isAnimating = false;
        this.options.onPageChange?.(this.currentSpread);
        this.options.onAnimationEnd?.();
        
        // Hide previous spread
        currentSpreadPages.forEach(page => {
          page.mesh.visible = false;
        });
      }
    });
    
    // Flip animation for current pages
    currentSpreadPages.forEach(page => {
      if (!page.isLeftPage || currentSpreadPages.length === 1) {
        // Right page or cover flips
        timeline.to(page.mesh.rotation, {
          y: -Math.PI,
          duration: 0.8,
          ease: "power2.inOut"
        }, 0);
        
        timeline.to(page.mesh.position, {
          x: page.isLeftPage ? 0 : -this.pageWidth / 2,
          z: 0.5,
          duration: 0.4,
          ease: "power2.out"
        }, 0);
        
        timeline.to(page.mesh.position, {
          x: -this.pageWidth / 2,
          z: -0.02,
          duration: 0.4,
          ease: "power2.in"
        }, 0.4);
      }
    });
  }

  public prevPage(): void {
    if (this.isAnimating || this.currentSpread <= 0) return;
    
    this.isAnimating = true;
    this.options.onAnimationStart?.();
    
    const currentSpreadPages = this.spreads[this.currentSpread];
    const prevSpreadPages = this.spreads[this.currentSpread - 1];
    
    // Show previous spread pages
    prevSpreadPages.forEach(page => {
      page.mesh.visible = true;
      if (!page.isLeftPage || prevSpreadPages.length === 1) {
        page.mesh.rotation.y = -Math.PI;
        page.mesh.position.x = -this.pageWidth / 2;
      }
    });
    
    // Animate page turn back
    const timeline = gsap.timeline({
      onComplete: () => {
        this.currentSpread--;
        this.isAnimating = false;
        this.options.onPageChange?.(this.currentSpread);
        this.options.onAnimationEnd?.();
        
        // Hide current spread
        currentSpreadPages.forEach(page => {
          page.mesh.visible = false;
        });
      }
    });
    
    // Flip animation for previous pages coming back
    prevSpreadPages.forEach(page => {
      if (!page.isLeftPage || prevSpreadPages.length === 1) {
        const targetX = prevSpreadPages.length === 1 ? this.pageWidth * 1.1 / 2 : this.pageWidth / 2;
        
        timeline.to(page.mesh.position, {
          x: 0,
          z: 0.5,
          duration: 0.4,
          ease: "power2.out"
        }, 0);
        
        timeline.to(page.mesh.position, {
          x: targetX,
          z: 0,
          duration: 0.4,
          ease: "power2.in"
        }, 0.4);
        
        timeline.to(page.mesh.rotation, {
          y: 0,
          duration: 0.8,
          ease: "power2.inOut"
        }, 0);
      }
    });
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.boundWindowResize);
    
    // Add click handlers to the renderer
    this.renderer.domElement.addEventListener('click', (event) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      
      if (x < 0) {
        this.prevPage();
      } else {
        this.nextPage();
      }
    });
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
    
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }
    
    try {
      this.renderer.render(this.scene, this.camera);
    } catch (error) {
      console.error('Animation error:', error);
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  public dispose(): void {
    console.log('🧹 Disposing BookSpreadEngine...');
    
    try {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = undefined;
      }

      // Clean up pages
      this.spreads.forEach(spread => {
        spread.forEach(page => {
          page.mesh.material.dispose();
          page.mesh.geometry.dispose();
          this.bookGroup.remove(page.mesh);
        });
      });
      
      // Clean up textures
      this.textures.forEach(({ texture }) => {
        texture.dispose();
      });
      
      // Clean up lights
      if (this.ambientLight) {
        this.scene.remove(this.ambientLight);
      }
      
      if (this.directionalLight) {
        this.scene.remove(this.directionalLight);
      }
      
      // Clear arrays
      this.spreads = [];
      this.textures = [];
      
      // Dispose renderer
      if (this.renderer) {
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        
        if (this.renderer.domElement && this.container && this.container.contains(this.renderer.domElement)) {
          this.container.removeChild(this.renderer.domElement);
        }
      }
      
      // Remove event listeners
      window.removeEventListener('resize', this.boundWindowResize);
      
      console.log('✅ BookSpreadEngine disposed successfully');
    } catch (error) {
      console.error('❌ Error during BookSpreadEngine disposal:', error);
    }
  }

  // Getters
  public getCurrentSpread(): number { return this.currentSpread; }
  public getTotalSpreads(): number { return this.spreads.length; }
  public getIsAnimating(): boolean { return this.isAnimating; }
}