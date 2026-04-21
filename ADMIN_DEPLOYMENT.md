# Admin Panel Production Deployment Checklist

## Required Environment Variables

Set these in your deployment platform (Vercel, Render, Railway, etc.):

- `NEXTAUTH_URL`: Public app URL
- `NEXTAUTH_SECRET`: Strong random secret
- `MONGODB_URI`: Production MongoDB URI
- `MONGODB_DB`: Database name, e.g. `foodhub`
- `ADMIN_EMAILS`: Comma-separated admin emails (server-side authority)

Optional:

- `NEXT_PUBLIC_ADMIN_EMAILS`: For admin settings UI display only
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `EMAIL_USER`, `EMAIL_PASS`

## Security Expectations

- All `admin` pages are protected by middleware.
- All `/api/admin/*` routes require authenticated admin users.
- Admin checks are done server-side via `ADMIN_EMAILS`.
- CRUD admin APIs validate MongoDB ObjectId format.

## Admin Features Implemented

- Dashboard with users/restaurants/bookings/offers/revenue stats
- Booking management (search/filter/delete)
- User management (activate/deactivate/delete)
- Restaurant management (create/edit/delete)
- Offer management (create/edit/delete)
- Analytics page with key platform metrics
- Settings page with deployment checklist and admin email visibility

## Pre-Deploy Validation

Run:

```bash
npm run lint
npm run build
```

## Git Commands

```bash
git add .
git commit -m "feat(admin): production-ready admin dashboard and secured admin APIs"
git push origin <your-branch>
```
