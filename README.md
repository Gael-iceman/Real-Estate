# Real Estate Platform

A full‑stack real estate listing platform with an admin dashboard for managing properties, images, and agents. The project is split into a React client and an Express + MySQL API server.

## Project Structure

- `real-estate-site/` — React client
- `real-estate-server/` — Express API + MySQL

## Features

- Browse and search listings by city, price, and deal type
- Admin dashboard to create and manage properties
- Image gallery uploads with primary image selection
- Favorites (like/unlike) for logged‑in users
- SEO city counts endpoint

## Tech Stack

- Frontend: React, Redux, Bootstrap
- Backend: Node.js, Express, MySQL
- Auth: JWT (httpOnly cookie)
- Media: Multer uploads

## Requirements

- Node.js (LTS recommended)
- MySQL 8+

## Quick Start

### 1) API Server

```powershell
cd real-estate-server
npm install
```

Create your `.env` from `.env.example` and update values:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=real_estate
JWT_SECRET=replace_me
PUBLIC_BASE_URL=http://localhost:4000
IMAGE_UPLOAD_MAX_MB=20
```

Initialize the database using:

```sql
-- in MySQL
CREATE DATABASE IF NOT EXISTS real_estate;
```

Run the server:

```powershell
npm run dev
```

### 2) Client

```powershell
cd ..\real-estate-site
npm install
```

Create `.env`:

```env
REACT_APP_API_URL=http://localhost:4000
```

Start the client:

```powershell
npm start
```

## Environment Notes

- Image upload size is controlled by `IMAGE_UPLOAD_MAX_MB` in `real-estate-server/.env`.
- All `.env` files are ignored by Git by default.

## Common Tasks

### Clear all data but keep tables

```sql
USE real_estate;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE property_user_likes;
TRUNCATE TABLE property_images;
TRUNCATE TABLE property_extras;
TRUNCATE TABLE properties;
TRUNCATE TABLE users;
TRUNCATE TABLE features;
TRUNCATE TABLE agencies;
SET FOREIGN_KEY_CHECKS = 1;
```

### Drop first/last name columns

```sql
ALTER TABLE users
  DROP COLUMN first_name,
  DROP COLUMN last_name;
```

## Deployment Notes (Demo)

For quick demos, deploy the API and MySQL on a free platform that allows sleeping/expiry (e.g., Render/Railway trial) and host the client on a static host (Netlify/Vercel). Update `REACT_APP_API_URL` to the hosted API URL.

## Scripts

### Server (`real-estate-server/`)

- `npm run dev` — run API with nodemon

### Client (`real-estate-site/`)

- `npm start` — run React dev server
- `npm run build` — production build

## License

Private project — all rights reserved.
