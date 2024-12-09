# SweeP Analytics

SweeP is a modern analytics platform designed to help SaaS businesses track their data and make informed decisions. This event tracking system provides real-time insights and notifications directly to your Discord, ensuring you never miss a critical event.

## Features

- **Real-time Event Tracking**: Monitor and track events as they happen.
- **Discord Notifications**: Receive instant alerts for critical events directly in your Discord.
- **Event Categories**: Organize and track events using customizable categories.
- **Advanced Analytics**: Gain insights into your data with advanced analytics and reporting.
- **User Management**: Manage users and their quotas efficiently.
- **API Integration**: Easily integrate with your existing systems using our API.

### Key Directories and Files

- **`src/app`**: Contains the main application code, including the dashboard, API routes, and utility functions.
- **`src/components`**: Reusable UI components used throughout the application.
- **`src/db.ts`**: Database configuration and initialization.
- **`src/config.ts`**: Configuration settings for the application.
- **`src/middleware.ts`**: Middleware for handling requests and responses.
- **`prisma/`**: Prisma schema and migrations for database management.
- **`tailwind.config.ts`**: Tailwind CSS configuration.
- **`tsconfig.json`**: TypeScript configuration.
- **`wrangler.toml`**: Configuration for deploying to Cloudflare Workers.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- PostgreSQL
- Redis (optional for caching)

## Usage

### Dashboard

The dashboard provides an overview of your tracked events, categories, and user management. You can access it at http://localhost:3000/dashboard.

### API

You can integrate SweeP with your existing systems using the provided API. Below is an example of how to send an event to the tracking API:

```javascript
await fetch("http://localhost:3000/api/events", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
  body: JSON.stringify({
    category: "example-category",
    fields: {
      field1: "value1",
      field2: "value2",
    },
  }),
})
```
