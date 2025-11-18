// This script should be run from the backend directory or with backend/node_modules in path
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

async function createAdminUser() {
  const dbUrl = process.argv[2];
  const username = process.argv[3] || 'admin';
  const password = process.argv[4] || 'password123';

  if (!dbUrl) {
    console.error('Error: Database URL is required');
    console.log('Usage: node create-admin-user.js <DATABASE_URL> [username] [password]');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

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
      console.log(`✓ User "${username}" password updated successfully`);
    } else {
      // Create new user
      await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
        [username, passwordHash]
      );
      console.log(`✓ User "${username}" created successfully`);
    }

    console.log('\n========================================');
    console.log('Admin User Created!');
    console.log('========================================');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('========================================\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createAdminUser();

