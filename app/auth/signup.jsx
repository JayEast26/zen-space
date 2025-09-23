import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
  const [socialLoading, setSocialLoading] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Sign up attempted:", formData.email);
      router.push("/zen");
    } catch (error) {
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`${provider} sign up attempted`);
      Alert.alert(
        "Welcome!",
        `You've signed up with ${provider}`,
        [{ text: "Continue", onPress: () => router.push("/zen") }]
      );
    } catch (error) {
      Alert.alert("Error", `Failed to sign up with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const passwordStrength = () => {
    if (formData.password.length === 0) return { strength: 0, label: "" };
    if (formData.password.length < 6) return { strength: 1, label: "Weak", color: "#ff6b6b" };
    if (formData.password.length < 8) return { strength: 2, label: "Fair", color: "#ffd93d" };
    return { strength: 3, label: "Strong", color: "#8da676" };
  };

  const strength = passwordStrength();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>🌱 Begin Your Journey</Text>
        <Text style={styles.subtitle}>Create your peaceful space</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#8da676" style={styles.inputIcon} />
          <TextInput
            value={formData.name}
            onChangeText={(value) => updateFormData("name", value)}
            placeholder="Full name"
            placeholderTextColor="#a0a0a0"
            style={styles.input}
            autoComplete="name"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#8da676" style={styles.inputIcon} />
          <TextInput
            value={formData.email}
            onChangeText={(value) => updateFormData("email", value)}
            placeholder="Email address"
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
            value={formData.password}
            onChangeText={(value) => updateFormData("password", value)}
            placeholder="Create password"
            placeholderTextColor="#a0a0a0"
            style={styles.input}
            secureTextEntry={!showPassword}
            autoComplete="password-new"
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
        
        {formData.password.length > 0 && (
          <View style={styles.passwordStrength}>
            <View style={styles.strengthBar}>
              <View style={[
                styles.strengthFill, 
                { 
                  width: `${(strength.strength / 3) * 100}%`,
                  backgroundColor: strength.color
                }
              ]} />
            </View>
            <Text style={[styles.strengthText, { color: strength.color }]}>
              {strength.label}
            </Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#8da676" style={styles.inputIcon} />
          <TextInput
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData("confirmPassword", value)}
            placeholder="Confirm password"
            placeholderTextColor="#a0a0a0"
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            autoComplete="password-new"
          />
          <TouchableOpacity 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#7a869a" 
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
              color={acceptedTerms ? "#8da676" : "#7a869a"} 
            />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to the{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={handleSignUp} 
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.buttonText}>Creating Account...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or sign up with</Text>
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
            {socialLoading === 'google' ? 'Signing Up...' : 'Google'}
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
            {socialLoading === 'facebook' ? 'Signing Up...' : 'Facebook'}
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
      
      <Link href="/zen" asChild>
        <TouchableOpacity style={styles.guestButton}>
          <Text style={styles.guestButtonText}>Continue as Guest →</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    backgroundColor: "#f8faf9"
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40
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
    marginBottom: 30
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
  passwordStrength: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden"
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "500",
    minWidth: 40
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
    gap: 10
  },
  checkbox: {
    paddingTop: 2
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#7a869a",
    lineHeight: 16
  },
  termsLink: {
    color: "#8da676"
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
    marginBottom: 30
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
    marginBottom: 30
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