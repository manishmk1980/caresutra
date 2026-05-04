# CareSutra - Customer Relationship Management

CareSutra is a modern web application for managing customer activities, leads, and follow-ups. Built with Next.js 14, Prisma, MySQL, and Tailwind CSS.

## Features

- **Customer Activity Management**: Track customer interactions, service interests, and follow-ups
- **Admin Dashboard**: Real-time statistics and activity tracking
- **Responsive Design**: Works on desktop and mobile devices
- **Database Integration**: MySQL with Prisma ORM for reliable data storage
- **Form Validation**: Zod validation for robust data integrity
- **RESTful API**: Fully functional backend API for customer activities

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **Validation**: Zod
- **Deployment**: Vercel (recommended)

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- MySQL database (local or remote)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` file with your MySQL connection string:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/caresutra_db"
```

### 3. Set Up Database

Generate Prisma client and push schema to database:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access Admin Dashboard

Navigate to [http://localhost:3000/admin/activity](http://localhost:3000/admin/activity) to access the customer activity management dashboard.

## Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Git Sync Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Implement CareSutra logo, backend, database and admin activity tracking"

# Push to remote repository
git push origin main
```

## Deployment Notes

- The application is configured for deployment on Vercel
- Ensure environment variables are set in your deployment platform
- Run `npx prisma generate` during build process
- Database migrations should be applied before deployment

## Project Structure

```
caresutra-app/
├── app/                    # Next.js app router pages
│   ├── admin/activity/    # Admin dashboard page
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── layout/           # Header, Footer
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Database client
│   └── validations/      # Zod schemas
├── prisma/               # Database schema
└── public/               # Static assets
```

## Database Schema

The main `CustomerActivity` model includes:
- Customer name, mobile, email, city
- Service interest, customer type, lead source
- Current status, follow-up date, notes
- Assigned to, created/updated timestamps

## Customer Records (Phase 1)

- New API: `GET/POST /api/customer-records` (admin session required)
- Upload API: `POST /api/customer-records/upload` (admin session required)
- Uploaded images are saved under `public/uploads/customers`
- Supported image formats: `jpg`, `jpeg`, `png`, `webp`
- Max upload size: `2MB`
- Admin authentication uses httpOnly cookie session (`caresutra_admin_session`)

### Prisma update

When schema changes are made for customer records:

```bash
npx prisma generate
npx prisma db push
```

## License

Proprietary - All rights reserved.
