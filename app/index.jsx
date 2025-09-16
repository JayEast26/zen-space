import { Link } from 'expo-router'
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'

const AuthScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ZENSPACE
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="EMAIL ADDRESS"
        placeholderTextColor="#a0a0a0"
      />
      
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        placeholderTextColor="#a0a0a0"
        secureTextEntry
      />
      
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>
          SIGN IN
        </Text>
      </Pressable>
      
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>
          Don't have an account?
        </Text>
        <Link style={styles.link} href="/register">
          SIGN UP
        </Link>
      </View>
    </View>
  )
}

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
    backgroundColor: '#6b8e23', // Muted olive green for a natural, grounded feel
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    color: '#6b8e23', // Matching the button color for consistency
    fontWeight: '600',
    marginLeft: 5,
  },
})

export default AuthScreen