import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';


interface Post {
  id: string;
  title: string;
  body: string;
  owner_id: string;
  created_at: string;
}

interface CurrentUser {
  id: string;
  email?: string;
}

interface PostItemProps {
  post: Post;
  currentUser: CurrentUser | null;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, body: string) => void;
}


export default function PostItem({
  post,
  currentUser,
  onDelete,
  onEdit,
}: PostItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(post.title);
  const [editBody, setEditBody] = useState<string>(post.body);

  const isOwner = currentUser?.id === post.owner_id;

  const handleSave = () => {
    if (!editTitle.trim() || !editBody.trim()) {
      Alert.alert('Error', 'Title and body cannot be empty');
      return;
    }
    onEdit(post.id, editTitle, editBody);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(post.title);
    setEditBody(post.body);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(post.id);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  if (isEditing) {
    return (
      <View style={styles.container}>
        <View style={styles.editContainer}>
          <Text style={styles.editLabel}>Title</Text>
          <TextInput
            style={styles.editInput}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Enter title"
          />
          <Text style={styles.editLabel}>Body</Text>
          <TextInput
            style={[styles.editInput, styles.editBodyInput]}
            value={editBody}
            onChangeText={setEditBody}
            placeholder="Enter body"
            multiline
            numberOfLines={3}
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.editButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{post.title}</Text>
          {isOwner && (
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={styles.iconButton}
              >
                <Pencil size={18} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.body}>{post.body}</Text>
        <Text style={styles.date}>{formatDate(post.created_at)}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal:5,
    borderRadius: 8,
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
    color: '#7c7c7d',
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editContainer: {
    padding: 16,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 12,
  },
  editBodyInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
});
