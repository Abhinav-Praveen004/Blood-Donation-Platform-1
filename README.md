<div align="center">
  
# 🩸 LifeLine: Blood Donation Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

*A premium full-stack platform designed to seamlessly connect life-saving blood donors with those in critical need.*

</div>

## ✨ Features

- **Dynamic Dashboard**: View active donor statistics, track liters of blood donated, and locate nearby upcoming donation drives.
- **Smart Donor Matching**: Automatically calculates and connects recipients with compatible blood donors, strictly adhering to medical universal blood type rules.
- **Eligibility Enforcement**: Implements a strict 90-day medical cooldown timeframe for donors to prioritize their health and safety.
- **Unified Portal**: A sleek, reactive UI that provides tabbed registration for both potential donors and patients requesting blood.

## 🚀 Tech Stack

- **Frontend**: React (Vite), React Router DOM, React-JSS (for premium object-oriented styling), and Lucide Icons.
- **Backend**: Node.js & Express API ecosystem.
- **Database**: Supabase (PostgreSQL), featuring JSONB integration for scalable, unstructured medical metadata.

---

## 🛠️ Local Installation & Setup

### 1. Database Initialization
1. Create a project on [Supabase](https://supabase.com).
2. Copy the contents of `supabase/schema.sql` into your Supabase SQL Editor and run it to construct your database automatically.

### 2. Backend Config
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```
Configure your environment variables by creating a `.env` file inside `backend/`:
```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
PORT=5000
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Config
In a new terminal, spin up the React application:
```bash
cd frontend
npm install
npm run dev
```
Click the link provided in your terminal (usually `localhost:5173`) to open the app!
