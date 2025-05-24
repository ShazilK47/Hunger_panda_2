# Hunger Panda - Online Food Order & Delivery System

## Project Documentation

**Author:** Shazil Khan
**Date:** May 24, 2025  
**Version:** 1.0.0

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Requirements](#project-requirements)
3. [System Architecture](#system-architecture)
4. [Database Design](#database-design)
5. [Features & Functionality](#features--functionality)
6. [Technology Stack](#technology-stack)
7. [Implementation Details](#implementation-details)
8. [User Interface](#user-interface)
9. [Security Implementation](#security-implementation)
10. [Testing & Quality Assurance](#testing--quality-assurance)
11. [Deployment](#deployment)
12. [Future Enhancements](#future-enhancements)
13. [Conclusion](#conclusion)
14. [Appendices](#appendices)

<div style="page-break-after: always;"></div>

## Executive Summary

Hunger Panda is a modern, user-friendly online food ordering and delivery system designed for students and professionals who need a convenient way to order food from local restaurants. Built using cutting-edge technologies like Next.js 15+, TypeScript, and Prisma ORM with a MySQL database, the platform offers an intuitive interface for customers to browse restaurants, view menus, place orders, and track deliveries.

The application implements a comprehensive role-based access control system, distinguishing between regular users (customers) and administrators. Customers can browse restaurants, place orders, and view their order history, while administrators have additional capabilities for managing restaurants, menu items, and overseeing all orders in the system.

This document provides a complete technical and functional overview of the Hunger Panda platform, serving as both a project report and a reference guide for future development.

<div style="page-break-after: always;"></div>

## Project Requirements

### Functional Requirements

#### User Authentication & Management

- User registration with email and password
- User login with secure authentication
- Role-based access (customer and administrator)
- User profile management
- Password reset functionality

#### Restaurant Management (Admin)

- Add, edit, and delete restaurant records
- View all restaurants in the system
- Add restaurant details (name, description, address, phone, cuisine type)
- Upload or assign restaurant images

#### Menu Management (Admin)

- Add, edit, and delete menu items for restaurants
- Assign menu items to categories
- Set prices, descriptions, and images for menu items

#### Customer Features

- Browse all available restaurants
- View restaurant details and menus
- Add items to shopping cart
- Place orders with delivery information
- Track order status
- View order history
- Search and filter restaurants by cuisine or name

#### Order Processing

- Create new orders from cart items
- Assign orders to restaurants
- Track order status through the fulfillment process
- View order history and details

### Non-functional Requirements

#### Performance

- Fast page loads (<2 seconds)
- Responsive design for all device sizes
- Efficient database queries

#### Security

- Secure user authentication
- Password encryption
- Protected API routes
- Role-based access control

#### Usability

- Intuitive, modern UI design
- Accessible interface following WCAG guidelines
- Minimal learning curve for new users
- Mobile-friendly interface

#### Scalability

- Architecture supports growing number of users and restaurants
- Database design allows for scaling

<div style="page-break-after: always;"></div>

## System Architecture

Hunger Panda follows a modern web application architecture that leverages the Next.js App Router pattern, server-side rendering, and a clean separation of concerns:

### Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    Client Browser/Device                    │
└──────────────────────────────┬─────────────────────────────┘
                               │
┌──────────────────────────────┼─────────────────────────────┐
│                         Next.js App                         │
│  ┌──────────────┐  ┌─────────┴────────┐  ┌──────────────┐  │
│  │   UI Layer   │  │    App Router    │  │   API Layer  │  │
│  │ (Components) │◄─┤     (Routes)     │─►│   (Routes)   │  │
│  └──────┬───────┘  └──────────────────┘  └───────┬──────┘  │
│         │                                        │         │
│  ┌──────┴────────────────────────────────────────┴──────┐  │
│  │                 Server Actions & Hooks                │  │
│  └──────┬────────────────────────────────────────┬──────┘  │
│         │                                        │         │
│  ┌──────┴───────┐                        ┌───────┴──────┐  │
│  │   NextAuth   │                        │  Prisma ORM  │  │
│  └──────┬───────┘                        └───────┬──────┘  │
└─────────┼────────────────────────────────────────┼─────────┘
          │                                        │
┌─────────┴────────────────────────────────────────┴─────────┐
│                        MySQL Database                       │
└────────────────────────────────────────────────────────────┘
```

### Key Components

1. **UI Layer**: React components organized by feature and function
2. **App Router**: Next.js 15+ App Router for page and layout organization
3. **API Layer**: RESTful API endpoints for data operations
4. **Server Actions**: Modern Next.js server actions for handling business logic
5. **Authentication**: NextAuth.js for secure user authentication and session management
6. **Data Access Layer**: Prisma ORM for type-safe database access
7. **Database**: MySQL database with a normalized schema

### Request Flow

1. User interacts with the UI components
2. App Router handles navigation and page rendering
3. Server Actions or API endpoints process data operations
4. Prisma ORM handles database interactions
5. Results are returned to the UI components
6. UI updates to reflect the new state

<div style="page-break-after: always;"></div>

## Database Design

Hunger Panda uses a relational database (MySQL) with the following entity-relationship model:

### Entity Relationship Diagram

```
┌───────────┐     ┌─────────────┐     ┌───────────┐
│   User    │     │    Order    │     │ MenuItem  │
├───────────┤     ├─────────────┤     ├───────────┤
│ id (PK)   │     │ id (PK)     │     │ id (PK)   │
│ name      │     │ userId (FK) │     │ name      │
│ email     │◄────┤ status      │     │ price     │
│ password  │     │ totalAmount │     │ imageUrl  │
│ isAdmin   │     │ address     │     │ category  │
│ phone     │     │ payment     │     │ restId(FK)│
│ address   │     │ createdAt   │     └────┬──────┘
│ createdAt │     │ updatedAt   │          │
└───────────┘     └──────┬──────┘          │
                          │                 │
                          │                 │
                  ┌───────┴──────┐          │
                  │  OrderItem   │          │
                  ├──────────────┤          │
                  │ id (PK)      │          │
                  │ orderId (FK) ├──────────┘
                  │ menuItemId (FK)
                  │ quantity     │
                  │ price        │
                  └──────┬───────┘
                         │
                         │
                  ┌──────┴───────┐
                  │  Restaurant  │
                  ├──────────────┤
                  │ id (PK)      │
                  │ name         │
                  │ description  │
                  │ imageUrl     │
                  │ address      │
                  │ phone        │
                  │ cuisine      │
                  │ createdAt    │
                  │ updatedAt    │
                  └──────────────┘
```

### Database Tables and Relationships

1. **users**

   - Primary entity for authentication and user information
   - One-to-many relationship with orders

2. **restaurants**

   - Stores restaurant information
   - One-to-many relationship with menu_items

3. **menu_items**

   - Contains food items available for ordering
   - Many-to-one relationship with restaurants
   - One-to-many relationship with order_items

4. **orders**

   - Tracks customer orders
   - Many-to-one relationship with users
   - One-to-many relationship with order_items

5. **order_items**
   - Junction table that connects orders with menu items
   - Contains quantity and price information
   - Many-to-one relationships with both orders and menu_items

### Data Types and Constraints

- Primary keys use UUID strings for improved security and distribution
- Text fields use appropriate length constraints
- Price fields use Decimal(10,2) for accurate currency representation
- Foreign key constraints ensure referential integrity
- Created/updated timestamps track record history
- Indices on frequently queried fields for performance

<div style="page-break-after: always;"></div>

## Features & Functionality

### User-facing Features

#### Authentication

- User registration with email verification
- Secure login with email and password
- Password reset functionality
- Persistent sessions using JWT tokens

#### Restaurant Discovery

- Browse all restaurants
- Search restaurants by name or cuisine
- View restaurant details (description, address, phone)
- See restaurant ratings and reviews

#### Menu Browsing

- View complete restaurant menus
- Filter menu items by category
- View detailed item information
- See item images and descriptions

#### Shopping Cart

- Add items to cart
- Modify quantities
- Remove items
- Cart persistence across sessions
- Restaurant consistency validation

#### Order Placement

- Checkout process with address confirmation
- Payment method selection
- Order summary review
- Order confirmation and receipt

#### Order Tracking

- Real-time order status updates
- Order history view
- Order details and receipt access
- Re-order functionality

#### User Profile

- View and edit personal information
- Update delivery address
- Change password
- View order history

### Admin-facing Features

#### Dashboard

- Overview of system activity
- Key metrics (orders, users, revenue)
- Recent order monitoring

#### Restaurant Management

- Create, edit, delete restaurants
- Manage restaurant details and images
- View restaurant performance metrics

#### Menu Management

- Add, edit, delete menu items
- Organize items by category
- Set item prices and descriptions
- Add item images

#### Order Management

- View all system orders
- Filter orders by status or date
- Update order status
- View order details

#### User Management

- View registered users
- Search users by email or name
- Reset user passwords if needed
- Toggle admin privileges

<div style="page-break-after: always;"></div>

## Technology Stack

### Frontend

- **Framework**: Next.js 15+ (with App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: React 19.0
- **Styling**: Tailwind CSS 4.1
- **Component Libraries**:
  - Headless UI for accessible components
  - Radix UI for complex interactions
  - Lucide React for icons
- **State Management**: React Context API
- **Form Validation**: Zod

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes and Server Actions
- **Authentication**: NextAuth.js with JWT strategy
- **Database ORM**: Prisma 6.8
- **Password Security**: Bcrypt

### Database

- **DBMS**: MySQL
- **Connection**: Prisma Client
- **Migrations**: Prisma Migrations

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js with Turbopack

### Deployment

- **Hosting**: [Platform details]
- **Environment**: Node.js production server
- **Database Hosting**: [Provider details]

<div style="page-break-after: always;"></div>

## Implementation Details

### Authentication Flow

The authentication system uses NextAuth.js with a Credentials Provider to:

1. Verify user credentials against the database
2. Create a secure JWT session token
3. Handle session persistence and expiration
4. Protect routes based on authentication status
5. Enforce role-based access control (user vs. admin)

```typescript
// Authentication flow pseudocode
async function authenticate(email, password) {
  // 1. Find user by email
  const user = await findUserByEmail(email);

  // 2. Verify password hash
  const isValid = await bcrypt.compare(password, user.password);

  // 3. Generate session token if valid
  if (isValid) {
    return createSession(user);
  }

  // 4. Return error if invalid
  return null;
}
```

### Database Access Layer

The application uses Prisma ORM for all database operations, providing:

1. Type-safe database queries
2. Automatic query optimization
3. Relationship handling
4. Transaction support
5. Migration management

```typescript
// Example of Prisma query pattern
async function getRestaurantWithMenuItems(id) {
  return prisma.restaurant.findUnique({
    where: { id },
    include: { menuItems: true },
  });
}
```

### State Management

The application uses React Context API for managing:

1. Authentication state
2. Shopping cart data
3. UI theme preferences
4. Form state

### API Structure

The application uses a combination of Next.js API Routes and Server Actions:

1. API routes for standard CRUD operations
2. Server Actions for form submissions and complex operations
3. Protected routes for authenticated operations

```typescript
// Server Action example
export async function addToCart(menuItemId, quantity) {
  // 1. Validate user session
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  // 2. Get menu item details
  const menuItem = await getMenuItem(menuItemId);

  // 3. Add to cart in database or local state
  return addItemToUserCart(session.user.id, menuItem, quantity);
}
```

<div style="page-break-after: always;"></div>

## User Interface

### Design Principles

- Clean, modern aesthetic
- Mobile-first responsive design
- Accessible to all users (WCAG compliance)
- Consistent color scheme and typography
- Intuitive navigation and information hierarchy

### Key UI Components

#### Public Pages

- Home page with hero section, popular restaurants, and promotional content
- Restaurant browsing page with search and filters
- Restaurant detail page with menu categories and items
- User registration and login forms
- Shopping cart page with order summary
- Checkout process with multi-step form

#### User Dashboard

- Order history with filters and search
- Profile management interface
- Saved addresses and payment methods

#### Admin Interface

- Dashboard with key metrics and recent activity
- Restaurant management interface
- Menu builder for restaurant items
- Order tracking and management
- User management console

### Responsive Design

The interface is designed to work seamlessly across devices:

- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

### Accessibility Features

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Sufficient color contrast
- Screen reader compatibility
- Focus management for forms

<div style="page-break-after: always;"></div>

## Security Implementation

### Authentication Security

- Password hashing using bcrypt with appropriate work factor
- JWT token management with secure HTTP-only cookies
- CSRF protection on all forms
- Rate limiting for login attempts
- Session expiration and renewal

### Data Security

- Input validation on all form submissions
- Parameterized SQL queries via Prisma ORM
- XSS protection through React's automatic escaping
- Content Security Policy headers
- Data validation using Zod schemas

### Authorization Controls

- Role-based access control for admin features
- Route protection for authenticated resources
- API endpoint protection
- Resource ownership validation

### API Security

- Authentication middleware for protected endpoints
- Request validation and sanitization
- Error handling that doesn't leak sensitive information
- Rate limiting for public endpoints

### Security Headers

- HTTPS enforcement
- Strict Transport Security
- X-Content-Type-Options
- X-Frame-Options
- Referrer Policy

<div style="page-break-after: always;"></div>

## Testing & Quality Assurance

### Testing Strategy

- Unit tests for core business logic
- Integration tests for API endpoints
- UI component tests for interactive elements
- End-to-end tests for critical user flows

### Test Coverage

- Authentication flows
- Restaurant and menu management
- Shopping cart operations
- Order processing
- Admin operations

### Testing Tools

- Jest for unit and integration tests
- React Testing Library for component tests
- Cypress for end-to-end tests
- Prisma mocking for database tests

### Quality Assurance Process

1. Static code analysis with TypeScript and ESLint
2. Pre-commit hooks for code formatting and linting
3. Pull request reviews for code quality
4. Automated test runs in CI pipeline
5. Manual testing for UX flows

### Performance Testing

- Lighthouse scores for core pages
- API response time benchmarking
- Database query optimization
- Bundle size monitoring

<div style="page-break-after: always;"></div>

## Deployment

### Deployment Architecture

- Next.js application deployed as a Node.js service
- MySQL database with connection pooling
- Static assets served via CDN
- Environment-specific configuration

### Environment Setup

- Development environment for active development
- Staging environment for testing
- Production environment for live users

### CI/CD Pipeline

1. Code commit triggers automated tests
2. Successful tests lead to staging deployment
3. Staging verification leads to production deployment
4. Monitoring for post-deployment issues

### Deployment Process

```
┌──────────┐     ┌──────────┐     ┌─────────────┐     ┌──────────────┐
│  Commit  │──►  │   Tests  │──►  │  Build App  │──►  │  Deploy to   │
│  to Git  │     │   Run    │     │             │     │  Production   │
└──────────┘     └──────────┘     └─────────────┘     └──────────────┘
```

### Monitoring & Maintenance

- Application performance monitoring
- Error tracking and logging
- Database performance monitoring
- Scheduled backups
- Regular security updates

<div style="page-break-after: always;"></div>

## Future Enhancements

### Planned Features

#### Short-term Enhancements (3-6 months)

- Payment gateway integration (Stripe, PayPal)
- Restaurant rating and review system
- Enhanced search with filters (price range, rating)
- Restaurant owner accounts for self-service
- Push notifications for order updates

#### Medium-term Enhancements (6-12 months)

- Mobile applications (iOS and Android)
- Delivery tracking with map integration
- Loyalty program and rewards
- Social sharing and referrals
- Advanced analytics for restaurants

#### Long-term Vision (12+ months)

- AI-powered recommendations
- Subscription models for regular orders
- Integration with delivery services
- Multi-language support
- Advanced management tools for restaurant chains

### Technical Roadmap

- Migration to serverless architecture
- Performance optimizations for global scale
- Enhanced analytics and reporting
- Machine learning for order predictions
- API ecosystem for third-party integration

<div style="page-break-after: always;"></div>

## Conclusion

The Hunger Panda online food ordering platform successfully demonstrates a modern, scalable web application built using Next.js, TypeScript, and Prisma with MySQL. The application provides a comprehensive solution for restaurants to showcase their menus and for customers to discover, order, and enjoy food delivery.

Key achievements of this project include:

- Complete implementation of user and admin functionalities
- Secure authentication and authorization system
- Robust database design with proper relationships
- Clean, modern UI with responsive design
- Strong foundation for future enhancements

The project meets all stated requirements and provides a solid foundation for future development. The modular architecture ensures that new features can be added with minimal disruption to existing functionality.

As a university Database Management Systems project, Hunger Panda demonstrates practical application of database design principles, API development, modern frontend techniques, and secure authentication practices, all within a cohesive, real-world application.

<div style="page-break-after: always;"></div>

## Appendices

### Appendix A: Database Schema

Complete Prisma schema for the application:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id               String    @id @default(uuid())
  name             String
  email            String    @unique
  password         String
  isAdmin          Boolean   @default(false)
  phone            String?
  address          String?
  resetToken       String?
  resetTokenExpiry DateTime?
  orders           Order[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@map("users")
}

model Restaurant {
  id          String     @id @default(uuid())
  name        String     @db.VarChar(255)
  description String?    @db.Text
  imageUrl    String?    @db.Text
  address     String     @db.Text
  phone       String?    @db.VarChar(20)
  cuisine     String?    @db.VarChar(100)
  menuItems   MenuItem[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([name])
  @@map("restaurants")
}

model MenuItem {
  id           String      @id @default(uuid())
  name         String
  description  String?     @db.Text
  price        Decimal     @db.Decimal(10, 2)
  imageUrl     String?     @db.Text
  category     String
  restaurantId String
  restaurant   Restaurant  @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  orderItems   OrderItem[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@index([restaurantId])
  @@map("menu_items")
}

model Order {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           OrderItem[]
  status          OrderStatus @default(PENDING)
  totalAmount     Decimal     @db.Decimal(10, 2)
  deliveryAddress String
  paymentMethod   String
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@map("orders")
}

model OrderItem {
  id         String   @id @default(uuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  quantity   Int
  price      Decimal  @db.Decimal(10, 2)

  @@index([orderId])
  @@index([menuItemId])
  @@map("order_items")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  DELIVERED
  CANCELLED
}
```

### Appendix B: API Endpoints

| Endpoint                | Method | Description              | Auth Required | Role  |
| ----------------------- | ------ | ------------------------ | ------------- | ----- |
| `/api/auth/register`    | POST   | Register new user        | No            | -     |
| `/api/auth/login`       | POST   | User login               | No            | -     |
| `/api/auth/logout`      | POST   | User logout              | Yes           | User  |
| `/api/restaurants`      | GET    | List all restaurants     | No            | -     |
| `/api/restaurants/:id`  | GET    | Get restaurant details   | No            | -     |
| `/api/restaurants`      | POST   | Create restaurant        | Yes           | Admin |
| `/api/restaurants/:id`  | PUT    | Update restaurant        | Yes           | Admin |
| `/api/restaurants/:id`  | DELETE | Delete restaurant        | Yes           | Admin |
| `/api/menu-items`       | GET    | List menu items          | No            | -     |
| `/api/menu-items/:id`   | GET    | Get menu item details    | No            | -     |
| `/api/menu-items`       | POST   | Create menu item         | Yes           | Admin |
| `/api/menu-items/:id`   | PUT    | Update menu item         | Yes           | Admin |
| `/api/menu-items/:id`   | DELETE | Delete menu item         | Yes           | Admin |
| `/api/orders`           | GET    | List user orders         | Yes           | User  |
| `/api/orders`           | POST   | Create new order         | Yes           | User  |
| `/api/orders/:id`       | GET    | Get order details        | Yes           | User  |
| `/api/admin/orders`     | GET    | List all orders          | Yes           | Admin |
| `/api/admin/orders/:id` | PUT    | Update order status      | Yes           | Admin |
| `/api/admin/dashboard`  | GET    | Get admin dashboard data | Yes           | Admin |

### Appendix C: Project Directory Structure

```
hunger_panda/
├── app/                     # Next.js App Router pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── (auth)/              # Auth-related pages
│   ├── (dashboard)/         # User and admin dashboards
│   └── (main)/              # Main application pages
├── components/              # React components
│   ├── auth/                # Authentication components
│   ├── cart/                # Shopping cart components
│   ├── home/                # Home page components
│   ├── layout/              # Layout components (header, footer)
│   ├── menu/                # Menu-related components
│   ├── order/               # Order-related components
│   ├── restaurant/          # Restaurant components
│   ├── search/              # Search components
│   └── ui/                  # UI components (buttons, inputs)
├── lib/                     # Utility functions and types
│   ├── actions/             # Server actions
│   ├── auth/                # Auth utilities
│   ├── db/                  # Database utilities
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helper functions
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Schema migrations
├── public/                  # Static assets
│   ├── icons/               # Application icons
│   └── images/              # Images and photos
└── [configuration files]    # Various config files
```

### Appendix D: Team Information

**Project Team:** CodeRiders

**Team Members:**

- [Team member names and roles]

**Mentor/Supervisor:**

- [Professor/supervisor name]

**Course Information:**

- Database Management Systems
- Sindh Madressatul Islam University (SMIU)
- 5th
