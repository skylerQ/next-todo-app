"use client";

import React, { useState } from "react";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(todo.id, editText.trim());
    setIsEditing(false);
  };

  return (
    <li
      className="flex items-center justify-between px-4 py-2 rounded-lg bg-white shadow-sm mb-2 border border-gray-200 hover:shadow-md transition-all"
      style={{
        boxShadow: todo.completed ? "0 2px 8px rgba(0,0,0,0.04)" : "0 4px 16px rgba(0,0,0,0.08)",
        opacity: todo.completed ? 0.6 : 1,
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="accent-blue-500 w-5 h-5 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-400"
        />
        {isEditing ? (
          <input
            className="flex-1 border-b border-gray-300 outline-none px-2 py-1 text-lg bg-transparent"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 text-lg select-none ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
            onDoubleClick={handleEdit}
            style={{cursor: 'pointer'}}
          >
            {todo.text}
          </span>
        )}
      </div>
      <div className="flex gap-2 ml-2">
        {!isEditing && (
          <button
            className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition-colors"
            onClick={handleEdit}
            aria-label="编辑"
          >
            编辑
          </button>
        )}
        <button
          className="text-red-400 hover:text-red-600 px-2 py-1 rounded transition-colors"
          onClick={() => onDelete(todo.id)}
          aria-label="删除"
        >
          删除
        </button>
      </div>
    </li>
  );
};

export default TodoItem; 