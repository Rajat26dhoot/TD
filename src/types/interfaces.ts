// Base interface for universal items
export interface UniversalItemData {
  id: string | number;
  title: string;
  body: string;
  created_at: string;
  owner_id?: string;
}

// Post interface extending UniversalItemData
export interface Post extends UniversalItemData {
  id: string;
  title: string;
  body: string;
  owner_id: string;
  created_at: string;
}

// Todo interface extending UniversalItemData
export interface Todo extends UniversalItemData {
  id: string | number;
  title: string;
  body: string;
  created_at: string;
}

// User interface
export interface CurrentUser {
  id: string;
  email?: string;
}

// Universal Item Props
export interface UniversalItemProps {
  item: UniversalItemData;
  currentUserId?: string; // Optional: for ownership check (like in PostItem)
  type: 'todo' | 'post';
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number, title: string, body: string) => void;
}

// Post Item Props
export interface PostItemProps {
  post: Post;
  currentUser: CurrentUser | null;
  onEdit: (id: string, title: string, body: string) => void;
  onDelete: (id: string) => void;
}

// Todo Item Props
export interface TodoItemProps {
  todo: Todo;
  onEdit: (id: string | number, title: string, body: string) => void;
  onDelete: (id: string | number) => void;
}

// Universal Modal Props
export interface UniversalModalProps {
  visible: boolean;
  mode: 'create-post' | 'create-todo' | 'edit-todo';
  data?: { id?: string; title?: string; body?: string };
  onClose: () => void;
  onSubmit: (payload: { id?: string; title: string; body: string }) => void;
}

// Edit Todo Modal Props
export interface EditTodoModalProps {
  visible: boolean;
  todo: Todo | null;
  onClose: () => void;
  onUpdate: (id: string, title: string, body: string) => void;
}

// Create Todo Modal Props
export interface CreateTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (title: string, body: string) => void;
}

// Create Post Modal Props
export interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (title: string, body: string) => void;
}
