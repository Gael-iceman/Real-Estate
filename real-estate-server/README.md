# Real Estate Backend (MySQL + Express)

This backend matches the endpoints used by the React client in `real-estate-site`.
It uses MySQL for persistence and returns data in the shapes the frontend expects.

## What you need to do (your role)
- Install and run MySQL locally.
- Create a database and user (or reuse an existing one).
- Configure `.env` with your MySQL credentials.
- Run the schema setup and start the server.
- Later: point the frontend to this backend (see Integration).

## What I do (my role)
- Provide the backend code and database schema.
- Keep endpoint responses aligned with the frontend data shape.
- Help debug API or data issues as you integrate.
- Suggest improvements (security, performance, UX) when needed.

## Prerequisites
- Node.js (18+ recommended)
- MySQL 8.x

## Setup (local)
1) Install dependencies:

```bash
cd real-estate-server
npm install
```

2) Create your `.env` file (copy from `.env.example`):

```bash
copy .env.example .env
```

3) Update `.env` values for your MySQL instance.

4) Create tables and seed basic features:

```bash
npm run db:setup
```

5) Start the API server:

```bash
npm run dev
```

Server runs at `http://localhost:4000` by default.

## Integration with the React frontend
The frontend currently points at a Heroku URL inside action files. For local use you will need to:
- Update the base URL in each `src/actions/*.js` to `http://localhost:4000`, or
- (Recommended) refactor those files to read `process.env.REACT_APP_API_URL`.

Example env for frontend:

```bash
REACT_APP_API_URL=http://localhost:4000
```

## Database schema
Schema is in `sql/schema.sql` and seed data in `sql/seed.sql`.
You can re-run the setup any time with `npm run db:setup`.

## API endpoints (mapped to frontend actions)
- Auth
  - POST `/user/create`
  - POST `/user/login`
  - GET `/user/:id`
- properties
  - POST `/property`
  - GET `/property/all?offset=0&city=any&pricefrom=0&priceto=0&forrent=true&forsale=true`
  - GET `/property/:id`
  - GET `/property/myproperty`
  - GET `/property/:id/like`
  - GET `/property/favorites`
- features
  - GET `/feature/all`
  - POST `/feature/add/:propertyId`
  - DELETE `/feature/:featureId/remove/:propertyId`
- Images
  - POST `/image/upload/:propertyId`
  - DELETE `/image/:publicId/:propertyId/:imageId`
  - PUT `/image/primary/:propertyId/:imageId`
- Agencies
  - GET `/agency`
  - GET `/agency/findby?name=...`
  - GET `/agency/agent/:id?action=confirm|block|toggle`
- SEO
  - GET `/seo/count-cities`

## Notes
- File uploads are stored in `real-estate-server/uploads` and served via `/uploads/...`.
- JWT auth is required for any user-sensitive action (likes, my properties).
- If you want to deploy later, use a hosted MySQL provider and set `PUBLIC_BASE_URL`.
