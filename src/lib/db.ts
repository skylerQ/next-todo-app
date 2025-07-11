import { Pool } from 'pg';

// 数据库连接配置 - 只在服务器端运行
const createPool = () => {
  if (typeof window !== 'undefined') {
    // 在客户端，返回 null
    return null;
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_shWv5K1lITVS@ep-ancient-credit-aekoy88g-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: {
      rejectUnauthorized: false
    }
  });
};

const pool = createPool();

export default pool; 