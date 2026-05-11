# AgroConnect - Direct Farmer-to-Customer Marketplace

A full-stack web application that bridges the gap between farmers and customers by creating a digital marketplace where agricultural producers can sell directly to consumers, eliminating intermediaries and ensuring fair pricing for both parties.

## Problem & Solution

### The Problem
- **Farmers**: Limited market access, dependency on middlemen, unpredictable income, lack of price control
- **Customers**: Difficulty finding fresh local produce, limited product transparency, inflated prices due to multiple intermediaries
- **Market Gap**: No efficient digital platform connecting local farmers directly with consumers

### The Solution
AgroConnect creates a transparent, user-friendly marketplace that:
- Enables farmers to list products and manage inventory independently
- Provides customers with direct access to fresh produce from verified farmers
- Offers machinery rental sharing economy for agricultural equipment
- Implements a review system to ensure quality and build trust
- Automates order management and delivery tracking

---

## Key Features

### For Farmers 👨‍🌾
- **Product Management**: Create, update, and manage agricultural products with pricing and inventory
- **Performance Dashboard**: Real-time metrics including total products, sales revenue, average rating, and customer reviews
- **Profile Management**: Maintain farmer credentials and delivery contact details
- **Machinery Rental**: List farm equipment available for rent to other farmers/users
- **Review Tracking**: Monitor customer feedback and ratings on products

### For Customers 👥
- **Product Discovery**: Browse available fresh produce from local farmers with ratings and details
- **Shopping Cart**: Add products to cart with quantity management before checkout
- **Order Placement**: Complete purchases with saved delivery addresses and real-time order tracking
- **Order History**: View detailed order records including delivery dates and order status
- **Review System**: Leave ratings and feedback on purchased products
- **Machinery Rental**: Browse and rent farm equipment from other farmers

## Tech Stack

### Frontend
- **Framework**: React 18 with React Router v6 for client-side navigation
- **State Management**: React hooks (useState, useEffect) for local component state
- **HTTP Client**: Axios for RESTful API communication
- **Styling**: Custom CSS with responsive design
- **Icons**: FontAwesome for intuitive UI elements
- **Build Tool**: Create React App with webpack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js for REST API routing and middleware
- **CORS**: Enabled for secure cross-origin communication
- **Middleware**: express.json() for request parsing, async error handling wrapper

### Database
- **RDBMS**: PostgreSQL 16 with advanced features
- **Query Language**: SQL with PL/pgSQL stored procedures
- **Database Design**: Normalized schema with 13 core tables
- **Key Features**:
  - Stored procedures for business logic (registration, cart operations, order processing)
  - Database triggers for automatic calculations (product ratings, farmer ratings)
  - Indexes on frequently queried columns for performance optimization
  - Constraints (foreign keys, unique, check) for data integrity

### Infrastructure
- **Containerization**: Docker & Docker Compose for local development
- **Services**: PostgreSQL database container and Express backend container

## Project Architecture

```
AgroConnect/
├── client/                              # React frontend (Port 3000)
│   ├── public/
│   │   ├── index.html
│   │   └── images/                      # App images and assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── main.js                  # Landing page with role selection
│   │   │   ├── farmerlogin.js           # Farmer authentication
│   │   │   ├── farmersignup.js          # Farmer registration form
│   │   │   ├── customerlogin.js         # Customer authentication
│   │   │   ├── customersignup.js        # Customer registration form
│   │   │   ├── farmerdashboard.js       # Farmer dashboard container w/ sidebar navigation
│   │   │   ├── customerdashboard.js     # Customer dashboard container w/ sidebar navigation
│   │   ├── customerpages/               # Customer-specific page components
│   │   │   ├── productHome.js           # Browse products & add to cart
│   │   │   ├── ShoppingCart.js          # View & manage cart items
│   │   │   ├── customerorderdetails.js  # Order history & status tracking
│   │   │   ├── ContactDetails.js        # Manage delivery addresses
│   │   │   └── CustomerReviews.js       # Submit product reviews
│   │   ├── pages/                       # Farmer/shared page components
│   │   │   ├── Home.js                  # Farmer dashboard home with metrics
│   │   │   ├── product.js               # Product listing & creation
│   │   │   ├── Contact.js               # Contact details management
│   │   │   ├── Machinery.js             # List & manage farm equipment
│   │   │   ├── AvailableMachinery.js    # Browse available equipment for rent
│   │   │   ├── Rented.js                # Track rented equipment
│   │   │   └── Reviews.js               # View customer reviews & ratings
│   │   ├── stylesheets/                 # Feature-organized CSS
│   │   │   ├── styles.css               # Global styles
│   │   │   ├── signup.css               # Auth form styling
│   │   │   └── dashboard-pages.css      # Dashboard pages layout
│   │   ├── api.js                       # Axios instance with base URL
│   │   ├── index.js                     # React entry point with routing config
│   │   └── index.css                    # App-wide styles
│   └── package.json                     # Dependencies & scripts
│
├── server/                              # Node.js/Express backend (Port 4000)
│   ├── server.js                        # API endpoints & middleware
│   ├── database.js                      # PostgreSQL connection pool
│   └── package.json                     # Dependencies (express, cors, pg)
│
├── database/
│   └── init.sql                         # PostgreSQL schema, stored procedures, triggers
│
├── docker-compose.yml                   # Docker services configuration
└── README.md                            # This file
```

## Database Design

### Core Tables
1. **f2c_user** - User accounts (email PK, password, name, type)
2. **customer** - Customer profile (FK to f2c_user)
3. **farmer** - Farmer profile (FK to f2c_user, rating, description)
4. **category** - Product categories (vegetables, fruits, dairy, etc.)
5. **product** - Farmer's products (name, price, stock, rating)
6. **carrier** - Delivery partners (name, phone, email)
7. **contact_detail** - User delivery addresses (street, city, zipcode)
8. **shopping_cart** - Customer carts (1 per customer)
9. **product_shoppingcart** - Cart items (M2M between cart and products)
10. **f2c_order** - Customer orders (order_id, total_price, status)
11. **order_product** - Order line items (product details at order time)
12. **review** - Product reviews (rating 1-5, comment, customer→product)
13. **machinery** - Equipment listings (name, price_per_day, location)
14. **machinery_rental** - Equipment rentals (rental_date, return_date, status)

### Key Design Decisions
- **Email as User ID**: Used as primary key in f2c_user table for simplicity (better: use UUID)
- **Stored Procedures**: Business logic in database (registration, cart, orders) ensures consistency
- **Database Triggers**: Automatic rating calculations when reviews are added/deleted
- **Normalization**: Tables follow 3NF to minimize data redundancy
- **Constraints**: Foreign keys prevent orphaned records; CHECK constraints validate values

---

## API Endpoints

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/login` | POST | Authenticate user, return user_type (0=customer, 1=farmer) |
| `/farmersignup` | POST | Register new farmer account |
| `/customersignup` | POST | Register new customer account |

### Customer Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/customerdashboard/productHome` | GET | Fetch all available products |
| `/customerdashboard/productHome` | POST | Add products to shopping cart |
| `/customerdashboard/cart` | GET | Get customer's cart items |
| `/customerdashboard/cart/:product_id` | PATCH | Update item quantity in cart |
| `/customerdashboard/cart/:product_id` | DELETE | Remove item from cart |
| `/customerdashboard/placeorder` | POST | Convert cart to order |
| `/customerdashboard/orders` | GET | Fetch customer's order history |
| `/customerdashboard/customercontact` | GET/POST | Manage delivery addresses |
| `/customerdashboard/reviews` | GET/POST | View and submit product reviews |
| `/customerdashboard/purchased-products` | GET | Get products for reviews |

### Farmer Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/farmerdashboard/summary` | GET | Dashboard metrics (sales, ratings, products) |
| `/farmerdashboard/products` | GET/POST | List or create products |
| `/farmerdashboard/products/:product_id` | PATCH/DELETE | Update or delete product |
| `/farmerdashboard/machinery` | GET/POST | List or add farm equipment |
| `/farmerdashboard/available-machinery` | GET | Browse available equipment for rent |
| `/farmerdashboard/rented` | GET | Track rented items |
| `/farmerdashboard/rent-machinery` | POST | Rent equipment |
| `/farmerdashboard/return-machinery` | POST | Return rented equipment |
| `/farmerdashboard/reviews` | GET | View reviews on farmer's products |
| `/farmerdashboard/profile` | PATCH | Update farmer profile/description |

### Metadata Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/categories` | GET | Fetch all product categories |
| `/carriers` | GET | Fetch delivery carrier options |
| `/health` | GET | Health check with database connectivity |

---

## How It Works

### User Registration & Authentication
1. User selects role (Farmer or Customer) on landing page
2. Fills signup form with email, name, and password
3. Backend validates input and calls stored procedure `register_farmer()` or `register_customer()`
4. Procedure checks for duplicate email and creates user record in `f2c_user` table
5. User logs in with email/password; email stored in sessionStorage
6. Redirect to role-specific dashboard

**Current Security Note**: Passwords stored in plaintext. **Production Should Use**: bcrypt for hashing + JWT tokens for stateless auth

### Farmer Workflow - Listing Products
1. Farmer logs in → Dashboard shows metrics (products, sales, ratings)
2. Navigate to "Product Management" → Form to add product
3. Fill details: name, category, price, description, available units, carrier phone
4. Backend calls `add_product()` stored procedure
5. Product stored with `in_stock = TRUE` if available_units > 0
6. Product immediately visible to customers

### Customer Workflow - Making a Purchase
1. Customer logs in → Sees product catalog (fetched via JOIN with farmer, category, carrier)
2. Filters/searches products → Selects items and clicks "Add to Cart"
3. Backend calls `add_to_shopping_cart()` for each product
4. Items stored in `product_shoppingcart` table
5. Customer navigates to "Contact Details" → Saves delivery address
6. Clicks "Place Order" → Backend calls `place_order()` stored procedure
7. Procedure creates `f2c_order` record and `order_product` line items
8. Order status: Processing → In Transit → Delivered
9. Customer can leave reviews once order is received

### Review System & Rating Calculation
1. After order delivery, customer can review product/farmer
2. Backend calls `add_review()` stored procedure with rating (1-5)
3. Database trigger `trg_review_rating_update` fires:
   - Recalculates product rating (AVG of all reviews)
   - Recalculates farmer rating (AVG across all their products)
4. Farmer can see reviews in their dashboard

---

## Running the Project

### Prerequisites
- Node.js 16+ and npm
- Docker & Docker Compose
- PostgreSQL 16 (via Docker)

### Setup & Start

```bash
# 1. Clone repository
git clone <repo_url>
cd AgroConnect

# 2. Start PostgreSQL and backend via Docker
docker-compose up -d

# 3. Install frontend dependencies
cd client
npm install

# 4. Start development server
npm start

# Frontend: http://localhost:3000
# Backend: http://localhost:4000
# Database: localhost:5432

# 5. Stop services (when done)
docker-compose down
```

### Stopping Services
```bash
docker-compose down          # Stop containers
docker-compose down -v       # Stop containers and remove volume data
```

---

## Key Implementation Details

### State Management
- **Frontend**: React hooks (useState for local state, useEffect for side effects)
- **Session**: Email stored in sessionStorage for cross-component access
- **Persistence**: sessionStorage cleared on browser close (consider localStorage for "remember me")

### Error Handling
- Frontend: Try-catch blocks with user-friendly alerts
- Backend: asyncHandler middleware catches Promise rejections from async endpoints
- Database: Stored procedures validate data and raise errors on constraint violations

### Authentication Flow
```
User Input → API Call → DB Query → Session Storage → Redirect
```

### Shopping Flow
```
Browse Products → Add to Cart → Save Address → Place Order → DB Creates Order
                                ↓
                    Call place_order() Stored Procedure
                            ↓
                    Create f2c_order + order_product records
```

---

## Performance Optimizations
1. **Database Indexes**: On frequently queried columns (farmer_id, category_id, customer_id)
2. **Denormalization**: Pre-computed fields (product rating, farmer rating) updated via triggers
3. **Query Optimization**: Joins on product, farmer, and category to fetch complete product info in single query
4. **Connection Pooling**: PostgreSQL connection pool manages database connections efficiently

---

## Future Enhancements
1. **Security**: Implement bcrypt password hashing + JWT token authentication
2. **Payment Gateway**: Integrate Razorpay/Stripe for real payments (currently: Cash on Delivery)
3. **Search & Filters**: Add full-text search and advanced product filtering
4. **Real-time Notifications**: WebSocket for order updates and messaging
5. **Image Upload**: Cloudinary/AWS S3 for product images
6. **Admin Dashboard**: Moderation, analytics, dispute resolution
7. **Mobile App**: React Native or Flutter for iOS/Android
8. **Geo-location**: Map integration to show nearby farmers/products
9. **Performance**: Cache reviews with Redis, use CDN for static assets
10. **Testing**: Unit tests (Jest), integration tests (Supertest), E2E tests (Cypress)

---

## Project Highlights

### What Makes This Project Interview-Ready
✅ **Full-Stack Implementation**: React frontend + Node.js backend + PostgreSQL database  
✅ **Real Business Logic**: Shopping carts, orders, reviews with constraints & triggers  
✅ **Database Design**: Normalized schema with stored procedures for consistency  
✅ **Error Handling**: Try-catch, validation, meaningful error messages  
✅ **Code Organization**: Separated concerns (components, pages, styles, API)  
✅ **Scalability**: Database indexes, connection pooling, modular architecture  
✅ **User Experience**: Responsive dashboards, intuitive navigation, role-based UI  

### Lessons Learned & Improvements
- **Session Management**: sessionStorage is sufficient for demo; production needs JWT
- **Password Security**: Store hashed passwords (bcrypt), not plaintext
- **Database Design**: Email as PK works for MVP, but UUID is more scalable
- **API Documentation**: Comprehensive endpoint documentation helps frontend development

---

## License

This project is created for educational and portfolio purposes.

---

**Built with ❤️ using React, Node.js, and PostgreSQL**


