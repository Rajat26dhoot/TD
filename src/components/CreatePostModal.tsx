import React from 'react';
import { CreatePostModalProps } from '../types/interfaces';
import UniversalModal from './UniversalModal';

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  return (
    <UniversalModal
      visible={visible}
      mode="create-post"
      onClose={onClose}
      onSubmit={({ title, body }) => onCreate(title, body)}
    />
  );
};

export default CreatePostModal;
