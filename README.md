# TaskFlow — Full-Stack College Project: Task Management Application

A modern, clean, and responsive full-stack **Task Management Application** built for academic project evaluations, viva presentations, and real-world task tracking.

Built with **React, Node.js, Express, MongoDB (Mongoose ODM), JWT Authentication, and Tailwind CSS**.

---

## 🚀 Project Overview

TaskFlow is a production-ready, full-stack productivity web application designed to help students and professionals organize, schedule, and track tasks. It features strict user-level data isolation where every registered user can only access and manage their own tasks.

### Key Highlights
- **100% Full-Stack**: Node.js & Express REST API on the backend with React 19 on the frontend.
- **Zero-Setup Resilience**: Includes authentic Mongoose schemas for MongoDB Atlas/local instances, with an automatic embedded persistence fallback so it runs out-of-the-box anywhere without configuration blockers.
- **Security-First**: Passwords hashed with `bcryptjs` (10 rounds), protected API routes using `jsonwebtoken` (JWT) Bearer tokens, and input sanitization.
- **Academic Project Ready**: Comprehensive documentation, clean modular code structure, and zero hardcoded secrets.

---

## 🌟 Features Breakdown

### 1. Authentication & Security
- **User Registration**: Clean sign-up form with input validation (name, valid email, min 6-character password).
- **User Login**: Secure authentication validating credentials against bcrypt hashes.
- **JWT Session Management**: Issues signed JSON Web Tokens stored securely in the client with automatic `Authorization: Bearer` injection.
- **Protected Endpoints**: Express middleware verifying tokens before allowing access to user data.
- **User Data Isolation**: Queries are indexed and scoped strictly to `req.user.id`.
- **1-Click Demo Login**: Pre-configured demo student profile for instant evaluation during viva presentations.

### 2. Task Management (CRUD)
- **Create Task**: Set title, description, priority (`Low`, `Medium`, `High`), status (`Pending`, `In Progress`, `Completed`), and due date.
- **View Tasks**: Toggle between a **Card Grid** layout and a structured **Table View**.
- **Task Details Inspector**: Modal presenting timestamps, days remaining / overdue warnings, description, and status controls.
- **Edit Task**: Instant in-place editing of task parameters.
- **Delete Task**: Safe deletion flow with custom confirmation modal.
- **Quick Status Toggle**: Instantly switch statuses directly from cards or table rows.

### 3. Analytics & Dashboard
- **Live Metrics**: Total Tasks, Pending Tasks, In Progress Tasks, Completed Tasks, and Overdue Tasks.
- **Productivity Progress Bar**: Visual progress indicator calculating overall completion percentage.
- **Priority Distribution**: Real-time breakdown of Low, Medium, and High priority distribution.
- **Recent Deadlines**: Highlights latest tasks with quick status tags.

### 4. Search, Filtering & Sorting
- **Real-time Search**: Search tasks dynamically across both title and description.
- **Status Filter**: One-click pills for `All`, `Pending`, `In Progress`, and `Completed`.
- **Priority Filter**: Filter by `Low`, `Medium`, or `High`.
- **Sorting Options**: Sort by Due Date (soonest or furthest), Created Date (newest or oldest), Priority, or Title (A-Z).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + TypeScript | Modular, component-driven reactive user interface |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern design, mobile drawer, typography |
| **Backend** | Node.js + Express 4 | RESTful API server, routing, controllers, middleware |
| **Database** | MongoDB + Mongoose ODM | Document database for persistent storage (with local fallback) |
| **Auth & Security** | JWT (`jsonwebtoken`) + `bcryptjs` | Stateless token authentication & password encryption |
| **Bundler & Dev** | Vite + `tsx` | Fast compilation and unified single-port proxy |

---

## 📂 Project Directory Structure

```
├── server/                     # Backend Architecture (Node.js + Express)
│   ├── config/
│   │   └── db.ts               # MongoDB Mongoose connection & fallback handler
│   ├── controllers/
│   │   ├── authController.ts   # Register, Login, Me, Profile update logic
│   │   └── taskController.ts   # CRUD operations, stats aggregation, filters
│   ├── middleware/
│   │   └── auth.ts             # JWT Bearer token protection middleware
│   ├── models/
│   │   ├── User.ts             # Mongoose User Schema (name, email, password)
│   │   └── Task.ts             # Mongoose Task Schema (title, status, priority, user ref)
│   ├── routes/
│   │   ├── authRoutes.ts       # Authentication API routes
│   │   └── taskRoutes.ts       # Task management API routes
│   └── services/
│       └── dbService.ts        # Unified database abstraction layer
├── src/                        # Frontend Architecture (React 19 + TypeScript)
│   ├── components/
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── Navbar.tsx          # Top navigation, status indicator, quick actions
│   │   ├── ProgressBar.tsx     # Completion rate visualizer
│   │   ├── Sidebar.tsx         # Sidebar navigation & responsive mobile drawer
│   │   ├── StatCard.tsx        # KPI metric cards
│   │   ├── TaskCard.tsx        # Card presentation with badges & dropdowns
│   │   ├── TaskDetailsModal.tsx# Task inspection modal
│   │   ├── TaskModal.tsx       # Create/Edit task form modal
│   │   ├── TaskTableView.tsx   # Tabular task presentation
│   │   └── Toast.tsx           # Floating toast notification system
│   ├── context/
│   │   └── AuthContext.tsx     # Global auth state & session provider
│   ├── pages/
│   │   ├── DashboardPage.tsx   # Dashboard metrics, progress, and recent tasks
│   │   ├── LoginPage.tsx       # Sign in page with 1-Click Demo login
│   │   ├── ProfilePage.tsx     # Profile settings & database status
│   │   ├── RegisterPage.tsx    # Sign up page with validation
│   │   └── TasksPage.tsx       # Task management with search, filter, and views
│   ├── services/
│   │   └── api.ts              # Central API client with JWT interceptor
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & types
│   ├── App.tsx                 # Master view coordinator & modal controller
│   ├── index.css               # Tailwind CSS entry point
│   └── main.tsx                # React DOM entry point
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore definitions
├── index.html                  # HTML entry point
├── metadata.json               # Application metadata
├── package.json                # Dependencies and full-stack scripts
├── server.ts                   # Root Express server & Vite middleware
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite configuration
```

---

## ⚙️ Installation & Running the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (version 9 or higher)
- (Optional) [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster.

### Step 1: Clone or Download the Project
```bash
git clone https://github.com/your-username/task-management-project.git
cd task-management-project
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```

Review your `.env` settings:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here_change_for_production
JWT_EXPIRES_IN=7d

# Option A: To use real MongoDB (Local or MongoDB Atlas)
# MONGODB_URI=mongodb://localhost:27017/taskflow_db
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow_db?retryWrites=true&w=majority

# Option B: Leave MONGODB_URI empty or comment it out to use the built-in persistent storage engine!
```

### Step 4: Run the Application
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```
Both the Express API server and the React frontend run simultaneously on port `3000`.

---

## 🍃 Connecting to MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in or create a free account.
2. Create a free shared cluster (M0 sandbox).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** > **Drivers** (Node.js) and copy the connection string.
6. Paste it into your `.env` file:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority"
   ```
7. Restart the server (`npm run dev`). The top navbar and profile page will display **"MongoDB Atlas (Connected)"** in green!

---

## 📡 REST API Reference

All protected endpoints require the HTTP header:
`Authorization: Bearer <your_jwt_token>`

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Protected | Get currently logged-in user profile & DB status |
| `PUT` | `/api/auth/profile` | Protected | Update profile information or change password |
| `POST` | `/api/auth/logout` | Public | Client token invalidation acknowledgement |

### Task Endpoints (`/api/tasks`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks/stats` | Protected | Get dashboard metrics (totals, counts, overdue, completion rate) |
| `GET` | `/api/tasks` | Protected | Get all tasks with query params (`search`, `status`, `priority`, `sortBy`) |
| `POST` | `/api/tasks` | Protected | Create a new task (`title`, `description`, `priority`, `status`, `dueDate`) |
| `GET` | `/api/tasks/:id` | Protected | Get a single task by ID |
| `PUT` | `/api/tasks/:id` | Protected | Update task fields |
| `DELETE` | `/api/tasks/:id` | Protected | Delete task permanently |

---

## 🧪 How to Test Every Feature

1. **Test Registration & Validation**:
   - Click "Sign Up".
   - Try submitting with empty fields or a password shorter than 6 characters to see validation errors.
   - Register a new account. You will be automatically redirected to the dashboard.
2. **Test 1-Click Demo Login**:
   - Log out, then click **"1-Click Demo Student Login"** on the sign-in card.
3. **Test Task Creation**:
   - Click **"Add Task"** in the top navbar or sidebar.
   - Enter title, description, select priority (`High`), status (`Pending`), and due date.
   - Click "Create Task". You'll receive a success toast and see the metrics update immediately.
4. **Test Search & Filtering**:
   - Navigate to **"All Tasks"**.
   - Type in the search box to filter tasks by keyword.
   - Click the status pills (`Pending`, `In Progress`, `Completed`) to filter by status.
   - Change the priority dropdown to filter by `High`, `Medium`, or `Low`.
   - Click "Reset Filters" to restore full view.
5. **Test View Mode Switcher**:
   - Toggle between **Grid View** (cards) and **Table View** using the layout buttons.
6. **Test Task Details & Quick Status**:
   - Click on any task card to open the Details Modal.
   - Use the status dropdown on the card to switch it to "Completed". Observe the progress bar and completion rate update automatically!
7. **Test Edit & Delete**:
   - Click the pencil icon to edit task details.
   - Click the trash icon to open the confirmation modal and confirm deletion.
8. **Test Profile & Password Change**:
   - Click **"Profile & Database"** in the sidebar.
   - Update your name or change your password.
   - Check the Database Status card showing connection state.

---

## 📦 How to Download/Export from AI Studio

1. In Google AI Studio Build, look at the top-right toolbar.
2. Click the **Settings (gear)** or **Download/Export** icon.
3. Choose **"Export as ZIP"** to download the complete codebase to your computer.
4. Unzip the downloaded file on your computer and open it in VS Code or your preferred IDE.

---

## 🐙 How to Upload to GitHub

Follow these steps to upload the project to your GitHub repository:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Verify git status (.env and node_modules must be ignored)
git status

# 3. Add all project files
git add .

# 4. Commit your initial release
git commit -m "Initial commit: Complete Full-Stack Task Management Application (MERN)"

# 5. Create a new repository on GitHub (e.g. 'task-management-app')
# 6. Link your local repo to GitHub
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 7. Push the code to GitHub
git push -u origin main
```

---

## 🎓 College Viva & Evaluation Talking Points

When presenting this project to your professor or evaluators:
1. **Model-Controller-Route Separation**: Explain how backend files in `server/` separate responsibilities (`routes` define URI endpoints, `middleware` validates tokens, `controllers` handle business logic, and `models` define Mongoose schemas).
2. **Stateless JWT Flow**: Explain why tokens are passed in the `Authorization: Bearer` header, allowing scalable server operation without session memory overhead.
3. **Database Security**: Mention that passwords are never stored in plaintext and are salted with `bcrypt` (10 rounds). Also highlight that tasks are filtered by `req.user.id` so users cannot tamper with other students' data.
4. **Responsive UX**: Demonstrate the mobile drawer, toast feedback notifications, and grid/table toggle.
