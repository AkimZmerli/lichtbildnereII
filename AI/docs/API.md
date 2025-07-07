
# Portfolio Project API Documentation

A comprehensive REST and GraphQL API for the Portfolio Project, built with PayloadCMS. This API manages portfolio content, media assets, and site configuration with automatic schema generation and type-safe operations.

## Quick Start

### Base URLs
- **Development**: `http://localhost:3000`
- **Production**: `https://api.yourportfolio.com`
- **GraphQL Playground**: `{BASE_URL}/api/graphql-playground`

### Authentication
All protected endpoints require a Bearer token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     https://api.yourportfolio.com/api/users
```

## Authentication

### Login
Obtain an access token by authenticating with user credentials:

```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "message": "Auth Passed",
  "user": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "exp": 1705320600
}
```

### Logout & Password Reset
```bash
# Logout
POST /api/users/logout
Authorization: Bearer YOUR_JWT_TOKEN

# Password Reset
POST /api/users/forgot-password
Content-Type: application/json
{
  "email": "user@example.com"
}
```

## Collections

### Users
Manages user accounts and authentication.

**Endpoint**: `/api/users`

**Fields:**
- `email` (string, required, unique) - User email address
- `password` (string, required) - User password (hashed)
- `createdAt` (datetime, auto-generated)
- `updatedAt` (datetime, auto-generated)

### Media
Manages media assets including images, videos, and documents.

**Endpoint**: `/api/media`

**Fields:**
- `alt` (string, optional) - Alternative text for accessibility
- `url` (string, auto-generated) - Public URL of the media file
- `filename` (string, auto-generated) - Original filename
- `mimeType` (string, auto-generated) - File MIME type
- `filesize` (number, auto-generated) - File size in bytes
- `width` (number, auto-generated) - Image width in pixels
- `height` (number, auto-generated) - Image height in pixels

**Example Response:**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e9",
  "alt": "Professional portrait in golden hour lighting",
  "url": "https://cdn.yourportfolio.com/media/portrait-001.jpg",
  "filename": "portrait-001.jpg",
  "mimeType": "image/jpeg",
  "filesize": 2048576,
  "width": 1920,
  "height": 1080
}
```

### HeroImage
Manages hero images displayed on the homepage.

**Endpoint**: `/api/hero-image`

**Fields:**
- `image` (relationship to Media, required) - Reference to media asset
- `isActive` (boolean, default: true) - Whether image is currently displayed
- `displayOrder` (number, optional) - Order for multiple hero images

### GalleryItem
Manages items within photography galleries.

**Endpoint**: `/api/gallery-item`

**Fields:**
- `title` (string, required) - Image title
- `image` (relationship to Media, required) - Reference to media asset
- `category` (select, required) - Options: "human", "non-human", "landscape", "portrait"
- `tags` (array of strings, optional) - Searchable tags
- `featured` (boolean, default: false) - Whether item is featured

**Example Response:**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7eb",
  "title": "Mountain Peak at Sunrise",
  "image": {
    "url": "https://cdn.yourportfolio.com/media/mountain-sunrise.jpg",
    "alt": "Dramatic mountain peak silhouette at sunrise"
  },
  "category": "landscape",
  "tags": ["nature", "sunrise", "mountains"],
  "featured": true
}
```

### Slides
Manages content for homepage slideshows.

**Endpoint**: `/api/slides`

**Fields:**
- `image` (relationship to Media, required) - Reference to media asset
- `caption` (rich text, optional) - Slide caption with formatting
- `linkUrl` (string, optional) - Optional link for the slide
- `displayOrder` (number, required) - Order in slideshow
- `isActive` (boolean, default: true) - Whether slide is displayed

### SiteSettings
Manages global site configuration.

**Endpoint**: `/api/site-settings`

**Fields:**
- `siteTitle` (string, required) - Site title
- `siteDescription` (text, optional) - Site description for SEO
- `logoImage` (relationship to Media, optional) - Site logo
- `contactEmail` (email, optional) - Contact email address
- `socialLinks` (array of objects, optional) - Social media links

### Human
A specialized collection for portrait and human-focused photography.

**Endpoint**: `/api/human`

**Fields:**
- `title` (string, required) - Portfolio piece title
- `description` (rich text, optional) - Detailed description
- `featuredImage` (relationship to Media, required) - Main image
- `additionalImages` (array of relationships to Media, optional) - Additional photos
- `shootDate` (date, optional) - When the photo was taken
- `location` (string, optional) - Shoot location
- `tags` (array of strings, optional) - Searchable tags

## REST API Reference

### Standard Operations

All collections support standard CRUD operations:

#### List All Items
```bash
GET /api/{collection-slug}
```

**Query Parameters:**
- `limit` (number, default: 10, max: 100) - Items per page
- `page` (number, default: 1) - Page number
- `sort` (string) - Sort field and direction (e.g., `-createdAt`, `title`)
- `where` (object) - Filter conditions
- `depth` (number, default: 1, max: 2) - Relationship depth

**Example:**
```bash
GET /api/gallery-item?limit=20&page=1&sort=-createdAt&where[category][equals]=landscape
```

**Response:**
```json
{
  "docs": [
    {
      "id": "64a7b8c9d1e2f3a4b5c6d7eb",
      "title": "Mountain Peak at Sunrise",
      "category": "landscape",
      "image": {
        "url": "https://cdn.yourportfolio.com/media/mountain-sunrise.jpg",
        "alt": "Dramatic mountain peak silhouette at sunrise"
      }
    }
  ],
  "totalDocs": 45,
  "limit": 20,
  "totalPages": 3,
  "page": 1,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

#### Get Single Item
```bash
GET /api/{collection-slug}/{id}
```

#### Create Item
```bash
POST /api/{collection-slug}
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "New Gallery Item",
  "category": "portrait",
  "image": "64a7b8c9d1e2f3a4b5c6d7e9"
}
```

#### Update Item
```bash
PATCH /api/{collection-slug}/{id}
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "Updated Gallery Item Title"
}
```

#### Delete Item
```bash
DELETE /api/{collection-slug}/{id}
Authorization: Bearer YOUR_JWT_TOKEN
```

### File Upload

Upload files to the Media collection:

```bash
POST /api/media
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

# Form data:
# file: (binary file)
# alt: "Alternative text for the image"
```

**Response:**
```json
{
  "message": "Media uploaded successfully",
  "doc": {
    "id": "64a7b8c9d1e2f3a4b5c6d7f2",
    "alt": "Alternative text for the image",
    "url": "https://cdn.yourportfolio.com/media/uploaded-image.jpg",
    "filename": "uploaded-image.jpg",
    "mimeType": "image/jpeg",
    "filesize": 1024768,
    "width": 1600,
    "height": 900
  }
}
```

## GraphQL API Reference

### Endpoint
```
POST /api/graphql
Content-Type: application/json
```

### Authentication
Include the Authorization header for protected operations:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ Users { docs { id email } } }"}' \
  https://api.yourportfolio.com/api/graphql
```

### Example Queries

#### Get Featured Gallery Items
```graphql
query GetFeaturedGalleryItems {
  GalleryItems(where: { featured: { equals: true } }, limit: 10) {
    docs {
      id
      title
      category
      tags
      image {
        url
        alt
        width
        height
      }
      createdAt
    }
    totalDocs
    hasNextPage
  }
}
```

#### Get Hero Images with Media Details
```graphql
query GetActiveHeroImages {
  HeroImages(where: { isActive: { equals: true } }, sort: "displayOrder") {
    docs {
      id
      displayOrder
      image {
        url
        alt
        width
        height
      }
    }
  }
}
```

#### Get Site Settings
```graphql
query GetSiteSettings {
  SiteSettings {
    docs {
      id
      siteTitle
      siteDescription
      contactEmail
      logoImage {
        url
        alt
      }
      socialLinks {
        platform
        url
      }
    }
  }
}
```

#### Search Gallery Items
```graphql
query SearchGalleryItems($searchTerm: String!) {
  GalleryItems(
    where: {
      OR: [
        { title: { contains: $searchTerm } }
        { tags: { contains: $searchTerm } }
      ]
    }
    limit: 20
  ) {
    docs {
      id
      title
      category
      tags
      image {
        url
        alt
      }
    }
    totalDocs
  }
}
```

**Variables:**
```json
{
  "searchTerm": "landscape"
}
```

### Example Mutations

#### Create Gallery Item
```graphql
mutation CreateGalleryItem($data: mutationGalleryItemInput!) {
  createGalleryItem(data: $data) {
    id
    title
    category
    image {
      url
      alt
    }
    createdAt
  }
}
```

**Variables:**
```json
{
  "data": {
    "title": "Sunset Over the Ocean",
    "category": "landscape",
    "image": "64a7b8c9d1e2f3a4b5c6d7e9",
    "tags": ["sunset", "ocean", "landscape"],
    "featured": false
  }
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `413` - Payload Too Large
- `429` - Too Many Requests
- `500` - Internal Server Error

### Error Response Format
```json
{
  "errors": [
    {
      "message": "Validation failed",
      "name": "ValidationError",
      "data": [
        {
          "field": "email",
          "message": "Valid email is required"
        }
      ]
    }
  ]
}
```

### Common Error Scenarios

#### Authentication Errors
```json
{
  "errors": [
    {
      "message": "You must be logged in to perform this action.",
      "name": "Unauthorized"
    }
  ]
}
```

#### Validation Errors
```json
{
  "errors": [
    {
      "message": "The following field is invalid: category",
      "name": "ValidationError",
      "data": [
        {
          "field": "category",
          "message": "Category must be one of: human, non-human, landscape, portrait"
        }
      ]
    }
  ]
}
```

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **File uploads**: 50 uploads per hour

Rate limit headers are included in all responses:
- `X-RateLimit-Limit` - Request limit per hour
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset time in Unix timestamp

## Advanced Features

### Filtering and Querying

#### Complex WHERE Conditions
```bash
# Multiple conditions
GET /api/gallery-item?where[category][equals]=landscape&where[featured][equals]=true

# Date ranges
GET /api/gallery-item?where[createdAt][greater_than]=2024-01-01

# Text search
GET /api/gallery-item?where[title][contains]=mountain

# Array contains
GET /api/gallery-item?where[tags][contains]=nature
```

#### Sorting Options
```bash
# Sort by creation date (newest first)
GET /api/gallery-item?sort=-createdAt

# Sort by title (alphabetical)
GET /api/gallery-item?sort=title

# Multiple sort fields
GET /api/gallery-item?sort=-featured,title
```

### Relationship Depth Control
```bash
# Shallow relationships (default)
GET /api/gallery-item?depth=0

# Include related media details
GET /api/gallery-item?depth=1

# Deep relationships (up to 2 levels)
GET /api/gallery-item?depth=2
```

## Best Practices

### Performance Optimization
1. Use the `depth` parameter wisely to avoid over-fetching related data
2. Implement pagination for large datasets using `limit` and `page`
3. Use GraphQL field selection to fetch only needed data
4. Cache frequently accessed data like site settings
5. Compress images before upload and use appropriate formats

### Security
1. Always validate and sanitize user inputs
2. Use HTTPS in production environments
3. Implement proper CORS policies
4. Rotate JWT tokens regularly
5. Use environment variables for sensitive configuration
6. Implement rate limiting to prevent abuse

### Data Management
1. Regularly backup media assets and database
2. Monitor storage usage and implement cleanup policies
3. Use webhooks for real-time updates when needed
4. Version your API clients to handle breaking changes
5. Implement proper error handling and logging

### API Usage
1. Handle errors gracefully in client applications
2. Implement exponential backoff for failed requests
3. Use appropriate HTTP methods for different operations
4. Include proper Content-Type headers
5. Monitor API usage and performance metrics

## SDK and Tools

### JavaScript/TypeScript
```bash
npm install @payloadcms/payload
```

### GraphQL Tools
- **Apollo Client** - Recommended for React applications
- **Relay** - Facebook's GraphQL client
- **GraphQL Code Generator** - Generate TypeScript types from schema

### Testing Tools
- **Postman Collection** - Available at `/api/postman`
- **GraphQL Playground** - Interactive schema explorer at `/api/graphql-playground`
- **Insomnia** - Alternative REST/GraphQL client

## Support and Resources

### Documentation
- **PayloadCMS Docs**: [https://payloadcms.com/docs](https://payloadcms.com/docs)
- **GraphQL Spec**: [https://spec.graphql.org/](https://spec.graphql.org/)
- **REST API Guidelines**: [https://restfulapi.net/](https://restfulapi.net/)

### Community
- **PayloadCMS Discord**: [https://discord.gg/payloadcms](https://discord.gg/payloadcms)
- **GitHub Discussions**: Create issues and discussions in the project repository

### API Support
For API-specific questions, include:
- Request/response examples
- Error messages with full stack traces
- Expected vs actual behavior
- API version and endpoint used
- Environment details (development/production)

---

**Last Updated**: July 7, 2025  
**API Version**: 2.0  
**PayloadCMS Version**: 3.x