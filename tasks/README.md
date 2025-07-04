# Tasks Directory

## Purpose
This directory manages all active work, completed changes, decisions, and issues for the project. It serves as the central hub for tracking development progress and providing context to AI collaborators.

---

## File Structure

### Core Task Management
- **`current_work.md`** - Active tasks, priorities, and next actions
- **`change_log.md`** - Historical record of completed work and modifications
- **`decisions.md`** - Technical decisions made during development
- **`issues_found.md`** - Bugs, problems, and technical debt tracking


---

## How to Use This Directory

### For Developers
1. **Start work session** → Read `current_work.md` for priorities
2. **During development** → Update progress in `current_work.md`
3. **Make decisions** → Document in `decisions.md`
4. **Find issues** → Log in `issues_found.md`
5. **Complete work** → Move to `change_log.md`

### For AI Collaboration
1. **Session start** → Read `current_work.md` for context
2. **During work** → Update relevant files with progress
3. **Session end** → Log completed work and decisions made
4. **Problem discovery** → Document in `issues_found.md`

---

## AI Instructions

### File Maintenance Responsibilities

#### current_work.md
- **UPDATE** task progress and status changes
- **CHECK OFF** completed next actions
- **MOVE** completed tasks to change_log.md
- **ADD** new tasks to backlog as discovered

#### change_log.md
- **ADD** completed work entries with details
- **INCLUDE** file changes and impact notes
- **MAINTAIN** chronological order

#### decisions.md
- **DOCUMENT** technical choices with reasoning
- **INCLUDE** rejected alternatives for context
- **NOTE** impact on architecture and workflow

#### issues_found.md
- **LOG** bugs and problems discovered
- **UPDATE** status as issues are resolved
- **MOVE** resolved issues to resolved section

### Update Patterns
```markdown
# When completing a task:
1. Add entry to change_log.md
2. Remove from current_work.md
3. Document any decisions in decisions.md
4. Log any issues in issues_found.md

# When starting new work:
1. Check current_work.md priorities
2. Update status to "In Progress"
3. Reference related specs/ and docs/ files