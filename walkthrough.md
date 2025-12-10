# Professional Real Estate MERN Stack Application - Implementation Walkthrough

## 1. Planned File Structure

```text
root/
├── .gitignore
├── .env.example
├── README.md
├── walkthrough.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Inquiry.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   └── inquiryRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   └── inquiryController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── utils/
│   │   └── googleClient.js
│   └── tests/
│       └── properties.test.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── axiosInstance.js
        ├── store/
        │   ├── index.js
        │   ├── authSlice.js
        │   └── apiSlice.js
        ├── components/
        │   ├── common/
        │   │   ├── Button.jsx
        │   │   ├── Input.jsx
        │   │   └── Layout.jsx
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   └── Footer.jsx
        │   ├── properties/
        │   │   ├── PropertyCard.jsx
        │   │   └── PropertyFilters.jsx
        │   └── auth/
        │       ├── GoogleLoginBtn.jsx
        │       └── RequireAuth.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Properties.jsx
        │   ├── PropertyDetail.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   └── AdminDashboard.jsx
        ├── styles/
        │   ├── index.css
        │   └── animations.js
        └── utils/
            └── formatDate.js
```

## 2. Exact Terminal Commands
*These commands are prepared for execution upon approval.*

### Initial Setup and Folders
```powershell
# Create directories
mkdir backend
mkdir frontend

# Root files
New-Item -Path .gitignore -ItemType File
New-Item -Path .env.example -ItemType File
New-Item -Path README.md -ItemType File
```

### Backend Initialization
```powershell
cd backend
npm init -y

# Install Core Dependencies
npm install express mongoose dotenv cors cookie-parser jsonwebtoken google-auth-library cloudinary multer helmet morgan

# Install Dev Dependencies
npm install --save-dev nodemon jest supertest cross-env
cd ..
```

### Frontend Initialization
```powershell
# Create Vite React App
npm create vite@latest frontend -- --template react

cd frontend
npm install

# Install Core Dependencies
npm install react-router-dom @reduxjs/toolkit react-redux axios lucide-react framer-motion clsx tailwind-merge

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Testing Dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom vitest playwright
cd ..
```

## 3. Sequence of Development Steps

### Phase 1: Foundation & Configuration
1.  **Environment Setup**: Create `.env` files for both frontend and backend with strict variable checks.
2.  **Backend Config**: Setup Express server, MongoDB connection, and Cloudinary configuration.
3.  **Frontend Config**: Configure Tailwind with "Premium Navy & Gold" theme. Setup Redux store foundation.

### Phase 2: Backend Core Implementation
4.  **Models & Schema**: Define strict schemas for `User`, `Property`, and `Inquiry` with validation.
5.  **Authentication Module**: Implement Register, Login, Logout, and JWT Refresh Token logic.
6.  **Google OAuth Backend**: Create the controller to verify Google ID Tokens and create/manage users.
7.  **Middleware**: Implement JWT protection, Role-based access control (RBAC), and global error handling.

### Phase 3: Premium UI System (Frontend)
8.  **Design Tokens**: Define the color palette in `tailwind.config.js`:
    *   Primary: Deep Navy (`#0B1120`, `#1E293B`)
    *   Accent: Gold (`#D4AF37`, `#F59E0B`)
    *   Typography: Modern Sans-Serif (Inter/Outfit)
9.  **Layouts**: Build the main `Layout` component with a responsive navigation bar and footer using the premium styling.
10. **Shared Components**: Create reusable UI atoms (Buttons, Inputs, Cards) with `framer-motion` definitions/animations.

### Phase 4: Feature Implementation
11. **Frontend Auth**: Implement Login/Register pages. Integrate **Google Identity Services SDK** for the "Continue with Google" button.
12. **Property Management (Backend)**: CRUD routes for Properties (filtering, pagination, sorting). Image upload via Multer+Cloudinary.
13. **Property Listing (Frontend)**: Properties page with sticky sidebar filters, grid layout, and premium `PropertyCard` components.
14. **Detail Views**: Single property view with hero images, agent contact forms, and map placeholders.
15. **Dashboards**: Separate views for User (Wishlist), Agent (Manage Props), and Admin (Approvals).

### Phase 5: Testing & Quality Assurance
16. **Backend Tests**: Write Jest tests for `GET /api/properties` to ensure data integrity.
17. **Frontend Tests**: Write RTL tests for `PropertyCard` rendering.
18. **E2E Tests**: Setup Playwright/Cypress for a Critical User Journey (Search -> View -> Detail).

## 4. Google OAuth Strategy

### Frontend (`GoogleLoginBtn.jsx`)
*   **Library**: Load `https://accounts.google.com/gsi/client` script.
*   **Initialization**:
    ```javascript
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse
    });
    ```
*   **Rendering**: Render the button in the login form.
*   **Callback**: `handleGoogleResponse` receives the JWT credential from Google, passing it to `redux` action -> `POST /api/auth/google`.

### Backend (`authController.js`)
*   **Library**: `google-auth-library`.
*   **Logic**:
    1.  Receive `credential` (token) from frontend.
    2.  Verify token using `client.verifyIdToken()`.
    3.  Extract `email`, `name`, `picture`, `sub` (googleId).
    4.  Check if `User` exists by `email` or `googleId`.
    5.  **If New**: Create user with `role: 'user'` and random password.
    6.  **If Exists**: Update avatar if needed.
    7.  Generate Access & Refresh JWTs and return to client via HttpOnly cookies (refresh) and JSON (access).

## 5. Premium UI Tokens (Tailwind Config)

We will enforce the premium look via `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      navy: {
        900: '#0a192f', // Deepest background
        800: '#112240', // Card background
        700: '#233554', // Border/Hover
      },
      gold: {
        400: '#d4af37', // Primary Accent
        500: '#c5a028', // Hover Accent
      },
      cream: '#e6f1ff', // Text Primary
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Playfair Display', 'serif'], // For Headings
    }
  }
}
```

---
**Status:** Plan Ready. Waiting for "APPROVED — CONTINUE".
