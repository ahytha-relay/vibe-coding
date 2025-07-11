<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

this is a monorepo with multiple projects. The backend project is in the
`backend/` directory, and the frontend projects are in the
`builder-ui/` and `channel-ui/` directory. The `infrastructure/`
directory contains the IaC definitions written in terraform to host the all of
the projects on AWS infrastructure.

The `channel-ui` project is a React + TypeScript project bootstrapped with Vite.
It uses material-ui for the UI components and has a custom theme. The project is
structured with a focus on modularity and reusability, with components organized
into directories based on their functionality. The project also includes a
custom theme for consistent styling across the application, and it uses TypeScript
for type safety and better developer experience. The project is designed to be
easily extensible, allowing for the addition of new features and components with
minimal effort.

The `scripts/` directory contains various scripts that are used to manage the
projects, including build scripts, deployment scripts, and utility scripts.

The `testing/` directory contains integration tests for the backend and
frontend, as well as end-to-end tests for the entire system.

When writing code, please follow the project's coding standards and best
practices, and that suggestions are relevant to the specific project context. 