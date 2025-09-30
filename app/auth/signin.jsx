import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

const handleSignIn = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  setIsLoading(true);
  
  try {
    console.log('🔄 Attempting navigation...');
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Firebase sign-in successful:', user.uid);

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      userData.lastLogin = new Date().toISOString();
      
      await updateDoc(docRef, { lastLogin: userData.lastLogin });
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      console.log('✅ User data saved to SecureStore');
      
    router.push("/zen");
    } else {
      throw new Error("User data not found in Firestore");
    }
    
  } catch (error) {
    console.error('❌ Firebase sign-in error:', error);
    let errorMessage = "Failed to sign in. Please check your credentials.";
    
    // FIXED: Updated error code names for newer Firebase versions
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password.";
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = "No account found with this email.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Please enter a valid email address.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed attempts. Please try again later.";
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = "Network error. Please check your internet connection.";
    }
    
    Alert.alert("Sign In Error", errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" }}
      style={styles.background}
      blurRadius={15}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={18} 
                  color="rgba(255,255,255,0.7)" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
            </View>
            
            <TouchableOpacity 
              onPress={handleSignIn} 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/auth/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: { 
    width: "100%",
    maxWidth: 320,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: 12,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "white",
  },
  eyeIcon: {
    padding: 4
  },
  divider: {
    width: "100%",
    marginVertical: 10,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  primaryButton: {
    backgroundColor: "rgba(141, 166, 118, 0.85)",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600"
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "rgba(141, 166, 118, 0.9)",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14
  },
  footerLink: {
    color: "rgba(141, 166, 118, 0.9)",
    fontSize: 14,
    fontWeight: "600"
  },
});