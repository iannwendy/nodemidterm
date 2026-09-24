-- ============================================
-- TaskFlow Database Initialization
-- ============================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS taskflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskflow;

-- Tasks table
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
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT IGNORE INTO tasks (id, title, description, status, priority) VALUES
  ('550e8400-e29b-41d4-a716-446655440001',
   'Setup Docker environment',
   'Configure Docker and Docker Compose for the project with multi-service architecture',
   'done', 'high'),
  ('550e8400-e29b-41d4-a716-446655440002',
   'Create Node.js backend API',
   'Implement REST API with Express.js, MySQL database, and Redis caching',
   'in-progress', 'high'),
  ('550e8400-e29b-41d4-a716-446655440003',
   'Build React frontend',
   'Create dashboard UI with React, Tailwind CSS, and modern component design',
   'in-progress', 'medium'),
  ('550e8400-e29b-41d4-a716-446655440004',
   'Configure MySQL database',
   'Setup MySQL with proper schema, indexes, and seed data for testing',
   'done', 'medium'),
  ('550e8400-e29b-41d4-a716-446655440005',
   'Implement Redis caching',
   'Add Redis for session management and task notification queue',
   'todo', 'low'),
  ('550e8400-e29b-41d4-a716-446655440006',
   'Setup load balancing',
   'Configure nginx for load balancing across 3 backend replicas',
   'todo', 'high'),
  ('550e8400-e29b-41d4-a716-446655440007',
   'Deploy with Docker Swarm',
   'Deploy and scale services using Docker Swarm orchestration',
   'todo', 'medium');
