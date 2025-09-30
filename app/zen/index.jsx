import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Alert } from "react-native";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import * as SecureStore from 'expo-secure-store';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function ZenPractices() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Guest User",
    email: "guest@example.com",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase auth state listener
  useEffect(() => {
  console.log('🚀 Setting up Firebase auth listener...');
  
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('🔥 Firebase auth state changed:', firebaseUser ? firebaseUser.uid : 'No user');
    
    // ADD THIS CHECK: If we just signed in, don't interfere with navigation
    if (firebaseUser && isLoading) {
      console.log('✅ User signed in successfully, proceeding with navigation...');
      // Continue with your user data loading...
    }
    
    if (firebaseUser) {
      // User is signed in with Firebase
      try {
        const userData = await SecureStore.getItemAsync('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          console.log('👤 User data from SecureStore:', parsedData);
          setUser(parsedData);
          setIsLoggedIn(true);
        } else {
          // Fallback to Firebase user info
          console.log('⚠️ Using Firebase user data as fallback');
          setUser({
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
            email: firebaseUser.email || "user@example.com",
            uid: firebaseUser.uid
          });
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('💥 Error processing user data:', error);
        setUser({
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
          email: firebaseUser.email || "user@example.com",
          uid: firebaseUser.uid
        });
        setIsLoggedIn(true);
      }
    } else {
      // No user signed in - BUT don't redirect if we're in the middle of signing in
      if (!isLoading) {
        console.log('❌ No Firebase user signed in');
        setUser({
          name: "Guest User",
          email: "guest@example.com",
        });
        setIsLoggedIn(false);
      }
    }
    
    setIsLoading(false);
  });

  return () => {
    console.log('🧹 Cleaning up auth listener');
    unsubscribe();
  };
}, []);

  const loadUserData = async () => {
    try {
      console.log('🔍 Manually loading user data...');
      const userData = await SecureStore.getItemAsync('userData');
      console.log('📦 Raw user data from SecureStore:', userData);
      
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log('👤 Parsed user data:', parsedData);
        setUser(parsedData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('💥 Error loading user data:', error);
    }
  };

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 ZenPractices screen focused');
      loadUserData();
    }, [])
  );

  const practices = [
    {
      id: 1,
      title: "Breathing Anchor",
      description: "Follow your breath",
      icon: "🌊",
      path: "/zen/breathe"
    },
    {
      id: 2,
      title: "Meditation Timer",
      description: "Set mindful sessions",
      icon: "⏱️",
      path: "/zen/timer"
    },
    {
      id: 3,
      title: "Mindful Bell",
      description: "Random mindful pauses",
      icon: "🔔",
      path: "/zen/bell"
    },
    // NEW FEATURES ADDED BELOW
    {
      id: 5,
      title: "Pomodoro Focus",
      description: "Work in focused intervals",
      icon: "🍅",
      path: "/zen/pomodoro"
    },
    {
      id: 6,
      title: "Freedom Wall",
      description: "Share positive thoughts",
      icon: "🕊️",
      path: "/zen/freedomwall"
    }
  ];

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              console.log('👋 Logging out...');
              await signOut(auth);
              await SecureStore.deleteItemAsync('userData');
              setUser({
                name: "Guest User",
                email: "guest@example.com",
              });
              setIsLoggedIn(false);
              console.log('✅ Logged out successfully');
              router.replace("/");
            } catch (error) {
              console.log('💥 Error during logout:', error);
              // Force logout anyway
              await SecureStore.deleteItemAsync('userData');
              setUser({
                name: "Guest User",
                email: "guest@example.com",
              });
              setIsLoggedIn(false);
              router.replace("/");
            }
          }
        }
      ]
    );
  };

  const handleProfilePress = () => {
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/auth/signin");
    }
  };

  const handleLogin = () => {
    router.push("/auth/signin");
  };

  // Show loading state
  if (isLoading) {
    return (
      <ImageBackground 
        source={{ uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" }}
        style={styles.background}
        blurRadius={15}
      >
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your peaceful space...</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  console.log('🎨 Rendering UI - isLoggedIn:', isLoggedIn, 'user:', user);

  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" }}
      style={styles.background}
      blurRadius={15}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              style={styles.userInfo} 
              onPress={handleProfilePress}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <View>
                <Text style={styles.userName}>
                  {isLoggedIn ? user.name : "Guest User"}
                </Text>
                <Text style={styles.userEmail}>
                  {isLoggedIn ? user.email : "Tap to sign in"}
                </Text>
              </View>
            </TouchableOpacity>
            
            {isLoggedIn ? (
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="rgba(255,255,255,0.8)" />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Ionicons name="log-in-outline" size={22} color="rgba(255,255,255,0.8)" />
                <Text style={styles.loginText}>Sign in</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Page Content */}
          <View style={styles.header}>
            <Text style={styles.title}>Zen Practices</Text>
            <Text style={styles.subtitle}>
              {isLoggedIn ? `Welcome back, ${user.name.split(' ')[0]}!` : "Choose your mindful moment"}
            </Text>
          </View>

          <ScrollView style={styles.practicesContainer} showsVerticalScrollIndicator={false}>
            {practices.map((practice) => (
              <Link href={practice.path} key={practice.id} asChild>
                <TouchableOpacity style={styles.practiceCard}>
                  <Text style={styles.practiceIcon}>{practice.icon}</Text>
                  <View style={styles.practiceText}>
                    <Text style={styles.practiceTitle}>{practice.title}</Text>
                    <Text style={styles.practiceDescription}>{practice.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  userEmail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
    fontSize: 14,
  },
  loginText: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
    fontSize: 14,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  practicesContainer: {
    flex: 1,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  practiceIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  practiceText: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  practiceDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
});