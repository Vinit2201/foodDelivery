# 🍔 QuickBite — Full-Stack Food Delivery App

A complete food delivery web app with:
- **Frontend**: Pure HTML/CSS/JS (no framework needed)
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB (via MongoDB Atlas — free)
- **Auth**: JWT-based register/login/profile
- **AI**: Claude-powered food assistant chatbot

---

## 📁 Project Structure

```
quickbite/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Order.js           # Order schema
│   ├── routes/
│   │   ├── auth.js            # /api/auth/*
│   │   ├── orders.js          # /api/orders/*
│   │   └── restaurants.js     # /api/restaurants/*
│   ├── .env.example           # Copy to .env and fill in
│   ├── package.json
│   └── server.js              # Entry point
└── frontend/
    └── index.html             # Full frontend (single file)
```

---

## 🚀 Setup Guide

### STEP 1 — Get a free MongoDB database

1. Go to **https://mongodb.com/atlas** → Create free account
2. Create a **free M0 cluster** (choose any region)
3. Create a **database user** (username + password — save these!)
4. Go to **Network Access** → Add IP Address → Allow from anywhere (`0.0.0.0/0`)
5. Go to **Database** → Connect → **Connect your application**
6. Copy the connection string — looks like:
   `mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/`

### STEP 2 — Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:
```
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/quickbite
JWT_SECRET=any_long_random_string_here_make_it_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### STEP 3 — Install and run the backend

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.abc123.mongodb.net
🚀 QuickBite server running on port 5000
```

Test it: Open http://localhost:5000/api/health in your browser

### STEP 4 — Open the frontend

Just open `frontend/index.html` directly in your browser.
Or serve it with:
```bash
npx serve frontend
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |
| PUT | /api/auth/profile | Update profile | Yes |
| PUT | /api/auth/change-password | Change password | Yes |
| PUT | /api/auth/favorites/:id | Toggle favorite | Yes |

### Restaurants
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/restaurants | Get all (filter by ?category=&search=) | No |
| GET | /api/restaurants/:id | Get single with menu | No |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/orders | Place new order | Yes |
| GET | /api/orders/my | Get my orders | Yes |
| GET | /api/orders/:orderId | Get single order | Yes |
| PUT | /api/orders/:orderId/status | Update status | Admin |
| GET | /api/orders | Get all orders | Admin |

---

## 🚀 Deploy to Production (Free)

### Backend → Render.com (Free)
1. Push your `backend/` folder to GitHub
2. Go to **render.com** → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from your `.env`
6. Deploy! You get a URL like `https://quickbite-api.onrender.com`

### Frontend → Vercel (Free)
1. Update `API_BASE` in `frontend/index.html`:
   ```js
   const API_BASE = 'https://quickbite-api.onrender.com/api';
   ```
2. Go to **vercel.com** → Drag & drop the `frontend/` folder
3. Deploy! Your site is live.

---

## 🔧 Make Someone an Admin

In MongoDB Atlas → Browse Collections → users collection:
Find the user and change `"role": "user"` to `"role": "admin"`

---

## 📦 Features

- ✅ User registration & login (JWT, 30-day sessions)
- ✅ Persistent sessions (token in localStorage)
- ✅ Profile management
- ✅ Favorites system
- ✅ Place real orders (saved to MongoDB)
- ✅ Order history (persists across sessions)
- ✅ Order tracking animation
- ✅ Category filter & search
- ✅ Shopping cart
- ✅ AI food assistant (Byte)
- ✅ Admin order management API
