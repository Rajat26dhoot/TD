import React from 'react';
import { EditTodoModalProps } from '../types/interfaces';
import UniversalModal from './UniversalModal';

const EditTodoModal: React.FC<EditTodoModalProps> = ({
  visible,
  todo,
  onClose,
  onUpdate,
}) => {
  return (
    <UniversalModal
      visible={visible}
      mode="edit-todo"
      data={todo ? { id: todo.id.toString(), title: todo.title, body: todo.body } : undefined}
      onClose={onClose}
      onSubmit={({ id, title, body }) => {
        if (id) onUpdate(id, title, body);
      }}
    />
  );
};

export default EditTodoModal;
