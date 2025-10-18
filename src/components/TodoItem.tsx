import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Pencil, Trash2 } from 'lucide-react-native';

interface Todo {
  id: string | number;
  title: string;
  body: string;
  created_at: string;
}

interface TodoItemProps {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{todo.title}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
            <Pencil size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.body}>{todo.body}</Text>
        <Text style={styles.date}>{formatDate(todo.created_at)}</Text>
      </View>
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal:5,
    overflow: 'hidden',
    borderBottomWidth:1,
    borderBottomColor:'#dedfe0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  deleteIcon: {
    fontSize: 16,
  },
  body: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
