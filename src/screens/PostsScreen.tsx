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
import PostItem from '../components/PostItem';
import CreatePostModal from '../components/CreatePostModal';
import DeleteModal from '../components/DeleteModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RefreshCcw, Plus } from 'lucide-react-native';

interface Post {
  id: string;
  title: string;
  body: string;
  created_at: string;
  owner_id: string;
}

interface User {
  id: string;
  email?: string;
}

type RootStackParamList = {
  Posts: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Posts'>;

const ITEMS_PER_PAGE = 10;

const PostsScreen: React.FC<Props> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUser();
    fetchTotalCount();
    fetchPosts();
  }, []);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUser(user as User);
  };

  const fetchTotalCount = async () => {
    try {
      const { count, error } = await supabase
        .from('table_general')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const fetchPosts = async (offset = 0, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (offset === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const { data, error } = await supabase
        .from('table_general')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      if (error) throw error;

      if (isRefresh || offset === 0) {
        setPosts(data || []);
        setFetchedCount(data?.length || 0);
      } else {
        setPosts(prev => [...prev, ...(data || [])]);
        setFetchedCount(prev => prev + (data?.length || 0));
      }

      setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    fetchTotalCount();
    fetchPosts(0, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(posts.length);
    }
  };

  const handleEdit = async (id: string, title: string, body: string) => {
    try {
      const { error } = await supabase
        .from('table_general')
        .update({ title, body })
        .eq('id', id);

      if (error) throw error;

      setPosts(prev =>
        prev.map(post => (post.id === id ? { ...post, title, body } : post))
      );
      Alert.alert('Success', 'Post updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCreate = async (title: string, body: string) => {
    try {
      if (!currentUser) throw new Error('User not logged in');

      const { data, error } = await supabase
        .from('table_general')
        .insert([{ title, body, owner_id: currentUser.id }])
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      setFetchedCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
      setModalVisible(false);
      Alert.alert('Success', 'Post created successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from('table_general') // Table name
        .delete()
        .eq('id', selectedPost.id);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== selectedPost.id));
      setFetchedCount(prev => prev - 1);
      setTotalCount(prev => prev - 1);
      setDeleteModalVisible(false);
      setSelectedPost(null);
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <Text style={styles.statsLabel}>Total Posts</Text>
        <View style={styles.statsActions}>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <RefreshCcw size={16} color="#575757" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Plus size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.addButtonText}>New Post</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.statsCount}>{totalCount}</Text>
      <Text style={styles.statsFetched}>{fetchedCount} posts fetched</Text>
    </View>
  );

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#2563EB" />
      </View>
    ) : null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderStats()}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            currentUser={currentUser}
            onEdit={handleEdit}
            onDelete={() => {
              setSelectedPost(item);
              setDeleteModalVisible(true);
            }}
          />
        )}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingTop: 0 }}
      />

      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreate}
      />

      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        loading={deleteLoading} // ✅ Pass loading prop for spinner
      />
    </View>
  );
};

export default PostsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomColor: '#dedfe0',
    borderBottomWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  statsActions: { flexDirection: 'row', columnGap: 8 },
  refreshButton: {
    padding: 6,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cfcfcf',
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
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  statsCount: { fontSize: 28, fontWeight: '700', color: '#1F2937', marginTop: -8, marginBottom: 2 },
  statsFetched: { fontSize: 12, color: '#666769' },
  footer: { padding: 20, alignItems: 'center' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#9CA3AF' },
});
