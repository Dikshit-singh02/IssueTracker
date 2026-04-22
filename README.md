# Consumer Complaint Management System (CCMS) - PNGRB Compliant

## Features
- JWT Auth (User/Admin/Nodal Officer)
- Complaint Registration with QR Code, File Upload
- 4-Tier Escalation with Auto TAT Tracking
- Emergency SOS Complaints
- Razorpay Payments, Auto Compensation
- Email/SMS Notifications
- Admin Dashboard & Analytics
- Multi-language (EN/HI)
- Feedback System

## Tech Stack
**Backend:** Node.js/Express/MongoDB/JWT/Cloudinary/Razorpay/Cron
**Frontend:** React Router / Formik / Axios / Recharts / QRCode.react / i18next
## Quick Setup (Windows)

1. Clone/Download
```
git clone <repo> IssueTracker
cd IssueTracker
```

2. Install Dependencies
```
npm run install-all
```

3. Copy Env
```
copy .env.example backend\\.env
copy .env.example frontend\\.env
```
- Update `backend/.env`: Mongo URI, JWT secret, Cloudinary creds, Razorpay keys, Email/SMS

4. Start Dev Servers
```
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

5. MongoDB: Use Atlas or local (docker/mongod)

## API Docs
`/api/auth/register`, `/api/complaints`, `/api/dashboard/stats`

## Testing
- Register User/Admin/Nodal
- File complaint, scan QR, escalate, view dashboard

## Production Deploy
- Backend: Railway/Render + Mongo Atlas
- Frontend: Vercel/Netlify

**PNGRB Compliant: TAT 3/7/15/30 days per tier, auto-escalation > TAT.**

