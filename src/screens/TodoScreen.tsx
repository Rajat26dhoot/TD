import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { supabase } from '../config/supabase';
import TodoItem from '../components/TodoItem';
import CreateTodoModal from '../components/CreateTodoModal';
import EditTodoModal from '../components/EditTodoModal';
import DeleteModal from '../components/DeleteModal';
import HeaderBar from '../components/HeaderBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RefreshCcw, Plus } from 'lucide-react-native';


const ITEMS_PER_PAGE = 10;


interface Todo {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
}

interface SupabaseUser {
  id: string;
  email?: string;
}

type RootStackParamList = {
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;


const TodoScreen: React.FC<Props> = ({ navigation }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [fetchedCount, setFetchedCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getCurrentUser();
    fetchTotalCount();
    fetchTodos();
  }, []);


  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUser(user as SupabaseUser);
  };

  // ✅ Fetch total count for stats
  const fetchTotalCount = async () => {
    try {
      const { count, error } = await supabase
        .from('table_rls')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error('Error fetching count:', error.message);
    }
  };

  // ✅ Fetch todos (paginated)
  const fetchTodos = async (offset = 0, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (offset === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const { data, error } = await supabase
        .from('table_rls')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      if (error) throw error;

      const newTodos = (data as Todo[]) || [];

      if (isRefresh) {
        setTodos(newTodos);
        setFetchedCount(newTodos.length);
      } else if (offset === 0) {
        setTodos(newTodos);
        setFetchedCount(newTodos.length);
      } else {
        setTodos((prev) => [...prev, ...newTodos]);
        setFetchedCount((prev) => prev + newTodos.length);
      }

      setHasMore(newTodos.length === ITEMS_PER_PAGE);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // ✅ Pull-to-refresh handler
  const handleRefresh = () => {
    fetchTotalCount();
    fetchTodos(0, true);
  };

  // ✅ Infinite scroll handler
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchTodos(todos.length);
    }
  };

  // ✅ Create a new todo
  const handleCreate = async (title: string, body: string) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('table_rls')
        .insert([{ title, body, user_id: currentUser.id }])
        .select()
        .single();

      if (error) throw error;

      const newTodo = data as Todo;

      setTodos((prev) => [newTodo, ...prev]);
      setFetchedCount((prev) => prev + 1);
      setTotalCount((prev) => prev + 1);
      setCreateModalVisible(false);
      Alert.alert('Success', 'Todo created successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // ✅ Open edit modal
  const handleEditPress = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditModalVisible(true);
  };

  // ✅ Edit existing todo
  const handleEdit = async (id: string, title: string, body: string) => {
    try {
      const { error } = await supabase
        .from('table_rls')
        .update({ title, body })
        .eq('id', id);

      if (error) throw error;

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, title, body } : todo))
      );
      setEditModalVisible(false);
      Alert.alert('Success', 'Todo updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // ✅ Open delete modal
  const handleDeletePress = (todo: Todo) => {
    setSelectedTodo(todo);
    setDeleteModalVisible(true);
  };

  // ✅ Delete a todo
  const handleDelete = async () => {
    if (!selectedTodo) return;

    try {
      const { error } = await supabase
        .from('table_rls')
        .delete()
        .eq('id', selectedTodo.id);

      if (error) throw error;

      setTodos((prev) => prev.filter((todo) => todo.id !== selectedTodo.id));
      setFetchedCount((prev) => prev - 1);
      setTotalCount((prev) => prev - 1);
      setDeleteModalVisible(false);
      Alert.alert('Success', 'Todo deleted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // ✅ Stats header
  const renderStats = () => (
    <View style={styles.statsContainer}>
      {/* Header row: label and action buttons */}
      <View style={styles.statsRow}>
        <Text style={styles.statsLabel}>Total Posts</Text>
        <View style={styles.statsActions}>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <RefreshCcw size={16} color="#575757" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCreateModalVisible(true)}
            style={styles.addButton}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Plus size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.addButtonText}>New Post</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
  
      {/* Stats */}
      <Text style={styles.statsCount}>{totalCount}</Text>
      <Text style={styles.statsFetched}>{fetchedCount} posts fetched</Text>
    </View>
  );



  // ✅ Loading more footer
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#2563EB" />
      </View>
    );
  };

  // ✅ Initial loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // ✅ Main render
  return (
    <View style={styles.container}>
      {renderStats()}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onEdit={() => handleEditPress(item)}
            onDelete={() => handleDeletePress(item)}
          />
        )}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No more todos</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      <CreateTodoModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={handleCreate}
      />

      <EditTodoModal
        visible={editModalVisible}
        todo={selectedTodo}
        onClose={() => setEditModalVisible(false)}
        onUpdate={handleEdit}
      />

      <DeleteModal
        visible={deleteModalVisible}
        title="Delete To Do"
        message="Are you sure you want to delete this todo? This action cannot be undone."
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomColor:'#dedfe0',
    borderBottomWidth:1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsActions: {
    flexDirection: 'row',
    columnGap: 8, // RN 0.71+ supports columnGap
  },
  refreshButton: {
    padding: 6,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth:1,
    borderColor:'#cfcfcf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsCount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: -8,
    marginBottom:2,
  },
  statsFetched: {
    fontSize: 12,
    color: '#666769',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
