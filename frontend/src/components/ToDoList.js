import React, { useState } from 'react';
import './ToDoList.css';
import { FaTrash, FaCheck } from 'react-icons/fa';

const TodoList = ({ room_id, todos, user, onUpdate, disabled }) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = async () => {
    console.log("from todo", user);
    console.log('Sending task:', {
      action: 'add',
      task_description: newTask,
      user_id: user["student_id"],
    });
    


    const res = await fetch(`http://localhost:5000/api/room-details/${room_id}/updateTodo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        task_description: newTask,
        user_id: user.student_id,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      onUpdate([...todos, { task: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleComplete = async (task_id) => {
    await fetch(`http://localhost:5000/api/room-details/${room_id}/updateTodo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'complete',
        task_id,
        user_id: user.student_id,
      }),
    });
    onUpdate(
      todos.map((todo) =>
        todo.task_id === task_id ? { ...todo, completed: true } : todo
      )
    );
  };

  const handleDelete = async (task_id) => {
    await fetch(`http://localhost:5000/api/room-details/${room_id}/updateTodo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        task_id,
        user_id: user.student_id,
      }),
    });
    onUpdate(todos.filter((todo) => todo.task_id !== task_id));
  };

  return (
    <div className="todo-list">
      <h3>📋 Study To-Do List </h3>
      {!disabled && (
        <div className="todo-input">
          <input
            type="text"
            placeholder="Add a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>
      )}
      <ul>
        {todos.map((todo) => (
          <li key={todo.task_id} className={todo.completed ? 'completed' : ''}>
            {todo.task}
            {!disabled && (
              <div className="todo-actions">
                {!todo.completed && (
                  <FaCheck className="icon" onClick={() => handleComplete(todo.task_id)} />
                )}
                <FaTrash className="icon" onClick={() => handleDelete(todo.task_id)} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
