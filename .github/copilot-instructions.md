<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

this is a monorepo with multiple projects. The backend project is in the
`backend/` directory, and the frontend projects are in the
`builder-ui/` and `channel-ui/` directory. The `infrastructure/`
directory contains the IaC definitions written in terraform to host the all of
the projects on AWS infrastructure.

The `scripts/` directory contains various scripts that are used to manage the
projects, including build scripts, deployment scripts, and utility scripts.

The `testing/` directory contains integration tests for the backend and
frontend, as well as end-to-end tests for the entire system.

When writing code, please follow the project's coding standards and best
practices, and that suggestions are relevant to the specific project context. 