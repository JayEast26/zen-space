// /app/goals/signin.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // This is the correct path for this file
import { Link, useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/index');
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ZENSPACE</Text>
      
      <TextInput
        style={styles.input}
        placeholder="EMAIL"
        placeholderTextColor="#a0a0a0"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        placeholderTextColor="#a0a0a0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>SIGN IN</Text>
      </Pressable>
      
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account?</Text>
        <Link style={styles.link} href="/goals/signup">
          SIGN UP
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 30,
  },
  title: {
    marginBottom: 50,
    fontSize: 28,
    color: '#4a4a4a',
    letterSpacing: 4,
    fontWeight: '300',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    fontSize: 16,
    color: '#4a4a4a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#6b8e23',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#888',
  },
  link: {
    fontSize: 14,
    color: '#6b8e23',
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default LoginScreen;