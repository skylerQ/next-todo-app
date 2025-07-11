"use client";

import React, { useState, useEffect } from "react";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import { Todo } from "../components/TodoItem";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [nextId, setNextId] = useState(1);

  // 本地存储持久化
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      const parsed: Todo[] = JSON.parse(saved);
      setTodos(parsed);
      setNextId(parsed.length > 0 ? Math.max(...parsed.map(t => t.id)) + 1 : 1);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (text: string) => {
    setTodos(prev => [
      { id: nextId, text, completed: false },
      ...prev,
    ]);
    setNextId(id => id + 1);
  };
  const handleToggle = (id: number) => {
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };
  const handleDelete = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  const handleEdit = (id: number, newText: string) => {
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-12 px-2">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2" style={{fontFamily: 'SF Pro Display, Arial, sans-serif'}}>小涂的待办清单</h1>
        <p className="text-gray-500 text-lg">极简 · 苹果风 · 支持增删改查</p>
      </header>
      <TodoInput onAdd={handleAdd} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
      <footer className="mt-auto text-gray-400 text-sm py-6 select-none">© {new Date().getFullYear()} Apple 风格 Todo List</footer>
    </div>
  );
}
