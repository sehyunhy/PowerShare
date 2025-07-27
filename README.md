# ⚡ PowerShare - Community-Based P2P Energy Sharing Platform

**PowerShare** is a full-stack web application that enables **P2P energy sharing** within a community. It connects energy producers (e.g., solar panels, wind turbines, battery storage) with consumers, facilitating real-time energy trading and distribution.

![PowerShare Image 1](https://github.com/user-attachments/assets/5e83b453-8ae9-4e0d-87fd-8022d0a79edf)
![PowerShare Image 2](https://github.com/user-attachments/assets/e0928c24-9257-48d2-ba55-3816b688f662)

---

## 🏗 System Architecture

### Frontend Architecture
- **Framework**: React 18 (TypeScript-based)
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (server state management)
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Real-time Updates**: WebSocket client
- **Design**: Mobile-first responsive UI

### Backend Architecture
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript (ESM-based)
- **ORM**: Drizzle ORM (type-safe)
- **API**: RESTful JSON API
- **Real-time Communication**: WebSocket server

### Database Architecture
- **DB**: PostgreSQL (optimized for Neon serverless environment)
- **Schema Management**: Drizzle migrations
- **Connection Pooling**: Neon serverless pooling

---

## ⚙ Key Features

### 🔋 Energy Management System
- **Energy Providers**: Solar panels, wind turbines, battery storage
- **Energy Requests**: Consumer requests with urgency settings
- **Energy Transactions**: Full transaction lifecycle tracking
- **Real-time Monitoring**: Visualization of energy production/consumption

### 👥 User Management
- **User Types**: Providers / Consumers / Hybrid
- **Profile Setup**: Location-based and preference-based configurations
- **Community Stats**: Display total energy usage and sharing metrics

### 🔄 Real-time Features
- **WebSocket Communication**: Real-time data transfer
- **Instant Notifications**: Requests, transaction matches, completions
- **Live Energy Flow Dashboard**: Real-time energy flow visualization

### 🧭 UI/UX Design
- **Mobile Navigation**: Bottom tab navigation structure
- **Energy Calendar**: Energy sharing and consumption scheduling
- **Interactive Map**: Geographic visualization of energy providers
- **Transaction History**: Access to recent transactions

---

## 🔁 Data Flow

### 📥 Energy Request Flow
1. Consumer submits an energy request (amount, urgency, price)
2. System broadcasts the request to all connected providers via WebSocket
3. Automatic matching based on location and availability
4. Transaction is created upon successful match
5. Real-time notifications are sent to relevant parties

### ⚡ Energy Data Updates
1. Providers manually or automatically update production data
2. Data is updated in the database and broadcasted to all connected clients via WebSocket
3. Frontend UI automatically refreshes with new data

### 🔄 Transaction Processing Flow
1. A match is found between provider and consumer
2. A transaction record is created
3. Energy is transferred and tracked
4. (Future implementation) Payment processing
5. Transaction completion and community stats update

---

## 🧩 External Dependencies

### 📦 Core Libraries
- `@neondatabase/serverless`: PostgreSQL serverless connection
- `drizzle-orm`: Type-safe ORM
- `@tanstack/react-query`: Server state management
- `@radix-ui/***`: Accessible UI components
- `tailwindcss`: Utility-first CSS framework
- `wouter`: Lightweight router

### 🛠 Development Tools
- `Vite`: Fast development server and bundler
- `TypeScript`: Static typing support
- `ESBuild`: High-speed bundling tool

### 🌐 Real-time Communication
- `ws`: WebSocket server for Node.js
- Native WebSocket API for browsers

---

## 🚀 Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement and fast refresh
- **TypeScript**: Real-time type checking
- **Drizzle**: Database schema migrations

### Production Environment
- **Client**: Static build using `Vite` → output in `dist/public`
- **Server**: Bundled using `ESBuild` → output in `dist/index.js`
- **DB**: Neon PostgreSQL serverless environment
- **Environment Variables**: Use `DATABASE_URL` for database connection

### Deployment Configuration
- Integrated client and server builds
- Static assets served from the `dist/public` directory
- API handled by Express under `/api/*` routes
- WebSocket connections managed under `/ws` route

---

## 📅 Changelog
- 2025.04 ~ 2025.07
