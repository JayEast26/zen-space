import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Email sign in attempted:", email);
      router.push("/zen");
    } catch (error) {
      Alert.alert("Error", "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`${provider} login attempted`);
      Alert.alert(
        "Welcome!",
        `You've signed in with ${provider}`,
        [{ text: "Continue", onPress: () => router.push("/zen") }]
      );
    } catch (error) {
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌿 Welcome Back</Text>
        <Text style={styles.subtitle}>Return to your peaceful space</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#8da676" style={styles.inputIcon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#a0a0a0"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#8da676" style={styles.inputIcon} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#a0a0a0"
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
              size={20} 
              color="#7a869a" 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSignIn} 
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.buttonText}>Signing In...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>
      
      <View style={styles.socialContainer}>
        <TouchableOpacity 
          style={[styles.socialButton, styles.googleButton, socialLoading === 'google' && styles.buttonDisabled]}
          onPress={() => handleSocialLogin("Google")}
          disabled={socialLoading}
        >
          {socialLoading === 'google' ? (
            <Ionicons name="refresh" size={20} color="#DB4437" />
          ) : (
            <Image 
              source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" }}
              style={styles.socialIcon}
            />
          )}
          <Text style={[styles.socialButtonText, styles.googleText]}>
            {socialLoading === 'google' ? 'Signing In...' : 'Google'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.socialButton, styles.facebookButton, socialLoading === 'facebook' && styles.buttonDisabled]}
          onPress={() => handleSocialLogin("Facebook")}
          disabled={socialLoading}
        >
          {socialLoading === 'facebook' ? (
            <Ionicons name="refresh" size={20} color="#1877F2" />
          ) : (
            <Ionicons name="logo-facebook" size={20} color="#1877F2" />
          )}
          <Text style={[styles.socialButtonText, styles.facebookText]}>
            {socialLoading === 'facebook' ? 'Signing In...' : 'Facebook'}
          </Text>
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
      
      <Link href="/zen" asChild>
        <TouchableOpacity style={styles.guestButton}>
          <Text style={styles.guestButtonText}>Continue as Guest →</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    backgroundColor: "#f8faf9",
    justifyContent: "space-between"
  },
  header: {
    alignItems: "center",
    marginTop: 60
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    marginBottom: 8, 
    color: "#2e3b4e"
  },
  subtitle: {
    fontSize: 16,
    color: "#7a869a",
    textAlign: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    maxHeight: 300
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "white",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  inputIcon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2e3b4e"
  },
  eyeIcon: {
    padding: 5
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 25
  },
  forgotText: {
    color: "#8da676",
    fontSize: 14,
    fontWeight: "500"
  },
  primaryButton: {
    backgroundColor: "#8da676",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#8da676",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0"
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#7a869a",
    fontSize: 14
  },
  socialContainer: {
    gap: 12,
    marginBottom: 20
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12
  },
  googleButton: {
    backgroundColor: "white",
    borderColor: "#e0e0e0"
  },
  facebookButton: {
    backgroundColor: "white",
    borderColor: "#e0e0e0"
  },
  socialIcon: {
    width: 20,
    height: 20
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600"
  },
  googleText: {
    color: "#5f6368"
  },
  facebookText: {
    color: "#1877F2"
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15
  },
  footerText: {
    color: "#7a869a",
    fontSize: 14
  },
  footerLink: {
    color: "#8da676",
    fontSize: 14,
    fontWeight: "600"
  },
  guestButton: {
    padding: 16,
    alignItems: "center",
    marginBottom: 30
  },
  guestButtonText: {
    color: "#8da676",
    fontSize: 14,
    fontWeight: "600"
  }
});