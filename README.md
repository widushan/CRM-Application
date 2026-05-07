# 🚀 CRM Application - Lead Management System

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A full-stack Customer Relationship Management (CRM) application designed to streamline lead management, tracking, and conversion workflows. Built with the **MERN** stack, it provides a seamless experience for managing potential clients and monitoring sales performance.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router DOM v7
- **Notifications:** React Toastify
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **File Handling:** Multer & Cloudinary

---

## ✨ Features Implemented

- **🔐 Secure Authentication:** User registration and login with encrypted passwords and JWT-based session management.
- **📊 Interactive Dashboard:** Visual overview of lead statistics, conversion rates, and recent activities.
- **📋 Lead Management:** Full CRUD (Create, Read, Update, Delete) functionality for leads with detailed tracking.
- **📝 Lead Notes:** Add and manage historical notes for individual leads to keep track of interactions.
- **🔄 Status Tracking:** Monitor lead progression through various stages (New, Contacted, Qualified, Lost).
- **📱 Responsive Design:** Fully optimized for desktop, tablet, and mobile views.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB account (Atlas or Local)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd CRM-Application
```

### 2. Setup Server
```bash
cd server
npm install
# Create a .env file (see Environment Variables section)
npm run server
```

### 3. Setup Client
```bash
cd ../client
npm install
# Create a .env file (see Environment Variables section)
npm run dev
```

---

## 🔑 Environment Variables

### Server (`/server/.env`)
```env
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_key
PORT = 4000
```

### Client (`/client/.env`)
```env
VITE_BACKEND_URL = http://localhost:4000
```

---

## 🗄️ Database Setup

1. **MongoDB Atlas:** Create a free cluster on MongoDB Atlas, whitelist your IP, and get your connection string.
2. **Local MongoDB:** Ensure your MongoDB service is running and use `mongodb://localhost:27017/crm`.
3. **Configuration:** The application automatically connects to the database via `server/config/mongodb.js` using the `MONGODB_URI` environment variable.

---

## 👤 Test Login Credentials

To access the application, you can either:
1. **Register a new account** directly through the registration page.
2. Use existing credentials if you have already populated the database.

> [!NOTE]
> For a fresh installation, please use the **Sign Up** feature first to create your admin account.

---

## ⚠️ Known Limitations

- **Email Notifications:** Automatic email follow-ups are not yet implemented.
- **Advanced Permissions:** Basic role-based access is present, but granular permissions are under development.
- **Bulk Actions:** Currently, leads must be managed individually (no bulk delete/export).

---

## 💭 Reflection

Developing this CRM application was a deep dive into the **MERN stack** and modern UI/UX principles. The primary focus was on creating a tool that is not just functional but also intuitive for end-users. 

The biggest challenge was ensuring robust data isolation between users while maintaining a high-performance dashboard that provides real-time insights. This project served as a great opportunity to implement secure authentication flows and complex database relationships using Mongoose.

---

*Developed with ❤️ for better productivity.*
