# GitHub Profile Analyzer Backend

A Node.js backend service that fetches public GitHub profile data using the GitHub API and stores the insights in a MySQL database.

## Tech Stack
* Node.js & Express.js
* MySQL (mysql2)
* Axios (for GitHub API)
* Dotenv (for environment variables)

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   Run `npm install` in your terminal.
3. **Database Setup:**
   * Import the provided `database_schema.sql` file into your MySQL server to create the database and table.
4. **Environment Variables:**
   * Create a `.env` file in the root directory.
   * Add your MySQL credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=github_analyzer_db
     ```
5. **Run the server:**
   Run `node server.js` in your terminal. The server will start on port 3000.

## API Endpoints
* `GET /api/analyze/:username` - Fetches data from GitHub API and saves it to MySQL.
* `GET /api/profiles` - Retrieves all saved profiles from the database.
* `GET /api/profiles/:username` - Retrieves a single profile from the database.