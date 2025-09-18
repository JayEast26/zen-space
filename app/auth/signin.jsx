import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/goals"); // go to goals after login
    } catch (e) {
      Alert.alert("Login failed", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 🌱</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/auth/signup")}>
        <Text style={styles.linkText}>Don’t have an account? Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f7fa", padding: 20 },
  title: { fontSize: 28, marginBottom: 30, fontWeight: "bold", color: "#2e3b4e" },
  input: { width: "100%", padding: 14, borderRadius: 10, backgroundColor: "#fff", marginBottom: 12, borderWidth: 1, borderColor: "#ddd" },
  button: { width: "100%", padding: 16, backgroundColor: "#81c784", borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  linkText: { marginTop: 20, color: "#2e3b4e" },
});
