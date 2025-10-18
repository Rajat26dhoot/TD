import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native'; // Optional icon, remove if not used

interface CreateTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (title: string, body: string) => void;
}

const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [titleFocused, setTitleFocused] = useState(false);
  const [bodyFocused, setBodyFocused] = useState(false);

  const handleCreate = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onCreate(title, body);
    setTitle('');
    setBody('');
  };

  const handleCancel = () => {
    setTitle('');
    setBody('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New To Do</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Fill in the details for your new todo.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={[styles.input, titleFocused && styles.inputFocused]}
              placeholder="Enter todo title"
              value={title}
              onChangeText={setTitle}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Body</Text>
            <TextInput
              style={[
                styles.input,
                styles.bodyInput,
                bodyFocused && styles.inputFocused,
              ]}
              placeholder="Enter todo description"
              value={body}
              onChangeText={setBody}
              onFocus={() => setBodyFocused(true)}
              onBlur={() => setBodyFocused(false)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createButtonText}>Create</Text>
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

export default CreateTodoModal;


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
  createButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
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
