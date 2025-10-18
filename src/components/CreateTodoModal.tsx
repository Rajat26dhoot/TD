import React from 'react';
import { CreateTodoModalProps } from '../types/interfaces';
import UniversalModal from './UniversalModal';

const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  return (
    <UniversalModal
      visible={visible}
      mode="create-todo"
      onClose={onClose}
      onSubmit={({ title, body }) => onCreate(title, body)}
    />
  );
};

export default CreateTodoModal;
