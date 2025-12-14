# Newsmania Backend Starter

**Tech stack:** Node.js, Express.js, PostgreSQL, HTML, CSS, JavaScript

## Setup

1. Install dependencies:

   ```
   cd backend
   npm install
   ```

2. Create PostgreSQL database and run schema:

   ```
   psql -U <username> -d newsmania_db -f database/schema.sql
   ```

3. Create `.env` file inside `backend` with required credentials.

4. Start the server:

   ```
   node server.js
   ```

   or

   ```
   npm run dev
   ```

5. Open:

   ```
   http://localhost:3000/index.html
   ```

## Notes

* Frontend is served by Express
* Uses JWT-based authentication
* Includes admin panel and personalization
* News fetching is handled via cron job
* Articles can be downloaded as PDF for offline reading
