# 🌌 Odyssey — Enterprise Multi-Tenant SaaS Infrastructure

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![NextAuth](https://img.shields.io/badge/Next--Auth-Credentials-purple?style=for-the-badge&logo=nextauth)](https://next-auth.js.org/)

Odyssey is a high-visibility, enterprise-grade **Multi-Tenant Business & Infrastructure SaaS Platform** designed to manage secure workspace isolation, dynamic billing workflows, customized notification suites, and high-security account centers. Built with **Next.js 15+ (App Router)**, **MongoDB**, **Tailwind CSS**, and **Framer Motion**.

---

## ✨ Immersive Core Modules

### 1. 🛡️ Security Center & Password Cyber-Shield
- **Live Complexity Analyzer:** Shifting dynamically from `Unsecured` to a glowing purple **`Cyber-Shielded`** state as password requirements (8+ chars, numbers, capitals, symbols) are matched.
- **Active Devices Audit & Revocation:** Visualizes currently logged-in browser clients (OS, IP, geolocations). Tapping **Revoke Access** immediately terminates their security tokens with smooth slide-out transitions.

### 2. 🎨 Interactive Avatar Customizer
- **Visual Background Picker:** Repaint profile avatars in real-time with 4 distinct pre-defined gradient backdrops (`Odyssey Nebula`, `Emerald Cyber`, `Obsidian Dusk`, `Sunset Aura`).
- **Drag-and-Drop Uploader:** Fully interactive file dropzone with animated cloud-upload progress simulators (0% to 100%).

### 3. 🔊 Sound Notification & Integration Suite
- **Web Audio tone synthesis:** Uses browser-native Web Audio API (`AudioContext`) to synthesize alerts (*Success Chimes* or *Warning Beeps*) inside workspace settings.
- **Slack Event Dispatches:** Administrators can enter Slack webhooks, map event triggers (Member Joined, Security Alert), and test dispatches with async loader states.

### 4. 💬 Interactive Support & Help Center
- **Dynamic FAQ Search Engine:** Filters frequently asked questions instantly in real-time as users type.
- **Expert Consultation Slots Widget:** Tapping open time slots simulates live slot reservation with customized confirmation toasts.
- **Direct Ticket Console:** Users submit tickets to engineering with priority levels (including **Critical Production Down** alerts) that append to their logs in real-time.

### 👥 Secure Signups & Database Isolation
- **Automatic Workspace Provisioning:** Upon signup, the backend creates a separate `Tenant` document and slug, assigning the new user the **`owner`** role inside their secure, isolated workspace workspace.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | Next.js 15+ (App Router, Server Actions) |
| **Database** | MongoDB (with Mongoose connection pooling) |
| **Authentication** | NextAuth.js (v4 CredentialsProvider & JWT) |
| **Styling** | Tailwind CSS (with harmonious custom HSL color systems) |
| **Animations** | Framer Motion & CSS custom keyframes |
| **State/Caching** | Local state + global next-auth session synchronization |

---

## 📂 Project Architecture

```bash
├── app/
│   ├── (auth)/             # Login, Signup (with Workspace provisioning), Forgot Password
│   ├── (dashboard)/        # Dashboard ecosystem (Overview, Members, Billing, Settings, Support)
│   ├── (marketing)/        # Premium landing page with browser mockup & product guides
│   ├── api/
│   │   ├── auth/           # NextAuth handler & Signup endpoints
│   │   ├── profile/        # PATCH profile and secure password updates
│   │   ├── tenant/         # Workspace mapping and details API
│   │   └── invitations/    # RBAC workspace member invitation routing
├── components/
│   ├── dashboard/          # Sleek Sidebar & TopBar navigations
│   └── providers/          # Sound notification presets & NextAuth context hooks
├── lib/
│   ├── db/                 # Mongoose connector pool
│   ├── models/             # Schemas (User, Tenant, Invitation, AuditLog)
│   └── utils/              # slugify and styling helpers
└── types/                  # TypeScript interface bindings
```

---

## 🚀 Local Development Setup

To run Odyssey locally on your workstation, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas connection URI)

### 2. Clone Repository
```bash
git clone https://github.com/mamunaio/odyssey.git
cd odyssey
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables Configuration
Create a `.env.local` file in your root folder and set the following parameters:

```env
# MongoDB Database Connection
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/odyssey?retryWrites=true&w=majority"

# NextAuth Configurations
NEXTAUTH_SECRET="your_nextauth_secure_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 🔑 Test Accounts
For immediate login and testing, you can use the pre-seeded credentials:
* **Email:** `mamunahmed24.ma@gmail.com`
* **Password:** `123456789`

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
Designed and engineered with absolute visual excellence by **[mamunaio](https://github.com/mamunaio)** 🌌
