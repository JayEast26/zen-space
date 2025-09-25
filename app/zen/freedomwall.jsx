import { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const { width } = Dimensions.get('window');

export default function FreedomWall() {
  const [thought, setThought] = useState('');
  const [mood, setMood] = useState('neutral');
  const [posts, setPosts] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const moods = [
    { id: 'angry', emoji: '😠', color: '#f56565', name: 'Angry' },
    { id: 'sad', emoji: '😢', color: '#4299e1', name: 'Sad' },
    { id: 'neutral', emoji: '😐', color: '#a0aec0', name: 'Neutral' },
    { id: 'happy', emoji: '😊', color: '#48bb78', name: 'Happy' },
    { id: 'excited', emoji: '😄', color: '#ed8936', name: 'Excited' }
  ];

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadPosts();
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert('Error', 'Failed to load Freedom Wall');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadPosts = () => {
    return new Promise((resolve, reject) => {
      try {
        const q = query(
          collection(db, 'freedomwall'), 
          orderBy('timestamp', 'desc'), 
          limit(50)
        );
        
        const unsubscribe = onSnapshot(q, 
          (querySnapshot) => {
            const postsData = [];
            querySnapshot.forEach((doc) => {
              postsData.push({ id: doc.id, ...doc.data() });
            });
            setPosts(postsData);
            resolve(postsData);
          },
          (error) => {
            console.error('Snapshot error:', error);
            reject(error);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error loading posts:', error);
        reject(error);
      }
    });
  };

  const submitThought = async () => {
    if (!thought.trim()) {
      Alert.alert('Empty Thought', 'Please write something before posting');
      return;
    }

    if (thought.trim().length < 2) {
      Alert.alert('Too Short', 'Please write at least 2 characters');
      return;
    }

    setIsPosting(true);
    try {
      await addDoc(collection(db, 'freedomwall'), {
        text: thought.trim(),
        mood: mood,
        timestamp: new Date(),
        emoji: moods.find(m => m.id === mood)?.emoji || '😐'
      });

      setThought('');
      setMood('neutral');
      Alert.alert('Posted!', 'Your thought has been shared with the world 🌎');
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'Failed to post your thought. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading Freedom Wall...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Freedom Wall</Text>
          <Text style={styles.subtitle}>Express yourself freely and anonymously</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind? Share your thoughts, feelings, or rants..."
            placeholderTextColor="#a0aec0"
            value={thought}
            onChangeText={setThought}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          
          <Text style={styles.charCount}>{thought.length}/500</Text>

          {/* Mood Selection */}
          <Text style={styles.moodLabel}>How are you feeling?</Text>
          <View style={styles.moodContainer}>
            {moods.map((moodItem) => (
              <TouchableOpacity
                key={moodItem.id}
                style={[
                  styles.moodButton,
                  { 
                    backgroundColor: mood === moodItem.id ? moodItem.color : '#f7fafc',
                    borderColor: moodItem.color
                  }
                ]}
                onPress={() => setMood(moodItem.id)}
              >
                <Text style={[
                  styles.moodEmoji,
                  { color: mood === moodItem.id ? 'white' : moodItem.color }
                ]}>
                  {moodItem.emoji}
                </Text>
                <Text style={[
                  styles.moodText,
                  { color: mood === moodItem.id ? 'white' : moodItem.color }
                ]}>
                  {moodItem.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.postButton,
              { 
                backgroundColor: thought.trim() && !isPosting ? '#667eea' : '#cbd5e0',
                opacity: thought.trim() && !isPosting ? 1 : 0.7
              }
            ]}
            onPress={submitThought}
            disabled={!thought.trim() || isPosting || thought.trim().length < 2}
          >
            <Text style={styles.postButtonText}>
              {isPosting ? 'Posting...' : 'Post to Freedom Wall'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts Section */}
        <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.postsTitle}>Recent Expressions ({posts.length})</Text>
          
          {posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💭</Text>
              <Text style={styles.emptyText}>No thoughts yet. Be the first to share!</Text>
            </View>
          ) : (
            posts.map((post) => (
              <View 
                key={post.id} 
                style={[
                  styles.postCard,
                  { 
                    backgroundColor: moods.find(m => m.id === post.mood)?.color + '15',
                    borderLeftColor: moods.find(m => m.id === post.mood)?.color,
                  }
                ]}
              >
                <View style={styles.postHeader}>
                  <Text style={styles.postMood}>{post.emoji}</Text>
                  <Text style={styles.postTime}>{formatTime(post.timestamp)}</Text>
                </View>
                <Text style={styles.postText}>{post.text}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#718096',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '300',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  textInput: {
    minHeight: 100,
    fontSize: 16,
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 15,
    padding: 15,
    textAlignVertical: 'top',
    backgroundColor: '#f8fafc',
  },
  charCount: {
    textAlign: 'right',
    color: '#a0aec0',
    fontSize: 12,
    marginTop: 5,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginTop: 20,
    marginBottom: 15,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postButton: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postMood: {
    fontSize: 20,
  },
  postTime: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '500',
  },
  postText: {
    fontSize: 15,
    color: '#4a5568',
    lineHeight: 22,
  },
});