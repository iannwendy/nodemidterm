import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const dbConfig = {
  host: process.env.DB_HOST || 'database',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'taskflow123',
  database: process.env.DB_NAME || 'taskflow',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
}

let pool = null

async function initialize() {
  // First connect without database to create it if needed
  const tempConnection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password
  })

  await tempConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  )
  await tempConnection.end()

  // Create connection pool
  pool = mysql.createPool(dbConfig)

  // Create tasks table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('todo', 'in-progress', 'done') DEFAULT 'todo',
      priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_priority (priority),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // Insert sample data if table is empty
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM tasks')
  if (rows[0].count === 0) {
    await pool.query(`
      INSERT INTO tasks (id, title, description, status, priority) VALUES
      ('550e8400-e29b-41d4-a716-446655440001', 'Setup Docker environment', 'Configure Docker and Docker Compose for the project', 'done', 'high'),
      ('550e8400-e29b-41d4-a716-446655440002', 'Create Node.js backend API', 'Implement REST API with Express.js', 'in-progress', 'high'),
      ('550e8400-e29b-41d4-a716-446655440003', 'Build React frontend', 'Create dashboard UI with React and Tailwind', 'in-progress', 'medium'),
      ('550e8400-e29b-41d4-a716-446655440004', 'Configure MySQL database', 'Setup MySQL with proper schema and seed data', 'done', 'medium'),
      ('550e8400-e29b-41d4-a716-446655440005', 'Implement Redis caching', 'Add Redis for session and data caching', 'todo', 'low'),
      ('550e8400-e29b-41d4-a716-446655440006', 'Setup load balancing', 'Configure nginx for load balancing backend replicas', 'todo', 'high')
    `)
    console.log('✓ Sample data inserted')
  }

  console.log('✓ Database pool ready')
  return pool
}

function getPool() {
  if (!pool) {
    throw new Error('Database not initialized. Call initialize() first.')
  }
  return pool
}

async function query(sql, params) {
  const [rows] = await getPool().execute(sql, params)
  return rows
}

async function close() {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export default {
  initialize,
  getPool,
  query,
  close
}
