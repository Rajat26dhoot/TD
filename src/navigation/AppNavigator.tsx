import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TodoScreen from '../screens/TodoScreen';
import PostsScreen from '../screens/PostsScreen';

// ✅ Import Lucide icons
import { FileText, CheckSquare } from 'lucide-react-native';

const Tab = createMaterialTopTabNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const isPosts = route.name === 'Posts';

          return {
            tabBarActiveTintColor: '#2563EB',
            tabBarInactiveTintColor: '#6B7280',
            tabBarIndicatorStyle: { backgroundColor: '#2563EB', height: 3 },
            tabBarStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
            },
            tabBarLabel: ({ color }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isPosts ? (
                  <FileText color={color} size={18} style={{ marginRight: 4 }} />
                ) : (
                  <CheckSquare color={color} size={18} style={{ marginRight: 4 }} />
                )}
                <Text style={{ color, fontWeight: '600' }}>{route.name}</Text>
              </View>
            ),
          };
        }}
      >
        <Tab.Screen name="Posts" component={PostsScreen} />
        <Tab.Screen name="To Do" component={TodoScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
