# Documentation Directory

## Purpose
This directory contains comprehensive project documentation, architectural guides, and reference materials for the artist portfolio project. It serves as the knowledge base for understanding how the system works, technical decisions, and implementation patterns.

---

## Documentation Structure

### Architecture & System Design
- **`architecture-overview.md`** - High-level system architecture and component relationships
- **`vertical-slice-architecture.md`** - Explanation of vertical slice pattern implementation
- **`data-flow.md`** - How data moves between PayloadCMS, frontend, and external services

### Technology Integration
- **`payloadcms-integration.md`** - CMS setup, collections, and content management
- **`nextjs-patterns.md`** - Next.js conventions and routing strategies
- **`sketchfab-integration.md`** - 3D model embedding and configuration
- **`mux-integration.md`** - Video streaming service setup and usage

### Development Guides
- **`setup.md`** - Development environment configuration and requirements
- **`deployment.md`** - Production deployment processes and environments
- **`testing-strategy.md`** - Testing approaches and tools
- **`performance-optimization.md`** - Performance best practices and monitoring

### Business Domain
- **`business-domain.md`** - Core concepts, exhibition context, and domain knowledge
- **`user-journeys.md`** - Key user flows and interaction patterns
- **`content-strategy.md`** - Content organization and presentation approaches

---

## Documentation vs Other Directories

### docs/ - System Knowledge
- **What exists**: Current features, architecture, and technical implementation
- **How it works**: Technical explanations, integration guides, setup instructions
- **Why decisions were made**: Architectural rationale and trade-offs
- **Reference material**: APIs, configurations, troubleshooting guides

### specs/ - Future Requirements
- **What to build**: New features and functionality specifications
- **Acceptance criteria**: How to know when something is complete
- **User requirements**: Who benefits and how

### tasks/ - Work Management
- **What's being done**: Active work items and progress tracking
- **What's been completed**: Historical record of changes
- **Decisions made**: Technical choices during development

### .claude/ - AI Collaboration
- **How AI should behave**: Collaboration guidelines and workflows
- **Project context**: AI-specific instructions and patterns

---

## Documentation Standards

### Writing Guidelines
- **Be specific**: Include code examples, file paths, and concrete details
- **Stay current**: Update docs when implementation changes
- **Include context**: Explain why decisions were made, not just what was done
- **Use examples**: Provide working code snippets and real scenarios

### File Organization
- **Clear naming**: Use descriptive, searchable filenames
- **Logical grouping**: Related topics should reference each other
- **Consistent structure**: Follow template patterns for similar document types
- **Version awareness**: Note when information applies to specific versions

### Code Documentation
```markdown
# Good documentation includes:
- Purpose and scope of the feature
- Integration points with other systems
- Configuration requirements
- Common troubleshooting issues
- Examples of typical usage