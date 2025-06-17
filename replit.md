# Místico - Spiritual Crafts E-commerce Platform

## Overview

Místico is a full-stack e-commerce platform specializing in spiritual and artisanal products. The application is built as a modern web application with a React frontend and Express.js backend, designed to provide users with an immersive shopping experience for spiritual crafts including candles, soaps, notebooks, and incense.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for database operations
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API with TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Authentication**: Simple session-based authentication
- **Development Environment**: Replit with hot-reload support

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system using CSS variables
- **shadcn/ui** component library for consistent UI elements
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with clear endpoint structure
- **Middleware-based architecture** for request processing
- **Error handling** with centralized error management
- **Request logging** for API monitoring

### Database Layer
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Database migrations** managed through Drizzle Kit
- **Connection pooling** with Neon Database serverless driver

### Authentication System
- **Session-based authentication** with local storage persistence
- **User registration and login** with email/password
- **Protected routes** for authenticated features
- **Context-based auth state management**

## Data Flow

1. **User Interaction**: Users interact with React components
2. **State Management**: TanStack Query manages server state and caching
3. **API Calls**: Frontend makes HTTP requests to Express.js backend
4. **Request Processing**: Express middleware processes and validates requests
5. **Database Operations**: Drizzle ORM executes type-safe database queries
6. **Response Handling**: Data flows back through the same path with proper error handling

### Database Schema
The application uses a comprehensive e-commerce schema including:
- **Users**: Authentication and profile management
- **Products**: Product catalog with categories and galleries
- **Categories**: Product organization and filtering
- **Cart System**: Shopping cart functionality with items management
- **Orders**: Order processing and history
- **Addresses**: User delivery addresses
- **Reviews & Favorites**: User engagement features

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **Backend Framework**: Express.js with TypeScript support
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with Drizzle Kit for migrations

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

### Development Tools
- **TypeScript**: Static type checking
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

### Utilities and Helpers
- **Zod**: Schema validation
- **React Hook Form**: Form management
- **TanStack Query**: Server state management
- **Date-fns**: Date utility library
- **Class Variance Authority**: Component variant management

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- **Node.js 20** runtime environment
- **PostgreSQL 16** database module
- **Hot reload** with Vite development server
- **Port 5000** for local development

### Production Build
- **Vite build** for optimized frontend assets
- **ESBuild** for server-side bundling
- **Static file serving** for production assets
- **Autoscale deployment** target for scalability

### Environment Configuration
- **DATABASE_URL** for PostgreSQL connection
- **Environment-specific** configurations for development and production
- **Module resolution** with proper path aliases for imports

## Changelog

- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.