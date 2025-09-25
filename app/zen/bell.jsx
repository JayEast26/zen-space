// app/zen/bell.jsx
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration } from 'react-native';
import { Audio } from 'expo-av';

export default function MindfulBell() {
  const [isRinging, setIsRinging] = useState(false);
  const [lastRang, setLastRang] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);

  const playBell = async () => {
    try {
      setIsRinging(true);
      setLastRang(new Date());
      
      // Vibrate on ring
      Vibration.vibrate(100);

      // Load and play bell sound
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/bell.mp3')
      );
      soundRef.current = sound;
      await sound.playAsync();

      // Animation sequence
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          })
        ])
      ]).start(() => {
        setIsRinging(false);
      });

    } catch (error) {
      console.log('Error playing bell:', error);
      setIsRinging(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mindful Bell</Text>
        <Text style={styles.subtitle}>Ring for presence</Text>
      </View>
      
      <View style={styles.bellContainer}>
        {/* Ripple effects */}
        <Animated.View 
          style={[
            styles.ripple,
            { 
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.ripple,
            { 
              transform: [{ scale: scaleAnim.interpolate({
                inputRange: [1, 1.3],
                outputRange: [0.8, 1.1]
              }) }],
              opacity: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.6]
              }),
            }
          ]} 
        />

        <TouchableOpacity 
          onPress={playBell}
          disabled={isRinging}
          activeOpacity={0.9}
        >
          <View style={styles.bell}>
            <Text style={styles.bellIcon}>🔔</Text>
            <Text style={styles.bellText}>
              {isRinging ? 'Ringing...' : 'Ring Bell'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>When the bell rings:</Text>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Stop what you're doing</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Take a conscious breath</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Return to the present moment</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.lastRang}>Last rang: {formatTime(lastRang)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1a202c',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 8,
    fontWeight: '300',
  },
  bellContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fbbf24',
    opacity: 0,
  },
  bell: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  bellIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  bellText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  stepsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f59e0b',
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: '600',
    marginRight: 15,
  },
  stepText: {
    fontSize: 16,
    color: '#4a5568',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  lastRang: {
    fontSize: 14,
    color: '#a0aec0',
    fontStyle: 'italic',
  },
});