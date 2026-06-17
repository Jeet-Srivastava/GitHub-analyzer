require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

//db connection using Aiven service URI
const db = mysql.createConnection({
  uri: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Successfully connected to the MySQL database!');
});

//ensuring the server is running
app.get('/', (req, res) => {
  res.send('Hello from the GitHub Analyzer!');
});

//fetch data from github API and store in db
app.get('/api/analyze/:username', async (req, res) => {
  const username = req.params.username;
  console.log("Fetching for user:", username);
  try {
    const githubResponse = await axios.get(`https://api.github.com/users/${username}`);
    const data = githubResponse.data;

    const query = `INSERT INTO profiles (username, name, public_repos, followers, following)
          VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name=VALUES(name),
            public_repos=VALUES(public_repos), followers=VALUES(followers), following=VALUES(following)`;
    const values = [data.login, data.name, data.public_repos, data.followers, data.following];

    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to save to database' });
      res.json({
        message: "Profile analyzed and saved!",
        profile: { username: data.login, name: data.name, repos: data.public_repos, followers: data.followers }
      });
    });
  } catch (error) {
    res.status(404).json({ error: "GitHub user not found!" });
  }
});

// Retrieving all saved profiles from the db
app.get('/api/profiles', (req, res) => {
  db.query('SELECT * FROM profiles', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch profiles' });
    res.json(results);
  });
});

// fetching a specific user's profile from db
app.get('/api/profiles/:username', (req, res) => {
  const username = req.params.username;

  db.query('SELECT * FROM profiles WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch profile' });

    //case where the user hasn't been analyzed yet
    if (results.length === 0) {
      return res.status(404).json({ message: "Profile not found in database. Try analyzing it first!" });
    }
    res.json(results[0]);
  });
});

// Express server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});