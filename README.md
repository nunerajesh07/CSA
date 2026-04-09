# EduMaster 🎓

EduMaster is a full-stack online course platform built with:
- **React + Vite** for the frontend
- **Node.js + Express** for the backend
- **MongoDB + Mongoose** for data storage
- **JWT authentication** for both users and admins

The app supports course browsing, purchases, user/account management, and an admin course dashboard.

---

## ✨ Features

### User
- Register and log in with email/password
- Browse courses with search and filters
- Purchase courses with duplicate purchase prevention
- View purchased courses in a user dashboard
- Responsive UI with clean light styling

### Admin
- Separate admin signup and login flow
- Create new courses with title, description, price, and image
- Edit existing courses from the dashboard
- See a list of all available courses

---

## 🧱 Tech Stack

- Frontend: **React**, **Vite**, **Tailwind CSS v4**
- Backend: **Node.js**, **Express**
- Database: **MongoDB**, **Mongoose**
- Auth: **JWT**
- Password hashing: **bcrypt**
- HTTP client: **Axios**
- Notifications: **react-hot-toast**

---

## 📁 Project Structure

```
csa/
├── backend/
│   ├── config.js
│   ├── index.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Course.js
│   │   ├── Purchase.js
│   │   └── User.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   │   └── userAuth.js
│   └── routes/
│       ├── admin.js
│       ├── course.js
│       └── user.js

└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   └── api.js
        ├── components/
        │   ├── CourseCard.jsx
        │   ├── LoadingSpinner.jsx
        │   └── Navbar.jsx
        └── pages/
            ├── AddEditCourse.jsx
            ├── AdminDashboard.jsx
            ├── AdminLogin.jsx
            ├── AdminSignup.jsx
            ├── Home.jsx
            ├── Login.jsx
            ├── PurchasedCourses.jsx
            └── Signup.jsx
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18 or later
- MongoDB Atlas or local MongoDB

### 1. Clone the repo

```bash
cd csa
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/edumaster
JWT_USER_SECRET=your_user_secret
JWT_ADMIN_SECRET=your_admin_secret
PORT=3000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the app at **http://localhost:5173**.

---

## 🔐 How Authentication Works

1. User or admin logs in via form
2. Backend validates credentials and issues a JWT
3. Frontend stores the token in local storage
4. Axios attaches the token to protected API requests
5. Backend middleware verifies the token before returning data

---

## 🌐 API Overview

### User Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/user/signup` | No | Register a user |
| POST | `/user/signin` | No | Login a user |
| GET | `/user/purchases` | Yes | Get purchased courses |

### Course Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/courses/preview` | No | List all courses |
| POST | `/courses/purchase` | Yes | Purchase a course |

### Admin Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/admin/signup` | No | Register an admin |
| POST | `/admin/signin` | No | Login an admin |
| POST | `/admin/course` | Yes | Create a course |
| PUT | `/admin/course` | Yes | Update a course |
| GET | `/admin/course/bulk` | Yes | Get admin courses |

---

## 🛠️ Useful Commands

### Backend
- `npm run dev` — start backend with nodemon
- `npm start` — run backend in production mode

### Frontend
- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview production build

---

## 📌 Notes
- Do not commit `backend/.env`
- Use strong JWT secrets for production
- Ensure MongoDB is reachable from the backend


## 🗄️ Database Models

### User
| Field | Type | Notes |
|-------|------|-------|
| email | String | Unique, lowercase |
| password | String | bcrypt hashed |
| firstname | String | Required |
| lastname | String | Required |

### Admin
Same fields as User — stored in separate collection.

### Course
| Field | Type | Notes |
|-------|------|-------|
| title | String | Required |
| description | String | Required |
| price | Number | Min 0 |
| imageURL | String | Optional, defaults provided |
| creatorId | ObjectId | Reference to Admin |

### Purchase
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | Reference to User |
| courseId | ObjectId | Reference to Course |

> Compound unique index on `(userId, courseId)` prevents duplicate purchases.

---

## 🎨 UI Pages

| Page | Route | Access |
|------|-------|--------|
| Home / Course Listing | `/` | Public |
| User Login | `/login` | Public |
| User Signup | `/signup` | Public |
| My Courses | `/purchases` | User only |
| Admin Login | `/admin/login` | Public |
| Admin Signup | `/admin/signup` | Public |
| Admin Dashboard | `/admin/dashboard` | Admin only |
| Add Course | `/admin/course/new` | Admin only |
| Edit Course | `/admin/course/edit` | Admin only |

---

## 🔒 Security Notes

- Passwords are **bcrypt hashed** before storage
- JWTs have a **7-day expiry**
- Admins and users have **separate JWT secrets**
- Admin routes verify the admin JWT, not the user JWT
- Duplicate purchases are prevented at both application and database level

---

## 🚀 Quick Start (TL;DR)

```bash
# Terminal 1 — Backend
cd csa/backend && npm install && npm run dev

# Terminal 2 — Frontend
cd csa/frontend && npm install && npm run dev
```

Visit http://localhost:5173 🎉
