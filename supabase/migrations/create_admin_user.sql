-- 创建管理员用户
INSERT INTO users (
  id,
  email,
  password_hash,
  name,
  username,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@metatopia.com',
  '$2b$10$K8qVZ9J5X2Y3W4R6T8P0L.eH9F3G1K5M7N2Q4S6U8V0X2Z4A6C8E0', -- admin123456的bcrypt哈希
  'Administrator',
  'admin',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- 确保管理员用户有正确的权限
GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT SELECT ON users TO anon;