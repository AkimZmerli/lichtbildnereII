# Portfolio Project Architecture

This document provides an overview of the architecture of the portfolio project, which is built on a modern, headless technology stack.

## Core Technologies

-   **Framework**: Next.js 15 (with App Router)
-   **CMS**: PayloadCMS 3.x
-   **Database**: PostgreSQL
-   **UI Framework**: React 19
-   **Styling**: Tailwind CSS 4.x
-   **Language**: TypeScript

## Architectural Pattern

The project follows a **headless architecture**, where the frontend and backend are decoupled.

-   **Frontend**: A Next.js application responsible for rendering the user-facing portfolio website.
-   **Backend**: A PayloadCMS instance that serves as the content management system and provides a headless API.

This separation of concerns allows for independent development and scaling of the frontend and backend.

## Directory Structure

The `src/app` directory is organized into two main route groups, reflecting the headless architecture:

-   **`(frontend)`**: Contains all the code for the Next.js frontend application. This includes pages, components, hooks, and utility functions.
-   **`(payload)`**: Contains the configuration and API routes for the PayloadCMS backend.

### Frontend Architecture

The frontend is built using the Next.js App Router, which enables a file-based routing system. The component-based architecture is organized as follows:

-   **`components/`**: Contains reusable React components.
    -   **`galleries/`**: Components specific to the gallery feature.
    -   **`layout/`**: Components that define the overall page structure (e.g., `Header`, `Footer`).
    -   **`sections/`**: Components that represent different sections of a page (e.g., `Hero`, `About`).
    -   **`ui/`**: General-purpose UI components.
-   **`gallery/`**: The main pages for the human and non-human galleries.
-   **`hooks/`**: Custom React hooks for shared logic.
-   **`lib/`**: Utility functions and libraries.

### Backend Architecture

The backend is powered by PayloadCMS, which is configured in `src/payload.config.ts`. The core of the backend architecture is the set of **collections** that define the data models for the application.

-   **`collections/`**: Each file in this directory defines a PayloadCMS collection (e.g., `Users`, `Media`, `GalleryItem`).
-   **API**: PayloadCMS automatically generates a REST and GraphQL API based on the defined collections. These APIs are exposed through the routes in `src/app/(payload)/api/`.

## Data Flow

1.  **Content Management**: The artist or administrator uses the PayloadCMS admin interface (at `/admin`) to manage content, such as uploading images to the `Media` collection or creating new `GalleryItem`s.
2.  **API Exposure**: The content is exposed through the REST and GraphQL APIs.
3.  **Data Fetching**: The Next.js frontend fetches data from the PayloadCMS APIs at build time (for static site generation) or at request time (for server-side rendering).
4.  **Rendering**: The frontend components render the data fetched from the API, displaying the portfolio to the user.

## Key Integrations

-   **Mux Player**: Used for optimized video streaming in the `/zwoelftausend` showcase.
-   **Sketchfab**: Embedded for the 3D exhibition viewer in the `/tankstelle` showcase.
-   **Sharp**: Used for image processing and optimization.

## Future Architectural Direction

As noted in `REPO_OVERVIEW.md` and `tasks/DECISIONS.md`, the project is moving towards a **vertical slice architecture**. This will involve reorganizing the code by feature (e.g., `gallery-management`, `video-showcase`) rather than by technical concern (e.g., `components`, `hooks`). This change is intended to improve modularity and make the codebase more AI-friendly.
