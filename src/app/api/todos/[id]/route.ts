import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 更新待办事项
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!pool) {
      return NextResponse.json({ error: '数据库连接不可用' }, { status: 500 });
    }

    const { text, completed } = await request.json();
    const { id } = params;

    const client = await pool.connect();
    
    let query = '';
    let values: any[] = [];

    if (text !== undefined && completed !== undefined) {
      // 更新文本和完成状态
      query = 'UPDATE public.todos SET text = $1, completed = $2 WHERE id = $3 RETURNING *';
      values = [text, completed, id];
    } else if (text !== undefined) {
      // 只更新文本
      query = 'UPDATE public.todos SET text = $1 WHERE id = $2 RETURNING *';
      values = [text, id];
    } else if (completed !== undefined) {
      // 只更新完成状态
      query = 'UPDATE public.todos SET completed = $1 WHERE id = $2 RETURNING *';
      values = [completed, id];
    } else {
      client.release();
      return NextResponse.json({ error: '缺少更新参数' }, { status: 400 });
    }

    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '待办事项不存在' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('更新待办事项失败:', error);
    return NextResponse.json({ error: '更新待办事项失败' }, { status: 500 });
  }
}

// 删除待办事项
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!pool) {
      return NextResponse.json({ error: '数据库连接不可用' }, { status: 500 });
    }

    const { id } = params;
    const client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM public.todos WHERE id = $1 RETURNING *',
      [id]
    );
    
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '待办事项不存在' }, { status: 404 });
    }

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除待办事项失败:', error);
    return NextResponse.json({ error: '删除待办事项失败' }, { status: 500 });
  }
} 