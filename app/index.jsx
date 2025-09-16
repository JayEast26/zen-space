import { Link } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        MY JOURNEY
      </Text>
      <Link style={styles.link} href="/goals">
        VIEW MY PATH
      </Link>
      <Link style={styles.link} href="/goals/create">
        CULTIVATE A NEW GOAL
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginVertical: 40,
    fontSize: 24,
    color: '#4a4a4a',
    letterSpacing: 2,
    fontFamily: 'System',
  },
  link: {
    marginVertical: 12,
    padding: 18,
    backgroundColor: '#e0e0e0',
    color: '#666',
    borderRadius: 25,
    width: 200,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
})

export default Home