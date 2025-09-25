import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.password || !formData.confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords don't match!");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    if (!acceptedTerms) {
      Alert.alert("Error", "Please accept the terms and conditions");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      console.log('👤 Creating Firebase account for:', formData.email);
      
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );
      
      const user = userCredential.user;
      console.log('✅ Firebase user created:', user.uid);

      // 2. Save user data to Firestore
      const userData = {
        id: user.uid,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        displayName: formData.name.trim(),
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, "users", user.uid), userData);
      console.log('✅ User data saved to Firestore');

      // 3. Save user data to SecureStore for local access
      const userDataForStorage = {
        uid: user.uid,
        email: user.email,
        name: formData.name.trim(),
        displayName: formData.name.trim(),
        lastLogin: new Date().toISOString()
      };

      await SecureStore.setItemAsync('userData', JSON.stringify(userDataForStorage));
      console.log('✅ User data saved to SecureStore');

      // 4. Navigate to main app - FIXED: Direct navigation instead of alert
      console.log('🔄 Navigating to zen page...');
      router.push("/zen");
      
    } catch (error) {
      console.error('❌ Firebase sign-up error:', error);
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password accounts are not enabled. Please contact support.";
      }
      
      Alert.alert("Sign Up Error", errorMessage);
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
            <Text style={styles.title}>Begin Your Journey</Text>
            <Text style={styles.subtitle}>Create your peaceful space</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                placeholder="Full name"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                autoComplete="name"
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
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
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                placeholder="Create password"
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
            
            <View style={styles.inputContainer}>
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData("confirmPassword", value)}
                placeholder="Confirm password"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                autoComplete="password"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={18} 
                  color="rgba(255,255,255,0.7)" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
              >
                <Ionicons 
                  name={acceptedTerms ? "checkbox" : "square-outline"} 
                  size={20} 
                  color={acceptedTerms ? "rgba(141, 166, 118, 0.9)" : "rgba(255,255,255,0.7)"} 
                />
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the Terms of Service and Privacy Policy
              </Text>
            </View>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
            </View>
            
            <TouchableOpacity 
              onPress={handleSignUp} 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/auth/signin" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    gap: 10,
  },
  checkbox: {
    paddingTop: 2
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 16
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