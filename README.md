# Luxe Store — E-Commerce Web App

A full-stack e-commerce application built with Node.js, Express, MongoDB, React, and Redux Toolkit.

![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen) ![React](https://img.shields.io/badge/Frontend-React-blue) ![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4)

## Features

### User Features
- Register and login with JWT authentication
- Browse products with search, filters, and pagination
- View product details and reviews
- Add/update/remove items from cart
- Place orders with shipping address
- View order history
- Create products with image upload
- Write product reviews (1-5 star rating)
- Forgot password with email reset link

### Admin Features
- Dashboard with revenue stats and recent orders
- Manage all orders (update status: pending → delivered)
- Assign roles to users
- Delete reviews

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose 9
- **Authentication:** JWT (access + refresh tokens) with HTTP-only cookies
- **Validation:** express-validator
- **File Upload:** Multer
- **Email:** Nodemailer + Mailgen
- **Password Hashing:** bcrypt

### Frontend
- **Library:** React 19
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React

## Project Structure

```
e-commerce/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── db/               # Database connection
│   │   ├── middlewares/       # Auth, multer middlewares
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   ├── utils/            # Helpers (ApiError, ApiResponse, mail, etc.)
│   │   ├── validators/       # express-validator rules
│   │   ├── app.js            # Express app setup
│   │   └── index.js          # Entry point
│   ├── public/images/        # Uploaded product images
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance with interceptors
│   │   ├── components/       # Layout, AdminLayout, ProtectedRoute
│   │   ├── pages/            # All page components
│   │   │   └── admin/        # Admin dashboard pages
│   │   └── store/
│   │       └── slices/       # Redux slices (auth, product, cart, order, review)
│   └── package.json
└── README.md
```

## API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register user |
| POST | `/login` | No | Login |
| POST | `/logout` | Yes | Logout |
| POST | `/refresh-token` | No | Refresh access token |
| POST | `/change-password` | Yes | Change password |
| POST | `/forgot-password` | No | Send reset email |
| POST | `/reset-password/:token` | No | Reset password |
| PATCH | `/assign-role` | Admin | Assign role to user |

### Products (`/api/v1/products`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all products (with filters/pagination) |
| GET | `/:productId` | No | Get single product |
| POST | `/` | Yes | Create product |
| PATCH | `/:productId` | Yes | Update product |
| DELETE | `/:productId` | Yes | Delete product |

### Cart (`/api/v1/cart`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get user's cart |
| POST | `/add/:productId` | Yes | Add to cart |
| PATCH | `/update/:productId` | Yes | Update quantity |
| DELETE | `/remove/:productId` | Yes | Remove item |
| DELETE | `/clear` | Yes | Clear cart |

### Orders (`/api/v1/orders`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Place order from cart |
| GET | `/my-orders` | Yes | Get user's orders |
| GET | `/:orderId` | Yes | Get order by ID |
| GET | `/all` | Admin | Get all orders |
| PATCH | `/:orderId/status` | Admin | Update order status |

### Reviews (`/api/v1/reviews`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/product/:productId` | No | Get product reviews |
| POST | `/product/:productId` | Yes | Create review |
| DELETE | `/:reviewId` | Admin | Delete review |

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- npm

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_EXPIRY=10d
FRONTEND_URL=http://localhost:5173
MAILTRAP_SMTP_HOST=your_mailtrap_host
MAILTRAP_SMTP_PORT=your_mailtrap_port
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_pass
```

Create the images directory:

```bash
mkdir -p public/images
```

Start the server:

```bash
npm run build
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (optional, defaults to localhost):

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start the dev server:

```bash
npm run dev
```

### Running Both

- Terminal 1: `cd backend && npm run build`
- Terminal 2: `cd frontend && npm run dev`

Open `http://localhost:5173` in your browser.

## Environment

- Backend runs on: `http://localhost:8000`
- Frontend runs on: `http://localhost:5173`

## Author

**Kritiman Talukdar**

## License

ISC
