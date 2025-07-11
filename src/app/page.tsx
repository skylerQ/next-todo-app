"use client";

import React, { useState, useEffect } from "react";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import { Todo } from "../components/TodoItem";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从数据库加载待办事项
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('获取待办事项失败');
      }
      const data = await response.json();
      // 转换数据库格式为前端格式
      const formattedTodos = data.map((todo: any) => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed === 'true' || todo.completed === true
      }));
      setTodos(formattedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取待办事项失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (text: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('添加待办事项失败');
      }

      const newTodo = await response.json();
      setTodos(prev => [{
        id: newTodo.id,
        text: newTodo.text,
        completed: newTodo.completed === 'true' || newTodo.completed === true
      }, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加待办事项失败');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error('更新待办事项失败');
      }

      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新待办事项失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除待办事项失败');
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除待办事项失败');
    }
  };

  const handleEdit = async (id: string, newText: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText }),
      });

      if (!response.ok) {
        throw new Error('更新待办事项失败');
      }

      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新待办事项失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center py-12 px-2">
        <div className="text-gray-600 text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-12 px-2">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2" style={{fontFamily: 'SF Pro Display, Arial, sans-serif'}}>小涂的待办清单</h1>
        <p className="text-gray-500 text-lg">极简 · 苹果风 · 支持增删改查</p>
      </header>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
      
      <TodoInput onAdd={handleAdd} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
      <footer className="mt-auto text-gray-400 text-sm py-6 select-none">© {new Date().getFullYear()} Apple 风格 Todo List</footer>
    </div>
  );
}
