import bcrypt from 'bcryptjs';
import pool from '../db/connection.js';
import dotenv from 'dotenv';

dotenv.config();

async function createUser() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'password123';

  try {
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE username = $2',
        [passwordHash, username]
      );
      console.log(`User "${username}" password updated successfully`);
    } else {
      // Create new user
      await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
        [username, passwordHash]
      );
      console.log(`User "${username}" created successfully`);
    }

    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log("Need to be created if message is invalid credentials")
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createUser();

