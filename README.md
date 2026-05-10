# AgroConnect - Farmer-Customer Marketplace Platform

## Overview

**AgroConnect** is a full-stack web application that directly connects farmers with customers for the purchase and sale of fresh, locally-grown agricultural produce. The platform eliminates intermediaries, enabling farmers to maximize their profits while customers access fresh products at fair prices.

## Problem Statement

- **For Farmers**: Limited market access, dependency on middlemen, unpredictable income
- **For Customers**: Difficulty finding fresh local produce, lack of transparency in pricing and sourcing
- **Solution**: AgroConnect creates a digital marketplace that bridges this gap through a user-friendly platform

## Key Features

### For Farmers
- **Product Listing**: Upload and manage agricultural products with details like price, category, available units
- **Order Management**: Track incoming customer orders in real-time
- **Dashboard**: View inventory, sales, and performance metrics
- **Profile Management**: Maintain farmer information and contact details

### For Customers
- **Product Discovery**: Browse available fresh produce from local farmers
- **Shopping Cart**: Add products to cart and manage purchases
- **Order Placement**: Complete transactions with delivery address management
- **Order History**: View past orders and track current deliveries
- **Reviews**: Leave feedback on products and farmers

## Tech Stack

### Frontend
- **Framework**: React 18 with React Router for navigation
- **Styling**: CSS with custom stylesheets and styled-components
- **Icons**: FontAwesome for UI icons
- **HTTP Client**: Axios for API communication
- **Build Tool**: Create React App

### Backend
- **Framework**: Node.js with Express.js
- **CORS**: Enabled for cross-origin requests
- **Database**: PostgreSQL with stored procedures for business logic

### Database
- **PostgreSQL** with PL/pgSQL stored procedures
- Tables: `f2c_user`, `product`, `product_shoppingcart`, `f2c_order`, `contact_detail`, and more
- Stored procedures handle registration, product management, order placement, cart operations

## Project Structure

```
AgroConnect/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── main.js              # Landing page with hero section
│   │   │   ├── farmerlogin.js       # Farmer login component
│   │   │   ├── farmersignup.js      # Farmer registration
│   │   │   ├── customerlogin.js     # Customer login
│   │   │   ├── customersignup.js    # Customer registration
│   │   │   ├── farmerdashboard.js   # Farmer dashboard container
│   │   │   ├── customerdashboard.js # Customer dashboard container
│   │   ├── customerpages/           # Customer-specific page components
│   │   ├── pages/                   # Shared page components (Home, Contact, Reviews, etc.)
│   │   ├── stylesheets/             # CSS files organized by feature
│   │   ├── assets/                  # Images and videos
│   │   ├── index.js                 # React entry point
│   ├── package.json
│
├── server/                          # Node.js backend
│   ├── database.js                  # PostgreSQL connection pool
│   ├── server.js                    # Express app with API endpoints
│   ├── package.json
│
└── README.md
```

## How It Works

### User Registration & Authentication
1. User selects role (Farmer or Customer)
2. Completes signup form with email, name, and password
3. Backend stores credentials in PostgreSQL via `register_farmer()` or `register_customer()` stored procedure
4. User logs in with email/password; email stored in localStorage for session management
5. **Future Enhancement**: Implement JWT token-based authentication

### For Farmers - Product Management
1. Farmer logs in and accesses dashboard
2. Navigates to "Add Product" section
3. Provides product details: name, price, category, description, available units, carrier phone
4. Backend calls `add_product()` stored procedure to store in database
5. Product immediately available for customers to browse

### For Customers - Shopping Flow
1. Customer logs in and views product catalog
2. Browses products fetched via `GET /customerdashboard/productHome`
3. Adds items to shopping cart (stored in `product_shoppingcart` table)
4. Provides delivery address information via "Contact Details" page
5. Clicks "Place Order" → backend calls `place_order()` stored procedure
6. Order created in `f2c_order` table and ready for farmer fulfillment

## API Endpoints

### Authentication
- `POST /farmersignup` - Register new farmer
- `POST /customersignup` - Register new customer
- `POST /login` - Login for both farmers and customers

### Products
- `GET /customerdashboard/productHome` - Fetch all available products
- `POST /farmerdashboard/products` - Add new product (farmer only)

### Shopping Cart
- `POST /customerdashboard/productHome` - Add products to cart

### Orders
- `POST /customerdashboard/placeorder` - Place order from cart items
- `POST /customerdashboard/customercontact` - Save delivery address
- `GET /customerdashboard/customercontact` - Retrieve customer address

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup
```bash
cd server
npm install
# Update database credentials in database.js with your PostgreSQL connection
node server.js
# Server runs on http://localhost:4000
```

### Frontend Setup
```bash
cd client
npm install
npm start
# App runs on http://localhost:3000
```

### Database Setup
1. Create PostgreSQL database named `backend`
2. Create tables: `f2c_user`, `product`, `product_shoppingcart`, `f2c_order`, `contact_detail`
3. Create stored procedures: `register_farmer()`, `register_customer()`, `add_product()`, `add_to_shopping_cart()`, `place_order()`, `add_contact_details()`
4. Update connection credentials in `server/database.js`

## Implementation Details

### Frontend Architecture
- **Component-Based**: Modular React components for scalability
- **State Management**: Local state with `useState` for forms; localStorage for session persistence
- **Routing**: React Router for SPA navigation between login, dashboards, and features
- **Responsive Design**: CSS-based layouts adapt to different screen sizes

### Backend Architecture
- **REST API**: RESTful endpoints for CRUD operations
- **Stored Procedures**: Business logic encapsulated in PostgreSQL (advantages: security, data integrity, code reuse)
- **Parameterized Queries**: Used for some endpoints (e.g., GET requests) to prevent SQL injection
- **Error Handling**: Try-catch blocks with meaningful error responses

### Database Design
- **Separation of Concerns**: User table (`f2c_user`) stores both farmer and customer data with implicit differentiation
- **Transaction Safety**: Stored procedures ensure atomic operations (e.g., adding to cart and updating inventory)
- **Relationships**: Foreign keys link products to farmers, orders to customers and products

### Security Considerations (Current vs. Production)
| Aspect | Current | Production Needed |
|--------|---------|-------------------|
| Authentication | Email storage in localStorage | JWT tokens with expiration |
| Passwords | Plain text in database | Bcrypt hashing |
| Queries | Mix of parameterized and string interpolation | All parameterized queries |
| API | No rate limiting | Rate limiting and throttling |
| HTTPS | Not enforced | Mandatory HTTPS |

## How I Would Explain This in an Interview

**"AgroConnect is a full-stack marketplace application I built to solve the disconnect between farmers and consumers. 

**The Problem**: Farmers often depend on middlemen who take significant margins, while customers struggle to find fresh, local produce with transparency about origin and pricing.

**The Solution**: I created a web platform where farmers can list their products and customers can discover and purchase directly, cutting out intermediaries.

**Technical Architecture**: 
- The frontend is a React SPA with separate dashboards for farmers and customers, managing state with hooks and persisting session data with localStorage
- The backend is Node.js/Express serving RESTful APIs that interact with a PostgreSQL database
- Business logic is encapsulated in stored procedures for security and data integrity

**Key Implementation Details**:
1. **Authentication Flow**: Both user types register/login through unified endpoints; I store the email in localStorage for session management (though this would be JWT tokens in production)
2. **Product Marketplace**: Farmers add products through a form that triggers a stored procedure to insert data; customers browse via a GET endpoint that queries the database
3. **Order Processing**: When customers place orders, the backend processes cart items through a transaction-safe stored procedure

**Design Decisions**:
- I used stored procedures instead of raw queries for encapsulation and security
- I separated farmer and customer concerns into different components while maintaining a single user table for simplicity
- I chose localStorage for session persistence to keep the MVP lightweight, though JWT would be more secure at scale

**Challenges & Learning**:
- Managing state across multiple components taught me the importance of prop drilling and why context/Redux becomes necessary
- Working with PostgreSQL stored procedures showed me the advantage of database-level business logic for consistency
- Building responsive UI components made me appreciate CSS-in-JS solutions for maintainability

**If I were to improve this**:
1. Implement proper JWT-based authentication with refresh tokens
2. Add input validation and sanitization at both client and server
3. Implement role-based access control (RBAC) for more granular permissions
4. Add real-time notifications for order updates using WebSockets
5. Deploy using Docker containers with Kubernetes for scalability"

## Future Enhancements

1. **Authentication**: JWT-based authentication with refresh tokens and role-based access control
2. **Security**: Input validation, sanitization, bcrypt password hashing, rate limiting
3. **Payment Integration**: Stripe/PayPal integration for secure transactions
4. **Real-Time Updates**: WebSocket support for live order notifications
5. **Recommendation Engine**: ML-based product recommendations based on browsing history
6. **Analytics**: Dashboard for farmers showing sales trends and customer insights
7. **Mobile App**: React Native version for iOS/Android
8. **Deployment**: Docker containerization and Kubernetes orchestration for scaling

## Notes for Interviews

This project demonstrates:
- **Full-Stack Development**: End-to-end understanding from database design through frontend UX
- **Database Design**: Schema modeling, stored procedures, transactions, relationships
- **API Development**: RESTful design, error handling, parameterized queries
- **Frontend Architecture**: Component composition, state management, routing
- **Problem-Solving**: Identifying real-world issues and designing technical solutions
- **Code Quality**: Clean code, meaningful comments, proper separation of concerns (though further improvements needed for production)

The codebase is interview-ready and showcases practical knowledge of modern web development while acknowledging areas for production-level improvements (authentication, security, scalability).

