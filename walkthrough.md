# Seller / Agent Dashboard Execution Plan

## 1. Development Plan & Strategy

This plan focuses strictly on the **Seller/Agent** workflows. We will implement the backend logic to support property management, ownership validation, and status transitions (draft -> pending). The frontend will be a premium, animated experience using Framer Motion.

### Phase 1: Backend Foundation
1.  **Schema Updates**: Update `User` (roles) and `Property` (status fields, admin notes, stats).
2.  **Middleware**: Ensure strict ownership validation and "agent" role checking.
3.  **Controllers**: Implement complete CRUD, publishing logic, and image handling.
4.  **Routes**: Secure endpoints with auth and role middleware.

### Phase 2: Frontend Core & State
1.  **Dependencies**: Install `framer-motion`, `react-dropzone` (for image upload).
2.  **API Slice**: Create `propertiesApiSlice` with RTK Query for caching and invalidation.
3.  **Components**: Build reusable, animated atomic components (cards, inputs, uploader).

### Phase 3: Dashboard & workflows
1.  **Layout**: Create the Seller layout with animated transitions.
2.  **Pages**: Implement Dashboard (stats/list), Add Property (wizard/form), Edit Property.
3.  **Polish**: Add Toast notifications, loading skeletons, and micro-interactions.

---

## 2. File Structure & modifications

### Backend
```text
/backend
├── controllers
│   ├── propertyController.js       # [MODIFY] Add agent CRUD, stats, publish
│   └── authController.js           # [MODIFY] Add upgrade-agent
├── middleware
│   └── authMiddleware.js           # [No Change] (Already has protect/authorize)
├── models
│   ├── Property.js                 # [MODIFY] Add approvalStatus, isDraft, views, inquiries
│   └── User.js                     # [MODIFY] Ensure role enum includes 'agent'
└── routes
    ├── propertyRoutes.js           # [MODIFY] Bind new controller methods
    └── authRoutes.js               # [MODIFY] Add /upgrade-agent
```

### Frontend
```text
/frontend/src
├── api
│   └── propertiesApiSlice.js       # [NEW] RTK Query endpoints
├── components
│   ├── Seller
│   │   ├── PropertyForm.jsx        # [NEW] Reusable form with validation
│   │   ├── PropertyCard.jsx        # [NEW] Animated card with actions
│   │   └── StatsCard.jsx           # [NEW] Animated stat display
│   └── ui
│       ├── AnimatedPage.jsx        # [NEW] Framer Motion wrapper
│       ├── AnimatedGrid.jsx        # [NEW] Staggered grid container
│       └── ImageUploader.jsx       # [NEW] Drag & drop with preview
├── pages
│   ├── SellerDashboard.jsx         # [NEW] Main hub
│   ├── AddProperty.jsx             # [NEW] Creation flow
│   └── EditProperty.jsx            # [NEW] Update flow
└── App.jsx                         # [MODIFY] Add seller routes
```

---

## 3. Terminal Commands

I will run these commands in order.

```bash
# Backend Dependencies (assumes basic setup exists)
npm install cloudinary multer streamifier --prefix backend

# Frontend Dependencies
npm install framer-motion react-dropzone --prefix frontend

# Verify directory structure
mkdir -p frontend/src/components/Seller
mkdir -p frontend/src/components/ui
```

---

## 4. API Specifications

### Data Models

**Property Schema Extensions**:
```javascript
{
  agentId: { type: ObjectId, ref: 'User', required: true },
  approvalStatus: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' },
  isArchived: { type: Boolean, default: false },
  adminNote: { type: String }, // For rejection reasons
  stats: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 }
  }
}
```

### Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/upgrade-agent` | Private | Upgrades current user to 'agent' role |
| **GET** | `/api/properties/agent/my-listings` | Agent | Get all properties owned by current user |
| **GET** | `/api/properties/:id/stats` | Agent | Get detailed visual stats for a property |
| **POST** | `/api/properties` | Agent | Create a new property (starts as draft) |
| **PUT** | `/api/properties/:id` | Agent | Update property details |
| **DELETE** | `/api/properties/:id` | Agent | Soft delete or archive property |
| **POST** | `/api/properties/:id/publish` | Agent | Change status from `draft` -> `pending` |
| **POST** | `/api/upload` | Agent | Upload single/multiple images to Cloudinary |

---

## 5. Animation Strategy (Framer Motion)

All animations will check for `prefers-reduced-motion`.

### 1. Page Transitions (`AnimatedPage.jsx`)
*   **Initial**: `opacity: 0`, `x: 20`
*   **Animate**: `opacity: 1`, `x: 0`
*   **Exit**: `opacity: 0`, `x: -20`
*   **Transition**: `duration: 0.3`, `ease: "easeOut"`

### 2. Staggered Grids (`AnimatedGrid.jsx`)
*   **Container**: `staggerChildren: 0.05`
*   **Item**: `y: 20` -> `y: 0`, `opacity: 0` -> `opacity: 1`

### 3. Cards (`PropertyCard.jsx`)
*   **Hover**: `y: -5`, `scale: 1.02`, `shadow: "0px 10px 20px rgba(0,0,0,0.1)"`
*   **Tap**: `scale: 0.98`
*   **Mount**: Spring animation pop-in

### 4. Image Uploader
*   **Drag Over**: Pulse animation on dropzone border.
*   **Upload Success**: Checkmark animation using `pathLength`.
*   **Reorder**: `layout` prop for smooth reordering of image thumbnails.

---

## 6. Admin Integration & State Transitions

This system sets up the data for the Admin team but does not perform Admin actions.

**Status Flow**:
1.  **Draft**: Created by Agent. Visible only to Agent.
2.  **Pending**: Agent clicks "Publish". Visible to Agent (waiting) and Admin (inbox).
3.  **Approved** (Future): Admin action. Visible on public site.
4.  **Rejected** (Future): Admin action with `adminNote`. Agent can edit and resubmit (back to `pending`).

**Database Hooks**:
*   `publish` endpoint sets `approvalStatus = 'pending'`, `adminNote = null`.
*   `update` endpoint (if rejected) resets `approvalStatus = 'draft'` (optional workflow, or keeps as is until re-published).

---

## 7. Execution Checklist

### Backend
- [ ] Install dependencies
- [ ] Update `Property.js` schema
- [ ] Create `propertyController.js` (Agent methods)
- [ ] Create `propertyRoutes.js` (Agent routes)
- [ ] Update `authController.js` (Upgrade)
- [ ] Create `utils/cloudinary.js` (Config)

### Frontend
- [ ] Install dependencies
- [ ] Create `propertiesApiSlice.js`
- [ ] Create UI components (`AnimatedPage`, `AnimatedGrid`, `ImageUploader`)
- [ ] Create Seller Components (`PropertyForm`, `PropertyCard`, `StatsCard`)
- [ ] Create Pages (`SellerDashboard`, `AddProperty`, `EditProperty`)
- [ ] Route configuration in `App.jsx`

### Verification
- [ ] Test "Upgrade to Agent" flow
- [ ] Test Create Property -> Verify Draft status
- [ ] Test Image Upload -> Verify Cloudinary URL
- [ ] Test Publish -> Verify Pending status
- [ ] Check Animations on route change and hover
