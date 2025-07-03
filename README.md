# Artist Portfolio - Interactive Exhibition Platform

Modern portfolio showcasing photography and multimedia exhibitions with immersive 3D and video experiences.

## Features
- **Gallery Management**: Human and non-human photography categorization
- **3D Exhibition Viewer**: Immersive Sketchfab integration for exhibition spaces
- **Video Showcase**: Optimized video content via Mux Player
- **Interactive Social Book**: Visitor engagement and feedback system
- **CMS Integration**: PayloadCMS for content management

## Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **CMS**: PayloadCMS 3.33+ with PostgreSQL
- **Styling**: Tailwind CSS 4.1+
- **Media**: Mux Player, Sketchfab integration, Sharp image processing
- **Animation**: Framer Motion

## Quick Start
1. `cp .env.example .env` and configure PostgreSQL connection
2. `pnpm install && pnpm dev`
3. Visit `http://localhost:3000` to view portfolio
4. Access admin at `http://localhost:3000/admin`

## Project Structure
- `/src/app/(frontend)/` - Portfolio website
- `/src/app/(payload)/` - CMS admin interface  
- `/src/collections/` - PayloadCMS data models
- `/public/images/` - Gallery assets

## Special Routes
- `/tankstelle` - 3D exhibition scan viewer
- `/zwoelftausend` - Video showcase
- `/gallery/human` - Human subject photography
- `/gallery/non-human` - Object/landscape photography

## Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm generate:types # Generate PayloadCMS types