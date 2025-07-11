import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// 获取所有待办事项
export async function GET() {
  try {
    if (!pool) {
      return NextResponse.json({ error: '数据库连接不可用' }, { status: 500 });
    }

    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public.todos ORDER BY id');
    client.release();
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('获取待办事项失败:', error);
    return NextResponse.json({ error: '获取待办事项失败' }, { status: 500 });
  }
}

// 创建新的待办事项
export async function POST(request: NextRequest) {
  try {
    if (!pool) {
      return NextResponse.json({ error: '数据库连接不可用' }, { status: 500 });
    }

    const { text } = await request.json();
    
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: '待办事项内容不能为空' }, { status: 400 });
    }

    const id = uuidv4();
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO public.todos (id, text, completed) VALUES ($1, $2, $3) RETURNING *',
      [id, text.trim(), 'false']
    );
    
    client.release();
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('创建待办事项失败:', error);
    return NextResponse.json({ error: '创建待办事项失败' }, { status: 500 });
  }
} 