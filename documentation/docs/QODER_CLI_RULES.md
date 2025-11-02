# Qoder CLI Key Rules for Development

## TUI Mode (Default)
- Run `qodercli` from project root to enter interactive mode
- Input modes:
  - `>` Dialog mode (default)
  - `!` Bash mode for shell commands
  - `/` Slash mode for built-in commands
  - `#` Memory mode for AGENTS.md

## Essential Slash Commands
- `/login` - Log in to Qoder account
- `/help` - Show TUI help
- `/init` - Initialize/update AGENTS.md
- `/memory` - Edit AGENTS.md
- `/quest` - Spec-driven delegated task
- `/review` - Code review for local changes
- `/status` - Show CLI status
- `/agents` - Manage subagents
- `/quit` - Exit TUI

## Key Startup Options
- `-w` - Specify workspace directory
- `-c` - Continue last session
- `-r` - Resume specific session
- `--allowed-tools` - Allow only specified tools
- `--disallowed-tools` - Disallow specified tools
- `--yolo` - Skip permission checks

## Print Mode (Non-Interactive)
- `qodercli --print` for non-interactive output
- Use `--output-format` for text/json/stream-json

## Permissions & Configuration
- Configured in `.qoder/settings.json` files (user/project level)
- Three strategies: Allow, Deny, Ask
- Default: 'Ask' policy for file access outside project directory
- Auto creates read/write rules within project on startup

## Worktree Jobs (Parallel Execution)
- `qodercli --worktree "job description"` to create parallel jobs
- `qodercli jobs --worktree` to list jobs
- `qodercli rm <jobId>` to delete jobs

## Memory Management
- Uses `AGENTS.md` as memory file
- Auto-loaded as context for development
- `/init` to generate project-level AGENTS.md
- `#` in TUI to edit memory file

## Subagents
- Specialized agents for specific tasks
- Defined in markdown files with frontmatter
- Located in `~/.qoder/agents/` (user) or `${project}/agents/` (project)