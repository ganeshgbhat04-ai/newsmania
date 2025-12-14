# Newsmania Backend Starter

**Tech stack:** Node.js, Express.js, MySQL, EJS

## Setup

1. Copy `.env.example` to `.env` and fill your credentials.
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Create the database:
   - Run `database/schema.sql` in your MySQL server (e.g., using MySQL Workbench or CLI).
4. Start server:
   ```
   npm run dev
   ```
5. Open `http://localhost:3000`

## Notes
- This starter includes a cron job that attempts to fetch news from NewsAPI if `NEWSAPI_KEY` is present in `.env`.
- Summarization and translation endpoints are stubbed with simple fallbacks; integrate OpenAI / Google Translate as needed.
