## E-commerce MERN App
- An e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js). This project provides core e-commerce functionality including user authentication, product management, a shopping cart, and a checkout process.

## Table of Contents
- Features
- Technologies
- Installation
- Environment Variables
- Running the Application
- Testing
- Folder Structure
- API Endpoints
- Contributing
## Features
- User Authentication: Register and log in with JWT-based authentication.
- Admin Dashboard: Admins can manage products, categories, and view orders.
- Product Management: CRUD operations for products, including details like price, description, category, and images.
- Shopping Cart: Add, update, and remove items in the cart.
- Order Management: Place orders with shipping details, view order status, and history.
- Payment Integration: Integrated with Stripe for payment processing.
- Responsive Design: Mobile and desktop-friendly UI.
## Technologies
- Frontend: React, Redux, CSS Modules
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT (JSON Web Token)
- Payment Gateway: Stripe

## Installation
# Prerequisites
- Node.js (v14+)
- MongoDB
- Stripe account (for payment processing)
## clone the repo
- git clone https://github.com/yourusername/ecommerce-mern-app.git
cd ecommerce-mern-app
## Install Dependencies
- Install dependencies for both the frontend and backend:

# Backend dependencies
- cd server
- npm install

# Frontend dependencies
- cd client
- npm install

## Set Up MongoDB
- Make sure MongoDB is running on your local machine or use MongoDB Atlas for cloud storage.
Create a MongoDB database for this project.

## Environment Variables
- Create a .env file in the backend directory with the following configuration:

# Server settings
PORT=5000

# Database
MONGO_URI=your_mongo_database_uri

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

## Start the Frontend Development Server
- In the client folder, run:
- npm start
- The client development server should now be running on http://localhost:3000.

## Access the Application
- Visit http://localhost:3000 to view the app in your browser.

## API Endpoints
# Auth Routes
- POST /api/auth/register: Register a new user
- POST /api/auth/login: Log in a user
# User Routes
- GET /api/user/
: Get user profile
- PUT /api/user/
: Update user profile
# Product Routes
- GET /api/products: Get all products
- POST /api/products: Add a new product (Admin only)
- PUT /api/products/
: Update a product (Admin only)
- DELETE /api/products/
: Delete a product (Admin only)
# Order Routes
- POST /api/orders: Place a new order
- GET /api/orders/
: Get order by ID
- GET /api/orders/user/
: Get orders for a specific user
# Cart Routes
- POST /api/cart: Add item to cart
- GET /api/cart: Get cart items
- DELETE /api/cart/
: Remove item from cart

## Contributing
- Contributions are welcome! Please follow these steps:

# Fork the repository.
- Create a new branch (feature/your-feature-name).
- Commit your changes and push the branch to your fork.
- Open a pull request to this repository.