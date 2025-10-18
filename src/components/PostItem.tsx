import React from 'react';
import { PostItemProps } from '../types/interfaces';
import UniversalItem from './UniversalItem';

const PostItem: React.FC<PostItemProps> = ({
  post,
  currentUser,
  onEdit,
  onDelete,
}) => {
  return (
    <UniversalItem
      type="post"
      item={post}
      currentUserId={currentUser?.id}
      onEdit={(id, title, body) => onEdit(id as string, title, body)}
      onDelete={(id) => onDelete(id as string)}
    />
  );
};

export default PostItem;
