# Farm Financial Management System

## Overview

This is a full-stack farm financial management application built with React, Express, TypeScript, and PostgreSQL. The system helps farmers track income, expenses, and inventory with comprehensive reporting capabilities. It features a modern UI using shadcn/ui components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and bundling
- **Form Handling**: React Hook Form with Zod validation

The frontend follows a component-based architecture with clear separation between layout, forms, and page components. The design system is based on Radix UI primitives styled with Tailwind CSS.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Style**: RESTful API design
- **Storage**: Abstract storage interface with in-memory implementation for development

The backend uses a clean architecture with separated concerns:
- Routes handle HTTP requests and responses
- Storage layer abstracts database operations
- Shared schema definitions ensure type safety across client and server

## Key Components

### Database Schema
- **Transactions**: Core financial records with type (income/expense), amount, category, and date
- **Categories**: Predefined income and expense categories with icons
- **Inventory Items**: Farm inventory tracking with quantities and values

### API Endpoints
- `/api/transactions` - CRUD operations for financial transactions
- `/api/categories` - Category management
- `/api/inventory` - Inventory item management
- `/api/reports/summary` - Financial summary reports
- `/api/export/transactions` - CSV export functionality

### Frontend Pages
- **Dashboard**: Overview with metrics, charts, and recent transactions
- **Income**: Income transaction management
- **Expenses**: Expense transaction management
- **Reports**: Financial reporting with charts and export capabilities
- **Inventory**: Farm inventory tracking

## Data Flow

1. **User Interactions**: Forms capture user input with client-side validation
2. **API Requests**: TanStack Query manages server communication with automatic caching
3. **Data Validation**: Zod schemas validate data on both client and server
4. **Database Operations**: Drizzle ORM handles type-safe database interactions
5. **State Updates**: Query invalidation triggers UI updates after mutations

## External Dependencies

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Chart.js**: Data visualization
- **Lucide React**: Icon library

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database toolkit
- **Drizzle Kit**: Database migration management

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development
- Vite dev server for frontend with hot module replacement
- Express server with TypeScript compilation via tsx
- In-memory storage for rapid development iteration

### Production Build
- Frontend built with Vite and served as static files
- Backend bundled with ESBuild for Node.js deployment
- PostgreSQL database with environment-based configuration

### Database Management
- Drizzle migrations for schema management
- Environment variables for database connection
- Shared schema ensures consistency between development and production

The application is designed for easy deployment on platforms like Replit, with configuration supporting both development and production environments.