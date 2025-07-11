"use client";

import React, { useState } from "react";

interface TodoInputProps {
  onAdd: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState("");

  const handleAdd = () => {
    const value = text.trim();
    if (value) {
      onAdd(value);
      setText("");
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-xl mx-auto mt-6">
      <input
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition-all"
        type="text"
        placeholder="添加新的待办事项..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') handleAdd();
        }}
        maxLength={100}
      />
      <button
        className="px-5 py-3 rounded-lg bg-blue-500 text-white text-lg font-medium shadow hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        onClick={handleAdd}
        disabled={!text.trim()}
      >
        添加
      </button>
    </div>
  );
};

export default TodoInput; 