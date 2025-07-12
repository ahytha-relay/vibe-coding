# Channel Template Builder UI

This is a React application for managing channel templates in the Vibes platform. It's built using React, TypeScript, and Material-UI.

## Features

- View existing channel templates
- Create new channel templates
- Edit template properties
- Delete templates

## Getting Started

### Prerequisites

- Node.js (version specified in the project)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

This will start the development server on [http://localhost:5173/builder-ui/](http://localhost:5173/builder-ui/).

### Build

To build the project for production:
```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
builder-ui/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── App.tsx            # Main App component
│   ├── App.css            # App styles
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Related Projects

- `backend/` - The backend API for the Vibes platform
- `channel-ui/` - The channel viewing frontend
- `infrastructure/` - AWS infrastructure definitions
