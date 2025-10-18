// components/HeaderBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';

interface HeaderBarProps {
  email?: string;
  onLogout: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ email, onLogout }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.userEmail}>{email}</Text>
      </View>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <LogOut color="#262626" size={20} /> 
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBar;

// 🎨 Styles
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical:7,
    backgroundColor: '#fff',
    borderBottomColor:'#d7d7d9',
    borderBottomWidth:1,
  },
  headerLeft: { flex: 1 },
  userEmail: { fontSize: 14, color: '#616263' },
  logoutButton: { padding: 8 },
});
