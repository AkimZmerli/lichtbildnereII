# Issues Found

## Purpose
Track bugs, problems, and technical debt discovered during development. Include context, reproduction steps, and resolution status.

---

## Active Issues

### 🐛 Claude Code API Error with Empty Markdown Files
**Severity**: Medium  
**Found**: [Current Date]  
**Status**: Identified  
**Description**: Claude Code throws "AI_APICallError: messages.1: all messages must have non-empty content" when trying to read empty .md files  
**Reproduction**:
1. Create empty .md file in project
2. Ask Claude Code to read files in directory
3. Error occurs when it encounters empty file
**Workaround**: Ensure all .md files have content before Claude Code analysis  
**Root Cause**: Claude Code cannot process empty files  
**Resolution**: Add content to placeholder files or exclude empty files from prompts

---

## Resolved Issues

### ✅ [Issues will move here when fixed]

---

## Technical Debt

### 📋 Generic Component Names
**Severity**: Low  
**Found**: During codebase analysis  
**Description**: Components have generic names (Hero.tsx, About.tsx) that don't indicate business purpose  
**Impact**: Makes AI collaboration difficult, unclear component responsibilities  
**Proposed Solution**: Rename components during vertical slice migration  
**Priority**: Address during slice restructuring

### 📋 Missing Component Documentation
**Severity**: Medium  
**Found**: During codebase analysis  
**Description**: No JSDoc comments on components, unclear prop types and usage  
**Impact**: AI cannot understand component purpose and proper usage  
**Proposed Solution**: Add comprehensive JSDoc during slice migration  
**Priority**: High - include in slice migration tasks

### 📋 Mixed Concerns in Components
**Severity**: Medium  
**Found**: During codebase analysis  
**Description**: Some components handle both data fetching and UI rendering  
**Impact**: Unclear boundaries, harder to test and maintain  
**Proposed Solution**: Separate data logic into custom hooks during refactoring  
**Priority**: Medium - address after initial slice structure

---

## Codebase Quality Issues

### 📋 No Test Coverage
**Severity**: High  
**Found**: Project analysis  
**Description**: Zero test files found in entire codebase  
**Impact**: No safety net for refactoring, difficult to ensure reliability  
**Proposed Solution**: Add testing infrastructure during slice setup  
**Priority**: High - critical for safe refactoring

### 📋 Inconsistent File Naming
**Severity**: Low  
**Found**: During structure analysis  
**Description**: Mixed naming conventions (kebab-case folders, PascalCase files)  
**Impact**: Cognitive overhead, inconsistent patterns  
**Proposed Solution**: Establish naming conventions in vertical slice structure  
**Priority**: Medium - address during migration

---

## AI Instructions for This File

### When Finding New Issues
- **ADD** to "Active Issues" section using severity levels (High/Medium/Low)
- Include reproduction steps if it's a bug
- Note workarounds if available
- Add context about when/how the issue was discovered

### When Resolving Issues
- **MOVE** from "Active Issues" to "Resolved Issues"
- **ADD** resolution details and date resolved
- Note if the fix creates any new considerations

### When Identifying Technical Debt
- **ADD** to "Technical Debt" section
- Include impact assessment and proposed solutions
- Set priority level for addressing

### Issue Template
```markdown
### 🐛 [Issue Title]
**Severity**: High/Medium/Low  
**Found**: Date discovered  
**Status**: Identified/In Progress/Resolved  
**Description**: Clear description of the problem  
**Reproduction**: Steps to reproduce (for bugs)  
**Impact**: How this affects development/users  
**Workaround**: Temporary solutions (if any)  
**Proposed Solution**: How to fix properly  
**Priority**: When this should be addressed