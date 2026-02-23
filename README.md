# 🏏 MPL – Cricket Tournament Registration & Auction Platform

MPL is a full-stack web application built for managing a cricket tournament registration system and player auction process.

It allows players to register for the tournament, upload details (including images), and enables organizers to view and manage registered participants.

---

## 🌐 Live Deployment

**Frontend (Vercel):**  
https://mpl-eta.vercel.app/

**Backend (Render):**  
https://mpl-backend-0km9.onrender.com

---

# 🚀 Project Overview

MPL was built to digitize the registration and auction process of a cricket tournament.

The system includes:

- Player registration form
- Player list display
- Image upload integration (Cloudinary)
- Backend API handling
- Database storage
- Full deployment setup

This project demonstrates full-stack integration and real-world event management application development.

---

# ✨ Core Features

## 📝 Player Registration
- Collects player details
- Form validation
- Image upload support
- Data stored in backend database

## 📸 Cloudinary Integration
- Secure image upload
- Cloud storage configuration
- Optimized media handling

## 📋 Player List Display
- Fetches players from backend
- Displays registered participants
- Dynamic rendering using React

## 🛠 Admin/Organizer Utility
- View all registered players
- Manage auction-ready participants
- Centralized registration data

---

# 🏗 System Architecture

```
User (Browser)
      ↓
React Frontend (Vercel)
      ↓ HTTP API (Axios)
Express Backend (Render)
      ↓
MongoDB Database
      ↓
Cloudinary (Image Storage)
```

---

# 🧠 Tech Stack

## Frontend
- React
- Vite
- Axios
- CSS Styling
- Component-based architecture

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary SDK
- dotenv
- CORS

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

# 📂 Project Structure

```
MPL/
│
├── backend/
│   ├── models/
│   ├── cloudinaryConfig.js
│   ├── index.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── RegistrationForm.jsx
    │   ├── PlayerList.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── CSS files
    └── package.json
```

---

# 🔄 Application Flow

1. User fills registration form
2. Image is uploaded to Cloudinary
3. Form data sent to backend API
4. Backend stores data in MongoDB
5. Player list page fetches stored players
6. Registered participants are displayed

---

# ⚙ Environment Variables

## Backend (.env)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Frontend (.env)

```
VITE_API_URL=https://mpl-backend-0km9.onrender.com
```

---

# 🚀 Local Development

## Clone Repository

```
git clone https://github.com/SiryanshTyagi/MPL.git
cd MPL
```

## Backend Setup

```
cd backend
npm install
npm run dev
```

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

# 📈 Future Enhancements

- Admin authentication system
- Auction bidding module
- Real-time bidding using WebSockets
- Team creation & management
- Player filtering & search
- Payment integration
- Role-based access control

---

# 🎯 What This Project Demonstrates

- Full-stack development
- Form handling & validation
- File upload integration (Cloudinary)
- REST API design
- Database schema management
- Monorepo architecture
- Production deployment (Vercel + Render)
- Real-world event management solution

---

# 👨‍💻 Author

Siryansh Tyagi  
Full Stack Developer  

GitHub: https://github.com/SiryanshTyagi   
LinkedIn: https://www.linkedin.com/in/siryansh-tyagi-157b282ab/

---

