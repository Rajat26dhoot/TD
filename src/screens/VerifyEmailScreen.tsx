import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  VerifyEmail: { email: string };
  Posts: undefined;
  Todo: undefined;
};

type VerifyEmailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerifyEmail'
>;
type VerifyEmailScreenRouteProp = RouteProp<RootStackParamList, 'VerifyEmail'>;

interface VerifyEmailScreenProps {
  navigation: VerifyEmailScreenNavigationProp;
  route: VerifyEmailScreenRouteProp;
}

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            <Ionicons name="mail-outline" size={33} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification link to your email address
        </Text>

        <View style={styles.emailBox}>
          <Text style={styles.emailLabel}>Verification email sent to:</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <Text style={styles.instructions}>
          Please check your inbox and click on the verification link to activate
          your account.
        </Text>

        <View style={styles.steps}>
          <Text style={styles.stepsTitle}>Next steps:</Text>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Open the email we just sent you</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Click on the verification link</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Return here to log in</Text>
          </View>
        </View>

        <Text style={styles.spam}>
          Didn't receive the email? Check your spam folder.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 62,
    height: 62,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 23,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emailBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth:1,
    borderColor:'#c4deff',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  emailLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  instructions: {
    fontSize: 11,
    fontWeight:400,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 20,
  },
  steps: {
    marginBottom: 24,
    borderWidth:1,
    borderColor:'#f0f0f0',
    borderRadius:12,
    padding:15,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  stepText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  spam: {
    fontSize: 11,
    color: '#9CA3AF',
    backgroundColor:'#fcfcfc',
    textAlign: 'center',
    paddingHorizontal:14,
    borderRadius:4,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d4d6d9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
