import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { UniversalModalProps } from '../types/interfaces';

const UniversalModal: React.FC<UniversalModalProps> = ({
  visible,
  mode,
  data,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [titleFocused, setTitleFocused] = useState(false);
  const [bodyFocused, setBodyFocused] = useState(false);

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setBody(data.body || '');
    } else {
      setTitle('');
      setBody('');
    }
  }, [data, visible]);

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onSubmit({ id: data?.id, title, body });
    setTitle('');
    setBody('');
  };

  const handleCancel = () => {
    setTitle(data?.title || '');
    setBody(data?.body || '');
    onClose();
  };

  // Dynamic titles and placeholders
  const isEdit = mode === 'edit-todo';
  const isPost = mode === 'create-post';
  const mainTitle = isPost
    ? 'Create New Post'
    : isEdit
    ? 'Edit To Do'
    : 'Create New To Do';

  const subtitle = isPost
    ? 'Fill in the details for your new post.'
    : isEdit
    ? 'Update your todo details below.'
    : 'Fill in the details for your new todo.';

  const actionText = isEdit ? 'Update' : 'Create';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{mainTitle}</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={[styles.input, titleFocused && styles.inputFocused]}
              placeholder={`Enter ${isPost ? 'post' : 'todo'} title`}
              value={title}
              onChangeText={setTitle}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Body</Text>
            <TextInput
              style={[styles.input, styles.bodyInput, bodyFocused && styles.inputFocused]}
              placeholder={`Enter ${isPost ? 'post content' : 'todo description'}`}
              value={body}
              onChangeText={setBody}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              onFocus={() => setBodyFocused(true)}
              onBlur={() => setBodyFocused(false)}
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{actionText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default UniversalModal;

// ✅ Shared Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  inputFocused: {
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
  },
  bodyInput: {
    height: 60,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
