# Luxury Real Estate MERN App

A premium real estate platform built with the MERN stack (MongoDB, Express, React, Node.js), featuring Google OAuth, Redux Toolkit, and Tailwind CSS.

## Features

- **Authentication**: JWT-based Email/Password & Google OAuth (using Google Identity Services).
- **Premium UI**: Deep Navy & Gold aesthetic with Framer Motion animations.
- **Property Management**: Agent upload, approval workflow (Admin), Image uploads (Cloudinary).
- **Inquiries**: Real-time messaging system between Users and Agents.
- **Dashboards**: Separate views for Users, Agents, and Admins.
- **Search & Filter**: Advanced filtering by price, location, type.

## Tech Stack

- **Frontend**: Vite + React, Redux Toolkit (RTK Query), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **DevOps**: Helper scripts for deployment.

## Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Cloudinary Account
- Google Cloud Console Project (for OAuth)

## Setup Instructions

### 1. Environment Variables

Create `.env` in `backend/` and `frontend/` (or root `.env` if configured). Use `.env.example` as a guide.

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/real_estate
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_REDIRECT_URI=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Installation

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

### 3. Google OAuth Setup

1. Go to Google Cloud Console.
2. Create a project.
3. Setup OAuth Consent Screen (External).
4. Create Credentials -> OAuth Client ID (Web Application).
5. Add Authorized Origins: `http://localhost:5173` and `http://localhost:5000`.
6. Copy Client ID to `.env`.

## Testing

**Backend Tests**
```bash
cd backend
npm test
```

**Frontend Tests**
```bash
cd frontend
npm test
```
