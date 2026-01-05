# Himalayan Wheels Web App - Setup & Flow Guide

## 🚀 Quick Start - Terminal Commands

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### 3. Start Backend (in separate terminal)
```bash
cd backend
npm install
node index.js
```

The backend should run on: **http://localhost:5000**

---

## 📁 Folder Structure Overview

Your project now follows your teacher's recommended structure:

```
frontend/src/
├── pages/
│   ├── public/           # Public routes (Auth pages)
│   │   ├── Login.jsx     # Wrapper for LoginForm
│   │   └── Register.jsx  # Wrapper for SignupForm
│   ├── private/          # Protected routes (need authentication)
│   │   ├── Product.jsx   # Dashboard/Products page
│   │   └── Feedback.jsx  # Feedback form page
│   └── Auth/             # Auth component implementations
│       ├── Login.jsx     # Old inline-styled version (kept for reference)
│       ├── LoginForm.jsx # NEW: react-hook-form + zod version
│       ├── Signup.jsx    # Old inline-styled version (kept for reference)
│       └── SignupForm.jsx # NEW: react-hook-form + zod version
├── routes/               # Route protection logic
│   ├── privateRoute.jsx  # Guards private routes
│   └── publicRoute.jsx   # Guards public routes
├── context/              # State management
│   └── AuthContext.jsx   # Authentication context
├── services/             # API calls
│   └── api.js            # Axios setup with interceptors
├── components/           # Reusable components
│   └── Navbar.jsx        # Top navigation with logout
├── css/                  # Custom styles (future)
├── assets/               # Images, icons
├── App.jsx               # Main app with routing & lazy loading
├── main.jsx              # Entry point with Bootstrap import
└── index.css             # Global styles
```

---

## 🎯 How Everything Works Together

### **1. Authentication Flow (AuthContext + Login Form)**

When a user logs in:
1. User enters email/password → `LoginForm.jsx` validates with **Zod**
2. Valid data → API call to `POST /api/auth/login` (backend)
3. Backend returns `{ token, user }` 
4. `AuthContext.login()` saves token + user to localStorage
5. `useAuth()` hook updates global auth state
6. `PublicRoute` component detects user is logged in → redirects to `/dashboard`
7. Navbar appears showing user name + logout button

### **2. Route Protection (Private vs Public Routes)**

- **PublicRoute**: Only allows unauthenticated users. Logged-in users redirected to `/dashboard`
- **PrivateRoute**: Only allows authenticated users. Unauthenticated users redirected to `/login`
- **PrivateLayout**: Wraps private routes and displays Navbar

### **3. Lazy Loading**

Routes are loaded on-demand:
- `LoginForm`, `SignupForm`, `Product`, `Feedback` are only loaded when user navigates to them
- Loading spinner shown during page load

### **4. Form Validation (react-hook-form + Zod)**

Both `LoginForm` and `SignupForm` use:
- **Zod schemas** for validation rules (email, password length, phone format, etc.)
- **react-hook-form** for efficient form state + error handling
- Real-time validation feedback in the UI
- No manual state management for form data

---

## 📚 Key Technologies & Concepts

| Technology | Purpose | Files |
|-----------|---------|-------|
| **React Router** | Navigation & route protection | App.jsx, routes/* |
| **React Context API** | Global auth state | AuthContext.jsx |
| **react-hook-form** | Form state & validation | LoginForm.jsx, SignupForm.jsx |
| **Zod** | Schema validation | LoginForm.jsx, SignupForm.jsx |
| **Bootstrap** | CSS framework & components | imported in main.jsx, used in all components |
| **Axios** | HTTP requests | services/api.js |
| **React.lazy + Suspense** | Code splitting & lazy loading | App.jsx |

---

## 🔐 Data Flow Example: User Login

```
User Types Email/Password
        ↓
LoginForm Component
        ↓
Zod Schema Validates
        ↓
Valid? → API Call (authAPI.login)
        ↓
Backend Returns { token, user }
        ↓
AuthContext.login() → Save to localStorage
        ↓
useAuth() State Updates
        ↓
PublicRoute Detects Auth State → Redirect to /dashboard
        ↓
PrivateLayout + Navbar + Product Component Loaded
        ↓
User Sees Dashboard with Navbar (Logout Button Available)
```

---

## 💡 Understanding Key Files

### **AuthContext.jsx** (State Management)
- Manages user login state globally
- `useAuth()` hook lets any component access: `{ user, login, signup, logout, loading }`
- Reads token from localStorage on app load

### **LoginForm.jsx** (Form with Validation)
```jsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema) // Auto-validate with Zod
});
```
- `register` → bind inputs to form state
- `handleSubmit` → handle form submission
- `errors` → display validation errors

### **Navbar.jsx** (Protected Header)
- Only shows when `user` exists
- Displays user name + logout button
- Logout clears localStorage + redirects to /login

### **App.jsx** (Routing & Lazy Loading)
- `React.lazy()` splits code → smaller bundles
- `Suspense` shows loading spinner while page loads
- `PrivateLayout` wraps protected routes + Navbar

---

## ✅ Testing the App

1. **Start frontend**: `npm run dev`
2. **Start backend**: `node backend/index.js` (in another terminal)
3. **Visit**: http://localhost:5173
4. **Test path**:
   - Try to access `/dashboard` without logging in → redirected to `/login`
   - Enter invalid email → validation error shows
   - Fill valid form → click "Sign In" → if backend is running, should log in
   - After login → Navbar appears with logout button
   - Click logout → redirected to /login

---

## 🛠️ Future Enhancements

- [ ] Add password reset flow
- [ ] Implement real vehicle API integration in Product.jsx
- [ ] Add user profile page
- [ ] Implement search/filter for vehicles
- [ ] Add booking management
- [ ] Unit tests with Jest/React Testing Library
- [ ] E2E tests with Cypress

---

## 📖 Concepts Summary

| Concept | What It Does |
|---------|-------------|
| **Routing** | Navigate between pages without full refresh |
| **Protected Routes** | Only authenticated users can see certain pages |
| **Context API** | Share data (user state) across entire app without prop drilling |
| **Form Validation** | Check user input before sending to backend |
| **Lazy Loading** | Load pages only when user needs them (faster initial load) |
| **Interceptors** | Auto-add auth token to every API request |
| **Bootstrap** | Pre-built UI components & responsive design |

---

Good luck! 🚀
