import React from 'react';
import { TodoItemProps } from '../types/interfaces';
import UniversalItem from './UniversalItem';

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete }) => {
  return (
    <UniversalItem
      type="todo"
      item={todo}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default TodoItem;
